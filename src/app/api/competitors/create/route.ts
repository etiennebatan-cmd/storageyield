import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const relationshipWeights = {
  direct: 1,
  partial: 0.5,
  benchmark: 0,
  ignored: 0
};

const schema = z.object({
  facility_id: z.string().uuid(),
  name: z.string().min(2),
  website_url: z.string().url().optional().or(z.literal("")),
  pricing_url: z.string().url().optional().or(z.literal("")),
  city: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  relationship_type: z.enum(["direct", "partial", "benchmark", "ignored"]).default("direct"),
  influence_weight: z.number().min(0).max(1).optional(),
  distance_km: z.number().nonnegative().nullable().optional(),
  relationship_notes: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: facility, error: facilityError } = await supabase
    .from("facilities")
    .select("id,organization_id")
    .eq("id", parsed.data.facility_id)
    .in("organization_id", organizationIds)
    .single();
  if (facilityError || !facility) return NextResponse.json({ error: "Facility access required" }, { status: 403 });

  const { data: competitor, error: competitorError } = await supabase
    .from("competitors")
    .insert({
      organization_id: facility.organization_id,
      name: parsed.data.name.trim(),
      website_url: parsed.data.website_url || null,
      pricing_url: parsed.data.pricing_url || null,
      city: parsed.data.city || null,
      address: parsed.data.address || null,
      notes: parsed.data.notes || null
    })
    .select("*")
    .single();
  if (competitorError || !competitor) return NextResponse.json({ error: competitorError?.message ?? "Failed to create competitor" }, { status: 500 });

  const { error: relationshipError } = await supabase.from("facility_competitors").insert({
    facility_id: facility.id,
    competitor_id: competitor.id,
    relationship_type: parsed.data.relationship_type,
    influence_weight: parsed.data.influence_weight ?? relationshipWeights[parsed.data.relationship_type],
    distance_km: parsed.data.distance_km ?? null,
    notes: parsed.data.relationship_notes || null
  });
  if (relationshipError) {
    await supabase.from("competitors").delete().eq("id", competitor.id);
    return NextResponse.json({ error: relationshipError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, competitor_id: competitor.id, competitor });
}
