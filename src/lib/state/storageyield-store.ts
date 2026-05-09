import type { DemoState } from "@/lib/demo-state";
import type { Campaign, OperatorAction, OperatorBooking, OperatorSignal } from "@/lib/operator-demo";
import type { UnitPressureRow } from "@/lib/pricing/unit-pressure";
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

type StoreResult<T> = Promise<T>;
export type StoreMode = "demo" | "production";

export type DataHealthIssue = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  cta: string;
};

export type DataHealthReport = {
  score: number;
  issues: DataHealthIssue[];
};

export type StorageYieldSnapshot = {
  facilities: Facility[];
  unitTypes: UnitType[];
  units: Unit[];
  bookings: OperatorBooking[];
  leads: unknown[];
  signals: OperatorSignal[];
  actions: OperatorAction[];
  competitors: Competitor[];
  competitorUnitTypes: CompetitorUnitType[];
  competitorPriceObservations: CompetitorPriceObservation[];
  competitorUnitMappings: CompetitorUnitMapping[];
  observations: CompetitorPriceObservation[];
  campaigns: Campaign[];
  actionEvents: DemoState["actionEvents"];
  weeklyReports: unknown[];
  dataHealth: DataHealthReport;
  activity: DemoState["activity"];
  unitRows: UnitPressureRow[];
  impact: Awaited<ReturnType<StorageYieldStore["getImpactReport"]>>;
};

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
  getImpactReport(): StoreResult<{
    rentRoll: number;
    expectedMonthlyUplift: number;
    simulatedUplift: number;
    approvedDecisions: number;
    completedDecisions: number;
    convertedBookings: number;
    actionEvents: DemoState["actionEvents"];
  }>;
};

export { createDemoStore } from "@/lib/state/demo-store";
export { createSupabaseStore } from "@/lib/state/supabase-store";
