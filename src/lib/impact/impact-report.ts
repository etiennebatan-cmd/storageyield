import { evidenceToBullets, formatEvidenceValue } from "@/lib/actions/evidence-format";
import type { ImpactReport } from "@/types/domain";
import type { Campaign, OperatorAction, OperatorBooking } from "@/lib/operator-demo";
import type { Unit, UnitType } from "@/lib/types";

type ActionEvent = ImpactReport["actionEvents"][number];

type ImpactInput = {
  actions: OperatorAction[];
  actionEvents: ActionEvent[];
  bookings: OperatorBooking[];
  units: Unit[];
  unitTypes: UnitType[];
  campaigns: Campaign[];
};

function payloadRecord(event: ActionEvent) {
  return event.payload && typeof event.payload === "object" ? event.payload : {};
}

function eventNumber(event: ActionEvent, key: string) {
  const value = payloadRecord(event)[key];
  return typeof value === "number" ? value : Number(value ?? NaN);
}

export function calculateImpactReport(input: ImpactInput): ImpactReport {
  const actionsById = new Map(input.actions.map((action) => [action.id, action]));
  const unitTypesById = new Map(input.unitTypes.map((unitType) => [unitType.id, unitType]));
  const approvedOrActive = input.actions.filter((action) => ["approved", "active", "completed"].includes(action.status));
  const completed = input.actions.filter((action) => action.status === "completed");
  const convertedBookings = input.bookings.filter((booking) => booking.status === "converted");
  const rentRoll = input.units.filter((unit) => unit.status === "occupied").reduce((sum, unit) => sum + Number(unit.current_rent_monthly ?? 0), 0);

  const priceChangesApproved = input.actionEvents
    .filter((event) => event.event_type === "decision_approved" && (Number.isFinite(eventNumber(event, "old_price")) || Number.isFinite(eventNumber(event, "new_price"))))
    .map((event) => {
      const action = event.action_id ? actionsById.get(event.action_id) : undefined;
      return {
        actionId: event.action_id,
        actionTitle: action?.title ?? "Pricing decision approved",
        unitTypeName: action?.unit_type_id ? unitTypesById.get(action.unit_type_id)?.name : undefined,
        oldPrice: Number.isFinite(eventNumber(event, "old_price")) ? eventNumber(event, "old_price") : null,
        newPrice: Number.isFinite(eventNumber(event, "new_price")) ? eventNumber(event, "new_price") : null,
        approvedAt: event.created_at
      };
    });

  const convertedBookingRows = convertedBookings.map((booking) => ({
    bookingId: booking.id,
    customerName: booking.customer_name,
    unitTypeName: booking.unit_type_name,
    rent: booking.quoted_monthly_rate,
    convertedAt: booking.created_at
  }));

  const actionTimeline = approvedOrActive.map((action) => {
    const approvedEvent = input.actionEvents.find((event) => event.action_id === action.id && event.event_type === "decision_approved");
    const completedEvent = input.actionEvents.find((event) => event.action_id === action.id && event.event_type === "decision_completed");
    const approvedPayload = approvedEvent ? payloadRecord(approvedEvent) : {};
    const completedPayload = completedEvent ? payloadRecord(completedEvent) : {};
    const before = approvedPayload.old_price == null ? undefined : formatEvidenceValue(approvedPayload.old_price);
    const after = approvedPayload.new_price == null ? undefined : formatEvidenceValue(approvedPayload.new_price);
    return {
      id: action.id,
      title: action.title,
      status: action.status,
      expectedMonthlyUplift: action.estimated_monthly_uplift,
      createdAt: action.created_at,
      approvedAt: approvedEvent?.created_at,
      completedAt: action.completed_at ?? completedEvent?.created_at ?? null,
      evidenceSummary: evidenceToBullets(action.evidence).slice(0, 3),
      outcomeNote: typeof completedPayload.outcome_note === "string" ? completedPayload.outcome_note : typeof completedPayload.note === "string" ? completedPayload.note : null,
      beforeValue: before,
      afterValue: after
    };
  });

  const expectedMonthlyUplift = approvedOrActive.reduce((sum, action) => sum + Number(action.estimated_monthly_uplift ?? 0), 0);
  const completedExpectedUplift = completed.reduce((sum, action) => sum + Number(action.estimated_monthly_uplift ?? 0), 0);
  const newMonthlyRentFromConvertedBookings = convertedBookingRows.reduce((sum, booking) => sum + booking.rent, 0);

  return {
    rentRoll,
    expectedMonthlyUplift,
    simulatedUplift: Math.round(completedExpectedUplift + expectedMonthlyUplift * 0.35 + newMonthlyRentFromConvertedBookings * 0.15),
    approvedDecisions: input.actions.filter((action) => action.status === "approved").length,
    completedDecisions: completed.length,
    convertedBookings: convertedBookings.length,
    actionEvents: input.actionEvents,
    completedExpectedUplift,
    newMonthlyRentFromConvertedBookings,
    priceChangesApproved,
    convertedBookingRows,
    campaignsLaunched: input.campaigns.filter((campaign) => campaign.status === "active" || campaign.status === "completed"),
    discountRecoveryActions: approvedOrActive.filter((action) => action.category === "discount_recovery"),
    competitorRefreshActions: approvedOrActive.filter((action) => action.category === "competitor_response"),
    actionTimeline
  };
}
