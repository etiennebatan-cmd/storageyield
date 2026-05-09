import { NextResponse } from "next/server";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { bookingStatusSchema } from "@/lib/validators/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: booking } = await supabase
    .from("booking_requests")
    .select("id,organization_id,facility_id,unit_type_id")
    .eq("id", parsed.data.booking_id)
    .in("organization_id", organizationIds)
    .single();
  if (!booking) return NextResponse.json({ error: "Booking access required" }, { status: 403 });

  if (parsed.data.selected_unit_id) {
    const { data: unit } = await supabase
      .from("units")
      .select("id,facility_id,unit_type_id")
      .eq("id", parsed.data.selected_unit_id)
      .single();
    if (!unit || unit.facility_id !== booking.facility_id || unit.unit_type_id !== booking.unit_type_id) {
      return NextResponse.json({ error: "Selected unit must belong to the booking facility and unit type" }, { status: 400 });
    }
  }

  const { error } = await supabase
    .rpc("update_booking_status", {
      p_booking_id: parsed.data.booking_id,
      p_status: parsed.data.status,
      p_selected_unit_id: parsed.data.selected_unit_id ?? null,
      p_quoted_monthly_rate: parsed.data.quoted_monthly_rate ?? null
    });
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === "P0001" ? 400 : 500 });
  return NextResponse.json({ ok: true });
}
