import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDataHealth } from "@/lib/data-health";
import { type Campaign, type OperatorAction, type OperatorBooking, type OperatorSignal } from "@/lib/operator-demo";
import { calculateMarketAverages } from "@/lib/signals/generate-signals";
import { buildUnitPressureRows } from "@/lib/pricing/unit-pressure";
import type { Competitor, CompetitorPriceObservation, CompetitorUnitMapping, CompetitorUnitType, Facility, FacilityCompetitor, Unit, UnitType } from "@/lib/types";

function mapBookingStatus(status: string): OperatorBooking["status"] {
  if (status === "converted") return "converted";
  if (status === "reserved" || status === "approved") return "reserved";
  if (status === "rejected" || status === "cancelled" || status === "lost") return "lost";
  if (status === "contacted") return "contacted";
  return "requested";
}

function mapActionStatus(status: string): OperatorAction["status"] {
  if (status === "approved" || status === "active" || status === "completed" || status === "rejected" || status === "dismissed") return status;
  return "proposed";
}

function actionEvidenceToList(evidence: unknown): string[] {
  if (Array.isArray(evidence)) return evidence.map(String);
  if (evidence && typeof evidence === "object") {
    return Object.entries(evidence as Record<string, unknown>).map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`);
  }
  return [];
}

export async function GET() {
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userData.user.id);
  if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 500 });

  const organizationIds = (memberships ?? []).map((membership) => membership.organization_id as string);
  if (!organizationIds.length) {
    return NextResponse.json({
      facilities: [],
      unitTypes: [],
      units: [],
      bookings: [],
      leads: [],
      signals: [],
      actions: [],
      competitors: [],
      competitorUnitTypes: [],
      competitorPriceObservations: [],
      competitorUnitMappings: [],
      observations: [],
      campaigns: [],
      actionEvents: [],
      weeklyReports: [],
      dataHealth: { score: 0, issues: [{ id: "no-organization", title: "No organization has been set up yet", severity: "high", cta: "Create organization" }] },
      activity: [],
      unitRows: [],
      impact: { rentRoll: 0, expectedMonthlyUplift: 0, simulatedUplift: 0, approvedDecisions: 0, completedDecisions: 0, convertedBookings: 0, actionEvents: [] }
    });
  }

  const { data: facilitiesRaw, error: facilityError } = await supabase
    .from("facilities")
    .select("id,organization_id,name,city,public_slug,currency")
    .in("organization_id", organizationIds)
    .order("created_at", { ascending: true });
  if (facilityError) return NextResponse.json({ error: facilityError.message }, { status: 500 });

  const facilities = (facilitiesRaw ?? []) as Facility[];
  const facilityIds = facilities.map((facility) => facility.id);

  const [
    unitTypesResult,
    unitsResult,
    leadsResult,
    bookingsResult,
    signalsResult,
    actionsResult,
    competitorsResult,
    campaignsResult,
    actionEventsResult,
    weeklyReportsResult
  ] = await Promise.all([
    facilityIds.length ? supabase.from("unit_types").select("id,facility_id,name,size_m2,description,current_street_rate_monthly").in("facility_id", facilityIds) : Promise.resolve({ data: [], error: null }),
    facilityIds.length ? supabase.from("units").select("id,facility_id,unit_type_id,status,current_rent_monthly,tenant_start_date,discount_monthly,arrears_amount").in("facility_id", facilityIds) : Promise.resolve({ data: [], error: null }),
    supabase.from("leads").select("*").in("organization_id", organizationIds),
    supabase.from("booking_requests").select("*").in("organization_id", organizationIds).order("created_at", { ascending: false }),
    supabase.from("signals").select("*").in("organization_id", organizationIds).order("created_at", { ascending: false }),
    supabase.from("actions").select("*").in("organization_id", organizationIds).order("created_at", { ascending: false }),
    supabase.from("competitors").select("*").in("organization_id", organizationIds).order("created_at", { ascending: false }),
    supabase.from("campaigns").select("*").in("organization_id", organizationIds).order("created_at", { ascending: false }),
    supabase.from("action_events").select("*").in("organization_id", organizationIds).order("created_at", { ascending: false }),
    supabase.from("weekly_reports").select("*").in("organization_id", organizationIds).order("created_at", { ascending: false })
  ]);

  for (const result of [unitTypesResult, unitsResult, leadsResult, bookingsResult, signalsResult, actionsResult, competitorsResult, campaignsResult, actionEventsResult, weeklyReportsResult]) {
    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  const unitTypes = (unitTypesResult.data ?? []).map((unitType) => ({
    ...unitType,
    size_m2: Number(unitType.size_m2),
    current_street_rate_monthly: Number(unitType.current_street_rate_monthly)
  })) as UnitType[];
  const units = (unitsResult.data ?? []).map((unit) => ({
    ...unit,
    current_rent_monthly: unit.current_rent_monthly == null ? null : Number(unit.current_rent_monthly),
    discount_monthly: Number(unit.discount_monthly ?? 0),
    arrears_amount: Number(unit.arrears_amount ?? 0)
  })) as Unit[];
  const competitors = (competitorsResult.data ?? []) as Competitor[];
  const competitorIds = competitors.map((competitor) => competitor.id);

  const [competitorUnitTypesResult, competitorPriceObservationsResult, competitorUnitMappingsResult, facilityCompetitorsResult] = await Promise.all([
    competitorIds.length ? supabase.from("competitor_unit_types").select("*").in("competitor_id", competitorIds) : Promise.resolve({ data: [], error: null }),
    competitorIds.length ? supabase.from("competitor_price_observations").select("*").in("competitor_id", competitorIds).order("observed_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
    facilityIds.length ? supabase.from("competitor_unit_mappings").select("*").in("facility_id", facilityIds) : Promise.resolve({ data: [], error: null }),
    facilityIds.length ? supabase.from("facility_competitors").select("*").in("facility_id", facilityIds) : Promise.resolve({ data: [], error: null })
  ]);
  for (const result of [competitorUnitTypesResult, competitorPriceObservationsResult, competitorUnitMappingsResult, facilityCompetitorsResult]) {
    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  const facilityById = new Map(facilities.map((facility) => [facility.id, facility]));
  const unitTypeById = new Map(unitTypes.map((unitType) => [unitType.id, unitType]));

  const bookings = (bookingsResult.data ?? []).map((booking) => {
    const unitType = unitTypeById.get(booking.unit_type_id);
    const facility = facilityById.get(booking.facility_id);
    return {
      id: booking.id,
      customer_name: booking.customer_name,
      customer_type: booking.customer_type ?? "unknown",
      unit_type_id: booking.unit_type_id,
      unit_type_name: unitType?.name ?? "Requested unit",
      facility_id: booking.facility_id,
      facility_name: facility?.name ?? "Facility",
      preferred_move_in_date: booking.preferred_move_in_date ?? booking.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      quoted_monthly_rate: Number(booking.quoted_monthly_rate ?? unitType?.current_street_rate_monthly ?? 0),
      source: "booking widget",
      status: mapBookingStatus(booking.status),
      created_at: booking.created_at,
      next_action: booking.status === "requested" ? "Contact customer and confirm availability" : "Track conversion outcome"
    } satisfies OperatorBooking;
  });

  const signals = (signalsResult.data ?? []).map((signal) => {
    const unitType = signal.unit_type_id ? unitTypeById.get(signal.unit_type_id) : undefined;
    const facility = signal.facility_id ? facilityById.get(signal.facility_id) : undefined;
    const evidence = signal.evidence && typeof signal.evidence === "object" ? (signal.evidence as Record<string, unknown>) : {};
    return {
      id: signal.id,
      title: signal.title,
      category: signal.category,
      facility_id: signal.facility_id ?? facilityIds[0] ?? "",
      facility_name: facility?.name ?? "Portfolio",
      unit_type_id: signal.unit_type_id ?? undefined,
      unit_type_name: unitType?.name,
      severity: signal.severity,
      evidence: evidence.summary ? String(evidence.summary) : actionEvidenceToList(evidence).join(", "),
      created_at: signal.created_at,
      linked_action_id: signal.linked_action_id ?? undefined
    } satisfies OperatorSignal;
  });

  const actions = (actionsResult.data ?? []).map((action) => {
    const unitType = action.unit_type_id ? unitTypeById.get(action.unit_type_id) : undefined;
    const evidence = action.evidence && typeof action.evidence === "object" ? (action.evidence as Record<string, unknown>) : {};
    return {
      id: action.id,
      title: action.title,
      description: action.description,
      exact_next_step: action.exact_next_step ?? String(evidence.next_step ?? ""),
      estimated_monthly_uplift: action.estimated_monthly_uplift == null ? null : Number(action.estimated_monthly_uplift),
      confidence: Number(action.confidence_score ?? action.confidence ?? 0.7),
      priority: action.priority,
      category: action.category,
      source_signals: Array.isArray(evidence.source_signals) ? evidence.source_signals : [],
      evidence: actionEvidenceToList(evidence),
      linked_signal_ids: action.linked_signal_ids ?? [],
      status: mapActionStatus(action.status),
      created_at: action.created_at,
      completed_at: action.completed_at ?? null,
      facility_id: action.facility_id ?? undefined,
      unit_type_id: action.unit_type_id ?? undefined,
      unit_type_name: unitType?.name,
      recommended_street_rate: Number((action.proposed_change as Record<string, unknown> | null)?.recommended_rate ?? evidence.recommended_rate ?? 0) || undefined
    } satisfies OperatorAction;
  });

  const campaigns = (campaignsResult.data ?? []).map((campaign) => {
    const facility = facilityById.get(campaign.facility_id);
    const unitType = campaign.target_unit_type_id ? unitTypeById.get(campaign.target_unit_type_id) : undefined;
    return {
      id: campaign.id,
      name: campaign.name,
      facility_id: campaign.facility_id,
      facility_name: facility?.name ?? "Facility",
      target_unit_type_id: campaign.target_unit_type_id ?? "",
      target_unit_type_name: unitType?.name ?? "Target unit type",
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      promotion_text: campaign.promotion_text,
      target_customer_type: campaign.target_customer_type,
      objective: String(campaign.objective).replace("_", " ") as Campaign["objective"],
      status: campaign.status,
      leads: campaign.leads_count ?? 0,
      bookings: campaign.bookings_count ?? 0,
      conversions: campaign.conversions_count ?? 0,
      estimated_rent_created: Number(campaign.estimated_rent_created ?? 0),
      units_affected: campaign.units_affected ?? 0
    } satisfies Campaign;
  });

  const competitorUnitTypes = (competitorUnitTypesResult.data ?? []) as CompetitorUnitType[];
  const competitorPriceObservations = (competitorPriceObservationsResult.data ?? []).map((observation) => ({
    ...observation,
    observed_price_monthly: Number(observation.observed_price_monthly)
  })) as CompetitorPriceObservation[];
  const competitorUnitMappings = (competitorUnitMappingsResult.data ?? []).map((mapping) => ({
    ...mapping,
    comparability_score: Number(mapping.comparability_score)
  })) as CompetitorUnitMapping[];
  const facilityCompetitors = (facilityCompetitorsResult.data ?? []).map((relationship) => ({
    ...relationship,
    influence_weight: Number(relationship.influence_weight ?? 1)
  })) as FacilityCompetitor[];
  const marketAverages = calculateMarketAverages({
    facilities,
    unitTypes,
    units,
    bookings,
    competitors,
    facilityCompetitors,
    competitorUnitMappings,
    competitorPriceObservations
  });

  const approvedActions = actions.filter((action) => action.status === "approved");
  const completedActions = actions.filter((action) => action.status === "completed");
  const expectedMonthlyUplift = [...approvedActions, ...completedActions].reduce((sum, action) => sum + (action.estimated_monthly_uplift ?? 0), 0);
  const rentRoll = units.filter((unit) => unit.status === "occupied").reduce((sum, unit) => sum + (unit.current_rent_monthly ?? 0), 0);
  const actionEvents = actionEventsResult.data ?? [];

  return NextResponse.json({
    facilities,
    unitTypes,
    units,
    bookings,
    leads: leadsResult.data ?? [],
    signals,
    actions,
    competitors,
    competitorUnitTypes,
    competitorPriceObservations,
    competitorUnitMappings,
    observations: competitorPriceObservations,
    campaigns,
    actionEvents,
    weeklyReports: weeklyReportsResult.data ?? [],
    dataHealth: calculateDataHealth({ unitTypes, units, bookings, competitors, competitorPriceObservations, competitorUnitMappings, campaigns }),
    activity: [],
    unitRows: buildUnitPressureRows({ facilities, unitTypes, units, bookings, marketAverages }),
    impact: {
      rentRoll,
      expectedMonthlyUplift,
      simulatedUplift: Math.round(expectedMonthlyUplift * 0.46),
      approvedDecisions: approvedActions.length,
      completedDecisions: completedActions.length,
      convertedBookings: bookings.filter((booking) => booking.status === "converted").length,
      actionEvents
    }
  });
}
