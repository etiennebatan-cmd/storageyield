import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { leadStatusSchema } from "@/lib/validators/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: lead, error: leadLookupError } = await supabase
    .from("leads")
    .select("id,organization_id,facility_id")
    .eq("id", parsed.data.lead_id)
    .single();
  if (leadLookupError || !lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const { error } = await supabase.from("leads").update({ status: parsed.data.status }).eq("id", parsed.data.lead_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("events").insert({
    organization_id: lead.organization_id,
    facility_id: lead.facility_id,
    entity_type: "lead",
    entity_id: parsed.data.lead_id,
    event_type: "lead_status_changed",
    payload: { status: parsed.data.status }
  });

  return NextResponse.json({ ok: true });
}
