import { NextResponse } from "next/server";
import { z } from "zod";
import { subDays } from "date-fns";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { calculateFacilityMetrics } from "@/lib/calculations/metrics";
import { buildCompetitorEvidenceByUnitType, summarizeCompetitorSignals } from "@/lib/competitors/insights";
import { fetchCompetitorEvidenceRows } from "@/lib/competitors/queries";

const schema = z.object({ organization_id: z.string().uuid().optional(), facility_id: z.string().uuid().nullable().optional() });

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const access = await requireOrganizationAccess(parsed.data.organization_id);
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const facilityQuery = supabase.from("facilities").select("id,organization_id").in("organization_id", organizationIds).limit(1);
  if (parsed.data.facility_id) facilityQuery.eq("id", parsed.data.facility_id);
  const { data: facilities, error: facilityError } = await facilityQuery;
  const facility = facilities?.[0];
  if (facilityError || !facility) return NextResponse.json({ error: "Facility access required" }, { status: 403 });

  const periodEnd = new Date();
  const periodStart = subDays(periodEnd, 7);
  const unitsQ = supabase
    .from("units")
    .select("id,facility_id,unit_type_id,status,current_rent_monthly,discount_monthly,arrears_amount");
  const unitTypesQ = supabase
    .from("unit_types")
    .select("id,facility_id,name,size_m2,description,current_street_rate_monthly");
  unitsQ.eq("facility_id", facility.id);
  unitTypesQ.eq("facility_id", facility.id);
  const [{ data: units }, { data: unitTypes }, { data: actions }, competitorRows] = await Promise.all([
    unitsQ,
    unitTypesQ,
    supabase.from("actions").select("title,priority,status,estimated_monthly_uplift").eq("facility_id", facility.id),
    fetchCompetitorEvidenceRows(supabase, facility.id)
  ]);
  const metrics = calculateFacilityMetrics((units ?? []) as never[], (unitTypes ?? []) as never[]);
  const competitorEvidence = buildCompetitorEvidenceByUnitType(competitorRows);
  const competitorSignals = summarizeCompetitorSignals(competitorEvidence);
  const below = competitorSignals.below_market[0];
  const above = competitorSignals.above_market[0];
  const competitorSummary = [
    below ? `${below.own_unit_type_name} is priced ${Math.round(((below.weighted_competitor_average! - below.own_street_rate) / below.own_street_rate) * 100)}% below selected direct/partial competitors.` : null,
    above ? `${above.own_unit_type_name} is priced ${Math.round(((above.own_street_rate - above.weighted_competitor_average!) / above.weighted_competitor_average!) * 100)}% above selected direct/partial competitors; avoid price increases if occupancy is soft.` : null,
    competitorSignals.stale_price_count ? `${competitorSignals.stale_price_count} competitor prices need refresh.` : null
  ].filter(Boolean).join(" ");
  const summary = `Physical occupancy ${metrics.physical_occupancy_pct.toFixed(1)}%, economic occupancy ${metrics.economic_occupancy_pct.toFixed(1)}%, arrears EUR ${Math.round(metrics.total_arrears)}. Competitor watch: ${competitorSummary || "No fresh direct competitor price gaps found."}`;
  const { data, error } = await supabase
    .from("weekly_reports")
    .insert({
      organization_id: facility.organization_id,
      facility_id: facility.id,
      period_start: periodStart.toISOString().slice(0, 10),
      period_end: periodEnd.toISOString().slice(0, 10),
      summary,
      metrics: { ...metrics, competitor_watch: competitorSignals },
      recommendations: actions ?? []
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, report_id: data.id, summary });
}
