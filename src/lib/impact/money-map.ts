import type { MoneyMap } from "@/types/domain";
import type { OperatorBooking } from "@/lib/operator-demo";
import type { Unit, UnitType } from "@/lib/types";

type MoneyMapInput = {
  unitTypes: UnitType[];
  units: Unit[];
  bookings: OperatorBooking[];
  now?: Date;
};

function round(value: number) {
  return Math.max(0, Math.round(value));
}

function unitTypeMap(unitTypes: UnitType[]) {
  return new Map(unitTypes.map((unitType) => [unitType.id, unitType]));
}

export function calculateMoneyMap(input: MoneyMapInput): MoneyMap {
  const now = input.now ?? new Date();
  const unitTypesById = unitTypeMap(input.unitTypes);

  const pricingGap = input.units
    .filter((unit) => unit.status === "occupied")
    .reduce((sum, unit) => {
      const unitType = unitTypesById.get(unit.unit_type_id);
      if (!unitType || unit.current_rent_monthly == null) return sum;
      const gap = unitType.current_street_rate_monthly - unit.current_rent_monthly;
      if (gap <= 0) return sum;
      return sum + Math.min(gap, unitType.current_street_rate_monthly * 0.1);
    }, 0);

  const vacancyDrag = input.units
    .filter((unit) => unit.status === "available")
    .reduce((sum, unit) => {
      const unitType = unitTypesById.get(unit.unit_type_id);
      return sum + (unitType?.current_street_rate_monthly ?? 0) * 0.35;
    }, 0);

  const discountLeakage = input.units
    .filter((unit) => unit.status === "occupied")
    .reduce((sum, unit) => sum + Number(unit.discount_monthly ?? 0), 0);

  const arrearsRisk = input.units.reduce((sum, unit) => sum + Number(unit.arrears_amount ?? 0), 0);

  const leadFollowUpLoss = input.bookings
    .filter((booking) => ["requested", "contacted"].includes(booking.status) && now.getTime() - Date.parse(booking.created_at) > 24 * 60 * 60 * 1000)
    .reduce((sum, booking) => {
      const unitType = unitTypesById.get(booking.unit_type_id);
      return sum + Number(booking.quoted_monthly_rate || unitType?.current_street_rate_monthly || 0) * 0.25;
    }, 0);

  const values = {
    pricingGap: round(pricingGap),
    vacancyDrag: round(vacancyDrag),
    discountLeakage: round(discountLeakage),
    arrearsRisk: round(arrearsRisk),
    leadFollowUpLoss: round(leadFollowUpLoss)
  };

  const hasUnitData = input.unitTypes.length > 0 && input.units.length > 0;
  const items: MoneyMap["items"] = [
    { id: "pricing", label: "Pricing gap", value: values.pricingGap, copy: "Occupied units renting below current street rates." },
    { id: "vacancy", label: "Vacancy drag", value: values.vacancyDrag, copy: "Available units weighted by conservative fill probability.", insufficientData: !hasUnitData },
    { id: "discount", label: "Discount leakage", value: values.discountLeakage, copy: "Monthly concessions on occupied units." },
    { id: "arrears", label: "Arrears risk", value: values.arrearsRisk, copy: "Open tenant balances requiring collection follow-up." },
    { id: "booking", label: "Lead follow-up loss", value: values.leadFollowUpLoss, copy: "Aged booking requests with recoverable monthly rent." }
  ];

  return {
    ...values,
    totalMoneyLeftOnTable: round(Object.values(values).reduce((sum, value) => sum + value, 0)),
    items
  };
}
