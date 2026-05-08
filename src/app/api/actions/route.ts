import { NextResponse } from "next/server";
import { requireOrganizationAccess } from "@/lib/server/org-access";

export async function GET(request: Request) {
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;

  const { searchParams } = new URL(request.url);
  let query = access.supabase.from("actions").select("*").in("organization_id", access.organizationIds).order("created_at", { ascending: false });
  const status = searchParams.get("status");
  const facilityId = searchParams.get("facility_id");
  if (status) query = query.eq("status", status);
  if (facilityId) query = query.eq("facility_id", facilityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ actions: data ?? [] });
}
