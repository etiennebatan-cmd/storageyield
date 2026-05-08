import type { ActionStatus, Campaign, OperatorAction, OperatorBooking, OperatorSignal } from "@/lib/operator-demo";
import type { Competitor, CompetitorPriceObservation, Unit } from "@/lib/types";

export type DemoActivityItem = {
  id: string;
  title: string;
  description: string;
  type: "booking" | "action" | "competitor" | "system" | "pricing" | "campaign";
  created_at: string;
};

export type DemoActionEvent = {
  id: string;
  action_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type DemoState = {
  unitTypePrices: Record<string, number>;
  actionStatus: Record<string, ActionStatus>;
  bookingStatus: Record<string, OperatorBooking["status"]>;
  widgetInstalled: boolean;
  onboardingSteps: Record<string, boolean>;
  bookings: OperatorBooking[];
  actions: OperatorAction[];
  signals: OperatorSignal[];
  competitors: Competitor[];
  observations: CompetitorPriceObservation[];
  campaigns: Campaign[];
  bookingAssignedUnits: Record<string, string>;
  unitStatus: Record<string, Unit["status"]>;
  unitRents: Record<string, number>;
  completedActionIds: string[];
  actionOutcomeNotes: Record<string, string>;
  actionEvents: DemoActionEvent[];
  activity: DemoActivityItem[];
};

const STORAGE_KEY = "storageyield.demoState";

const defaultState: DemoState = {
  unitTypePrices: {},
  actionStatus: {},
  bookingStatus: {},
  widgetInstalled: false,
  onboardingSteps: {},
  bookings: [],
  actions: [],
  signals: [],
  competitors: [],
  observations: [],
  campaigns: [],
  bookingAssignedUnits: {},
  unitStatus: {},
  unitRents: {},
  completedActionIds: [],
  actionOutcomeNotes: {},
  actionEvents: [],
  activity: []
};

export function loadDemoState(): DemoState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      unitTypePrices: parsed.unitTypePrices ?? {},
      actionStatus: parsed.actionStatus ?? {},
      bookingStatus: parsed.bookingStatus ?? {},
      widgetInstalled: parsed.widgetInstalled ?? false,
      onboardingSteps: parsed.onboardingSteps ?? {}
    };
  } catch {
    return defaultState;
  }
}

export function saveDemoState(state: Partial<DemoState>) {
  if (typeof window === "undefined") return;
  const current = loadDemoState();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...state }));
}

export function updateDemoState(update: (current: DemoState) => DemoState) {
  if (typeof window === "undefined") return defaultState;
  const current = loadDemoState();
  const next = update(current);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
