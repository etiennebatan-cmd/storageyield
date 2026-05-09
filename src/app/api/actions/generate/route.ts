import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { loadOperatingData } from "@/lib/server/load-operating-data";
import { generateSignalsFromSnapshot } from "@/lib/signals/generate-signals";
import { generateActionsFromSignals } from "@/lib/actions/generate-actions";

const schema = z.object({
  organization_id: z.string().uuid().optional(),
  facility_id: z.string().uuid().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireOrganizationAccess(parsed.data.organization_id);
  if ("error" in access) return access.error;

  try {
    const data = await loadOperatingData({
      supabase: access.supabase,
      organizationIds: access.organizationIds,
      facilityId: parsed.data.facility_id
    });
    const generatedSignals = generateSignalsFromSnapshot(data);
    const generatedActions = generateActionsFromSignals({
      unitTypes: data.unitTypes,
      units: data.units,
      bookings: data.bookings,
      signals: generatedSignals
    });

    const organizationId = parsed.data.organization_id ?? access.organizationIds[0];

    const generationKeys = Array.from(new Set(generatedActions.map((action) => action.generation_key)));
    const proposedQuery = access.supabase
      .from("actions")
      .select("id,generation_key")
      .in("organization_id", access.organizationIds)
      .eq("status", "proposed")
      .eq("generated_by_engine", true);
    const { data: existingProposed, error: existingError } = parsed.data.facility_id
      ? await proposedQuery.or(`facility_id.eq.${parsed.data.facility_id},facility_id.is.null`)
      : await proposedQuery;
    if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });

    const existingByKey = new Map((existingProposed ?? []).filter((row) => row.generation_key).map((row) => [row.generation_key as string, row.id as string]));
    const staleIds = (existingProposed ?? [])
      .filter((row) => row.generation_key && !generationKeys.includes(row.generation_key as string))
      .map((row) => row.id as string);

    if (staleIds.length) {
      const { error: staleError } = await access.supabase
        .from("actions")
        .update({ status: "dismissed", dismissed_at: new Date().toISOString(), superseded_at: new Date().toISOString() })
        .in("id", staleIds);
      if (staleError) return NextResponse.json({ error: staleError.message }, { status: 500 });
    }

    const toRow = (action: (typeof generatedActions)[number]) => ({
        organization_id: organizationId,
        facility_id: action.facility_id,
        unit_type_id: action.unit_type_id,
        booking_request_id: action.booking_request_id ?? null,
        title: action.title,
        decision_question: action.decision_question,
        description: action.description,
        exact_next_step: action.exact_next_step,
        category: action.category,
        estimated_monthly_uplift: action.expected_monthly_uplift,
        confidence: action.confidence_score,
        confidence_score: action.confidence_score,
        priority: action.priority,
        status: "proposed",
        risk_level: action.risk_level,
        recommendation: action.recommendation,
        evidence: { ...action.evidence, linked_signal_titles: action.linked_signal_titles },
        proposed_change: action.proposed_change,
        generated_by_engine: true,
        generation_key: action.generation_key,
        superseded_at: null
    });

    const touched = [];
    for (const action of generatedActions) {
      const existingId = existingByKey.get(action.generation_key);
      if (existingId) {
        const row = toRow(action);
        const { data: updated, error } = await access.supabase
          .from("actions")
          .update(row)
          .eq("id", existingId)
          .select("*")
          .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        if (updated) touched.push(updated);
      } else {
        const { data: inserted, error } = await access.supabase
          .from("actions")
          .insert(toRow(action))
          .select("*")
          .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        if (inserted) touched.push(inserted);
      }
    }

    return NextResponse.json({ ok: true, actions: touched, superseded: staleIds.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Decision generation failed" }, { status: 500 });
  }
}
