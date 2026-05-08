import { CompetitorEvidenceRow } from "@/lib/competitors/insights";
import type { createClient } from "@/lib/supabase/server";
import {
  Competitor,
  CompetitorPriceObservation,
  CompetitorRelationshipType,
  CompetitorStatus,
  CompetitorUnitMapping,
  CompetitorUnitType,
  FacilityCompetitor,
  UnitType
} from "@/lib/types";

type SupabaseReader = ReturnType<typeof createClient>;

type MappingRow = CompetitorUnitMapping;
type RelationshipRow = FacilityCompetitor;
type ObservationRow = CompetitorPriceObservation;

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" ? value : value === null || value === undefined ? null : Number(value);
}

export async function fetchCompetitorEvidenceRows(supabase: SupabaseReader, facilityId: string): Promise<CompetitorEvidenceRow[]> {
  const { data: mappings } = await supabase
    .from("competitor_unit_mappings")
    .select("id,facility_id,own_unit_type_id,competitor_id,competitor_unit_type_id,comparability_score,notes")
    .eq("facility_id", facilityId);

  const mappingRows = (mappings ?? []) as MappingRow[];
  if (!mappingRows.length) return [];

  const ownUnitTypeIds = Array.from(new Set(mappingRows.map((row) => row.own_unit_type_id)));
  const competitorIds = Array.from(new Set(mappingRows.map((row) => row.competitor_id)));
  const competitorUnitTypeIds = Array.from(new Set(mappingRows.map((row) => row.competitor_unit_type_id)));

  const [{ data: ownUnitTypes }, { data: competitors }, { data: relationships }, { data: competitorUnitTypes }, { data: observations }] = await Promise.all([
    supabase.from("unit_types").select("id,facility_id,name,size_m2,description,current_street_rate_monthly").in("id", ownUnitTypeIds),
    supabase.from("competitors").select("id,organization_id,name,website_url,pricing_url,city,address,country,notes,status").in("id", competitorIds),
    supabase.from("facility_competitors").select("id,facility_id,competitor_id,relationship_type,influence_weight,distance_km,notes").eq("facility_id", facilityId).in("competitor_id", competitorIds),
    supabase.from("competitor_unit_types").select("id,competitor_id,name,size_m2,volume_m3,access_type,climate_controlled,floor,description,source_url").in("id", competitorUnitTypeIds),
    supabase
      .from("competitor_price_observations")
      .select("id,competitor_id,competitor_unit_type_id,observed_price_monthly,currency,promo_text,availability_text,source_url,observed_at,observation_method")
      .in("competitor_unit_type_id", competitorUnitTypeIds)
      .order("observed_at", { ascending: false })
  ]);

  const ownById = new Map(((ownUnitTypes ?? []) as UnitType[]).map((row) => [row.id, row]));
  const competitorById = new Map(((competitors ?? []) as Competitor[]).map((row) => [row.id, row]));
  const relationshipByCompetitorId = new Map(((relationships ?? []) as RelationshipRow[]).map((row) => [row.competitor_id, row]));
  const competitorUnitTypeById = new Map(((competitorUnitTypes ?? []) as CompetitorUnitType[]).map((row) => [row.id, row]));
  const observationsByUnitTypeId = new Map<string, ObservationRow[]>();

  for (const observation of (observations ?? []) as ObservationRow[]) {
    if (!observation.competitor_unit_type_id) continue;
    const group = observationsByUnitTypeId.get(observation.competitor_unit_type_id) ?? [];
    group.push(observation);
    observationsByUnitTypeId.set(observation.competitor_unit_type_id, group);
  }

  const rows: CompetitorEvidenceRow[] = [];
  for (const mapping of mappingRows) {
    const own = ownById.get(mapping.own_unit_type_id);
    const competitor = competitorById.get(mapping.competitor_id);
    const relationship = relationshipByCompetitorId.get(mapping.competitor_id);
    const competitorUnitType = competitorUnitTypeById.get(mapping.competitor_unit_type_id);
    if (!own || !competitor || !relationship || !competitorUnitType) continue;

    const observationsForMapping = observationsByUnitTypeId.get(mapping.competitor_unit_type_id) ?? [];
    if (!observationsForMapping.length) {
      rows.push({
        facility_id: facilityId,
        own_unit_type_id: own.id,
        own_unit_type_name: own.name,
        own_street_rate: Number(own.current_street_rate_monthly),
        competitor_id: competitor.id,
        competitor_name: competitor.name,
        competitor_status: competitor.status as CompetitorStatus,
        relationship_type: relationship.relationship_type as CompetitorRelationshipType,
        influence_weight: Number(relationship.influence_weight),
        competitor_unit_type_id: competitorUnitType.id,
        competitor_unit_type_name: competitorUnitType.name,
        competitor_size_m2: numberOrNull(competitorUnitType.size_m2),
        comparability_score: Number(mapping.comparability_score),
        observed_price_monthly: null,
        currency: "EUR",
        observed_at: null,
        source_url: competitorUnitType.source_url
      });
      continue;
    }

    for (const observation of observationsForMapping) {
      rows.push({
        facility_id: facilityId,
        own_unit_type_id: own.id,
        own_unit_type_name: own.name,
        own_street_rate: Number(own.current_street_rate_monthly),
        competitor_id: competitor.id,
        competitor_name: competitor.name,
        competitor_status: competitor.status as CompetitorStatus,
        relationship_type: relationship.relationship_type as CompetitorRelationshipType,
        influence_weight: Number(relationship.influence_weight),
        competitor_unit_type_id: competitorUnitType.id,
        competitor_unit_type_name: competitorUnitType.name,
        competitor_size_m2: numberOrNull(competitorUnitType.size_m2),
        comparability_score: Number(mapping.comparability_score),
        observed_price_monthly: Number(observation.observed_price_monthly),
        currency: observation.currency,
        observed_at: observation.observed_at,
        source_url: observation.source_url ?? competitorUnitType.source_url
      });
    }
  }

  return rows;
}
