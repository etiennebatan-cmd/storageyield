import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AssignCompetitorFacilityForm,
  CompetitorStatusButton,
  CompetitorUnitTypeForm,
  PriceObservationForm,
  RelationshipForm,
  UnitMappingForm
} from "@/components/app/competitor-forms";
import { createClient } from "@/lib/supabase/server";
import { Competitor, CompetitorPriceObservation, CompetitorUnitMapping, CompetitorUnitType, FacilityCompetitor, UnitType } from "@/lib/types";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString("en-GB") : "-";
}

export default async function CompetitorDetailPage({ params }: { params: { competitorId: string } }) {
  const supabase = createClient();
  const { data: competitor } = await supabase
    .from("competitors")
    .select("id,organization_id,name,website_url,pricing_url,city,address,country,notes,status")
    .eq("id", params.competitorId)
    .single();

  if (!competitor) notFound();

  const [{ data: relationships }, { data: competitorUnitTypes }, { data: observations }, { data: mappings }, { data: allFacilities }] = await Promise.all([
    supabase.from("facility_competitors").select("id,facility_id,competitor_id,relationship_type,influence_weight,distance_km,notes").eq("competitor_id", params.competitorId),
    supabase.from("competitor_unit_types").select("id,competitor_id,name,size_m2,volume_m3,access_type,climate_controlled,floor,description,source_url").eq("competitor_id", params.competitorId).order("name"),
    supabase
      .from("competitor_price_observations")
      .select("id,competitor_id,competitor_unit_type_id,observed_price_monthly,currency,promo_text,availability_text,source_url,observed_at,observation_method")
      .eq("competitor_id", params.competitorId)
      .order("observed_at", { ascending: false }),
    supabase.from("competitor_unit_mappings").select("id,facility_id,own_unit_type_id,competitor_id,competitor_unit_type_id,comparability_score,notes").eq("competitor_id", params.competitorId),
    supabase.from("facilities").select("id,name").order("name")
  ]);

  const relationshipRows = (relationships ?? []) as FacilityCompetitor[];
  const facilityIds = Array.from(new Set(relationshipRows.map((row) => row.facility_id)));
  const [{ data: assignedFacilities }, { data: ownUnitTypes }] = await Promise.all([
    facilityIds.length ? supabase.from("facilities").select("id,name").in("id", facilityIds) : { data: [] },
    facilityIds.length ? supabase.from("unit_types").select("id,facility_id,name,size_m2,current_street_rate_monthly").in("facility_id", facilityIds).order("name") : { data: [] }
  ]);

  const facilityMap = new Map(((assignedFacilities ?? []) as Array<{ id: string; name: string }>).map((facility) => [facility.id, facility]));
  const allFacilityOptions = ((allFacilities ?? []) as Array<{ id: string; name: string }>).map((facility) => ({ id: facility.id, name: facility.name }));
  const assignedIds = new Set(relationshipRows.map((row) => row.facility_id));
  const unassignedFacilities = allFacilityOptions.filter((facility) => !assignedIds.has(facility.id));
  const ownUnitTypeRows = (ownUnitTypes ?? []) as Array<UnitType & { current_street_rate_monthly: number }>;
  const competitorUnitTypeRows = (competitorUnitTypes ?? []) as CompetitorUnitType[];
  const observationRows = (observations ?? []) as CompetitorPriceObservation[];
  const mappingRows = (mappings ?? []) as CompetitorUnitMapping[];
  const competitorUnitTypeMap = new Map(competitorUnitTypeRows.map((unitType) => [unitType.id, unitType]));
  const ownUnitTypeMap = new Map(ownUnitTypeRows.map((unitType) => [unitType.id, unitType]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link className="text-sm text-slate-600 underline-offset-2 hover:underline" href="/app/market-radar">Back to Market Radar</Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{(competitor as Competitor).name}</h1>
          <p className="text-sm text-slate-600">Operator-selected market profile, pricing URLs, unit mappings, and manual observations.</p>
        </div>
        <CompetitorStatusButton competitorId={params.competitorId} status={(competitor as Competitor).status} />
      </div>

      <section className="panel p-5 text-sm">
        <h2 className="mb-3 text-lg font-semibold">Competitor profile</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <p><span className="font-medium">City:</span> {(competitor as Competitor).city ?? "-"}</p>
          <p><span className="font-medium">Status:</span> {(competitor as Competitor).status}</p>
          <p><span className="font-medium">Website:</span> {(competitor as Competitor).website_url ? <a className="underline-offset-2 hover:underline" href={(competitor as Competitor).website_url!}>{(competitor as Competitor).website_url}</a> : "-"}</p>
          <p><span className="font-medium">Pricing URL:</span> {(competitor as Competitor).pricing_url ? <a className="underline-offset-2 hover:underline" href={(competitor as Competitor).pricing_url!}>{(competitor as Competitor).pricing_url}</a> : "-"}</p>
          <p><span className="font-medium">Address:</span> {(competitor as Competitor).address ?? "-"}</p>
          <p><span className="font-medium">Country:</span> {(competitor as Competitor).country}</p>
        </div>
        {(competitor as Competitor).notes ? <p className="mt-3 text-slate-600">{(competitor as Competitor).notes}</p> : null}
      </section>

      <section className="panel space-y-4 p-5 text-sm">
        <div>
          <h2 className="text-lg font-semibold">Relationship to own facilities</h2>
          <p className="text-slate-600">Direct and partial competitors are used in revenue decisions. Benchmark only is shown as evidence. Ignore for pricing is never used.</p>
        </div>
        <div className="space-y-3">
          {relationshipRows.map((relationship) => (
            <div key={relationship.id} className="rounded border border-slate-200 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <Link className="font-medium underline-offset-2 hover:underline" href={`/app/facilities/${relationship.facility_id}/competitors`}>
                  {facilityMap.get(relationship.facility_id)?.name ?? "Facility"}
                </Link>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{relationship.relationship_type === "ignored" ? "Not used in decisions" : relationship.relationship_type === "benchmark" ? "Not used in decisions" : "Used in decisions"}</span>
              </div>
              <RelationshipForm
                competitorId={params.competitorId}
                distanceKm={relationship.distance_km}
                facilityId={relationship.facility_id}
                influenceWeight={Number(relationship.influence_weight)}
                notes={relationship.notes}
                relationshipType={relationship.relationship_type}
              />
            </div>
          ))}
        </div>
        <AssignCompetitorFacilityForm competitorId={params.competitorId} facilities={unassignedFacilities} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <CompetitorUnitTypeForm competitorId={params.competitorId} />
        <PriceObservationForm competitorId={params.competitorId} competitorUnitTypes={competitorUnitTypeRows.map((unitType) => ({ id: unitType.id, name: unitType.name, size_m2: unitType.size_m2 }))} defaultSourceUrl={(competitor as Competitor).pricing_url} />
      </section>

      <section className="panel p-5 text-sm">
        <h2 className="mb-3 text-lg font-semibold">Competitor unit types</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-slate-600"><th className="px-3 py-2">Name</th><th className="px-3 py-2">Size</th><th className="px-3 py-2">Access</th><th className="px-3 py-2">Source</th></tr></thead>
            <tbody>
              {competitorUnitTypeRows.map((unitType) => (
                <tr key={unitType.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium">{unitType.name}</td>
                  <td className="px-3 py-2">{unitType.size_m2 ? `${unitType.size_m2} m²` : "-"}</td>
                  <td className="px-3 py-2">{unitType.access_type ?? "-"}</td>
                  <td className="max-w-xs truncate px-3 py-2">{unitType.source_url ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-5 text-sm">
        <h2 className="mb-3 text-lg font-semibold">Price observations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-slate-600"><th className="px-3 py-2">Unit type</th><th className="px-3 py-2">Price</th><th className="px-3 py-2">Promo</th><th className="px-3 py-2">Availability</th><th className="px-3 py-2">Last checked</th></tr></thead>
            <tbody>
              {observationRows.map((observation) => (
                <tr key={observation.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{observation.competitor_unit_type_id ? competitorUnitTypeMap.get(observation.competitor_unit_type_id)?.name ?? "-" : "-"}</td>
                  <td className="px-3 py-2">EUR {Math.round(observation.observed_price_monthly)}</td>
                  <td className="px-3 py-2">{observation.promo_text ?? "-"}</td>
                  <td className="px-3 py-2">{observation.availability_text ?? "-"}</td>
                  <td className="px-3 py-2">{formatDate(observation.observed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {relationshipRows.map((relationship) => (
        <UnitMappingForm
          key={relationship.id}
          competitorId={params.competitorId}
          competitorUnitTypes={competitorUnitTypeRows.map((unitType) => ({ id: unitType.id, name: unitType.name, size_m2: unitType.size_m2 }))}
          facilityId={relationship.facility_id}
          ownUnitTypes={ownUnitTypeRows.filter((unitType) => unitType.facility_id === relationship.facility_id).map((unitType) => ({ id: unitType.id, name: unitType.name, size_m2: unitType.size_m2 }))}
        />
      ))}

      <section className="panel p-5 text-sm">
        <h2 className="mb-3 text-lg font-semibold">Unit mapping table</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-slate-600"><th className="px-3 py-2">Facility</th><th className="px-3 py-2">Own unit type</th><th className="px-3 py-2">Competitor unit</th><th className="px-3 py-2">Comparability</th><th className="px-3 py-2">Notes</th></tr></thead>
            <tbody>
              {mappingRows.map((mapping) => (
                <tr key={mapping.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{facilityMap.get(mapping.facility_id)?.name ?? "-"}</td>
                  <td className="px-3 py-2">{ownUnitTypeMap.get(mapping.own_unit_type_id)?.name ?? "-"}</td>
                  <td className="px-3 py-2">{competitorUnitTypeMap.get(mapping.competitor_unit_type_id)?.name ?? "-"}</td>
                  <td className="px-3 py-2">{Number(mapping.comparability_score).toFixed(1)}</td>
                  <td className="px-3 py-2">{mapping.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
