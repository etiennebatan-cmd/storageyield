import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
}

function loginRedirect(request: NextRequest, response: NextResponse, message?: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  if (message) url.searchParams.set("error", message);
  const redirect = NextResponse.redirect(url);
  copyResponseCookies(response, redirect);
  return redirect;
}

function onboardingRedirect(request: NextRequest, response: NextResponse) {
  const redirect = NextResponse.redirect(new URL("/onboarding", request.url));
  copyResponseCookies(response, redirect);
  return redirect;
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const forceDemo = process.env.NEXT_PUBLIC_STORAGEYIELD_FORCE_DEMO === "true";
  const demoMode = forceDemo || request.nextUrl.searchParams.get("demo") === "1";
  if (demoMode) requestHeaders.set("x-storageyield-demo", "1");

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const pathname = request.nextUrl.pathname;
  const isAppRoute = pathname === "/app" || pathname.startsWith("/app/");
  const isOnboardingRoute = pathname === "/onboarding";
  const isApiRoute = pathname.startsWith("/api/");

  if (!isSupabaseConfigured()) {
    if (isAppRoute && !demoMode) {
      return loginRedirect(request, response, "Supabase is not configured for production mode.");
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (isApiRoute) return response;
  if (isAppRoute && demoMode) return response;

  if ((isAppRoute || isOnboardingRoute) && !user) {
    return loginRedirect(request, response);
  }

  if (isAppRoute && user) {
    const { data: memberships, error } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1);

    if (!error && !(memberships ?? []).length) return onboardingRedirect(request, response);
    if (!error) {
      requestHeaders.set("x-storageyield-authenticated", "1");
      const previousResponse = response;
      response = NextResponse.next({ request: { headers: requestHeaders } });
      copyResponseCookies(previousResponse, response);
    }
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/onboarding", "/api/:path*"]
};
