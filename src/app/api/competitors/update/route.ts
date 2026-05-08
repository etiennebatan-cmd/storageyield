import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  competitor_id: z.string().uuid(),
  name: z.string().min(2).optional(),
  website_url: z.string().url().optional().or(z.literal("")),
  pricing_url: z.string().url().optional().or(z.literal("")),
  city: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const update: Record<string, string | null> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name.trim();
  if (parsed.data.website_url !== undefined) update.website_url = parsed.data.website_url || null;
  if (parsed.data.pricing_url !== undefined) update.pricing_url = parsed.data.pricing_url || null;
  if (parsed.data.city !== undefined) update.city = parsed.data.city || null;
  if (parsed.data.address !== undefined) update.address = parsed.data.address || null;
  if (parsed.data.notes !== undefined) update.notes = parsed.data.notes || null;
  if (parsed.data.status !== undefined) update.status = parsed.data.status;

  const { error } = await supabase.from("competitors").update(update).eq("id", parsed.data.competitor_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
