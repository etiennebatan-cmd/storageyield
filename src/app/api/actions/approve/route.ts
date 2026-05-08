import { NextResponse } from "next/server";
import { z } from "zod";
import { requireActionAccess } from "@/lib/server/org-access";

const schema = z.object({
  action_id: z.string().uuid(),
  proposed_change: z.record(z.string(), z.unknown()).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireActionAccess(parsed.data.action_id);
  if ("error" in access) return access.error;

  const proposedChange = parsed.data.proposed_change ?? access.action.proposed_change ?? {};
  const recommendedRate = Number((proposedChange as Record<string, unknown>).recommended_rate ?? (access.action.evidence as Record<string, unknown> | null)?.recommended_rate ?? 0);
  const eventPayload: Record<string, unknown> = { proposed_change: proposedChange };

  if (access.action.category === "pricing" && access.action.unit_type_id && recommendedRate > 0) {
    const { data: unitType, error: unitTypeError } = await access.supabase
      .from("unit_types")
      .select("id,facility_id,current_street_rate_monthly")
      .eq("id", access.action.unit_type_id)
      .single();
    if (unitTypeError || !unitType) return NextResponse.json({ error: "Unit type not found" }, { status: 404 });

    const oldPrice = Number(unitType.current_street_rate_monthly);
    const { error: priceError } = await access.supabase
      .from("unit_types")
      .update({ current_street_rate_monthly: recommendedRate })
      .eq("id", access.action.unit_type_id);
    if (priceError) return NextResponse.json({ error: priceError.message }, { status: 500 });

    eventPayload.old_price = oldPrice;
    eventPayload.new_price = recommendedRate;
    const { error: eventError } = await access.supabase.from("events").insert({
      organization_id: access.action.organization_id,
      facility_id: access.action.facility_id ?? unitType.facility_id,
      entity_type: "unit_type",
      entity_id: access.action.unit_type_id,
      event_type: "unit_type_price_updated",
      payload: { action_id: access.action.id, old_price: oldPrice, new_price: recommendedRate }
    });
    if (eventError) return NextResponse.json({ error: eventError.message }, { status: 500 });
  }

  const { data: action, error } = await access.supabase
    .from("actions")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_change: proposedChange
    })
    .eq("id", access.action.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { error: actionEventError } = await access.supabase.from("action_events").insert({
    organization_id: access.action.organization_id,
    facility_id: access.action.facility_id,
    action_id: access.action.id,
    event_type: "decision_approved",
    payload: eventPayload
  });
  if (actionEventError) return NextResponse.json({ error: actionEventError.message }, { status: 500 });
  return NextResponse.json({ ok: true, action });
}
