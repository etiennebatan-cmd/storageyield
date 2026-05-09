import { SignalsWorkspace } from "@/components/signals/signals-workspace";

export default function SignalsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Live intelligence</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Signals Feed</h1>
        <p className="mt-2 text-lg text-slate-600">Raw detected events from bookings, pricing, discounts, arrears, seasonality and competitor movement.</p>
      </div>
      <SignalsWorkspace />
    </div>
  );
}
