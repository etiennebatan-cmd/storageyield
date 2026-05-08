"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["requested", "reserved", "approved", "rejected", "cancelled", "converted"] as const;

export function BookingStatusForm(props: {
  bookingId: string;
  current: string;
  availableUnits: Array<{ id: string; unit_code: string }>;
  selectedUnitId: string | null;
  quotedMonthlyRate: number | null;
}) {
  const [status, setStatus] = useState(props.current);
  const [selectedUnitId, setSelectedUnitId] = useState(props.selectedUnitId ?? "");
  const [rate, setRate] = useState(props.quotedMonthlyRate?.toString() ?? "");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const save = async (nextStatus: string) => {
    setMessage("");
    const res = await fetch("/api/bookings/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        booking_id: props.bookingId,
        status: nextStatus,
        selected_unit_id: selectedUnitId || null,
        quoted_monthly_rate: rate ? Number(rate) : null
      })
    });
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setMessage("Saved");
    router.refresh();
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
      <select
        className="rounded border px-2 py-1"
        value={status}
        onChange={async (e) => {
          const next = e.target.value;
          setStatus(next);
          await save(next);
        }}
      >
        {statuses.map((s) => (
          <option value={s} key={s}>
            {s}
          </option>
        ))}
      </select>
      <select className="rounded border px-2 py-1" value={selectedUnitId} onChange={(e) => setSelectedUnitId(e.target.value)}>
        <option value="">assign unit</option>
        {props.availableUnits.map((u) => (
          <option key={u.id} value={u.id}>
            {u.unit_code}
          </option>
        ))}
      </select>
      <input className="w-24 rounded border px-2 py-1" placeholder="rate" value={rate} onChange={(e) => setRate(e.target.value)} />
      <button
        className="rounded bg-slate-800 px-2 py-1 text-white"
        onClick={async () => {
          await save(status);
        }}
        type="button"
      >
        Save
      </button>
      </div>
      {message ? <p className="text-xs text-slate-600">{message}</p> : null}
    </div>
  );
}
