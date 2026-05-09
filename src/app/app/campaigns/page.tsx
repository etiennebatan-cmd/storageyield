import { CampaignsWorkspace } from "@/components/campaign-playbooks/campaign-playbooks-workspace";

export default function CampaignsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Revenue playbooks</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Campaign Playbooks</h1>
        <p className="mt-2 text-lg text-slate-600">Launch seasonal and vacancy plays, then track leads, bookings, conversions and rent created.</p>
      </div>
      <CampaignsWorkspace />
    </div>
  );
}
