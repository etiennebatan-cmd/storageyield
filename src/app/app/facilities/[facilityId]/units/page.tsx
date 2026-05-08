import { createClient } from "@/lib/supabase/server";
import { UnitInlineEditor } from "@/components/app/unit-inline-editor";
import { BulkAddUnitsForm } from "@/components/app/bulk-add-units-form";
import { CsvImportUnitsForm } from "@/components/app/csv-import-units-form";
import { CreateUnitTypeForm } from "@/components/app/create-unit-type-form";
import { CreateUnitForm } from "@/components/app/create-unit-form";

export default async function FacilityUnitsPage({ params }: { params: { facilityId: string } }) {
  const supabase = createClient();
  const { data: unitTypes } = await supabase
    .from("unit_types")
    .select("id,name,size_m2,current_street_rate_monthly")
    .eq("facility_id", params.facilityId);
  const { data: units } = await supabase
    .from("units")
    .select("id,unit_code,unit_type_id,status,current_rent_monthly")
    .eq("facility_id", params.facilityId)
    .order("unit_code");
  const unitTypeMap = new Map((unitTypes ?? []).map((u) => [u.id, u]));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Units & unit types</h1>
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-medium">Unit types</h2>
        <ul className="space-y-1 text-sm">{(unitTypes ?? []).map((u) => <li key={u.id}>{u.name} - {u.size_m2} m² - EUR {u.current_street_rate_monthly}</li>)}</ul>
      </div>
      <CreateUnitTypeForm facilityId={params.facilityId} />
      <CreateUnitForm facilityId={params.facilityId} unitTypes={(unitTypes ?? []).map((u) => ({ id: u.id, name: u.name }))} />
      <BulkAddUnitsForm facilityId={params.facilityId} unitTypes={(unitTypes ?? []).map((u) => ({ id: u.id, name: u.name }))} />
      <CsvImportUnitsForm facilityId={params.facilityId} />
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-medium">Units</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>Code</th><th>Type</th><th>Status / Rent</th>
            </tr>
          </thead>
          <tbody>
            {(units ?? []).map((u) => (
              <tr key={u.id}>
                <td>{u.unit_code}</td>
                <td>{unitTypeMap.get(u.unit_type_id)?.name ?? "-"}</td>
                <td>
                  <UnitInlineEditor
                    unitId={u.id}
                    currentStatus={u.status}
                    currentRent={u.current_rent_monthly}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
