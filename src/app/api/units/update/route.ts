import { NextResponse } from "next/server";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { unitUpdateSchema } from "@/lib/validators/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = unitUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

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
    .in("organization_id", organizationIds)
    .single();
  if (facilityLookupError || !facility) return NextResponse.json({ error: "Organization access required" }, { status: 403 });

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
