import { ArrowUpRight, CheckCircle2, CircleDashed, Radar } from "lucide-react";

export function PricingIntelligenceScreen() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-slate-950 p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Decision memo</p>
          <h3 className="mt-4 text-4xl font-semibold tracking-tight">Raise Brussels 3 m2 from EUR 92 to EUR 98?</h3>
          <p className="mt-4 text-slate-300">Applies to new bookings only. Existing tenants affected: 0.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["94% occupied", "17 leads", "8% below market"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold">{item}</div>
            ))}
          </div>
          <button className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950">Approve new-customer price</button>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {[
              ["Market Radar", "BoxPlus and CityStorage average EUR 100", Radar],
              ["Risk", "Low because only 3 units available", CircleDashed],
              ["Expected uplift", "+EUR 620/mo after expected bookings", ArrowUpRight],
              ["Impact Report", "Track approved price and result", CheckCircle2]
            ].map(([title, copy, Icon]) => (
              <div key={title as string} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {typeof Icon !== "string" ? <Icon className="h-5 w-5 text-emerald-600" /> : null}
                <p className="mt-3 font-semibold text-slate-950">{title as string}</p>
                <p className="mt-1 text-sm text-slate-600">{copy as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
