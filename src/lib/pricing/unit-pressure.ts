import type { MarketAverage } from "@/lib/signals/generate-signals";
import type { Facility, Unit, UnitType } from "@/lib/types";
import type { OperatorBooking } from "@/lib/operator-demo";

export type UnitPressureRow = {
  id: string;
  facility_id: string;
  facility_name: string;
  name: string;
  units: number;
  occupied: number;
  occupancy: number;
  demand30: number;
  leads30: number;
  bookings30: number;
  street_rate: number;
  target_rate: number;
  market_avg: number | null;
  gap: number | null;
  discount_leakage: number;
  rent_per_m2: number;
  recommendation: string;
};

export function buildUnitPressureRows(input: {
  facilities: Array<Pick<Facility, "id" | "name">>;
  unitTypes: UnitType[];
  units: Unit[];
  bookings: OperatorBooking[];
  marketAverages?: Record<string, MarketAverage>;
  now?: Date;
}): UnitPressureRow[] {
  const now = input.now ?? new Date();
  const since30d = now.getTime() - 30 * 86400000;
  const facilityById = new Map(input.facilities.map((facility) => [facility.id, facility.name]));

  return input.unitTypes.map((unitType) => {
    const rows = input.units.filter((unit) => unit.unit_type_id === unitType.id);
    const occupied = rows.filter((unit) => unit.status === "occupied").length;
    const bookings30 = input.bookings.filter((booking) => booking.unit_type_id === unitType.id && Date.parse(booking.created_at) >= since30d).length;
    const occupancy = rows.length ? (occupied / rows.length) * 100 : 0;
    const marketAvg = input.marketAverages?.[unitType.id]?.average ?? null;
    const roundedMarketAvg = marketAvg == null ? null : Math.round(marketAvg);
    const gap = roundedMarketAvg == null ? null : roundedMarketAvg - unitType.current_street_rate_monthly;
    const leakage = rows.filter((unit) => unit.status === "occupied").reduce((sum, unit) => sum + Number(unit.discount_monthly ?? 0), 0);

    const recommendation =
      roundedMarketAvg !== null && gap !== null && gap > unitType.current_street_rate_monthly * 0.05 && occupancy >= 85
        ? "Raise new-customer rate"
        : roundedMarketAvg !== null && gap !== null && gap < unitType.current_street_rate_monthly * -0.05 && occupancy < 75
          ? "Hold price"
          : occupancy < 70
            ? "Launch demand campaign"
            : leakage > 0
              ? "Review discounts"
              : "Hold price";

    return {
      id: unitType.id,
      facility_id: unitType.facility_id,
      facility_name: facilityById.get(unitType.facility_id) ?? "Facility",
      name: unitType.name,
      units: rows.length,
      occupied,
      occupancy,
      demand30: bookings30,
      leads30: 0,
      bookings30,
      street_rate: unitType.current_street_rate_monthly,
      target_rate: roundedMarketAvg == null ? Math.round(unitType.current_street_rate_monthly * 1.05) : Math.min(Math.round(unitType.current_street_rate_monthly * 1.08), roundedMarketAvg),
      market_avg: roundedMarketAvg,
      gap,
      discount_leakage: leakage,
      rent_per_m2: unitType.size_m2 > 0 ? unitType.current_street_rate_monthly / unitType.size_m2 : unitType.current_street_rate_monthly,
      recommendation
    };
  });
}
