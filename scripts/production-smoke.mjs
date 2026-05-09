import { spawn } from "node:child_process";

const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const tables = [
  "organizations",
  "organization_members",
  "facilities",
  "unit_types",
  "units",
  "booking_requests",
  "signals",
  "actions",
  "action_events",
  "competitors",
  "competitor_price_observations"
];

async function checkSupabase() {
  for (const table of tables) {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id&limit=1`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`
      }
    });
    if (res.status === 404) throw new Error(`Missing table or REST resource: ${table}`);
    if (!res.ok && ![401, 403].includes(res.status)) {
      throw new Error(`Supabase table check failed for ${table}: ${res.status} ${await res.text()}`);
    }
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForApp(baseUrl) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/demo`);
      if (res.ok) return;
    } catch {
      // keep waiting
    }
    await wait(500);
  }
  throw new Error("Local app did not become ready within 30s");
}

async function withLocalServer(run) {
  const baseUrl = process.env.STORAGEYIELD_SMOKE_BASE_URL ?? "http://localhost:3000";
  try {
    await fetch(`${baseUrl}/demo`);
    return run(baseUrl, null);
  } catch {
    const child = spawn("npm", ["run", "dev"], {
      cwd: process.cwd(),
      stdio: "ignore",
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }
    });
    try {
      await waitForApp(baseUrl);
      return await run(baseUrl, child);
    } finally {
      child.kill("SIGTERM");
    }
  }
}

async function checkApp(baseUrl) {
  const snapshot = await fetch(`${baseUrl}/api/storageyield/snapshot`);
  if (snapshot.status !== 401) throw new Error(`/api/storageyield/snapshot should return 401 when unauthenticated, got ${snapshot.status}`);

  const demo = await fetch(`${baseUrl}/demo`);
  if (!demo.ok) throw new Error(`/demo failed with ${demo.status}`);

  const widget = await fetch(`${baseUrl}/widget/brussels-north-storage`);
  if (!widget.ok) throw new Error(`/widget/brussels-north-storage failed with ${widget.status}`);
}

await checkSupabase();
await withLocalServer(async (baseUrl) => {
  await checkApp(baseUrl);
});

console.log("Production smoke checks passed.");
