import { differenceInCalendarDays, subDays } from "date-fns";
import type {
  Competitor,
  CompetitorPriceObservation,
  CompetitorUnitMapping,
  FacilityCompetitor,
  Unit,
  UnitType
} from "@/lib/types";
import type { OperatorBooking, OperatorSignal, Priority } from "@/lib/operator-demo";

export type GeneratedSignal = {
  title: string;
  description: string;
  category: OperatorSignal["category"];
  severity: Priority;
  facility_id: string | null;
  unit_type_id: string | null;
  evidence: Record<string, unknown>;
};

export type MarketAverage = {
  average: number | null;
  competitorCount: number;
  latestObservedAt: string | null;
  staleCount: number;
  consideredCompetitors: string[];
};

type GenerateSignalsInput = {
  facilities: Array<{ id: string; name: string }>;
  unitTypes: UnitType[];
  units: Unit[];
  bookings: OperatorBooking[];
  competitors: Competitor[];
  facilityCompetitors: FacilityCompetitor[];
  competitorUnitMappings: CompetitorUnitMapping[];
  competitorPriceObservations: CompetitorPriceObservation[];
  now?: Date;
};

function unitTypeStats(unitType: UnitType, units: Unit[], bookings: OperatorBooking[]) {
  const rows = units.filter((unit) => unit.unit_type_id === unitType.id);
  const occupied = rows.filter((unit) => unit.status === "occupied").length;
  const occupancy = rows.length ? (occupied / rows.length) * 100 : 0;
  const demand30 = bookings.filter((booking) => booking.unit_type_id === unitType.id).length;
  const available = rows.filter((unit) => unit.status === "available").length;
  return { rows, occupied, occupancy, demand30, available };
}

export function calculateMarketAverages(input: GenerateSignalsInput): Record<string, MarketAverage> {
  const now = input.now ?? new Date();
  const competitorById = new Map(input.competitors.map((competitor) => [competitor.id, competitor]));
  const relationshipByFacilityCompetitor = new Map(input.facilityCompetitors.map((relationship) => [`${relationship.facility_id}:${relationship.competitor_id}`, relationship]));
  const observationsByCompetitorUnitType = new Map<string, CompetitorPriceObservation[]>();

  for (const observation of input.competitorPriceObservations) {
    if (!observation.competitor_unit_type_id) continue;
    const rows = observationsByCompetitorUnitType.get(observation.competitor_unit_type_id) ?? [];
    rows.push(observation);
    observationsByCompetitorUnitType.set(observation.competitor_unit_type_id, rows);
  }

  const result: Record<string, MarketAverage> = {};
  for (const unitType of input.unitTypes) {
    const mappedRows = input.competitorUnitMappings.filter((mapping) => mapping.own_unit_type_id === unitType.id);
    let weightedTotal = 0;
    let totalWeight = 0;
    let competitorCount = 0;
    let staleCount = 0;
    let latestObservedAt: string | null = null;
    const consideredCompetitors: string[] = [];

    for (const mapping of mappedRows) {
      const relationship = relationshipByFacilityCompetitor.get(`${mapping.facility_id}:${mapping.competitor_id}`);
      if (!relationship || !["direct", "partial"].includes(relationship.relationship_type)) continue;

      const observations = observationsByCompetitorUnitType.get(mapping.competitor_unit_type_id) ?? [];
      const latest = observations.sort((a, b) => Date.parse(b.observed_at) - Date.parse(a.observed_at))[0];
      if (!latest) {
        staleCount += 1;
        continue;
      }

      if (differenceInCalendarDays(now, new Date(latest.observed_at)) > 45) {
        staleCount += 1;
        continue;
      }

      const weight = Number(relationship.influence_weight ?? 1) * Number(mapping.comparability_score ?? 1);
      weightedTotal += latest.observed_price_monthly * weight;
      totalWeight += weight;
      competitorCount += 1;
      consideredCompetitors.push(competitorById.get(mapping.competitor_id)?.name ?? "Competitor");
      if (!latestObservedAt || Date.parse(latest.observed_at) > Date.parse(latestObservedAt)) latestObservedAt = latest.observed_at;
    }

    result[unitType.id] = {
      average: totalWeight ? weightedTotal / totalWeight : null,
      competitorCount,
      latestObservedAt,
      staleCount,
      consideredCompetitors
    };
  }

  return result;
}

export function generateSignalsFromSnapshot(input: GenerateSignalsInput): GeneratedSignal[] {
  const now = input.now ?? new Date();
  const marketAverages = calculateMarketAverages({ ...input, now });
  const signals: GeneratedSignal[] = [];
  const facilityById = new Map(input.facilities.map((facility) => [facility.id, facility]));

  for (const unitType of input.unitTypes) {
    const facility = facilityById.get(unitType.facility_id);
    const stats = unitTypeStats(unitType, input.units, input.bookings);
    const market = marketAverages[unitType.id] ?? { average: null, competitorCount: 0, latestObservedAt: null, staleCount: 0, consideredCompetitors: [] };

    if (stats.occupancy > 90 && stats.demand30 >= 3) {
      signals.push({
        title: `${facility?.name ?? "Facility"} ${unitType.name} demand is high`,
        description: `${unitType.name} is ${stats.occupancy.toFixed(0)}% occupied with ${stats.demand30} booking requests in 30 days.`,
        category: "high_demand_unit_type",
        severity: "high",
        facility_id: unitType.facility_id,
        unit_type_id: unitType.id,
        evidence: { occupancy: stats.occupancy, demand_30d: stats.demand30, available_units: stats.available }
      });
    }

    if (market.average && unitType.current_street_rate_monthly <= market.average * 0.95) {
      signals.push({
        title: `${facility?.name ?? "Facility"} ${unitType.name} is below selected direct competitors`,
        description: `Current price is at least 5% below the weighted competitor average.`,
        category: "under_market_price",
        severity: "high",
        facility_id: unitType.facility_id,
        unit_type_id: unitType.id,
        evidence: {
          own_price: unitType.current_street_rate_monthly,
          weighted_competitor_average: Math.round(market.average),
          competitor_count: market.competitorCount,
          competitors_considered: market.consideredCompetitors,
          latest_observed_at: market.latestObservedAt
        }
      });
    }

    if (market.average && stats.occupancy < 75 && unitType.current_street_rate_monthly >= market.average * 1.05) {
      signals.push({
        title: `${facility?.name ?? "Facility"} ${unitType.name} has over-market vacancy risk`,
        description: `Occupancy is weak while the street rate is more than 5% above selected competitors.`,
        category: "over_market_vacancy_risk",
        severity: "medium",
        facility_id: unitType.facility_id,
        unit_type_id: unitType.id,
        evidence: { occupancy: stats.occupancy, own_price: unitType.current_street_rate_monthly, weighted_competitor_average: Math.round(market.average) }
      });
    }

    if (market.staleCount > 0) {
      signals.push({
        title: `${facility?.name ?? "Facility"} ${unitType.name} competitor price data is stale`,
        description: `${market.staleCount} mapped competitor prices should be refreshed before the next pricing decision.`,
        category: "stale_competitor_price",
        severity: "medium",
        facility_id: unitType.facility_id,
        unit_type_id: unitType.id,
        evidence: { stale_count: market.staleCount }
      });
    }
  }

  const discountLeakage = input.units.filter((unit) => unit.status === "occupied" && unit.discount_monthly > 0).reduce((sum, unit) => sum + unit.discount_monthly, 0);
  if (discountLeakage > 0) {
    signals.push({
      title: "Legacy discounts are leaking rent",
      description: `Occupied units still carry ${Math.round(discountLeakage)} EUR in monthly concessions.`,
      category: "discount_leakage",
      severity: "high",
      facility_id: null,
      unit_type_id: null,
      evidence: { monthly_discount_leakage: discountLeakage }
    });
  }

  for (const unit of input.units) {
    const unitType = input.unitTypes.find((item) => item.id === unit.unit_type_id);
    if (!unitType || unit.status !== "occupied" || !unit.current_rent_monthly || !unit.tenant_start_date) continue;
    if (unit.current_rent_monthly < unitType.current_street_rate_monthly * 0.9 && differenceInCalendarDays(now, new Date(unit.tenant_start_date)) >= 365) {
      signals.push({
        title: `${unitType.name} tenant is below current street rate`,
        description: `A long-tenure tenant is more than 10% below current street rate.`,
        category: "tenant_below_market",
        severity: "medium",
        facility_id: unit.facility_id,
        unit_type_id: unit.unit_type_id,
        evidence: { current_rent: unit.current_rent_monthly, street_rate: unitType.current_street_rate_monthly, tenant_start_date: unit.tenant_start_date }
      });
      break;
    }
  }

  const rentRoll = input.units.filter((unit) => unit.status === "occupied").reduce((sum, unit) => sum + (unit.current_rent_monthly ?? 0), 0);
  const arrears = input.units.reduce((sum, unit) => sum + unit.arrears_amount, 0);
  if (rentRoll > 0 && arrears / rentRoll > 0.03) {
    signals.push({
      title: "Arrears risk is above threshold",
      description: `Open arrears are above 3% of monthly rent roll.`,
      category: "arrears_risk",
      severity: "medium",
      facility_id: null,
      unit_type_id: null,
      evidence: { arrears, rent_roll: rentRoll, arrears_pct: arrears / rentRoll }
    });
  }

  for (const booking of input.bookings) {
    if (["requested", "contacted"].includes(booking.status) && Date.parse(booking.created_at) <= subDays(now, 1).getTime()) {
      signals.push({
        title: `${booking.customer_name} needs booking follow-up`,
        description: `${booking.customer_name} requested ${booking.unit_type_name} and still needs conversion action.`,
        category: "booking_conversion_drop",
        severity: "high",
        facility_id: booking.facility_id,
        unit_type_id: booking.unit_type_id,
        evidence: { booking_id: booking.id, expected_monthly_rent: booking.quoted_monthly_rate, customer_type: booking.customer_type }
      });
    }
  }

  const month = now.getMonth() + 1;
  if (month >= 5 && month <= 8) {
    const smallUnit = input.unitTypes.find((unitType) => unitType.size_m2 <= 5);
    if (smallUnit) {
      signals.push({
        title: "Student and moving season is active",
        description: "May-August demand window supports small-unit campaign decisions.",
        category: "seasonal_campaign_opportunity",
        severity: "medium",
        facility_id: smallUnit.facility_id,
        unit_type_id: smallUnit.id,
        evidence: { season: "May-August", target_unit_size: "1-5 m2" }
      });
    }
  }

  return signals;
}
