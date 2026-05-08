"use client";

import { useState } from "react";

export function CreateUnitTypeForm({ facilityId }: { facilityId: string }) {
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [rate, setRate] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div className="space-y-2 rounded border bg-white p-4 text-sm">
      <p className="font-medium">Create unit type</p>
      <div className="flex flex-wrap gap-2">
        <input className="rounded border px-2 py-1" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-24 rounded border px-2 py-1" placeholder="size_m2" value={size} onChange={(e) => setSize(e.target.value)} />
        <input className="w-28 rounded border px-2 py-1" placeholder="street rate" value={rate} onChange={(e) => setRate(e.target.value)} />
        <button
          className="rounded bg-slate-900 px-3 py-1 text-white"
          type="button"
          onClick={async () => {
            const res = await fetch("/api/unit-types/create", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                facility_id: facilityId,
                name,
                size_m2: Number(size),
                current_street_rate_monthly: Number(rate)
              })
            });
            setMsg(res.ok ? "Unit type created" : "Failed");
          }}
        >
          Add
        </button>
      </div>
      {msg ? <p>{msg}</p> : null}
    </div>
  );
}
