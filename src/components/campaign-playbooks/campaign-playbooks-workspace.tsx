"use client";

import type { Campaign } from "@/lib/operator-demo";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, Button, Toasts, formatEur } from "@/components/app-shell/shared-ui";

const campaignTemplates = [
  { id: "student", name: "Student Summer Storage", why: "May-August demand spike for 1-5 m² units.", target: "1-5 m² · student", offer: "First month 50% off for move-ins before 15 June.", kpi: "+18 leads / +€520 rent" },
  { id: "moving", name: "Moving Season", why: "Apartment moves lift short-term demand.", target: "3-10 m² · private", offer: "Free lock and flexible first month.", kpi: "+12 bookings" },
  { id: "contractor", name: "Contractor Storage", why: "Business customers have higher monthly value.", target: "10-20 m² · contractor", offer: "Business rate review and easy van access.", kpi: "+€740 rent" },
  { id: "ecommerce", name: "E-commerce Overflow", why: "Q4 stock overflow creates predictable demand.", target: "5-20 m² · e-commerce", offer: "Seasonal overflow storage with monthly renewal.", kpi: "+4 business bookings" },
  { id: "archive", name: "Archive Storage", why: "Archive customers stay longer and churn less.", target: "5-10 m² · archive", offer: "Simple monthly archive storage for local offices.", kpi: "+€360 rent" },
  { id: "winter", name: "Winter Vacancy Fill", why: "November-February demand softens for weak unit types.", target: "10-20 m² · private", offer: "Winter move-in promo for vacant large units.", kpi: "+7 occupied units" }
];

export function CampaignsWorkspace() {
  const workspace = useStorageYieldWorkspace();

  const launchTemplate = (template: (typeof campaignTemplates)[number]) => {
    const facility = workspace.snapshot.facilities[0];
    const unitType = workspace.snapshot.unitTypes.find((item) => item.size_m2 <= 5) ?? workspace.snapshot.unitTypes[0];
    if (!facility || !unitType) {
      workspace.toast("Add a facility and unit type before launching a campaign");
      return;
    }
    const campaign: Campaign = {
      id: `campaign-${template.id}-${Date.now()}`,
      name: template.name,
      facility_id: facility.id,
      facility_name: facility.name,
      target_unit_type_id: unitType.id,
      target_unit_type_name: unitType.name,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: "2026-08-31",
      promotion_text: template.offer,
      target_customer_type: template.id === "student" ? "student" : template.id === "contractor" ? "contractor" : template.id === "archive" ? "archive" : template.id === "ecommerce" ? "e-commerce" : "private",
      objective: "boost demand",
      status: "active",
      leads: 0,
      bookings: 0,
      conversions: 0,
      estimated_rent_created: 0,
      units_affected: 12
    };
    workspace.run(() => workspace.store.launchCampaign(campaign), `${template.name} launched`);
  };

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Revenue playbooks</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Campaign Playbooks</h1>
        <p className="mt-2 max-w-3xl text-lg text-slate-600">Launch seasonal and vacancy plays, then track leads, bookings, conversions and rent created.</p>
      </div>
      <WorkspaceGate workspace={workspace}>
        <section className="grid gap-4 xl:grid-cols-2">
          {campaignTemplates.map((template) => (
            <article className="card p-5 transition hover:-translate-y-1 hover:shadow-lg" key={template.id}>
              <div className="flex items-start justify-between gap-4">
                <div><h2 className="text-2xl font-semibold text-slate-950">{template.name}</h2><p className="mt-2 text-slate-600">{template.why}</p></div>
                <Badge tone="green">{template.kpi}</Badge>
              </div>
              <p className="mt-5 text-sm text-slate-700"><strong>Target:</strong> {template.target}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Offer:</strong> {template.offer}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Widget promo:</strong> {template.name} available now. Reserve before availability tightens.</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Follow-up:</strong> We can hold a unit for your move-in date and confirm availability today.</p>
              <div className="mt-5"><Button onClick={() => launchTemplate(template)}>Launch campaign</Button></div>
            </article>
          ))}
        </section>
        <section className="card p-5">
          <h2 className="text-2xl font-semibold text-slate-950">Active campaigns</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {workspace.snapshot.campaigns.map((campaign) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={campaign.id}>
                <div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-950">{campaign.name}</p><Badge tone={campaign.status === "active" ? "green" : "slate"}>{campaign.status}</Badge></div>
                <p className="mt-1 text-sm text-slate-600">{campaign.facility_name} · {campaign.target_unit_type_name}</p>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="rounded-xl bg-slate-50 p-2">Leads<p className="font-semibold">{campaign.leads}</p></div>
                  <div className="rounded-xl bg-slate-50 p-2">Bookings<p className="font-semibold">{campaign.bookings}</p></div>
                  <div className="rounded-xl bg-slate-50 p-2">Won<p className="font-semibold">{campaign.conversions}</p></div>
                  <div className="rounded-xl bg-slate-50 p-2">Rent<p className="font-semibold">{formatEur(campaign.estimated_rent_created)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </WorkspaceGate>
    </div>
  );
}
