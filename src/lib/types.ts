export type UnitStatus = "available" | "occupied" | "reserved" | "maintenance" | "unavailable";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type BookingStatus = "requested" | "reserved" | "approved" | "rejected" | "cancelled" | "converted";
export type CompetitorStatus = "active" | "inactive";
export type CompetitorRelationshipType = "direct" | "partial" | "benchmark" | "ignored";
export type CompetitorObservationMethod = "manual" | "scrape_stub" | "future_scrape" | "import";

// PMS Types
export type CustomerType = "individual" | "business";
export type IdStatus = "not_required" | "pending" | "verified" | "failed" | "manual_review";
export type RiskStatus = "normal" | "watch" | "blocked";
export type TenancyStatus = "reserved" | "pending_move_in" | "active" | "notice_given" | "moved_out" | "cancelled" | "defaulted";
export type ContractStatus = "draft" | "sent" | "accepted" | "signed" | "active" | "terminated" | "expired";
export type InvoiceStatus = "draft" | "issued" | "paid" | "overdue" | "cancelled" | "credited";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
export type PaymentMethodType = "cash" | "bank_transfer" | "card" | "ideal" | "bancontact" | "sepa" | "manual" | "future";
export type PaymentProvider = "manual" | "mollie" | "stripe" | "bank_transfer" | "future";
export type CredentialType = "manual_code" | "pin" | "qr" | "badge" | "mobile" | "future_integration";
export type AccessStatus = "pending" | "active" | "suspended" | "revoked" | "expired" | "manual";
export type TaskType = "booking_followup" | "contract" | "billing" | "access" | "maintenance" | "move_in" | "move_out" | "support" | "revenue" | "compliance" | "other";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatusType = "open" | "in_progress" | "done" | "dismissed";
export type MaintenanceCategory = "cleaning" | "damage" | "access" | "security" | "lighting" | "pest" | "safety" | "other";
export type SupportCategory = "booking" | "payment" | "access" | "contract" | "move_out" | "complaint" | "other";
export type MoveWorkflowStatus = "not_started" | "in_progress" | "ready" | "completed" | "blocked";
export type AssetType = "self_storage" | "garagebox" | "container" | "caravan_boat" | "archive" | "hybrid";
export type AcquisitionStatus = "longlist" | "contacted" | "meeting" | "nda" | "reviewing" | "loi" | "rejected" | "closed";
export type DDCategory = "financial" | "legal" | "commercial" | "technical" | "operational" | "property" | "access" | "contracts" | "compliance";
export type DDStatus = "not_started" | "requested" | "received" | "reviewed" | "issue" | "cleared";
export type IntegrationPhase = "day_0_15" | "day_15_30" | "day_30_60" | "day_60_90" | "post_90";
export type CapexCategory = "access" | "security" | "repairs" | "signage" | "software" | "fire_safety" | "other";

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

// ========== PMS DOMAIN TYPES ==========

export interface Customer {
  id: string;
  organization_id: string;
  customer_type: CustomerType;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  preferred_language: string;
  billing_address: string | null;
  vat_number: string | null;
  national_id_reference: string | null;
  id_status: IdStatus;
  risk_status: RiskStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tenancy {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  resource_id: string;
  status: TenancyStatus;
  start_date: string;
  move_in_date: string | null;
  move_out_date: string | null;
  notice_date: string | null;
  monthly_rent: number;
  deposit_amount: number | null;
  billing_day: number | null;
  contract_id: string | null;
  billing_schedule_id: string | null;
  access_status: AccessStatus | null;
  payment_status: PaymentStatus | null;
  created_at: string;
  updated_at: string;
}

export interface ContractTemplate {
  id: string;
  organization_id: string;
  country: string;
  region: string | null;
  language: string;
  customer_type: string | null;
  name: string;
  version: string;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  tenancy_id: string;
  template_id: string | null;
  language: string;
  jurisdiction: string | null;
  status: ContractStatus;
  contract_number: string | null;
  start_date: string;
  accepted_at: string | null;
  signed_at: string | null;
  terminated_at: string | null;
  pdf_url: string | null;
  ip_address: string | null;
  audit_snapshot: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  tenancy_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  vat_amount: number;
  total: number;
  outstanding_amount: number | null;
  currency: string;
  payment_method: string | null;
  structured_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  line_total: number;
  line_type: string;
  created_at: string;
}

export interface Payment {
  id: string;
  organization_id: string;
  invoice_id: string | null;
  customer_id: string;
  tenancy_id: string | null;
  provider: PaymentProvider;
  provider_payment_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_date: string | null;
  method: PaymentMethodType;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodRecord {
  id: string;
  organization_id: string;
  customer_id: string;
  provider: string;
  method_type: PaymentMethodType;
  status: AccessStatus;
  mandate_reference: string | null;
  last4: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillingSchedule {
  id: string;
  organization_id: string;
  tenancy_id: string;
  frequency: string;
  next_invoice_date: string;
  billing_day: number | null;
  amount: number;
  status: string;
  auto_generate_invoice: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessCredential {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  tenancy_id: string;
  credential_type: CredentialType;
  credential_reference: string;
  status: AccessStatus;
  valid_from: string | null;
  valid_until: string | null;
  provider: string;
  created_at: string;
  updated_at: string;
}

export interface AccessEvent {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  tenancy_id: string;
  credential_id: string | null;
  event_type: string;
  event_time: string;
  source: string;
  notes: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  organization_id: string;
  facility_id: string;
  related_customer_id: string | null;
  related_tenancy_id: string | null;
  related_resource_id: string | null;
  task_type: TaskType;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatusType;
  due_date: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTicket {
  id: string;
  organization_id: string;
  facility_id: string;
  resource_id: string | null;
  title: string;
  description: string | null;
  category: MaintenanceCategory;
  status: string;
  priority: string;
  vendor: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  tenancy_id: string | null;
  subject: string;
  message: string;
  category: SupportCategory;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  organization_id: string;
  customer_id: string | null;
  tenancy_id: string | null;
  contract_id: string | null;
  invoice_id: string | null;
  document_type: string;
  name: string;
  file_url: string;
  status: string | null;
  created_at: string;
}

export interface MoveInWorkflow {
  id: string;
  organization_id: string;
  facility_id: string;
  tenancy_id: string;
  customer_id: string;
  resource_id: string;
  status: MoveWorkflowStatus;
  customer_details_complete: boolean;
  contract_accepted: boolean;
  first_invoice_paid: boolean;
  deposit_paid: boolean;
  access_created: boolean;
  move_in_instructions_sent: boolean;
  unit_ready: boolean;
  blocking_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface MoveOutWorkflow {
  id: string;
  organization_id: string;
  facility_id: string;
  tenancy_id: string;
  customer_id: string;
  resource_id: string;
  status: string;
  notice_date: string | null;
  planned_move_out_date: string | null;
  access_revoked: boolean;
  final_invoice_issued: boolean;
  deposit_reviewed: boolean;
  unit_inspected: boolean;
  unit_cleaned: boolean;
  unit_returned_to_available: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AcquisitionTarget {
  id: string;
  organization_id: string;
  name: string;
  country: string;
  region: string | null;
  asset_type: AssetType;
  estimated_units: number | null;
  estimated_revenue: number | null;
  website_url: string | null;
  online_booking: string | null;
  visible_prices: string | null;
  google_rating: number | null;
  review_count: number | null;
  owner_type: string | null;
  acquisition_status: AcquisitionStatus;
  digital_weakness_score: number | null;
  automation_readiness_score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DueDiligenceItem {
  id: string;
  acquisition_target_id: string;
  category: DDCategory;
  item: string;
  status: DDStatus;
  owner: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationPlan {
  id: string;
  acquisition_target_id: string | null;
  facility_id: string | null;
  phase: IntegrationPhase;
  task: string;
  status: string | null;
  owner: string | null;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CapexItem {
  id: string;
  acquisition_target_id: string | null;
  facility_id: string | null;
  category: CapexCategory;
  description: string;
  estimated_cost: number | null;
  actual_cost: number | null;
  priority: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationReadinessScore {
  id: string;
  acquisition_target_id: string | null;
  facility_id: string | null;
  access_feasibility: number | null;
  data_cleanliness: number | null;
  contract_quality: number | null;
  payment_quality: number | null;
  website_quality: number | null;
  operational_complexity: number | null;
  capex_risk: number | null;
  overall_score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
