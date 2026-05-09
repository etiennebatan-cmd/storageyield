import type { Campaign, OperatorAction, OperatorBooking, OperatorSignal } from "@/lib/operator-demo";
import type {
  Competitor,
  CompetitorPriceObservation,
  CompetitorUnitMapping,
  CompetitorUnitType,
  Facility,
  Unit,
  UnitType
} from "@/lib/types";
import type { WidgetBookingInput } from "@/lib/validators/widget";
import type { ImpactReport, StorageYieldSnapshot, DataHealthIssue, DataHealthReport } from "@/types/domain";

type StoreResult<T> = Promise<T>;
export type StoreMode = "demo" | "production";

export type { StorageYieldSnapshot, ImpactReport, DataHealthIssue, DataHealthReport };

export type StorageYieldStore = {
  getFacilities(): StoreResult<Facility[]>;
  getUnitTypes(): StoreResult<UnitType[]>;
  getUnits(): StoreResult<Unit[]>;
  getBookings(): StoreResult<OperatorBooking[]>;
  getSignals(): StoreResult<OperatorSignal[]>;
  getActions(): StoreResult<OperatorAction[]>;
  getCompetitors(): StoreResult<Competitor[]>;
  getSnapshot(): StoreResult<StorageYieldSnapshot>;
  submitBooking(input: WidgetBookingInput): StoreResult<{ lead_id: string; booking_id: string }>;
  updateBookingStatus(bookingId: string, status: OperatorBooking["status"]): StoreResult<void>;
  assignUnitToBooking(input: { booking_id: string; unit_id: string }): StoreResult<void>;
  convertBooking(input: { booking_id: string; unit_id?: string; rent?: number; tenant_type?: OperatorBooking["customer_type"] }): StoreResult<void>;
  approveAction(actionId: string): StoreResult<void>;
  completeAction(actionId: string, outcomeNote?: string): StoreResult<void>;
  dismissAction(actionId: string): StoreResult<void>;
  updateUnitTypePrice(unitTypeId: string, price: number): StoreResult<void>;
  addCompetitor(input: Pick<Competitor, "name" | "pricing_url" | "website_url" | "city" | "notes"> & { facility_id?: string; relationship_type?: "direct" | "partial" | "benchmark" | "ignored" }): StoreResult<Competitor>;
  addCompetitorUnitType(input: Omit<CompetitorUnitType, "id" | "created_at">): StoreResult<CompetitorUnitType>;
  addCompetitorPriceObservation(input: Omit<CompetitorPriceObservation, "id" | "created_at">): StoreResult<CompetitorPriceObservation>;
  mapCompetitorUnitType(input: Omit<CompetitorUnitMapping, "id" | "created_at">): StoreResult<CompetitorUnitMapping>;
  launchCampaign(template: Campaign): StoreResult<Campaign>;
  generateSignals(input?: { organization_id?: string; facility_id?: string }): StoreResult<OperatorSignal[]>;
  generateActions(input?: { organization_id?: string; facility_id?: string }): StoreResult<OperatorAction[]>;
  getImpactReport(): StoreResult<ImpactReport>;
};

export { createDemoStore } from "@/lib/state/demo-store";
export { createSupabaseStore } from "@/lib/state/supabase-store";
