import { NextResponse } from "next/server";
import { z } from "zod";
import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { runRecommendations } from "@/lib/recommendations/engine";
import { buildCompetitorEvidenceByUnitType } from "@/lib/competitors/insights";
import { fetchCompetitorEvidenceRows } from "@/lib/competitors/queries";

const schema = z.object({ facility_id: z.string().uuid(), organization_id: z.string().uuid().optional() });

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: facility, error: facilityError } = await supabase
    .from("facilities")
    .select("id,organization_id")
    .eq("id", parsed.data.facility_id)
    .single();
  if (facilityError || !facility) return NextResponse.json({ error: "Facility not found" }, { status: 404 });
  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("id")
    .eq("id", facility.organization_id)
    .single();
  if (organizationError || !organization) return NextResponse.json({ error: "Facility not found" }, { status: 404 });

  const { data: unitTypes } = await supabase
    .from("unit_types")
    .select("id,facility_id,name,size_m2,description,current_street_rate_monthly")
    .eq("facility_id", facility.id);
  const { data: units } = await supabase
    .from("units")
    .select("id,facility_id,unit_type_id,status,current_rent_monthly,tenant_start_date,discount_monthly,arrears_amount")
    .eq("facility_id", facility.id);
  const demandSince = subDays(new Date(), 30).toISOString();
  const [{ data: leads }, { data: bookings }, competitorRows] = await Promise.all([
    supabase.from("leads").select("unit_type_id").eq("facility_id", facility.id).gte("created_at", demandSince),
    supabase.from("booking_requests").select("unit_type_id").eq("facility_id", facility.id).gte("created_at", demandSince),
    fetchCompetitorEvidenceRows(supabase, facility.id)
  ]);
  const demandByUnitType: Record<string, { leads30: number; bookings30: number }> = {};
  for (const lead of leads ?? []) {
    if (!lead.unit_type_id) continue;
    const item = demandByUnitType[lead.unit_type_id] ?? { leads30: 0, bookings30: 0 };
    item.leads30 += 1;
    demandByUnitType[lead.unit_type_id] = item;
  }
  for (const booking of bookings ?? []) {
    if (!booking.unit_type_id) continue;
    const item = demandByUnitType[booking.unit_type_id] ?? { leads30: 0, bookings30: 0 };
    item.bookings30 += 1;
    demandByUnitType[booking.unit_type_id] = item;
  }
  const competitorEvidence = buildCompetitorEvidenceByUnitType(competitorRows);
  const recs = runRecommendations((units ?? []) as never[], (unitTypes ?? []) as never[], demandByUnitType, competitorEvidence);
  if (!recs.length) return NextResponse.json({ ok: true, inserted: 0 });
  const { error } = await supabase.from("recommendations").insert(
    recs.map((r) => ({
      organization_id: facility.organization_id,
      facility_id: facility.id,
      title: r.title,
      description: r.description,
      category: r.category,
      estimated_monthly_uplift: r.estimated_monthly_uplift,
      priority: r.priority,
      status: "open",
      evidence: r.evidence
    }))
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, inserted: recs.length });
}
