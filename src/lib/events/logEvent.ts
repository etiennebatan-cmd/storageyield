import { createClient } from "@/lib/supabase/server";

interface EventInput {
  organization_id: string;
  facility_id?: string | null;
  entity_type: string;
  entity_id?: string | null;
  event_type: string;
  payload: Record<string, unknown>;
}

export async function logEvent(input: EventInput) {
  const supabase = createClient();
  await supabase.from("events").insert(input);
}
