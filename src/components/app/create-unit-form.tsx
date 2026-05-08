"use client";

import { useState } from "react";

export function CreateUnitForm({ facilityId, unitTypes }: { facilityId: string; unitTypes: Array<{ id: string; name: string }> }) {
  const [unitTypeId, setUnitTypeId] = useState(unitTypes[0]?.id ?? "");
  const [unitCode, setUnitCode] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div className="space-y-2 rounded border bg-white p-4 text-sm">
      <p className="font-medium">Create single unit</p>
      <div className="flex flex-wrap gap-2">
        <select className="rounded border px-2 py-1" value={unitTypeId} onChange={(e) => setUnitTypeId(e.target.value)}>
          {unitTypes.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <input className="rounded border px-2 py-1" placeholder="unit code" value={unitCode} onChange={(e) => setUnitCode(e.target.value)} />
        <button
          className="rounded bg-slate-900 px-3 py-1 text-white"
          type="button"
          onClick={async () => {
            const res = await fetch("/api/units/create", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ facility_id: facilityId, unit_type_id: unitTypeId, unit_code: unitCode, status: "available" })
            });
            setMsg(res.ok ? "Unit created" : "Failed");
          }}
        >
          Add
        </button>
      </div>
      {msg ? <p>{msg}</p> : null}
    </div>
  );
}
