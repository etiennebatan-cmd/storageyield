import type { Campaign, OperatorAction, OperatorBooking, OperatorSignal } from "@/lib/operator-demo";
import type { Competitor, CompetitorPriceObservation } from "@/lib/types";

export type DemoState = {
  unitTypePrices: Record<string, number>;
  actionStatus: Record<string, string>;
  bookingStatus: Record<string, string>;
  widgetInstalled: boolean;
  onboardingSteps: Record<string, boolean>;
  bookings: OperatorBooking[];
  actions: OperatorAction[];
  campaigns: Campaign[];
  competitors: Competitor[];
  observations: CompetitorPriceObservation[];
  signals: OperatorSignal[];
  completedActionIds: string[];
  activity: Array<{ id: string; title: string; description: string; type: string; created_at: string }>;
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
  campaigns: [],
  competitors: [],
  observations: [],
  signals: [],
  completedActionIds: [],
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
      onboardingSteps: parsed.onboardingSteps ?? {},
      bookings: parsed.bookings ?? [],
      actions: parsed.actions ?? [],
      campaigns: parsed.campaigns ?? [],
      competitors: parsed.competitors ?? [],
      observations: parsed.observations ?? [],
      signals: parsed.signals ?? [],
      completedActionIds: parsed.completedActionIds ?? [],
      activity: parsed.activity ?? []
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
