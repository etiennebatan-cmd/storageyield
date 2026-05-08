import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type OnboardingResult = {
  organization_id: string;
  facility_id: string;
};

const schema = z.object({
  organization_name: z.string().min(2),
  facility_name: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  public_slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only")
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data, error } = await supabase
    .rpc("setup_operator_onboarding", {
      p_organization_name: parsed.data.organization_name,
      p_facility_name: parsed.data.facility_name,
      p_address: parsed.data.address,
      p_city: parsed.data.city,
      p_country: parsed.data.country,
      p_public_slug: parsed.data.public_slug
    })
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === "23505" ? 409 : 500 });
  const result = data as OnboardingResult | null;
  if (!result) return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  return NextResponse.json({ ok: true, organization_id: result.organization_id, facility_id: result.facility_id });
}
