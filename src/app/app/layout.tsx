import Link from "next/link";

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
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-5 md:grid-cols-[248px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-5 md:h-[calc(100vh-40px)]">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">StorageYield</h2>
          <p className="mb-5 text-lg font-semibold text-slate-950">Revenue OS</p>
          <nav className="grid grid-cols-2 gap-1 text-sm md:block md:space-y-1">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="block rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950 active:translate-y-0">
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Production routes use Supabase. Add <code>?demo=1</code> to open a demo workspace.
          </div>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
