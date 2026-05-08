import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { fetchCompetitorEvidenceRows } from "@/lib/competitors/queries";
import { demoCompetitorEvidenceRows } from "@/lib/competitors/demo";
import { demoCompetitors, demoFacilities, demoFacilityCompetitors } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/demo-mode";
import { Competitor, FacilityCompetitor } from "@/lib/types";
import { CompetitorEvidenceRow } from "@/lib/competitors/insights";

function latestComparableRows(rows: CompetitorEvidenceRow[]) {
  const map = new Map<string, CompetitorEvidenceRow>();
  for (const row of rows) {
    const key = `${row.own_unit_type_id}:${row.competitor_id}:${row.competitor_unit_type_id}`;
    const current = map.get(key);
    if (!current || Date.parse(row.observed_at ?? "") > Date.parse(current.observed_at ?? "")) {
      map.set(key, row);
    }
  }
  return Array.from(map.values());
}

function groupNames(
  type: "direct" | "partial" | "benchmark" | "ignored",
  relationships: Array<Pick<FacilityCompetitor, "competitor_id" | "relationship_type">>,
  competitors: Array<Pick<Competitor, "id" | "name">>
) {
  const competitorMap = new Map(competitors.map((competitor) => [competitor.id, competitor.name]));
  return relationships
    .filter((relationship) => relationship.relationship_type === type)
    .map((relationship) => competitorMap.get(relationship.competitor_id))
    .filter(Boolean)
    .join(", ") || "None";
}

function freshness(value: string | null) {
  if (!value) return { label: "No price", stale: true };
  const days = differenceInCalendarDays(new Date(), new Date(value));
  return { label: `${days} days ago`, stale: days > 30 };
}

export default async function FacilityCompetitorsPage({ params }: { params: { facilityId: string } }) {
  const demoMode = isDemoMode();
  let facility: { id: string; name: string } | null = null;
  let relationshipRows: FacilityCompetitor[] = [];
  let competitors: Competitor[] = [];
  let liveRows: CompetitorEvidenceRow[] = [];

  if (!demoMode) {
    const supabase = createClient();
    const { data: liveFacility } = await supabase.from("facilities").select("id,name").eq("id", params.facilityId).single();
    facility = liveFacility;
    const { data: relationships } = await supabase
      .from("facility_competitors")
      .select("id,facility_id,competitor_id,relationship_type,influence_weight,distance_km,notes")
      .eq("facility_id", params.facilityId);
    relationshipRows = (relationships ?? []) as FacilityCompetitor[];
    const competitorIds = relationshipRows.map((relationship) => relationship.competitor_id);
    const { data: competitorRows } = competitorIds.length
      ? await supabase.from("competitors").select("id,organization_id,name,website_url,pricing_url,city,address,country,notes,status").in("id", competitorIds)
      : { data: [] };
    competitors = (competitorRows ?? []) as Competitor[];
    liveRows = facility ? await fetchCompetitorEvidenceRows(supabase, params.facilityId) : [];
  }

  const demoFacility = demoFacilities.find((item) => item.id === params.facilityId) ?? demoFacilities[0];
  const useDemo = !facility || !liveRows.length;
  const pageFacility = useDemo ? demoFacility : facility ?? demoFacility;
  const rows = latestComparableRows(useDemo ? demoCompetitorEvidenceRows(pageFacility.id) : liveRows);
  const rels = useDemo ? demoFacilityCompetitors.filter((relationship) => relationship.facility_id === pageFacility.id) : relationshipRows;
  const comps = useDemo ? demoCompetitors : (competitors ?? []) as Competitor[];

  return (
    <div className="space-y-5">
      <div>
        <Link className="text-sm text-slate-600 underline-offset-2 hover:underline" href="/app/facilities">Back to facilities</Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{pageFacility.name} Market Radar</h1>
        <p className="text-sm text-slate-600">
          {useDemo ? "Demo workspace showing our price vs selected market evidence." : "Direct and partial competitors can be used in revenue decisions; benchmark and ignored competitors are displayed separately."}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="metric-card"><p className="text-xs uppercase tracking-wide text-slate-500">Direct competitor</p><p className="mt-2 text-sm font-medium">{groupNames("direct", rels, comps)}</p></div>
        <div className="metric-card"><p className="text-xs uppercase tracking-wide text-slate-500">Partial competitor</p><p className="mt-2 text-sm font-medium">{groupNames("partial", rels, comps)}</p></div>
        <div className="metric-card"><p className="text-xs uppercase tracking-wide text-slate-500">Benchmarks</p><p className="mt-2 text-sm font-medium">{groupNames("benchmark", rels, comps)}</p></div>
        <div className="metric-card"><p className="text-xs uppercase tracking-wide text-slate-500">Ignore for pricing</p><p className="mt-2 text-sm font-medium">{groupNames("ignored", rels, comps)}</p></div>
      </div>

      <div className="panel overflow-x-auto p-2 text-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="px-3 py-2">Own unit type</th>
              <th className="px-3 py-2">Our price</th>
              <th className="px-3 py-2">Competitor</th>
              <th className="px-3 py-2">Competitor unit</th>
              <th className="px-3 py-2">Competitor price</th>
              <th className="px-3 py-2">Difference</th>
              <th className="px-3 py-2">Relationship</th>
              <th className="px-3 py-2">Last checked</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const price = row.observed_price_monthly;
              const difference = price ? price - row.own_street_rate : null;
              const checked = freshness(row.observed_at);
              return (
                <tr key={`${row.own_unit_type_id}-${row.competitor_id}-${row.competitor_unit_type_id}`} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium">{row.own_unit_type_name}</td>
                  <td className="px-3 py-2">EUR {Math.round(row.own_street_rate)}</td>
                  <td className="px-3 py-2">{row.competitor_name}</td>
                  <td className="px-3 py-2">{row.competitor_unit_type_name}</td>
                  <td className="px-3 py-2">{price ? `EUR ${Math.round(price)}` : "-"}</td>
                  <td className="px-3 py-2">{difference !== null ? `${difference >= 0 ? "+" : ""}EUR ${Math.round(difference)}` : "-"}</td>
                  <td className="px-3 py-2">{row.relationship_type}</td>
                  <td className={`px-3 py-2 ${checked.stale ? "font-medium text-amber-700" : ""}`}>{checked.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
