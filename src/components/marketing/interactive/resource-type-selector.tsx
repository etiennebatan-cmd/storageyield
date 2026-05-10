"use client";

import { useState } from "react";
import { Bike, Car, Package, Truck, Warehouse } from "lucide-react";

const resourceTypes = [
  {
    id: "unit",
    name: "Self-storage unit",
    icon: Warehouse,
    description: "Klassieke opslagunits van 1-50 m² voor particulieren en bedrijven.",
    booking: "Online reservering met unit keuze",
    tracking: "Bezetting, prijzen, onderhoud",
    intelligence: "Prijsoptimalisatie, bezettingsvoorspellingen"
  },
  {
    id: "garage",
    name: "Garagebox",
    icon: Car,
    description: "Garageboxen voor auto's, motoren en opslag in woonwijken.",
    booking: "Online reservering met locatie keuze",
    tracking: "Bezetting, prijzen, toegang",
    intelligence: "Concurrentieanalyse, prijsaanbevelingen"
  },
  {
    id: "container",
    name: "Container",
    icon: Truck,
    description: "Verrijdbare containers voor bouw, verhuizingen en seizoensopslag.",
    booking: "Online reservering met termijn keuze",
    tracking: "Locatie, status, onderhoud",
    intelligence: "Vraagvoorspellingen, prijsstrategie"
  },
  {
    id: "parking",
    name: "Parking space",
    icon: Car,
    description: "Parkeerplaatsen voor bewoners, bezoekers en langparkeren.",
    booking: "Online reservering met tijdsblokken",
    tracking: "Bezetting, tarieven, toegang",
    intelligence: "Dynamische prijzen, bezettingsoptimalisatie"
  },
  {
    id: "archive",
    name: "Archive shelf",
    icon: Package,
    description: "Archiefstellingen voor documenten, boeken en bedrijfsarchieven.",
    booking: "Online reservering met shelf keuze",
    tracking: "Bezetting, prijzen, toegang",
    intelligence: "B2B prijsstrategie, bezettingsanalyse"
  },
  {
    id: "bike",
    name: "Bike storage",
    icon: Bike,
    description: "Fietsenstallingen voor bewoners, bedrijven en bezoekers.",
    booking: "Online reservering met termijn keuze",
    tracking: "Bezetting, prijzen, onderhoud",
    intelligence: "Seizoensvraag, prijsoptimalisatie"
  }
];

export function ResourceTypeSelector() {
  const [selectedType, setSelectedType] = useState(resourceTypes[0].id);

  const selectedResource = resourceTypes.find(type => type.id === selectedType)!;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-slate-950">Resource types</h3>
        <p className="mt-2 text-slate-600">Kies een resource type om te zien hoe het werkt</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {resourceTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`rounded-xl p-4 text-center transition-all ${
                isSelected
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className={`mx-auto h-8 w-8 mb-2 ${isSelected ? "text-white" : "text-slate-600"}`} />
              <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-950"}`}>
                {type.name}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl bg-slate-50 p-6">
        <h4 className="text-lg font-semibold text-slate-950">{selectedResource.name}</h4>
        <p className="mt-2 text-slate-600">{selectedResource.description}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Online reservering</p>
            <p className="mt-1 text-sm text-slate-600">{selectedResource.booking}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Resource tracking</p>
            <p className="mt-1 text-sm text-slate-600">{selectedResource.tracking}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Revenue intelligence</p>
            <p className="mt-1 text-sm text-slate-600">{selectedResource.intelligence}</p>
          </div>
        </div>
      </div>
    </div>
  );
}