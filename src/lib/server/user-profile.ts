import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function upsertUserProfile(supabase: SupabaseClient, user: User, fullName?: string | null) {
  const email = user.email ?? `${user.id}@storageyield.local`;
  const profileName = fullName ?? (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null);

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email,
        full_name: profileName
      },
      { onConflict: "id" }
    )
    .select("id,email,full_name,created_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getOrganizationIdsForUser(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return (data ?? []).map((membership) => membership.organization_id as string);
}
