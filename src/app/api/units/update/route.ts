import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { unitUpdateSchema } from "@/lib/validators/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = unitUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const patch: Record<string, unknown> = {};
  if (parsed.data.status) patch.status = parsed.data.status;
  if ("current_rent_monthly" in parsed.data) patch.current_rent_monthly = parsed.data.current_rent_monthly;
  if (!Object.keys(patch).length) return NextResponse.json({ error: "No update provided" }, { status: 400 });

  const { data: unit, error: unitLookupError } = await supabase
    .from("units")
    .select("id,facility_id")
    .eq("id", parsed.data.unit_id)
    .single();
  if (unitLookupError || !unit) return NextResponse.json({ error: "Unit not found" }, { status: 404 });

  const { data: facility, error: facilityLookupError } = await supabase
    .from("facilities")
    .select("id,organization_id")
    .eq("id", unit.facility_id)
    .single();
  if (facilityLookupError || !facility) return NextResponse.json({ error: "Facility not found" }, { status: 404 });

  const { error } = await supabase.from("units").update(patch).eq("id", parsed.data.unit_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (parsed.data.status) {
    await supabase.from("events").insert({
      organization_id: facility.organization_id,
      facility_id: facility.id,
      entity_type: "unit",
      entity_id: parsed.data.unit_id,
      event_type: "unit_status_changed",
      payload: { status: parsed.data.status }
    });
  }
  if ("current_rent_monthly" in parsed.data) {
    await supabase.from("events").insert({
      organization_id: facility.organization_id,
      facility_id: facility.id,
      entity_type: "unit",
      entity_id: parsed.data.unit_id,
      event_type: "unit_rent_changed",
      payload: { current_rent_monthly: parsed.data.current_rent_monthly }
    });
  }
  return NextResponse.json({ ok: true });
}
