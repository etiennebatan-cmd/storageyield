import { NextResponse } from "next/server";
import { z } from "zod";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import { upsertUserProfile } from "@/lib/server/user-profile";

const schema = z.object({
  full_name: z.string().trim().min(1).max(120).optional().or(z.literal(""))
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const supabase = createRouteHandlerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: userError?.message ?? "Authentication required" }, { status: 401 });
    }

    const profile = await upsertUserProfile(supabase, userData.user, parsed.data.full_name || null);
    return NextResponse.json({ ok: true, user: profile });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update profile" }, { status: 500 });
  }
}
