import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { loadOperatingData } from "@/lib/server/load-operating-data";
import { generateSignalsFromSnapshot } from "@/lib/signals/generate-signals";

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
    const generated = generateSignalsFromSnapshot(data);
    const organizationId = parsed.data.organization_id ?? access.organizationIds[0];
    if (!generated.length) return NextResponse.json({ ok: true, signals: [] });

    const existingTitles = new Set(
      (
        await access.supabase
          .from("signals")
          .select("title")
          .in("organization_id", access.organizationIds)
          .in("title", generated.map((signal) => signal.title))
      ).data?.map((signal) => signal.title as string) ?? []
    );

    const rows = generated
      .filter((signal) => !existingTitles.has(signal.title))
      .map((signal) => ({
        organization_id: organizationId,
        facility_id: signal.facility_id,
        unit_type_id: signal.unit_type_id,
        title: signal.title,
        description: signal.description,
        category: signal.category,
        severity: signal.severity,
        evidence: { ...signal.evidence, summary: signal.description },
        status: "new"
      }));

    if (!rows.length) return NextResponse.json({ ok: true, signals: [] });
    const { data: inserted, error } = await access.supabase.from("signals").insert(rows).select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, signals: inserted ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Signal generation failed" }, { status: 500 });
  }
}
