"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["available", "occupied", "reserved", "maintenance", "unavailable"] as const;

export function UnitInlineEditor(props: {
  unitId: string;
  currentStatus: string;
  currentRent: number | null;
}) {
  const [status, setStatus] = useState(props.currentStatus);
  const [rent, setRent] = useState(props.currentRent?.toString() ?? "");
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
      <select
        className="rounded border px-2 py-1"
        value={status}
        onChange={async (e) => {
          const previous = status;
          const next = e.target.value;
          setError("");
          setStatus(next);
          const res = await fetch("/api/units/update", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              unit_id: props.unitId,
              status: next
            })
          });
          if (!res.ok) {
            setStatus(previous);
            setError("Status update failed");
          } else {
            router.refresh();
          }
        }}
      >
        {statuses.map((s) => (
          <option value={s} key={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        className="w-24 rounded border px-2 py-1"
        value={rent}
        placeholder="rent"
        onChange={(e) => setRent(e.target.value)}
        onBlur={async () => {
          setError("");
          const res = await fetch("/api/units/update", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              unit_id: props.unitId,
              current_rent_monthly: rent ? Number(rent) : null
            })
          });
          if (!res.ok) {
            setError("Rent update failed");
          } else {
            router.refresh();
          }
        }}
      />
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
