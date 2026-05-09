import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const schema = z.object({
  unit_type_id: z.string().uuid(),
  current_street_rate_monthly: z.number().nonnegative()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: unitType, error: lookupError } = await supabase
    .from("unit_types")
    .select("id,facility_id,current_street_rate_monthly,facilities(id,organization_id)")
    .eq("id", parsed.data.unit_type_id)
    .single();
  if (lookupError || !unitType) return NextResponse.json({ error: "Unit type not found" }, { status: 404 });

  const facility = Array.isArray(unitType.facilities) ? unitType.facilities[0] : unitType.facilities;
  const organizationId = facility?.organization_id;
  if (!organizationId || !organizationIds.includes(organizationId)) return NextResponse.json({ error: "Organization access required" }, { status: 403 });

  const oldPrice = Number(unitType.current_street_rate_monthly);
  const { data: updated, error } = await supabase
    .from("unit_types")
    .update({ current_street_rate_monthly: parsed.data.current_street_rate_monthly })
    .eq("id", parsed.data.unit_type_id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("events").insert({
    organization_id: organizationId,
    facility_id: unitType.facility_id,
    entity_type: "unit_type",
    entity_id: unitType.id,
    event_type: "unit_type_price_updated",
    payload: { old_price: oldPrice, new_price: parsed.data.current_street_rate_monthly }
  });

  return NextResponse.json({ ok: true, unit_type: updated });
}
