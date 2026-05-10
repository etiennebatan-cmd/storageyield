"use client";

import Link from "next/link";
import { PanelRightOpen } from "lucide-react";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, CopyButton, Toasts } from "@/components/app-shell/shared-ui";

export function DataIntegrationsWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const widgetUrl = `http://localhost:3000/widget/${workspace.snapshot.facilities[0]?.public_slug ?? ""}`;
  const iframe = `<iframe src="${widgetUrl}" width="100%" height="720" style="border:0;border-radius:12px;"></iframe>`;
  const setup = [
    ["Add facility", workspace.snapshot.facilities.length > 0],
    ["Add unit types", workspace.snapshot.unitTypes.length > 0],
    ["Add units and prices", workspace.snapshot.units.length > 0 && workspace.snapshot.unitTypes.every((unitType) => unitType.current_street_rate_monthly > 0)],
    ["Add 3 competitors", workspace.snapshot.competitors.length >= 3],
    ["Add competitor price observations", workspace.snapshot.observations.length > 0],
    ["Install booking widget", true],
    ["Submit test booking", workspace.snapshot.bookings.length > 0],
    ["Generate first decisions", workspace.snapshot.actions.length > 0]
  ];

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Data and integrations</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Data & Integrations</h1>
        <p className="mt-2 text-lg text-slate-600">Set up the revenue decision loop without pretending future PMS integrations already exist.</p>
      </div>
      <WorkspaceGate workspace={workspace}>
        <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Setup checklist</h2>
            <div className="mt-4 space-y-3">
              {setup.map(([label, done]) => (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3" key={String(label)}>
                  <p className="font-semibold text-slate-950">{String(label)}</p>
                  <Badge tone={done ? "green" : "amber"}>{done ? "Done" : "Needed"}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Data Health: {workspace.snapshot.dataHealth.score}%</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {workspace.snapshot.dataHealth.issues.map((issue) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={issue.id}>
                  <Badge tone={issue.severity === "high" ? "red" : issue.severity === "medium" ? "amber" : "slate"}>{issue.severity}</Badge>
                  <p className="mt-2 font-semibold text-slate-950">{issue.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{issue.cta}</p>
                </div>
              ))}
              {!workspace.snapshot.dataHealth.issues.length ? <p className="text-sm text-slate-600">No data health issues found.</p> : null}
            </div>
          </div>
        </section>
        <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Widget installation</h2>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. Add the iframe to your website booking page.</li>
              <li>2. Submit a test booking.</li>
              <li>3. Review the request in Booking Conversion.</li>
            </ol>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-white">{iframe}</pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <CopyButton text={iframe} />
              <Link className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/widget/brussels-north-storage">Test booking</Link>
            </div>
          </div>
          <div className="card overflow-hidden p-3"><iframe className="h-[560px] w-full rounded-2xl border border-slate-200" src={`/widget/${workspace.snapshot.facilities[0]?.public_slug ?? ""}`} /></div>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Booking widget", "Available now"],
            ["Manual unit setup", "Available now"],
            ["CSV import for units/prices", "Pilot-assisted"],
            ["Manual competitor observations", "Available now"],
            ["Google Sheets sync", "Roadmap"],
            ["PMS export import", "Roadmap"],
            ["Stora/SiteLink/Storeganise integrations", "Roadmap"],
            ["Payment/access-control imports", "Roadmap"]
          ].map(([label, state]) => (
            <div className="card p-5" key={label}>
              <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-slate-950">{label}</h3><PanelRightOpen className="h-5 w-5 text-slate-400" /></div>
              <p className="mt-2 text-sm text-slate-600">{state}</p>
            </div>
          ))}
        </section>
      </WorkspaceGate>
    </div>
  );
}
