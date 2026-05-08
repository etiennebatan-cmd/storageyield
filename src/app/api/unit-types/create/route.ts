import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  facility_id: z.string().uuid(),
  name: z.string().min(2),
  size_m2: z.number().positive(),
  current_street_rate_monthly: z.number().nonnegative(),
  description: z.string().nullable().optional()
});

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

  const { error } = await supabase.from("unit_types").insert({
    facility_id: parsed.data.facility_id,
    name: parsed.data.name,
    size_m2: parsed.data.size_m2,
    current_street_rate_monthly: parsed.data.current_street_rate_monthly,
    description: parsed.data.description ?? null
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
