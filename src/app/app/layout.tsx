import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";

const links = [
  ["/app", "Decision Inbox"],
  ["/app/control-room", "Revenue Control Room"],
  ["/app/competitors", "Market Radar"],
  ["/app/units-pricing", "Pricing Lab"],
  ["/app/campaigns", "Campaign Playbooks"],
  ["/app/bookings", "Booking Conversion"],
  ["/app/reports", "Impact Report"],
  ["/app/settings", "Data & Integrations"]
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
    <main className="app-shell min-h-screen bg-[#f6f7f9]">
      <div className="grid gap-7 px-5 py-6 lg:grid-cols-[300px_1fr] xl:px-8">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">StorageYield</h2>
          <p className="mb-6 text-xl font-semibold text-slate-950">Revenue OS</p>
          <nav className="grid grid-cols-2 gap-1 text-sm lg:block lg:space-y-1">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="block rounded-2xl px-3 py-3 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950 active:translate-y-0">
                {label}
              </Link>
            ))}
          </nav>
          {isDemoMode() ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">Demo workspace enabled</div> : null}
        </aside>
        <section className="min-w-0 pb-12">{children}</section>
      </div>
    </main>
  );
}
