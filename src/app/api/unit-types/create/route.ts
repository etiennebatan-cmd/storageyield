import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

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
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: facility, error: facilityError } = await supabase
    .from("facilities")
    .select("id,organization_id")
    .eq("id", parsed.data.facility_id)
    .in("organization_id", organizationIds)
    .single();
  if (facilityError || !facility) return NextResponse.json({ error: "Facility access required" }, { status: 403 });

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
