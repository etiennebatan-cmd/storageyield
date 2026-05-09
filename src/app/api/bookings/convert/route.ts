import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const schema = z.object({
  booking_id: z.string().uuid(),
  unit_id: z.string().uuid(),
  rent: z.number().nonnegative().optional(),
  tenant_type: z.enum(["private", "business", "unknown"]).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: booking, error: bookingError } = await supabase
    .from("booking_requests")
    .select("id,organization_id,facility_id,unit_type_id,customer_name,customer_type,quoted_monthly_rate")
    .eq("id", parsed.data.booking_id)
    .in("organization_id", organizationIds)
    .single();
  if (bookingError || !booking) return NextResponse.json({ error: "Booking access required" }, { status: 403 });

  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("id,facility_id,unit_type_id,status")
    .eq("id", parsed.data.unit_id)
    .single();
  if (unitError || !unit) return NextResponse.json({ error: "Unit not found" }, { status: 404 });
  if (unit.facility_id !== booking.facility_id || unit.unit_type_id !== booking.unit_type_id) {
    return NextResponse.json({ error: "Selected unit must belong to the booking facility and unit type" }, { status: 400 });
  }

  const rent = parsed.data.rent ?? Number(booking.quoted_monthly_rate ?? 0);
  const tenantType = parsed.data.tenant_type ?? booking.customer_type ?? "unknown";
  const today = new Date().toISOString().slice(0, 10);

  const { error: unitUpdateError } = await supabase
    .from("units")
    .update({
      status: "occupied",
      current_rent_monthly: rent,
      tenant_start_date: today,
      current_tenant_type: tenantType
    })
    .eq("id", parsed.data.unit_id);
  if (unitUpdateError) return NextResponse.json({ error: unitUpdateError.message }, { status: 500 });

  const { data: updatedBooking, error: bookingUpdateError } = await supabase
    .from("booking_requests")
    .update({
      status: "converted",
      selected_unit_id: parsed.data.unit_id,
      quoted_monthly_rate: rent,
      updated_at: new Date().toISOString()
    })
    .eq("id", parsed.data.booking_id)
    .select("*")
    .single();
  if (bookingUpdateError) return NextResponse.json({ error: bookingUpdateError.message }, { status: 500 });

  await supabase.from("events").insert({
    organization_id: booking.organization_id,
    facility_id: booking.facility_id,
    entity_type: "booking_request",
    entity_id: booking.id,
    event_type: "booking_converted",
    payload: { selected_unit_id: parsed.data.unit_id, rent, tenant_type: tenantType }
  });

  return NextResponse.json({ ok: true, booking: updatedBooking });
}
