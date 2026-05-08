import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bookingStatusSchema } from "@/lib/validators/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

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
