import { subDays } from "date-fns";
import type { CompetitorPriceObservation, Unit, UnitType } from "@/lib/types";
import type { OperatorBooking, OperatorSignal } from "@/lib/operator-demo";
import { arrearsRisk, discountLeakage, eur, unitPressureRows } from "@/lib/operator-demo";

type SignalInput = {
  organizationId?: string;
  units: Unit[];
  unitTypes: UnitType[];
  bookings: OperatorBooking[];
  observations: CompetitorPriceObservation[];
  now?: Date;
};

function id(prefix: string, value: string) {
  return `${prefix}-${value}`.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

export function detectRevenueSignals(input: SignalInput): OperatorSignal[] {
  const now = input.now ?? new Date();
  const rows = unitPressureRows(input.units, input.unitTypes);
  const signals: OperatorSignal[] = [];

  for (const row of rows) {
    if (row.occupancy > 90 && row.demand30 >= 3) {
      signals.push({
        id: id("sig-high-demand", row.id),
        title: `${row.facility_name} ${row.name} demand is high`,
        category: "high_demand_unit_type",
        facility_id: row.facility_id,
        facility_name: row.facility_name,
        unit_type_id: row.id,
        unit_type_name: row.name,
        severity: "high",
        evidence: `${row.occupancy.toFixed(0)}% occupied with ${row.demand30} leads/bookings in 30 days.`,
        created_at: now.toISOString()
      });
    }

    if (row.market_avg !== null && row.gap !== null && row.gap > row.street_rate * 0.05) {
      signals.push({
        id: id("sig-under-market", row.id),
        title: `${row.facility_name} ${row.name} is under market`,
        category: "under_market_price",
        facility_id: row.facility_id,
        facility_name: row.facility_name,
        unit_type_id: row.id,
        unit_type_name: row.name,
        severity: "high",
        evidence: `Our price ${eur(row.street_rate)} is below selected competitor average ${eur(row.market_avg)}.`,
        created_at: now.toISOString()
      });
    }

    if (row.market_avg !== null && row.gap !== null && row.gap < row.street_rate * -0.05 && row.occupancy < 75) {
      signals.push({
        id: id("sig-over-market", row.id),
        title: `${row.facility_name} ${row.name} has over-market vacancy risk`,
        category: "over_market_vacancy_risk",
        facility_id: row.facility_id,
        facility_name: row.facility_name,
        unit_type_id: row.id,
        unit_type_name: row.name,
        severity: "medium",
        evidence: `${row.occupancy.toFixed(0)}% occupied while our price is above market.`,
        created_at: now.toISOString()
      });
    }
  }

  const staleCount = input.observations.filter((observation) => (now.getTime() - Date.parse(observation.observed_at)) / 86400000 > 45).length;
  if (staleCount > 0) {
    signals.push({
      id: "sig-stale-competitor-data",
      title: "Competitor price data is stale",
      category: "stale_competitor_price",
      facility_id: "portfolio",
      facility_name: "Portfolio",
      severity: "medium",
      evidence: `${staleCount} competitor observations are older than 45 days.`,
      created_at: now.toISOString()
    });
  }

  const leakage = discountLeakage(input.units);
  if (leakage > 0) {
    signals.push({
      id: "sig-discount-leakage-detected",
      title: "Discount leakage detected",
      category: "discount_leakage",
      facility_id: "portfolio",
      facility_name: "Portfolio",
      severity: "high",
      evidence: `${eur(leakage)} in monthly concessions is still active.`,
      created_at: now.toISOString()
    });
  }

  const arrears = arrearsRisk(input.units);
  const rentRoll = input.units.reduce((sum, unit) => sum + (unit.current_rent_monthly ?? 0), 0);
  if (rentRoll > 0 && arrears / rentRoll > 0.03) {
    signals.push({
      id: "sig-arrears-risk-detected",
      title: "Arrears risk exceeds threshold",
      category: "arrears_risk",
      facility_id: "portfolio",
      facility_name: "Portfolio",
      severity: "medium",
      evidence: `${eur(arrears)} open arrears is above 3% of rent roll.`,
      created_at: now.toISOString()
    });
  }

  for (const booking of input.bookings) {
    if (booking.status === "requested" && Date.parse(booking.created_at) < subDays(now, 1).getTime()) {
      signals.push({
        id: id("sig-booking-follow-up", booking.id),
        title: `${booking.customer_name} needs booking follow-up`,
        category: "booking_conversion_drop",
        facility_id: booking.facility_id,
        facility_name: booking.facility_name,
        unit_type_id: booking.unit_type_id,
        unit_type_name: booking.unit_type_name,
        severity: "high",
        evidence: `Request is older than 24h and still new. Expected rent ${eur(booking.quoted_monthly_rate)}/mo.`,
        created_at: now.toISOString()
      });
    }
  }

  return signals;
}
