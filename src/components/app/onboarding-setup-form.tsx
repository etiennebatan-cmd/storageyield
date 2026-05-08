"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { updateDemoState } from "@/lib/demo-state";

const steps = [
  {
    title: "Create organization",
    copy: "Name the operating company that owns this workspace.",
    fields: [["organization_name", "Organization name", "Brussels Storage Group"]]
  },
  {
    title: "Add facility",
    copy: "Start with one site. More facilities can be added later.",
    fields: [["facility_name", "Facility name", "Brussels North Storage"], ["address", "Address", "Canal District 12"], ["city", "City", "Brussels"], ["country", "Country", "Belgium"], ["public_slug", "Public widget slug", "brussels-north-storage"]]
  },
  {
    title: "Add unit types",
    copy: "Define the unit sizes operators can book and price.",
    fields: [["unit_types", "Unit types", "1, 3, 5, 10, 20 m²"]]
  },
  {
    title: "Add units and prices",
    copy: "Add inventory counts and street rates so pricing signals can run.",
    fields: [["unit_prices", "Example pricing", "1m² €42, 3m² €92, 5m² €118"]]
  },
  {
    title: "Add competitors",
    copy: "Only track competitors the operator chooses.",
    fields: [["competitors", "Competitor URLs", "BoxPlus Brussels, CityStorage North"]]
  },
  {
    title: "Install booking widget",
    copy: "Capture live demand from the website.",
    fields: [["widget_url", "Widget URL", "/widget/brussels-north-storage"]]
  },
  {
    title: "Submit test booking",
    copy: "Confirm demand appears in the booking pipeline.",
    fields: [["test_customer", "Test customer", "Maya Peeters"]]
  },
  {
    title: "Review first revenue decision",
    copy: "Open the Decision Inbox and approve the first recommended decision.",
    fields: []
  }
];

export function OnboardingSetupForm({ demoMode = false }: { demoMode?: boolean }) {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    organization_name: "",
    facility_name: "",
    address: "",
    city: "",
    country: "Belgium",
    public_slug: "brussels-north-storage",
    unit_types: "1, 3, 5, 10, 20 m²",
    unit_prices: "1m² €42, 3m² €92, 5m² €118",
    competitors: "BoxPlus Brussels, CityStorage North",
    widget_url: "/widget/brussels-north-storage",
    test_customer: "Maya Peeters"
  });
  const step = steps[index];
  const progress = Math.round(((index + 1) / steps.length) * 100);

  const submit = async () => {
    setMessage("");
    if (demoMode) {
      updateDemoState((current) => ({
        ...current,
        widgetInstalled: true,
        onboardingSteps: Object.fromEntries(steps.map((item) => [item.title, true])),
        activity: [{ id: `activity-${Date.now()}`, title: "Onboarding completed", description: "Demo workspace setup is complete.", type: "system", created_at: new Date().toISOString() }, ...current.activity]
      }));
      setMessage("Demo onboarding complete. Decision Inbox is ready.");
      return;
    }

    const res = await fetch("/api/onboarding/setup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        organization_name: form.organization_name,
        facility_name: form.facility_name,
        address: form.address,
        city: form.city,
        country: form.country,
        public_slug: form.public_slug
      })
    });
    const data = await res.json();
    setMessage(res.ok ? `Setup complete. Facility ID: ${data.facility_id}` : data.error || "Setup failed");
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
          {step.fields.map(([key, label, placeholder]) => (
            <label className="block" key={key}>
              <span className="text-sm font-semibold text-slate-700">{label}</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: key === "public_slug" ? event.target.value.toLowerCase() : event.target.value }))}
              />
            </label>
          ))}
          {!step.fields.length ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
              First action ready: raise Brussels 3 m² new-customer price from €92 to €98.
            </div>
          ) : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {index > 0 ? <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900" onClick={() => setIndex((current) => current - 1)} type="button">Back</button> : null}
          {index < steps.length - 1 ? (
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" onClick={() => setIndex((current) => current + 1)} type="button">Next step</button>
          ) : (
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" onClick={submit} type="button">Finish setup</button>
          )}
          <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900" href="/app">Open Decision Inbox</Link>
        </div>
        {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      </section>
    </div>
  );
}
