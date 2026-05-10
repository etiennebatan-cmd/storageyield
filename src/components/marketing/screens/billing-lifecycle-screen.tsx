import { AlertCircle, ArrowRight, Banknote, CreditCard, FileText, Repeat2 } from "lucide-react";
import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

const lifecycle = [
  ["Subscription", Repeat2],
  ["Invoice", FileText],
  ["Payment", CreditCard],
  ["Reconciliation", Banknote],
  ["Overdue", AlertCircle]
] as const;

export function BillingLifecycleScreen() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">Billing infrastructure</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Benelux betaal- en facturatiepad</h3>
        </div>
        <FeatureStatusBadge status="Roadmap" />
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-5">
        {lifecycle.map(([label, Icon], index) => (
          <div key={label} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Icon className="h-6 w-6 text-emerald-600" />
            <p className="mt-4 font-semibold text-slate-950">{label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{index < 2 ? "Pilot data model" : "Roadmap integration"}</p>
            {index < lifecycle.length - 1 ? <ArrowRight className="absolute -right-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 md:block" /> : null}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {["iDEAL/Bancontact voorbereid", "SEPA en structured references", "PEPPOL/e-facturatie roadmap"].map((item) => (
          <div key={item} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">{item}</div>
        ))}
      </div>
    </div>
  );
}
