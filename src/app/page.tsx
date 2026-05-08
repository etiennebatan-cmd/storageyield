import Link from "next/link";
import { ArrowRight, BellRing, CircleDollarSign, Radar, ShieldAlert } from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-[#f6f7f9]">
      <section className="mx-auto grid max-w-[1800px] gap-12 px-5 py-20 xl:grid-cols-[1.05fr_0.95fr] xl:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Revenue decision engine</p>
          <h1 className="mt-5 max-w-5xl text-6xl font-semibold tracking-tight text-slate-950 xl:text-7xl">
            Your PMS stores data. StorageYield turns it into revenue decisions.
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
            Track demand, competitor moves, discounts and vacancies, then know exactly which price, campaign or follow-up action to approve this week.
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

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Live now</p>
              <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" /></span>
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight">Decision: raise Brussels 3 m² price to €98?</h2>
            <p className="mt-4 text-slate-300">94% occupied, 17 leads in 30 days, selected direct competitors 8% higher.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Uplift</p><p className="mt-1 text-2xl font-semibold">+€620/mo</p></div>
              <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Risk</p><p className="mt-1 text-2xl font-semibold">Low</p></div>
              <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Confidence</p><p className="mt-1 text-2xl font-semibold">86%</p></div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Competitor moved", "BoxPlus raised 3 m² price from €95 to €102.", Radar],
              ["Decision generated", "StorageYield created a price decision with evidence.", BellRing],
              ["Impact updated", "Impact Report now includes expected and simulated uplift.", CircleDollarSign]
            ].map(([title, copy, Icon]) => (
              <div className="rounded-3xl border border-slate-200 p-4" key={title as string}>
                <Icon className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 font-semibold text-slate-950">{title as string}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{copy as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-5 pb-20 xl:px-8">
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="card p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">PMS</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Records bookings and units.</h2>
            <p className="mt-3 text-slate-600">Useful for operations, but it usually waits for the operator to decide what pricing, follow-up or campaign move to make.</p>
          </div>
          <div className="card border-emerald-200 bg-emerald-50 p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">StorageYield</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Detects pricing and revenue decisions.</h2>
            <p className="mt-3 text-slate-700">Competitor movement, booking demand, discount leakage and stale data become approval-ready decisions with impact tracking.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["High-demand units underpriced", "3 m² Brussels is below direct market while nearly full."],
            ["Competitors move before you notice", "Manual observations and future tracking feed Market Radar."],
            ["Legacy discounts leak rent", "Expired concessions become recoverable decisions."],
            ["Slow follow-up loses bookings", "Widget requests flow into a conversion pipeline."]
          ].map(([title, copy]) => (
            <div className="card p-6" key={title}>
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <h2 className="mt-4 text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
