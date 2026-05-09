import { PricingLabWorkspace } from "@/components/pricing-lab/pricing-lab-workspace";

export default function PricingLabPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Pricing decision engine</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Pricing Lab</h1>
          <p className="mt-2 text-lg text-slate-600">See which unit types to raise, hold, discount, remap or test next.</p>
        </div>
      </div>
      <PricingLabWorkspace />
    </div>
  );
}
