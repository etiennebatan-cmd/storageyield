import type { Metadata } from "next";
import { OnboardingSetupForm } from "@/components/app/onboarding-setup-form";
import { createServerComponentClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Onboarding | StorageYield",
  robots: {
    index: false,
    follow: false
  }
};

export default async function OnboardingPage({ searchParams }: { searchParams?: { demo?: string } }) {
  const demoMode = isDemoMode() || searchParams?.demo === "1";
  if (!demoMode) {
    if (!hasSupabaseServerEnv()) redirect("/login?error=Supabase%20is%20not%20configured%20for%20production%20mode.");
    const supabase = createServerComponentClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) redirect("/login?next=/onboarding");
    const { data: memberships } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", data.user.id)
      .limit(1);
    if ((memberships ?? []).length) redirect("/app/data-integrations");
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-7 px-5 py-10 xl:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Operator setup</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Launch your revenue control loop</h1>
        <p className="mt-2 max-w-3xl text-lg text-slate-600">Create the workspace, add inventory and competitors, install the booking widget, then review the first revenue action.</p>
      </div>
      <OnboardingSetupForm demoMode={demoMode} />
    </main>
  );
}
