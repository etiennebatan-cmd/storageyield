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
    if (!generatedActions.length) return NextResponse.json({ ok: true, actions: [] });

    const existingTitles = new Set(
      (
        await access.supabase
          .from("actions")
          .select("title")
          .in("organization_id", access.organizationIds)
          .in("title", generatedActions.map((action) => action.title))
          .in("status", ["proposed", "approved", "active"])
      ).data?.map((action) => action.title as string) ?? []
    );

    const rows = generatedActions
      .filter((action) => !existingTitles.has(action.title))
      .map((action) => ({
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
        proposed_change: action.proposed_change
      }));

    if (!rows.length) return NextResponse.json({ ok: true, actions: [] });
    const { data: inserted, error } = await access.supabase.from("actions").insert(rows).select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, actions: inserted ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Decision generation failed" }, { status: 500 });
  }
}
