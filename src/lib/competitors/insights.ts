import { differenceInCalendarDays } from "date-fns";
import { CompetitorRelationshipType, CompetitorStatus } from "@/lib/types";

export interface CompetitorEvidenceRow {
  facility_id: string;
  own_unit_type_id: string;
  own_unit_type_name: string;
  own_street_rate: number;
  competitor_id: string;
  competitor_name: string;
  competitor_status: CompetitorStatus;
  relationship_type: CompetitorRelationshipType;
  influence_weight: number;
  competitor_unit_type_id: string;
  competitor_unit_type_name: string;
  competitor_size_m2: number | null;
  comparability_score: number;
  observed_price_monthly: number | null;
  currency: string;
  observed_at: string | null;
  source_url: string | null;
}

export interface CompetitorConsidered {
  competitor: string;
  competitor_unit_type: string;
  price: number;
  relationship_type: CompetitorRelationshipType;
  influence_weight: number;
  observed_at: string;
  days_old: number;
}

export interface CompetitorExcluded {
  competitor: string;
  competitor_unit_type: string;
  relationship_type: CompetitorRelationshipType;
  reason: string;
}

export interface UnitTypeCompetitorEvidence {
  unit_type_id: string;
  own_unit_type_name: string;
  own_street_rate: number;
  weighted_competitor_average: number | null;
  valid_observation_count: number;
  direct_competitor_count: number;
  benchmark_count: number;
  stale_price_count: number;
  last_checked: string | null;
  considered: CompetitorConsidered[];
  excluded: CompetitorExcluded[];
}

function latestByMapping(rows: CompetitorEvidenceRow[]) {
  const map = new Map<string, CompetitorEvidenceRow>();
  for (const row of rows) {
    const key = `${row.own_unit_type_id}:${row.competitor_unit_type_id}:${row.competitor_id}`;
    const current = map.get(key);
    if (!current || Date.parse(row.observed_at ?? "") > Date.parse(current.observed_at ?? "")) {
      map.set(key, row);
    }
  }
  return Array.from(map.values());
}

export function buildCompetitorEvidenceByUnitType(
  rows: CompetitorEvidenceRow[],
  now: Date = new Date()
): Record<string, UnitTypeCompetitorEvidence> {
  const result: Record<string, UnitTypeCompetitorEvidence> = {};
  const latestRows = latestByMapping(rows);

  for (const row of latestRows) {
    const evidence = result[row.own_unit_type_id] ?? {
      unit_type_id: row.own_unit_type_id,
      own_unit_type_name: row.own_unit_type_name,
      own_street_rate: row.own_street_rate,
      weighted_competitor_average: null,
      valid_observation_count: 0,
      direct_competitor_count: 0,
      benchmark_count: 0,
      stale_price_count: 0,
      last_checked: null,
      considered: [],
      excluded: []
    };

    const competitorLabel = row.competitor_name;
    const unitLabel = row.competitor_unit_type_name;
    const observedAt = row.observed_at;
    const daysOld = observedAt ? differenceInCalendarDays(now, new Date(observedAt)) : null;
    if (observedAt && (!evidence.last_checked || Date.parse(observedAt) > Date.parse(evidence.last_checked))) {
      evidence.last_checked = observedAt;
    }
    if (daysOld !== null && daysOld > 30) {
      evidence.stale_price_count += 1;
    }

    if (row.relationship_type === "benchmark") {
      evidence.benchmark_count += 1;
    }

    if (row.competitor_status !== "active") {
      evidence.excluded.push({ competitor: competitorLabel, competitor_unit_type: unitLabel, relationship_type: row.relationship_type, reason: "inactive" });
    } else if (row.relationship_type === "ignored") {
      evidence.excluded.push({ competitor: competitorLabel, competitor_unit_type: unitLabel, relationship_type: row.relationship_type, reason: "marked ignore for pricing" });
    } else if (row.relationship_type === "benchmark") {
      evidence.excluded.push({ competitor: competitorLabel, competitor_unit_type: unitLabel, relationship_type: row.relationship_type, reason: "benchmark only" });
    } else if (!row.observed_price_monthly || !observedAt) {
      evidence.excluded.push({ competitor: competitorLabel, competitor_unit_type: unitLabel, relationship_type: row.relationship_type, reason: "no price observation" });
    } else if (daysOld !== null && daysOld > 45) {
      evidence.excluded.push({ competitor: competitorLabel, competitor_unit_type: unitLabel, relationship_type: row.relationship_type, reason: "price older than 45 days" });
    } else {
      evidence.valid_observation_count += 1;
      if (row.relationship_type === "direct") {
        evidence.direct_competitor_count += 1;
      }
      evidence.considered.push({
        competitor: competitorLabel,
        competitor_unit_type: unitLabel,
        price: row.observed_price_monthly,
        relationship_type: row.relationship_type,
        influence_weight: row.influence_weight,
        observed_at: observedAt,
        days_old: daysOld ?? 0
      });
    }

    result[row.own_unit_type_id] = evidence;
  }

  for (const evidence of Object.values(result)) {
    const numerator = evidence.considered.reduce((sum, item) => {
      const source = latestRows.find((row) =>
        row.own_unit_type_id === evidence.unit_type_id &&
        row.competitor_name === item.competitor &&
        row.competitor_unit_type_name === item.competitor_unit_type
      );
      const comparability = source?.comparability_score ?? 1;
      return sum + item.price * item.influence_weight * comparability;
    }, 0);
    const denominator = evidence.considered.reduce((sum, item) => {
      const source = latestRows.find((row) =>
        row.own_unit_type_id === evidence.unit_type_id &&
        row.competitor_name === item.competitor &&
        row.competitor_unit_type_name === item.competitor_unit_type
      );
      const comparability = source?.comparability_score ?? 1;
      return sum + item.influence_weight * comparability;
    }, 0);
    evidence.weighted_competitor_average = denominator > 0 ? numerator / denominator : null;
  }

  return result;
}

export function summarizeCompetitorSignals(evidenceByUnitType: Record<string, UnitTypeCompetitorEvidence>) {
  const evidence = Object.values(evidenceByUnitType);
  const belowMarket = evidence.filter((item) => item.weighted_competitor_average !== null && item.own_street_rate < item.weighted_competitor_average * 0.95);
  const aboveMarket = evidence.filter((item) => item.weighted_competitor_average !== null && item.own_street_rate > item.weighted_competitor_average * 1.05);
  const stalePrices = evidence.reduce((sum, item) => sum + item.stale_price_count, 0);
  return {
    below_market_count: belowMarket.length,
    above_market_count: aboveMarket.length,
    stale_price_count: stalePrices,
    below_market: belowMarket,
    above_market: aboveMarket
  };
}
