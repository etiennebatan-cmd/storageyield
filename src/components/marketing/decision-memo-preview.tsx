import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

export function DecisionMemoPreview() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Decision memo</p>
          <FeatureStatusBadge status="Beschikbaar" />
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">Verhoog Brussels 3 m² naar €98?</h2>
        <p className="mt-3 text-slate-300">94% bezet, 17 leads in 30 dagen, directe concurrenten 8% hoger.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Impact", "+€620/mo"],
            ["Risico", "Laag"],
            ["Advies", "Approve"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="mt-1 text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
