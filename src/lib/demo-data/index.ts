import { CompetitorRelationshipType, Unit, UnitType } from "@/lib/types";

export interface DemoFacility {
  id: string;
  name: string;
  city: string;
  address: string;
  public_slug: string;
  estimated_asset_value: number;
  target_cap_rate_pct: number;
}

export interface DemoDemandSignal {
  facility_id: string;
  unit_type_id: string;
  leads30: number;
  bookings30: number;
  win_rate_pct: number;
  competitor_avg_rate: number;
}

export interface DemoLead {
  id: string;
  customer_name: string;
  customer_email: string;
  facility_name: string;
  requested_unit: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  value_signal: string;
}

export interface DemoBooking {
  id: string;
  customer_name: string;
  facility_name: string;
  requested_unit: string;
  status: "requested" | "reserved" | "approved" | "rejected" | "cancelled" | "converted";
  selected_unit_code: string | null;
  quoted_monthly_rate: number;
  action: string;
}

export interface DemoCompetitor {
  id: string;
  organization_id: string;
  name: string;
  website_url: string | null;
  pricing_url: string | null;
  city: string | null;
  address: string | null;
  country: string;
  notes: string | null;
  status: "active" | "inactive";
}

export interface DemoFacilityCompetitor {
  id: string;
  facility_id: string;
  competitor_id: string;
  relationship_type: CompetitorRelationshipType;
  influence_weight: number;
  distance_km: number | null;
  notes: string | null;
}

export interface DemoCompetitorUnitType {
  id: string;
  competitor_id: string;
  name: string;
  size_m2: number | null;
  source_url: string | null;
}

export interface DemoCompetitorPriceObservation {
  id: string;
  competitor_id: string;
  competitor_unit_type_id: string;
  observed_price_monthly: number;
  currency: string;
  promo_text: string | null;
  availability_text: string | null;
  source_url: string | null;
  observed_at: string;
}

export interface DemoCompetitorUnitMapping {
  id: string;
  facility_id: string;
  own_unit_type_id: string;
  competitor_id: string;
  competitor_unit_type_id: string;
  comparability_score: number;
  notes: string | null;
}

export const demoFacilities: DemoFacility[] = [
  {
    id: "f1",
    name: "Brussels North Storage",
    city: "Brussels",
    address: "Canal District",
    public_slug: "brussels-north-storage",
    estimated_asset_value: 4_850_000,
    target_cap_rate_pct: 6.1
  },
  {
    id: "f2",
    name: "Antwerp Ring Storage",
    city: "Antwerp",
    address: "Ring Logistics Park",
    public_slug: "antwerp-ring-storage",
    estimated_asset_value: 3_920_000,
    target_cap_rate_pct: 6.4
  },
  {
    id: "f3",
    name: "Ghent South Storage",
    city: "Ghent",
    address: "E17 South Exit",
    public_slug: "ghent-south-storage",
    estimated_asset_value: 3_350_000,
    target_cap_rate_pct: 6.7
  }
];

const typeTemplates = [
  { key: "locker", name: "1 m² locker", size_m2: 1, description: "Compact box storage", rate: 39 },
  { key: "small", name: "3 m² unit", size_m2: 3, description: "Small apartment overflow", rate: 79 },
  { key: "medium", name: "5 m² unit", size_m2: 5, description: "Room equivalent", rate: 109 },
  { key: "large", name: "10 m² unit", size_m2: 10, description: "1-bed apartment contents", rate: 179 },
  { key: "business", name: "20 m² unit", size_m2: 20, description: "Business storage", rate: 289 }
];

const facilityRateMultiplier: Record<string, number> = {
  f1: 1.08,
  f2: 1,
  f3: 0.94
};

const facilityUnitCounts: Record<string, number[]> = {
  f1: [28, 44, 48, 30, 10],
  f2: [22, 34, 38, 24, 12],
  f3: [18, 28, 32, 16, 8]
};

const facilityOccupancy: Record<string, number> = {
  f1: 0.88,
  f2: 0.81,
  f3: 0.76
};

export const demoUnitTypes: UnitType[] = demoFacilities.flatMap((facility) =>
  typeTemplates.map((template) => ({
    id: `${facility.id}-${template.key}`,
    facility_id: facility.id,
    name: template.name,
    size_m2: template.size_m2,
    description: template.description,
    current_street_rate_monthly: Math.round(template.rate * facilityRateMultiplier[facility.id])
  }))
);

export const demoDemandSignals: DemoDemandSignal[] = demoUnitTypes.map((unitType, index) => {
  const premium = unitType.facility_id === "f1" ? 1.18 : unitType.facility_id === "f2" ? 1.02 : 0.91;
  const smallUnitBoost = unitType.size_m2 <= 5 ? 1.25 : 0.82;
  return {
    facility_id: unitType.facility_id,
    unit_type_id: unitType.id,
    leads30: Math.max(2, Math.round((7 + (index % 5) * 2) * premium * smallUnitBoost)),
    bookings30: Math.max(1, Math.round((2 + (index % 3)) * premium * smallUnitBoost)),
    win_rate_pct: Math.round((34 + (index % 4) * 6) * premium),
    competitor_avg_rate: Math.round(unitType.current_street_rate_monthly * (1.04 + (index % 3) * 0.035))
  };
});

export const demoUnits: Unit[] = demoFacilities.flatMap((facility) => {
  const unitTypes = demoUnitTypes.filter((unitType) => unitType.facility_id === facility.id);
  let unitIndex = 0;

  return unitTypes.flatMap((unitType, typeIndex) => {
    const count = facilityUnitCounts[facility.id][typeIndex];
    return Array.from({ length: count }).map((_, i) => {
      unitIndex += 1;
      const occupied = i / count < facilityOccupancy[facility.id] - typeIndex * 0.025;
      const reserved = !occupied && (i + typeIndex) % 4 === 0;
      const maintenance = !occupied && !reserved && (i + unitIndex) % 23 === 0;
      const legacyDiscount = occupied && (i + typeIndex) % 9 === 0;
      const tenureMonths = occupied ? 4 + ((i * 7 + typeIndex * 11) % 42) : null;
      const rateFactor = occupied ? 0.84 + ((i + typeIndex) % 7) * 0.035 : 1;
      const currentRent = occupied ? Math.round(unitType.current_street_rate_monthly * rateFactor) : null;
      const tenantStart = tenureMonths
        ? new Date(Date.UTC(2026, 4 - tenureMonths, 1 + ((i + typeIndex) % 21))).toISOString().slice(0, 10)
        : null;

      return {
        id: `${facility.id}-u${unitIndex}`,
        facility_id: facility.id,
        unit_type_id: unitType.id,
        status: occupied ? "occupied" : reserved ? "reserved" : maintenance ? "maintenance" : "available",
        current_rent_monthly: currentRent,
        tenant_start_date: tenantStart,
        discount_monthly: legacyDiscount ? Math.round(unitType.current_street_rate_monthly * 0.08) : 0,
        arrears_amount: occupied && (i + unitIndex) % 31 === 0 ? Math.round(unitType.current_street_rate_monthly * 0.65) : 0
      };
    });
  });
});

export const demoMonthlySeries = [
  { month: "Dec", occupancy_pct: 77.8, rent: 33750, leads: 61, bookings: 18 },
  { month: "Jan", occupancy_pct: 78.6, rent: 34420, leads: 66, bookings: 21 },
  { month: "Feb", occupancy_pct: 79.7, rent: 35290, leads: 72, bookings: 22 },
  { month: "Mar", occupancy_pct: 80.9, rent: 36340, leads: 81, bookings: 25 },
  { month: "Apr", occupancy_pct: 81.6, rent: 37180, leads: 78, bookings: 24 },
  { month: "May", occupancy_pct: 82.2, rent: 37960, leads: 86, bookings: 28 }
];

export const demoActionQueue = [
  {
    title: "Raise 3 m² Brussels street rate",
    impact: 620,
    priority: "high",
    signal: "94% occupied, 17 leads in 30 days, competitors 8% higher"
  },
  {
    title: "Recover expired discounts",
    impact: 770,
    priority: "high",
    signal: "19 occupied units still carry legacy monthly concessions"
  },
  {
    title: "Push Ghent 10 m² local campaign",
    impact: 540,
    priority: "medium",
    signal: "Large-unit vacancy is 26%, but booking win rate is improving"
  },
  {
    title: "Collections follow-up batch",
    impact: 430,
    priority: "medium",
    signal: "Arrears concentrated in 7 tenants older than 30 days"
  }
];

export const demoLeads: DemoLead[] = [
  {
    id: "lead-demo-1",
    customer_name: "Maya Peeters",
    customer_email: "maya.peeters@example.com",
    facility_name: "Brussels North Storage",
    requested_unit: "3 m² unit",
    status: "qualified",
    value_signal: "Move-in within 7 days, budget aligned with EUR 92 street rate"
  },
  {
    id: "lead-demo-2",
    customer_name: "Bouwatelier North",
    customer_email: "ops@bouwatelier.example",
    facility_name: "Antwerp Ring Storage",
    requested_unit: "20 m² unit",
    status: "contacted",
    value_signal: "Business storage lead, likely multi-unit expansion"
  },
  {
    id: "lead-demo-3",
    customer_name: "Jules Vermeulen",
    customer_email: "jules.vermeulen@example.com",
    facility_name: "Ghent South Storage",
    requested_unit: "10 m² unit",
    status: "new",
    value_signal: "Campaign source, price-sensitive but flexible on start date"
  },
  {
    id: "lead-demo-4",
    customer_name: "Elena De Smet",
    customer_email: "elena.desmet@example.com",
    facility_name: "Brussels North Storage",
    requested_unit: "5 m² unit",
    status: "converted",
    value_signal: "Converted from website quote after same-day follow-up"
  }
];

export const demoBookings: DemoBooking[] = [
  {
    id: "booking-demo-1",
    customer_name: "Maya Peeters",
    facility_name: "Brussels North Storage",
    requested_unit: "3 m² unit",
    status: "reserved",
    selected_unit_code: "BRU-3M-118",
    quoted_monthly_rate: 92,
    action: "Confirm move-in and collect first month"
  },
  {
    id: "booking-demo-2",
    customer_name: "Bouwatelier North",
    facility_name: "Antwerp Ring Storage",
    requested_unit: "20 m² unit",
    status: "requested",
    selected_unit_code: null,
    quoted_monthly_rate: 289,
    action: "Assign ANT-20M-012 after business-hours callback"
  },
  {
    id: "booking-demo-3",
    customer_name: "Jules Vermeulen",
    facility_name: "Ghent South Storage",
    requested_unit: "10 m² unit",
    status: "approved",
    selected_unit_code: "GHE-10M-047",
    quoted_monthly_rate: 168,
    action: "Send access instructions"
  }
];

export const demoCompetitors: DemoCompetitor[] = [
  {
    id: "comp-boxplus-brussels",
    organization_id: "demo-org",
    name: "BoxPlus Brussels",
    website_url: "https://example.com/boxplus-brussels",
    pricing_url: "https://example.com/boxplus-brussels/prices",
    city: "Brussels",
    address: "Canal North",
    country: "Belgium",
    notes: "Closest like-for-like self-storage operator.",
    status: "active"
  },
  {
    id: "comp-citystorage-north",
    organization_id: "demo-org",
    name: "CityStorage North",
    website_url: "https://example.com/citystorage-north",
    pricing_url: "https://example.com/citystorage-north/rates",
    city: "Brussels",
    address: "Schaerbeek",
    country: "Belgium",
    notes: "Strong direct competitor for small and medium units.",
    status: "active"
  },
  {
    id: "comp-premium-climate",
    organization_id: "demo-org",
    name: "Premium Climate Storage",
    website_url: "https://example.com/premium-climate",
    pricing_url: "https://example.com/premium-climate/pricing",
    city: "Brussels",
    address: "Ixelles",
    country: "Belgium",
    notes: "Premium climate-controlled benchmark, not comparable for core pricing.",
    status: "active"
  },
  {
    id: "comp-antwerp-lockers",
    organization_id: "demo-org",
    name: "Antwerp Lockers",
    website_url: "https://example.com/antwerp-lockers",
    pricing_url: "https://example.com/antwerp-lockers/prices",
    city: "Antwerp",
    address: "Ring Road",
    country: "Belgium",
    notes: "Partial competitor: fewer business storage options.",
    status: "active"
  },
  {
    id: "comp-ghent-depot",
    organization_id: "demo-org",
    name: "Ghent Depot Units",
    website_url: "https://example.com/ghent-depot",
    pricing_url: "https://example.com/ghent-depot/storage",
    city: "Ghent",
    address: "South Logistics",
    country: "Belgium",
    notes: "Operator chose to ignore for pricing because product is container-heavy.",
    status: "active"
  }
];

export const demoFacilityCompetitors: DemoFacilityCompetitor[] = [
  { id: "fc-1", facility_id: "f1", competitor_id: "comp-boxplus-brussels", relationship_type: "direct", influence_weight: 1, distance_km: 2.1, notes: "Used in revenue decisions" },
  { id: "fc-2", facility_id: "f1", competitor_id: "comp-citystorage-north", relationship_type: "direct", influence_weight: 1, distance_km: 3.4, notes: "Used in revenue decisions" },
  { id: "fc-3", facility_id: "f1", competitor_id: "comp-premium-climate", relationship_type: "benchmark", influence_weight: 0, distance_km: 5.7, notes: "Shown as benchmark only" },
  { id: "fc-4", facility_id: "f2", competitor_id: "comp-antwerp-lockers", relationship_type: "partial", influence_weight: 0.5, distance_km: 4.2, notes: "Partial competitor for lockers and small units" },
  { id: "fc-5", facility_id: "f3", competitor_id: "comp-ghent-depot", relationship_type: "ignored", influence_weight: 0, distance_km: 2.9, notes: "Not used in revenue decisions" }
];

export const demoCompetitorUnitTypes: DemoCompetitorUnitType[] = [
  { id: "cut-boxplus-3", competitor_id: "comp-boxplus-brussels", name: "3 m² standard unit", size_m2: 3, source_url: "https://example.com/boxplus-brussels/prices" },
  { id: "cut-boxplus-5", competitor_id: "comp-boxplus-brussels", name: "5 m² standard unit", size_m2: 5, source_url: "https://example.com/boxplus-brussels/prices" },
  { id: "cut-city-3-4", competitor_id: "comp-citystorage-north", name: "3-4 m² city unit", size_m2: 3.5, source_url: "https://example.com/citystorage-north/rates" },
  { id: "cut-city-10", competitor_id: "comp-citystorage-north", name: "10 m² city unit", size_m2: 10, source_url: "https://example.com/citystorage-north/rates" },
  { id: "cut-premium-3", competitor_id: "comp-premium-climate", name: "3 m² climate unit", size_m2: 3, source_url: "https://example.com/premium-climate/pricing" },
  { id: "cut-antwerp-20", competitor_id: "comp-antwerp-lockers", name: "18-22 m² business unit", size_m2: 20, source_url: "https://example.com/antwerp-lockers/prices" },
  { id: "cut-ghent-10", competitor_id: "comp-ghent-depot", name: "10 m² container unit", size_m2: 10, source_url: "https://example.com/ghent-depot/storage" }
];

export const demoCompetitorPriceObservations: DemoCompetitorPriceObservation[] = [
  { id: "obs-1", competitor_id: "comp-boxplus-brussels", competitor_unit_type_id: "cut-boxplus-3", observed_price_monthly: 99, currency: "EUR", promo_text: null, availability_text: "Available", source_url: "https://example.com/boxplus-brussels/prices", observed_at: "2026-04-29T10:00:00.000Z" },
  { id: "obs-2", competitor_id: "comp-citystorage-north", competitor_unit_type_id: "cut-city-3-4", observed_price_monthly: 101, currency: "EUR", promo_text: "First month half price", availability_text: "Few left", source_url: "https://example.com/citystorage-north/rates", observed_at: "2026-04-30T10:00:00.000Z" },
  { id: "obs-3", competitor_id: "comp-boxplus-brussels", competitor_unit_type_id: "cut-boxplus-5", observed_price_monthly: 123, currency: "EUR", promo_text: null, availability_text: "Available", source_url: "https://example.com/boxplus-brussels/prices", observed_at: "2026-04-12T10:00:00.000Z" },
  { id: "obs-4", competitor_id: "comp-citystorage-north", competitor_unit_type_id: "cut-city-10", observed_price_monthly: 184, currency: "EUR", promo_text: null, availability_text: "Available", source_url: "https://example.com/citystorage-north/rates", observed_at: "2026-03-18T10:00:00.000Z" },
  { id: "obs-5", competitor_id: "comp-premium-climate", competitor_unit_type_id: "cut-premium-3", observed_price_monthly: 126, currency: "EUR", promo_text: null, availability_text: "Available", source_url: "https://example.com/premium-climate/pricing", observed_at: "2026-04-27T10:00:00.000Z" },
  { id: "obs-6", competitor_id: "comp-antwerp-lockers", competitor_unit_type_id: "cut-antwerp-20", observed_price_monthly: 272, currency: "EUR", promo_text: "Business rate on request", availability_text: "Call for availability", source_url: "https://example.com/antwerp-lockers/prices", observed_at: "2026-04-04T10:00:00.000Z" },
  { id: "obs-7", competitor_id: "comp-ghent-depot", competitor_unit_type_id: "cut-ghent-10", observed_price_monthly: 149, currency: "EUR", promo_text: null, availability_text: "Available", source_url: "https://example.com/ghent-depot/storage", observed_at: "2026-04-03T10:00:00.000Z" }
];

export const demoCompetitorUnitMappings: DemoCompetitorUnitMapping[] = [
  { id: "map-1", facility_id: "f1", own_unit_type_id: "f1-small", competitor_id: "comp-boxplus-brussels", competitor_unit_type_id: "cut-boxplus-3", comparability_score: 1, notes: "Own 3 m² unit -> competitor 3 m² unit" },
  { id: "map-2", facility_id: "f1", own_unit_type_id: "f1-small", competitor_id: "comp-citystorage-north", competitor_unit_type_id: "cut-city-3-4", comparability_score: 0.95, notes: "Own 3 m² unit -> competitor 3-4 m² unit" },
  { id: "map-3", facility_id: "f1", own_unit_type_id: "f1-medium", competitor_id: "comp-boxplus-brussels", competitor_unit_type_id: "cut-boxplus-5", comparability_score: 1, notes: "Own 5 m² unit -> competitor 5 m² unit" },
  { id: "map-4", facility_id: "f1", own_unit_type_id: "f1-large", competitor_id: "comp-citystorage-north", competitor_unit_type_id: "cut-city-10", comparability_score: 1, notes: "Own 10 m² unit -> competitor 10 m² unit" },
  { id: "map-5", facility_id: "f1", own_unit_type_id: "f1-small", competitor_id: "comp-premium-climate", competitor_unit_type_id: "cut-premium-3", comparability_score: 0.8, notes: "Benchmark only" },
  { id: "map-6", facility_id: "f2", own_unit_type_id: "f2-business", competitor_id: "comp-antwerp-lockers", competitor_unit_type_id: "cut-antwerp-20", comparability_score: 0.9, notes: "Own 20 m² unit -> competitor 18-22 m² unit" },
  { id: "map-7", facility_id: "f3", own_unit_type_id: "f3-large", competitor_id: "comp-ghent-depot", competitor_unit_type_id: "cut-ghent-10", comparability_score: 0.7, notes: "Ignored competitor" }
];
