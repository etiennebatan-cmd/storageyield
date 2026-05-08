import type { GeneratedSignal } from "@/lib/signals/generate-signals";
import type { Unit, UnitType } from "@/lib/types";
import type { OperatorBooking, OperatorAction } from "@/lib/operator-demo";

export type GeneratedAction = {
  title: string;
  decision_question: string;
  description: string;
  exact_next_step: string;
  category: OperatorAction["category"];
  priority: OperatorAction["priority"];
  confidence_score: number;
  risk_level: "low" | "medium" | "high";
  expected_monthly_uplift: number | null;
  recommendation: "approve" | "review" | "hold";
  facility_id: string | null;
  unit_type_id: string | null;
  booking_request_id?: string | null;
  evidence: Record<string, unknown>;
  proposed_change: Record<string, unknown>;
  linked_signal_titles: string[];
};

type GenerateActionsInput = {
  unitTypes: UnitType[];
  units: Unit[];
  bookings: OperatorBooking[];
  signals: GeneratedSignal[];
};

function signalsFor(input: GenerateActionsInput, unitTypeId: string, category?: GeneratedSignal["category"]) {
  return input.signals.filter((signal) => signal.unit_type_id === unitTypeId && (!category || signal.category === category));
}

export function generateActionsFromSignals(input: GenerateActionsInput): GeneratedAction[] {
  const actions: GeneratedAction[] = [];

  for (const unitType of input.unitTypes) {
    const units = input.units.filter((unit) => unit.unit_type_id === unitType.id);
    const occupied = units.filter((unit) => unit.status === "occupied").length;
    const occupancy = units.length ? (occupied / units.length) * 100 : 0;
    const highDemand = signalsFor(input, unitType.id, "high_demand_unit_type")[0];
    const underMarket = signalsFor(input, unitType.id, "under_market_price")[0];
    const overMarket = signalsFor(input, unitType.id, "over_market_vacancy_risk")[0];
    const staleMarket = signalsFor(input, unitType.id, "stale_competitor_price")[0];

    if (highDemand && underMarket && occupancy > 90) {
      const marketAverage = Number(underMarket.evidence.weighted_competitor_average ?? unitType.current_street_rate_monthly * 1.05);
      const suggestedRate = Math.min(Math.round(unitType.current_street_rate_monthly * 1.08), occupancy > 95 ? Math.round(marketAverage * 1.02) : Math.round(marketAverage));
      const available = units.filter((unit) => unit.status === "available").length;
      actions.push({
        title: `Raise ${unitType.name} new-customer price`,
        decision_question: `Raise ${unitType.name} new-customer price from €${unitType.current_street_rate_monthly} to €${suggestedRate}?`,
        description: `${unitType.name} has high demand, tight occupancy and selected competitor prices above the current street rate.`,
        exact_next_step: `Increase new-customer street rate from €${unitType.current_street_rate_monthly} to €${suggestedRate}. Do not change existing tenants yet.`,
        category: "pricing",
        priority: "high",
        confidence_score: 0.86,
        risk_level: "low",
        expected_monthly_uplift: Math.max(0, suggestedRate - unitType.current_street_rate_monthly) * Math.max(available, 3),
        recommendation: "approve",
        facility_id: unitType.facility_id,
        unit_type_id: unitType.id,
        evidence: { ...underMarket.evidence, ...highDemand.evidence, occupancy },
        proposed_change: { kind: "price_change", current_rate: unitType.current_street_rate_monthly, recommended_rate: suggestedRate, applies_to: "new_customers_only" },
        linked_signal_titles: [highDemand.title, underMarket.title]
      });
    }

    if (overMarket) {
      actions.push({
        title: `Hold ${unitType.name} price`,
        decision_question: `Hold ${unitType.name} price instead of increasing?`,
        description: `${unitType.name} is already above selected competitors while occupancy is weak.`,
        exact_next_step: "Do not raise price this week. Improve conversion or run a vacancy campaign before changing street rate.",
        category: "pricing",
        priority: "medium",
        confidence_score: 0.78,
        risk_level: "medium",
        expected_monthly_uplift: null,
        recommendation: "hold",
        facility_id: unitType.facility_id,
        unit_type_id: unitType.id,
        evidence: overMarket.evidence,
        proposed_change: { kind: "hold_price", current_rate: unitType.current_street_rate_monthly },
        linked_signal_titles: [overMarket.title]
      });
    }

    if (staleMarket) {
      actions.push({
        title: `Refresh ${unitType.name} competitor prices`,
        decision_question: `Refresh stale competitor prices for ${unitType.name}?`,
        description: staleMarket.description,
        exact_next_step: "Review selected competitor pricing URLs and enter fresh manual observations before approving the next price decision.",
        category: "competitor_response",
        priority: "medium",
        confidence_score: 0.74,
        risk_level: "low",
        expected_monthly_uplift: null,
        recommendation: "review",
        facility_id: unitType.facility_id,
        unit_type_id: unitType.id,
        evidence: staleMarket.evidence,
        proposed_change: { kind: "refresh_competitor_observations" },
        linked_signal_titles: [staleMarket.title]
      });
    }
  }

  const discountSignal = input.signals.find((signal) => signal.category === "discount_leakage");
  if (discountSignal) {
    actions.push({
      title: "Remove expired discounts",
      decision_question: "Remove expired discounts that are no longer tied to an active campaign?",
      description: discountSignal.description,
      exact_next_step: "Review discounted occupied units and remove concessions where there is no active promotion or customer-risk reason.",
      category: "discount_recovery",
      priority: "high",
      confidence_score: 0.8,
      risk_level: "medium",
      expected_monthly_uplift: Number(discountSignal.evidence.monthly_discount_leakage ?? 0),
      recommendation: "review",
      facility_id: null,
      unit_type_id: null,
      evidence: discountSignal.evidence,
      proposed_change: { kind: "discount_recovery" },
      linked_signal_titles: [discountSignal.title]
    });
  }

  for (const booking of input.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status)).slice(0, 5)) {
    actions.push({
      title: `Follow up ${booking.customer_name}`,
      decision_question: `Follow up ${booking.customer_name} now to protect €${booking.quoted_monthly_rate}/mo?`,
      description: `${booking.customer_name} requested ${booking.unit_type_name}.`,
      exact_next_step: booking.next_action,
      category: "booking_follow_up",
      priority: booking.customer_type === "business" ? "high" : "medium",
      confidence_score: booking.customer_type === "business" ? 0.82 : 0.68,
      risk_level: "low",
      expected_monthly_uplift: booking.quoted_monthly_rate,
      recommendation: "approve",
      facility_id: booking.facility_id,
      unit_type_id: booking.unit_type_id,
      booking_request_id: booking.id,
      evidence: { customer_type: booking.customer_type, move_in_date: booking.preferred_move_in_date, source: booking.source },
      proposed_change: { kind: "booking_follow_up", booking_id: booking.id },
      linked_signal_titles: input.signals.filter((signal) => signal.unit_type_id === booking.unit_type_id).map((signal) => signal.title)
    });
  }

  const seasonalSignal = input.signals.find((signal) => signal.category === "seasonal_campaign_opportunity");
  if (seasonalSignal) {
    actions.push({
      title: "Launch student summer storage campaign",
      decision_question: "Launch Student Summer Storage campaign for small units?",
      description: seasonalSignal.description,
      exact_next_step: "Launch the student playbook with first-month discount copy for 1-5 m² units only.",
      category: "campaign",
      priority: "medium",
      confidence_score: 0.72,
      risk_level: "low",
      expected_monthly_uplift: 540,
      recommendation: "review",
      facility_id: seasonalSignal.facility_id,
      unit_type_id: seasonalSignal.unit_type_id,
      evidence: seasonalSignal.evidence,
      proposed_change: { kind: "launch_campaign", template: "student_summer_storage" },
      linked_signal_titles: [seasonalSignal.title]
    });
  }

  return actions;
}
