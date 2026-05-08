import Link from "next/link";
import { ArrowRight, BellRing, CircleDollarSign, MousePointer2, Radar, TrendingUp } from "lucide-react";
import { actionCenterKpis, eur } from "@/lib/operator-demo";

const storyCards = [
  {
    title: "Competitor moved",
    copy: "BoxPlus Brussels raised comparable 3 m² pricing by 7%.",
    value: "€102",
    Icon: Radar
  },
  {
    title: "Action generated",
    copy: "StorageYield created a low-risk pricing action.",
    value: "86%",
    Icon: BellRing
  },
  {
    title: "NOI lift updated",
    copy: "Approving the action adds impact to the owner report.",
    value: "+€620/mo",
    Icon: CircleDollarSign
  }
];

export default function DemoPage() {
  const kpis = actionCenterKpis();

  return (
    <main className="bg-[#f6f7f9] text-slate-950">
      <section className="mx-auto max-w-[1800px] px-5 py-16 xl:px-8">
        <div className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-xl">
          <div className="grid gap-10 p-8 lg:grid-cols-[1fr_520px] lg:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Demo workspace</p>
              <h1 className="mt-5 max-w-5xl text-6xl font-semibold tracking-tight text-slate-950">
                See what changes before competitors beat you to it.
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
                StorageYield turns booking demand, unit pressure, discounts and selected competitor prices into approval-ready revenue decisions.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0" href="/app">
                  Open Decision Inbox <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0" href="/widget/brussels-north-storage">
                  Test booking widget
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Primary decision</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">Raise Brussels 3 m² new-customer price?</h2>
              <p className="mt-4 text-slate-300">From €92 to €98. Low risk. Direct competitors are 8% higher.</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Uplift</p><p className="mt-1 text-xl font-semibold">+€620</p></div>
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Demand</p><p className="mt-1 text-xl font-semibold">17</p></div>
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Occupancy</p><p className="mt-1 text-xl font-semibold">94%</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { label: "Money left on table", value: eur(kpis.money_left_on_table), Icon: TrendingUp },
            { label: "Bookings need action", value: kpis.bookings_needing_action, Icon: MousePointer2 },
            { label: "Unit types under market", value: kpis.unit_types_under_market, Icon: Radar },
            { label: "Discount leakage", value: eur(kpis.discount_leakage), Icon: CircleDollarSign }
          ].map(({ label, value, Icon }) => (
            <div className="card p-6" key={label}>
              <Icon className="h-5 w-5 text-emerald-600" />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {storyCards.map(({ title, copy, value, Icon }) => (
            <div className="card p-6" key={title}>
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-emerald-600" />
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{value}</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
