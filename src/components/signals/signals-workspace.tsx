"use client";

import Link from "next/link";
import { useState } from "react";
import { Radar } from "lucide-react";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, Button, Toasts, ageLabel, cx, toneClass } from "@/components/app-shell/shared-ui";

export function SignalsWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [query, setQuery] = useState("");
  const filtered = workspace.snapshot.signals.filter((signal) => `${signal.title} ${signal.category} ${signal.evidence}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Live intelligence</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Signals Feed</h1>
          <p className="mt-2 text-lg text-slate-600">Raw detected events from bookings, pricing, discounts, arrears, seasonality and competitor movement.</p>
        </div>
        <Button onClick={() => workspace.generateSignalsAndActions()}>Refresh signals</Button>
      </div>
      <WorkspaceGate workspace={workspace}>
        <div className="card p-4">
          <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Search live intelligence feed" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="space-y-4">
          {filtered.map((signal) => (
            <article className="card grid gap-4 p-5 lg:grid-cols-[48px_1fr_160px]" key={signal.id}>
              <div className={cx("flex h-12 w-12 items-center justify-center rounded-2xl border", toneClass(signal.severity === "high" ? "red" : signal.severity === "medium" ? "amber" : "slate"))}><Radar className="h-5 w-5" /></div>
              <div>
                <div className="flex flex-wrap gap-2"><Badge tone={signal.severity === "high" ? "red" : signal.severity === "medium" ? "amber" : "slate"}>{signal.severity}</Badge><Badge>{signal.category.replaceAll("_", " ")}</Badge></div>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">{signal.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{signal.evidence}</p>
                <p className="mt-2 text-xs text-slate-500">{signal.facility_name}{signal.unit_type_name ? ` · ${signal.unit_type_name}` : ""} · {ageLabel(signal.created_at)} ago</p>
              </div>
              <Link className="self-center text-sm font-semibold text-emerald-700" href="/app/decisions">Linked decisions</Link>
            </article>
          ))}
          {!filtered.length ? <div className="card p-8 text-center text-sm text-slate-600">No matching signals. Refresh signals after adding operational data.</div> : null}
        </div>
      </WorkspaceGate>
    </div>
  );
}
