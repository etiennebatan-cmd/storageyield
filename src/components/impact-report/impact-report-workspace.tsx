"use client";

import { Check, Clock, Euro, TrendingUp, Zap } from "lucide-react";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, CopyButton, ImpactStat, Toasts, actionQuestion, formatEur } from "@/components/app-shell/shared-ui";

export function ImpactReportWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const reportText = `StorageYield weekly impact\nRent roll: ${formatEur(workspace.snapshot.impact.rentRoll)}\nExpected uplift approved: ${formatEur(workspace.snapshot.impact.expectedMonthlyUplift)}\nBookings converted: ${workspace.snapshot.impact.convertedBookings}`;
  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Owner impact</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Impact Report</h1>
          <p className="mt-2 text-lg text-slate-600">Impact, risks and next-week priorities from the revenue decision loop.</p>
        </div>
        <CopyButton text={reportText} />
      </div>
      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={Euro} label="Rent roll" tone="green" value={formatEur(workspace.snapshot.impact.rentRoll)} />
          <ImpactStat icon={TrendingUp} label="Expected uplift" tone="green" value={formatEur(workspace.snapshot.impact.expectedMonthlyUplift)} />
          <ImpactStat icon={Check} label="Approved decisions" tone="green" value={workspace.snapshot.impact.approvedDecisions} />
          <ImpactStat icon={Zap} label="Completed" tone="blue" value={workspace.snapshot.impact.completedDecisions} />
          <ImpactStat icon={Clock} label="Bookings converted" tone="amber" value={workspace.snapshot.impact.convertedBookings} />
        </div>
        <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Measured impact</h2>
            <p className="mt-2 text-slate-600">Approved pricing, converted bookings and launched campaigns are carried into this report through the shared store.</p>
            <div className="mt-5 space-y-3">
              {workspace.snapshot.actions.filter((action) => ["approved", "completed", "active"].includes(action.status)).map((action) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={action.id}>
                  <div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-950">{action.title}</p><Badge tone="green">{action.status}</Badge></div>
                  <p className="mt-1 text-sm text-slate-600">{action.estimated_monthly_uplift ? `${formatEur(action.estimated_monthly_uplift)}/mo expected` : "Tracked outcome"}</p>
                </div>
              ))}
              {!workspace.snapshot.actions.some((action) => ["approved", "completed", "active"].includes(action.status)) ? <p className="text-sm text-slate-600">Approve a decision to start tracking impact.</p> : null}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Next week priorities</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.actions.filter((action) => action.status === "proposed").slice(0, 5).map((action) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={action.id}>
                  <p className="font-semibold text-slate-950">{actionQuestion(action)}</p>
                  <p className="mt-1 text-sm text-slate-600">{action.exact_next_step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="grid gap-5 md:grid-cols-3">
          <div className="card p-5"><h2 className="font-semibold text-slate-950">Bookings and conversion</h2><p className="mt-3 text-sm text-slate-600">{workspace.snapshot.impact.convertedBookings} converted, {workspace.snapshot.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status)).length} still need follow-up.</p></div>
          <div className="card p-5"><h2 className="font-semibold text-slate-950">Competitor movements</h2><p className="mt-3 text-sm text-slate-600">{workspace.snapshot.observations.length} manual competitor observations are stored for pricing evidence.</p></div>
          <div className="card p-5"><h2 className="font-semibold text-slate-950">Data risks</h2><p className="mt-3 text-sm text-slate-600">Data Health is {workspace.snapshot.dataHealth.score}%. {workspace.snapshot.dataHealth.issues[0]?.title ?? "No immediate issues."}</p></div>
        </section>
      </WorkspaceGate>
    </div>
  );
}
