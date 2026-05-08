import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WidgetForm } from "@/components/widget/widget-form";
import { demoFacilities, demoUnitTypes, demoUnits } from "@/lib/demo-data";

type PublicUnitType = {
  id: string;
  name: string;
  size_m2: number;
  description: string | null;
  current_street_rate_monthly: number;
};

type AvailabilityRow = {
  unit_type_id: string;
  availability_count: number | string;
};

export default async function WidgetPage({ params }: { params: { public_slug: string } }) {
  if (params.public_slug === "brussels-north-storage") {
    const demoFacility = demoFacilities.find((item) => item.public_slug === "brussels-north-storage")!;
    const unitTypes = demoUnitTypes
      .filter((unitType) => unitType.facility_id === demoFacility.id)
      .map((unitType) => ({
        ...unitType,
        availability_count: demoUnits.filter((unit) => unit.unit_type_id === unitType.id && unit.status === "available").length
      }));

    return (
      <main className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Demo booking widget</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">{demoFacility.name}</h1>
            <p className="text-sm text-slate-600">Choose a unit and send a move-in request. The operator sees it in the booking queue.</p>
          </div>
          <WidgetForm facility={{ id: demoFacility.id, name: demoFacility.name }} unitTypes={unitTypes} />
        </div>
      </main>
    );
  }

  const supabase = createClient();
  const { data: facility } = await supabase
    .from("facilities")
    .select("id, name, city, public_slug")
    .eq("public_slug", params.public_slug)
    .single();

  if (!facility) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">Facility not found</h1>
          <p className="mt-2 text-sm text-slate-600">This booking widget link does not match an active facility.</p>
          <Link className="mt-4 inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/demo">
            Back to demo
          </Link>
        </div>
      </main>
    );
  }

  const { data: unitTypes } = await supabase
    .from("unit_types")
    .select("id, name, size_m2, description, current_street_rate_monthly")
    .eq("facility_id", facility.id)
    .eq("is_public", true);
  const { data: availability } = await supabase.rpc("get_public_unit_type_availability", { p_facility_id: facility.id });
  const availabilityByUnitType = new Map(
    ((availability ?? []) as AvailabilityRow[]).map((row) => [row.unit_type_id, Number(row.availability_count)])
  );

  const availabilityByType = ((unitTypes ?? []) as PublicUnitType[]).map((ut) => ({
    ...ut,
    availability_count: availabilityByUnitType.get(ut.id) ?? 0
  }));

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Booking widget</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">{facility.name}</h1>
          <p className="text-sm text-slate-600">Select a unit type and submit your move-in request.</p>
        </div>
        <WidgetForm facility={facility} unitTypes={availabilityByType} />
      </div>
    </main>
  );
}
