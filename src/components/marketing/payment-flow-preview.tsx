import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

export function PaymentFlowPreview() {
  const steps = [
    ["Subscription", "Pilot"],
    ["Invoice + VAT", "Pilot"],
    ["iDEAL/Bancontact", "Roadmap"],
    ["PEPPOL export", "Roadmap"]
  ] as const;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">Invoice workflow</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Betaling en facturatie zonder overclaim</h2>
      <div className="mt-6 grid gap-3">
        {steps.map(([label, status]) => (
          <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="font-semibold text-slate-950">{label}</span>
            <FeatureStatusBadge status={status} />
          </div>
        ))}
      </div>
    </div>
  );
}
