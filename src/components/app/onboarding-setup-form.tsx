"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { updateDemoState } from "@/lib/demo-state";

const steps = [
  { title: "Create organization", copy: "Name the operating company that owns this workspace." },
  { title: "Add facility", copy: "Start with one site. More facilities can be added later." },
  { title: "Add unit types", copy: "Add the unit sizes and street rates that drive pricing decisions." },
  { title: "Add units", copy: "Bulk-create the starting inventory for each unit type." },
  { title: "Add competitors", copy: "Track only the competitors the operator chooses." },
  { title: "Finish setup", copy: "Create real setup records, then review the setup checklist before first decisions." }
];

const defaultUnitTypes = [
  { client_id: "ut-1", name: "1 m² locker", size_m2: 1, current_street_rate_monthly: 42, description: "Small locker" },
  { client_id: "ut-3", name: "3 m² unit", size_m2: 3, current_street_rate_monthly: 92, description: "Small household storage" },
  { client_id: "ut-5", name: "5 m² unit", size_m2: 5, current_street_rate_monthly: 118, description: "Apartment overflow" },
  { client_id: "ut-10", name: "10 m² unit", size_m2: 10, current_street_rate_monthly: 185, description: "Large private storage" },
  { client_id: "ut-20", name: "20 m² unit", size_m2: 20, current_street_rate_monthly: 320, description: "Business storage" }
];

const defaultUnitBatches = [
  { client_unit_type_id: "ut-1", count: 12, prefix: "BRU-1M", status: "available" },
  { client_unit_type_id: "ut-3", count: 18, prefix: "BRU-3M", status: "available" },
  { client_unit_type_id: "ut-5", count: 16, prefix: "BRU-5M", status: "available" },
  { client_unit_type_id: "ut-10", count: 10, prefix: "BRU-10M", status: "available" },
  { client_unit_type_id: "ut-20", count: 6, prefix: "BRU-20M", status: "available" }
] as const;

const defaultCompetitors = [
  { name: "BoxPlus Brussels", pricing_url: "https://example.com/boxplus-brussels/prices", relationship_type: "direct" },
  { name: "CityStorage North", pricing_url: "https://example.com/citystorage-north/rates", relationship_type: "direct" }
] as const;

type UnitTypeInput = (typeof defaultUnitTypes)[number];
type UnitBatchInput = { client_unit_type_id: string; count: number; prefix: string; status: string };
type CompetitorInput = { name: string; pricing_url: string; relationship_type: string };

export function OnboardingSetupForm({ demoMode = false }: { demoMode?: boolean }) {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [facility, setFacility] = useState({
    facility_name: "",
    address: "",
    city: "",
    country: "Belgium",
    public_slug: "brussels-north-storage"
  });
  const [unitTypes, setUnitTypes] = useState<UnitTypeInput[]>(defaultUnitTypes);
  const [unitBatches, setUnitBatches] = useState<UnitBatchInput[]>(defaultUnitBatches.map((item) => ({ ...item })));
  const [competitors, setCompetitors] = useState<CompetitorInput[]>(defaultCompetitors.map((item) => ({ ...item })));
  const router = useRouter();

  const step = steps[index];
  const progress = Math.round(((index + 1) / steps.length) * 100);
  const unitTypeByClientId = useMemo(() => new Map(unitTypes.map((unitType) => [unitType.client_id, unitType])), [unitTypes]);

  const submit = async () => {
    setMessage("");
    setSubmitting(true);
    if (demoMode) {
      updateDemoState((current) => ({
        ...current,
        widgetInstalled: true,
        onboardingSteps: Object.fromEntries(steps.map((item) => [item.title, true])),
        activity: [{ id: `activity-${Date.now()}`, title: "Onboarding completed", description: "Demo workspace setup is complete.", type: "system", created_at: new Date().toISOString() }, ...current.activity]
      }));
      setMessage("Demo onboarding complete. Opening setup checklist.");
      setSubmitting(false);
      router.push("/app/data-integrations?demo=1");
      return;
    }

    try {
      const res = await fetch("/api/onboarding/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          organization_name: organizationName,
          ...facility,
          unit_types: unitTypes,
          unit_batches: unitBatches,
          competitors
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(typeof data.error === "string" ? data.error : "Setup failed");
        return;
      }
      setMessage("Workspace created. Next: review unit, competitor and widget setup.");
      router.refresh();
      router.replace("/app/data-integrations");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Setup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="card p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Setup path</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-600">{progress}% complete</p>
        <div className="mt-6 space-y-2">
          {steps.map((item, stepIndex) => (
            <button
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${stepIndex === index ? "bg-slate-950 text-white" : stepIndex < index ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-700 hover:bg-slate-50"}`}
              key={item.title}
              onClick={() => setIndex(stepIndex)}
              type="button"
            >
              {item.title}
              {stepIndex < index ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </aside>

      <section className="card p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Step {index + 1} of {steps.length}</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{step.title}</h2>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">{step.copy}</p>

        <div className="mt-7 grid gap-4">
          {index === 0 ? (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Organization name</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Brussels Storage Group" value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} />
            </label>
          ) : null}

          {index === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["facility_name", "Facility name", "Brussels North Storage"],
                ["address", "Address", "Canal District 12"],
                ["city", "City", "Brussels"],
                ["country", "Country", "Belgium"],
                ["public_slug", "Public widget slug", "brussels-north-storage"]
              ].map(([key, label, placeholder]) => (
                <label className="block" key={key}>
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                    placeholder={placeholder}
                    value={facility[key as keyof typeof facility]}
                    onChange={(event) => setFacility((current) => ({ ...current, [key]: key === "public_slug" ? event.target.value.toLowerCase() : event.target.value }))}
                  />
                </label>
              ))}
            </div>
          ) : null}

          {index === 2 ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              {unitTypes.map((unitType, rowIndex) => (
                <div className="grid gap-3 border-b border-slate-100 p-3 last:border-b-0 md:grid-cols-[1fr_110px_150px]" key={unitType.client_id}>
                  <input className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" value={unitType.name} onChange={(event) => setUnitTypes((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, name: event.target.value } : row)))} />
                  <input className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" type="number" value={unitType.size_m2} onChange={(event) => setUnitTypes((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, size_m2: Number(event.target.value) } : row)))} />
                  <input className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" type="number" value={unitType.current_street_rate_monthly} onChange={(event) => setUnitTypes((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, current_street_rate_monthly: Number(event.target.value) } : row)))} />
                </div>
              ))}
            </div>
          ) : null}

          {index === 3 ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              {unitBatches.map((batch, rowIndex) => (
                <div className="grid items-center gap-3 border-b border-slate-100 p-3 last:border-b-0 md:grid-cols-[1fr_120px_160px]" key={batch.client_unit_type_id}>
                  <div className="text-sm font-semibold text-slate-900">{unitTypeByClientId.get(batch.client_unit_type_id)?.name ?? "Unit type"}</div>
                  <input className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" min={0} type="number" value={batch.count} onChange={(event) => setUnitBatches((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, count: Number(event.target.value) } : row)))} />
                  <input className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" value={batch.prefix} onChange={(event) => setUnitBatches((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, prefix: event.target.value } : row)))} />
                </div>
              ))}
            </div>
          ) : null}

          {index === 4 ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              {competitors.map((competitor, rowIndex) => (
                <div className="grid gap-3 border-b border-slate-100 p-3 last:border-b-0 md:grid-cols-[1fr_1.5fr_150px]" key={rowIndex}>
                  <input className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" placeholder="Competitor name" value={competitor.name} onChange={(event) => setCompetitors((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, name: event.target.value } : row)))} />
                  <input className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" placeholder="Pricing URL" value={competitor.pricing_url} onChange={(event) => setCompetitors((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, pricing_url: event.target.value } : row)))} />
                  <select className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" value={competitor.relationship_type} onChange={(event) => setCompetitors((rows) => rows.map((row, i) => (i === rowIndex ? { ...row, relationship_type: event.target.value } : row)))}>
                    <option value="direct">Direct</option>
                    <option value="partial">Partial</option>
                    <option value="benchmark">Benchmark</option>
                    <option value="ignored">Ignored</option>
                  </select>
                </div>
              ))}
            </div>
          ) : null}

          {index === 5 ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
              Setup will create real records: 1 organization, 1 facility, {unitTypes.length} unit types, {unitBatches.reduce((sum, batch) => sum + batch.count, 0)} units and {competitors.filter((competitor) => competitor.name.trim()).length} tracked competitors. You will land on the setup checklist next.
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {index > 0 ? <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900" onClick={() => setIndex((current) => current - 1)} type="button">Back</button> : null}
          {index < steps.length - 1 ? (
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" onClick={() => setIndex((current) => current + 1)} type="button">Next step</button>
          ) : (
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={submitting} onClick={submit} type="button">
              {submitting ? "Creating workspace..." : "Finish setup"}
            </button>
          )}
          <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900" href={demoMode ? "/app/data-integrations?demo=1" : "/app/data-integrations"}>Open setup checklist</Link>
        </div>
        {message ? <p className={`mt-4 text-sm font-semibold ${message.includes("complete") ? "text-emerald-700" : "text-red-600"}`}>{message}</p> : null}
      </section>
    </div>
  );
}
