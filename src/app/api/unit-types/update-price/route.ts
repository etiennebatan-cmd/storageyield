import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  unit_type_id: z.string().uuid(),
  current_street_rate_monthly: z.number().nonnegative()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: unitType, error: lookupError } = await supabase
    .from("unit_types")
    .select("id,facility_id,current_street_rate_monthly,facilities(id,organization_id)")
    .eq("id", parsed.data.unit_type_id)
    .single();
  if (lookupError || !unitType) return NextResponse.json({ error: "Unit type not found" }, { status: 404 });

  const facility = Array.isArray(unitType.facilities) ? unitType.facilities[0] : unitType.facilities;
  const organizationId = facility?.organization_id;
  if (!organizationId) return NextResponse.json({ error: "Facility not found" }, { status: 404 });

  const { data: membership } = await supabase
    .from("organization_members")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("user_id", userData.user.id)
    .single();
  if (!membership) return NextResponse.json({ error: "Organization access required" }, { status: 403 });

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
