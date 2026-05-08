import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

type OrgAccess = {
  supabase: ReturnType<typeof createClient>;
  user: User;
  organizationIds: string[];
};

type AccessError = {
  error: NextResponse;
};

export type ActionRow = {
  id: string;
  organization_id: string;
  facility_id: string | null;
  unit_type_id: string | null;
  category: string;
  proposed_change: Record<string, unknown> | null;
  evidence: Record<string, unknown> | null;
};

export async function requireOrganizationAccess(organizationId?: string): Promise<OrgAccess | AccessError> {
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  }

  let query = supabase.from("organization_members").select("organization_id").eq("user_id", userData.user.id);
  if (organizationId) query = query.eq("organization_id", organizationId);
  const { data, error } = await query;
  if (error) return { error: NextResponse.json({ error: error.message }, { status: 500 }) };
  const organizationIds = (data ?? []).map((membership) => membership.organization_id as string);
  if (!organizationIds.length) return { error: NextResponse.json({ error: "Organization access required" }, { status: 403 }) };

  return { supabase, user: userData.user, organizationIds };
}

export async function requireActionAccess(actionId: string): Promise<(OrgAccess & { action: ActionRow }) | AccessError> {
  const access = await requireOrganizationAccess();
  if ("error" in access) return access;

  const { data: action, error } = await access.supabase
    .from("actions")
    .select("*")
    .eq("id", actionId)
    .in("organization_id", access.organizationIds)
    .single();
  if (error || !action) return { error: NextResponse.json({ error: "Decision not found" }, { status: 404 }) };

  return { ...access, action: action as ActionRow };
}
