import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";

const links = [
  ["/app", "Action Center"],
  ["/app/onboarding", "Onboarding"],
  ["/app/bookings", "Bookings"],
  ["/app/units-pricing", "Units & Pricing"],
  ["/app/competitors", "Competitors"],
  ["/app/campaigns", "Campaigns"],
  ["/app/signals", "Signals"],
  ["/app/reports", "Reports"],
  ["/app/settings", "Settings"]
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isDemoMode()) {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      redirect("/login");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-5 md:grid-cols-[248px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-5 md:h-[calc(100vh-40px)]">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">StorageYield</h2>
          <p className="mb-5 text-lg font-semibold text-slate-950">Operator cockpit</p>
          <nav className="grid grid-cols-2 gap-1 text-sm md:block md:space-y-1">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="block rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950 active:translate-y-0">
                {label}
              </Link>
            ))}
          </nav>
          {isDemoMode() ? <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">Demo workspace enabled</div> : null}
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
