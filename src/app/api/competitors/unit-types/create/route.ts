import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  competitor_id: z.string().uuid(),
  name: z.string().min(1),
  size_m2: z.number().positive().nullable().optional(),
  volume_m3: z.number().positive().nullable().optional(),
  access_type: z.string().optional(),
  climate_controlled: z.boolean().nullable().optional(),
  floor: z.string().optional(),
  description: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal(""))
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data, error } = await supabase.from("competitor_unit_types").insert({
    competitor_id: parsed.data.competitor_id,
    name: parsed.data.name.trim(),
    size_m2: parsed.data.size_m2 ?? null,
    volume_m3: parsed.data.volume_m3 ?? null,
    access_type: parsed.data.access_type || null,
    climate_controlled: parsed.data.climate_controlled ?? null,
    floor: parsed.data.floor || null,
    description: parsed.data.description || null,
    source_url: parsed.data.source_url || null
  }).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, competitor_unit_type: data });
}
