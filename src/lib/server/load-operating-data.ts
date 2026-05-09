import type { SupabaseClient } from "@supabase/supabase-js";
import type { Competitor, CompetitorPriceObservation, CompetitorUnitMapping, FacilityCompetitor, Unit, UnitType } from "@/lib/types";
import type { OperatorBooking } from "@/lib/operator-demo";

type LoadInput = {
  supabase: SupabaseClient;
  organizationIds: string[];
  facilityId?: string;
};

function mapBookingStatus(status: string): OperatorBooking["status"] {
  if (status === "converted") return "converted";
  if (status === "reserved" || status === "approved") return "reserved";
  if (status === "contacted") return "contacted";
  if (status === "rejected" || status === "cancelled" || status === "lost") return "lost";
  return "requested";
}

export async function loadOperatingData(input: LoadInput) {
  let facilityQuery = input.supabase
    .from("facilities")
    .select("id,organization_id,name,city,public_slug,currency")
    .in("organization_id", input.organizationIds);
  if (input.facilityId) facilityQuery = facilityQuery.eq("id", input.facilityId);

  const { data: facilitiesRaw, error: facilitiesError } = await facilityQuery;
  if (facilitiesError) throw new Error(facilitiesError.message);

  const facilities = facilitiesRaw ?? [];
  const facilityIds = facilities.map((facility) => facility.id as string);
  if (!facilityIds.length) {
    return {
      facilities: [],
      unitTypes: [],
      units: [],
      bookings: [],
      competitors: [],
      facilityCompetitors: [],
      competitorUnitMappings: [],
      competitorPriceObservations: []
    };
  }

  const [unitTypesResult, unitsResult, bookingsResult, competitorsResult, facilityCompetitorsResult, competitorUnitMappingsResult] = await Promise.all([
    input.supabase.from("unit_types").select("id,facility_id,name,size_m2,description,current_street_rate_monthly").in("facility_id", facilityIds),
    input.supabase.from("units").select("id,facility_id,unit_type_id,status,current_rent_monthly,tenant_start_date,discount_monthly,arrears_amount").in("facility_id", facilityIds),
    input.supabase.from("booking_requests").select("*").in("facility_id", facilityIds),
    input.supabase.from("competitors").select("*").in("organization_id", input.organizationIds),
    input.supabase.from("facility_competitors").select("*").in("facility_id", facilityIds),
    input.supabase.from("competitor_unit_mappings").select("*").in("facility_id", facilityIds)
  ]);

  for (const result of [unitTypesResult, unitsResult, bookingsResult, competitorsResult, facilityCompetitorsResult, competitorUnitMappingsResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  const competitorIds = (competitorsResult.data ?? []).map((competitor) => competitor.id as string);
  const competitorPriceObservationsResult = competitorIds.length
    ? await input.supabase.from("competitor_price_observations").select("*").in("competitor_id", competitorIds).order("observed_at", { ascending: false })
    : { data: [], error: null };
  if (competitorPriceObservationsResult.error) throw new Error(competitorPriceObservationsResult.error.message);

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
  const facilityById = new Map(facilities.map((facility) => [facility.id as string, facility]));
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
      facility_name: String(facility?.name ?? "Facility"),
      preferred_move_in_date: booking.preferred_move_in_date ?? booking.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      quoted_monthly_rate: Number(booking.quoted_monthly_rate ?? unitType?.current_street_rate_monthly ?? 0),
      source: "booking widget",
      status: mapBookingStatus(booking.status),
      created_at: booking.created_at,
      customer_phone: booking.customer_phone ?? null,
      next_action: booking.status === "requested" ? "Contact customer and confirm availability" : "Track conversion outcome"
    } satisfies OperatorBooking;
  });

  return {
    facilities: facilities.map((facility) => ({ id: facility.id as string, name: String(facility.name) })),
    unitTypes,
    units,
    bookings,
    competitors: (competitorsResult.data ?? []) as Competitor[],
    facilityCompetitors: (facilityCompetitorsResult.data ?? []).map((row) => ({ ...row, influence_weight: Number(row.influence_weight ?? 1) })) as FacilityCompetitor[],
    competitorUnitMappings: (competitorUnitMappingsResult.data ?? []).map((row) => ({ ...row, comparability_score: Number(row.comparability_score ?? 1) })) as CompetitorUnitMapping[],
    competitorPriceObservations: (competitorPriceObservationsResult.data ?? []).map((row) => ({ ...row, observed_price_monthly: Number(row.observed_price_monthly) })) as CompetitorPriceObservation[]
  };
}
