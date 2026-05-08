import {
  demoCompetitorPriceObservations,
  demoCompetitors,
  demoCompetitorUnitMappings,
  demoCompetitorUnitTypes,
  demoFacilityCompetitors,
  demoUnitTypes
} from "@/lib/demo-data";
import { CompetitorEvidenceRow } from "@/lib/competitors/insights";

export function demoCompetitorEvidenceRows(facilityId?: string): CompetitorEvidenceRow[] {
  const mappings = facilityId ? demoCompetitorUnitMappings.filter((mapping) => mapping.facility_id === facilityId) : demoCompetitorUnitMappings;
  const rows: CompetitorEvidenceRow[] = [];

  for (const mapping of mappings) {
    const own = demoUnitTypes.find((unitType) => unitType.id === mapping.own_unit_type_id);
    const competitor = demoCompetitors.find((item) => item.id === mapping.competitor_id);
    const relationship = demoFacilityCompetitors.find((item) => item.facility_id === mapping.facility_id && item.competitor_id === mapping.competitor_id);
    const competitorUnitType = demoCompetitorUnitTypes.find((item) => item.id === mapping.competitor_unit_type_id);
    if (!own || !competitor || !relationship || !competitorUnitType) continue;

    const observations = demoCompetitorPriceObservations.filter((observation) => observation.competitor_unit_type_id === competitorUnitType.id);
    if (!observations.length) {
      rows.push({
        facility_id: mapping.facility_id,
        own_unit_type_id: own.id,
        own_unit_type_name: own.name,
        own_street_rate: own.current_street_rate_monthly,
        competitor_id: competitor.id,
        competitor_name: competitor.name,
        competitor_status: competitor.status,
        relationship_type: relationship.relationship_type,
        influence_weight: relationship.influence_weight,
        competitor_unit_type_id: competitorUnitType.id,
        competitor_unit_type_name: competitorUnitType.name,
        competitor_size_m2: competitorUnitType.size_m2,
        comparability_score: mapping.comparability_score,
        observed_price_monthly: null,
        currency: "EUR",
        observed_at: null,
        source_url: competitorUnitType.source_url
      });
      continue;
    }

    for (const observation of observations) {
      rows.push({
        facility_id: mapping.facility_id,
        own_unit_type_id: own.id,
        own_unit_type_name: own.name,
        own_street_rate: own.current_street_rate_monthly,
        competitor_id: competitor.id,
        competitor_name: competitor.name,
        competitor_status: competitor.status,
        relationship_type: relationship.relationship_type,
        influence_weight: relationship.influence_weight,
        competitor_unit_type_id: competitorUnitType.id,
        competitor_unit_type_name: competitorUnitType.name,
        competitor_size_m2: competitorUnitType.size_m2,
        comparability_score: mapping.comparability_score,
        observed_price_monthly: observation.observed_price_monthly,
        currency: observation.currency,
        observed_at: observation.observed_at,
        source_url: observation.source_url ?? competitorUnitType.source_url
      });
    }
  }

  return rows;
}
