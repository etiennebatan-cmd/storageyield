"use client";

import { useState } from "react";

export function BulkAddUnitsForm(props: { facilityId: string; unitTypes: Array<{ id: string; name: string }> }) {
  const [unitTypeId, setUnitTypeId] = useState(props.unitTypes[0]?.id ?? "");
  const [prefix, setPrefix] = useState("U-");
  const [start, setStart] = useState("1");
  const [count, setCount] = useState("10");
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-2 rounded border bg-white p-4 text-sm">
      <p className="font-medium">Bulk add units</p>
      <div className="flex flex-wrap gap-2">
        <select className="rounded border px-2 py-1" value={unitTypeId} onChange={(e) => setUnitTypeId(e.target.value)}>
          {props.unitTypes.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <input className="rounded border px-2 py-1" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="prefix" />
        <input className="w-20 rounded border px-2 py-1" value={start} onChange={(e) => setStart(e.target.value)} placeholder="start" />
        <input className="w-20 rounded border px-2 py-1" value={count} onChange={(e) => setCount(e.target.value)} placeholder="count" />
        <button
          type="button"
          className="rounded bg-slate-900 px-3 py-1 text-white"
          onClick={async () => {
            const res = await fetch("/api/units/bulk-create", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                facility_id: props.facilityId,
                unit_type_id: unitTypeId,
                prefix,
                start: Number(start),
                count: Number(count),
                status: "available"
              })
            });
            const data = await res.json();
            setMessage(res.ok ? `Inserted ${data.inserted} units` : data.error || "Failed");
          }}
        >
          Add
        </button>
      </div>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
