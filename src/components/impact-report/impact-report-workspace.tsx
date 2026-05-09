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
            <h2 className="text-2xl font-semibold text-slate-950">Decisions approved this week</h2>
            <p className="mt-2 text-slate-600">Every row is backed by action events, price changes or converted bookings.</p>
            <div className="mt-5 space-y-3">
              {workspace.snapshot.impact.actionTimeline.map((action) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={action.id}>
                  <div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-950">{action.title}</p><Badge tone="green">{action.status}</Badge></div>
                  <p className="mt-1 text-sm text-slate-600">{action.expectedMonthlyUplift ? `${formatEur(action.expectedMonthlyUplift)}/mo expected` : "Tracked outcome"}</p>
                  {action.beforeValue || action.afterValue ? <p className="mt-1 text-sm text-slate-600">Before {action.beforeValue ?? "n/a"} · after {action.afterValue ?? "n/a"}</p> : null}
                  {action.evidenceSummary.length ? <p className="mt-2 text-xs text-slate-500">{action.evidenceSummary.join(" · ")}</p> : null}
                </div>
              ))}
              {!workspace.snapshot.impact.actionTimeline.length ? <p className="text-sm text-slate-600">Approve a decision to start tracking impact.</p> : null}
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
          <div className="card p-5">
            <h2 className="font-semibold text-slate-950">Price changes</h2>
            <div className="mt-3 space-y-2">
              {workspace.snapshot.impact.priceChangesApproved.map((change) => (
                <p className="text-sm text-slate-600" key={`${change.actionId}-${change.approvedAt}`}>{change.unitTypeName ?? change.actionTitle}: {change.oldPrice == null ? "n/a" : formatEur(change.oldPrice)} to {change.newPrice == null ? "n/a" : formatEur(change.newPrice)}</p>
              ))}
              {!workspace.snapshot.impact.priceChangesApproved.length ? <p className="text-sm text-slate-600">No approved price changes yet.</p> : null}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold text-slate-950">Booking conversions</h2>
            <div className="mt-3 space-y-2">
              {workspace.snapshot.impact.convertedBookingRows.map((booking) => (
                <p className="text-sm text-slate-600" key={booking.bookingId}>{booking.customerName}: {booking.unitTypeName}, {formatEur(booking.rent)}/mo</p>
              ))}
              {!workspace.snapshot.impact.convertedBookingRows.length ? <p className="text-sm text-slate-600">No converted booking impact yet.</p> : null}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold text-slate-950">Campaigns launched</h2>
            <div className="mt-3 space-y-2">
              {workspace.snapshot.impact.campaignsLaunched.map((campaign) => (
                <p className="text-sm text-slate-600" key={campaign.id}>{campaign.name}: {campaign.bookings} bookings, {formatEur(campaign.estimated_rent_created)} rent created</p>
              ))}
              {!workspace.snapshot.impact.campaignsLaunched.length ? <p className="text-sm text-slate-600">No launched campaign impact yet.</p> : null}
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
