import type { Campaign, OperatorAction, OperatorSignal } from "@/lib/operator-demo";
import type { Competitor, CompetitorPriceObservation, CompetitorUnitMapping, CompetitorUnitType } from "@/lib/types";
import type { StorageYieldSnapshot, StorageYieldStore } from "@/lib/state/storageyield-store";

export function createSupabaseStore(): StorageYieldStore {
  const getJson = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error(body.error ?? "Authentication required");
      if (res.status === 403) throw new Error(body.error ?? "Organization access required");
      throw new Error(body.error ?? `Request failed (${res.status})`);
    }
    return res.json();
  };
  const post = async <T = unknown>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) {
      const responseBody = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error(responseBody.error ?? "Authentication required");
      if (res.status === 403) throw new Error(responseBody.error ?? "Organization access required");
      throw new Error(responseBody.error ?? `Request failed (${res.status})`);
    }
    return res.json();
  };
  const getSnapshot = () => getJson<StorageYieldSnapshot>("/api/storageyield/snapshot");

  return {
    getFacilities: async () => (await getSnapshot()).facilities,
    getUnitTypes: async () => (await getSnapshot()).unitTypes,
    getUnits: async () => (await getSnapshot()).units,
    getBookings: async () => (await getSnapshot()).bookings,
    getSignals: async () => (await getSnapshot()).signals,
    getActions: async () => (await getSnapshot()).actions,
    getCompetitors: async () => (await getSnapshot()).competitors,
    getSnapshot,
    submitBooking: (input) => post("/api/widget/submit", input),
    updateBookingStatus: async (bookingId, status) => { await post("/api/bookings/status", { booking_id: bookingId, status }); },
    assignUnitToBooking: async (input) => { await post("/api/bookings/status", { booking_id: input.booking_id, selected_unit_id: input.unit_id, status: "reserved" }); },
    convertBooking: async (input) => { await post("/api/bookings/convert", input); },
    approveAction: async (actionId) => { await post("/api/actions/approve", { action_id: actionId }); },
    completeAction: async (actionId, outcomeNote) => { await post("/api/actions/complete", { action_id: actionId, outcome_note: outcomeNote }); },
    dismissAction: async (actionId) => { await post("/api/actions/dismiss", { action_id: actionId }); },
    updateUnitTypePrice: async (unitTypeId, price) => { await post("/api/unit-types/update-price", { unit_type_id: unitTypeId, current_street_rate_monthly: price }); },
    addCompetitor: async (input) => (await post<{ competitor: Competitor }>("/api/competitors/create", input)).competitor,
    addCompetitorUnitType: async (input) => (await post<{ competitor_unit_type: CompetitorUnitType }>("/api/competitors/unit-types/create", input)).competitor_unit_type,
    addCompetitorPriceObservation: async (input) => (await post<{ observation: CompetitorPriceObservation }>("/api/competitors/observations/create", input)).observation,
    mapCompetitorUnitType: async (input) => (await post<{ mapping: CompetitorUnitMapping }>("/api/competitors/mappings/create", input)).mapping,
    launchCampaign: async (template) => (await post<{ campaign: Campaign }>("/api/campaigns/launch", template)).campaign,
    generateSignals: async (input) => (await post<{ signals: OperatorSignal[] }>("/api/signals/generate", input ?? {})).signals,
    generateActions: async (input) => (await post<{ actions: OperatorAction[] }>("/api/actions/generate", input ?? {})).actions,
    getImpactReport: async () => (await getSnapshot()).impact
  };
}
