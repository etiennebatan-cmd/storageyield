import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import { getOrganizationIdsForUser, upsertUserProfile } from "@/lib/server/user-profile";

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code) return redirectWithError(request, "Missing authentication code. Please log in again.");

  try {
    const supabase = createRouteHandlerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return redirectWithError(request, error.message);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return redirectWithError(request, userError?.message ?? "Could not load confirmed user.");

    await upsertUserProfile(supabase, userData.user);
    const organizationIds = await getOrganizationIdsForUser(supabase, userData.user.id);

    const target = organizationIds.length ? "/app/decisions" : "/onboarding";
    return NextResponse.redirect(new URL(target, request.url));
  } catch (error) {
    return redirectWithError(request, error instanceof Error ? error.message : "Authentication callback failed.");
  }
}
