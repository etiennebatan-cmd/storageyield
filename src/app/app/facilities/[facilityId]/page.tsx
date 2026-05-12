import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { calculateFacilityMetrics } from "@/lib/calculations/metrics";

export default async function FacilityDetailPage({ params }: { params: { facilityId: string } }) {
  const supabase = createClient();
  const { data: facility } = await supabase.from("facilities").select("id,name").eq("id", params.facilityId).single();
  const { data: unitTypes } = await supabase
    .from("unit_types")
    .select("id,facility_id,name,size_m2,description,current_street_rate_monthly")
    .eq("facility_id", params.facilityId);
  const { data: units } = await supabase
    .from("units")
    .select("id,facility_id,unit_type_id,status,current_rent_monthly,discount_monthly,arrears_amount")
    .eq("facility_id", params.facilityId);
  const m = calculateFacilityMetrics((units ?? []) as never[], (unitTypes ?? []) as never[]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{facility?.name ?? "Facility"} metrics</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded border bg-white p-4">Total units: {m.total_units}</div>
        <div className="rounded border bg-white p-4">Occupied: {m.occupied_units}</div>
        <div className="rounded border bg-white p-4">Revenue: EUR {Math.round(m.current_monthly_rent)}</div>
        <div className="rounded border bg-white p-4">Arrears: EUR {Math.round(m.total_arrears)}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/app/facilities/${params.facilityId}/units`} className="inline-block rounded bg-slate-900 px-3 py-2 text-white">
          Manage units
        </Link>
        <Link href={`/app/facilities/${params.facilityId}/competitors`} className="inline-block rounded border border-slate-300 px-3 py-2">
          Open Market Radar
        </Link>
      </div>
    </div>
  );
}
