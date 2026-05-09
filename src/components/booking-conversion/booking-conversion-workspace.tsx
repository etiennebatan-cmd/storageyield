"use client";

import { useEffect, useState } from "react";
import type { OperatorBooking } from "@/lib/operator-demo";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, Button, SlideOver, Toasts, ageLabel, formatEur, leadScore } from "@/components/app-shell/shared-ui";

export function BookingConversionWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [selected, setSelected] = useState<OperatorBooking | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const columns: Array<{ id: OperatorBooking["status"]; label: string }> = [
    { id: "requested", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "reserved", label: "Reserved" },
    { id: "converted", label: "Converted" },
    { id: "lost", label: "Lost" }
  ];

  useEffect(() => {
    if (!selected) return;
    const first = workspace.snapshot.units.find((unit) => unit.unit_type_id === selected.unit_type_id && unit.status === "available");
    setSelectedUnitId(first?.id ?? "");
  }, [selected, workspace.snapshot.units]);

  return (
    <div className="space-y-5">
      <Toasts items={workspace.toasts} />
      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 xl:grid-cols-5">
          {columns.map((column) => {
            const rows = workspace.snapshot.bookings.filter((booking) => booking.status === column.id);
            return (
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4" key={column.id}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-950">{column.label}</h2>
                  <Badge>{rows.length}</Badge>
                </div>
                <div className="space-y-3">
                  {rows.map((booking) => (
                    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" key={booking.id}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-950">{booking.customer_name}</h3>
                        <Badge tone={leadScore(booking) >= 70 ? "green" : leadScore(booking) >= 45 ? "amber" : "slate"}>{leadScore(booking)}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{booking.unit_type_name} · {booking.facility_name}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{formatEur(booking.quoted_monthly_rate)}/mo expected</p>
                      <p className="mt-2 text-sm text-slate-600">Move-in {booking.preferred_move_in_date} · age {ageLabel(booking.created_at)}</p>
                      <p className="mt-3 text-sm text-slate-700">{booking.next_action}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {booking.status === "requested" ? <Button onClick={() => workspace.moveBooking(booking, "contacted")} variant="secondary">Contacted</Button> : null}
                        {["requested", "contacted"].includes(booking.status) ? <Button onClick={() => setSelected(booking)} variant="secondary">Assign unit</Button> : null}
                        {booking.status === "reserved" ? <Button onClick={() => workspace.moveBooking(booking, "converted")} variant="secondary">Convert</Button> : null}
                        {!["converted", "lost"].includes(booking.status) ? <Button onClick={() => workspace.moveBooking(booking, "lost")} variant="ghost">Lost</Button> : null}
                        <Button onClick={() => { navigator.clipboard.writeText(`Hi ${booking.customer_name}, we can reserve your ${booking.unit_type_name} at ${booking.facility_name}. Are you available today to confirm?`); workspace.toast("Follow-up copied"); }} variant="ghost">Copy follow-up</Button>
                      </div>
                    </article>
                  ))}
                  {!rows.length ? <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No bookings here.</p> : null}
                </div>
              </section>
            );
          })}
        </div>
      </WorkspaceGate>
      {selected ? (
        <SlideOver title={`Assign unit: ${selected.customer_name}`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{selected.unit_type_name} at {selected.facility_name}</p>
            <select className="w-full rounded-2xl border border-slate-300 p-3" value={selectedUnitId} onChange={(event) => setSelectedUnitId(event.target.value)}>
              {workspace.snapshot.units.filter((unit) => unit.unit_type_id === selected.unit_type_id && unit.status === "available").map((unit) => <option key={unit.id} value={unit.id}>{unit.id}</option>)}
            </select>
            {!selectedUnitId ? <p className="text-sm text-red-600">No available unit found for this unit type.</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button disabled={!selectedUnitId} onClick={() => { workspace.moveBooking(selected, "reserved", selectedUnitId); setSelected(null); }}>Reserve selected unit</Button>
              <Button disabled={!selectedUnitId} onClick={() => { workspace.moveBooking(selected, "converted", selectedUnitId); setSelected(null); }} variant="secondary">Convert now</Button>
            </div>
          </div>
        </SlideOver>
      ) : null}
    </div>
  );
}
