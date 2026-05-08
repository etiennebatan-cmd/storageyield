import { differenceInCalendarDays, subDays } from "date-fns";
import {
  demoBookings,
  demoCompetitorPriceObservations,
  demoCompetitors,
  demoDemandSignals,
  demoFacilities,
  demoFacilityCompetitors,
  demoUnits,
  demoUnitTypes
} from "@/lib/demo-data";
import { calculateFacilityMetrics } from "@/lib/calculations/metrics";
import { buildCompetitorEvidenceByUnitType, summarizeCompetitorSignals } from "@/lib/competitors/insights";
import { demoCompetitorEvidenceRows } from "@/lib/competitors/demo";
import { Unit, UnitType } from "@/lib/types";

export type SignalCategory =
  | "competitor_price_up"
  | "competitor_price_down"
  | "high_demand_unit_type"
  | "low_occupancy_unit_type"
  | "discount_leakage"
  | "tenant_below_market"
  | "arrears_risk"
  | "booking_conversion_drop"
  | "seasonal_campaign_opportunity"
  | "large_unit_split_candidate"
  | "stale_competitor_price"
  | "under_market_price"
  | "over_market_vacancy_risk";

export type ActionCategory = "pricing" | "discount_recovery" | "booking_follow_up" | "collections" | "competitor_response" | "campaign" | "unit_mix" | "b2b_growth";
export type ActionStatus = "proposed" | "approved" | "active" | "completed" | "dismissed" | "rejected";
export type Priority = "high" | "medium" | "low";

export interface OperatorSignal {
  id: string;
  title: string;
  category: SignalCategory;
  facility_id: string;
  facility_name: string;
  unit_type_id?: string;
  unit_type_name?: string;
  severity: Priority;
  evidence: string;
  created_at: string;
  linked_action_id?: string;
}

export interface OperatorAction {
  id: string;
  title: string;
  description: string;
  exact_next_step: string;
  estimated_monthly_uplift: number | null;
  confidence: number;
  priority: Priority;
  category: ActionCategory;
  source_signals: Array<"booking demand" | "competitor" | "occupancy" | "discount" | "seasonality" | "arrears">;
  evidence: string[];
  linked_signal_ids: string[];
  status: ActionStatus;
  created_at: string;
  completed_at: string | null;
  facility_id?: string;
  unit_type_id?: string;
  unit_type_name?: string;
  recommended_street_rate?: number;
}

export interface OperatorBooking {
  id: string;
  customer_name: string;
  customer_type: "private" | "business" | "unknown";
  unit_type_id: string;
  unit_type_name: string;
  facility_id: string;
  facility_name: string;
  preferred_move_in_date: string;
  quoted_monthly_rate: number;
  source: string;
  status: "requested" | "contacted" | "reserved" | "converted" | "lost";
  created_at: string;
  next_action: string;
}

export interface Campaign {
  id: string;
  name: string;
  facility_id: string;
  facility_name: string;
  target_unit_type_id: string;
  target_unit_type_name: string;
  start_date: string;
  end_date: string;
  promotion_text: string;
  target_customer_type: "private" | "business" | "student" | "contractor" | "archive" | "e-commerce";
  objective: "fill vacancy" | "boost demand" | "seasonal campaign";
  status: "draft" | "active" | "paused" | "completed";
  leads: number;
  bookings: number;
  conversions: number;
  estimated_rent_created: number;
  units_affected: number;
}

export const seasonalRules = [
  { id: "season-may-aug", period: "May-August", rule: "Student and moving season for 1-5 m² units", action: "Promote small-unit availability and fast move-in." },
  { id: "season-sep-oct", period: "September-October", rule: "Post-summer storage demand", action: "Follow up student and apartment overflow leads." },
  { id: "season-nov-feb", period: "November-February", rule: "Lower private demand", action: "Use promotions for weak unit types and refresh stale listings." },
  { id: "season-q4", period: "Q4", rule: "E-commerce and business overflow", action: "Target contractors, web shops and archive storage." }
];

const today = new Date("2026-05-07T09:00:00.000Z");

export function eur(value: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(value));
}

function facility(id: string) {
  return demoFacilities.find((item) => item.id === id)!;
}

export function unitsForType(unitTypeId: string, units = demoUnits) {
  return units.filter((unit) => unit.unit_type_id === unitTypeId);
}

export function occupancyForType(unitTypeId: string, units = demoUnits) {
  const rows = unitsForType(unitTypeId, units);
  if (!rows.length) return 0;
  return (rows.filter((unit) => unit.status === "occupied").length / rows.length) * 100;
}

export function discountLeakage(units = demoUnits) {
  return units.filter((unit) => unit.status === "occupied").reduce((sum, unit) => sum + unit.discount_monthly, 0);
}

export function arrearsRisk(units = demoUnits) {
  return units.reduce((sum, unit) => sum + unit.arrears_amount, 0);
}

export function moneyLeftOnTable(units = demoUnits, unitTypes = demoUnitTypes) {
  const metrics = calculateFacilityMetrics(units, unitTypes);
  const leakage = discountLeakage(units);
  const arrears = arrearsRisk(units);
  return Math.round(Math.max(0, metrics.potential_monthly_rent - metrics.current_monthly_rent) * 0.22 + leakage * 0.7 + arrears * 0.18);
}

export const demoOperatorBookings: OperatorBooking[] = [
  {
    id: "booking-live-1",
    customer_name: "Maya Peeters",
    customer_type: "private",
    unit_type_id: "f1-small",
    unit_type_name: "3 m² unit",
    facility_id: "f1",
    facility_name: "Brussels North Storage",
    preferred_move_in_date: "2026-05-10",
    quoted_monthly_rate: 92,
    source: "website widget",
    status: "requested",
    created_at: subDays(today, 1).toISOString(),
    next_action: "Call today and reserve BRU-3M-118"
  },
  {
    id: "booking-live-2",
    customer_name: "Bouwatelier North",
    customer_type: "business",
    unit_type_id: "f2-business",
    unit_type_name: "20 m² unit",
    facility_id: "f2",
    facility_name: "Antwerp Ring Storage",
    preferred_move_in_date: "2026-05-13",
    quoted_monthly_rate: 289,
    source: "website widget",
    status: "contacted",
    created_at: subDays(today, 3).toISOString(),
    next_action: "Assign available business unit and send quote"
  },
  {
    id: "booking-live-3",
    customer_name: "Jules Vermeulen",
    customer_type: "private",
    unit_type_id: "f3-large",
    unit_type_name: "10 m² unit",
    facility_id: "f3",
    facility_name: "Ghent South Storage",
    preferred_move_in_date: "2026-05-18",
    quoted_monthly_rate: 168,
    source: "campaign",
    status: "reserved",
    created_at: subDays(today, 5).toISOString(),
    next_action: "Confirm move-in documents"
  },
  ...demoBookings.map((booking, index) => ({
    id: `${booking.id}-queue`,
    customer_name: booking.customer_name,
    customer_type: index === 1 ? "business" as const : "private" as const,
    unit_type_id: index === 1 ? "f2-business" : "f1-small",
    unit_type_name: booking.requested_unit,
    facility_id: index === 1 ? "f2" : "f1",
    facility_name: booking.facility_name,
    preferred_move_in_date: "2026-05-21",
    quoted_monthly_rate: booking.quoted_monthly_rate,
    source: "website widget",
    status: booking.status === "approved" ? "reserved" as const : booking.status === "requested" ? "requested" as const : "reserved" as const,
    created_at: subDays(today, index + 2).toISOString(),
    next_action: booking.action
  }))
];

export function unitPressureRows(units: Unit[] = demoUnits, unitTypes: UnitType[] = demoUnitTypes) {
  const competitorEvidence = buildCompetitorEvidenceByUnitType(demoCompetitorEvidenceRows());
  return unitTypes.map((ut) => {
    const rows = units.filter((unit) => unit.unit_type_id === ut.id);
    const occupied = rows.filter((unit) => unit.status === "occupied").length;
    const demand = demoDemandSignals.find((signal) => signal.unit_type_id === ut.id) ?? { leads30: 0, bookings30: 0 };
    const leakage = rows.reduce((sum, unit) => sum + unit.discount_monthly, 0);
    const evidence = competitorEvidence[ut.id];
    const marketAvg = evidence?.weighted_competitor_average ?? null;
    const gap = marketAvg === null ? null : marketAvg - ut.current_street_rate_monthly;
    return {
      id: ut.id,
      facility_id: ut.facility_id,
      facility_name: facility(ut.facility_id).name,
      name: ut.name,
      units: rows.length,
      occupied,
      occupancy: rows.length ? (occupied / rows.length) * 100 : 0,
      demand30: demand.leads30 + demand.bookings30,
      leads30: demand.leads30,
      bookings30: demand.bookings30,
      street_rate: ut.current_street_rate_monthly,
      target_rate: Math.round(ut.current_street_rate_monthly * 1.06),
      market_avg: marketAvg,
      gap,
      discount_leakage: leakage,
      rent_per_m2: ut.current_street_rate_monthly / ut.size_m2,
      recommendation:
        marketAvg !== null && gap !== null && gap > ut.current_street_rate_monthly * 0.05 && rows.length && (occupied / rows.length) * 100 > 85
          ? "Raise new-customer rate"
          : rows.length && (occupied / rows.length) * 100 < 70
            ? "Launch demand campaign"
            : leakage > 0
              ? "Review discounts"
              : "Hold price"
    };
  });
}

export const demoSignals: OperatorSignal[] = [
  {
    id: "sig-price-brussels-3",
    title: "Brussels 3 m² is below selected direct competitors",
    category: "competitor_price_up",
    facility_id: "f1",
    facility_name: "Brussels North Storage",
    unit_type_id: "f1-small",
    unit_type_name: "3 m² unit",
    severity: "high",
    evidence: "BoxPlus Brussels and CityStorage North average 8% higher on comparable units.",
    created_at: subDays(today, 1).toISOString(),
    linked_action_id: "act-raise-brussels-3"
  },
  {
    id: "sig-demand-small",
    title: "Small-unit booking demand is high",
    category: "high_demand_unit_type",
    facility_id: "f1",
    facility_name: "Brussels North Storage",
    unit_type_id: "f1-small",
    unit_type_name: "3 m² unit",
    severity: "high",
    evidence: "17 leads and bookings in the last 30 days.",
    created_at: subDays(today, 1).toISOString(),
    linked_action_id: "act-raise-brussels-3"
  },
  {
    id: "sig-discounts",
    title: "Legacy discounts are leaking rent",
    category: "discount_leakage",
    facility_id: "f1",
    facility_name: "Brussels North Storage",
    severity: "high",
    evidence: "19 occupied units still carry monthly concessions.",
    created_at: subDays(today, 2).toISOString(),
    linked_action_id: "act-recover-discounts"
  },
  {
    id: "sig-stale-competitors",
    title: "Competitor price data is stale",
    category: "stale_competitor_price",
    facility_id: "f1",
    facility_name: "Brussels North Storage",
    severity: "medium",
    evidence: "4 observations are older than 45 days.",
    created_at: subDays(today, 3).toISOString(),
    linked_action_id: "act-refresh-competitors"
  },
  {
    id: "sig-student-season",
    title: "Student summer storage season is starting",
    category: "seasonal_campaign_opportunity",
    facility_id: "f1",
    facility_name: "Brussels North Storage",
    unit_type_id: "f1-locker",
    unit_type_name: "1 m² locker",
    severity: "medium",
    evidence: "May-August seasonal rule plus high inquiry volume for 1-5 m² units.",
    created_at: subDays(today, 3).toISOString(),
    linked_action_id: "act-student-campaign"
  },
  {
    id: "sig-arrears",
    title: "Arrears risk is concentrated",
    category: "arrears_risk",
    facility_id: "f2",
    facility_name: "Antwerp Ring Storage",
    severity: "medium",
    evidence: `${eur(arrearsRisk())} in open arrears across the portfolio.`,
    created_at: subDays(today, 4).toISOString(),
    linked_action_id: "act-collections"
  }
];

export const demoActions: OperatorAction[] = [
  {
    id: "act-raise-brussels-3",
    title: "Raise Brussels 3 m² street rate",
    description: "3 m² units are 94% occupied, received 17 leads in 30 days, and selected direct competitors are 8% higher.",
    exact_next_step: "Increase new-customer street rate from €92 to €98. Do not change existing tenants yet.",
    estimated_monthly_uplift: 620,
    confidence: 0.86,
    priority: "high",
    category: "pricing",
    source_signals: ["booking demand", "competitor", "occupancy"],
    evidence: ["Our price: €92/mo", "Weighted competitor average: €99/mo", "Competitors considered: BoxPlus Brussels, CityStorage North", "Excluded: Premium Climate Storage, benchmark only"],
    linked_signal_ids: ["sig-price-brussels-3", "sig-demand-small"],
    facility_id: "f1",
    unit_type_id: "f1-small",
    unit_type_name: "3 m² unit",
    recommended_street_rate: 98,
    status: "proposed",
    created_at: subDays(today, 1).toISOString(),
    completed_at: null
  },
  {
    id: "act-student-campaign",
    title: "Launch student summer storage campaign",
    description: "May-August seasonal demand and 1-5 m² units show high inquiry volume.",
    exact_next_step: "Create a student landing page and first-month discount for small units only.",
    estimated_monthly_uplift: 540,
    confidence: 0.72,
    priority: "medium",
    category: "campaign",
    source_signals: ["seasonality", "booking demand"],
    evidence: ["Seasonal rule: May-August student/moving season", "1-5 m² units received 42 leads in 30 days"],
    linked_signal_ids: ["sig-student-season"],
    status: "proposed",
    created_at: subDays(today, 2).toISOString(),
    completed_at: null
  },
  {
    id: "act-recover-discounts",
    title: "Recover expired discounts",
    description: "19 occupied units still carry legacy monthly concessions.",
    exact_next_step: "Review discounts older than 90 days and remove where no active promotion applies.",
    estimated_monthly_uplift: 770,
    confidence: 0.8,
    priority: "high",
    category: "discount_recovery",
    source_signals: ["discount"],
    evidence: [`Discount leakage: ${eur(discountLeakage())}/mo`, "Estimated recoverable amount: 70%"],
    linked_signal_ids: ["sig-discounts"],
    status: "approved",
    created_at: subDays(today, 3).toISOString(),
    completed_at: null
  },
  {
    id: "act-refresh-competitors",
    title: "Refresh competitor prices",
    description: "4 competitor observations are older than 45 days.",
    exact_next_step: "Update tracked competitor pricing URLs before the next pricing decision.",
    estimated_monthly_uplift: null,
    confidence: 0.9,
    priority: "medium",
    category: "competitor_response",
    source_signals: ["competitor"],
    evidence: ["Stale observations: CityStorage 10 m², Antwerp 20 m², Ghent 10 m², BoxPlus 5 m²"],
    linked_signal_ids: ["sig-stale-competitors"],
    status: "proposed",
    created_at: subDays(today, 3).toISOString(),
    completed_at: null
  },
  {
    id: "act-collections",
    title: "Run arrears follow-up batch",
    description: "Arrears are concentrated in older occupied accounts.",
    exact_next_step: "Contact the seven tenants older than 30 days and mark outcomes by Friday.",
    estimated_monthly_uplift: 430,
    confidence: 0.68,
    priority: "medium",
    category: "collections",
    source_signals: ["arrears"],
    evidence: [`Open arrears: ${eur(arrearsRisk())}`],
    linked_signal_ids: ["sig-arrears"],
    status: "active",
    created_at: subDays(today, 4).toISOString(),
    completed_at: null
  }
];

export const demoCampaigns: Campaign[] = [
  {
    id: "camp-student-summer",
    name: "Student summer storage",
    facility_id: "f1",
    facility_name: "Brussels North Storage",
    target_unit_type_id: "f1-locker",
    target_unit_type_name: "1 m² locker",
    start_date: "2026-05-15",
    end_date: "2026-08-31",
    promotion_text: "First month 50% off for student move-ins",
    target_customer_type: "student",
    objective: "seasonal campaign",
    status: "active",
    leads: 18,
    bookings: 7,
    conversions: 3,
    estimated_rent_created: 312,
    units_affected: 28
  },
  {
    id: "camp-contractor-winter",
    name: "Contractor winter storage",
    facility_id: "f2",
    facility_name: "Antwerp Ring Storage",
    target_unit_type_id: "f2-business",
    target_unit_type_name: "20 m² unit",
    start_date: "2026-11-01",
    end_date: "2027-02-28",
    promotion_text: "Secure winter equipment storage for contractors",
    target_customer_type: "contractor",
    objective: "boost demand",
    status: "draft",
    leads: 0,
    bookings: 0,
    conversions: 0,
    estimated_rent_created: 0,
    units_affected: 12
  },
  {
    id: "camp-archive",
    name: "Archive storage campaign",
    facility_id: "f3",
    facility_name: "Ghent South Storage",
    target_unit_type_id: "f3-medium",
    target_unit_type_name: "5 m² unit",
    start_date: "2026-06-01",
    end_date: "2026-07-15",
    promotion_text: "Business archive storage with flexible monthly terms",
    target_customer_type: "archive",
    objective: "fill vacancy",
    status: "active",
    leads: 9,
    bookings: 4,
    conversions: 2,
    estimated_rent_created: 205,
    units_affected: 32
  },
  {
    id: "camp-large-vacancy",
    name: "Large-unit vacancy promo",
    facility_id: "f3",
    facility_name: "Ghent South Storage",
    target_unit_type_id: "f3-large",
    target_unit_type_name: "10 m² unit",
    start_date: "2026-05-01",
    end_date: "2026-05-31",
    promotion_text: "Move this month and get free lock plus first week free",
    target_customer_type: "private",
    objective: "fill vacancy",
    status: "active",
    leads: 11,
    bookings: 5,
    conversions: 2,
    estimated_rent_created: 336,
    units_affected: 16
  }
];

export function actionCenterKpis() {
  const metrics = calculateFacilityMetrics(demoUnits, demoUnitTypes);
  const competitorSignals = summarizeCompetitorSignals(buildCompetitorEvidenceByUnitType(demoCompetitorEvidenceRows()));
  const bookingsNeedingAction = demoOperatorBookings.filter((booking) => ["requested", "contacted"].includes(booking.status)).length;
  const pressure = unitPressureRows();
  return {
    money_left_on_table: moneyLeftOnTable(),
    bookings_needing_action: bookingsNeedingAction,
    unit_types_under_market: competitorSignals.below_market_count,
    discount_leakage: discountLeakage(),
    arrears_risk: arrearsRisk(),
    occupancy_pressure: pressure.filter((row) => row.occupancy > 90 || row.occupancy < 65).length,
    rent_collected_vs_potential: metrics.economic_occupancy_pct
  };
}

export function competitorPriceMovementRows() {
  return demoCompetitorPriceObservations.map((observation) => {
    const competitor = demoCompetitors.find((item) => item.id === observation.competitor_id)!;
    const relationship = demoFacilityCompetitors.find((item) => item.competitor_id === competitor.id);
    const daysOld = differenceInCalendarDays(today, new Date(observation.observed_at));
    return {
      id: observation.id,
      competitor_name: competitor.name,
      price: observation.observed_price_monthly,
      direction: observation.id === "obs-2" || observation.id === "obs-1" ? "up" : observation.id === "obs-6" ? "down" : "flat",
      relationship_type: relationship?.relationship_type ?? "benchmark",
      days_old: daysOld,
      stale: daysOld > 30,
      source_url: observation.source_url
    };
  });
}
