import type { OperatorAction, OperatorBooking, OperatorSignal } from "@/lib/operator-demo";
import { eur, unitPressureRows } from "@/lib/operator-demo";
import type { Unit, UnitType } from "@/lib/types";

type DecisionInput = {
  organizationId?: string;
  units: Unit[];
  unitTypes: UnitType[];
  bookings: OperatorBooking[];
  signals: OperatorSignal[];
  now?: Date;
};

function byCategory(signals: OperatorSignal[], category: OperatorSignal["category"], unitTypeId?: string) {
  return signals.filter((signal) => signal.category === category && (!unitTypeId || signal.unit_type_id === unitTypeId));
}

export function createRevenueActions(input: DecisionInput): OperatorAction[] {
  const now = input.now ?? new Date();
  const rows = unitPressureRows(input.units, input.unitTypes);
  const actions: OperatorAction[] = [];

  for (const row of rows) {
    const highDemand = byCategory(input.signals, "high_demand_unit_type", row.id).length > 0;
    const underMarket = byCategory(input.signals, "under_market_price", row.id).length > 0;
    const overMarket = byCategory(input.signals, "over_market_vacancy_risk", row.id).length > 0;

    if (highDemand && underMarket && row.occupancy > 90 && row.market_avg) {
      const suggested = Math.min(Math.round(row.street_rate * 1.08), Math.round(row.market_avg));
      actions.push({
        id: `action-raise-${row.id}`,
        title: `Raise ${row.facility_name} ${row.name} new-customer price`,
        description: `${row.name} is ${row.occupancy.toFixed(0)}% occupied, demand is high, and selected competitors average ${eur(row.market_avg)}.`,
        exact_next_step: `Increase new-customer street rate from ${eur(row.street_rate)} to ${eur(suggested)}. Do not change existing tenants yet.`,
        estimated_monthly_uplift: Math.max(0, suggested - row.street_rate) * Math.max(1, row.units - row.occupied + 3),
        confidence: 0.86,
        priority: "high",
        category: "pricing",
        source_signals: ["booking demand", "competitor", "occupancy"],
        evidence: [`Occupancy: ${row.occupancy.toFixed(0)}%`, `Demand: ${row.demand30} leads/bookings`, `Market average: ${eur(row.market_avg)}`],
        linked_signal_ids: input.signals.filter((signal) => signal.unit_type_id === row.id).map((signal) => signal.id),
        status: "proposed",
        created_at: now.toISOString(),
        completed_at: null,
        facility_id: row.facility_id,
        unit_type_id: row.id,
        unit_type_name: row.name,
        recommended_street_rate: suggested
      });
    }

    if (overMarket) {
      actions.push({
        id: `action-hold-${row.id}`,
        title: `Hold ${row.facility_name} ${row.name} price`,
        description: `${row.name} has weak occupancy and is priced above selected competitors.`,
        exact_next_step: "Hold price this week and focus on conversion or a campaign before any increase.",
        estimated_monthly_uplift: null,
        confidence: 0.78,
        priority: "medium",
        category: "pricing",
        source_signals: ["competitor", "occupancy"],
        evidence: [`Occupancy: ${row.occupancy.toFixed(0)}%`, `Market average: ${row.market_avg ? eur(row.market_avg) : "n/a"}`, `Current price: ${eur(row.street_rate)}`],
        linked_signal_ids: input.signals.filter((signal) => signal.unit_type_id === row.id).map((signal) => signal.id),
        status: "proposed",
        created_at: now.toISOString(),
        completed_at: null,
        facility_id: row.facility_id,
        unit_type_id: row.id,
        unit_type_name: row.name
      });
    }
  }

  const discountSignal = byCategory(input.signals, "discount_leakage")[0];
  if (discountSignal) {
    actions.push({
      id: "action-discount-recovery",
      title: "Review expired discounts",
      description: discountSignal.evidence,
      exact_next_step: "Review discounts older than 90 days and remove where no active campaign applies.",
      estimated_monthly_uplift: 770,
      confidence: 0.8,
      priority: "high",
      category: "discount_recovery",
      source_signals: ["discount"],
      evidence: [discountSignal.evidence],
      linked_signal_ids: [discountSignal.id],
      status: "proposed",
      created_at: now.toISOString(),
      completed_at: null
    });
  }

  for (const booking of input.bookings.filter((item) => item.status === "requested").slice(0, 3)) {
    actions.push({
      id: `action-follow-up-${booking.id}`,
      title: `Follow up ${booking.customer_name} booking`,
      description: `${booking.customer_name} requested ${booking.unit_type_name}; expected rent ${eur(booking.quoted_monthly_rate)}/mo.`,
      exact_next_step: booking.next_action,
      estimated_monthly_uplift: booking.quoted_monthly_rate,
      confidence: booking.customer_type === "business" ? 0.82 : 0.68,
      priority: booking.customer_type === "business" ? "high" : "medium",
      category: "booking_follow_up",
      source_signals: ["booking demand"],
      evidence: [`Customer type: ${booking.customer_type}`, `Move-in date: ${booking.preferred_move_in_date}`, `Source: ${booking.source}`],
      linked_signal_ids: input.signals.filter((signal) => signal.category === "booking_conversion_drop" && signal.unit_type_id === booking.unit_type_id).map((signal) => signal.id),
      status: "proposed",
      created_at: now.toISOString(),
      completed_at: null,
      facility_id: booking.facility_id,
      unit_type_id: booking.unit_type_id,
      unit_type_name: booking.unit_type_name
    });
  }

  return actions;
}
