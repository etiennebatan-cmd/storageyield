import { NextResponse } from "next/server";
import { z } from "zod";
import { createRouteHandlerClient } from "@/lib/supabase/server";

type OnboardingResult = {
  organization_id: string;
  facility_id: string;
};

const unitTypeSchema = z.object({
  client_id: z.string().min(1),
  name: z.string().min(2),
  size_m2: z.number().positive(),
  current_street_rate_monthly: z.number().nonnegative(),
  description: z.string().optional().nullable()
});

const unitBatchSchema = z.object({
  client_unit_type_id: z.string().min(1),
  count: z.number().int().min(0).max(300),
  prefix: z.string().min(1).max(24),
  status: z.enum(["available", "occupied", "reserved", "maintenance", "unavailable"]).default("available")
});

const competitorSchema = z.object({
  name: z.string().min(2),
  pricing_url: z.string().url().optional().or(z.literal("")),
  relationship_type: z.enum(["direct", "partial", "benchmark", "ignored"]).default("direct")
});

const schema = z.object({
  organization_name: z.string().min(2),
  facility_name: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  public_slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  unit_types: z.array(unitTypeSchema).min(1).max(20),
  unit_batches: z.array(unitBatchSchema).min(1).max(50),
  competitors: z.array(competitorSchema).max(10).default([])
});

const relationshipWeights = {
  direct: 1,
  partial: 0.5,
  benchmark: 0,
  ignored: 0
};

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createRouteHandlerClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: existingMemberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userData.user.id)
    .limit(1);
  if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 500 });
  if ((existingMemberships ?? []).length) {
    return NextResponse.json({ error: "This user already has an organization." }, { status: 409 });
  }

  const { data, error } = await supabase
    .rpc("setup_operator_onboarding", {
      p_organization_name: parsed.data.organization_name,
      p_facility_name: parsed.data.facility_name,
      p_address: parsed.data.address,
      p_city: parsed.data.city,
      p_country: parsed.data.country,
      p_public_slug: parsed.data.public_slug
    })
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === "23505" ? 409 : 500 });

  const result = data as OnboardingResult | null;
  if (!result) return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  const cleanup = async () => {
    await supabase.from("organizations").delete().eq("id", result.organization_id);
  };

  const unitTypeRows = parsed.data.unit_types.map((unitType) => ({
    facility_id: result.facility_id,
    name: unitType.name.trim(),
    size_m2: unitType.size_m2,
    current_street_rate_monthly: unitType.current_street_rate_monthly,
    description: unitType.description ?? null
  }));

  const { data: insertedUnitTypes, error: unitTypeError } = await supabase
    .from("unit_types")
    .insert(unitTypeRows)
    .select("id,name,size_m2,current_street_rate_monthly");
  if (unitTypeError || !insertedUnitTypes) {
    await cleanup();
    return NextResponse.json({ error: unitTypeError?.message ?? "Could not create unit types" }, { status: 500 });
  }

  const clientToInsertedUnitType = new Map<string, string>();
  parsed.data.unit_types.forEach((unitType, index) => {
    const inserted = insertedUnitTypes[index];
    if (inserted) clientToInsertedUnitType.set(unitType.client_id, inserted.id as string);
  });

  const unitRows = parsed.data.unit_batches.flatMap((batch) => {
    const unitTypeId = clientToInsertedUnitType.get(batch.client_unit_type_id);
    if (!unitTypeId || batch.count === 0) return [];
    return Array.from({ length: batch.count }).map((_, index) => ({
      facility_id: result.facility_id,
      unit_type_id: unitTypeId,
      unit_code: `${batch.prefix}-${String(index + 1).padStart(3, "0")}`,
      status: batch.status
    }));
  });

  if (unitRows.length) {
    const { error: unitsError } = await supabase.from("units").insert(unitRows);
    if (unitsError) {
      await cleanup();
      return NextResponse.json({ error: unitsError.message }, { status: 500 });
    }
  }

  const competitorRows = parsed.data.competitors
    .filter((competitor) => competitor.name.trim())
    .map((competitor) => ({
      organization_id: result.organization_id,
      name: competitor.name.trim(),
      pricing_url: competitor.pricing_url || null,
      city: parsed.data.city,
      country: parsed.data.country
    }));

  let insertedCompetitors: Array<{ id: string; name: string }> = [];
  if (competitorRows.length) {
    const { data: competitorData, error: competitorError } = await supabase
      .from("competitors")
      .insert(competitorRows)
      .select("id,name");
    if (competitorError || !competitorData) {
      await cleanup();
      return NextResponse.json({ error: competitorError?.message ?? "Could not create competitors" }, { status: 500 });
    }
    insertedCompetitors = competitorData as Array<{ id: string; name: string }>;

    const relationshipRows = insertedCompetitors.map((competitor, index) => {
      const relationshipType = parsed.data.competitors[index]?.relationship_type ?? "direct";
      return {
        facility_id: result.facility_id,
        competitor_id: competitor.id,
        relationship_type: relationshipType,
        influence_weight: relationshipWeights[relationshipType]
      };
    });
    const { error: relationshipError } = await supabase.from("facility_competitors").insert(relationshipRows);
    if (relationshipError) {
      await cleanup();
      return NextResponse.json({ error: relationshipError.message }, { status: 500 });
    }
  }

  await supabase.from("events").insert({
    organization_id: result.organization_id,
    facility_id: result.facility_id,
    entity_type: "facility",
    entity_id: result.facility_id,
    event_type: "onboarding_completed",
    payload: {
      unit_types_created: insertedUnitTypes.length,
      units_created: unitRows.length,
      competitors_created: insertedCompetitors.length
    }
  });

  return NextResponse.json({
    ok: true,
    organization_id: result.organization_id,
    facility_id: result.facility_id,
    unit_type_count: insertedUnitTypes.length,
    unit_count: unitRows.length,
    competitor_count: insertedCompetitors.length
  });
}
