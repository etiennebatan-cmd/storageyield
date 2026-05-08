"use client";

import { useState } from "react";

export function RecommendationGenerator({ facilityId }: { facilityId: string }) {
  const [message, setMessage] = useState("");
  return (
    <div className="mb-2">
      <button
        className="rounded bg-slate-900 px-3 py-2 text-white"
        type="button"
        onClick={async () => {
          const res = await fetch("/api/recommendations/generate", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ facility_id: facilityId })
          });
          const data = await res.json();
          setMessage(res.ok ? `Generated ${data.inserted} recommendations` : data.error || "Failed");
        }}
      >
        Generate recommendations now
      </button>
      {message ? <p className="mt-1 text-sm">{message}</p> : null}
    </div>
  );
}
