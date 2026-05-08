import {
  demoCampaigns,
  demoOperatorBookings,
  demoSignals,
  demoActions,
  eur,
  unitPressureRows,
  type Campaign,
  type OperatorAction,
  type OperatorBooking,
  type OperatorSignal,
  type ActionStatus
} from "@/lib/operator-demo";
import {
  demoCompetitorPriceObservations,
  demoCompetitors,
  demoFacilities,
  demoUnitTypes,
  demoUnits
} from "@/lib/demo-data";
import { detectRevenueSignals } from "@/lib/signals/engine";
import { createRevenueActions } from "@/lib/decisions/engine";
import { loadDemoState, updateDemoState, type DemoState } from "@/lib/demo-state";
import type { Competitor, CompetitorPriceObservation, Facility, Unit, UnitType } from "@/lib/types";
import type { WidgetBookingInput } from "@/lib/validators/widget";

type StoreResult<T> = Promise<T>;

export type StorageYieldSnapshot = {
  facilities: Facility[];
  unitTypes: UnitType[];
  units: Unit[];
  bookings: OperatorBooking[];
  signals: OperatorSignal[];
  actions: OperatorAction[];
  competitors: Competitor[];
  observations: CompetitorPriceObservation[];
  campaigns: Campaign[];
  activity: DemoState["activity"];
  unitRows: ReturnType<typeof unitPressureRows>;
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
  submitBooking(input: WidgetBookingInput): StoreResult<{ lead_id: string; booking_id: string }>;
  updateBookingStatus(bookingId: string, status: OperatorBooking["status"]): StoreResult<void>;
  approveAction(actionId: string): StoreResult<void>;
  completeAction(actionId: string, outcomeNote?: string): StoreResult<void>;
  dismissAction(actionId: string): StoreResult<void>;
  updateUnitTypePrice(unitTypeId: string, price: number): StoreResult<void>;
  addCompetitor(input: Pick<Competitor, "name" | "pricing_url" | "website_url" | "city" | "notes">): StoreResult<Competitor>;
  addCompetitorPriceObservation(input: Omit<CompetitorPriceObservation, "id" | "created_at">): StoreResult<CompetitorPriceObservation>;
  launchCampaign(template: Campaign): StoreResult<Campaign>;
  generateSignals(): StoreResult<OperatorSignal[]>;
  generateActions(): StoreResult<OperatorAction[]>;
  getImpactReport(): StoreResult<{
    rentRoll: number;
    expectedMonthlyUplift: number;
    simulatedUplift: number;
    approvedDecisions: number;
    completedDecisions: number;
    convertedBookings: number;
    actionEvents: DemoState["actionEvents"];
  }>;
  getSnapshot(): StoreResult<StorageYieldSnapshot>;
};

function normalizeObservation(row: (typeof demoCompetitorPriceObservations)[number]): CompetitorPriceObservation {
  return { ...row, observation_method: "manual", created_at: row.observed_at };
}

function demoUnitTypesWithState(state: DemoState): UnitType[] {
  return demoUnitTypes.map((unitType) => ({
    ...unitType,
    current_street_rate_monthly: state.unitTypePrices[unitType.id] ?? unitType.current_street_rate_monthly
  }));
}

function demoUnitsWithState(state: DemoState): Unit[] {
  return demoUnits.map((unit) => ({
    ...unit,
    status: (state.unitStatus[unit.id] ?? unit.status) as Unit["status"],
    current_rent_monthly: state.unitRents[unit.id] ?? unit.current_rent_monthly
  }));
}

function demoBookingsWithState(state: DemoState): OperatorBooking[] {
  const customIds = new Set(state.bookings.map((booking) => booking.id));
  return [...state.bookings, ...demoOperatorBookings.filter((booking) => !customIds.has(booking.id))].map((booking) => ({
    ...booking,
    status: (state.bookingStatus[booking.id] as OperatorBooking["status"] | undefined) ?? booking.status
  }));
}

function demoActionsWithState(state: DemoState): OperatorAction[] {
  const customIds = new Set(state.actions.map((action) => action.id));
  return [...state.actions, ...demoActions.filter((action) => !customIds.has(action.id))].map((action) => ({
    ...action,
    status: (state.actionStatus[action.id] as ActionStatus | undefined) ?? action.status,
    completed_at: state.completedActionIds.includes(action.id) ? (action.completed_at ?? new Date().toISOString()) : action.completed_at
  }));
}

function demoSignalsWithState(state: DemoState): OperatorSignal[] {
  const customIds = new Set(state.signals.map((signal) => signal.id));
  return [...state.signals, ...demoSignals.filter((signal) => !customIds.has(signal.id))];
}

function demoObservationsWithState(state: DemoState): CompetitorPriceObservation[] {
  const customIds = new Set(state.observations.map((observation) => observation.id));
  return [...state.observations, ...demoCompetitorPriceObservations.filter((observation) => !customIds.has(observation.id)).map(normalizeObservation)];
}

function event(actionId: string, eventType: string, payload: Record<string, unknown> = {}) {
  return { id: `event-${Date.now()}`, action_id: actionId, event_type: eventType, payload, created_at: new Date().toISOString() };
}

export function createDemoStore(): StorageYieldStore {
  const getState = () => loadDemoState();

  const getActions = async () => demoActionsWithState(getState());
  const getBookings = async () => demoBookingsWithState(getState());
  const getUnits = async () => demoUnitsWithState(getState());
  const getUnitTypes = async () => demoUnitTypesWithState(getState());
  const getSignals = async () => demoSignalsWithState(getState());
  const getObservations = async () => demoObservationsWithState(getState());

  return {
    async getFacilities() {
      return demoFacilities as Facility[];
    },
    getUnitTypes,
    getUnits,
    getBookings,
    getSignals,
    getActions,
    async getCompetitors() {
      const state = getState();
      const customIds = new Set(state.competitors.map((competitor) => competitor.id));
      return [...state.competitors, ...demoCompetitors.filter((competitor) => !customIds.has(competitor.id)) as Competitor[]];
    },
    async submitBooking(input) {
      const bookingId = `demo-booking-${Date.now()}`;
      const unitType = demoUnitTypes.find((item) => item.id === input.unit_type_id);
      const facility = demoFacilities.find((item) => item.id === input.facility_id);
      const booking: OperatorBooking = {
        id: bookingId,
        customer_name: input.customer_name,
        customer_type: input.customer_type,
        unit_type_id: input.unit_type_id,
        unit_type_name: unitType?.name ?? "Requested unit",
        facility_id: input.facility_id,
        facility_name: facility?.name ?? "Facility",
        preferred_move_in_date: input.preferred_move_in_date ?? new Date().toISOString().slice(0, 10),
        quoted_monthly_rate: unitType?.current_street_rate_monthly ?? 0,
        source: "booking widget",
        status: "requested",
        created_at: new Date().toISOString(),
        next_action: "Contact customer and confirm availability"
      };
      updateDemoState((state) => ({
        ...state,
        bookings: [booking, ...state.bookings],
        activity: [{ id: `activity-${Date.now()}`, title: "New booking received", description: `${booking.customer_name}: ${booking.unit_type_name}`, type: "booking", created_at: new Date().toISOString() }, ...state.activity]
      }));
      return { lead_id: `demo-lead-${Date.now()}`, booking_id: bookingId };
    },
    async updateBookingStatus(bookingId, status) {
      const state = getState();
      const booking = demoBookingsWithState(state).find((item) => item.id === bookingId);
      const nextUnit = booking ? state.bookingAssignedUnits[booking.id] ?? demoUnitsWithState(state).find((unit) => unit.unit_type_id === booking.unit_type_id && unit.status === "available")?.id : undefined;
      updateDemoState((current) => ({
        ...current,
        bookingStatus: { ...current.bookingStatus, [bookingId]: status },
        bookingAssignedUnits: booking && nextUnit && (status === "reserved" || status === "converted") ? { ...current.bookingAssignedUnits, [booking.id]: nextUnit } : current.bookingAssignedUnits,
        unitStatus: nextUnit && (status === "reserved" || status === "converted") ? { ...current.unitStatus, [nextUnit]: status === "converted" ? "occupied" : "reserved" } : current.unitStatus,
        unitRents: booking && nextUnit && status === "converted" ? { ...current.unitRents, [nextUnit]: booking.quoted_monthly_rate } : current.unitRents,
        activity: [{ id: `activity-${Date.now()}`, title: `Booking ${status}`, description: booking?.customer_name ?? bookingId, type: "booking", created_at: new Date().toISOString() }, ...current.activity]
      }));
    },
    async approveAction(actionId) {
      const state = getState();
      const action = demoActionsWithState(state).find((item) => item.id === actionId);
      updateDemoState((current) => ({
        ...current,
        actionStatus: { ...current.actionStatus, [actionId]: "approved" },
        unitTypePrices: action?.unit_type_id && action.recommended_street_rate ? { ...current.unitTypePrices, [action.unit_type_id]: action.recommended_street_rate } : current.unitTypePrices,
        actionEvents: [event(actionId, "decision_approved", { expected_monthly_uplift: action?.estimated_monthly_uplift ?? null }), ...current.actionEvents],
        activity: [{ id: `activity-${Date.now()}`, title: "Decision approved", description: action?.title ?? actionId, type: "action", created_at: new Date().toISOString() }, ...current.activity]
      }));
    },
    async completeAction(actionId, outcomeNote) {
      updateDemoState((current) => ({
        ...current,
        actionStatus: { ...current.actionStatus, [actionId]: "completed" },
        completedActionIds: Array.from(new Set([...current.completedActionIds, actionId])),
        actionOutcomeNotes: outcomeNote ? { ...current.actionOutcomeNotes, [actionId]: outcomeNote } : current.actionOutcomeNotes,
        actionEvents: [event(actionId, "decision_completed", { outcome_note: outcomeNote ?? null }), ...current.actionEvents],
        activity: [{ id: `activity-${Date.now()}`, title: "Decision completed", description: outcomeNote ?? actionId, type: "action", created_at: new Date().toISOString() }, ...current.activity]
      }));
    },
    async dismissAction(actionId) {
      updateDemoState((current) => ({
        ...current,
        actionStatus: { ...current.actionStatus, [actionId]: "rejected" },
        actionEvents: [event(actionId, "decision_rejected"), ...current.actionEvents],
        activity: [{ id: `activity-${Date.now()}`, title: "Decision rejected", description: actionId, type: "action", created_at: new Date().toISOString() }, ...current.activity]
      }));
    },
    async updateUnitTypePrice(unitTypeId, price) {
      updateDemoState((current) => ({
        ...current,
        unitTypePrices: { ...current.unitTypePrices, [unitTypeId]: price },
        activity: [{ id: `activity-${Date.now()}`, title: "Unit price updated", description: `${unitTypeId} changed to ${eur(price)}`, type: "pricing", created_at: new Date().toISOString() }, ...current.activity]
      }));
    },
    async addCompetitor(input) {
      const competitor: Competitor = {
        id: `demo-competitor-${Date.now()}`,
        organization_id: "demo-org",
        name: input.name,
        pricing_url: input.pricing_url,
        website_url: input.website_url,
        city: input.city,
        address: null,
        country: "Belgium",
        notes: input.notes,
        status: "active",
        last_observed_at: null,
        created_at: new Date().toISOString()
      };
      updateDemoState((state) => ({ ...state, competitors: [competitor, ...state.competitors] }));
      return competitor;
    },
    async addCompetitorPriceObservation(input) {
      const observation: CompetitorPriceObservation = { ...input, id: `demo-observation-${Date.now()}`, created_at: new Date().toISOString() };
      updateDemoState((state) => ({ ...state, observations: [observation, ...state.observations] }));
      await this.generateSignals();
      await this.generateActions();
      return observation;
    },
    async launchCampaign(template) {
      const campaign = { ...template, id: `demo-campaign-${Date.now()}`, status: "active" as const };
      updateDemoState((state) => ({
        ...state,
        campaigns: [campaign, ...state.campaigns],
        activity: [{ id: `activity-${Date.now()}`, title: "Campaign launched", description: campaign.name, type: "campaign", created_at: new Date().toISOString() }, ...state.activity]
      }));
      return campaign;
    },
    async generateSignals() {
      const state = getState();
      const generated = detectRevenueSignals({ units: demoUnitsWithState(state), unitTypes: demoUnitTypesWithState(state), bookings: demoBookingsWithState(state), observations: demoObservationsWithState(state) });
      updateDemoState((current) => ({ ...current, signals: generated }));
      return generated;
    },
    async generateActions() {
      const state = getState();
      const generated = createRevenueActions({ units: demoUnitsWithState(state), unitTypes: demoUnitTypesWithState(state), bookings: demoBookingsWithState(state), signals: demoSignalsWithState(state) });
      updateDemoState((current) => ({ ...current, actions: generated }));
      return generated;
    },
    async getImpactReport() {
      const state = getState();
      const actions = demoActionsWithState(state);
      const approved = actions.filter((action) => action.status === "approved");
      const completed = actions.filter((action) => action.status === "completed");
      const convertedBookings = demoBookingsWithState(state).filter((booking) => booking.status === "converted").length;
      const expectedMonthlyUplift = [...approved, ...completed].reduce((sum, action) => sum + (action.estimated_monthly_uplift ?? 0), 0);
      const rentRoll = 34200 + Object.values(state.unitRents).reduce((sum, rent) => sum + rent, 0);
      return {
        rentRoll,
        expectedMonthlyUplift,
        simulatedUplift: Math.round(expectedMonthlyUplift * 0.46),
        approvedDecisions: approved.length,
        completedDecisions: completed.length,
        convertedBookings,
        actionEvents: state.actionEvents
      };
    },
    async getSnapshot() {
      const state = getState();
      const unitTypes = demoUnitTypesWithState(state);
      const units = demoUnitsWithState(state);
      return {
        facilities: demoFacilities as Facility[],
        unitTypes,
        units,
        bookings: demoBookingsWithState(state),
        signals: demoSignalsWithState(state),
        actions: demoActionsWithState(state),
        competitors: await this.getCompetitors(),
        observations: demoObservationsWithState(state),
        campaigns: [...state.campaigns, ...demoCampaigns],
        activity: state.activity,
        unitRows: unitPressureRows(units, unitTypes),
        impact: await this.getImpactReport()
      };
    }
  };
}

export function createSupabaseStore(): StorageYieldStore {
  const notLoaded = async <T>(fallback: T) => fallback;
  const post = async (url: string, body: unknown) => {
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
    return res.json();
  };

  return {
    getFacilities: () => notLoaded([]),
    getUnitTypes: () => notLoaded([]),
    getUnits: () => notLoaded([]),
    getBookings: () => notLoaded([]),
    getSignals: () => notLoaded([]),
    getActions: () => notLoaded([]),
    getCompetitors: () => notLoaded([]),
    submitBooking: (input) => post("/api/widget/submit", input),
    updateBookingStatus: async (bookingId, status) => { await post("/api/bookings/status", { booking_id: bookingId, status }); },
    approveAction: async (actionId) => { await post("/api/recommendations/status", { recommendation_id: actionId, status: "accepted" }); },
    completeAction: async (actionId) => { await post("/api/recommendations/status", { recommendation_id: actionId, status: "completed" }); },
    dismissAction: async (actionId) => { await post("/api/recommendations/status", { recommendation_id: actionId, status: "dismissed" }); },
    updateUnitTypePrice: async (unitTypeId, price) => { await post("/api/unit-types/create", { unit_type_id: unitTypeId, current_street_rate_monthly: price }); },
    addCompetitor: (input) => post("/api/competitors/create", input),
    addCompetitorPriceObservation: (input) => post("/api/competitors/observations/create", input),
    launchCampaign: (template) => notLoaded(template),
    generateSignals: () => notLoaded([]),
    generateActions: () => post("/api/recommendations/generate", {}),
    getImpactReport: () => notLoaded({ rentRoll: 0, expectedMonthlyUplift: 0, simulatedUplift: 0, approvedDecisions: 0, completedDecisions: 0, convertedBookings: 0, actionEvents: [] }),
    getSnapshot: async () => ({ facilities: [], unitTypes: [], units: [], bookings: [], signals: [], actions: [], competitors: [], observations: [], campaigns: [], activity: [], unitRows: [], impact: await this.getImpactReport() })
  };
}
