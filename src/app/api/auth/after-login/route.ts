import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import { getOrganizationIdsForUser, upsertUserProfile } from "@/lib/server/user-profile";

export async function POST() {
  try {
    const supabase = createRouteHandlerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: userError?.message ?? "Authentication required" }, { status: 401 });
    }

    await upsertUserProfile(supabase, userData.user);
    const organizationIds = await getOrganizationIdsForUser(supabase, userData.user.id);
    const onboardingRequired = organizationIds.length === 0;

    return NextResponse.json({
      ok: true,
      onboarding_required: onboardingRequired,
      organization_ids: organizationIds,
      redirect_to: onboardingRequired ? "/onboarding" : "/app/decisions"
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Post-login setup failed" }, { status: 500 });
  }
}
