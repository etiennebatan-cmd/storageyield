import { NextResponse } from "next/server";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const unitStatuses = new Set(["available", "occupied", "reserved", "maintenance", "unavailable"]);
const tenantTypes = new Set(["private", "business", "unknown"]);

function parseCsv(content: string) {
  const [head, ...rows] = content.trim().split("\n");
  const headers = head.split(",").map((h) => h.trim());
  return rows.map((line) => {
    const vals = line.split(",").map((v) => v.trim());
    const rec: Record<string, string> = {};
    headers.forEach((h, i) => {
      rec[h] = vals[i] ?? "";
    });
    return rec;
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const facilityId = String(formData.get("facility_id") ?? "");
  const file = formData.get("file");
  if (!facilityId || !(file instanceof File)) return NextResponse.json({ error: "Missing facility_id or file" }, { status: 400 });
  const text = await file.text();
  const rows = parseCsv(text);
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: facility, error: facilityError } = await supabase.from("facilities").select("id,organization_id").eq("id", facilityId).in("organization_id", organizationIds).single();
  if (facilityError || !facility) return NextResponse.json({ error: "Facility access required" }, { status: 403 });

  const { data: unitTypes } = await supabase.from("unit_types").select("id,name,size_m2").eq("facility_id", facilityId);
  const utByName = new Map((unitTypes ?? []).map((u) => [u.name.toLowerCase(), u]));
  const inserts = rows
    .map((r) => {
      const type = utByName.get(r.unit_type_name?.toLowerCase() ?? "");
      if (!type) return null;
      const status = r.status || "available";
      const tenantType = r.tenant_type || "unknown";
      if (!unitStatuses.has(status) || !tenantTypes.has(tenantType)) return null;
      return {
        facility_id: facilityId,
        unit_type_id: type.id,
        unit_code: r.unit_code,
        status,
        current_rent_monthly: r.current_rent_monthly ? Number(r.current_rent_monthly) : null,
        tenant_start_date: r.tenant_start_date || null,
        current_tenant_type: tenantType,
        discount_monthly: r.discount_monthly ? Number(r.discount_monthly) : 0,
        arrears_amount: r.arrears_amount ? Number(r.arrears_amount) : 0
      };
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  if (!inserts.length) return NextResponse.json({ error: "No valid rows to import" }, { status: 400 });
  const { error } = await supabase.from("units").insert(inserts);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, inserted: inserts.length });
}
