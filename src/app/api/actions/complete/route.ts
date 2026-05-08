import { NextResponse } from "next/server";
import { z } from "zod";
import { requireActionAccess } from "@/lib/server/org-access";

const schema = z.object({
  action_id: z.string().uuid(),
  outcome_note: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const access = await requireActionAccess(parsed.data.action_id);
  if ("error" in access) return access.error;

  const outcome = { note: parsed.data.outcome_note ?? null, completed_at: new Date().toISOString() };
  const { data: action, error } = await access.supabase
    .from("actions")
    .update({ status: "completed", completed_at: outcome.completed_at, outcome })
    .eq("id", access.action.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await access.supabase.from("action_events").insert({
    organization_id: access.action.organization_id,
    facility_id: access.action.facility_id,
    action_id: access.action.id,
    event_type: "decision_completed",
    payload: outcome
  });
  return NextResponse.json({ ok: true, action });
}
