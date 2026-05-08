"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  Check,
  CircleDollarSign,
  Copy,
  Gauge,
  Megaphone,
  PanelRightOpen,
  Plus,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingDown,
  TrendingUp,
  X,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ActionStatus,
  Campaign,
  OperatorAction,
  OperatorBooking,
  OperatorSignal,
  actionCenterKpis,
  competitorPriceMovementRows,
  demoActions,
  demoCampaigns,
  demoOperatorBookings,
  demoSignals,
  eur,
  seasonalRules,
  unitPressureRows
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
import { loadDemoState, updateDemoState, type DemoState } from "@/lib/demo-state";
import type { Competitor, CompetitorPriceObservation } from "@/lib/types";

type Tone = "dark" | "green" | "amber" | "red" | "blue" | "slate";
type ActivityEvent = DemoState["activity"][number];
type UnitPressureRow = ReturnType<typeof unitPressureRows>[number];

const moneyMap = [
  { id: "pricing", label: "Pricing gap", value: 1210, description: "Unit types priced below selected direct competitors." },
  { id: "vacancy", label: "Vacancy drag", value: 880, description: "Low-occupancy unit types that need demand or repositioning." },
  { id: "discount", label: "Discount leakage", value: 314, description: "Legacy discounts still reducing monthly rent roll." },
  { id: "arrears", label: "Arrears risk", value: 846, description: "Open tenant balances requiring collection follow-up." },
  { id: "booking", label: "Lead follow-up loss", value: 420, description: "Booking requests that can still convert this week." }
];

const campaignTemplates = [
  {
    id: "tpl-student",
    name: "Student Summer Storage",
    why: "May-August demand spike for 1-5 m² units.",
    targetSize: "1-5 m²",
    targetCustomer: "student",
    offer: "First month 50% off for move-ins before 15 June.",
    widgetText: "Student storage available now. Book before exams end.",
    emailCopy: "Hi, we still have small units available for summer storage. I can reserve one today.",
    kpi: "+18 leads / +€520 rent"
  },
  {
    id: "tpl-moving",
    name: "Moving Season",
    why: "Apartment moves lift short-term demand.",
    targetSize: "3-10 m²",
    targetCustomer: "private",
    offer: "Free lock and flexible first month.",
    widgetText: "Moving soon? Reserve storage before move-in week.",
    emailCopy: "I can hold a unit for your move-in date and confirm availability today.",
    kpi: "+12 bookings"
  },
  {
    id: "tpl-contractor",
    name: "Contractor Storage",
    why: "Business customers have higher monthly value.",
    targetSize: "10-20 m²",
    targetCustomer: "contractor",
    offer: "Business rate review and easy van access.",
    widgetText: "Secure tools and materials near your next site.",
    emailCopy: "We have contractor-friendly units with flexible monthly terms.",
    kpi: "+€740 rent"
  },
  {
    id: "tpl-ecommerce",
    name: "E-commerce Overflow",
    why: "Q4 stock overflow creates predictable demand.",
    targetSize: "5-20 m²",
    targetCustomer: "e-commerce",
    offer: "Seasonal overflow storage with monthly renewal.",
    widgetText: "Need extra stock space before Q4?",
    emailCopy: "We can reserve overflow space before peak season starts.",
    kpi: "+4 business bookings"
  },
  {
    id: "tpl-archive",
    name: "Archive Storage",
    why: "Archive customers stay longer and churn less.",
    targetSize: "5-10 m²",
    targetCustomer: "archive",
    offer: "Simple monthly archive storage for local offices.",
    widgetText: "Archive storage for offices and accountants.",
    emailCopy: "We can price archive storage by unit size and access frequency.",
    kpi: "+€360 rent"
  },
  {
    id: "tpl-winter",
    name: "Winter Vacancy Fill",
    why: "November-February demand softens for weak unit types.",
    targetSize: "10-20 m²",
    targetCustomer: "private",
    offer: "Winter move-in promo for vacant large units.",
    widgetText: "Winter storage promo on selected large units.",
    emailCopy: "We are running a limited winter promo on larger units this month.",
    kpi: "+7 occupied units"
  },
  {
    id: "tpl-large",
    name: "Large Unit Promo",
    why: "Large units have vacancy pressure in Ghent.",
    targetSize: "10-20 m²",
    targetCustomer: "business",
    offer: "First week free for large-unit move-ins.",
    widgetText: "Large storage units available for business and moves.",
    emailCopy: "I can reserve a larger unit with a short launch promo.",
    kpi: "+€610 rent"
  }
];

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function toneClass(tone: Tone) {
  return {
    dark: "border-slate-950 bg-slate-950 text-white",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700"
  }[tone];
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", toneClass(tone))}>{children}</span>;
}

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
}) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        variant === "primary" && "bg-slate-950 text-white hover:bg-slate-800",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
        variant === "ghost" && "bg-transparent text-slate-600 shadow-none hover:bg-slate-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500"
      )}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function SlideOver({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm">
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

function Toasts({ items }: { items: Array<{ id: string; message: string }> }) {
  return (
    <div className="fixed right-5 top-5 z-[60] space-y-2">
      {items.map((item) => (
        <div className="animate-[slideIn_0.22s_ease-out] rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-xl" key={item.id}>
          <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          {item.message}
        </div>
      ))}
    </div>
  );
}

export function LoadingSkeletonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="card p-5" key={index}>
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-8 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-2 w-full animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function baseActivity(): ActivityEvent[] {
  return [
    {
      id: "activity-competitor",
      title: "Competitor price moved",
      description: "BoxPlus Brussels raised 3 m² from €95 to €102. Your price is €92.",
      type: "competitor",
      created_at: new Date(Date.now() - 1000 * 60 * 7).toISOString()
    },
    {
      id: "activity-booking",
      title: "New booking request",
      description: "Maya Peeters requested a Brussels 3 m² unit from the booking widget.",
      type: "booking",
      created_at: new Date(Date.now() - 1000 * 60 * 16).toISOString()
    },
    {
      id: "activity-action",
      title: "Action generated",
      description: "StorageYield created a pricing action for Brussels 3 m² units.",
      type: "action",
      created_at: new Date(Date.now() - 1000 * 60 * 31).toISOString()
    }
  ];
}

function ageLabel(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(diff / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function leadScore(booking: OperatorBooking) {
  let score = 30;
  const moveInDays = Math.round((new Date(booking.preferred_move_in_date).getTime() - Date.now()) / 86400000);
  if (moveInDays <= 7) score += 25;
  if (booking.customer_type === "business") score += 20;
  if (booking.unit_type_name.includes("3") || booking.unit_type_name.includes("5")) score += 10;
  if (booking.unit_type_name.includes("20") || booking.unit_type_name.includes("10")) score += 15;
  if (booking.status === "requested") score += 10;
  return Math.min(99, score);
}

function bookingColumn(status: OperatorBooking["status"]) {
  return {
    requested: "New",
    contacted: "Contacted",
    reserved: "Reserved",
    converted: "Converted",
    lost: "Lost"
  }[status];
}

function unitStatus(row: UnitPressureRow) {
  if (row.market_avg === null) return { label: "Missing market data", tone: "slate" as Tone };
  if ((row.gap ?? 0) > row.street_rate * 0.05 && row.occupancy >= 85) return { label: "Under market", tone: "green" as Tone };
  if (row.occupancy < 70 && (row.gap ?? 0) < 0) return { label: "Vacancy pressure", tone: "red" as Tone };
  if (row.discount_leakage > 0) return { label: "Discount issue", tone: "amber" as Tone };
  if (row.demand30 >= 20) return { label: "High demand", tone: "blue" as Tone };
  return { label: "Do not raise", tone: "slate" as Tone };
}

function signalFamily(category: string) {
  if (category.includes("competitor")) return "competitor";
  if (category.includes("demand") || category.includes("booking")) return "booking";
  if (category.includes("discount")) return "discount";
  if (category.includes("arrears")) return "arrears";
  if (category.includes("seasonal")) return "seasonality";
  if (category.includes("stale")) return "data health";
  return "pricing";
}

function normalizeObservation(row: (typeof demoCompetitorPriceObservations)[number]): CompetitorPriceObservation {
  return {
    ...row,
    observation_method: "manual",
    created_at: row.observed_at
  };
}

function useRevenueDemo() {
  const [state, setState] = useState<DemoState>(() => loadDemoState());
  const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([]);

  useEffect(() => {
    setState(loadDemoState());
  }, []);

  const toast = (message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2400);
  };

  const persist = (update: (current: DemoState) => DemoState, message?: string) => {
    const next = updateDemoState(update);
    setState(next);
    if (message) toast(message);
    return next;
  };

  const actions = useMemo(() => {
    const customIds = new Set(state.actions.map((action) => action.id));
    const base = demoActions.filter((action) => !customIds.has(action.id));
    return [...state.actions, ...base].map((action) => ({
      ...action,
      status: (state.actionStatus[action.id] as ActionStatus | undefined) ?? action.status,
      completed_at: state.completedActionIds.includes(action.id) ? (action.completed_at ?? new Date().toISOString()) : action.completed_at
    }));
  }, [state.actions, state.actionStatus, state.completedActionIds]);

  const bookings = useMemo(() => {
    const customIds = new Set(state.bookings.map((booking) => booking.id));
    const base = demoOperatorBookings.filter((booking) => !customIds.has(booking.id));
    return [...state.bookings, ...base].map((booking) => ({
      ...booking,
      status: (state.bookingStatus[booking.id] as OperatorBooking["status"] | undefined) ?? booking.status
    }));
  }, [state.bookings, state.bookingStatus]);

  const effectiveUnits = useMemo(() => demoUnits.map((unit) => ({
    ...unit,
    status: (state.unitStatus[unit.id] ?? unit.status) as typeof unit.status,
    current_rent_monthly: state.unitRents[unit.id] ?? unit.current_rent_monthly
  })), [state.unitRents, state.unitStatus]);

  const unitRows = useMemo(() => unitPressureRows(effectiveUnits, demoUnitTypes).map((row) => {
    const rate = state.unitTypePrices[row.id] ?? row.street_rate;
    return {
      ...row,
      street_rate: rate,
      gap: row.market_avg !== null ? row.market_avg - rate : null,
      rent_per_m2: rate / (demoUnitTypes.find((unitType) => unitType.id === row.id)?.size_m2 ?? 1)
    };
  }), [effectiveUnits, state.unitTypePrices]);

  const campaigns = useMemo(() => {
    const customIds = new Set(state.campaigns.map((campaign) => campaign.id));
    return [...state.campaigns, ...demoCampaigns.filter((campaign) => !customIds.has(campaign.id))];
  }, [state.campaigns]);

  const competitors = useMemo(() => {
    const customIds = new Set(state.competitors.map((competitor) => competitor.id));
    return [...state.competitors, ...demoCompetitors.filter((competitor) => !customIds.has(competitor.id)) as Competitor[]];
  }, [state.competitors]);

  const observations = useMemo(() => {
    const customIds = new Set(state.observations.map((observation) => observation.id));
    return [...state.observations, ...demoCompetitorPriceObservations.filter((observation) => !customIds.has(observation.id)).map(normalizeObservation)];
  }, [state.observations]);

  const signals = useMemo(() => {
    const customIds = new Set(state.signals.map((signal) => signal.id));
    return [...state.signals, ...demoSignals.filter((signal) => !customIds.has(signal.id))];
  }, [state.signals]);

  const activity = useMemo(() => [...state.activity, ...baseActivity()].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)), [state.activity]);

  const addActivity = (event: Omit<ActivityEvent, "id" | "created_at">) => {
    persist((current) => ({
      ...current,
      activity: [{ ...event, id: `activity-${Date.now()}`, created_at: new Date().toISOString() }, ...current.activity].slice(0, 16)
    }));
  };

  const setActionStatus = (action: OperatorAction, status: ActionStatus, outcomeNote?: string) => {
    persist((current) => ({
      ...current,
      actionStatus: { ...current.actionStatus, [action.id]: status },
      completedActionIds: status === "completed" ? Array.from(new Set([...current.completedActionIds, action.id])) : current.completedActionIds,
      actionOutcomeNotes: outcomeNote ? { ...current.actionOutcomeNotes, [action.id]: outcomeNote } : current.actionOutcomeNotes,
      actionEvents: [
        {
          id: `event-${Date.now()}`,
          action_id: action.id,
          event_type: `decision_${status}`,
          payload: { outcome_note: outcomeNote ?? null, expected_monthly_uplift: action.estimated_monthly_uplift },
          created_at: new Date().toISOString()
        },
        ...current.actionEvents
      ],
      activity: [
        { id: `activity-${Date.now()}`, title: `Decision ${status}`, description: action.title, type: "action", created_at: new Date().toISOString() },
        ...current.activity
      ].slice(0, 16)
    }), status === "approved" ? "Decision approved" : status === "completed" ? "Decision completed and added to Impact Report" : status === "rejected" ? "Decision rejected" : "Decision updated");
  };

  const approvePrice = (action: OperatorAction) => {
    if (!action.unit_type_id || !action.recommended_street_rate) {
      setActionStatus(action, "approved");
      return;
    }
    const recommendedRate = action.recommended_street_rate;
    persist((current) => ({
      ...current,
      unitTypePrices: { ...current.unitTypePrices, [action.unit_type_id!]: recommendedRate },
      actionStatus: { ...current.actionStatus, [action.id]: "approved" },
      actionEvents: [
        {
          id: `event-${Date.now()}`,
          action_id: action.id,
          event_type: "price_decision_approved",
          payload: { unit_type_id: action.unit_type_id, approved_rate: recommendedRate, expected_monthly_uplift: action.estimated_monthly_uplift },
          created_at: new Date().toISOString()
        },
        ...current.actionEvents
      ],
      activity: [
        {
          id: `activity-${Date.now()}`,
          title: "Price approved",
          description: `${action.unit_type_name} new-customer price changed to ${eur(recommendedRate)}.`,
          type: "action",
          created_at: new Date().toISOString()
        },
        ...current.activity
      ].slice(0, 16)
    }), `Price decision approved: ${action.unit_type_name} to ${eur(recommendedRate)}`);
  };

  const setBookingStatus = (booking: OperatorBooking, status: OperatorBooking["status"]) => {
    const assignedUnit = state.bookingAssignedUnits[booking.id];
    const nextUnit = assignedUnit ?? effectiveUnits.find((unit) => unit.unit_type_id === booking.unit_type_id && unit.status === "available")?.id;
    persist((current) => ({
      ...current,
      bookingStatus: { ...current.bookingStatus, [booking.id]: status },
      bookingAssignedUnits: nextUnit && (status === "reserved" || status === "converted") ? { ...current.bookingAssignedUnits, [booking.id]: nextUnit } : current.bookingAssignedUnits,
      unitStatus: nextUnit && (status === "reserved" || status === "converted")
        ? { ...current.unitStatus, [nextUnit]: status === "converted" ? "occupied" : "reserved" }
        : current.unitStatus,
      unitRents: nextUnit && status === "converted" ? { ...current.unitRents, [nextUnit]: booking.quoted_monthly_rate } : current.unitRents,
      activity: [
        {
          id: `activity-${Date.now()}`,
          title: `Booking ${bookingColumn(status).toLowerCase()}`,
          description: `${booking.customer_name}: ${booking.unit_type_name}`,
          type: "booking",
          created_at: new Date().toISOString()
        },
        ...current.activity
      ].slice(0, 16)
    }), status === "converted" ? "Booking converted and rent roll updated" : `Booking moved to ${bookingColumn(status)}`);
  };

  const dataHealth = useMemo(() => {
    const stale = observations.filter((observation) => (Date.now() - Date.parse(observation.observed_at)) / 86400000 > 45).length;
    const missingMappings = demoUnitTypes.filter((unitType) => !demoCompetitorUnitMappings.some((mapping) => mapping.own_unit_type_id === unitType.id)).length;
    const discounts = demoUnits.filter((unit) => unit.discount_monthly > 0).length;
    const bookingsWithoutNextAction = bookings.filter((booking) => !booking.next_action).length;
    const issues = [
      `${missingMappings} unit types without competitor mappings`,
      `${stale} stale competitor observations`,
      `${discounts} discounts without expiry dates`,
      `${bookingsWithoutNextAction} bookings without next action`,
      "1 campaign missing target unit type"
    ].filter((item) => !item.startsWith("0 "));
    return { score: 42, issues: issues.slice(0, 5) };
  }, [bookings, observations]);

  const convertedRent = Object.values(state.unitRents).reduce((sum, rent) => sum + rent, 0);

  return {
    state,
    actions,
    bookings,
    unitRows,
    campaigns,
    competitors,
    observations,
    signals,
    activity,
    dataHealth,
    toasts,
    convertedRent,
    effectiveUnits,
    toast,
    persist,
    addActivity,
    approvePrice,
    setActionStatus,
    setBookingStatus
  };
}

function DashboardStat({ label, value, icon: Icon, tone = "slate" }: { label: string; value: string | number; icon: LucideIcon; tone?: Tone }) {
  return (
    <div className="card group p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <span className={cx("rounded-2xl border p-2 transition group-hover:scale-105", toneClass(tone))}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

type DecisionRecommendation = "approve" | "review" | "hold";
type RevenueWorkspace = ReturnType<typeof useRevenueDemo>;

type RevenueDecision = {
  id: string;
  question: string;
  expectedMonthlyUplift: number | null;
  risk: "Low" | "Medium" | "High";
  confidence: number;
  recommendation: DecisionRecommendation;
  evidenceSummary: string;
  linkedSignals: string[];
  facilityName: string;
  unitTypeName?: string;
  category: string;
  status: ActionStatus | OperatorBooking["status"];
  nextStep: string;
  createdAt: string;
  action?: OperatorAction;
  booking?: OperatorBooking;
  priorResult?: string;
};

function actionQuestion(action: OperatorAction) {
  if (action.id === "act-raise-brussels-3") return "Raise Brussels 3 m² price from €92 to €98?";
  if (action.category === "campaign") return "Launch student summer storage campaign this week?";
  if (action.category === "discount_recovery") return "Remove expired discounts on occupied units?";
  if (action.category === "competitor_response") return "Refresh stale competitor prices before the next pricing review?";
  if (action.category === "collections") return "Run arrears follow-up batch this week?";
  return `${action.title}?`;
}

function actionRecommendation(action: OperatorAction): DecisionRecommendation {
  if (action.category === "competitor_response" || action.category === "collections") return "review";
  if (action.title.toLowerCase().includes("hold")) return "hold";
  return "approve";
}

function decisionRisk(decision: Pick<RevenueDecision, "recommendation" | "category">, action?: OperatorAction) {
  if (decision.recommendation === "hold") return "Low" as const;
  if (action?.priority === "high" && action.category !== "pricing") return "Medium" as const;
  if (action?.category === "pricing") return "Low" as const;
  return "Medium" as const;
}

function buildDecisions(workspace: RevenueWorkspace): RevenueDecision[] {
  const actionDecisions = workspace.actions.map((action): RevenueDecision => {
    const recommendation = actionRecommendation(action);
    const facilityName = action.facility_id ? demoFacilities.find((facility) => facility.id === action.facility_id)?.name ?? "Portfolio" : "Portfolio";
    return {
      id: `decision-${action.id}`,
      question: actionQuestion(action),
      expectedMonthlyUplift: action.estimated_monthly_uplift,
      risk: decisionRisk({ recommendation, category: action.category }, action),
      confidence: action.confidence,
      recommendation,
      evidenceSummary: action.description,
      linkedSignals: action.source_signals,
      facilityName,
      unitTypeName: action.unit_type_name,
      category: action.category,
      status: action.status,
      nextStep: action.exact_next_step,
      createdAt: action.created_at,
      action,
      priorResult: action.category === "pricing" ? "April price approval lifted 5 m² rent roll by €410/mo without conversion drop." : "Similar approved work historically converted into reportable impact within two weeks."
    };
  });

  const holdRow = workspace.unitRows.find((row) => row.facility_name.includes("Antwerp") && row.name.includes("20"));
  const holdDecision: RevenueDecision[] = holdRow ? [{
    id: "decision-hold-antwerp-20",
    question: `Do not raise ${holdRow.facility_name} ${holdRow.name} because price is already above market?`,
    expectedMonthlyUplift: 0,
    risk: "Low",
    confidence: 0.78,
    recommendation: "hold",
    evidenceSummary: `${holdRow.name} is ${eur(Math.abs(holdRow.gap ?? 0))} above selected direct competitors while occupancy is ${holdRow.occupancy.toFixed(0)}%.`,
    linkedSignals: ["competitor", "occupancy", "pricing"],
    facilityName: holdRow.facility_name,
    unitTypeName: holdRow.name,
    category: "pricing hold",
    status: "proposed",
    nextStep: "Hold price and use conversion or campaign work before any increase.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    priorResult: "Holding price on a weak large-unit cluster avoided a two-week conversion dip in the last demo cycle."
  }] : [];

  const bookingDecisions = workspace.bookings
    .filter((booking) => ["requested", "contacted", "reserved"].includes(booking.status))
    .slice(0, 3)
    .map((booking): RevenueDecision => ({
      id: `decision-booking-${booking.id}`,
      question: `${leadScore(booking) >= 70 ? "Follow up high-value" : "Follow up"} ${booking.customer_type} booking from ${booking.customer_name}?`,
      expectedMonthlyUplift: booking.quoted_monthly_rate,
      risk: "Low",
      confidence: leadScore(booking) / 100,
      recommendation: leadScore(booking) >= 70 ? "approve" : "review",
      evidenceSummary: `${booking.customer_name} wants ${booking.unit_type_name}, worth ${eur(booking.quoted_monthly_rate)}/mo, with lead score ${leadScore(booking)}.`,
      linkedSignals: ["booking demand"],
      facilityName: booking.facility_name,
      unitTypeName: booking.unit_type_name,
      category: "booking conversion",
      status: booking.status,
      nextStep: booking.next_action,
      createdAt: booking.created_at,
      booking,
      priorResult: "Fast follow-up on business bookings converted 2 of the last 3 high-score requests."
    }));

  return [...actionDecisions, ...holdDecision, ...bookingDecisions].sort((a, b) => {
    const score = (item: RevenueDecision) => (item.recommendation === "approve" ? 3 : item.recommendation === "review" ? 2 : 1) * 100000 + (item.expectedMonthlyUplift ?? 0);
    return score(b) - score(a);
  });
}

function weekChanges(workspace: RevenueWorkspace) {
  return [
    { title: "Competitor price changed", description: "BoxPlus Brussels raised 3 m² from €95 to €102.", tone: "green" as Tone },
    { title: "Demand increased", description: "Small-unit demand reached 17 leads and bookings in 30 days.", tone: "blue" as Tone },
    { title: "Occupancy crossed threshold", description: "Brussels 3 m² moved above the 90% pricing pressure line.", tone: "green" as Tone },
    { title: "Data became stale", description: `${workspace.dataHealth.issues.filter((issue) => issue.includes("stale")).length || 1} competitor data issue needs refresh.`, tone: "amber" as Tone },
    { title: "Campaign window approaching", description: "May-August student/moving season is now active.", tone: "amber" as Tone },
    { title: "Booking conversion moved", description: `${workspace.bookings.filter((booking) => booking.status === "requested").length} fresh booking decisions need follow-up.`, tone: "red" as Tone }
  ];
}

function openDecisionValue(decisions: RevenueDecision[]) {
  return decisions
    .filter((decision) => !["completed", "rejected", "dismissed", "converted", "lost"].includes(decision.status))
    .reduce((sum, decision) => sum + (decision.expectedMonthlyUplift ?? 0), 0);
}

function DecisionEvidencePanel({ decision, onApprove, onReject }: { decision: RevenueDecision; onApprove: () => void; onReject: () => void }) {
  const rows = [
    ["Occupancy", decision.unitTypeName?.includes("20") ? "75% with vacancy risk" : "94% occupied, only 3 units available"],
    ["Demand last 30 days", decision.category.includes("booking") ? "Lead score and move-in urgency drive priority" : "17 leads and bookings for comparable small units"],
    ["Competitor comparison", decision.recommendation === "hold" ? "Our Antwerp 20 m² price is above selected direct competitors" : "Selected direct competitors are 8% higher on mapped units"],
    ["Seasonality", decision.category.includes("campaign") ? "May-August student/moving season is open" : "Current season supports small-unit demand"],
    ["Discount / arrears context", decision.category.includes("discount") ? "19 occupied units still carry legacy concessions" : "No blocking arrears signal on this unit type"],
    ["Data quality", "Competitor observations are usable, but stale prices should be refreshed before the next pricing cycle"],
    ["Prior similar action", decision.priorResult ?? "No prior comparable action recorded yet"]
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Decision question</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-950">{decision.question}</h3>
        <p className="mt-2 text-sm text-slate-600">{decision.nextStep}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Expected uplift</p><p className="mt-1 text-2xl font-semibold">{decision.expectedMonthlyUplift ? `${eur(decision.expectedMonthlyUplift)}/mo` : "Protect margin"}</p></div>
        <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Risk</p><p className="mt-1 text-2xl font-semibold">{decision.risk}</p></div>
        <div className="rounded-2xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Confidence</p><p className="mt-1 text-2xl font-semibold">{Math.round(decision.confidence * 100)}%</p></div>
      </div>
      <div className="space-y-3">
        {rows.map(([label, value]) => (
          <div className="rounded-2xl border border-slate-200 bg-white p-4" key={label}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onApprove}>Approve decision</Button>
        <Button onClick={onReject} variant="secondary">Reject decision</Button>
      </div>
    </div>
  );
}

function DecisionCard({
  decision,
  onApprove,
  onEdit,
  onReject,
  onComplete,
  onEvidence
}: {
  decision: RevenueDecision;
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  onComplete: () => void;
  onEvidence: () => void;
}) {
  return (
    <article className="card p-5 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={decision.recommendation === "approve" ? "green" : decision.recommendation === "hold" ? "amber" : "blue"}>{decision.recommendation}</Badge>
            <Badge tone={decision.risk === "Low" ? "green" : decision.risk === "Medium" ? "amber" : "red"}>Risk: {decision.risk}</Badge>
            <Badge>{Math.round(decision.confidence * 100)}% confidence</Badge>
          </div>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950">{decision.question}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{decision.evidenceSummary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {decision.linkedSignals.map((signal) => <Badge key={signal}>{signal}</Badge>)}
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">{decision.facilityName}{decision.unitTypeName ? ` · ${decision.unitTypeName}` : ""}</p>
        </div>
        <div className="min-w-52 shrink-0 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Expected decision value</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{decision.expectedMonthlyUplift ? `${eur(decision.expectedMonthlyUplift)}/mo` : "Protects yield"}</p>
          <p className="mt-2 text-sm text-slate-600">Status: {decision.status}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={onApprove}>Approve</Button>
        <Button onClick={onEdit} variant="secondary">Edit</Button>
        {decision.action && ["approved", "active"].includes(decision.status) ? <Button onClick={onComplete} variant="secondary">Complete</Button> : null}
        <Button onClick={onReject} variant="ghost">Reject</Button>
        <Button onClick={onEvidence} variant="secondary">View evidence</Button>
      </div>
    </article>
  );
}

export function DecisionInboxWorkspace() {
  const workspace = useRevenueDemo();
  const [selected, setSelected] = useState<RevenueDecision | null>(null);
  const decisions = buildDecisions(workspace);
  const openValue = openDecisionValue(decisions);
  const primary = decisions.find((decision) => decision.status === "proposed" && decision.recommendation === "approve") ?? decisions[0];

  const approveDecision = (decision: RevenueDecision) => {
    if (decision.action) {
      if (decision.action.category === "pricing") workspace.approvePrice(decision.action);
      else workspace.setActionStatus(decision.action, "approved");
      return;
    }
    if (decision.booking) {
      workspace.setBookingStatus(decision.booking, decision.booking.status === "reserved" ? "converted" : "contacted");
      return;
    }
    workspace.persist((current) => ({
      ...current,
      activity: [{ id: `activity-${Date.now()}`, title: "Decision approved", description: decision.question, type: "action", created_at: new Date().toISOString() }, ...current.activity]
    }), "Decision approved");
  };

  const rejectDecision = (decision: RevenueDecision) => {
    if (decision.action) workspace.setActionStatus(decision.action, "rejected");
    else if (decision.booking) workspace.setBookingStatus(decision.booking, "lost");
    else workspace.persist((current) => ({
      ...current,
      activity: [{ id: `activity-${Date.now()}`, title: "Decision rejected", description: decision.question, type: "action", created_at: new Date().toISOString() }, ...current.activity]
    }), "Decision rejected");
  };

  return (
    <div className="space-y-8">
      <Toasts items={workspace.toasts} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-600">Revenue decision engine</p>
        <h1 className="mt-3 text-6xl font-semibold tracking-tight text-slate-950">Decision Inbox</h1>
        <p className="mt-3 max-w-4xl text-xl leading-8 text-slate-600">Every card is a revenue decision to approve, edit, reject or investigate. This is where competitor movement, demand and leakage become operator choices.</p>
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="green">Urgent decision</Badge>
            <Badge tone="dark">Risk: {primary.risk}</Badge>
            <Badge tone="dark">{Math.round(primary.confidence * 100)}% confidence</Badge>
          </div>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight">{primary.question}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{primary.evidenceSummary}</p>
          <div className="mt-7 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Expected uplift</p><p className="mt-1 text-2xl font-semibold">{primary.expectedMonthlyUplift ? `${eur(primary.expectedMonthlyUplift)}/mo` : "Protects yield"}</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Recommendation</p><p className="mt-1 text-2xl font-semibold capitalize">{primary.recommendation}</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Facility</p><p className="mt-1 text-lg font-semibold">{primary.facilityName}</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-300">Unit type</p><p className="mt-1 text-lg font-semibold">{primary.unitTypeName ?? "Portfolio"}</p></div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => approveDecision(primary)}><Zap className="h-4 w-4" />Approve</Button>
            <Button onClick={() => setSelected(primary)} variant="secondary">View evidence</Button>
            <Button onClick={() => rejectDecision(primary)} variant="ghost">Reject</Button>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-2xl font-semibold text-slate-950">What changed this week</h2>
          <div className="mt-4 space-y-3">
            {weekChanges(workspace).slice(0, 6).map((change) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={change.title}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{change.title}</p>
                  <Badge tone={change.tone}>new</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{change.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardStat icon={CircleDollarSign} label="Open decision value" tone="green" value={`${eur(openValue)}/mo`} />
        <DashboardStat icon={Check} label="Approve candidates" tone="green" value={decisions.filter((decision) => decision.recommendation === "approve" && decision.status === "proposed").length} />
        <DashboardStat icon={ShieldCheck} label="Hold warnings" tone="amber" value={decisions.filter((decision) => decision.recommendation === "hold").length} />
        <DashboardStat icon={Gauge} label="Data health" tone="amber" value={`${workspace.dataHealth.score}%`} />
      </div>

      <section className="space-y-4">
        {decisions.map((decision) => (
          <DecisionCard
            decision={decision}
            key={decision.id}
            onApprove={() => approveDecision(decision)}
            onComplete={() => {
              if (decision.action) workspace.setActionStatus(decision.action, "completed", window.prompt("Outcome note (optional)") ?? undefined);
            }}
            onEdit={() => workspace.toast("Decision draft opened for editing")}
            onEvidence={() => setSelected(decision)}
            onReject={() => rejectDecision(decision)}
          />
        ))}
      </section>

      {selected ? (
        <SlideOver title="Decision evidence" onClose={() => setSelected(null)}>
          <DecisionEvidencePanel
            decision={selected}
            onApprove={() => {
              approveDecision(selected);
              setSelected(null);
            }}
            onReject={() => {
              rejectDecision(selected);
              setSelected(null);
            }}
          />
        </SlideOver>
      ) : null}
    </div>
  );
}

export function RevenueControlRoomWorkspace() {
  const workspace = useRevenueDemo();
  const [selectedMoney, setSelectedMoney] = useState("pricing");
  const [showHealth, setShowHealth] = useState(false);
  const decisions = buildDecisions(workspace);
  const urgent = decisions.find((decision) => decision.status === "proposed") ?? decisions[0];

  return (
    <div className="space-y-8">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-600">Revenue overview</p>
          <h1 className="mt-3 text-6xl font-semibold tracking-tight text-slate-950">Revenue Control Room</h1>
          <p className="mt-3 max-w-4xl text-xl leading-8 text-slate-600">A high-level read on open decision value, weekly movement, risk and data quality.</p>
        </div>
        <Link className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5" href="/app">
          Open Decision Inbox <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardStat icon={CircleDollarSign} label="Open decision value" tone="green" value={`${eur(openDecisionValue(decisions))}/mo`} />
        <DashboardStat icon={BellRing} label="Decisions waiting" tone="amber" value={decisions.filter((decision) => decision.status === "proposed").length} />
        <DashboardStat icon={Radar} label="Market moves" tone="blue" value={competitorPriceMovementRows().filter((movement) => movement.direction === "up").length} />
        <DashboardStat icon={Gauge} label="Data health" tone="amber" value={`${workspace.dataHealth.score}%`} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Urgent decision</h2>
          <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{urgent.question}</p>
          <p className="mt-2 text-slate-600">{urgent.evidenceSummary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="green">{urgent.expectedMonthlyUplift ? `${eur(urgent.expectedMonthlyUplift)}/mo` : "protects yield"}</Badge>
            <Badge tone="amber">Risk: {urgent.risk}</Badge>
            <Badge>{Math.round(urgent.confidence * 100)}% confidence</Badge>
          </div>
          <Link className="mt-5 inline-flex text-sm font-semibold text-emerald-700" href="/app">Review in Decision Inbox</Link>
        </div>
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-slate-950">What changed this week</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {weekChanges(workspace).map((change) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={change.title}>
                <Badge tone={change.tone}>{change.title}</Badge>
                <p className="mt-3 text-sm text-slate-600">{change.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Money Map</h2>
            <p className="mt-1 text-slate-600">Leakage sources that feed decisions, not passive dashboard metrics.</p>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-slate-950">{eur(2925)}<span className="text-base font-medium text-slate-500">/mo</span></p>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-5">
          {moneyMap.map((item) => (
            <button className={cx("rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-md", selectedMoney === item.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950")} key={item.id} onClick={() => setSelectedMoney(item.id)} type="button">
              <p className={cx("text-sm font-semibold", selectedMoney === item.id ? "text-slate-300" : "text-slate-500")}>{item.label}</p>
              <p className="mt-3 text-3xl font-semibold">{eur(item.value)}</p>
              <p className={cx("mt-3 text-sm", selectedMoney === item.id ? "text-slate-300" : "text-slate-600")}>{item.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Risk radar</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["Market risk", "Competitors moved above Brussels small units.", "amber"],
              ["Conversion risk", "Slow follow-up can still lose high-value business bookings.", "red"],
              ["Pricing risk", "Antwerp 20 m² should not be raised while above market.", "amber"]
            ].map(([title, copy, tone]) => (
              <div className="rounded-3xl border border-slate-200 p-5" key={title}>
                <Badge tone={tone as Tone}>{title}</Badge>
                <p className="mt-3 text-sm text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="card p-6 text-left" onClick={() => setShowHealth(true)} type="button">
          <Gauge className="h-8 w-8 text-amber-500" />
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">Data Health: {workspace.dataHealth.score}%</h2>
          <p className="mt-2 text-slate-600">Fix {workspace.dataHealth.issues.length} data issues before the next pricing cycle.</p>
        </button>
      </section>

      {showHealth ? <DataHealthPanel issues={workspace.dataHealth.issues} onClose={() => setShowHealth(false)} /> : null}
    </div>
  );
}

export function ActionCenterWorkspace() {
  const workspace = useRevenueDemo();
  const [selectedAction, setSelectedAction] = useState<OperatorAction | null>(null);
  const [selectedMoney, setSelectedMoney] = useState("pricing");
  const [showHealth, setShowHealth] = useState(false);
  const kpis = actionCenterKpis();
  const primary = workspace.actions.find((action) => action.id === "act-raise-brussels-3") ?? workspace.actions[0];
  const activeActions = workspace.actions.filter((action) => !["completed", "rejected", "dismissed"].includes(action.status));
  const visibleActions = activeActions.filter((action) => selectedMoney === "pricing" ? action.category === "pricing" : selectedMoney === "discount" ? action.category === "discount_recovery" : selectedMoney === "arrears" ? action.category === "collections" : selectedMoney === "booking" ? action.category === "booking_follow_up" || action.source_signals.includes("booking demand") : true);
  const bookingNeedsAction = workspace.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status));
  const underMarket = workspace.unitRows.filter((row) => (row.gap ?? 0) > 0);
  const movements = competitorPriceMovementRows();

  return (
    <div className="space-y-8">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-600">Live revenue command system</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">Revenue Control Room</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">Live pricing, booking, competitor and revenue actions.</p>
        </div>
        <button className="card flex items-center gap-3 px-4 py-3 text-left" onClick={() => setShowHealth(true)} type="button">
          <Gauge className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-slate-950">Data Health: {workspace.dataHealth.score}%</p>
            <p className="text-xs text-slate-500">Fix {workspace.dataHealth.issues.length} issues</p>
          </div>
        </button>
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-xl">
          <div className="grid min-h-[360px] gap-6 p-7 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="green">Primary action</Badge>
                <Badge tone="dark">Risk: Low</Badge>
                <Badge tone="dark">Confidence: {Math.round(primary.confidence * 100)}%</Badge>
              </div>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight">{primary.title.replace("street rate", "new-customer price")}</h2>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">{primary.description}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-4">
                {["94% occupied", "17 leads in 30 days", "Direct competitors 8% higher", "Only 3 units available"].map((item) => (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200" key={item}>{item}</div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={() => workspace.approvePrice(primary)}><Zap className="h-4 w-4" />Approve price</Button>
                <Button onClick={() => setSelectedAction(primary)} variant="secondary">Review evidence</Button>
                <Button onClick={() => workspace.setActionStatus(primary, "rejected")} variant="ghost">Reject</Button>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Expected uplift</p>
              <p className="mt-3 text-5xl font-semibold">+{eur(primary.estimated_monthly_uplift ?? 0)}</p>
              <p className="mt-1 text-slate-400">per month</p>
              <div className="mt-8 space-y-3">
                <div className="flex justify-between rounded-2xl bg-white/5 p-3 text-sm"><span>Current price</span><strong>€92</strong></div>
                <div className="flex justify-between rounded-2xl bg-white/5 p-3 text-sm"><span>Approved price</span><strong>{eur(workspace.state.unitTypePrices["f1-small"] ?? 98)}</strong></div>
                <div className="flex justify-between rounded-2xl bg-white/5 p-3 text-sm"><span>Status</span><strong>{primary.status}</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">Live intelligence feed</h2>
            <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" /></span>
          </div>
          <div className="mt-5 space-y-3">
            {workspace.activity.slice(0, 5).map((event) => (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm" key={event.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{event.type}</p>
                  <p className="text-xs text-slate-400">{ageLabel(event.created_at)}</p>
                </div>
                <p className="mt-2 font-semibold text-slate-950">{event.title}</p>
                <p className="mt-1 text-sm text-slate-600">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3 2xl:grid-cols-6">
        <DashboardStat icon={CircleDollarSign} label="Money left on table" tone="green" value={eur(kpis.money_left_on_table)} />
        <DashboardStat icon={TimerReset} label="Bookings need action" tone="amber" value={bookingNeedsAction.length} />
        <DashboardStat icon={Radar} label="Unit types under market" tone="green" value={underMarket.length} />
        <DashboardStat icon={TrendingDown} label="Discount leakage" tone="red" value={eur(kpis.discount_leakage)} />
        <DashboardStat icon={AlertTriangle} label="Arrears risk" tone="amber" value={eur(kpis.arrears_risk)} />
        <DashboardStat icon={ShieldCheck} label="Data health" tone="amber" value={`${workspace.dataHealth.score}%`} />
      </div>

      <section className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Money Map</h2>
            <p className="mt-1 text-slate-600">Click a leakage source to filter actions and signals.</p>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-slate-950">{eur(2925)}<span className="text-base font-medium text-slate-500">/mo</span></p>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-5">
          {moneyMap.map((item) => (
            <button className={cx("rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-md", selectedMoney === item.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950")} key={item.id} onClick={() => setSelectedMoney(item.id)} type="button">
              <p className={cx("text-sm font-semibold", selectedMoney === item.id ? "text-slate-300" : "text-slate-500")}>{item.label}</p>
              <p className="mt-3 text-3xl font-semibold">{eur(item.value)}</p>
              <p className={cx("mt-3 text-sm", selectedMoney === item.id ? "text-slate-300" : "text-slate-600")}>{item.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.85fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Actions filtered by {moneyMap.find((item) => item.id === selectedMoney)?.label}</h2>
              <p className="mt-1 text-sm text-slate-600">Approve, complete or dismiss actions. Completed actions appear in reports.</p>
            </div>
            <Link className="text-sm font-semibold text-emerald-700" href="/app/signals">Open feed</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {visibleActions.slice(0, 5).map((action) => (
              <article className="p-5 transition hover:bg-slate-50" key={action.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">{action.title}</h3>
                      <Badge tone={action.priority === "high" ? "red" : action.priority === "medium" ? "amber" : "slate"}>{action.priority}</Badge>
                      <Badge tone={action.status === "approved" || action.status === "active" ? "green" : "slate"}>{action.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{action.exact_next_step}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {action.source_signals.map((source) => <Badge key={source}>{source}</Badge>)}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3 text-left lg:text-right">
                    <p className="text-xl font-semibold text-slate-950">{action.estimated_monthly_uplift ? `${eur(action.estimated_monthly_uplift)}/mo` : "Data quality"}</p>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button onClick={() => action.category === "pricing" ? workspace.approvePrice(action) : workspace.setActionStatus(action, "approved")} variant="secondary">Approve</Button>
                      <Button onClick={() => setSelectedAction(action)} variant="ghost">Review</Button>
                      <Button onClick={() => workspace.setActionStatus(action, "completed", window.prompt("Outcome note (optional)") ?? undefined)} variant="ghost">Complete</Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-xl font-semibold text-slate-950">Market signals that matter</h2>
          <div className="mt-4 space-y-3">
            {movements.slice(0, 4).map((movement) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={movement.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{movement.competitor_name}</p>
                    <p className="mt-1 text-sm text-slate-600">{movement.direction === "up" ? "raised comparable price" : movement.direction === "down" ? "dropped comparable price" : "price checked"} · {movement.days_old}d ago</p>
                  </div>
                  <Badge tone={movement.stale ? "amber" : movement.direction === "up" ? "green" : "slate"}>{movement.stale ? "stale" : movement.direction}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700" href="/app/competitors">Open Market Radar <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="card p-5">
          <h2 className="text-xl font-semibold text-slate-950">Booking opportunities</h2>
          <div className="mt-4 space-y-3">
            {bookingNeedsAction.slice(0, 4).map((booking) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={booking.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{booking.customer_name}</p>
                    <p className="text-sm text-slate-600">{booking.unit_type_name} · {booking.facility_name}</p>
                    <p className="mt-2 text-sm text-slate-500">Lead score {leadScore(booking)} · expected {eur(booking.quoted_monthly_rate)}/mo</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => workspace.setBookingStatus(booking, "contacted")} variant="secondary">Contact</Button>
                    <Button onClick={() => workspace.setBookingStatus(booking, "reserved")} variant="ghost">Reserve</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-xl font-semibold text-slate-950">Unit pressure grid</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Unit type</th>
                  <th className="px-4 py-3">Occupancy</th>
                  <th className="px-4 py-3">Demand</th>
                  <th className="px-4 py-3">Current</th>
                  <th className="px-4 py-3">Market</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workspace.unitRows.slice(0, 7).map((row) => {
                  const status = unitStatus(row);
                  return (
                    <tr className="hover:bg-slate-50" key={row.id}>
                      <td className="px-4 py-3 font-semibold text-slate-950">{row.facility_name} · {row.name}</td>
                      <td className="px-4 py-3">{row.occupancy.toFixed(0)}%</td>
                      <td className="px-4 py-3">{row.demand30}</td>
                      <td className="px-4 py-3">{eur(row.street_rate)}</td>
                      <td className="px-4 py-3">{row.market_avg ? eur(row.market_avg) : "n/a"}</td>
                      <td className="px-4 py-3"><Badge tone={status.tone}>{status.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedAction ? (
        <SlideOver title={selectedAction.title} onClose={() => setSelectedAction(null)}>
          <ActionReview
            action={selectedAction}
            onApprove={() => {
              if (selectedAction.category === "pricing") {
                workspace.approvePrice(selectedAction);
              } else {
                workspace.setActionStatus(selectedAction, "approved");
              }
              setSelectedAction(null);
            }}
            onComplete={() => {
              workspace.setActionStatus(selectedAction, "completed", window.prompt("Outcome note (optional)") ?? undefined);
              setSelectedAction(null);
            }}
          />
        </SlideOver>
      ) : null}

      {showHealth ? <DataHealthPanel issues={workspace.dataHealth.issues} onClose={() => setShowHealth(false)} /> : null}
    </div>
  );
}

function ActionReview({ action, onApprove, onComplete }: { action: OperatorAction; onApprove: () => void; onComplete: () => void }) {
  return (
    <div className="space-y-5 text-sm">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Exact next step</p>
        <p className="mt-2 text-base font-medium text-slate-950">{action.exact_next_step}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-4"><p className="text-slate-500">Uplift</p><p className="mt-1 text-xl font-semibold">{action.estimated_monthly_uplift ? `${eur(action.estimated_monthly_uplift)}/mo` : "n/a"}</p></div>
        <div className="rounded-2xl border border-slate-200 p-4"><p className="text-slate-500">Confidence</p><p className="mt-1 text-xl font-semibold">{Math.round(action.confidence * 100)}%</p></div>
        <div className="rounded-2xl border border-slate-200 p-4"><p className="text-slate-500">Priority</p><p className="mt-1 text-xl font-semibold capitalize">{action.priority}</p></div>
      </div>
      <div>
        <p className="font-semibold text-slate-950">Evidence</p>
        <div className="mt-3 space-y-2">
          {action.evidence.map((item) => <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700" key={item}>{item}</div>)}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onApprove}>Approve action</Button>
        <Button onClick={onComplete} variant="secondary">Mark completed</Button>
      </div>
    </div>
  );
}

function DataHealthPanel({ issues, onClose }: { issues: string[]; onClose: () => void }) {
  return (
    <SlideOver title="Data Health" onClose={onClose}>
      <div className="space-y-5">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-700">Score</p>
          <p className="mt-2 text-5xl font-semibold text-slate-950">42%</p>
          <p className="mt-2 text-sm text-slate-600">Fix stale and missing data before trusting every pricing action.</p>
        </div>
        <div className="space-y-3">
          {issues.map((issue) => (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4" key={issue}>
              <span className="text-sm font-medium text-slate-950">{issue}</span>
              <Badge tone="amber">Fix</Badge>
            </div>
          ))}
        </div>
      </div>
    </SlideOver>
  );
}

export function BookingsWorkspace() {
  const workspace = useRevenueDemo();
  const [selected, setSelected] = useState<OperatorBooking | null>(null);
  const columns: OperatorBooking["status"][] = ["requested", "contacted", "reserved", "converted", "lost"];

  return (
    <div className="space-y-6">
      <Toasts items={workspace.toasts} />
      <div className="grid gap-4 xl:grid-cols-5">
        {columns.map((status) => {
          const rows = workspace.bookings.filter((booking) => booking.status === status);
          return (
            <section className="min-h-[520px] rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-3" key={status}>
              <div className="mb-3 flex items-center justify-between px-2">
                <h2 className="font-semibold text-slate-950">{bookingColumn(status)}</h2>
                <Badge>{rows.length}</Badge>
              </div>
              <div className="space-y-3">
                {rows.map((booking) => (
                  <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md" key={booking.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{booking.customer_name}</p>
                        <p className="mt-1 text-sm text-slate-600">{booking.unit_type_name}</p>
                      </div>
                      <Badge tone={leadScore(booking) >= 70 ? "green" : leadScore(booking) >= 50 ? "amber" : "slate"}>{leadScore(booking)}</Badge>
                    </div>
	                    <div className="mt-4 space-y-2 text-sm text-slate-600">
	                      <p>{booking.facility_name}</p>
	                      <p>Customer type: {booking.customer_type}</p>
	                      <p>Time-to-follow-up: {ageLabel(booking.created_at)}</p>
	                      <p>Conversion risk: {leadScore(booking) >= 70 ? "low if contacted today" : "medium"}</p>
	                      <p>Unit demand signal: {booking.unit_type_name.includes("3") || booking.unit_type_name.includes("5") ? "high" : "normal"}</p>
	                      <p>Move-in {new Date(booking.preferred_move_in_date).toLocaleDateString("en-GB")}</p>
	                      <p className="font-semibold text-slate-950">{eur(booking.quoted_monthly_rate)}/mo expected</p>
	                      <p>{booking.next_action}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {status === "requested" ? <Button onClick={() => workspace.setBookingStatus(booking, "contacted")} variant="secondary">Mark contacted</Button> : null}
                      {status === "contacted" || status === "requested" ? <Button onClick={() => { setSelected(booking); }} variant="secondary">Assign unit</Button> : null}
                      {status === "reserved" ? <Button onClick={() => workspace.setBookingStatus(booking, "converted")} variant="secondary">Convert</Button> : null}
                      {status !== "lost" && status !== "converted" ? <Button onClick={() => workspace.setBookingStatus(booking, "lost")} variant="ghost">Mark lost</Button> : null}
                      <Button onClick={() => { navigator.clipboard.writeText(`Hi ${booking.customer_name}, we can reserve your ${booking.unit_type_name} at ${booking.facility_name}. Are you available for a quick confirmation call today?`); workspace.toast("Follow-up message copied"); }} variant="ghost">Copy follow-up</Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {selected ? (
        <SlideOver title={`Assign unit for ${selected.customer_name}`} onClose={() => setSelected(null)}>
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold text-slate-950">{selected.unit_type_name}</p>
              <p className="mt-1 text-sm text-slate-600">{selected.facility_name} · {eur(selected.quoted_monthly_rate)}/mo</p>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Available unit</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-300 p-3">
                {demoUnits.filter((unit) => unit.unit_type_id === selected.unit_type_id && unit.status === "available").slice(0, 10).map((unit) => <option key={unit.id}>{unit.id.toUpperCase()}</option>)}
              </select>
            </label>
            <Button onClick={() => { workspace.setBookingStatus(selected, "reserved"); setSelected(null); }}>Reserve unit</Button>
          </div>
        </SlideOver>
      ) : null}
    </div>
  );
}

export function UnitsPricingWorkspace() {
  const workspace = useRevenueDemo();
  const [selected, setSelected] = useState<UnitPressureRow | null>(null);
  const [newType, setNewType] = useState("");
  const underpriced = workspace.unitRows.filter((row) => unitStatus(row).label === "Under market").length;
  const holdWarnings = workspace.unitRows.filter((row) => unitStatus(row).label === "Vacancy pressure" || ((row.gap ?? 0) < 0 && row.occupancy < 80)).length;
  const missingMarket = workspace.unitRows.filter((row) => row.market_avg === null).length;
  const awaiting = workspace.actions.filter((action) => action.category === "pricing" && action.status === "proposed").length;
  const pricingDecision = (row: UnitPressureRow) => {
    const status = unitStatus(row);
    if (row.id === "f1-small") return "Approve raise from €92 to €98?";
    if ((row.gap ?? 0) < 0 && row.occupancy < 80) return "Hold price because vacancy risk is high?";
    if (row.market_avg === null) return "Refresh market mapping before price change?";
    if (status.label === "Discount issue") return "Recover discounts before changing price?";
    if (status.label === "Under market") return `Review raise toward ${eur(row.market_avg ?? row.street_rate)}?`;
    return "Hold price this week?";
  };

  return (
    <div className="space-y-6">
      <Toasts items={workspace.toasts} />
      <div className="grid gap-4 md:grid-cols-5">
        <DashboardStat icon={TrendingUp} label="Price opportunities" tone="green" value={underpriced} />
        <DashboardStat icon={TrendingDown} label="Hold-price warnings" tone="red" value={holdWarnings} />
        <DashboardStat icon={AlertTriangle} label="Discount leakage" tone="amber" value={eur(actionCenterKpis().discount_leakage)} />
        <DashboardStat icon={Radar} label="Missing market mappings" tone="slate" value={missingMarket} />
        <DashboardStat icon={ClockIcon} label="Price changes awaiting approval" tone="blue" value={awaiting} />
      </div>

      <div className="card p-5">
        <h2 className="text-xl font-semibold text-slate-950">Create price experiment</h2>
        <p className="mt-1 text-sm text-slate-600">Use this when a unit type needs a pricing decision, not just another inventory row.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Experiment, e.g. test 7 m² business unit at €149" value={newType} onChange={(event) => setNewType(event.target.value)} />
          <Button onClick={() => {
            if (!newType.trim()) return;
            workspace.persist((current) => current, `${newType} added as pricing experiment`);
            setNewType("");
          }}>Add experiment</Button>
          <Button onClick={() => workspace.toast("Draft price experiment created for Brussels North")} variant="secondary">Draft decision</Button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-5 py-4">Pricing decision</th>
                <th className="px-5 py-4">Evidence</th>
                <th className="px-5 py-4">Current rate</th>
                <th className="px-5 py-4">Market rate</th>
                <th className="px-5 py-4">Gap</th>
                <th className="px-5 py-4">Revenue/m²</th>
                <th className="px-5 py-4">Discount leakage</th>
                <th className="px-5 py-4">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workspace.unitRows.map((row) => {
                const status = unitStatus(row);
                return (
                  <tr className="cursor-pointer transition hover:bg-slate-50" key={row.id} onClick={() => setSelected(row)}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{pricingDecision(row)}</p>
                      <p className="mt-1 text-xs text-slate-500">{row.facility_name} · {row.name}</p>
                    </td>
                    <td className="px-5 py-4">{row.occupancy.toFixed(0)}% occupied · {row.demand30} demand signals</td>
                    <td className="px-5 py-4">{eur(row.street_rate)}</td>
                    <td className="px-5 py-4">{row.market_avg ? eur(row.market_avg) : "n/a"}</td>
                    <td className="px-5 py-4">{row.gap !== null ? `${row.gap > 0 ? "+" : ""}${eur(row.gap)}` : "n/a"}</td>
                    <td className="px-5 py-4">{eur(row.rent_per_m2)}</td>
                    <td className="px-5 py-4">{eur(row.discount_leakage)}</td>
                    <td className="px-5 py-4"><Badge tone={status.tone}>{status.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <SlideOver title={`Pricing decision: ${selected.name}`} onClose={() => setSelected(null)}>
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">What pricing decision should I make?</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{pricingDecision(selected)}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Current units</p><p className="mt-2 text-3xl font-semibold">{selected.units}</p></div>
              <div className="rounded-3xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Demand trend</p><p className="mt-2 text-3xl font-semibold">{selected.demand30}</p></div>
              <div className="rounded-3xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Competitor market</p><p className="mt-2 text-3xl font-semibold">{selected.market_avg ? eur(selected.market_avg) : "n/a"}</p></div>
              <div className="rounded-3xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Discount leakage</p><p className="mt-2 text-3xl font-semibold">{eur(selected.discount_leakage)}</p></div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold text-slate-950">Competitor evidence</p>
              <p className="mt-2 text-sm text-slate-600">Selected direct competitors are compared by mapped unit sizes only. Benchmark-only and ignored competitors do not affect this decision.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-5">
              <p className="font-semibold text-slate-950">Active discounts and units</p>
              <p className="mt-2 text-sm text-slate-600">{selected.occupied} occupied units, {selected.units - selected.occupied} non-occupied units, {eur(selected.discount_leakage)} monthly concessions.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => {
                const action = workspace.actions.find((item) => item.unit_type_id === selected.id && item.category === "pricing");
                if (action) workspace.approvePrice(action);
                else workspace.toast("No pricing decision awaiting approval for this unit type");
              }}>Approve decision</Button>
              <Button onClick={() => workspace.toast("Pricing decision draft edited in demo")} variant="secondary">Edit decision</Button>
            </div>
          </div>
        </SlideOver>
      ) : null}
    </div>
  );
}

const ClockIcon = TimerReset;

export function MarketRadarWorkspace() {
  const workspace = useRevenueDemo();
  const [mode, setMode] = useState<"competitor" | "observation" | "mapping" | null>(null);
  const [competitorName, setCompetitorName] = useState("");
  const [pricingUrl, setPricingUrl] = useState("");
  const [relationship, setRelationship] = useState<"direct" | "partial" | "benchmark" | "ignored">("direct");
  const [observationPrice, setObservationPrice] = useState("102");
  const competitors = workspace.competitors;
  const movements = competitorPriceMovementRows();
  const competitorRelationship = (competitor: Competitor) =>
    demoFacilityCompetitors.find((relationshipRow) => relationshipRow.competitor_id === competitor.id)?.relationship_type
    ?? (competitor.notes?.includes("partial") ? "partial" : competitor.notes?.includes("benchmark") ? "benchmark" : competitor.notes?.includes("ignored") ? "ignored" : "direct");
  const grouped = {
    direct: competitors.filter((competitor) => competitorRelationship(competitor) === "direct"),
    partial: competitors.filter((competitor) => competitorRelationship(competitor) === "partial"),
    benchmark: competitors.filter((competitor) => competitorRelationship(competitor) === "benchmark"),
    ignored: competitors.filter((competitor) => competitorRelationship(competitor) === "ignored")
  };

  const addCompetitor = () => {
    if (!competitorName.trim()) return;
    const competitor: Competitor = {
      id: `local-comp-${Date.now()}`,
      organization_id: "demo-org",
      name: competitorName,
      website_url: pricingUrl || null,
      pricing_url: pricingUrl || null,
      city: "Brussels",
      address: null,
      country: "Belgium",
      notes: `${relationship} competitor added by operator`,
      status: "active",
      last_observed_at: null
    };
    workspace.persist((current) => ({
      ...current,
      competitors: [competitor, ...current.competitors],
      activity: [{ id: `activity-${Date.now()}`, title: "Competitor added", description: `${competitor.name} is now tracked in Market Radar.`, type: "competitor", created_at: new Date().toISOString() }, ...current.activity]
    }), "Competitor added to Market Radar");
    setCompetitorName("");
    setPricingUrl("");
    setMode(null);
  };

  const addObservation = () => {
    const competitor = competitors[0];
    const unitType = demoCompetitorUnitTypes[0];
    const observation: CompetitorPriceObservation = {
      id: `local-obs-${Date.now()}`,
      competitor_id: competitor.id,
      competitor_unit_type_id: unitType.id,
      observed_price_monthly: Number(observationPrice),
      currency: "EUR",
      promo_text: "Manual page review",
      availability_text: "Available",
      source_url: competitor.pricing_url,
      observed_at: new Date().toISOString(),
      observation_method: "manual",
      created_at: new Date().toISOString()
    };
    const signal: OperatorSignal = {
      id: `local-signal-${Date.now()}`,
      title: `${competitor.name} price observation updated`,
      category: "competitor_price_up",
      facility_id: "f1",
      facility_name: "Brussels North Storage",
      unit_type_id: "f1-small",
      unit_type_name: "3 m² unit",
      severity: "high",
      evidence: `${competitor.name} observed at ${eur(Number(observationPrice))}/mo. Your price is ${eur(workspace.state.unitTypePrices["f1-small"] ?? 92)}.`,
      created_at: new Date().toISOString(),
      linked_action_id: "act-raise-brussels-3"
    };
    const action: OperatorAction = {
      id: `local-action-${Date.now()}`,
      title: `Review ${competitor.name} price movement`,
      description: `${competitor.name} is now observed at ${eur(Number(observationPrice))}/mo for a comparable small unit.`,
      exact_next_step: "Review whether this new competitor observation changes the Brussels 3 m² price decision.",
      estimated_monthly_uplift: Number(observationPrice) > (workspace.state.unitTypePrices["f1-small"] ?? 92) ? 280 : null,
      confidence: 0.74,
      priority: "medium",
      category: "competitor_response",
      source_signals: ["competitor"],
      evidence: [signal.evidence, "Manual observation created by operator", "Benchmark-only and ignored competitors remain excluded"],
      linked_signal_ids: [signal.id],
      status: "proposed",
      created_at: new Date().toISOString(),
      completed_at: null,
      facility_id: "f1",
      unit_type_id: "f1-small",
      unit_type_name: "3 m² unit"
    };
    workspace.persist((current) => ({
      ...current,
      observations: [observation, ...current.observations],
      signals: [signal, ...current.signals],
      actions: [action, ...current.actions],
      activity: [{ id: `activity-${Date.now()}`, title: "Competitor price updated", description: "Signal created and decision added to the inbox.", type: "competitor", created_at: new Date().toISOString() }, ...current.activity]
    }), "Price observation added, signal created, decision added");
    setMode(null);
  };

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Competitor intelligence</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Market Radar</h1>
          <p className="mt-2 max-w-3xl text-lg text-slate-600">Track only the competitors you choose, then decide which market signals count for pricing.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setMode("competitor")}><Plus className="h-4 w-4" />Add competitor URL</Button>
          <Button onClick={() => setMode("observation")} variant="secondary">Add price observation</Button>
          <Button onClick={() => setMode("mapping")} variant="secondary">Map unit sizes</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          ["Direct competitors", grouped.direct],
          ["Partial competitors", grouped.partial],
          ["Benchmark only", grouped.benchmark],
          ["Ignored", grouped.ignored]
        ].map(([label, rows]) => (
          <section className="card p-5" key={label as string}>
            <h2 className="text-lg font-semibold text-slate-950">{label as string}</h2>
            <p className="mt-1 text-sm text-slate-500">{label === "Direct competitors" || label === "Partial competitors" ? "Used in revenue decisions" : "Not used in revenue decisions"}</p>
            <div className="mt-4 space-y-2">
              {(rows as Competitor[]).slice(0, 4).map((competitor) => <div className="rounded-2xl border border-slate-200 p-3 text-sm font-semibold text-slate-950" key={competitor.id}>{competitor.name}</div>)}
            </div>
          </section>
        ))}
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-5">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Price movements</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {movements.slice(0, 6).map((movement) => (
              <article className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md" key={movement.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{movement.competitor_name}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {movement.competitor_name === "BoxPlus Brussels"
                        ? "Raised 3 m² price from €95 to €102."
                        : movement.direction === "up"
                          ? "Comparable rate increased."
                          : movement.direction === "down"
                            ? "Comparable rate decreased."
                            : "Manual review completed."}
                    </p>
                  </div>
                  <Badge tone={movement.stale ? "amber" : movement.direction === "up" ? "green" : "slate"}>{movement.stale ? "stale" : movement.direction}</Badge>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  Your price: {eur(workspace.state.unitTypePrices["f1-small"] ?? 92)}. Action created: Raise Brussels 3 m² new-customer price.
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Our price vs market</h2>
          <div className="mt-4 space-y-3">
            {workspace.unitRows.filter((row) => row.market_avg !== null).slice(0, 5).map((row) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={row.id}>
                <div className="flex justify-between gap-3">
                  <p className="font-semibold text-slate-950">{row.facility_name} · {row.name}</p>
                  <Badge tone={(row.gap ?? 0) > 0 ? "green" : "red"}>{(row.gap ?? 0) > 0 ? "below market" : "above market"}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">Our price {eur(row.street_rate)} · market {row.market_avg ? eur(row.market_avg) : "n/a"} · gap {row.gap !== null ? eur(row.gap) : "n/a"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {mode ? (
        <SlideOver title={mode === "competitor" ? "Add competitor URL" : mode === "observation" ? "Add manual price observation" : "Map unit sizes"} onClose={() => setMode(null)}>
          {mode === "competitor" ? (
            <div className="space-y-4">
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Competitor name" value={competitorName} onChange={(event) => setCompetitorName(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Pricing URL" value={pricingUrl} onChange={(event) => setPricingUrl(event.target.value)} />
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={relationship} onChange={(event) => setRelationship(event.target.value as typeof relationship)}>
                <option value="direct">Direct competitor</option>
                <option value="partial">Partial competitor</option>
                <option value="benchmark">Benchmark only</option>
                <option value="ignored">Ignore for pricing</option>
              </select>
              <textarea className="min-h-28 w-full rounded-2xl border border-slate-300 p-3" placeholder="Notes" />
              <Button onClick={addCompetitor}>Add to Market Radar</Button>
            </div>
          ) : mode === "observation" ? (
            <div className="space-y-4">
              <select className="w-full rounded-2xl border border-slate-300 p-3">{competitors.map((competitor) => <option key={competitor.id}>{competitor.name}</option>)}</select>
              <select className="w-full rounded-2xl border border-slate-300 p-3">{demoCompetitorUnitTypes.map((unitType) => <option key={unitType.id}>{unitType.name}</option>)}</select>
              <input className="w-full rounded-2xl border border-slate-300 p-3" type="number" value={observationPrice} onChange={(event) => setObservationPrice(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Source URL" />
              <textarea className="min-h-24 w-full rounded-2xl border border-slate-300 p-3" placeholder="Availability or promo text" />
              <Button onClick={addObservation}>Save observation</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <select className="w-full rounded-2xl border border-slate-300 p-3">{demoUnitTypes.map((unitType) => <option key={unitType.id}>{demoFacilities.find((facility) => facility.id === unitType.facility_id)?.name} · {unitType.name}</option>)}</select>
              <select className="w-full rounded-2xl border border-slate-300 p-3">{demoCompetitorUnitTypes.map((unitType) => <option key={unitType.id}>{unitType.name}</option>)}</select>
              <input className="w-full rounded-2xl border border-slate-300 p-3" defaultValue="1.0" type="number" step="0.1" />
	              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" defaultChecked /> Used in revenue decisions</label>
              <Button onClick={() => { workspace.toast("Unit mapping saved"); setMode(null); }}>Save mapping</Button>
            </div>
          )}
        </SlideOver>
      ) : null}
    </div>
  );
}

export function SignalsWorkspace() {
  const workspace = useRevenueDemo();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const families = ["all", "competitor", "pricing", "booking", "discount", "arrears", "seasonality", "data health"];
  const rows = workspace.signals
    .filter((signal) => !dismissed.includes(signal.id))
    .filter((signal) => filter === "all" || signalFamily(signal.category) === filter)
    .filter((signal) => `${signal.title} ${signal.evidence}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <Toasts items={workspace.toasts} />
      <div className="card p-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 text-sm" placeholder="Search live intelligence feed" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {families.map((family) => <button className={cx("rounded-2xl px-3 py-2 text-sm font-semibold capitalize transition", filter === family ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700")} key={family} onClick={() => setFilter(family)} type="button">{family}</button>)}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((signal) => (
          <article className="card p-5" key={signal.id}>
            <div className="grid gap-4 lg:grid-cols-[54px_1fr_180px_170px] lg:items-center">
              <div className={cx("flex h-12 w-12 items-center justify-center rounded-2xl border", signal.severity === "high" ? toneClass("red") : signal.severity === "medium" ? toneClass("amber") : toneClass("slate"))}>
                {signalFamily(signal.category) === "competitor" ? <Radar className="h-5 w-5" /> : signalFamily(signal.category) === "booking" ? <BellRing className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-950">{signal.title}</h2>
                  <Badge tone={signal.severity === "high" ? "red" : signal.severity === "medium" ? "amber" : "slate"}>{signal.severity}</Badge>
                  <Badge>{signalFamily(signal.category)}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{signal.evidence}</p>
                <p className="mt-2 text-xs text-slate-500">{signal.facility_name}{signal.unit_type_name ? ` · ${signal.unit_type_name}` : ""} · {ageLabel(signal.created_at)}</p>
              </div>
	              <Link className="text-sm font-semibold text-emerald-700" href="/app">Linked decision</Link>
              <Button onClick={() => { setDismissed((items) => [...items, signal.id]); workspace.toast("Signal acknowledged"); }} variant="secondary">Acknowledge</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CampaignsWorkspace() {
  const workspace = useRevenueDemo();

  const launchTemplate = (template: (typeof campaignTemplates)[number]) => {
    const campaign: Campaign = {
      id: `campaign-${template.id}-${Date.now()}`,
      name: template.name,
      facility_id: "f1",
      facility_name: "Brussels North Storage",
      target_unit_type_id: "f1-small",
      target_unit_type_name: template.targetSize,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: "2026-08-31",
      promotion_text: template.offer,
      target_customer_type: template.targetCustomer as Campaign["target_customer_type"],
      objective: "boost demand",
      status: "active",
      leads: 0,
      bookings: 0,
      conversions: 0,
      estimated_rent_created: 0,
      units_affected: 12
    };
    workspace.persist((current) => ({
      ...current,
      campaigns: [campaign, ...current.campaigns],
      activity: [{ id: `activity-${Date.now()}`, title: "Campaign launched", description: `${template.name} is active.`, type: "campaign", created_at: new Date().toISOString() }, ...current.activity]
    }), `${template.name} launched`);
  };

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Revenue playbook templates</h2>
        <p className="mt-2 text-slate-600">Launch campaigns when seasonality, vacancy or customer type signals justify it.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {campaignTemplates.map((template) => (
            <article className="card p-5" key={template.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">{template.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{template.why}</p>
                </div>
                <Badge tone="green">{template.kpi}</Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                <p><strong>Target:</strong> {template.targetSize} · {template.targetCustomer}</p>
                <p><strong>Offer:</strong> {template.offer}</p>
                <p><strong>Widget promo:</strong> {template.widgetText}</p>
                <p><strong>Email:</strong> {template.emailCopy}</p>
              </div>
              <Button onClick={() => launchTemplate(template)}><Megaphone className="h-4 w-4" />Launch campaign</Button>
            </article>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Active campaign performance</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {workspace.campaigns.map((campaign) => (
            <article className="rounded-3xl border border-slate-200 p-5" key={campaign.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">{campaign.name}</h3>
                  <p className="text-sm text-slate-600">{campaign.facility_name} · {campaign.target_unit_type_name}</p>
                </div>
                <Badge tone={campaign.status === "active" ? "green" : "slate"}>{campaign.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">Leads<p className="font-semibold text-slate-950">{campaign.leads}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3">Bookings<p className="font-semibold text-slate-950">{campaign.bookings}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3">Won<p className="font-semibold text-slate-950">{campaign.conversions}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3">Rent<p className="font-semibold text-slate-950">{eur(campaign.estimated_rent_created)}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Seasonal rules</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {seasonalRules.map((rule) => (
            <div className="rounded-3xl border border-slate-200 p-4" key={rule.id}>
              <p className="font-semibold text-slate-950">{rule.period}</p>
              <p className="mt-2 text-sm text-slate-600">{rule.rule}</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{rule.action}</p>
            </div>
          ))}
        </div>
      </section>
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
        setTimeout(() => setCopied(false), 1200);
      }}
      variant="secondary"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function ReportsWorkspace() {
  const workspace = useRevenueDemo();
  const completed = workspace.actions.filter((action) => action.status === "completed");
  const approved = workspace.actions.filter((action) => action.status === "approved");
  const dismissed = workspace.actions.filter((action) => action.status === "dismissed" || action.status === "rejected");
  const expectedUplift = [...approved, ...completed].reduce((sum, action) => sum + (action.estimated_monthly_uplift ?? 0), 0);
  const simulatedUplift = Math.round(expectedUplift * 0.46) + workspace.convertedRent;
  const rentRoll = 34200 + workspace.convertedRent;
  const report = [
    "StorageYield decision impact report",
    `Rent roll: ${eur(rentRoll)}`,
    `Expected uplift approved: ${eur(expectedUplift)}/mo`,
    `Simulated 14-day uplift: ${eur(simulatedUplift)}`,
    `Approved decisions: ${approved.map((action) => action.title).join(", ") || "none"}`,
    `Completed decisions: ${completed.map((action) => action.title).join(", ") || "none"}`,
    `Rejected or failed decisions: ${dismissed.map((action) => action.title).join(", ") || "none"}`,
    "Next week: approve Brussels 3 m² pricing, refresh stale competitor prices, recover discount leakage."
  ].join("\n");

  return (
    <div className="space-y-6">
      <Toasts items={workspace.toasts} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Owner impact</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Impact Report</h1>
          <p className="mt-2 text-lg text-slate-600">Approved decisions, simulated 14-day outcomes, conversion impact and next-week revenue priorities.</p>
        </div>
        <CopyButton text={report} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardStat icon={CircleDollarSign} label="Rent roll" tone="green" value={eur(rentRoll)} />
        <DashboardStat icon={Gauge} label="Expected uplift" tone="amber" value={`${eur(expectedUplift)}/mo`} />
        <DashboardStat icon={Sparkles} label="Simulated 14-day uplift" tone="blue" value={eur(simulatedUplift)} />
        <DashboardStat icon={Check} label="Decisions approved" tone="green" value={approved.length} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="card p-5">
          <h2 className="text-2xl font-semibold text-slate-950">Decision impact tracking</h2>
          <p className="mt-3 text-slate-600">Approved pricing, converted bookings and launched campaigns are carried into this report through demo state.</p>
          <div className="mt-5 space-y-3">
            {[...approved, ...completed].map((action) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={action.id}>
                <div className="flex justify-between gap-3">
                  <p className="font-semibold text-slate-950">{action.title}</p>
                  <Badge tone={action.status === "completed" ? "blue" : "green"}>{action.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{action.estimated_monthly_uplift ? `${eur(action.estimated_monthly_uplift)}/mo expected · ${eur(Math.round(action.estimated_monthly_uplift * 0.46))} simulated in 14 days` : "Data quality action"}</p>
              </div>
            ))}
            {dismissed.map((action) => (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4" key={action.id}>
                <div className="flex justify-between gap-3">
                  <p className="font-semibold text-slate-950">{action.title}</p>
                  <Badge tone="red">rejected</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">No expected uplift carried forward.</p>
              </div>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-2xl font-semibold text-slate-950">Next week priorities</h2>
          <div className="mt-4 space-y-3">
            {workspace.actions.filter((action) => action.status === "proposed").slice(0, 5).map((action) => (
              <div className="rounded-2xl border border-slate-200 p-4" key={action.id}>
                <p className="font-semibold text-slate-950">{actionQuestion(action)}</p>
                <p className="mt-1 text-sm text-slate-600">{action.exact_next_step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5"><h2 className="font-semibold text-slate-950">Conversion impact</h2><p className="mt-3 text-sm text-slate-600">{workspace.bookings.filter((booking) => booking.status === "converted").length} converted, {workspace.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status)).length} still need follow-up. Rent roll change: {eur(workspace.convertedRent)}.</p></div>
        <div className="card p-5"><h2 className="font-semibold text-slate-950">Competitor movements</h2><p className="mt-3 text-sm text-slate-600">BoxPlus Brussels moved above your 3 m² price. Refresh stale observations before the next pricing review.</p></div>
        <div className="card p-5"><h2 className="font-semibold text-slate-950">Data health risks</h2><p className="mt-3 text-sm text-slate-600">Data Health is {workspace.dataHealth.score}%. Fix stale competitor prices and missing mappings.</p></div>
      </section>
    </div>
  );
}

export function SettingsWorkspace() {
  const workspace = useRevenueDemo();
  const widgetUrl = "http://localhost:3000/widget/brussels-north-storage";
  const iframe = `<iframe src="${widgetUrl}" width="100%" height="720" style="border:0;border-radius:16px;"></iframe>`;
  const [showHealth, setShowHealth] = useState(false);

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="card p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Booking data capture</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Copy iframe", "Install on website", "Submit test booking"].map((item, index) => (
              <div className="rounded-2xl border border-slate-200 p-4 text-sm" key={item}>
                <p className="font-semibold text-slate-950">{index + 1}. {item}</p>
                <p className="mt-1 text-slate-600">{index === 0 ? "Use the generated embed code." : index === 1 ? "Place it on your booking page." : "Confirm it appears in Bookings."}</p>
              </div>
            ))}
          </div>
          <pre className="mt-5 overflow-x-auto rounded-3xl bg-slate-950 p-5 text-xs text-white">{iframe}</pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton text={iframe} />
            <Link className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 active:translate-y-0" href="/widget/brussels-north-storage">Test booking</Link>
            <Button onClick={() => workspace.persist((current) => ({ ...current, widgetInstalled: true }), "Widget marked installed")} variant="secondary">Mark installed</Button>
          </div>
        </section>
        <section className="card overflow-hidden p-3">
          <iframe className="h-[620px] w-full rounded-[1.5rem] border border-slate-200" src="/widget/brussels-north-storage" />
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Facility data source", "Booking rules", "Pricing rules", "Market Radar rules", "Seasonal rules", "Data health", "Demo reset"].map((label) => (
          <button
            className="card p-5 text-left"
            key={label}
            onClick={() => {
              if (label === "Data health") setShowHealth(true);
              else if (label === "Demo reset") {
                window.localStorage.removeItem("storageyield.demoState");
                workspace.toast("Demo state reset. Refresh to reload defaults.");
              } else {
                workspace.toast(`${label} opened in demo mode`);
              }
            }}
            type="button"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-950">{label}</h3>
	                <p className="mt-2 text-sm text-slate-600">Configure the data and rules that feed revenue decisions.</p>
              </div>
              <PanelRightOpen className="h-5 w-5 text-slate-400" />
            </div>
          </button>
        ))}
      </section>
      {showHealth ? <DataHealthPanel issues={workspace.dataHealth.issues} onClose={() => setShowHealth(false)} /> : null}
    </div>
  );
}
