export type UnitStatus = "available" | "occupied" | "reserved" | "maintenance" | "unavailable";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type BookingStatus = "requested" | "reserved" | "approved" | "rejected" | "cancelled" | "converted";
export type CompetitorStatus = "active" | "inactive";
export type CompetitorRelationshipType = "direct" | "partial" | "benchmark" | "ignored";
export type CompetitorObservationMethod = "manual" | "scrape_stub" | "future_scrape" | "import";

export interface Facility {
  id: string;
  organization_id: string;
  name: string;
  city: string;
  public_slug: string;
  currency: string;
}

export interface UnitType {
  id: string;
  facility_id: string;
  name: string;
  size_m2: number;
  description: string | null;
  current_street_rate_monthly: number;
}

export interface Unit {
  id: string;
  facility_id: string;
  unit_type_id: string;
  status: UnitStatus;
  current_rent_monthly: number | null;
  tenant_start_date?: string | null;
  discount_monthly: number;
  arrears_amount: number;
}

export interface Competitor {
  id: string;
  organization_id: string;
  name: string;
  website_url: string | null;
  pricing_url: string | null;
  city: string | null;
  address: string | null;
  country: string;
  notes: string | null;
  status: CompetitorStatus;
  last_observed_at?: string | null;
  created_at?: string;
}

export interface FacilityCompetitor {
  id: string;
  facility_id: string;
  competitor_id: string;
  relationship_type: CompetitorRelationshipType;
  influence_weight: number;
  distance_km: number | null;
  notes: string | null;
  created_at?: string;
}

export interface CompetitorUnitType {
  id: string;
  competitor_id: string;
  name: string;
  size_m2: number | null;
  volume_m3: number | null;
  access_type: string | null;
  climate_controlled: boolean | null;
  floor: string | null;
  description: string | null;
  source_url: string | null;
  created_at?: string;
}

export interface CompetitorPriceObservation {
  id: string;
  competitor_id: string;
  competitor_unit_type_id: string | null;
  observed_price_monthly: number;
  currency: string;
  promo_text: string | null;
  availability_text: string | null;
  source_url: string | null;
  observed_at: string;
  observation_method: CompetitorObservationMethod;
  created_at?: string;
}

export interface CompetitorUnitMapping {
  id: string;
  facility_id: string;
  own_unit_type_id: string;
  competitor_id: string;
  competitor_unit_type_id: string;
  comparability_score: number;
  notes: string | null;
  created_at?: string;
}
