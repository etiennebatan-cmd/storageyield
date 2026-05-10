"use client";

import { useState } from "react";
import { FileText, Grid3X3, Settings, Zap } from "lucide-react";

const paths = [
  {
    id: "website",
    icon: FileText,
    title: "Ik heb een statische website",
    description: "Geen reserveringssysteem, alleen informatiepagina's.",
    steps: [
      "Voeg hosted booking link toe aan website",
      "Importeer resources handmatig (pilot)",
      "Voeg 3 concurrenten toe voor marktanalyse",
      "Ontvang wekelijkse revenue rapporten",
      "Migreer betalingen/contracten later"
    ],
    effort: "Laag",
    timeline: "2-4 weken"
  },
  {
    id: "excel",
    icon: Grid3X3,
    title: "Ik gebruik Excel/spreadsheets",
    description: "Bezetting en prijzen worden handmatig bijgehouden.",
    steps: [
      "Importeer resources uit CSV (beschikbaar)",
      "Stel concurrenten in voor marktanalyse",
      "Genereer eerste revenue beslissingen",
      "Ontvang dagelijkse bezettingsupdates",
      "Migreer toegang/betalingen gefaseerd"
    ],
    effort: "Gemiddeld",
    timeline: "4-6 weken"
  },
  {
    id: "pms",
    icon: Settings,
    title: "Ik heb al een PMS",
    description: "Bestaand systeem voor bezetting, maar geen revenue intelligence.",
    steps: [
      "Importeer resources uit PMS (CSV)",
      "Voeg concurrent monitoring toe",
      "Start met revenue beslissingen",
      "Houd PMS voor dagelijkse operaties",
      "Migreer gefaseerd naar StorageYield"
    ],
    effort: "Gemiddeld",
    timeline: "6-8 weken"
  },
  {
    id: "unmanned",
    icon: Zap,
    title: "Ik wil onbemand werken",
    description: "Zero-touch move-in workflows en unmanned operations.",
    steps: [
      "Stel booking & lead scoring in",
      "Configureer resource management",
      "Voeg concurrent analyse toe",
      "Stel revenue intelligence in",
      "Migreer toegang/betalingen (roadmap)"
    ],
    effort: "Hoog",
    timeline: "8-12 weken"
  }
];

export function MigrationPathSelector() {
  const [selectedPath, setSelectedPath] = useState(paths[0].id);

  const selectedPathData = paths.find(path => path.id === selectedPath)!;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-slate-950">Hoe past StorageYield bij jouw setup?</h3>
        <p className="mt-2 text-slate-600">Kies je huidige situatie om een migratiepad te zien</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {paths.map((path) => {
          const Icon = path.icon;
          const isSelected = selectedPath === path.id;
          return (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`rounded-xl p-4 text-left transition-all ${
                isSelected
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className={`h-8 w-8 mb-3 ${isSelected ? "text-white" : "text-slate-600"}`} />
              <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-950"}`}>
                {path.title}
              </p>
              <p className={`mt-1 text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                {path.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl bg-slate-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-slate-950">{selectedPathData.title}</h4>
          <div className="flex gap-2">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              Effort: {selectedPathData.effort}
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              Timeline: {selectedPathData.timeline}
            </span>
          </div>
        </div>

        <ol className="space-y-2">
          {selectedPathData.steps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <p className="text-sm text-slate-600">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}