"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CompetitorRelationshipType } from "@/lib/types";

const relationshipWeights: Record<CompetitorRelationshipType, number> = {
  direct: 1,
  partial: 0.5,
  benchmark: 0,
  ignored: 0
};

export interface FacilityOption {
  id: string;
  name: string;
}

export interface UnitTypeOption {
  id: string;
  name: string;
  size_m2?: number | null;
}

export interface CompetitorUnitTypeOption {
  id: string;
  name: string;
  size_m2?: number | null;
}

function FormMessage({ message }: { message: string }) {
  return message ? <p className="text-xs text-slate-600">{message}</p> : null;
}

export function AddCompetitorForm({ facilities, demoMode = false }: { facilities: FacilityOption[]; demoMode?: boolean }) {
  const router = useRouter();
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? "");
  const [relationship, setRelationship] = useState<CompetitorRelationshipType>("direct");
  const [weight, setWeight] = useState("1");
  const [message, setMessage] = useState("");

  const onRelationshipChange = (value: CompetitorRelationshipType) => {
    setRelationship(value);
    setWeight(String(relationshipWeights[value]));
  };

  return (
    <form
      className="panel space-y-4 p-5 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setMessage("Saving...");
        const form = new FormData(event.currentTarget);
        if (demoMode) {
          setMessage(`${form.get("name")} added to this demo session. Use the tracked competitors list to continue reviewing market evidence.`);
          event.currentTarget.reset();
          return;
        }
        const res = await fetch("/api/competitors/create", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            facility_id: facilityId,
            name: form.get("name"),
            website_url: form.get("website_url"),
            pricing_url: form.get("pricing_url"),
            city: form.get("city"),
            address: form.get("address"),
            notes: form.get("notes"),
            relationship_type: relationship,
            influence_weight: Number(weight),
            distance_km: form.get("distance_km") ? Number(form.get("distance_km")) : null,
            relationship_notes: form.get("relationship_notes")
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.error?.message ?? data.error ?? "Could not add competitor");
          return;
        }
        router.push(`/app/competitors/${data.competitor_id}`);
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="block font-medium">Competitor name</span>
          <input className="w-full rounded border px-3 py-2" name="name" required />
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Assign to facility</span>
          <select className="w-full rounded border px-3 py-2" value={facilityId} onChange={(event) => setFacilityId(event.target.value)}>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>{facility.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Website URL</span>
          <input className="w-full rounded border px-3 py-2" name="website_url" placeholder="https://..." />
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Pricing URL</span>
          <input className="w-full rounded border px-3 py-2" name="pricing_url" placeholder="https://..." />
        </label>
        <label className="space-y-1">
          <span className="block font-medium">City</span>
          <input className="w-full rounded border px-3 py-2" name="city" />
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Address</span>
          <input className="w-full rounded border px-3 py-2" name="address" />
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Relationship type</span>
          <select className="w-full rounded border px-3 py-2" value={relationship} onChange={(event) => onRelationshipChange(event.target.value as CompetitorRelationshipType)}>
            <option value="direct">Direct competitor</option>
            <option value="partial">Partial competitor</option>
            <option value="benchmark">Benchmark only</option>
            <option value="ignored">Ignore for pricing</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Influence weight</span>
          <input className="w-full rounded border px-3 py-2" min="0" max="1" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} type="number" />
        </label>
        <label className="space-y-1">
          <span className="block font-medium">Distance km</span>
          <input className="w-full rounded border px-3 py-2" name="distance_km" min="0" step="0.1" type="number" />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="block font-medium">Notes</span>
        <textarea className="min-h-24 w-full rounded border px-3 py-2" name="notes" />
      </label>
      <label className="block space-y-1">
        <span className="block font-medium">Relationship notes</span>
        <textarea className="min-h-20 w-full rounded border px-3 py-2" name="relationship_notes" />
      </label>
      <div className="flex items-center gap-3">
        <button className="rounded bg-slate-900 px-4 py-2 font-medium text-white" type="submit">Add competitor</button>
        <FormMessage message={message} />
      </div>
    </form>
  );
}

export function CompetitorStatusButton({ competitorId, status }: { competitorId: string; status: "active" | "inactive" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const nextStatus = status === "active" ? "inactive" : "active";
  return (
    <div className="space-y-1">
      <button
        className="rounded border border-slate-300 px-3 py-2 text-sm font-medium"
        type="button"
        onClick={async () => {
          setMessage("Saving...");
          const res = await fetch("/api/competitors/update", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ competitor_id: competitorId, status: nextStatus })
          });
          setMessage(res.ok ? "Saved" : "Update failed");
          router.refresh();
        }}
      >
        Mark {nextStatus}
      </button>
      <FormMessage message={message} />
    </div>
  );
}

export function RelationshipForm(props: {
  competitorId: string;
  facilityId: string;
  relationshipType: CompetitorRelationshipType;
  influenceWeight: number;
  distanceKm: number | null;
  notes: string | null;
}) {
  const router = useRouter();
  const [relationship, setRelationship] = useState<CompetitorRelationshipType>(props.relationshipType);
  const [weight, setWeight] = useState(String(props.influenceWeight));
  const [message, setMessage] = useState("");

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setMessage("Saving...");
        const res = await fetch("/api/competitors/relationships/update", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            competitor_id: props.competitorId,
            facility_id: props.facilityId,
            relationship_type: relationship,
            influence_weight: Number(weight),
            distance_km: form.get("distance_km") ? Number(form.get("distance_km")) : null,
            notes: form.get("notes")
          })
        });
        setMessage(res.ok ? "Saved" : "Update failed");
        router.refresh();
      }}
    >
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Used in revenue decisions</span>
        <select className="rounded border px-2 py-1" value={relationship} onChange={(event) => {
          const next = event.target.value as CompetitorRelationshipType;
          setRelationship(next);
          setWeight(String(relationshipWeights[next]));
        }}>
          <option value="direct">Direct competitor</option>
          <option value="partial">Partial competitor</option>
          <option value="benchmark">Benchmark only</option>
          <option value="ignored">Ignore for pricing</option>
        </select>
      </label>
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Weight</span>
        <input className="w-24 rounded border px-2 py-1" min="0" max="1" step="0.1" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} />
      </label>
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Distance km</span>
        <input className="w-28 rounded border px-2 py-1" defaultValue={props.distanceKm ?? ""} min="0" name="distance_km" step="0.1" type="number" />
      </label>
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Notes</span>
        <input className="w-56 rounded border px-2 py-1" defaultValue={props.notes ?? ""} name="notes" />
      </label>
      <button className="rounded bg-slate-900 px-3 py-1 text-white" type="submit">Save</button>
      <FormMessage message={message} />
    </form>
  );
}

export function AssignCompetitorFacilityForm({ competitorId, facilities }: { competitorId: string; facilities: FacilityOption[] }) {
  const router = useRouter();
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? "");
  const [relationship, setRelationship] = useState<CompetitorRelationshipType>("direct");
  const [weight, setWeight] = useState("1");
  const [message, setMessage] = useState("");

  if (!facilities.length) return null;

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setMessage("Saving...");
        const res = await fetch("/api/competitors/relationships/update", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            competitor_id: competitorId,
            facility_id: facilityId,
            relationship_type: relationship,
            influence_weight: Number(weight),
            distance_km: form.get("distance_km") ? Number(form.get("distance_km")) : null,
            notes: form.get("notes")
          })
        });
        setMessage(res.ok ? "Assigned" : "Failed");
        router.refresh();
      }}
    >
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Assign to facility</span>
        <select className="rounded border px-2 py-1" value={facilityId} onChange={(event) => setFacilityId(event.target.value)}>
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>{facility.name}</option>
          ))}
        </select>
      </label>
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Relationship</span>
        <select className="rounded border px-2 py-1" value={relationship} onChange={(event) => {
          const next = event.target.value as CompetitorRelationshipType;
          setRelationship(next);
          setWeight(String(relationshipWeights[next]));
        }}>
          <option value="direct">Direct competitor</option>
          <option value="partial">Partial competitor</option>
          <option value="benchmark">Benchmark only</option>
          <option value="ignored">Ignore for pricing</option>
        </select>
      </label>
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Weight</span>
        <input className="w-24 rounded border px-2 py-1" max="1" min="0" step="0.1" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} />
      </label>
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Distance km</span>
        <input className="w-28 rounded border px-2 py-1" min="0" name="distance_km" step="0.1" type="number" />
      </label>
      <label className="space-y-1">
        <span className="block text-xs font-medium text-slate-500">Notes</span>
        <input className="w-56 rounded border px-2 py-1" name="notes" />
      </label>
      <button className="rounded bg-slate-900 px-3 py-1 text-white" type="submit">Assign</button>
      <FormMessage message={message} />
    </form>
  );
}

export function CompetitorUnitTypeForm({ competitorId }: { competitorId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  return (
    <form
      className="panel space-y-3 p-4 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setMessage("Saving...");
        const res = await fetch("/api/competitors/unit-types/create", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            competitor_id: competitorId,
            name: form.get("name"),
            size_m2: form.get("size_m2") ? Number(form.get("size_m2")) : null,
            volume_m3: form.get("volume_m3") ? Number(form.get("volume_m3")) : null,
            access_type: form.get("access_type"),
            climate_controlled: form.get("climate_controlled") === "on" ? true : null,
            floor: form.get("floor"),
            description: form.get("description"),
            source_url: form.get("source_url")
          })
        });
        setMessage(res.ok ? "Unit type added" : "Failed");
        if (res.ok) {
          event.currentTarget.reset();
          router.refresh();
        }
      }}
    >
      <p className="font-medium">Add competitor unit type</p>
      <div className="grid gap-2 md:grid-cols-3">
        <input className="rounded border px-2 py-1" name="name" placeholder="Competitor 3-4 m² unit" required />
        <input className="rounded border px-2 py-1" min="0" name="size_m2" placeholder="size m²" step="0.1" type="number" />
        <input className="rounded border px-2 py-1" min="0" name="volume_m3" placeholder="volume m³" step="0.1" type="number" />
        <input className="rounded border px-2 py-1" name="access_type" placeholder="access type" />
        <input className="rounded border px-2 py-1" name="floor" placeholder="floor" />
        <input className="rounded border px-2 py-1" name="source_url" placeholder="source URL" />
      </div>
      <label className="flex items-center gap-2">
        <input name="climate_controlled" type="checkbox" />
        <span>Climate controlled</span>
      </label>
      <textarea className="min-h-16 w-full rounded border px-2 py-1" name="description" placeholder="description" />
      <div className="flex items-center gap-3">
        <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Add competitor unit type</button>
        <FormMessage message={message} />
      </div>
    </form>
  );
}

export function PriceObservationForm({ competitorId, competitorUnitTypes, defaultSourceUrl }: { competitorId: string; competitorUnitTypes: CompetitorUnitTypeOption[]; defaultSourceUrl?: string | null }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <form
      className="panel space-y-3 p-4 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setMessage("Saving...");
        const res = await fetch("/api/competitors/observations/create", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            competitor_id: competitorId,
            competitor_unit_type_id: form.get("competitor_unit_type_id") || null,
            observed_price_monthly: Number(form.get("observed_price_monthly")),
            promo_text: form.get("promo_text"),
            availability_text: form.get("availability_text"),
            source_url: form.get("source_url"),
            observed_at: form.get("observed_at"),
            observation_method: "manual"
          })
        });
        setMessage(res.ok ? "Price observation added" : "Failed");
        if (res.ok) {
          event.currentTarget.reset();
          router.refresh();
        }
      }}
    >
      <div>
        <p className="font-medium">Add price observation manually</p>
        <p className="mt-1 text-xs text-slate-600">Automated scraping coming later. For MVP, prices can be entered manually or updated from a pricing page review.</p>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <select className="rounded border px-2 py-1" name="competitor_unit_type_id" required>
          {competitorUnitTypes.map((unitType) => (
            <option key={unitType.id} value={unitType.id}>{unitType.name}</option>
          ))}
        </select>
        <input className="rounded border px-2 py-1" min="0" name="observed_price_monthly" placeholder="monthly price" required step="0.01" type="number" />
        <input className="rounded border px-2 py-1" name="promo_text" placeholder="promo text" />
        <input className="rounded border px-2 py-1" name="availability_text" placeholder="availability text" />
        <input className="rounded border px-2 py-1" defaultValue={defaultSourceUrl ?? ""} name="source_url" placeholder="source URL" />
        <input className="rounded border px-2 py-1" defaultValue={today} name="observed_at" type="date" />
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded bg-slate-900 px-3 py-2 text-white" disabled={!competitorUnitTypes.length} type="submit">Add price observation</button>
        <FormMessage message={message} />
      </div>
    </form>
  );
}

export function UnitMappingForm(props: {
  competitorId: string;
  facilityId: string;
  ownUnitTypes: UnitTypeOption[];
  competitorUnitTypes: CompetitorUnitTypeOption[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  return (
    <form
      className="panel space-y-3 p-4 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setMessage("Saving...");
        const res = await fetch("/api/competitors/mappings/create", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            facility_id: props.facilityId,
            competitor_id: props.competitorId,
            own_unit_type_id: form.get("own_unit_type_id"),
            competitor_unit_type_id: form.get("competitor_unit_type_id"),
            comparability_score: Number(form.get("comparability_score")),
            notes: form.get("notes")
          })
        });
        setMessage(res.ok ? "Unit mapping saved" : "Failed");
        if (res.ok) router.refresh();
      }}
    >
      <p className="font-medium">Map to own unit type</p>
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_130px]">
        <select className="rounded border px-2 py-1" name="own_unit_type_id">
          {props.ownUnitTypes.map((unitType) => (
            <option key={unitType.id} value={unitType.id}>{unitType.name}</option>
          ))}
        </select>
        <select className="rounded border px-2 py-1" name="competitor_unit_type_id">
          {props.competitorUnitTypes.map((unitType) => (
            <option key={unitType.id} value={unitType.id}>{unitType.name}</option>
          ))}
        </select>
        <input className="rounded border px-2 py-1" defaultValue="1" max="1.5" min="0.1" name="comparability_score" step="0.1" type="number" />
      </div>
      <textarea className="min-h-16 w-full rounded border px-2 py-1" name="notes" placeholder="Example: Own 3 m² unit -> competitor 3-4 m² unit" />
      <div className="flex items-center gap-3">
        <button className="rounded bg-slate-900 px-3 py-2 text-white" disabled={!props.ownUnitTypes.length || !props.competitorUnitTypes.length} type="submit">Save mapping</button>
        <FormMessage message={message} />
      </div>
    </form>
  );
}
