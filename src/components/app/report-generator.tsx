"use client";

import { useState } from "react";

export function ReportGenerator({ facilityId }: { facilityId: string }) {
  const [text, setText] = useState("");
  return (
    <div className="space-y-2">
      <button
        type="button"
        className="rounded bg-slate-900 px-3 py-2 text-white"
        onClick={async () => {
          const res = await fetch("/api/reports/generate", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ facility_id: facilityId })
          });
          const data = await res.json();
          setText(res.ok ? data.summary : data.error || "Failed to generate report");
        }}
      >
        Generate weekly report
      </button>
      <textarea className="h-48 w-full rounded border bg-white p-3 text-sm" value={text} readOnly />
    </div>
  );
}
