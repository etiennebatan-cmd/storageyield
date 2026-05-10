"use client";

import { useState } from "react";
import { CreditCard, FileSignature, KeyRound, LineChart, MousePointerClick, Warehouse } from "lucide-react";

const tabs = [
  {
    id: "booking",
    label: "Online verkoop",
    icon: MousePointerClick,
    title: "Hosted booking pages & lead capture",
    description: "Hosted booking pages, website button, iframe, QR-code en Google Business Profile-link. Lead scoring en follow-up automation.",
    status: "Beschikbaar",
    visual: "booking-flow"
  },
  {
    id: "resources",
    label: "Resourcebeheer",
    icon: Warehouse,
    title: "Facility & resource management",
    description: "Units, garageboxen, containers, parking, archive shelves en andere resource types. Real-time availability en pricing.",
    status: "Pilot",
    visual: "resource-grid"
  },
  {
    id: "lifecycle",
    label: "Zero-touch move-in",
    icon: KeyRound,
    title: "Customer journey automation",
    description: "Booking request → Identity → Contract → Payment → Access → Active customer. Operator exception queue voor edge cases.",
    status: "Roadmap",
    visual: "lifecycle-timeline"
  },
  {
    id: "billing",
    label: "Facturatie & betalingen",
    icon: CreditCard,
    title: "Local payment & billing workflows",
    description: "iDEAL, Bancontact, SEPA, VAT logic, structured references en PEPPOL/e-invoicing readiness voor Benelux compliance.",
    status: "Roadmap",
    visual: "billing-workflow"
  },
  {
    id: "access",
    label: "Toegang",
    icon: FileSignature,
    title: "Access control workflows",
    description: "PIN, QR, mobile unlock, gate/smart lock integraties, non-payment suspension en move-out revocation.",
    status: "Roadmap",
    visual: "access-lifecycle"
  },
  {
    id: "intelligence",
    label: "Revenue intelligence",
    icon: LineChart,
    title: "Decision Inbox & revenue optimization",
    description: "Market Radar, Pricing Lab, Decision Inbox, Impact Report en do-not-change recommendations voor systematische revenue growth.",
    status: "Beschikbaar",
    visual: "decision-inbox"
  }
];

export function InteractivePlatformTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeTabData = tabs.find(tab => tab.id === activeTab)!;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-slate-950">Het StorageYield platform</h3>
        <p className="mt-2 text-slate-600">Klik op een module om te zien hoe het werkt</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-xl p-4 text-left transition-all ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-600"}`} />
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-slate-950"}`}>
                      {tab.label}
                    </p>
                    <p className={`text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                      {tab.status}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-slate-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-950">{activeTabData.title}</h4>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              activeTabData.status === "Beschikbaar"
                ? "bg-emerald-100 text-emerald-800"
                : activeTabData.status === "Pilot"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-800"
            }`}>
              {activeTabData.status}
            </span>
          </div>
          <p className="text-slate-600">{activeTabData.description}</p>

          <div className="mt-6 aspect-video rounded-lg bg-slate-200 flex items-center justify-center">
            <p className="text-slate-500">[Product mockup: {activeTabData.visual}]</p>
          </div>
        </div>
      </div>
    </div>
  );
}