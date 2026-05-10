import { CheckCircle2, CreditCard, FileSignature, KeyRound, ShieldCheck, UserRoundCheck } from "lucide-react";
import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

const steps = [
  ["Booking", CheckCircle2, "Beschikbaar"],
  ["Identity", ShieldCheck, "Roadmap"],
  ["Contract", FileSignature, "Roadmap"],
  ["Payment", CreditCard, "Roadmap"],
  ["Access", KeyRound, "Roadmap"],
  ["Active customer", UserRoundCheck, "Pilot"]
] as const;

export function ZeroTouchLifecycleScreen() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">Zero-touch workflow</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Van aanvraag naar actieve klant</h3>
        </div>
        <FeatureStatusBadge status="Roadmap" />
      </div>
      <div className="mt-8 space-y-3">
        {steps.map(([label, Icon, status], index) => (
          <div key={label} className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[44px_1fr_120px]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Icon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-950">{index + 1}. {label}</p>
              <p className="text-sm text-slate-600">{index === 0 ? "Live/pilot booking request" : "Ontworpen voor Benelux roadmap en manual fallback"}</p>
            </div>
            <FeatureStatusBadge status={status} />
          </div>
        ))}
      </div>
    </div>
  );
}
