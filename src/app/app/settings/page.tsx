import { SettingsWorkspace } from "@/components/app/live-cockpit";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Decision data layer</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Data & Integrations</h1>
        <p className="mt-2 text-lg text-slate-600">Connect booking demand, market observations, pricing rules and data health checks that feed decisions.</p>
      </div>
      <SettingsWorkspace />
    </div>
  );
}
