import {
  demoCampaigns,
  demoOperatorBookings,
  demoSignals,
  demoActions,
  eur,
  type OperatorAction,
  type OperatorBooking,
  type OperatorSignal,
  type ActionStatus
} from "@/lib/operator-demo";
import {
  demoCompetitorPriceObservations,
  demoCompetitorUnitMappings,
  demoCompetitorUnitTypes,
  demoCompetitors,
  demoFacilityCompetitors,
  demoFacilities,
  demoUnitTypes,
  demoUnits
} from "@/lib/demo-data";
import { calculateMarketAverages, generateSignalsFromSnapshot } from "@/lib/signals/generate-signals";
import { generateActionsFromSignals } from "@/lib/actions/generate-actions";
import { buildUnitPressureRows } from "@/lib/pricing/unit-pressure";
import { calculateDataHealth } from "@/lib/data-health";
import { calculateImpactReport } from "@/lib/impact/impact-report";
import { calculateMoneyMap } from "@/lib/impact/money-map";
import { loadDemoState, updateDemoState, type DemoState } from "@/lib/demo-state";
import type {
  Competitor,
  CompetitorPriceObservation,
  CompetitorUnitMapping,
  CompetitorUnitType,
  Facility,
  Unit,
  UnitType
} from "@/lib/types";
import type { StorageYieldStore } from "@/lib/state/storageyield-store";

function demoFacilitiesWithShape(): Facility[] {
  return demoFacilities.map((facility) => ({
    id: facility.id,
    organization_id: "demo-org",
    name: facility.name,
    city: facility.city,
    public_slug: facility.public_slug,
    currency: "EUR"
  }));
}

function normalizeObservation(row: (typeof demoCompetitorPriceObservations)[number]): CompetitorPriceObservation {
  return { ...row, observation_method: "manual", created_at: row.observed_at };
}

function normalizeCompetitorUnitType(row: (typeof demoCompetitorUnitTypes)[number]): CompetitorUnitType {
  return {
    ...row,
    volume_m3: null,
    access_type: null,
    climate_controlled: null,
    floor: null,
    description: null,
    created_at: new Date("2026-05-01T09:00:00.000Z").toISOString()
  };
}

function normalizeCompetitorUnitMapping(row: (typeof demoCompetitorUnitMappings)[number]): CompetitorUnitMapping {
  return { ...row, created_at: new Date("2026-05-01T09:00:00.000Z").toISOString() };
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
  const getCompetitors = async () => {
    const state = getState();
    const customIds = new Set(state.competitors.map((competitor) => competitor.id));
    return [...state.competitors, ...(demoCompetitors.filter((competitor) => !customIds.has(competitor.id)) as Competitor[])];
  };
  const getImpactReport = async () => {
    const state = getState();
    const actions = demoActionsWithState(state);
    return calculateImpactReport({
      actions,
      actionEvents: state.actionEvents,
      bookings: demoBookingsWithState(state),
      units: demoUnitsWithState(state),
      unitTypes: demoUnitTypesWithState(state),
      campaigns: [...state.campaigns, ...demoCampaigns]
    });
  };
  const generateSignals = async () => {
    const state = getState();
    const facilities = demoFacilitiesWithShape();
    const unitTypes = demoUnitTypesWithState(state);
    const units = demoUnitsWithState(state);
    const bookings = demoBookingsWithState(state);
    const observations = demoObservationsWithState(state);
    const generatedRaw = generateSignalsFromSnapshot({
      facilities,
      unitTypes,
      units,
      bookings,
      competitors: await getCompetitors(),
      facilityCompetitors: demoFacilityCompetitors,
      competitorUnitMappings: demoCompetitorUnitMappings.map(normalizeCompetitorUnitMapping),
      competitorPriceObservations: observations
    });
    const generated: OperatorSignal[] = generatedRaw.map((signal) => ({
      id: `demo-signal-${signal.category}-${signal.unit_type_id ?? "portfolio"}`.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase(),
      title: signal.title,
      category: signal.category,
      facility_id: signal.facility_id ?? "portfolio",
      facility_name: facilities.find((facility) => facility.id === signal.facility_id)?.name ?? "Portfolio",
      unit_type_id: signal.unit_type_id ?? undefined,
      unit_type_name: unitTypes.find((unitType) => unitType.id === signal.unit_type_id)?.name,
      severity: signal.severity,
      evidence: signal.description,
      created_at: new Date().toISOString()
    }));
    updateDemoState((current) => ({ ...current, signals: generated }));
    return generated;
  };
  const generateActions = async () => {
    const state = getState();
    const unitTypes = demoUnitTypesWithState(state);
    const units = demoUnitsWithState(state);
    const bookings = demoBookingsWithState(state);
    const signalObjects = generateSignalsFromSnapshot({
      facilities: demoFacilitiesWithShape(),
      unitTypes,
      units,
      bookings,
      competitors: await getCompetitors(),
      facilityCompetitors: demoFacilityCompetitors,
      competitorUnitMappings: demoCompetitorUnitMappings.map(normalizeCompetitorUnitMapping),
      competitorPriceObservations: demoObservationsWithState(state)
    });
    const generatedRaw = generateActionsFromSignals({ unitTypes, units, bookings, signals: signalObjects });
    const generated: OperatorAction[] = generatedRaw.map((action) => ({
      id: `demo-action-${action.category}-${action.unit_type_id ?? action.booking_request_id ?? "portfolio"}`.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase(),
      title: action.title,
      description: action.description,
      exact_next_step: action.exact_next_step,
      estimated_monthly_uplift: action.expected_monthly_uplift,
      confidence: action.confidence_score,
      priority: action.priority,
      category: action.category,
      source_signals: action.linked_signal_titles.map((title) => title.includes("discount") ? "discount" : title.includes("season") ? "seasonality" : title.includes("booking") ? "booking demand" : title.includes("competitor") || title.includes("market") ? "competitor" : "occupancy") as OperatorAction["source_signals"],
      evidence: action.evidence,
      linked_signal_ids: action.linked_signal_titles,
      status: "proposed",
      created_at: new Date().toISOString(),
      completed_at: null,
      facility_id: action.facility_id ?? undefined,
      unit_type_id: action.unit_type_id ?? undefined,
      unit_type_name: unitTypes.find((unitType) => unitType.id === action.unit_type_id)?.name,
      recommended_street_rate: Number(action.proposed_change.recommended_rate ?? 0) || undefined
    }));
    updateDemoState((current) => ({ ...current, actions: generated }));
    return generated;
  };

  return {
    async getFacilities() {
      return demoFacilitiesWithShape();
    },
    getUnitTypes,
    getUnits,
    getBookings,
    getSignals,
    getActions,
    getCompetitors,
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
        customer_phone: input.customer_phone ?? null,
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
    async assignUnitToBooking(input) {
      updateDemoState((current) => ({
        ...current,
        bookingAssignedUnits: { ...current.bookingAssignedUnits, [input.booking_id]: input.unit_id },
        unitStatus: { ...current.unitStatus, [input.unit_id]: "reserved" },
        activity: [
          {
            id: `activity-${Date.now()}`,
            title: "Unit assigned",
            description: `${input.unit_id} reserved for booking ${input.booking_id}`,
            type: "booking",
            created_at: new Date().toISOString()
          },
          ...current.activity
        ]
      }));
    },
    async convertBooking(input) {
      const state = getState();
      const booking = demoBookingsWithState(state).find((item) => item.id === input.booking_id);
      const unitId = input.unit_id ?? state.bookingAssignedUnits[input.booking_id] ?? demoUnitsWithState(state).find((unit) => unit.unit_type_id === booking?.unit_type_id && unit.status === "available")?.id;
      if (!booking || !unitId) throw new Error("Booking or available unit not found");
      updateDemoState((current) => ({
        ...current,
        bookingStatus: { ...current.bookingStatus, [input.booking_id]: "converted" },
        bookingAssignedUnits: { ...current.bookingAssignedUnits, [input.booking_id]: unitId },
        unitStatus: { ...current.unitStatus, [unitId]: "occupied" },
        unitRents: { ...current.unitRents, [unitId]: input.rent ?? booking.quoted_monthly_rate },
        activity: [
          {
            id: `activity-${Date.now()}`,
            title: "Booking converted",
            description: `${booking.customer_name}: ${booking.unit_type_name}`,
            type: "booking",
            created_at: new Date().toISOString()
          },
          ...current.activity
        ]
      }));
    },
    async approveAction(actionId) {
      const state = getState();
      const action = demoActionsWithState(state).find((item) => item.id === actionId);
      const unitType = action?.unit_type_id ? demoUnitTypesWithState(state).find((item) => item.id === action.unit_type_id) : undefined;
      const oldPrice = unitType?.current_street_rate_monthly ?? null;
      const newPrice = action?.recommended_street_rate ?? null;
      updateDemoState((current) => ({
        ...current,
        actionStatus: { ...current.actionStatus, [actionId]: "approved" },
        unitTypePrices: action?.unit_type_id && action.recommended_street_rate ? { ...current.unitTypePrices, [action.unit_type_id]: action.recommended_street_rate } : current.unitTypePrices,
        actionEvents: [event(actionId, "decision_approved", { expected_monthly_uplift: action?.estimated_monthly_uplift ?? null, old_price: oldPrice, new_price: newPrice }), ...current.actionEvents],
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
      await generateSignals();
      await generateActions();
      return observation;
    },
    async addCompetitorUnitType(input) {
      const unitType: CompetitorUnitType = { ...input, id: `demo-competitor-unit-type-${Date.now()}`, created_at: new Date().toISOString() };
      updateDemoState((state) => ({ ...state, activity: [{ id: `activity-${Date.now()}`, title: "Competitor unit type added", description: unitType.name, type: "competitor", created_at: new Date().toISOString() }, ...state.activity] }));
      return unitType;
    },
    async mapCompetitorUnitType(input) {
      const mapping: CompetitorUnitMapping = { ...input, id: `demo-competitor-mapping-${Date.now()}`, created_at: new Date().toISOString() };
      updateDemoState((state) => ({ ...state, activity: [{ id: `activity-${Date.now()}`, title: "Competitor unit mapping added", description: input.own_unit_type_id, type: "competitor", created_at: new Date().toISOString() }, ...state.activity] }));
      return mapping;
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
    generateSignals,
    generateActions,
    getImpactReport,
    async getSnapshot() {
      const state = getState();
      const unitTypes = demoUnitTypesWithState(state);
      const units = demoUnitsWithState(state);
      const observations = demoObservationsWithState(state);
      const bookings = demoBookingsWithState(state);
      const competitors = await getCompetitors();
      const competitorUnitMappings = demoCompetitorUnitMappings.map(normalizeCompetitorUnitMapping);
      const marketAverages = calculateMarketAverages({
        facilities: demoFacilitiesWithShape(),
        unitTypes,
        units,
        bookings,
        competitors,
        facilityCompetitors: demoFacilityCompetitors,
        competitorUnitMappings,
        competitorPriceObservations: observations
      });
      const moneyMap = calculateMoneyMap({ unitTypes, units, bookings });
      return {
        facilities: demoFacilitiesWithShape(),
        unitTypes,
        units,
        bookings,
        leads: [],
        signals: demoSignalsWithState(state),
        actions: demoActionsWithState(state),
        competitors,
        competitorUnitTypes: demoCompetitorUnitTypes.map(normalizeCompetitorUnitType),
        competitorPriceObservations: observations,
        competitorUnitMappings,
        observations,
        campaigns: [...state.campaigns, ...demoCampaigns],
        actionEvents: state.actionEvents,
        weeklyReports: [],
        dataHealth: calculateDataHealth({
          unitTypes,
          units,
          bookings,
          competitors,
          competitorPriceObservations: observations,
          competitorUnitMappings,
          campaigns: [...state.campaigns, ...demoCampaigns]
        }),
        activity: state.activity,
        unitRows: buildUnitPressureRows({ facilities: demoFacilitiesWithShape(), unitTypes, units, bookings, marketAverages }),
        moneyMap,
        impact: await getImpactReport()
      };
    }
  };
}
