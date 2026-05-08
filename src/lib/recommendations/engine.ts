import { subMonths } from "date-fns";
import { Unit, UnitType } from "@/lib/types";
import { calculateFacilityMetrics } from "@/lib/calculations/metrics";
import { UnitTypeCompetitorEvidence } from "@/lib/competitors/insights";

export interface Recommendation {
  title: string;
  description: string;
  category: "pricing" | "occupancy" | "unit_mix" | "collections" | "lead_conversion" | "b2b" | "operations";
  priority: "high" | "medium" | "low";
  estimated_monthly_uplift: number | null;
  evidence: Record<string, unknown>;
}

type DemandMap = Record<string, { leads30: number; bookings30: number }>;
type CompetitorEvidenceMap = Record<string, UnitTypeCompetitorEvidence>;

function hasEnoughCompetitorEvidence(evidence: UnitTypeCompetitorEvidence | undefined) {
  if (!evidence || evidence.weighted_competitor_average === null) return false;
  return evidence.valid_observation_count >= 2 || (evidence.direct_competitor_count >= 1 && evidence.valid_observation_count >= 1);
}

function competitorEvidencePayload(evidence: UnitTypeCompetitorEvidence, occupancy: number, demand: { leads30: number; bookings30: number }) {
  return {
    own_occupancy: occupancy,
    own_lead_demand: demand,
    own_street_rate: evidence.own_street_rate,
    weighted_competitor_average: evidence.weighted_competitor_average,
    direct_competitor_count: evidence.direct_competitor_count,
    valid_observation_count: evidence.valid_observation_count,
    observation_freshness: evidence.considered.map((item) => ({ competitor: item.competitor, days_old: item.days_old })),
    competitors_considered: evidence.considered.map((item) => item.competitor),
    competitors_excluded: evidence.excluded,
    last_checked: evidence.last_checked
  };
}

export function runRecommendations(
  units: Unit[],
  unitTypes: UnitType[],
  demandByUnitType: DemandMap,
  competitorEvidenceByUnitType: CompetitorEvidenceMap = {}
): Recommendation[] {
  const now = new Date();
  const threshold = subMonths(now, 12);
  const metrics = calculateFacilityMetrics(units, unitTypes);
  const recs: Recommendation[] = [];
  const unitsByType = new Map<string, Unit[]>();

  for (const unit of units) {
    const group = unitsByType.get(unit.unit_type_id) ?? [];
    group.push(unit);
    unitsByType.set(unit.unit_type_id, group);
  }

  for (const ut of unitTypes) {
    const grouped = unitsByType.get(ut.id) ?? [];
    if (!grouped.length) continue;
    const occupied = grouped.filter((u) => u.status === "occupied").length;
    const occupancy = (occupied / grouped.length) * 100;
    const demand = demandByUnitType[ut.id] ?? { leads30: 0, bookings30: 0 };
    const competitorEvidence = competitorEvidenceByUnitType[ut.id];
    const enoughCompetitorEvidence = hasEnoughCompetitorEvidence(competitorEvidence);
    const competitorAverage = competitorEvidence?.weighted_competitor_average ?? null;
    const demandCount = demand.leads30 + demand.bookings30;

    if (enoughCompetitorEvidence && competitorAverage !== null && occupancy > 90 && demandCount >= 3 && ut.current_street_rate_monthly <= competitorAverage * 0.95) {
      const uncappedIncreasePct = Math.min(0.08, Math.max(0.03, (competitorAverage - ut.current_street_rate_monthly) / ut.current_street_rate_monthly));
      const uncappedSuggestedRate = Math.round(ut.current_street_rate_monthly * (1 + uncappedIncreasePct));
      const suggestedRate = occupancy > 95 ? uncappedSuggestedRate : Math.min(uncappedSuggestedRate, Math.round(competitorAverage));
      const upliftPerMoveIn = Math.max(0, suggestedRate - ut.current_street_rate_monthly);
      recs.push({
        title: `Raise ${ut.name} street rate`,
        description: `${ut.name} units are ${occupancy.toFixed(0)}% occupied, received ${demandCount} leads/bookings in 30 days, and selected direct/partial competitors average EUR ${Math.round(competitorAverage)}. Increase new-customer street rate from EUR ${Math.round(ut.current_street_rate_monthly)} to EUR ${suggestedRate}. Do not change existing tenants yet.`,
        category: "pricing",
        priority: "high",
        estimated_monthly_uplift: Math.round(grouped.filter((u) => u.status === "available").length * upliftPerMoveIn),
        evidence: {
          ...competitorEvidencePayload(competitorEvidence!, occupancy, demand),
          action: `Increase new-customer street rate from EUR ${Math.round(ut.current_street_rate_monthly)} to EUR ${suggestedRate}`,
          suggested_rate: suggestedRate,
          new_customers_only: true
        }
      });
    } else if (enoughCompetitorEvidence && competitorAverage !== null && competitorEvidence!.direct_competitor_count > 0 && occupancy < 65 && ut.current_street_rate_monthly > competitorAverage * 1.1) {
      recs.push({
        title: `Promo or price review for ${ut.name}`,
        description: `${ut.name} occupancy is ${occupancy.toFixed(0)}% and our price is more than 10% above selected direct competitors. Consider a limited-time promotion or repositioning review.`,
        category: "pricing",
        priority: "medium",
        estimated_monthly_uplift: null,
        evidence: {
          ...competitorEvidencePayload(competitorEvidence!, occupancy, demand),
          action: "Consider a limited-time promotion or price review."
        }
      });
    } else if (enoughCompetitorEvidence && competitorAverage !== null && occupancy < 75 && ut.current_street_rate_monthly > competitorAverage) {
      recs.push({
        title: `Review conversion for ${ut.name}`,
        description: `${ut.name} occupancy is ${occupancy.toFixed(0)}% and our price is already above selected competitors. Avoid a price increase; focus on marketing, conversion, or positioning.`,
        category: "occupancy",
        priority: "medium",
        estimated_monthly_uplift: null,
        evidence: {
          ...competitorEvidencePayload(competitorEvidence!, occupancy, demand),
          action: "Do not raise price. Review marketing and conversion before repricing."
        }
      });
    } else if (occupancy > 90 && demandCount >= 3) {
      recs.push({
        title: `Raise street rate for ${ut.name}`,
        description: "Demand and occupancy are both strong. Test a 3-8% rate increase for new move-ins only. Add tracked competitor prices to strengthen this recommendation.",
        category: "pricing",
        priority: "high",
        estimated_monthly_uplift: Math.round(grouped.filter((u) => u.status === "available").length * ut.current_street_rate_monthly * 0.04),
        evidence: { occupancy, demand, unit_type_id: ut.id, competitor_evidence_status: competitorEvidence ? "not enough fresh competitor observations" : "no competitor mapping" }
      });
    }
    if (ut.size_m2 >= 15 && occupancy < 70) {
      recs.push({
        title: `Large-unit strategy review for ${ut.name}`,
        description: "Large units are underperforming. Test pricing/promo and evaluate split feasibility if smaller units are >90% occupied.",
        category: "unit_mix",
        priority: "medium",
        estimated_monthly_uplift: null,
        evidence: { occupancy, size_m2: ut.size_m2 }
      });
    }
    if (occupancy < 60 && grouped.filter((u) => u.status === "available").length > 3) {
      recs.push({
        title: `Vacancy marketing focus for ${ut.name}`,
        description: "Run local SEO and paid targeting for this size category to lift occupancy.",
        category: "occupancy",
        priority: "medium",
        estimated_monthly_uplift: null,
        evidence: { occupancy, available: grouped.filter((u) => u.status === "available").length }
      });
    }
  }

  const discountLeakage = units.filter((u) => u.status === "occupied" && u.discount_monthly > 0).reduce((s, u) => s + u.discount_monthly, 0);
  if (discountLeakage > 0) {
    recs.push({
      title: "Review discount leakage",
      description: "Active monthly discounts are reducing income. Review expired concessions and reprice legacy deals.",
      category: "pricing",
      priority: "high",
      estimated_monthly_uplift: Math.round(discountLeakage * 0.7),
      evidence: { discountLeakage }
    });
  }

  if (metrics.economic_occupancy_pct + 10 < metrics.physical_occupancy_pct) {
    recs.push({
      title: "Rent collected trails potential",
      description: "Rent collected vs potential is materially behind physical occupancy. Audit underpricing, discounts and arrears.",
      category: "operations",
      priority: "high",
      estimated_monthly_uplift: null,
      evidence: { physical: metrics.physical_occupancy_pct, economic: metrics.economic_occupancy_pct }
    });
  }

  const arrearsPct = metrics.current_monthly_rent > 0 ? (metrics.total_arrears / metrics.current_monthly_rent) * 100 : 0;
  if (arrearsPct > 3) {
    recs.push({
      title: "Collections workflow needed",
      description: "Arrears exceed 3% of monthly rent. Introduce dunning cadence and stricter follow-up process.",
      category: "collections",
      priority: "high",
      estimated_monthly_uplift: null,
      evidence: { arrearsPct, total_arrears: metrics.total_arrears }
    });
  }

  const underpriced = units.filter((u) => {
    if (u.status !== "occupied" || !u.current_rent_monthly) return false;
    const ut = unitTypes.find((x) => x.id === u.unit_type_id);
    if (!ut) return false;
    if (!u.tenant_start_date) return false;
    const tenantStart = new Date(u.tenant_start_date);
    if (Number.isNaN(tenantStart.getTime())) return false;
    return u.current_rent_monthly < ut.current_street_rate_monthly * 0.9 && tenantStart <= threshold;
  });
  if (underpriced.length) {
    const uplift = underpriced.reduce((sum, u) => {
      const ut = unitTypes.find((x) => x.id === u.unit_type_id);
      if (!ut || !u.current_rent_monthly) return sum;
      const gap = ut.current_street_rate_monthly - u.current_rent_monthly;
      return sum + Math.min(u.current_rent_monthly * 0.05, gap);
    }, 0);
    recs.push({
      title: "Underpriced occupied tenants",
      description: "Long-tenure units appear below market. Prepare a staged rent review list.",
      category: "pricing",
      priority: "high",
      estimated_monthly_uplift: Math.round(uplift),
      evidence: { flagged_units: underpriced.length }
    });
  }
  return recs;
}
