"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { Competitor, CompetitorUnitType } from "@/lib/types";
import { useStorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { WorkspaceGate } from "@/components/app-shell/workspace-gate";
import { Badge, Button, Toasts, ageLabel, formatEur } from "@/components/app-shell/shared-ui";

export function MarketRadarWorkspace() {
  const workspace = useStorageYieldWorkspace();
  const [competitorName, setCompetitorName] = useState("");
  const [pricingUrl, setPricingUrl] = useState("");
  const [relationship, setRelationship] = useState<"direct" | "partial" | "benchmark" | "ignored">("direct");
  const [selectedCompetitorId, setSelectedCompetitorId] = useState("");
  const [competitorUnitName, setCompetitorUnitName] = useState("3-4 m² unit");
  const [competitorUnitSize, setCompetitorUnitSize] = useState("3.5");
  const [observationPrice, setObservationPrice] = useState("102");
  const [ownUnitTypeId, setOwnUnitTypeId] = useState("");
  const [competitorUnitTypeId, setCompetitorUnitTypeId] = useState("");

  useEffect(() => {
    setSelectedCompetitorId((current) => current || workspace.snapshot.competitors[0]?.id || "");
    setOwnUnitTypeId((current) => current || workspace.snapshot.unitTypes[0]?.id || "");
    setCompetitorUnitTypeId((current) => current || workspace.snapshot.competitorUnitTypes[0]?.id || "");
  }, [workspace.snapshot.competitors, workspace.snapshot.competitorUnitTypes, workspace.snapshot.unitTypes]);

  const selectedCompetitor = workspace.snapshot.competitors.find((competitor) => competitor.id === selectedCompetitorId);
  const direct = workspace.snapshot.competitors.filter((competitor) => !competitor.notes || competitor.notes.includes("direct"));
  const partial = workspace.snapshot.competitors.filter((competitor) => competitor.notes?.includes("partial"));
  const benchmark = workspace.snapshot.competitors.filter((competitor) => competitor.notes?.includes("benchmark"));
  const ignored = workspace.snapshot.competitors.filter((competitor) => competitor.notes?.includes("ignored"));

  const addCompetitor = () => {
    const facility = workspace.snapshot.facilities[0];
    if (!facility || !competitorName.trim()) {
      workspace.toast("Add a facility and competitor name first");
      return;
    }
    workspace.run(() => workspace.store.addCompetitor({
      facility_id: facility.id,
      name: competitorName.trim(),
      pricing_url: pricingUrl || null,
      website_url: pricingUrl || null,
      city: facility.city,
      notes: `${relationship} competitor`,
      relationship_type: relationship
    }), "Competitor added").then(() => {
      setCompetitorName("");
      setPricingUrl("");
    });
  };

  const addObservation = () => {
    if (!selectedCompetitor) {
      workspace.toast("Choose a competitor first");
      return;
    }
    workspace.run(async () => {
      let unitType: CompetitorUnitType | undefined = workspace.snapshot.competitorUnitTypes.find((item) => item.id === competitorUnitTypeId);
      if (!unitType) {
        unitType = await workspace.store.addCompetitorUnitType({
          competitor_id: selectedCompetitor.id,
          name: competitorUnitName,
          size_m2: Number(competitorUnitSize) || null,
          volume_m3: null,
          access_type: null,
          climate_controlled: null,
          floor: null,
          description: null,
          source_url: selectedCompetitor.pricing_url
        });
      }
      await workspace.store.addCompetitorPriceObservation({
        competitor_id: selectedCompetitor.id,
        competitor_unit_type_id: unitType.id,
        observed_price_monthly: Number(observationPrice),
        currency: "EUR",
        promo_text: "Manual pricing page review",
        availability_text: "Available",
        source_url: selectedCompetitor.pricing_url,
        observed_at: new Date().toISOString(),
        observation_method: "manual"
      });
      await workspace.store.generateSignals();
      await workspace.store.generateActions();
    }, "Price observation added and decisions refreshed");
  };

  const saveMapping = () => {
    const ownUnitType = workspace.snapshot.unitTypes.find((item) => item.id === ownUnitTypeId);
    const competitorUnitType = workspace.snapshot.competitorUnitTypes.find((item) => item.id === competitorUnitTypeId);
    const competitor = workspace.snapshot.competitors.find((item) => item.id === selectedCompetitorId);
    if (!ownUnitType || !competitorUnitType || !competitor) {
      workspace.toast("Choose an own unit type and competitor unit type first");
      return;
    }
    workspace.run(() => workspace.store.mapCompetitorUnitType({
      facility_id: ownUnitType.facility_id,
      own_unit_type_id: ownUnitType.id,
      competitor_id: competitor.id,
      competitor_unit_type_id: competitorUnitType.id,
      comparability_score: 1,
      notes: "Pilot mapping"
    }), "Unit mapping saved");
  };

  return (
    <div className="space-y-7">
      <Toasts items={workspace.toasts} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Competitor intelligence</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">Market Radar</h1>
        <p className="mt-2 max-w-3xl text-lg text-slate-600">Track only selected competitors and decide which market signals count for pricing.</p>
      </div>
      <WorkspaceGate workspace={workspace}>
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-950">Automated competitor checks are not active in MVP.</p>
          <p className="mt-1 text-sm text-slate-600">For pilot workspaces, competitor prices are manually verified from operator-selected pricing URLs.</p>
        </div>
        <section className="grid gap-4 xl:grid-cols-3">
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-slate-950">Add competitor URL</h2>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Competitor name" value={competitorName} onChange={(event) => setCompetitorName(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Pricing URL" value={pricingUrl} onChange={(event) => setPricingUrl(event.target.value)} />
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={relationship} onChange={(event) => setRelationship(event.target.value as typeof relationship)}>
                <option value="direct">Direct competitor</option>
                <option value="partial">Partial competitor</option>
                <option value="benchmark">Benchmark only</option>
                <option value="ignored">Ignore for pricing</option>
              </select>
              <Button onClick={addCompetitor}><Plus className="h-4 w-4" />Add competitor</Button>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-slate-950">Manual price observation</h2>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={selectedCompetitorId} onChange={(event) => setSelectedCompetitorId(event.target.value)}>
                {workspace.snapshot.competitors.map((competitor) => <option key={competitor.id} value={competitor.id}>{competitor.name}</option>)}
              </select>
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Competitor unit type" value={competitorUnitName} onChange={(event) => setCompetitorUnitName(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Size m2" value={competitorUnitSize} onChange={(event) => setCompetitorUnitSize(event.target.value)} />
              <input className="w-full rounded-2xl border border-slate-300 p-3" placeholder="Observed price" type="number" value={observationPrice} onChange={(event) => setObservationPrice(event.target.value)} />
              <Button onClick={addObservation}>Add observation</Button>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-xl font-semibold text-slate-950">Map unit sizes</h2>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={ownUnitTypeId} onChange={(event) => setOwnUnitTypeId(event.target.value)}>
                {workspace.snapshot.unitTypes.map((unitType) => <option key={unitType.id} value={unitType.id}>{unitType.name}</option>)}
              </select>
              <select className="w-full rounded-2xl border border-slate-300 p-3" value={competitorUnitTypeId} onChange={(event) => setCompetitorUnitTypeId(event.target.value)}>
                {workspace.snapshot.competitorUnitTypes.map((unitType) => <option key={unitType.id} value={unitType.id}>{unitType.name}</option>)}
              </select>
              <Button onClick={saveMapping}>Save mapping</Button>
            </div>
          </div>
        </section>
        <section className="grid gap-4 xl:grid-cols-4">
          {[
            ["Direct competitors", direct, "Used in pricing decisions"],
            ["Partial competitors", partial, "Used with lower weight"],
            ["Benchmark only", benchmark, "Displayed, not used"],
            ["Ignored", ignored, "Not used in pricing decisions"]
          ].map(([label, rows, helper]) => (
            <div className="card p-5" key={String(label)}>
              <h2 className="text-xl font-semibold text-slate-950">{String(label)}</h2>
              <p className="mt-1 text-sm text-slate-600">{String(helper)}</p>
              <div className="mt-4 space-y-2">
                {(rows as Competitor[]).map((competitor) => <div className="rounded-2xl border border-slate-200 p-3 font-semibold text-slate-950" key={competitor.id}>{competitor.name}</div>)}
                {!(rows as Competitor[]).length ? <p className="text-sm text-slate-500">None yet.</p> : null}
              </div>
            </div>
          ))}
        </section>
        <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Price observations</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.observations.slice(0, 8).map((observation) => {
                const competitor = workspace.snapshot.competitors.find((item) => item.id === observation.competitor_id);
                return (
                  <div className="rounded-2xl border border-slate-200 p-4" key={observation.id}>
                    <p className="font-semibold text-slate-950">{competitor?.name ?? "Competitor"} · {formatEur(observation.observed_price_monthly)}</p>
                    <p className="mt-1 text-sm text-slate-600">Last checked {ageLabel(observation.observed_at)} ago · {observation.observation_method}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-2xl font-semibold text-slate-950">Our price vs market</h2>
            <div className="mt-4 space-y-3">
              {workspace.snapshot.unitRows.filter((row) => row.market_avg != null).slice(0, 6).map((row) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={row.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{row.facility_name} · {row.name}</p>
                    <Badge tone={(row.gap ?? 0) > 0 ? "green" : "red"}>{(row.gap ?? 0) > 0 ? "below market" : "above market"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Our price {formatEur(row.street_rate)} · market {formatEur(row.market_avg ?? 0)} · gap {row.gap == null ? "n/a" : formatEur(row.gap)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </WorkspaceGate>
    </div>
  );
}
