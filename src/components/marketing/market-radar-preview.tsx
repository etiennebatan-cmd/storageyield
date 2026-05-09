import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

export function MarketRadarPreview() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-[1.5rem] bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-950">Market Radar</h2>
          <FeatureStatusBadge status="Beschikbaar" />
        </div>
        <div className="mt-5 space-y-3">
          {[
            ["BoxPlus Brussels", "3-4 m² van €95 naar €102", "direct"],
            ["CityStorage North", "5 m² prijs 6% hoger", "direct"],
            ["Premium Climate", "benchmark, niet in prijsadvies", "benchmark"]
          ].map(([name, detail, tag]) => (
            <div key={name} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{name}</p>
                  <p className="mt-1 text-sm text-slate-600">{detail}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
