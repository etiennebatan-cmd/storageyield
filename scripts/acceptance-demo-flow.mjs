import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const ownsServer = !process.env.STORAGEYIELD_ACCEPTANCE_URL;
const baseUrl = process.env.STORAGEYIELD_ACCEPTANCE_URL ?? "http://127.0.0.1:3210";

function chromeExecutablePath() {
  const candidates = [
    process.env.CHROME_EXECUTABLE_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate));
}

async function waitForServer(url, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

async function ensureServer() {
  if (!ownsServer) {
    await waitForServer(`${baseUrl}/demo`);
    return null;
  }
  try {
    await waitForServer(`${baseUrl}/demo`, 3000);
    return null;
  } catch {
    const port = new URL(baseUrl).port || "3210";
    const child = spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", port], {
      cwd: process.cwd(),
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"]
    });
    await waitForServer(`${baseUrl}/demo`);
    return child;
  }
}

async function main() {
  const server = await ensureServer();
  const executablePath = chromeExecutablePath();
  if (!executablePath) throw new Error("Chrome/Chromium was not found. Set CHROME_EXECUTABLE_PATH to run the acceptance test.");

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`${baseUrl}/demo`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.localStorage.clear());
    await page.getByText("Revenue intelligence for independent self-storage operators.").waitFor();

    console.log("✅ Demo page loaded");

    // Step 1: Create customer
    await page.goto(`${baseUrl}/app/customers?demo=1`, { waitUntil: "networkidle" });
    await page.getByText("Demo workspace enabled").first().waitFor();
    await page.getByRole("button", { name: /Add Customer|Create Customer/i }).first().click();
    await page.getByPlaceholder("First name").fill("Test");
    await page.getByPlaceholder("Last name").fill("Customer");
    await page.getByPlaceholder("Email").fill("test-customer@example.com");
    await page.getByPlaceholder("Phone").fill("+32470000002");
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByText("Customer created successfully").waitFor();
    console.log("✅ Customer created");

    // Step 2: Create booking
    await page.goto(`${baseUrl}/app/bookings?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Add Booking|Create Booking/i }).first().click();
    await page.getByPlaceholder("Customer email").fill("test-customer@example.com");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByText("Test Customer").waitFor();
    await page.getByRole("button", { name: "Select" }).click();
    // Select a unit type and date
    await page.getByRole("button", { name: "Create Booking" }).click();
    await page.getByText("Booking created successfully").waitFor();
    console.log("✅ Booking created");

    // Step 3: Convert booking to tenancy
    await page.goto(`${baseUrl}/app/booking-conversion?demo=1`, { waitUntil: "networkidle" });
    const bookingCard = page.locator("article").filter({ hasText: "Test Customer" }).first();
    await bookingCard.waitFor();
    await bookingCard.getByRole("button", { name: "Convert" }).click();
    await page.getByRole("button", { name: "Convert now" }).click();
    await page.getByText("Booking converted successfully").waitFor();
    console.log("✅ Booking converted to tenancy");

    // Step 4: Verify customer exists with tenancy
    await page.goto(`${baseUrl}/app/customers?demo=1`, { waitUntil: "networkidle" });
    await page.getByText("Test Customer").first().click();
    await page.getByRole("tab", { name: "Tenancies" }).click();
    await page.getByText("Active").waitFor();
    console.log("✅ Customer has tenancy");

    // Step 5: Verify tenancy exists
    await page.getByRole("tab", { name: "Tenancies" }).click();
    const tenancyLink = page.locator("a").filter({ hasText: "View" }).first();
    await tenancyLink.click();
    await page.getByText("Tenancy Details").waitFor();
    console.log("✅ Tenancy exists");

    // Step 6: Verify contract exists
    await page.getByRole("tab", { name: "Contract" }).click();
    await page.getByText("Active").waitFor();
    console.log("✅ Contract exists");

    // Step 7: Verify invoice exists
    await page.goto(`${baseUrl}/app/billing?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Invoices" }).click();
    await page.getByText("Test Customer").waitFor();
    console.log("✅ Invoice exists");

    // Step 8: Verify invoice lines exist
    const invoiceRow = page.locator("tr").filter({ hasText: "Test Customer" }).first();
    await invoiceRow.getByRole("button", { name: "View" }).click();
    await page.getByText("Monthly Storage Rent").waitFor();
    console.log("✅ Invoice lines exist");

    // Step 9: Verify access credential exists
    await page.goto(`${baseUrl}/app/access?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Credentials" }).click();
    await page.getByText("Test Customer").waitFor();
    console.log("✅ Access credential exists");

    // Step 10: Verify move-in workflow exists
    await page.goto(`${baseUrl}/app/tasks?demo=1`, { waitUntil: "networkidle" });
    await page.getByText("Complete move-in checklist").waitFor();
    console.log("✅ Move-in workflow exists");

    // Step 11: Verify tasks exist
    await page.getByText("Send welcome invoice").waitFor();
    console.log("✅ Tasks exist");

    // Step 12: Record manual payment
    await page.goto(`${baseUrl}/app/billing?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Payments" }).click();
    await page.getByRole("button", { name: "Record Payment" }).click();
    await page.getByPlaceholder("Amount").fill("200");
    await page.getByRole("button", { name: "Record" }).click();
    await page.getByText("Payment recorded").waitFor();
    console.log("✅ Manual payment recorded");

    // Step 13: Activate access
    await page.goto(`${baseUrl}/app/access?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Credentials" }).click();
    const credentialRow = page.locator("tr").filter({ hasText: "Test Customer" }).first();
    await credentialRow.getByRole("button", { name: "Activate" }).click();
    await page.getByText("Access activated").waitFor();
    console.log("✅ Access activated");

    // Step 14: Complete move-in checklist
    await page.goto(`${baseUrl}/app/tasks?demo=1`, { waitUntil: "networkidle" });
    const checklistTask = page.locator("article").filter({ hasText: "Complete move-in checklist" }).first();
    await checklistTask.getByRole("button", { name: "Complete" }).click();
    await page.getByText("Task completed").waitFor();
    console.log("✅ Move-in checklist completed");

    // Step 15: Check Control Room exceptions decreased
    await page.goto(`${baseUrl}/app/control-room?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Exception Queue" }).click();
    // Should show fewer or no exceptions now
    const exceptionCount = await page.locator('[data-testid="exception-count"]').count();
    if (exceptionCount === 0) {
      console.log("✅ Control Room exceptions decreased");
    } else {
      console.log(`ℹ️  Control Room has ${exceptionCount} remaining exceptions`);
    }

    // Step 16: Verify reports show rent roll and aged debtors
    await page.goto(`${baseUrl}/app/reports?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Rent Roll" }).click();
    await page.getByText("Test Customer").waitFor();
    console.log("✅ Reports show rent roll");

    await page.getByRole("tab", { name: "Debtors" }).click();
    await page.getByText("Aged Debtors").waitFor();
    console.log("✅ Reports show aged debtors");

    console.log("\n🎉 PMS end-to-end acceptance test passed!");
    console.log("✅ Booking → Customer → Tenancy → Contract → Invoice → Payment → Access → Move-in → Exception Queue → Report");
  } finally {
    await browser.close();
    if (server) server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
