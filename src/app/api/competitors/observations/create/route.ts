import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const schema = z.object({
  competitor_id: z.string().uuid(),
  competitor_unit_type_id: z.string().uuid().nullable().optional(),
  observed_price_monthly: z.number().positive(),
  currency: z.string().min(3).max(3).default("EUR"),
  promo_text: z.string().optional(),
  availability_text: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal("")),
  observed_at: z.string().datetime().or(z.string().date()),
  observation_method: z.enum(["manual", "scrape_stub", "future_scrape", "import"]).default("manual")
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: competitor } = await supabase
    .from("competitors")
    .select("id")
    .eq("id", parsed.data.competitor_id)
    .in("organization_id", organizationIds)
    .single();
  if (!competitor) return NextResponse.json({ error: "Competitor access required" }, { status: 403 });

  if (parsed.data.competitor_unit_type_id) {
    const { data: competitorUnitType } = await supabase
      .from("competitor_unit_types")
      .select("id")
      .eq("id", parsed.data.competitor_unit_type_id)
      .eq("competitor_id", parsed.data.competitor_id)
      .single();
    if (!competitorUnitType) return NextResponse.json({ error: "Competitor unit type does not belong to this competitor" }, { status: 403 });
  }

  const observedAt = new Date(parsed.data.observed_at).toISOString();
  const { data, error } = await supabase.from("competitor_price_observations").insert({
    competitor_id: parsed.data.competitor_id,
    competitor_unit_type_id: parsed.data.competitor_unit_type_id ?? null,
    observed_price_monthly: parsed.data.observed_price_monthly,
    currency: parsed.data.currency,
    promo_text: parsed.data.promo_text || null,
    availability_text: parsed.data.availability_text || null,
    source_url: parsed.data.source_url || null,
    observed_at: observedAt,
    observation_method: parsed.data.observation_method
  }).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.from("competitors").update({ last_observed_at: observedAt }).eq("id", parsed.data.competitor_id);
  return NextResponse.json({ ok: true, observation: data });
}
