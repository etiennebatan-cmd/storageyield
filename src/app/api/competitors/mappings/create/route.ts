import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  facility_id: z.string().uuid(),
  own_unit_type_id: z.string().uuid(),
  competitor_id: z.string().uuid(),
  competitor_unit_type_id: z.string().uuid(),
  comparability_score: z.number().min(0.1).max(1.5).default(1),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const [{ data: ownUnitType }, { data: competitorUnitType }] = await Promise.all([
    supabase.from("unit_types").select("id,facility_id").eq("id", parsed.data.own_unit_type_id).eq("facility_id", parsed.data.facility_id).single(),
    supabase.from("competitor_unit_types").select("id,competitor_id").eq("id", parsed.data.competitor_unit_type_id).eq("competitor_id", parsed.data.competitor_id).single()
  ]);
  if (!ownUnitType || !competitorUnitType) return NextResponse.json({ error: "Unit mapping does not match this facility and competitor" }, { status: 400 });

  const { data, error } = await supabase.from("competitor_unit_mappings").upsert(
    {
      facility_id: parsed.data.facility_id,
      own_unit_type_id: parsed.data.own_unit_type_id,
      competitor_id: parsed.data.competitor_id,
      competitor_unit_type_id: parsed.data.competitor_unit_type_id,
      comparability_score: parsed.data.comparability_score,
      notes: parsed.data.notes || null
    },
    { onConflict: "facility_id,own_unit_type_id,competitor_unit_type_id" }
  ).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mapping: data });
}
