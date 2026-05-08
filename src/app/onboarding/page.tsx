import { OnboardingSetupForm } from "@/components/app/onboarding-setup-form";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const demoMode = isDemoMode();
  if (!demoMode) {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) redirect("/login");
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
