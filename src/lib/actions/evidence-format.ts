import type { ActionEvidence } from "@/types/domain";

export type EvidenceObject = Record<string, unknown>;

const labelOverrides: Record<string, string> = {
  arrears_pct: "Arrears %",
  current_rate: "Current rate",
  current_rent: "Current rent",
  customer_type: "Customer type",
  demand_30d: "Demand last 30d",
  expected_monthly_rent: "Expected monthly rent",
  latest_observed_at: "Last checked",
  linked_signal_titles: "Linked signals",
  monthly_discount_leakage: "Monthly discount leakage",
  move_in_date: "Move-in date",
  own_price: "Our price",
  recommended_rate: "Recommended rate",
  source_signals: "Source signals",
  stale_count: "Stale observations",
  street_rate: "Street rate",
  tenant_start_date: "Tenant start date",
  weighted_competitor_average: "Weighted competitor average"
};

function humanizeKey(key: string) {
  return labelOverrides[key] ?? key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPrimitive(value: string | number | boolean) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "n/a";
    if (Math.abs(value) < 1 && value > 0) return `${Math.round(value * 100)}%`;
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
}

export function formatEvidenceValue(value: unknown): string {
  if (value === null || value === undefined) return "n/a";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return formatPrimitive(value);
  if (Array.isArray(value)) {
    const formatted = value.map(formatEvidenceValue).filter((item) => item && item !== "n/a");
    return formatted.length ? formatted.join(", ") : "n/a";
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return "n/a";
    return entries.map(([key, item]) => `${humanizeKey(key)}: ${formatEvidenceValue(item)}`).join("; ");
  }
  return String(value);
}

export function normalizeEvidence(raw: ActionEvidence): EvidenceObject {
  if (!raw) return {};
  if (Array.isArray(raw)) return { bullets: raw.map(formatEvidenceValue).filter(Boolean) };
  if (typeof raw === "string") return raw.trim() ? { summary: raw.trim() } : {};
  if (typeof raw === "object") return raw as EvidenceObject;
  return { value: formatEvidenceValue(raw) };
}

export function evidenceToSections(raw: ActionEvidence): { label: string; value: string }[] {
  const evidence = normalizeEvidence(raw);
  return Object.entries(evidence)
    .filter(([key]) => key !== "bullets")
    .map(([key, value]) => ({ label: humanizeKey(key), value: formatEvidenceValue(value) }))
    .filter((section) => section.value && section.value !== "n/a");
}

export function evidenceToBullets(raw: ActionEvidence): string[] {
  const evidence = normalizeEvidence(raw);
  const bullets = Array.isArray(evidence.bullets) ? evidence.bullets.map(formatEvidenceValue) : [];
  const summary = typeof evidence.summary === "string" && evidence.summary.trim() ? [evidence.summary.trim()] : [];
  const sections = evidenceToSections(evidence)
    .filter((section) => section.label !== "Summary")
    .map((section) => `${section.label}: ${section.value}`);
  return [...summary, ...bullets, ...sections].filter(Boolean);
}
