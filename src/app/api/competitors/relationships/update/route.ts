import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

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
