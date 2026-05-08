import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recommendationStatusSchema } from "@/lib/validators/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = recommendationStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: recommendation, error: lookupError } = await supabase
    .from("recommendations")
    .select("id,organization_id,facility_id")
    .eq("id", parsed.data.recommendation_id)
    .single();
  if (lookupError || !recommendation) return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });

  const { error } = await supabase
    .from("recommendations")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.recommendation_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (parsed.data.status === "completed") {
    await supabase.from("events").insert({
      organization_id: recommendation.organization_id,
      facility_id: recommendation.facility_id,
      entity_type: "recommendation",
      entity_id: parsed.data.recommendation_id,
      event_type: "recommendation_completed",
      payload: { status: parsed.data.status }
    });
  }

  return NextResponse.json({ ok: true });
}
