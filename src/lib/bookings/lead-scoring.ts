import type { OperatorBooking } from "@/lib/operator-demo";
import type { StorageYieldSnapshot } from "@/lib/state/storageyield-store";

export type LeadScore = {
  score: number;
  reasons: string[];
};

function daysUntil(dateValue: string, now = new Date()) {
  return Math.ceil((new Date(dateValue).getTime() - now.getTime()) / 86400000);
}

function bookingAgeHours(booking: OperatorBooking, now = new Date()) {
  return Math.max(0, (now.getTime() - Date.parse(booking.created_at)) / 3600000);
}

function occupancyForUnitType(unitTypeId: string, snapshot: Pick<StorageYieldSnapshot, "units">) {
  const units = snapshot.units.filter((unit) => unit.unit_type_id === unitTypeId);
  if (!units.length) return 0;
  return (units.filter((unit) => unit.status === "occupied").length / units.length) * 100;
}

function facilityAverageRate(booking: OperatorBooking, snapshot: Pick<StorageYieldSnapshot, "unitTypes">) {
  const rows = snapshot.unitTypes.filter((unitType) => unitType.facility_id === booking.facility_id);
  if (!rows.length) return 0;
  return rows.reduce((sum, unitType) => sum + unitType.current_street_rate_monthly, 0) / rows.length;
}

export function calculateLeadScore(booking: OperatorBooking, snapshot: Pick<StorageYieldSnapshot, "units" | "unitTypes">, now = new Date()): LeadScore {
  let score = 50;
  const reasons: string[] = [];
  const moveInDays = daysUntil(booking.preferred_move_in_date, now);
  const occupancy = occupancyForUnitType(booking.unit_type_id, snapshot);
  const averageRate = facilityAverageRate(booking, snapshot);
  const phone = booking.customer_phone?.trim();

  if (booking.customer_type === "business") {
    score += 20;
    reasons.push("business customer");
  }
  if (moveInDays <= 7) {
    score += 25;
    reasons.push("move-in within 7 days");
  }
  if (occupancy > 85) {
    score += 15;
    reasons.push("requested unit type is high occupancy");
  }
  if (booking.quoted_monthly_rate >= averageRate && averageRate > 0) {
    score += 10;
    reasons.push("higher-value unit type");
  }
  if (phone) {
    score += 10;
    reasons.push("phone provided");
  } else {
    score -= 10;
    reasons.push("no phone number");
  }
  if (["requested", "contacted"].includes(booking.status) && bookingAgeHours(booking, now) > 24) {
    score -= 15;
    reasons.push("older than 24h without conversion");
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), reasons };
}

export function getBookingUrgency(booking: OperatorBooking, snapshot?: Pick<StorageYieldSnapshot, "units" | "unitTypes">, now = new Date()): "high" | "medium" | "low" {
  const score = snapshot ? calculateLeadScore(booking, snapshot, now).score : 50;
  if (score >= 75 || daysUntil(booking.preferred_move_in_date, now) <= 7) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export function getBookingNextAction(booking: OperatorBooking, snapshot: Pick<StorageYieldSnapshot, "units" | "unitTypes">, now = new Date()) {
  const available = snapshot.units.some((unit) => unit.unit_type_id === booking.unit_type_id && unit.status === "available");
  const ageHours = bookingAgeHours(booking, now);
  const urgency = getBookingUrgency(booking, snapshot, now);

  if (booking.status === "converted") return "Converted. Track rent roll impact.";
  if (booking.status === "lost") return "Lost. Review reason before changing follow-up playbook.";
  if (booking.status === "reserved") return "Assign unit and convert if payment or move-in is confirmed.";
  if (!available) return "No available units in this type; offer the nearest alternative.";
  if (ageHours > 24 && ["requested", "contacted"].includes(booking.status)) return "Mark lost or follow up now; request is older than 24h.";
  if (urgency === "high") return "Call today and reserve available unit.";
  if (booking.customer_phone?.trim()) return "Call and confirm availability, price and move-in date.";
  return "Send follow-up email with availability and price.";
}
