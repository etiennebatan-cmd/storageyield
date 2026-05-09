import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/demo-mode";
import { createServerComponentClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

const links = [
  ["/app/decisions", "Decision Inbox"],
  ["/app/control-room", "Revenue Control Room"],
  ["/app/market-radar", "Market Radar"],
  ["/app/pricing-lab", "Pricing Lab"],
  ["/app/campaigns", "Campaign Playbooks"],
  ["/app/booking-conversion", "Booking Conversion"],
  ["/app/impact-report", "Impact Report"],
  ["/app/data-integrations", "Data & Integrations"]
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = headers();
  const demoMode = isDemoMode() || requestHeaders.get("x-storageyield-demo") === "1";

  if (!demoMode) {
    if (!hasSupabaseServerEnv()) redirect("/login?error=Supabase%20is%20not%20configured%20for%20production%20mode.");
    const supabase = createServerComponentClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) redirect("/login?next=/app/decisions");

    const { data: memberships, error } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userData.user.id)
      .limit(1);
    if (!error && !(memberships ?? []).length) redirect("/onboarding");
  }

  const hrefFor = (href: string) => (demoMode ? `${href}?demo=1` : href);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-5 md:grid-cols-[248px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-5 md:h-[calc(100vh-40px)]">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">StorageYield</h2>
          <p className="mb-5 text-lg font-semibold text-slate-950">Revenue OS</p>
          <nav className="grid grid-cols-2 gap-1 text-sm md:block md:space-y-1">
            {links.map(([href, label]) => (
              <Link key={href} href={hrefFor(href)} className="block rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950 active:translate-y-0">
                {label}
              </Link>
            ))}
          </nav>
          {demoMode ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              Demo workspace enabled.
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Production workspace connected through Supabase.
            </div>
          )}
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
