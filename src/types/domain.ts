import type { ActionEvidence, Campaign, OperatorAction, OperatorBooking, OperatorSignal } from "@/lib/operator-demo";
import type {
  Competitor,
  CompetitorPriceObservation,
  CompetitorUnitMapping,
  CompetitorUnitType,
  Facility,
  Unit,
  UnitType
} from "@/lib/types";
import type { DemoActivityItem, DemoActionEvent } from "@/lib/demo-state";
import type { UnitPressureRow } from "@/lib/pricing/unit-pressure";

export type MoneyMapItem = {
  id: "pricing" | "vacancy" | "discount" | "arrears" | "booking";
  label: string;
  value: number;
  copy: string;
  insufficientData?: boolean;
};

export type MoneyMap = {
  pricingGap: number;
  vacancyDrag: number;
  discountLeakage: number;
  arrearsRisk: number;
  leadFollowUpLoss: number;
  totalMoneyLeftOnTable: number;
  items: MoneyMapItem[];
};

export type ImpactReport = {
  rentRoll: number;
  expectedMonthlyUplift: number;
  simulatedUplift: number;
  approvedDecisions: number;
  completedDecisions: number;
  convertedBookings: number;
  actionEvents: Array<{
    id: string;
    action_id: string | null;
    event_type: string;
    payload: Record<string, unknown>;
    created_at: string;
  }>;
  completedExpectedUplift: number;
  newMonthlyRentFromConvertedBookings: number;
  priceChangesApproved: Array<{
    actionId: string | null;
    actionTitle: string;
    unitTypeName?: string;
    oldPrice: number | null;
    newPrice: number | null;
    approvedAt: string;
  }>;
  convertedBookingRows: Array<{
    bookingId: string;
    customerName: string;
    unitTypeName: string;
    rent: number;
    convertedAt: string;
  }>;
  campaignsLaunched: Campaign[];
  discountRecoveryActions: OperatorAction[];
  competitorRefreshActions: OperatorAction[];
  actionTimeline: Array<{
    id: string;
    title: string;
    status: OperatorAction["status"];
    expectedMonthlyUplift: number | null;
    createdAt: string;
    approvedAt?: string;
    completedAt?: string | null;
    evidenceSummary: string[];
    outcomeNote?: string | null;
    beforeValue?: string;
    afterValue?: string;
  }>;
};

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
  onboarding_required?: boolean;
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
  actionEvents: DemoActionEvent[];
  weeklyReports: unknown[];
  dataHealth: DataHealthReport;
  activity: DemoActivityItem[];
  unitRows: UnitPressureRow[];
  moneyMap: MoneyMap;
  impact: ImpactReport;
};

export type {
  ActionEvidence,
  Campaign,
  Competitor,
  CompetitorPriceObservation,
  CompetitorUnitMapping,
  CompetitorUnitType,
  Facility,
  OperatorAction,
  OperatorBooking,
  OperatorSignal,
  Unit,
  UnitType
};
