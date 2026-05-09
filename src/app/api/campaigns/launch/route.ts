import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const schema = z.object({
  name: z.string().min(2),
  facility_id: z.string().uuid(),
  target_unit_type_id: z.string().uuid().nullable().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  promotion_text: z.string().optional(),
  target_customer_type: z.enum(["private", "business", "student", "contractor", "archive", "e-commerce"]).default("private"),
  objective: z.enum(["fill vacancy", "boost demand", "seasonal campaign", "fill_vacancy", "boost_demand", "seasonal_campaign"]).default("boost_demand")
});

function normalizeObjective(objective: string) {
  return objective.replaceAll(" ", "_");
}

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

  if (parsed.data.target_unit_type_id) {
    const { data: unitType } = await supabase
      .from("unit_types")
      .select("id")
      .eq("id", parsed.data.target_unit_type_id)
      .eq("facility_id", facility.id)
      .single();
    if (!unitType) return NextResponse.json({ error: "Target unit type must belong to this facility" }, { status: 400 });
  }

  const startDate = parsed.data.start_date ?? new Date().toISOString().slice(0, 10);
  const endDate = parsed.data.end_date ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10);
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      organization_id: facility.organization_id,
      facility_id: facility.id,
      target_unit_type_id: parsed.data.target_unit_type_id ?? null,
      name: parsed.data.name,
      start_date: startDate,
      end_date: endDate,
      promotion_text: parsed.data.promotion_text ?? "Pilot campaign launched from StorageYield.",
      target_customer_type: parsed.data.target_customer_type,
      objective: normalizeObjective(parsed.data.objective),
      status: "active"
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("events").insert({
    organization_id: facility.organization_id,
    facility_id: facility.id,
    entity_type: "campaign",
    entity_id: campaign.id,
    event_type: "campaign_launched",
    payload: { name: campaign.name }
  });

  return NextResponse.json({ ok: true, campaign });
}
