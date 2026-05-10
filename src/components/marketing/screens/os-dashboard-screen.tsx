import { Activity, Bell, CalendarCheck, CreditCard, KeyRound, LineChart, Radar, Warehouse } from "lucide-react";
import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

const sidebarItems = ["Booking", "Resources", "Customers", "Revenue", "Access", "Billing"];

export function OsDashboardScreen() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">StorageYield OS</p>
          <p className="mt-1 text-sm text-slate-300">Benelux operator workspace</p>
        </div>
        <FeatureStatusBadge status="Pilot" />
      </div>

      <div className="grid min-h-[480px] lg:grid-cols-[180px_1fr_260px]">
        <aside className="hidden border-r border-white/10 p-4 lg:block">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div key={item} className={`rounded-2xl px-3 py-3 text-sm font-semibold ${index === 3 ? "bg-white text-slate-950" : "text-slate-300"}`}>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-xs text-emerald-100">
            Demo/pilot mode with live decision loop.
          </div>
        </aside>

        <section className="p-5">
          <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Revenue Control Room</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">Raise Brussels 3 m2 price?</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  94% occupied, 17 leads in 30 days and direct competitors are 8% higher.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Expected uplift</p>
                <p className="mt-1 text-3xl font-semibold">+EUR 620/mo</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {["Decision Inbox", "Pricing Lab", "Market Radar", "Impact Report"].map((label) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: label === "Market Radar" ? "58%" : "76%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-emerald-300" />
                <h4 className="font-semibold">Resource occupancy</h4>
              </div>
              <div className="mt-4 grid grid-cols-8 gap-1">
                {Array.from({ length: 40 }).map((_, index) => (
                  <span key={index} className={`h-6 rounded-md ${index % 7 === 0 ? "bg-amber-300" : index % 9 === 0 ? "bg-slate-600" : "bg-emerald-400"}`} />
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-emerald-300" />
                <h4 className="font-semibold">Money map</h4>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["Pricing gap", "EUR 1.210"],
                  ["Vacancy drag", "EUR 880"],
                  ["Discount leakage", "EUR 314"]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-300" />
            <h4 className="font-semibold">Live flow</h4>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ["Booking request", "3 m2 unit, move-in in 7 days", Bell],
              ["Competitor move", "BoxPlus raised 3-4 m2 price", Radar],
              ["Payment step", "Local methods on roadmap", CreditCard],
              ["Access status", "PIN/QR workflow roadmap", KeyRound],
              ["Weekly report", "Impact report updated", CalendarCheck]
            ].map(([title, copy, Icon]) => (
              <div key={title as string} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                {typeof Icon !== "string" ? <Icon className="h-4 w-4 text-emerald-300" /> : null}
                <p className="mt-2 text-sm font-semibold">{title as string}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{copy as string}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
