"use client";

import Link from "next/link";
import { AlertTriangle, Check, Clock, Euro, Radar, Zap } from "lucide-react";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, Button, ImpactStat, Toasts, actionQuestion, ageLabel, formatEur } from "@/components/app-shell/shared-ui";

export function RevenueControlRoomWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const actions = workspace.snapshot.actions;
  const urgent = actions.find((action) => action.status === "proposed") ?? actions[0];
  const bookingsNeedAction = workspace.snapshot.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status)).length;
  const moneyMap = workspace.snapshot.moneyMap.items;

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Revenue overview</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Revenue Control Room</h1>
          <p className="mt-2 max-w-3xl text-lg text-slate-600">Live view of revenue pressure, market moves and operational risk.</p>
        </div>
        <Link className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/app/decisions">Open Decision Inbox</Link>
      </div>
      <WorkspaceGate workspace={workspace}>
        {urgent ? (
          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
            <div className="flex flex-wrap gap-2"><Badge tone="green">Urgent decision</Badge><Badge tone="dark">{Math.round(urgent.confidence * 100)}% confidence</Badge></div>
            <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight">{actionQuestion(urgent)}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{urgent.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => workspace.approveAction(urgent)}><Zap className="h-4 w-4" />Approve</Button>
              <Link className="inline-flex items-center rounded-2xl border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950" href="/app/decisions">Review evidence</Link>
            </div>
          </section>
        ) : null}
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={Euro} label="Money left on table" tone="green" value={`${formatEur(workspace.snapshot.moneyMap.totalMoneyLeftOnTable)}/mo`} />
          <ImpactStat icon={Clock} label="Bookings need action" tone="amber" value={bookingsNeedAction} />
          <ImpactStat icon={Radar} label="Competitor moves" tone="blue" value={workspace.snapshot.observations.length} />
          <ImpactStat icon={AlertTriangle} label="Arrears risk" tone="red" value={formatEur(moneyMap.find((item) => item.id === "arrears")?.value ?? 0)} />
          <ImpactStat icon={Check} label="Data health" tone="amber" value={`${workspace.snapshot.dataHealth.score}%`} />
        </div>
        <section className="card p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h2 className="text-2xl font-semibold text-slate-950">Money Map</h2><p className="mt-1 text-slate-600">Click leakage sources in pilot reviews to explain what decisions are blocking revenue.</p></div>
            <p className="text-4xl font-semibold text-slate-950">{formatEur(workspace.snapshot.moneyMap.totalMoneyLeftOnTable)}<span className="text-base text-slate-500">/mo</span></p>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-5">
            {moneyMap.map((item) => (
              <div className="rounded-3xl border border-slate-200 p-5" key={item.id}>
                <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{formatEur(item.value)}</p>
                <p className="mt-3 text-sm text-slate-600">{item.insufficientData ? "Insufficient unit data to calculate this yet." : item.copy}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">What changed this week</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {workspace.snapshot.signals.slice(0, 6).map((signal) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={signal.id}>
                  <Badge tone={signal.severity === "high" ? "red" : signal.severity === "medium" ? "amber" : "slate"}>{signal.category.replaceAll("_", " ")}</Badge>
                  <p className="mt-3 font-semibold text-slate-950">{signal.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{signal.evidence}</p>
                </div>
              ))}
              {!workspace.snapshot.signals.length ? <p className="text-sm text-slate-600">Generate signals after adding competitor observations or booking data.</p> : null}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Live activity</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.activity.slice(0, 5).map((event) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={event.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{event.type} · {ageLabel(event.created_at)}</p>
                  <p className="mt-2 font-semibold text-slate-950">{event.title}</p>
                  <p className="text-sm text-slate-600">{event.description}</p>
                </div>
              ))}
              {!workspace.snapshot.activity.length ? <p className="text-sm text-slate-600">Approvals, bookings and competitor observations will appear here.</p> : null}
            </div>
          </div>
        </section>
      </WorkspaceGate>
    </div>
  );
}
