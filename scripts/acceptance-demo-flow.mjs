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

    await page.goto(`${baseUrl}/widget/brussels-north-storage`, { waitUntil: "networkidle" });
    await page.getByPlaceholder("Full name").fill("Acceptance Test Booker");
    await page.getByPlaceholder("Email").fill("acceptance@example.com");
    await page.getByPlaceholder("Phone (optional)").fill("+32470000000");
    await page.getByRole("button", { name: "Submit booking request" }).click();
    await page.getByText("Thanks. The facility will contact you shortly").waitFor();

    await page.goto(`${baseUrl}/app/booking-conversion?demo=1`, { waitUntil: "networkidle" });
    await page.getByText("Demo workspace enabled").first().waitFor();
    const bookingCard = page.locator("article").filter({ hasText: "Acceptance Test Booker" }).first();
    await bookingCard.waitFor();
    await bookingCard.getByRole("button", { name: "Assign unit" }).click();
    await page.getByRole("button", { name: "Convert now" }).click();
    await page.getByText("Booking converted and unit occupied").waitFor();

    await page.goto(`${baseUrl}/app/decisions?demo=1`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Generate decisions" }).click();
    await page.getByText("Signals and decisions regenerated").waitFor();
    const pricingDecision = page.locator("article").filter({ hasText: /Raise .*3 m²/i }).first();
    await pricingDecision.waitFor();
    await pricingDecision.getByRole("button", { name: "Approve" }).click();
    await page.getByText("Pricing decision approved and price updated").waitFor();

    await page.goto(`${baseUrl}/app/pricing-lab?demo=1`, { waitUntil: "networkidle" });
    await page.getByText("€98").first().waitFor();

    await page.goto(`${baseUrl}/app/impact-report?demo=1`, { waitUntil: "networkidle" });
    await page.getByText("Raise Brussels 3 m²").waitFor();
    await page.getByText("Bookings converted").waitFor();

    console.log("Acceptance demo flow passed.");
  } finally {
    await browser.close();
    if (server) server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
