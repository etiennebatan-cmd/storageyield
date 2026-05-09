import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const schema = z.object({
  facility_id: z.string().uuid(),
  unit_type_id: z.string().uuid(),
  prefix: z.string().min(1).default("U"),
  start: z.number().int().min(1),
  count: z.number().int().min(1).max(100),
  status: z.enum(["available", "occupied", "reserved", "maintenance", "unavailable"]).default("available")
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

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
    .in("organization_id", organizationIds)
    .single();
  if (facilityError || !facility) return NextResponse.json({ error: "Facility access required" }, { status: 403 });

  const rows = Array.from({ length: parsed.data.count }).map((_, i) => ({
    facility_id: parsed.data.facility_id,
    unit_type_id: parsed.data.unit_type_id,
    unit_code: `${parsed.data.prefix}${parsed.data.start + i}`,
    status: parsed.data.status
  }));
  const { error } = await supabase.from("units").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, inserted: rows.length });
}
