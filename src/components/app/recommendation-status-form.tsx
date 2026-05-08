"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["open", "accepted", "dismissed", "completed"] as const;

export function RecommendationStatusForm(props: {
  recommendationId: string;
  current: string;
}) {
  const [value, setValue] = useState(props.current);
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
          const res = await fetch("/api/recommendations/status", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              recommendation_id: props.recommendationId,
              status
            })
          });
          if (!res.ok) {
            setValue(previous);
            setError("Update failed");
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
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function RecommendationQuickActions(props: { recommendationId: string }) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const update = async (status: string) => {
    setMessage("");
    const res = await fetch("/api/recommendations/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        recommendation_id: props.recommendationId,
        status
      })
    });
    setMessage(res.ok ? "Saved" : "Update failed");
    if (res.ok) router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="rounded bg-slate-900 px-3 py-1 text-white" type="button" onClick={() => update("accepted")}>Apply recommendation</button>
      <button className="rounded border border-slate-300 px-3 py-1" type="button" onClick={() => update("completed")}>Mark done</button>
      <button className="rounded border border-slate-300 px-3 py-1" type="button" onClick={() => update("dismissed")}>Dismiss</button>
      {message ? <span className="text-xs text-slate-600">{message}</span> : null}
    </div>
  );
}
