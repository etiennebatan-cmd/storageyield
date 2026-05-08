import { BookingsWorkspace } from "@/components/app/live-cockpit";

export default function BookingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Booking conversion</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Booking Conversion</h1>
        <p className="mt-2 text-lg text-slate-600">Prioritise live booking demand by score, next best action, conversion risk and expected rent.</p>
      </div>
      <BookingsWorkspace />
    </div>
  );
}
