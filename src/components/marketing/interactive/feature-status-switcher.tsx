"use client";

import { useState } from "react";

const features = {
  beschikbaar: [
    "Hosted booking pages & lead capture",
    "Website button, iframe & QR-code integratie",
    "Google Business Profile booking link",
    "Lead scoring & follow-up automation",
    "Facility & unit setup",
    "Manual competitor price observations",
    "Market Radar & competitor analysis",
    "Decision Inbox & revenue recommendations",
    "Pricing Lab & price optimization",
    "Impact Report & decision tracking",
    "Data Health setup checklist",
    "Weekly revenue reports",
    "CSV import voor resources & prijzen"
  ],
  pilot: [
    "Handmatige resource setup ondersteuning",
    "Concierge onboarding voor eerste klanten",
    "Manual competitor setup hulp",
    "Wekelijkse revenue audit rapporten",
    "Manual price observation tracking",
    "Operator data review & validatie",
    "Pilot revenue report generatie",
    "Handmatige setup voor complexe gevallen"
  ],
  roadmap: [
    "iDEAL, Bancontact & SEPA integraties",
    "Recurring billing & automated invoicing",
    "PEPPOL/e-invoicing voor B2B",
    "itsme & ID verificatie integraties",
    "Onfido/Veriff identity providers",
    "Digital contract signing",
    "Jurisdiction-specific contract logic",
    "Access-control integraties (PIN/QR/mobile)",
    "Smart locks & gate integraties",
    "Customer portal & tenant mobile app",
    "Full PMS replacement capabilities",
    "Accounting system integraties",
    "API ecosystem & developer tools",
    "AI copilot voor revenue beslissingen",
    "Multi-site roll-up reporting",
    "Advanced resource management"
  ]
};

export function FeatureStatusSwitcher() {
  const [activeTab, setActiveTab] = useState<"beschikbaar" | "pilot" | "roadmap">("beschikbaar");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-slate-950">Wat is vandaag beschikbaar?</h3>
        <p className="mt-2 text-slate-600">En wat staat op de roadmap voor volledige automatisering</p>
      </div>

      <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
        {[
          { id: "beschikbaar", label: "Beschikbaar", count: features.beschikbaar.length },
          { id: "pilot", label: "Pilot", count: features.pilot.length },
          { id: "roadmap", label: "Roadmap", count: features.roadmap.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {features[activeTab].map((feature, index) => (
          <div key={index} className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
            <div className={`mt-0.5 h-2 w-2 rounded-full ${
              activeTab === "beschikbaar"
                ? "bg-emerald-500"
                : activeTab === "pilot"
                ? "bg-amber-500"
                : "bg-slate-400"
            }`} />
            <p className="text-sm text-slate-700">{feature}</p>
          </div>
        ))}
      </div>

      {activeTab === "roadmap" && (
        <p className="mt-6 text-xs text-slate-500">
          Roadmap features zijn gepland maar niet gegarandeerd. Prioriteit hangt af van klantbehoeften en marktontwikkelingen.
        </p>
      )}
    </div>
  );
}