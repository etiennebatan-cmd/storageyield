import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  facility_id: z.string().uuid(),
  unit_type_id: z.string().uuid(),
  unit_code: z.string().min(1),
  status: z.enum(["available", "occupied", "reserved", "maintenance", "unavailable"]).default("available")
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: unitType, error: unitTypeError } = await supabase
    .from("unit_types")
    .select("id,facility_id")
    .eq("id", parsed.data.unit_type_id)
    .eq("facility_id", parsed.data.facility_id)
    .single();
  if (unitTypeError || !unitType) return NextResponse.json({ error: "Unit type not found for this facility" }, { status: 404 });
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

  const { error } = await supabase.from("units").insert(parsed.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
