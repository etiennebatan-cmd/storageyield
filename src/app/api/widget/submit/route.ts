import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { widgetBookingSchema } from "@/lib/validators/widget";
import { demoFacilities, demoUnitTypes } from "@/lib/demo-data";

type WidgetBookingResult = {
  lead_id: string;
  booking_id: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = widgetBookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const demoFacility = demoFacilities.find((facility) => facility.id === parsed.data.facility_id);
  const demoUnitType = demoUnitTypes.find((unitType) => unitType.id === parsed.data.unit_type_id);
  if (demoFacility && demoUnitType?.facility_id === demoFacility.id) {
    return NextResponse.json({
      ok: true,
      lead_id: `demo-lead-${Date.now()}`,
      booking_id: `demo-booking-${Date.now()}`
    });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("submit_widget_booking", {
      p_facility_id: parsed.data.facility_id,
      p_unit_type_id: parsed.data.unit_type_id,
      p_customer_name: parsed.data.customer_name,
      p_customer_email: parsed.data.customer_email,
      p_customer_phone: parsed.data.customer_phone ?? null,
      p_customer_type: parsed.data.customer_type,
      p_preferred_move_in_date: parsed.data.preferred_move_in_date ?? null,
      p_message: parsed.data.message ?? null
    })
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === "P0001" ? 400 : 500 });
  const result = data as WidgetBookingResult | null;
  if (!result) return NextResponse.json({ error: "Booking request failed" }, { status: 500 });

  return NextResponse.json({ ok: true, lead_id: result.lead_id, booking_id: result.booking_id });
}
