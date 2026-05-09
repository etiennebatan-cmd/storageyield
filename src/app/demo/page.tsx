import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, MousePointer2, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";
import { actionCenterKpis, eur } from "@/lib/operator-demo";
import { demoFacilities, demoUnits } from "@/lib/demo-data";
import { FacilityAssetScene } from "@/components/demo/facility-asset-scene";

type DemoKpi = {
  label: string;
  value: string | number;
  Icon: ComponentType<{ className?: string }>;
};

type SceneFacility = {
  name: string;
  occupancy_pct: number;
  occupied_units: number;
  available_units: number;
  reserved_units: number;
  maintenance_units: number;
  monthly_rent: number;
};

export default function DemoPage() {
  const kpis = actionCenterKpis();

  const sceneFacilities: SceneFacility[] = demoFacilities.map((facility) => {
    const units = demoUnits.filter((unit) => unit.facility_id === facility.id);
    const occupied_units = units.filter((unit) => unit.status === "occupied").length;
    const available_units = units.filter((unit) => unit.status === "available").length;
    const reserved_units = units.filter((unit) => unit.status === "reserved").length;
    const maintenance_units = units.filter((unit) => unit.status === "maintenance").length;
    const monthly_rent = units.reduce((sum, unit) => sum + (unit.current_rent_monthly ?? 0), 0);
    const occupancy_pct = units.length ? Math.round((occupied_units / units.length) * 100) : 0;

    return {
      name: facility.name,
      occupancy_pct,
      occupied_units,
      available_units,
      reserved_units,
      maintenance_units,
      monthly_rent
    };
  });

  const totalOccupied = sceneFacilities.reduce((sum, facility) => sum + facility.occupied_units, 0);
  const totalAvailable = sceneFacilities.reduce((sum, facility) => sum + facility.available_units, 0);
  const totalRevenue = sceneFacilities.reduce((sum, facility) => sum + facility.monthly_rent, 0);

  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="container-page pt-20 pb-10">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-end lg:gap-16 p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Demo workspace</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Revenue intelligence for independent self-storage operators.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                A simple, modern cockpit that brings occupancy, pricing, competitor insights and action items into one practical workflow.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" href="/app/decisions?demo=1">
                  Open operator cockpit <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-400" href="/widget/brussels-north-storage">
                  View booking widget
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Small portfolio fit</p>
                <p className="mt-4 text-xl font-semibold text-slate-950">Fast setup for independent operators.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Clear next steps</p>
                <p className="mt-4 text-xl font-semibold text-slate-950">Signal-driven actions, not guesswork.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="grid gap-5 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
          {([
            { label: "Money left on table", value: eur(kpis.money_left_on_table), Icon: TrendingUp },
            { label: "Bookings needing action", value: kpis.bookings_needing_action, Icon: MousePointer2 },
            { label: "Unit types under market", value: kpis.unit_types_under_market, Icon: BarChart3 },
            { label: "Discount leakage", value: eur(kpis.discount_leakage), Icon: CheckCircle2 }
          ] satisfies DemoKpi[]).map(({ label, value, Icon }) => (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" key={label}>
              <div className="flex items-center justify-between text-slate-500">
                <p className="text-xs font-semibold uppercase tracking-[0.24em]">{label}</p>
                <Icon className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-5 text-3xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Portfolio overview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                One interactive model, every facility visible at a glance.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The 3D overview turns occupancy, unit status and rental momentum into an intuitive dashboard for operational decisions.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Occupied</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">{totalOccupied}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Available</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">{totalAvailable}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rent roll</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">{eur(totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden border-t border-slate-200 bg-slate-100">
            <div className="relative h-[520px]">
              <FacilityAssetScene facilities={sceneFacilities} />
            </div>
            <div className="border-t border-slate-200 bg-white/90 px-6 py-4 text-sm text-slate-600">
              Interactive 3D status for portfolio occupancy, availability and revenue pressure.
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            ["Pricing intelligence", "Signal-led pricing decisions for units that are under market or showing strong demand."],
            ["Action feed", "Clear next steps from the system without guessing what to focus on first."],
            ["Independent focus", "Designed for small portfolios with low setup, fast adoption and operational clarity."]
          ].map(([title, copy]) => (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" key={title}>
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
