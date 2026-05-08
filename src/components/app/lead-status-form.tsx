"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["new", "contacted", "qualified", "converted", "lost"] as const;

export function LeadStatusForm(props: { leadId: string; current: string }) {
  const [value, setValue] = useState(props.current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="space-y-1">
      <select
        className="rounded border px-2 py-1"
        value={value}
        onChange={async (e) => {
          const previous = value;
          const status = e.target.value;
          setError("");
          setValue(status);
          setSaving(true);
          const res = await fetch("/api/leads/status", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              lead_id: props.leadId,
              status
            })
          });
          if (!res.ok) {
            setValue(previous);
            setError("Update failed");
          } else {
            router.refresh();
          }
          setSaving(false);
        }}
        disabled={saving}
      >
        {statuses.map((s) => (
          <option value={s} key={s}>
            {s}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
