"use client";

import { useState } from "react";

export function RevenueLeakageCalculator() {
  const [inputs, setInputs] = useState({
    units: 100,
    averagePrice: 80,
    vacantUnits: 20,
    missedLeads: 5,
    discountPerUnit: 5
  });

  const vacancyDrag = inputs.vacantUnits * inputs.averagePrice * 0.35;
  const leadLoss = inputs.missedLeads * inputs.averagePrice * 0.25;
  const discountLeakage = inputs.units * inputs.discountPerUnit;
  const totalMonthly = vacancyDrag + leadLoss + discountLeakage;
  const annual = totalMonthly * 12;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-slate-950">Revenue opportunity calculator</h3>
        <p className="mt-2 text-slate-600">Bereken je maandelijkse revenue opportunity</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Aantal units</label>
            <input
              type="number"
              value={inputs.units}
              onChange={(e) => setInputs(prev => ({ ...prev, units: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Gemiddelde maandprijs (€)</label>
            <input
              type="number"
              value={inputs.averagePrice}
              onChange={(e) => setInputs(prev => ({ ...prev, averagePrice: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Lege units</label>
            <input
              type="number"
              value={inputs.vacantUnits}
              onChange={(e) => setInputs(prev => ({ ...prev, vacantUnits: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Gemiste leads per maand</label>
            <input
              type="number"
              value={inputs.missedLeads}
              onChange={(e) => setInputs(prev => ({ ...prev, missedLeads: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Gemiddelde korting per unit (€)</label>
            <input
              type="number"
              value={inputs.discountPerUnit}
              onChange={(e) => setInputs(prev => ({ ...prev, discountPerUnit: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Vacancy drag</p>
            <p className="text-2xl font-semibold text-slate-950">€{vacancyDrag.toFixed(0)}/mo</p>
            <p className="text-xs text-slate-500">Conservatieve fill probability</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Lead follow-up verlies</p>
            <p className="text-2xl font-semibold text-slate-950">€{leadLoss.toFixed(0)}/mo</p>
            <p className="text-xs text-slate-500">Gemiste conversies</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Korting lekkage</p>
            <p className="text-2xl font-semibold text-slate-950">€{discountLeakage.toFixed(0)}/mo</p>
            <p className="text-xs text-slate-500">Concessies op bezette units</p>
          </div>

          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Totale maandelijkse opportunity</p>
            <p className="text-3xl font-semibold text-emerald-900">€{totalMonthly.toFixed(0)}/mo</p>
            <p className="text-sm text-emerald-600">€{annual.toFixed(0)}/jaar</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Indicatieve berekening. Geen garantie. Werkelijke impact hangt af van bezetting, contracten en conversie.
      </p>
    </div>
  );
}