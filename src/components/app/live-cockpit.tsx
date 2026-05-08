"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Copy,
  Euro,
  PanelRightOpen,
  Plus,
  Radar,
  RefreshCw,
  TrendingUp,
  X,
  Zap
} from "lucide-react";
import { createDemoStore, createSupabaseStore, type StorageYieldSnapshot, type StorageYieldStore } from "@/lib/state/storageyield-store";
import type { Campaign, OperatorAction, OperatorBooking } from "@/lib/operator-demo";
import type { Competitor, CompetitorUnitType } from "@/lib/types";

type Tone = "slate" | "green" | "amber" | "red" | "blue" | "dark";

const formatEur = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(value));

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function toneClass(tone: Tone) {
  return {
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    dark: "border-slate-950 bg-slate-950 text-white"
  }[tone];
}

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", toneClass(tone))}>{children}</span>;
}

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-slate-950 text-white hover:bg-slate-800",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
        variant === "ghost" && "bg-transparent text-slate-600 shadow-none hover:bg-slate-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500"
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function SlideOver({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Review panel</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          </div>
          <button className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoadingSkeletonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="card p-5" key={index}>
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-8 w-20 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function Toasts({ items }: { items: Array<{ id: string; message: string }> }) {
  return (
    <div className="fixed right-5 top-5 z-[60] space-y-2">
      {items.map((item) => (
        <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-xl" key={item.id}>
          <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          {item.message}
        </div>
      ))}
    </div>
  );
}

function ageLabel(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(diff / 60000));
  if (minutes < 60) return minutes < 1 ? "now" : `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function leadScore(booking: OperatorBooking) {
  let score = 25;
  const moveInDays = Math.round((new Date(booking.preferred_move_in_date).getTime() - Date.now()) / 86400000);
  if (moveInDays <= 7) score += 25;
  if (booking.customer_type === "business") score += 20;
  if (booking.unit_type_name.includes("3") || booking.unit_type_name.includes("5")) score += 15;
  if (booking.unit_type_name.includes("10") || booking.unit_type_name.includes("20")) score += 10;
  if (booking.status === "requested" && Date.now() - Date.parse(booking.created_at) > 86400000) score += 10;
  return Math.min(99, Math.max(10, score));
}

function actionQuestion(action: OperatorAction) {
  const firstEvidence = action.evidence[0]?.toLowerCase() ?? "";
  if (action.title.toLowerCase().startsWith("hold")) return `${action.title}?`;
  if (action.category === "pricing" && action.recommended_street_rate) return `${action.title} to ${formatEur(action.recommended_street_rate)}?`;
  if (action.category === "campaign") return `${action.title}?`;
  if (action.category === "discount_recovery") return "Remove expired discounts?";
  if (action.category === "booking_follow_up") return `${action.title} now?`;
  if (firstEvidence.includes("stale")) return "Refresh stale competitor prices?";
  return `${action.title}?`;
}

function actionTone(action: OperatorAction): Tone {
  if (action.priority === "high") return "red";
  if (action.priority === "medium") return "amber";
  return "slate";
}

function defaultSnapshot(): StorageYieldSnapshot {
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
    impact: { rentRoll: 0, expectedMonthlyUplift: 0, simulatedUplift: 0, approvedDecisions: 0, completedDecisions: 0, convertedBookings: 0, actionEvents: [] }
  };
}

function useStorageYieldWorkspace() {
  const demoMode = process.env.NEXT_PUBLIC_STORAGEYIELD_DEMO_MODE !== "false";
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

function WorkspaceGate({ workspace, children }: { workspace: ReturnType<typeof useStorageYieldWorkspace>; children: ReactNode }) {
  if (workspace.loading) return <LoadingSkeletonCards />;
  if (workspace.error) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-950">Workspace unavailable</h2>
        <p className="mt-2 text-sm text-slate-600">{workspace.error}</p>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => workspace.refresh()} variant="secondary"><RefreshCw className="h-4 w-4" />Retry</Button>
          <Link className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/login">Login</Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function ImpactStat({ label, value, icon: Icon, tone = "slate" }: { label: string; value: string | number; icon: typeof Euro; tone?: Tone }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <span className={cx("rounded-2xl border p-2", toneClass(tone))}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

export function DecisionInboxWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [selected, setSelected] = useState<OperatorAction | null>(null);
  const actions = workspace.snapshot.actions;
  const openActions = actions.filter((action) => !["completed", "dismissed", "rejected"].includes(action.status));
  const openValue = openActions.reduce((sum, action) => sum + (action.estimated_monthly_uplift ?? 0), 0);

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Revenue decision engine</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Decision Inbox</h1>
          <p className="mt-2 max-w-3xl text-lg text-slate-600">Pricing, booking, competitor and campaign decisions waiting for approval.</p>
        </div>
        <Button onClick={() => workspace.generateSignalsAndActions()}><Zap className="h-4 w-4" />Generate decisions</Button>
      </div>

      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={Euro} label="Open decision value" tone="green" value={`${formatEur(openValue)}/mo`} />
          <ImpactStat icon={Clock} label="Awaiting approval" tone="amber" value={actions.filter((action) => action.status === "proposed").length} />
          <ImpactStat icon={Check} label="Approved" tone="green" value={actions.filter((action) => action.status === "approved").length} />
          <ImpactStat icon={AlertTriangle} label="High priority" tone="red" value={actions.filter((action) => action.priority === "high").length} />
          <ImpactStat icon={Radar} label="Data health" tone="amber" value={`${workspace.snapshot.dataHealth.score}%`} />
        </div>

        <section className="space-y-4">
          {actions.length ? actions.map((action) => (
            <article className="card p-5 transition hover:-translate-y-1 hover:shadow-lg" key={action.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={actionTone(action)}>{action.priority}</Badge>
                    <Badge tone={action.status === "approved" || action.status === "completed" ? "green" : "slate"}>{action.status}</Badge>
                    <Badge>{Math.round(action.confidence * 100)}% confidence</Badge>
                    <Badge>{action.category.replaceAll("_", " ")}</Badge>
                  </div>
                  <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950">{actionQuestion(action)}</h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{action.description}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">{action.exact_next_step}</p>
                </div>
                <div className="min-w-48 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Expected uplift</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{action.estimated_monthly_uplift ? `${formatEur(action.estimated_monthly_uplift)}/mo` : "Protects yield"}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button disabled={action.status === "approved" || action.status === "completed"} onClick={() => workspace.approveAction(action)}>Approve</Button>
                <Button onClick={() => setSelected(action)} variant="secondary">View evidence</Button>
                <Button disabled={action.status === "completed"} onClick={() => workspace.completeAction(action, window.prompt("Outcome note (optional)") ?? undefined)} variant="secondary">Complete</Button>
                <Button disabled={["dismissed", "rejected"].includes(action.status)} onClick={() => workspace.dismissAction(action)} variant="ghost">Dismiss</Button>
              </div>
            </article>
          )) : (
            <div className="card p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-950">No decisions yet</h2>
              <p className="mt-2 text-sm text-slate-600">Generate signals and decisions after adding units, bookings and competitor observations.</p>
              <div className="mt-4"><Button onClick={() => workspace.generateSignalsAndActions()}>Generate first decisions</Button></div>
            </div>
          )}
        </section>
      </WorkspaceGate>

      {selected ? (
        <SlideOver title="Decision evidence" onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Question</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{actionQuestion(selected)}</h3>
              <p className="mt-2 text-sm text-slate-600">{selected.exact_next_step}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Expected uplift</p><p className="mt-1 text-2xl font-semibold">{selected.estimated_monthly_uplift ? `${formatEur(selected.estimated_monthly_uplift)}/mo` : "No estimate"}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Confidence</p><p className="mt-1 text-2xl font-semibold">{Math.round(selected.confidence * 100)}%</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Status</p><p className="mt-1 text-2xl font-semibold capitalize">{selected.status}</p></div>
            </div>
            <div className="space-y-3">
              {selected.evidence.length ? selected.evidence.map((item) => (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700" key={item}>{item}</div>
              )) : <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">No evidence rows were stored for this decision.</div>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => { workspace.approveAction(selected); setSelected(null); }}>Approve</Button>
              <Button onClick={() => { workspace.dismissAction(selected); setSelected(null); }} variant="secondary">Dismiss</Button>
            </div>
          </div>
        </SlideOver>
      ) : null}
    </div>
  );
}

export function RevenueControlRoomWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const actions = workspace.snapshot.actions;
  const urgent = actions.find((action) => action.status === "proposed") ?? actions[0];
  const bookingsNeedAction = workspace.snapshot.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status)).length;
  const moneyMap = [
    { id: "pricing", label: "Pricing gap", value: workspace.snapshot.unitRows.filter((row) => (row.gap ?? 0) > 0).reduce((sum, row) => sum + (row.gap ?? 0) * Math.max(1, row.units - row.occupied), 0), copy: "Unit types priced below selected competitors." },
    { id: "vacancy", label: "Vacancy drag", value: 880, copy: "Low-occupancy units needing demand or repositioning." },
    { id: "discount", label: "Discount leakage", value: workspace.snapshot.units.reduce((sum, unit) => sum + Number(unit.discount_monthly ?? 0), 0), copy: "Legacy discounts still reducing rent roll." },
    { id: "arrears", label: "Arrears risk", value: workspace.snapshot.units.reduce((sum, unit) => sum + Number(unit.arrears_amount ?? 0), 0), copy: "Open balances requiring collection follow-up." },
    { id: "booking", label: "Lead follow-up loss", value: bookingsNeedAction * 140, copy: "Booking requests that can still convert this week." }
  ];

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Revenue overview</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Revenue Control Room</h1>
          <p className="mt-2 max-w-3xl text-lg text-slate-600">Live view of revenue pressure, market moves and operational risk.</p>
        </div>
        <Link className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/app/decisions">Open Decision Inbox</Link>
      </div>
      <WorkspaceGate workspace={workspace}>
        {urgent ? (
          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
            <div className="flex flex-wrap gap-2"><Badge tone="green">Urgent decision</Badge><Badge tone="dark">{Math.round(urgent.confidence * 100)}% confidence</Badge></div>
            <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight">{actionQuestion(urgent)}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{urgent.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => workspace.approveAction(urgent)}><Zap className="h-4 w-4" />Approve</Button>
              <Link className="inline-flex items-center rounded-2xl border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950" href="/app/decisions">Review evidence</Link>
            </div>
          </section>
        ) : null}
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={Euro} label="Money left on table" tone="green" value={`${formatEur(moneyMap.reduce((sum, item) => sum + item.value, 0))}/mo`} />
          <ImpactStat icon={Clock} label="Bookings need action" tone="amber" value={bookingsNeedAction} />
          <ImpactStat icon={Radar} label="Competitor moves" tone="blue" value={workspace.snapshot.observations.length} />
          <ImpactStat icon={AlertTriangle} label="Arrears risk" tone="red" value={formatEur(moneyMap.find((item) => item.id === "arrears")?.value ?? 0)} />
          <ImpactStat icon={Check} label="Data health" tone="amber" value={`${workspace.snapshot.dataHealth.score}%`} />
        </div>
        <section className="card p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h2 className="text-2xl font-semibold text-slate-950">Money Map</h2><p className="mt-1 text-slate-600">Click leakage sources in pilot reviews to explain what decisions are blocking revenue.</p></div>
            <p className="text-4xl font-semibold text-slate-950">{formatEur(moneyMap.reduce((sum, item) => sum + item.value, 0))}<span className="text-base text-slate-500">/mo</span></p>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-5">
            {moneyMap.map((item) => (
              <div className="rounded-3xl border border-slate-200 p-5" key={item.id}>
                <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{formatEur(item.value)}</p>
                <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">What changed this week</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {workspace.snapshot.signals.slice(0, 6).map((signal) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={signal.id}>
                  <Badge tone={signal.severity === "high" ? "red" : signal.severity === "medium" ? "amber" : "slate"}>{signal.category.replaceAll("_", " ")}</Badge>
                  <p className="mt-3 font-semibold text-slate-950">{signal.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{signal.evidence}</p>
                </div>
              ))}
              {!workspace.snapshot.signals.length ? <p className="text-sm text-slate-600">Generate signals after adding competitor observations or booking data.</p> : null}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Live activity</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.activity.slice(0, 5).map((event) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={event.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{event.type} · {ageLabel(event.created_at)}</p>
                  <p className="mt-2 font-semibold text-slate-950">{event.title}</p>
                  <p className="text-sm text-slate-600">{event.description}</p>
                </div>
              ))}
              {!workspace.snapshot.activity.length ? <p className="text-sm text-slate-600">Approvals, bookings and competitor observations will appear here.</p> : null}
            </div>
          </div>
        </section>
      </WorkspaceGate>
    </div>
  );
}

export function BookingsWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [selected, setSelected] = useState<OperatorBooking | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const columns: Array<{ id: OperatorBooking["status"]; label: string }> = [
    { id: "requested", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "reserved", label: "Reserved" },
    { id: "converted", label: "Converted" },
    { id: "lost", label: "Lost" }
  ];

  useEffect(() => {
    if (!selected) return;
    const first = workspace.snapshot.units.find((unit) => unit.unit_type_id === selected.unit_type_id && unit.status === "available");
    setSelectedUnitId(first?.id ?? "");
  }, [selected, workspace.snapshot.units]);

  return (
    <div className="space-y-5">
      <Toasts items={workspace.toasts} />
      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 xl:grid-cols-5">
          {columns.map((column) => {
            const rows = workspace.snapshot.bookings.filter((booking) => booking.status === column.id);
            return (
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4" key={column.id}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-950">{column.label}</h2>
                  <Badge>{rows.length}</Badge>
                </div>
                <div className="space-y-3">
                  {rows.map((booking) => (
                    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" key={booking.id}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-950">{booking.customer_name}</h3>
                        <Badge tone={leadScore(booking) >= 70 ? "green" : leadScore(booking) >= 45 ? "amber" : "slate"}>{leadScore(booking)}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{booking.unit_type_name} · {booking.facility_name}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{formatEur(booking.quoted_monthly_rate)}/mo expected</p>
                      <p className="mt-2 text-sm text-slate-600">Move-in {booking.preferred_move_in_date} · age {ageLabel(booking.created_at)}</p>
                      <p className="mt-3 text-sm text-slate-700">{booking.next_action}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {booking.status === "requested" ? <Button onClick={() => workspace.moveBooking(booking, "contacted")} variant="secondary">Contacted</Button> : null}
                        {["requested", "contacted"].includes(booking.status) ? <Button onClick={() => setSelected(booking)} variant="secondary">Assign unit</Button> : null}
                        {booking.status === "reserved" ? <Button onClick={() => workspace.moveBooking(booking, "converted")} variant="secondary">Convert</Button> : null}
                        {!["converted", "lost"].includes(booking.status) ? <Button onClick={() => workspace.moveBooking(booking, "lost")} variant="ghost">Lost</Button> : null}
                        <Button onClick={() => { navigator.clipboard.writeText(`Hi ${booking.customer_name}, we can reserve your ${booking.unit_type_name} at ${booking.facility_name}. Are you available today to confirm?`); workspace.toast("Follow-up copied"); }} variant="ghost">Copy follow-up</Button>
                      </div>
                    </article>
                  ))}
                  {!rows.length ? <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No bookings here.</p> : null}
                </div>
              </section>
            );
          })}
        </div>
      </WorkspaceGate>
      {selected ? (
        <SlideOver title={`Assign unit: ${selected.customer_name}`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{selected.unit_type_name} at {selected.facility_name}</p>
            <select className="w-full rounded-2xl border border-slate-300 p-3" value={selectedUnitId} onChange={(event) => setSelectedUnitId(event.target.value)}>
              {workspace.snapshot.units.filter((unit) => unit.unit_type_id === selected.unit_type_id && unit.status === "available").map((unit) => <option key={unit.id} value={unit.id}>{unit.id}</option>)}
            </select>
            {!selectedUnitId ? <p className="text-sm text-red-600">No available unit found for this unit type.</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button disabled={!selectedUnitId} onClick={() => { workspace.moveBooking(selected, "reserved", selectedUnitId); setSelected(null); }}>Reserve selected unit</Button>
              <Button disabled={!selectedUnitId} onClick={() => { workspace.moveBooking(selected, "converted", selectedUnitId); setSelected(null); }} variant="secondary">Convert now</Button>
            </div>
          </div>
        </SlideOver>
      ) : null}
    </div>
  );
}

export function UnitsPricingWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [selected, setSelected] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState("");
  const selectedRow = workspace.snapshot.unitRows.find((row) => row.id === selected);
  const selectedAction = selectedRow ? workspace.snapshot.actions.find((action) => action.unit_type_id === selectedRow.id && action.category === "pricing" && action.status !== "completed") : undefined;

  useEffect(() => {
    if (selectedRow) setDraftPrice(String(selectedRow.street_rate));
  }, [selectedRow]);

  return (
    <div className="space-y-5">
      <Toasts items={workspace.toasts} />
      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={TrendingUp} label="Under-market opportunities" tone="green" value={workspace.snapshot.unitRows.filter((row) => (row.gap ?? 0) > 0 && row.occupancy >= 85).length} />
          <ImpactStat icon={AlertTriangle} label="Over-market risks" tone="red" value={workspace.snapshot.unitRows.filter((row) => (row.gap ?? 0) < 0 && row.occupancy < 75).length} />
          <ImpactStat icon={Euro} label="Discount leakage" tone="amber" value={formatEur(workspace.snapshot.units.reduce((sum, unit) => sum + Number(unit.discount_monthly ?? 0), 0))} />
          <ImpactStat icon={Radar} label="Missing mappings" tone="slate" value={workspace.snapshot.dataHealth.issues.filter((issue) => issue.id.includes("mapping")).length} />
          <ImpactStat icon={Check} label="Approved this month" tone="green" value={workspace.snapshot.actions.filter((action) => action.category === "pricing" && action.status === "approved").length} />
        </div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Facility</th>
                  <th className="px-4 py-3">Unit type</th>
                  <th className="px-4 py-3">Occupancy</th>
                  <th className="px-4 py-3">Demand 30d</th>
                  <th className="px-4 py-3">Street rate</th>
                  <th className="px-4 py-3">Market avg</th>
                  <th className="px-4 py-3">Gap</th>
                  <th className="px-4 py-3">Revenue/m²</th>
                  <th className="px-4 py-3">Discount leakage</th>
                  <th className="px-4 py-3">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workspace.snapshot.unitRows.map((row) => (
                  <tr className="hover:bg-slate-50" key={row.id}>
                    <td className="px-4 py-4">{row.facility_name}</td>
                    <td className="px-4 py-4"><button className="font-semibold text-slate-950 underline-offset-2 hover:underline" onClick={() => setSelected(row.id)} type="button">{row.name}</button></td>
                    <td className="px-4 py-4">{row.occupancy.toFixed(0)}%</td>
                    <td className="px-4 py-4">{row.demand30}</td>
                    <td className="px-4 py-4">{formatEur(row.street_rate)}</td>
                    <td className="px-4 py-4">{row.market_avg == null ? "n/a" : formatEur(row.market_avg)}</td>
                    <td className="px-4 py-4">{row.gap == null ? "n/a" : formatEur(row.gap)}</td>
                    <td className="px-4 py-4">{formatEur(row.rent_per_m2)}</td>
                    <td className="px-4 py-4">{formatEur(row.discount_leakage)}</td>
                    <td className="px-4 py-4"><Badge tone={row.recommendation.includes("Raise") ? "green" : row.recommendation.includes("Hold") ? "amber" : "slate"}>{row.recommendation}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </WorkspaceGate>
      {selectedRow ? (
        <SlideOver title={`${selectedRow.facility_name} · ${selectedRow.name}`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Current rate</p><p className="mt-1 text-2xl font-semibold">{formatEur(selectedRow.street_rate)}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Market average</p><p className="mt-1 text-2xl font-semibold">{selectedRow.market_avg == null ? "n/a" : formatEur(selectedRow.market_avg)}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Occupancy</p><p className="mt-1 text-2xl font-semibold">{selectedRow.occupancy.toFixed(0)}%</p></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Available units</p><p className="mt-1 text-2xl font-semibold">{selectedRow.units - selectedRow.occupied}</p></div>
            </div>
            <label className="block text-sm font-semibold text-slate-700">Edit street rate</label>
            <input className="w-full rounded-2xl border border-slate-300 p-3" type="number" value={draftPrice} onChange={(event) => setDraftPrice(event.target.value)} />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">Related decision</p>
              <p className="mt-2 text-sm text-slate-600">{selectedAction ? actionQuestion(selectedAction) : "No active pricing decision for this row. Generate decisions after refreshing signals."}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => workspace.updatePrice(selectedRow.id, Number(draftPrice))}>Save price</Button>
              {selectedAction ? <Button onClick={() => workspace.approveAction(selectedAction)} variant="secondary">Approve related decision</Button> : null}
            </div>
          </div>
        </SlideOver>
      ) : null}
    </div>
  );
}

export function MarketRadarWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [competitorName, setCompetitorName] = useState("");
  const [pricingUrl, setPricingUrl] = useState("");
  const [relationship, setRelationship] = useState<"direct" | "partial" | "benchmark" | "ignored">("direct");
  const [selectedCompetitorId, setSelectedCompetitorId] = useState("");
  const [competitorUnitName, setCompetitorUnitName] = useState("3-4 m² unit");
  const [competitorUnitSize, setCompetitorUnitSize] = useState("3.5");
  const [observationPrice, setObservationPrice] = useState("102");
  const [ownUnitTypeId, setOwnUnitTypeId] = useState("");
  const [competitorUnitTypeId, setCompetitorUnitTypeId] = useState("");

  useEffect(() => {
    setSelectedCompetitorId((current) => current || workspace.snapshot.competitors[0]?.id || "");
    setOwnUnitTypeId((current) => current || workspace.snapshot.unitTypes[0]?.id || "");
    setCompetitorUnitTypeId((current) => current || workspace.snapshot.competitorUnitTypes[0]?.id || "");
  }, [workspace.snapshot.competitors, workspace.snapshot.competitorUnitTypes, workspace.snapshot.unitTypes]);

  const selectedCompetitor = workspace.snapshot.competitors.find((competitor) => competitor.id === selectedCompetitorId);
  const direct = workspace.snapshot.competitors.filter((competitor) => !competitor.notes || competitor.notes.includes("direct"));
  const partial = workspace.snapshot.competitors.filter((competitor) => competitor.notes?.includes("partial"));
  const benchmark = workspace.snapshot.competitors.filter((competitor) => competitor.notes?.includes("benchmark"));
  const ignored = workspace.snapshot.competitors.filter((competitor) => competitor.notes?.includes("ignored"));

  const addCompetitor = () => {
    const facility = workspace.snapshot.facilities[0];
    if (!facility || !competitorName.trim()) {
      workspace.toast("Add a facility and competitor name first");
      return;
    }
    workspace.run(() => workspace.store.addCompetitor({
      facility_id: facility.id,
      name: competitorName.trim(),
      pricing_url: pricingUrl || null,
      website_url: pricingUrl || null,
      city: facility.city,
      notes: `${relationship} competitor`,
      relationship_type: relationship
    }), "Competitor added").then(() => {
      setCompetitorName("");
      setPricingUrl("");
    });
  };

  const addObservation = () => {
    if (!selectedCompetitor) {
      workspace.toast("Choose a competitor first");
      return;
    }
    workspace.run(async () => {
      let unitType: CompetitorUnitType | undefined = workspace.snapshot.competitorUnitTypes.find((item) => item.id === competitorUnitTypeId);
      if (!unitType) {
        unitType = await workspace.store.addCompetitorUnitType({
          competitor_id: selectedCompetitor.id,
          name: competitorUnitName,
          size_m2: Number(competitorUnitSize) || null,
          volume_m3: null,
          access_type: null,
          climate_controlled: null,
          floor: null,
          description: null,
          source_url: selectedCompetitor.pricing_url
        });
      }
      await workspace.store.addCompetitorPriceObservation({
        competitor_id: selectedCompetitor.id,
        competitor_unit_type_id: unitType.id,
        observed_price_monthly: Number(observationPrice),
        currency: "EUR",
        promo_text: "Manual pricing page review",
        availability_text: "Available",
        source_url: selectedCompetitor.pricing_url,
        observed_at: new Date().toISOString(),
        observation_method: "manual"
      });
      await workspace.store.generateSignals();
      await workspace.store.generateActions();
    }, "Price observation added and decisions refreshed");
  };

  const saveMapping = () => {
    const ownUnitType = workspace.snapshot.unitTypes.find((item) => item.id === ownUnitTypeId);
    const competitorUnitType = workspace.snapshot.competitorUnitTypes.find((item) => item.id === competitorUnitTypeId);
    const competitor = workspace.snapshot.competitors.find((item) => item.id === selectedCompetitorId);
    if (!ownUnitType || !competitorUnitType || !competitor) {
      workspace.toast("Choose an own unit type and competitor unit type first");
      return;
    }
    workspace.run(() => workspace.store.mapCompetitorUnitType({
      facility_id: ownUnitType.facility_id,
      own_unit_type_id: ownUnitType.id,
      competitor_id: competitor.id,
      competitor_unit_type_id: competitorUnitType.id,
      comparability_score: 1,
      notes: "Pilot mapping"
    }), "Unit mapping saved");
  };

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Competitor intelligence</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Market Radar</h1>
        <p className="mt-2 max-w-3xl text-lg text-slate-600">Track only selected competitors and decide which market signals count for pricing.</p>
      </div>
      <WorkspaceGate workspace={workspace}>
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-950">Automated competitor checks are not active in MVP.</p>
          <p className="mt-1 text-sm text-slate-600">For pilot workspaces, competitor prices are manually verified from operator-selected pricing URLs.</p>
        </div>
        <section className="grid gap-4 xl:grid-cols-3">
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-slate-950">Add competitor URL</h2>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Competitor name" value={competitorName} onChange={(event) => setCompetitorName(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Pricing URL" value={pricingUrl} onChange={(event) => setPricingUrl(event.target.value)} />
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={relationship} onChange={(event) => setRelationship(event.target.value as typeof relationship)}>
                <option value="direct">Direct competitor</option>
                <option value="partial">Partial competitor</option>
                <option value="benchmark">Benchmark only</option>
                <option value="ignored">Ignore for pricing</option>
              </select>
              <Button onClick={addCompetitor}><Plus className="h-4 w-4" />Add competitor</Button>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-slate-950">Manual price observation</h2>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={selectedCompetitorId} onChange={(event) => setSelectedCompetitorId(event.target.value)}>
                {workspace.snapshot.competitors.map((competitor) => <option key={competitor.id} value={competitor.id}>{competitor.name}</option>)}
              </select>
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Competitor unit type" value={competitorUnitName} onChange={(event) => setCompetitorUnitName(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Size m2" value={competitorUnitSize} onChange={(event) => setCompetitorUnitSize(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Observed price" type="number" value={observationPrice} onChange={(event) => setObservationPrice(event.target.value)} />
              <Button onClick={addObservation}>Add observation</Button>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-slate-950">Map unit sizes</h2>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={ownUnitTypeId} onChange={(event) => setOwnUnitTypeId(event.target.value)}>
                {workspace.snapshot.unitTypes.map((unitType) => <option key={unitType.id} value={unitType.id}>{unitType.name}</option>)}
              </select>
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={competitorUnitTypeId} onChange={(event) => setCompetitorUnitTypeId(event.target.value)}>
                {workspace.snapshot.competitorUnitTypes.map((unitType) => <option key={unitType.id} value={unitType.id}>{unitType.name}</option>)}
              </select>
              <Button onClick={saveMapping}>Save mapping</Button>
            </div>
          </div>
        </section>
        <section className="grid gap-4 xl:grid-cols-4">
          {[
            ["Direct competitors", direct, "Used in recommendations"],
            ["Partial competitors", partial, "Used with lower weight"],
            ["Benchmark only", benchmark, "Displayed, not used"],
            ["Ignored", ignored, "Not used in recommendations"]
          ].map(([label, rows, helper]) => (
            <div className="card p-5" key={String(label)}>
              <h2 className="text-xl font-semibold text-slate-950">{String(label)}</h2>
              <p className="mt-1 text-sm text-slate-600">{String(helper)}</p>
              <div className="mt-4 space-y-2">
                {(rows as Competitor[]).map((competitor) => <div className="rounded-2xl border border-slate-200 p-3 font-semibold text-slate-950" key={competitor.id}>{competitor.name}</div>)}
                {!(rows as Competitor[]).length ? <p className="text-sm text-slate-500">None yet.</p> : null}
              </div>
            </div>
          ))}
        </section>
        <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Price observations</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.observations.slice(0, 8).map((observation) => {
                const competitor = workspace.snapshot.competitors.find((item) => item.id === observation.competitor_id);
                return (
                  <div className="rounded-2xl border border-slate-200 p-4" key={observation.id}>
                    <p className="font-semibold text-slate-950">{competitor?.name ?? "Competitor"} · {formatEur(observation.observed_price_monthly)}</p>
                    <p className="mt-1 text-sm text-slate-600">Last checked {ageLabel(observation.observed_at)} ago · {observation.observation_method}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Our price vs market</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.unitRows.filter((row) => row.market_avg != null).slice(0, 6).map((row) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={row.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{row.facility_name} · {row.name}</p>
                    <Badge tone={(row.gap ?? 0) > 0 ? "green" : "red"}>{(row.gap ?? 0) > 0 ? "below market" : "above market"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Our price {formatEur(row.street_rate)} · market {formatEur(row.market_avg ?? 0)} · gap {row.gap == null ? "n/a" : formatEur(row.gap)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </WorkspaceGate>
    </div>
  );
}

export function SignalsWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [query, setQuery] = useState("");
  const filtered = workspace.snapshot.signals.filter((signal) => `${signal.title} ${signal.category} ${signal.evidence}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Live intelligence</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Signals Feed</h1>
          <p className="mt-2 text-lg text-slate-600">Raw detected events from bookings, pricing, discounts, arrears, seasonality and competitor movement.</p>
        </div>
        <Button onClick={() => workspace.generateSignalsAndActions()}>Refresh signals</Button>
      </div>
      <WorkspaceGate workspace={workspace}>
        <div className="card p-4">
          <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Search live intelligence feed" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="space-y-4">
          {filtered.map((signal) => (
            <article className="card grid gap-4 p-5 lg:grid-cols-[48px_1fr_160px]" key={signal.id}>
              <div className={cx("flex h-12 w-12 items-center justify-center rounded-2xl border", toneClass(signal.severity === "high" ? "red" : signal.severity === "medium" ? "amber" : "slate"))}><Radar className="h-5 w-5" /></div>
              <div>
                <div className="flex flex-wrap gap-2"><Badge tone={signal.severity === "high" ? "red" : signal.severity === "medium" ? "amber" : "slate"}>{signal.severity}</Badge><Badge>{signal.category.replaceAll("_", " ")}</Badge></div>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">{signal.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{signal.evidence}</p>
                <p className="mt-2 text-xs text-slate-500">{signal.facility_name}{signal.unit_type_name ? ` · ${signal.unit_type_name}` : ""} · {ageLabel(signal.created_at)} ago</p>
              </div>
              <Link className="self-center text-sm font-semibold text-emerald-700" href="/app/decisions">Linked decisions</Link>
            </article>
          ))}
          {!filtered.length ? <div className="card p-8 text-center text-sm text-slate-600">No matching signals. Refresh signals after adding operational data.</div> : null}
        </div>
      </WorkspaceGate>
    </div>
  );
}

const campaignTemplates = [
  { id: "student", name: "Student Summer Storage", why: "May-August demand spike for 1-5 m² units.", target: "1-5 m² · student", offer: "First month 50% off for move-ins before 15 June.", kpi: "+18 leads / +€520 rent" },
  { id: "moving", name: "Moving Season", why: "Apartment moves lift short-term demand.", target: "3-10 m² · private", offer: "Free lock and flexible first month.", kpi: "+12 bookings" },
  { id: "contractor", name: "Contractor Storage", why: "Business customers have higher monthly value.", target: "10-20 m² · contractor", offer: "Business rate review and easy van access.", kpi: "+€740 rent" },
  { id: "ecommerce", name: "E-commerce Overflow", why: "Q4 stock overflow creates predictable demand.", target: "5-20 m² · e-commerce", offer: "Seasonal overflow storage with monthly renewal.", kpi: "+4 business bookings" },
  { id: "archive", name: "Archive Storage", why: "Archive customers stay longer and churn less.", target: "5-10 m² · archive", offer: "Simple monthly archive storage for local offices.", kpi: "+€360 rent" },
  { id: "winter", name: "Winter Vacancy Fill", why: "November-February demand softens for weak unit types.", target: "10-20 m² · private", offer: "Winter move-in promo for vacant large units.", kpi: "+7 occupied units" }
];

export function CampaignsWorkspace() {
  const workspace = useStorageYieldWorkspace();

  const launchTemplate = (template: (typeof campaignTemplates)[number]) => {
    const facility = workspace.snapshot.facilities[0];
    const unitType = workspace.snapshot.unitTypes.find((item) => item.size_m2 <= 5) ?? workspace.snapshot.unitTypes[0];
    if (!facility || !unitType) {
      workspace.toast("Add a facility and unit type before launching a campaign");
      return;
    }
    const campaign: Campaign = {
      id: `campaign-${template.id}-${Date.now()}`,
      name: template.name,
      facility_id: facility.id,
      facility_name: facility.name,
      target_unit_type_id: unitType.id,
      target_unit_type_name: unitType.name,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: "2026-08-31",
      promotion_text: template.offer,
      target_customer_type: template.id === "student" ? "student" : template.id === "contractor" ? "contractor" : template.id === "archive" ? "archive" : template.id === "ecommerce" ? "e-commerce" : "private",
      objective: "boost demand",
      status: "active",
      leads: 0,
      bookings: 0,
      conversions: 0,
      estimated_rent_created: 0,
      units_affected: 12
    };
    workspace.run(() => workspace.store.launchCampaign(campaign), `${template.name} launched`);
  };

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Revenue playbooks</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Campaign Playbooks</h1>
        <p className="mt-2 max-w-3xl text-lg text-slate-600">Launch seasonal and vacancy plays, then track leads, bookings, conversions and rent created.</p>
      </div>
      <WorkspaceGate workspace={workspace}>
        <section className="grid gap-4 xl:grid-cols-2">
          {campaignTemplates.map((template) => (
            <article className="card p-5 transition hover:-translate-y-1 hover:shadow-lg" key={template.id}>
              <div className="flex items-start justify-between gap-4">
                <div><h2 className="text-2xl font-semibold text-slate-950">{template.name}</h2><p className="mt-2 text-slate-600">{template.why}</p></div>
                <Badge tone="green">{template.kpi}</Badge>
              </div>
              <p className="mt-5 text-sm text-slate-700"><strong>Target:</strong> {template.target}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Offer:</strong> {template.offer}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Widget promo:</strong> {template.name} available now. Reserve before availability tightens.</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Follow-up:</strong> We can hold a unit for your move-in date and confirm availability today.</p>
              <div className="mt-5"><Button onClick={() => launchTemplate(template)}>Launch campaign</Button></div>
            </article>
          ))}
        </section>
        <section className="card p-5">
          <h2 className="text-2xl font-semibold text-slate-950">Active campaigns</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {workspace.snapshot.campaigns.map((campaign) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={campaign.id}>
                <div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-950">{campaign.name}</p><Badge tone={campaign.status === "active" ? "green" : "slate"}>{campaign.status}</Badge></div>
                <p className="mt-1 text-sm text-slate-600">{campaign.facility_name} · {campaign.target_unit_type_name}</p>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="rounded-xl bg-slate-50 p-2">Leads<p className="font-semibold">{campaign.leads}</p></div>
                  <div className="rounded-xl bg-slate-50 p-2">Bookings<p className="font-semibold">{campaign.bookings}</p></div>
                  <div className="rounded-xl bg-slate-50 p-2">Won<p className="font-semibold">{campaign.conversions}</p></div>
                  <div className="rounded-xl bg-slate-50 p-2">Rent<p className="font-semibold">{formatEur(campaign.estimated_rent_created)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </WorkspaceGate>
    </div>
  );
}

export function ReportsWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const reportText = `StorageYield weekly impact\nRent roll: ${formatEur(workspace.snapshot.impact.rentRoll)}\nExpected uplift approved: ${formatEur(workspace.snapshot.impact.expectedMonthlyUplift)}\nBookings converted: ${workspace.snapshot.impact.convertedBookings}`;
  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Owner impact</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Impact Report</h1>
          <p className="mt-2 text-lg text-slate-600">Impact, risks and next-week priorities from the revenue decision loop.</p>
        </div>
        <CopyButton text={reportText} />
      </div>
      <WorkspaceGate workspace={workspace}>
        <div className="grid gap-4 md:grid-cols-5">
          <ImpactStat icon={Euro} label="Rent roll" tone="green" value={formatEur(workspace.snapshot.impact.rentRoll)} />
          <ImpactStat icon={TrendingUp} label="Expected uplift" tone="green" value={formatEur(workspace.snapshot.impact.expectedMonthlyUplift)} />
          <ImpactStat icon={Check} label="Approved decisions" tone="green" value={workspace.snapshot.impact.approvedDecisions} />
          <ImpactStat icon={Zap} label="Completed" tone="blue" value={workspace.snapshot.impact.completedDecisions} />
          <ImpactStat icon={Clock} label="Bookings converted" tone="amber" value={workspace.snapshot.impact.convertedBookings} />
        </div>
        <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Measured impact</h2>
            <p className="mt-2 text-slate-600">Approved pricing, converted bookings and launched campaigns are carried into this report through the shared store.</p>
            <div className="mt-5 space-y-3">
              {workspace.snapshot.actions.filter((action) => ["approved", "completed", "active"].includes(action.status)).map((action) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={action.id}>
                  <div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-950">{action.title}</p><Badge tone="green">{action.status}</Badge></div>
                  <p className="mt-1 text-sm text-slate-600">{action.estimated_monthly_uplift ? `${formatEur(action.estimated_monthly_uplift)}/mo expected` : "Tracked outcome"}</p>
                </div>
              ))}
              {!workspace.snapshot.actions.some((action) => ["approved", "completed", "active"].includes(action.status)) ? <p className="text-sm text-slate-600">Approve a decision to start tracking impact.</p> : null}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Next week priorities</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.actions.filter((action) => action.status === "proposed").slice(0, 5).map((action) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={action.id}>
                  <p className="font-semibold text-slate-950">{actionQuestion(action)}</p>
                  <p className="mt-1 text-sm text-slate-600">{action.exact_next_step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="grid gap-5 md:grid-cols-3">
          <div className="card p-5"><h2 className="font-semibold text-slate-950">Bookings and conversion</h2><p className="mt-3 text-sm text-slate-600">{workspace.snapshot.impact.convertedBookings} converted, {workspace.snapshot.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status)).length} still need follow-up.</p></div>
          <div className="card p-5"><h2 className="font-semibold text-slate-950">Competitor movements</h2><p className="mt-3 text-sm text-slate-600">{workspace.snapshot.observations.length} manual competitor observations are stored for pricing evidence.</p></div>
          <div className="card p-5"><h2 className="font-semibold text-slate-950">Data risks</h2><p className="mt-3 text-sm text-slate-600">Data Health is {workspace.snapshot.dataHealth.score}%. {workspace.snapshot.dataHealth.issues[0]?.title ?? "No immediate issues."}</p></div>
        </section>
      </WorkspaceGate>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
      variant="secondary"
    >
      <span className="inline-flex items-center gap-2">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}

export function SettingsWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const widgetUrl = "http://localhost:3000/widget/brussels-north-storage";
  const iframe = `<iframe src="${widgetUrl}" width="100%" height="720" style="border:0;border-radius:12px;"></iframe>`;
  const setup = [
    ["Add facility", workspace.snapshot.facilities.length > 0],
    ["Add unit types", workspace.snapshot.unitTypes.length > 0],
    ["Add units and prices", workspace.snapshot.units.length > 0 && workspace.snapshot.unitTypes.every((unitType) => unitType.current_street_rate_monthly > 0)],
    ["Add 3 competitors", workspace.snapshot.competitors.length >= 3],
    ["Add competitor price observations", workspace.snapshot.observations.length > 0],
    ["Install booking widget", true],
    ["Submit test booking", workspace.snapshot.bookings.length > 0],
    ["Generate first decisions", workspace.snapshot.actions.length > 0]
  ];

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Data and integrations</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Data & Integrations</h1>
        <p className="mt-2 text-lg text-slate-600">Set up the revenue decision loop without pretending future PMS integrations already exist.</p>
      </div>
      <WorkspaceGate workspace={workspace}>
        <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Setup checklist</h2>
            <div className="mt-4 space-y-3">
              {setup.map(([label, done]) => (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3" key={String(label)}>
                  <p className="font-semibold text-slate-950">{String(label)}</p>
                  <Badge tone={done ? "green" : "amber"}>{done ? "Done" : "Needed"}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Data Health: {workspace.snapshot.dataHealth.score}%</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {workspace.snapshot.dataHealth.issues.map((issue) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={issue.id}>
                  <Badge tone={issue.severity === "high" ? "red" : issue.severity === "medium" ? "amber" : "slate"}>{issue.severity}</Badge>
                  <p className="mt-2 font-semibold text-slate-950">{issue.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{issue.cta}</p>
                </div>
              ))}
              {!workspace.snapshot.dataHealth.issues.length ? <p className="text-sm text-slate-600">No data health issues found.</p> : null}
            </div>
          </div>
        </section>
        <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Widget installation</h2>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. Add the iframe to your website booking page.</li>
              <li>2. Submit a test booking.</li>
              <li>3. Review the request in Booking Conversion.</li>
            </ol>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-white">{iframe}</pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <CopyButton text={iframe} />
              <Link className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/widget/brussels-north-storage">Test booking</Link>
            </div>
          </div>
          <div className="card overflow-hidden p-3"><iframe className="h-[560px] w-full rounded-2xl border border-slate-200" src="/widget/brussels-north-storage" /></div>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Booking widget", "Available now"],
            ["Manual unit setup", "Available now"],
            ["CSV import for units/prices", "Pilot-assisted"],
            ["Manual competitor observations", "Available now"],
            ["Google Sheets sync", "Coming soon"],
            ["PMS export import", "Coming soon"],
            ["Stora/SiteLink/Storeganise integrations", "Coming soon"],
            ["Payment/access-control imports", "Coming soon"]
          ].map(([label, state]) => (
            <div className="card p-5" key={label}>
              <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-slate-950">{label}</h3><PanelRightOpen className="h-5 w-5 text-slate-400" /></div>
              <p className="mt-2 text-sm text-slate-600">{state}</p>
            </div>
          ))}
        </section>
      </WorkspaceGate>
    </div>
  );
}

export const ActionCenterWorkspace = RevenueControlRoomWorkspace;
