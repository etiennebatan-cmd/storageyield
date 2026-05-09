"use client";

import { useState } from "react";
import { AlertTriangle, Check, Clock, Euro, Radar, Zap } from "lucide-react";
import type { OperatorAction } from "@/lib/operator-demo";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, Button, ImpactStat, SlideOver, Toasts, actionQuestion, actionTone, formatEur } from "@/components/app-shell/shared-ui";
import { evidenceToBullets, evidenceToSections } from "@/lib/actions/evidence-format";

export function DecisionInboxWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [selected, setSelected] = useState<OperatorAction | null>(null);
  const actions = workspace.snapshot.actions;
  const openActions = actions.filter((action) => !["completed", "dismissed", "rejected"].includes(action.status));
  const openValue = openActions.reduce((sum, action) => sum + (action.estimated_monthly_uplift ?? 0), 0);

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Revenue decision engine</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Decision Inbox</h1>
          <p className="mt-2 max-w-3xl text-lg text-slate-600">Pricing, booking, competitor and campaign decisions waiting for approval.</p>
        </div>
        <Button onClick={() => workspace.generateSignalsAndActions()}><Zap className="h-4 w-4" />Generate decisions</Button>
      </div>

      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={Euro} label="Open decision value" tone="green" value={`${formatEur(openValue)}/mo`} />
          <ImpactStat icon={Clock} label="Awaiting approval" tone="amber" value={actions.filter((action) => action.status === "proposed").length} />
          <ImpactStat icon={Check} label="Approved" tone="green" value={actions.filter((action) => action.status === "approved").length} />
          <ImpactStat icon={AlertTriangle} label="High priority" tone="red" value={actions.filter((action) => action.priority === "high").length} />
          <ImpactStat icon={Radar} label="Data health" tone="amber" value={`${workspace.snapshot.dataHealth.score}%`} />
        </div>

        <section className="space-y-4">
          {actions.length ? actions.map((action) => (
            <article className="card p-5 transition hover:-translate-y-1 hover:shadow-lg" key={action.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={actionTone(action)}>{action.priority}</Badge>
                    <Badge tone={action.status === "approved" || action.status === "completed" ? "green" : "slate"}>{action.status}</Badge>
                    <Badge>{Math.round(action.confidence * 100)}% confidence</Badge>
                    <Badge>{action.category.replaceAll("_", " ")}</Badge>
                  </div>
                  <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950">{actionQuestion(action)}</h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{action.description}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">{action.exact_next_step}</p>
                </div>
                <div className="min-w-48 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Expected uplift</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{action.estimated_monthly_uplift ? `${formatEur(action.estimated_monthly_uplift)}/mo` : "Protects yield"}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button disabled={action.status === "approved" || action.status === "completed"} onClick={() => workspace.approveAction(action)}>Approve</Button>
                <Button onClick={() => setSelected(action)} variant="secondary">View evidence</Button>
                <Button disabled={action.status === "completed"} onClick={() => workspace.completeAction(action, window.prompt("Outcome note (optional)") ?? undefined)} variant="secondary">Complete</Button>
                <Button disabled={["dismissed", "rejected"].includes(action.status)} onClick={() => workspace.dismissAction(action)} variant="ghost">Dismiss</Button>
              </div>
            </article>
          )) : (
            <div className="card p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-950">No decisions yet</h2>
              <p className="mt-2 text-sm text-slate-600">Generate signals and decisions after adding units, bookings and competitor observations.</p>
              <div className="mt-4"><Button onClick={() => workspace.generateSignalsAndActions()}>Generate first decisions</Button></div>
            </div>
          )}
        </section>
      </WorkspaceGate>

      {selected ? (
        <SlideOver title="Decision evidence" onClose={() => setSelected(null)}>
          {(() => {
            const bullets = evidenceToBullets(selected.evidence);
            const sections = evidenceToSections(selected.evidence);
            return (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Question</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{actionQuestion(selected)}</h3>
              <p className="mt-2 text-sm text-slate-600">{selected.exact_next_step}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Expected uplift</p><p className="mt-1 text-2xl font-semibold">{selected.estimated_monthly_uplift ? `${formatEur(selected.estimated_monthly_uplift)}/mo` : "No estimate"}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Confidence</p><p className="mt-1 text-2xl font-semibold">{Math.round(selected.confidence * 100)}%</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Status</p><p className="mt-1 text-2xl font-semibold capitalize">{selected.status}</p></div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {sections.map((section) => (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm" key={section.label}>
                  <p className="font-semibold text-slate-500">{section.label}</p>
                  <p className="mt-1 text-slate-800">{section.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {bullets.length ? bullets.map((item) => (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700" key={item}>{item}</div>
              )) : <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">No evidence available yet.</div>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => { workspace.approveAction(selected); setSelected(null); }}>Approve</Button>
              <Button onClick={() => { workspace.dismissAction(selected); setSelected(null); }} variant="secondary">Dismiss</Button>
            </div>
          </div>
            );
          })()}
        </SlideOver>
      ) : null}
    </div>
  );
}
