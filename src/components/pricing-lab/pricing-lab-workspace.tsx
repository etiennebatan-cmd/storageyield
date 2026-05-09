"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Euro, Radar, TrendingUp } from "lucide-react";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, Button, ImpactStat, SlideOver, Toasts, actionQuestion, formatEur } from "@/components/app-shell/shared-ui";

export function PricingLabWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [selected, setSelected] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState("");
  const selectedRow = workspace.snapshot.unitRows.find((row) => row.id === selected);
  const selectedAction = selectedRow ? workspace.snapshot.actions.find((action) => action.unit_type_id === selectedRow.id && action.category === "pricing" && action.status !== "completed") : undefined;

  useEffect(() => {
    if (selectedRow) setDraftPrice(String(selectedRow.street_rate));
  }, [selectedRow]);

  return (
    <div className="space-y-5">
      <Toasts items={workspace.toasts} />
      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={TrendingUp} label="Under-market opportunities" tone="green" value={workspace.snapshot.unitRows.filter((row) => (row.gap ?? 0) > 0 && row.occupancy >= 85).length} />
          <ImpactStat icon={AlertTriangle} label="Over-market risks" tone="red" value={workspace.snapshot.unitRows.filter((row) => (row.gap ?? 0) < 0 && row.occupancy < 75).length} />
          <ImpactStat icon={Euro} label="Discount leakage" tone="amber" value={formatEur(workspace.snapshot.units.reduce((sum, unit) => sum + Number(unit.discount_monthly ?? 0), 0))} />
          <ImpactStat icon={Radar} label="Missing mappings" tone="slate" value={workspace.snapshot.dataHealth.issues.filter((issue) => issue.id.includes("mapping")).length} />
          <ImpactStat icon={Check} label="Approved this month" tone="green" value={workspace.snapshot.actions.filter((action) => action.category === "pricing" && action.status === "approved").length} />
        </div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Facility</th>
                  <th className="px-4 py-3">Unit type</th>
                  <th className="px-4 py-3">Occupancy</th>
                  <th className="px-4 py-3">Demand 30d</th>
                  <th className="px-4 py-3">Street rate</th>
                  <th className="px-4 py-3">Market avg</th>
                  <th className="px-4 py-3">Gap</th>
                  <th className="px-4 py-3">Revenue/m²</th>
                  <th className="px-4 py-3">Discount leakage</th>
                  <th className="px-4 py-3">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workspace.snapshot.unitRows.map((row) => (
                  <tr className="hover:bg-slate-50" key={row.id}>
                    <td className="px-4 py-4">{row.facility_name}</td>
                    <td className="px-4 py-4"><button className="font-semibold text-slate-950 underline-offset-2 hover:underline" onClick={() => setSelected(row.id)} type="button">{row.name}</button></td>
                    <td className="px-4 py-4">{row.occupancy.toFixed(0)}%</td>
                    <td className="px-4 py-4">{row.demand30}</td>
                    <td className="px-4 py-4">{formatEur(row.street_rate)}</td>
                    <td className="px-4 py-4">{row.market_avg == null ? "n/a" : formatEur(row.market_avg)}</td>
                    <td className="px-4 py-4">{row.gap == null ? "n/a" : formatEur(row.gap)}</td>
                    <td className="px-4 py-4">{formatEur(row.rent_per_m2)}</td>
                    <td className="px-4 py-4">{formatEur(row.discount_leakage)}</td>
                    <td className="px-4 py-4"><Badge tone={row.recommendation.includes("Raise") ? "green" : row.recommendation.includes("Hold") ? "amber" : "slate"}>{row.recommendation}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </WorkspaceGate>
      {selectedRow ? (
        <SlideOver title={`${selectedRow.facility_name} · ${selectedRow.name}`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Current rate</p><p className="mt-1 text-2xl font-semibold">{formatEur(selectedRow.street_rate)}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Market average</p><p className="mt-1 text-2xl font-semibold">{selectedRow.market_avg == null ? "n/a" : formatEur(selectedRow.market_avg)}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Occupancy</p><p className="mt-1 text-2xl font-semibold">{selectedRow.occupancy.toFixed(0)}%</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Available units</p><p className="mt-1 text-2xl font-semibold">{selectedRow.units - selectedRow.occupied}</p></div>
            </div>
            <label className="block text-sm font-semibold text-slate-700">Edit street rate</label>
            <input className="w-full rounded-2xl border border-slate-300 p-3" type="number" value={draftPrice} onChange={(event) => setDraftPrice(event.target.value)} />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">Related decision</p>
              <p className="mt-2 text-sm text-slate-600">{selectedAction ? actionQuestion(selectedAction) : "No active pricing decision for this row. Generate decisions after refreshing signals."}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => workspace.updatePrice(selectedRow.id, Number(draftPrice))}>Save price</Button>
              {selectedAction ? <Button onClick={() => workspace.approveAction(selectedAction)} variant="secondary">Approve related decision</Button> : null}
            </div>
          </div>
        </SlideOver>
      ) : null}
    </div>
  );
}
