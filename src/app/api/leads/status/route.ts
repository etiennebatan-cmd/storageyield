import { NextResponse } from "next/server";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { leadStatusSchema } from "@/lib/validators/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: lead, error: leadLookupError } = await supabase
    .from("leads")
    .select("id,organization_id,facility_id")
    .eq("id", parsed.data.lead_id)
    .in("organization_id", organizationIds)
    .single();
  if (leadLookupError || !lead) return NextResponse.json({ error: "Lead access required" }, { status: 403 });

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
