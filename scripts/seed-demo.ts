import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}. Copy .env.example to .env.local and fill it in.`);
    process.exit(1);
  }
  return value;
}

const supabase = createClient(requiredEnv('NEXT_PUBLIC_SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'));

async function run() {
  const { data: user } = await supabase.from("users").insert({ email: "demo@storageyield.app", full_name: "Demo Owner" }).select("id").single();
  const { data: org } = await supabase.from("organizations").insert({ name: "StorageYield Demo Org", owner_user_id: user!.id }).select("id").single();
  await supabase.from("organization_members").insert({ organization_id: org!.id, user_id: user!.id, role: "owner" });
  const { data: facility } = await supabase
    .from("facilities")
    .insert({
      organization_id: org!.id,
      name: "StorageYield Brussels",
      address: "Rue Example 1",
      city: "Brussels",
      country: "Belgium",
      public_slug: "storageyield-brussels",
      currency: "EUR"
    })
    .select("id")
    .single();
  console.log("Seeded organization and facility", org!.id, facility!.id);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
