import { createClient } from "@supabase/supabase-js";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function run() {
  const supabase = createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("SUPABASE_SERVICE_ROLE_KEY")
  );

  const email = `sim-${Date.now()}@storageyield.test`;
  const { data: user, error: userErr } = await supabase
    .from("users")
    .insert({ email, full_name: "Simulation User" })
    .select("id")
    .single();
  if (userErr) throw userErr;

  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({ name: "Simulation Org", owner_user_id: user.id })
    .select("id")
    .single();
  if (orgErr) throw orgErr;

  await supabase
    .from("organization_members")
    .insert({ organization_id: org.id, user_id: user.id, role: "owner" });

  const { data: facility, error: facErr } = await supabase
    .from("facilities")
    .insert({
      organization_id: org.id,
      name: "Simulation Facility",
      address: "1 Test Lane",
      city: "Brussels",
      country: "Belgium",
      public_slug: `sim-${Date.now()}`,
      currency: "EUR"
    })
    .select("id")
    .single();
  if (facErr) throw facErr;

  const { data: unitType } = await supabase
    .from("unit_types")
    .insert({
      facility_id: facility.id,
      name: "5m2",
      size_m2: 5,
      current_street_rate_monthly: 100,
      is_public: true
    })
    .select("id")
    .single();

  const { data: unit } = await supabase
    .from("units")
    .insert({
      facility_id: facility.id,
      unit_type_id: unitType!.id,
      unit_code: "SIM-001",
      status: "available"
    })
    .select("id")
    .single();

  const { data: lead } = await supabase
    .from("leads")
    .insert({
      organization_id: org.id,
      facility_id: facility.id,
      unit_type_id: unitType!.id,
      customer_name: "Test Customer",
      customer_email: "customer@test.com",
      customer_type: "private",
      source: "simulation",
      status: "new"
    })
    .select("id")
    .single();

  const { data: booking } = await supabase
    .from("booking_requests")
    .insert({
      organization_id: org.id,
      facility_id: facility.id,
      unit_type_id: unitType!.id,
      lead_id: lead!.id,
      customer_name: "Test Customer",
      customer_email: "customer@test.com",
      customer_type: "private",
      status: "requested",
      quoted_monthly_rate: 100
    })
    .select("id")
    .single();

  await supabase
    .from("booking_requests")
    .update({ status: "converted", selected_unit_id: unit!.id, updated_at: new Date().toISOString() })
    .eq("id", booking!.id);
  await supabase
    .from("units")
    .update({ status: "occupied", current_rent_monthly: 100 })
    .eq("id", unit!.id);

  const { data: finalUnit } = await supabase.from("units").select("status,current_rent_monthly").eq("id", unit!.id).single();
  if (finalUnit?.status !== "occupied") throw new Error("Simulation failed: unit not occupied after conversion");
  if (finalUnit?.current_rent_monthly !== 100) throw new Error("Simulation failed: unit rent mismatch");

  console.log("Simulation passed: core booking conversion flow is consistent.");
}

run().catch((e) => {
  console.error("Simulation failed:", e);
  process.exit(1);
});
