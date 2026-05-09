import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const relationshipWeights = {
  direct: 1,
  partial: 0.5,
  benchmark: 0,
  ignored: 0
};

const schema = z.object({
  facility_id: z.string().uuid(),
  competitor_id: z.string().uuid(),
  relationship_type: z.enum(["direct", "partial", "benchmark", "ignored"]),
  influence_weight: z.number().min(0).max(1).optional(),
  distance_km: z.number().nonnegative().nullable().optional(),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const [{ data: facility }, { data: competitor }] = await Promise.all([
    supabase.from("facilities").select("id").eq("id", parsed.data.facility_id).in("organization_id", organizationIds).single(),
    supabase.from("competitors").select("id").eq("id", parsed.data.competitor_id).in("organization_id", organizationIds).single()
  ]);
  if (!facility || !competitor) return NextResponse.json({ error: "Organization access required" }, { status: 403 });

  const { error } = await supabase.from("facility_competitors").upsert(
    {
      facility_id: parsed.data.facility_id,
      competitor_id: parsed.data.competitor_id,
      relationship_type: parsed.data.relationship_type,
      influence_weight: parsed.data.influence_weight ?? relationshipWeights[parsed.data.relationship_type],
      distance_km: parsed.data.distance_km ?? null,
      notes: parsed.data.notes || null
    },
    { onConflict: "facility_id,competitor_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
