import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { calculateLeadScore, getBookingNextAction } from "../src/lib/bookings/lead-scoring";
import { evidenceToBullets, evidenceToSections } from "../src/lib/actions/evidence-format";
import { generateActionsFromSignals } from "../src/lib/actions/generate-actions";
import { calculateMoneyMap } from "../src/lib/impact/money-map";
import { calculateImpactReport } from "../src/lib/impact/impact-report";
import type { OperatorBooking } from "../src/lib/operator-demo";
import type { GeneratedSignal } from "../src/lib/signals/generate-signals";
import type { Unit, UnitType } from "../src/lib/types";

const now = new Date("2026-05-09T10:00:00.000Z");

const unitTypes: UnitType[] = [
  { id: "ut-3", facility_id: "facility-1", name: "3 m² unit", size_m2: 3, description: null, current_street_rate_monthly: 100 },
  { id: "ut-20", facility_id: "facility-1", name: "20 m² unit", size_m2: 20, description: null, current_street_rate_monthly: 300 }
];

const units: Unit[] = [
  { id: "u1", facility_id: "facility-1", unit_type_id: "ut-3", status: "occupied", current_rent_monthly: 90, tenant_start_date: "2024-01-01", discount_monthly: 5, arrears_amount: 0 },
  { id: "u2", facility_id: "facility-1", unit_type_id: "ut-3", status: "occupied", current_rent_monthly: 100, tenant_start_date: "2024-01-01", discount_monthly: 0, arrears_amount: 10 },
  { id: "u3", facility_id: "facility-1", unit_type_id: "ut-3", status: "available", current_rent_monthly: null, tenant_start_date: null, discount_monthly: 0, arrears_amount: 0 },
  { id: "u4", facility_id: "facility-1", unit_type_id: "ut-20", status: "occupied", current_rent_monthly: 300, tenant_start_date: "2024-01-01", discount_monthly: 0, arrears_amount: 0 }
];

const booking: OperatorBooking = {
  id: "booking-1",
  customer_name: "Pilot Lead",
  customer_phone: "+32470000000",
  customer_type: "business",
  unit_type_id: "ut-3",
  unit_type_name: "3 m² unit",
  facility_id: "facility-1",
  facility_name: "Facility",
  preferred_move_in_date: "2026-05-12",
  quoted_monthly_rate: 100,
  source: "booking widget",
  status: "requested",
  created_at: "2026-05-09T08:00:00.000Z",
  next_action: ""
};

const staleBooking: OperatorBooking = {
  ...booking,
  id: "booking-stale",
  created_at: "2026-05-07T08:00:00.000Z",
  customer_phone: null
};

const moneyMap = calculateMoneyMap({ unitTypes, units, bookings: [staleBooking], now });
assert.equal(moneyMap.vacancyDrag, 35, "vacancy drag must be calculated from available units and street rate");
assert.equal(moneyMap.discountLeakage, 5, "discount leakage must come from occupied unit discounts");
assert.equal(moneyMap.arrearsRisk, 10, "arrears risk must come from unit arrears");
assert.equal(moneyMap.leadFollowUpLoss, 25, "lead follow-up loss must come from aged bookings");
assert.equal(calculateMoneyMap({ unitTypes, units: units.filter((unit) => unit.status !== "available"), bookings: [], now }).vacancyDrag, 0, "no vacant units means no vacancy drag");

assert.deepEqual(evidenceToBullets(["one", "two"]), ["one", "two"], "array evidence must remain readable");
assert.ok(evidenceToSections({ weighted_competitor_average: 110, competitors_considered: ["A", "B"] }).some((section) => section.value.includes("110")), "object evidence must render key-values");
assert.ok(!evidenceToBullets({ nested: { value: 1 } }).join(" ").includes("[object Object]"), "nested evidence must not render [object Object]");

const leadScore = calculateLeadScore(booking, { units, unitTypes }, now);
assert.ok(leadScore.score >= 75, "business urgent booking with phone should score high");
assert.equal(getBookingNextAction(staleBooking, { units, unitTypes }, now), "Mark lost or follow up now; request is older than 24h.");

const signals: GeneratedSignal[] = [
  {
    title: "3 m² demand is high",
    description: "Demand is high",
    category: "high_demand_unit_type",
    severity: "high",
    facility_id: "facility-1",
    unit_type_id: "ut-3",
    evidence: { occupancy: 96, demand_30d: 8, available_units: 1 }
  },
  {
    title: "3 m² is below market",
    description: "Under market",
    category: "under_market_price",
    severity: "high",
    facility_id: "facility-1",
    unit_type_id: "ut-3",
    evidence: { weighted_competitor_average: 108, own_price: 100 }
  }
];
const generatedA = generateActionsFromSignals({ unitTypes, units, bookings: [booking], signals });
const generatedB = generateActionsFromSignals({ unitTypes, units, bookings: [booking], signals });
assert.deepEqual(generatedA.map((action) => action.generation_key), generatedB.map((action) => action.generation_key), "generation keys must be stable");
assert.equal(new Set(generatedA.map((action) => action.generation_key)).size, generatedA.length, "generated actions should not contain duplicate keys");

const impact = calculateImpactReport({
  actions: [
    {
      id: "action-1",
      title: "Raise price",
      description: "Raise price",
      exact_next_step: "Raise price",
      estimated_monthly_uplift: 24,
      confidence: 0.8,
      priority: "high",
      category: "pricing",
      source_signals: ["competitor"],
      evidence: { own_price: 100, recommended_rate: 108 },
      linked_signal_ids: [],
      status: "approved",
      created_at: now.toISOString(),
      completed_at: null,
      unit_type_id: "ut-3"
    }
  ],
  actionEvents: [{ id: "event-1", action_id: "action-1", event_type: "decision_approved", payload: { old_price: 100, new_price: 108 }, created_at: now.toISOString() }],
  bookings: [{ ...booking, status: "converted" }],
  units,
  unitTypes,
  campaigns: []
});
assert.equal(impact.priceChangesApproved.length, 1, "impact report must show approved price changes");
assert.equal(impact.convertedBookings, 1, "impact report must count converted bookings");

const importedOldSignalEngine = globSync("src/**/*.{ts,tsx}")
  .filter((file) => !file.endsWith("src/lib/signals/engine.ts"))
  .some((file) => readFileSync(file, "utf8").includes("signals/engine") || readFileSync(file, "utf8").includes("detectRevenueSignals"));
assert.equal(importedOldSignalEngine, false, "old signal engine must not be imported");

const onboardingForm = readFileSync("src/components/app/onboarding-setup-form.tsx", "utf8");
assert.ok(onboardingForm.includes("/app/data-integrations"), "onboarding should land on setup checklist");
const onboardingRoute = readFileSync("src/app/api/onboarding/setup/route.ts", "utf8");
assert.ok(onboardingRoute.includes(".from(\"unit_types\")") && onboardingRoute.includes(".from(\"units\")"), "onboarding route must create unit types and units when fields are present");

console.log("Pilot blocker checks passed.");
