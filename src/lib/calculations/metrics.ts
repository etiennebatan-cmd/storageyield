import { Unit, UnitType } from "@/lib/types";

export interface FacilityMetrics {
  total_units: number;
  occupied_units: number;
  available_units: number;
  reserved_units: number;
  physical_occupancy_pct: number;
  current_monthly_rent: number;
  potential_monthly_rent: number;
  economic_occupancy_pct: number;
  total_arrears: number;
  average_rent_per_m2: number;
}

const pct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);

export function calculateFacilityMetrics(units: Unit[], unitTypes: UnitType[]): FacilityMetrics {
  const unitTypeById = new Map(unitTypes.map((u) => [u.id, u]));
  const total_units = units.length;
  const occupied = units.filter((u) => u.status === "occupied");
  const available = units.filter((u) => u.status === "available");
  const reserved = units.filter((u) => u.status === "reserved");
  const current_monthly_rent = occupied.reduce((sum, u) => sum + (u.current_rent_monthly ?? 0), 0);
  const potential_monthly_rent = units.reduce((sum, u) => {
    const unitType = unitTypeById.get(u.unit_type_id);
    return sum + (unitType?.current_street_rate_monthly ?? 0);
  }, 0);
  const total_arrears = units.reduce((sum, u) => sum + (u.arrears_amount || 0), 0);
  const occupied_m2 = occupied.reduce((sum, u) => sum + (unitTypeById.get(u.unit_type_id)?.size_m2 ?? 0), 0);

  return {
    total_units,
    occupied_units: occupied.length,
    available_units: available.length,
    reserved_units: reserved.length,
    physical_occupancy_pct: pct(occupied.length, total_units),
    current_monthly_rent,
    potential_monthly_rent,
    economic_occupancy_pct: pct(current_monthly_rent, potential_monthly_rent),
    total_arrears,
    average_rent_per_m2: occupied_m2 > 0 ? current_monthly_rent / occupied_m2 : 0
  };
}
