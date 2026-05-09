"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createDemoStore, createSupabaseStore, type StorageYieldSnapshot, type StorageYieldStore } from "@/lib/state/storageyield-store";
import type { OperatorAction, OperatorBooking } from "@/lib/operator-demo";

function shouldUseDemoStore() {
  if (process.env.NEXT_PUBLIC_STORAGEYIELD_FORCE_DEMO === "true") return true;
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  return url.pathname.startsWith("/demo") || url.searchParams.get("demo") === "1";
}

function defaultSnapshot(): StorageYieldSnapshot {
  const emptyMoneyMap = {
    pricingGap: 0,
    vacancyDrag: 0,
    discountLeakage: 0,
    arrearsRisk: 0,
    leadFollowUpLoss: 0,
    totalMoneyLeftOnTable: 0,
    items: []
  };
  return {
    facilities: [],
    unitTypes: [],
    units: [],
    bookings: [],
    leads: [],
    competitors: [],
    competitorUnitTypes: [],
    competitorPriceObservations: [],
    competitorUnitMappings: [],
    observations: [],
    signals: [],
    actions: [],
    campaigns: [],
    actionEvents: [],
    weeklyReports: [],
    dataHealth: { score: 0, issues: [] },
    activity: [],
    unitRows: [],
    moneyMap: emptyMoneyMap,
    impact: {
      rentRoll: 0,
      expectedMonthlyUplift: 0,
      simulatedUplift: 0,
      approvedDecisions: 0,
      completedDecisions: 0,
      convertedBookings: 0,
      actionEvents: [],
      completedExpectedUplift: 0,
      newMonthlyRentFromConvertedBookings: 0,
      priceChangesApproved: [],
      convertedBookingRows: [],
      campaignsLaunched: [],
      discountRecoveryActions: [],
      competitorRefreshActions: [],
      actionTimeline: []
    }
  };
}

export function useStorageYieldWorkspace() {
  const [demoMode, setDemoMode] = useState(shouldUseDemoStore);
  const store = useMemo<StorageYieldStore>(() => (demoMode ? createDemoStore() : createSupabaseStore()), [demoMode]);
  const [snapshot, setSnapshot] = useState<StorageYieldSnapshot>(() => defaultSnapshot());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([]);

  const toast = (message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2600);
  };

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const next = await store.getSnapshot();
      setSnapshot(next);
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load workspace";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    setDemoMode(shouldUseDemoStore());
    refresh();
  }, [refresh]);

  const run = async (work: () => Promise<unknown>, message: string) => {
    try {
      await work();
      await refresh();
      toast(message);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const availableUnitForBooking = (booking: OperatorBooking) =>
    snapshot.units.find((unit) => unit.unit_type_id === booking.unit_type_id && unit.status === "available");

  return {
    demoMode,
    store,
    snapshot,
    loading,
    error,
    toasts,
    toast,
    refresh,
    run,
    approveAction: (action: OperatorAction) => run(() => store.approveAction(action.id), action.category === "pricing" ? "Pricing decision approved and price updated" : "Decision approved"),
    dismissAction: (action: OperatorAction) => run(() => store.dismissAction(action.id), "Decision dismissed"),
    completeAction: (action: OperatorAction, note?: string) => run(() => store.completeAction(action.id, note), "Decision completed and added to impact"),
    updatePrice: (unitTypeId: string, price: number) => run(() => store.updateUnitTypePrice(unitTypeId, price), "Street rate updated"),
    moveBooking: (booking: OperatorBooking, status: OperatorBooking["status"], unitId?: string) => run(async () => {
      if (status === "converted") {
        const unit = unitId ? snapshot.units.find((item) => item.id === unitId) : availableUnitForBooking(booking);
        if (!unit) throw new Error("No available unit found for conversion");
        await store.convertBooking({ booking_id: booking.id, unit_id: unit.id, rent: booking.quoted_monthly_rate, tenant_type: booking.customer_type });
        return;
      }
      if (status === "reserved") {
        const unit = unitId ? snapshot.units.find((item) => item.id === unitId) : availableUnitForBooking(booking);
        if (!unit) throw new Error("No available unit found to reserve");
        await store.assignUnitToBooking({ booking_id: booking.id, unit_id: unit.id });
        return;
      }
      await store.updateBookingStatus(booking.id, status);
    }, status === "converted" ? "Booking converted and unit occupied" : `Booking moved to ${status}`),
    generateSignalsAndActions: () => run(async () => {
      await store.generateSignals();
      await store.generateActions();
    }, "Signals and decisions regenerated")
  };
}

export type StorageYieldWorkspace = ReturnType<typeof useStorageYieldWorkspace>;
