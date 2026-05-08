"use client";

import { useState } from "react";

export function CsvImportUnitsForm({ facilityId }: { facilityId: string }) {
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-2 rounded border bg-white p-4 text-sm">
      <p className="font-medium">CSV import units</p>
      <p className="text-slate-600">
        Required columns: unit_code, unit_type_name, size_m2, status, current_rent_monthly. Optional:
        tenant_start_date, tenant_type, discount_monthly, arrears_amount.
      </p>
      <input
        type="file"
        accept=".csv"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const fd = new FormData();
          fd.append("facility_id", facilityId);
          fd.append("file", file);
          const res = await fetch("/api/units/import-csv", { method: "POST", body: fd });
          const data = await res.json();
          setMessage(res.ok ? `Imported ${data.inserted} units` : data.error || "Import failed");
        }}
      />
      {message ? <p>{message}</p> : null}
    </div>
  );
}
