import { demoFacilities, demoUnitTypes, demoUnits } from "@/lib/demo-data";
import { loadDemoState, updateDemoState } from "@/lib/demo-state";
import type { BookingStatus, CustomerType, IdStatus, RiskStatus, TenancyStatus, InvoiceStatus, PaymentStatus, PaymentMethodType, PaymentProvider, AccessStatus, TaskPriority, TaskStatusType, TaskType, CredentialType } from "@/lib/types";

const STORAGE_KEY = "storageyield.demoPmsState";

export interface DemoPmsCustomer {
  id: string;
  organization_id: string;
  customer_type: CustomerType;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  preferred_language: string;
  billing_address: string | null;
  id_status: IdStatus;
  risk_status: RiskStatus;
  created_at: string;
  updated_at: string;
}

export interface DemoPmsBooking {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_type: CustomerType | "unknown";
  facility_id: string;
  facility_name: string;
  unit_type_id: string;
  unit_type_name: string;
  preferred_move_in_date: string;
  quoted_monthly_rate: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface DemoPmsTenancy {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  resource_id: string;
  status: TenancyStatus;
  start_date: string;
  move_in_date: string;
  move_out_date: string | null;
  notice_date: string | null;
  monthly_rent: number;
  deposit_amount: number | null;
  billing_day: number | null;
  contract_id: string | null;
  billing_schedule_id: string | null;
  access_status: AccessStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface DemoPmsContract {
  id: string;
  organization_id: string;
  facility_id: string;
  customer_id: string;
  tenancy_id: string;
  language: string;
  jurisdiction: string;
  status: string;
  contract_number: string;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface DemoPmsInvoice {
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
  outstanding_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface DemoPmsInvoiceLine {
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

export interface DemoPmsPayment {
  id: string;
  organization_id: string;
  invoice_id: string | null;
  customer_id: string;
  tenancy_id: string | null;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_date: string;
  method: PaymentMethodType;
  created_at: string;
  updated_at: string;
}

export interface DemoPmsAccessCredential {
  id: string;
  organization_id: string;
  customer_id: string;
  tenancy_id: string;
  credential_type: CredentialType;
  credential_reference: string;
  status: AccessStatus;
  valid_from: string;
  valid_until: string | null;
  provider: string;
  created_at: string;
  updated_at: string;
}

export interface DemoPmsTask {
  id: string;
  organization_id: string;
  related_customer_id: string | null;
  related_tenancy_id: string | null;
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

export interface DemoPmsMoveInWorkflow {
  id: string;
  organization_id: string;
  tenancy_id: string;
  customer_id: string;
  resource_id: string;
  status: string;
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

export interface DemoPmsState {
  customers: DemoPmsCustomer[];
  bookings: DemoPmsBooking[];
  tenancies: DemoPmsTenancy[];
  contracts: DemoPmsContract[];
  invoices: DemoPmsInvoice[];
  invoiceLines: DemoPmsInvoiceLine[];
  payments: DemoPmsPayment[];
  accessCredentials: DemoPmsAccessCredential[];
  tasks: DemoPmsTask[];
  moveInWorkflows: DemoPmsMoveInWorkflow[];
}

const defaultState: DemoPmsState = {
  customers: [],
  bookings: [],
  tenancies: [],
  contracts: [],
  invoices: [],
  invoiceLines: [],
  payments: [],
  accessCredentials: [],
  tasks: [],
  moveInWorkflows: []
};

export function loadDemoPmsState(): DemoPmsState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) } as DemoPmsState;
  } catch {
    return defaultState;
  }
}

export function saveDemoPmsState(state: DemoPmsState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateDemoPmsState(update: (current: DemoPmsState) => DemoPmsState) {
  const current = loadDemoPmsState();
  const next = update(current);
  saveDemoPmsState(next);
  return next;
}

function nowDate() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDemoPmsCustomers() {
  return loadDemoPmsState().customers;
}

export function getDemoPmsCustomerById(id: string) {
  return loadDemoPmsState().customers.find((customer) => customer.id === id) ?? null;
}

export function findDemoPmsCustomerByEmail(email: string) {
  return loadDemoPmsState().customers.filter((customer) => customer.email.toLowerCase() === email.toLowerCase());
}

export function createDemoPmsCustomer(input: { first_name: string; last_name: string; email: string; phone?: string }) {
  const state = loadDemoPmsState();
  const customer: DemoPmsCustomer = {
    id: createId("demo-customer"),
    organization_id: "demo-org",
    customer_type: "individual",
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email,
    phone: input.phone ?? null,
    preferred_language: "nl",
    billing_address: null,
    id_status: "pending",
    risk_status: "normal",
    created_at: nowDate(),
    updated_at: nowDate()
  };
  const next = { ...state, customers: [customer, ...state.customers] };
  saveDemoPmsState(next);
  return customer;
}

export function getDemoPmsBookings() {
  return loadDemoPmsState().bookings;
}

export function getDemoPmsBookingById(id: string) {
  return loadDemoPmsState().bookings.find((booking) => booking.id === id) ?? null;
}

export function createDemoPmsBooking(input: {
  customer_id: string;
  unit_type_id: string;
  facility_id: string;
  preferred_move_in_date: string;
}) {
  const state = loadDemoPmsState();
  const customer = state.customers.find((item) => item.id === input.customer_id);
  const unitType = demoUnitTypes.find((item) => item.id === input.unit_type_id);
  const facility = demoFacilities.find((item) => item.id === input.facility_id);
  if (!customer || !unitType || !facility) {
    throw new Error("Invalid booking inputs");
  }

  const booking: DemoPmsBooking = {
    id: createId("demo-booking"),
    customer_id: customer.id,
    customer_name: `${customer.first_name} ${customer.last_name}`,
    customer_email: customer.email,
    customer_phone: customer.phone,
    customer_type: customer.customer_type,
    facility_id: facility.id,
    facility_name: facility.name,
    unit_type_id: unitType.id,
    unit_type_name: unitType.name,
    preferred_move_in_date: input.preferred_move_in_date,
    quoted_monthly_rate: unitType.current_street_rate_monthly,
    status: "reserved",
    created_at: nowDate(),
    updated_at: nowDate()
  };

  const next = {
    ...state,
    bookings: [booking, ...state.bookings]
  };

  saveDemoPmsState(next);
  updateDemoState((current) => ({ ...current, bookings: [booking, ...current.bookings] }));
  return booking;
}

export function getDemoPmsTenancies() {
  return loadDemoPmsState().tenancies;
}

export function getDemoPmsTenancyById(id: string) {
  return loadDemoPmsState().tenancies.find((item) => item.id === id) ?? null;
}

export function getDemoPmsInvoices() {
  return loadDemoPmsState().invoices;
}

export function getDemoPmsPayments() {
  return loadDemoPmsState().payments;
}

export function getDemoPmsAccessCredentials() {
  return loadDemoPmsState().accessCredentials;
}

export function getDemoPmsTasks() {
  return loadDemoPmsState().tasks;
}

export function getDemoPmsMoveInWorkflows() {
  return loadDemoPmsState().moveInWorkflows;
}

export function createDemoPmsConversion(bookingId: string, unitId: string, rent?: number) {
  const state = loadDemoPmsState();
  const booking = state.bookings.find((item) => item.id === bookingId);
  if (!booking) throw new Error("Booking not found");
  const customer = state.customers.find((item) => item.id === booking.customer_id);
  if (!customer) throw new Error("Customer not found");
  const unit = demoUnits.find((item) => item.id === unitId);
  if (!unit) throw new Error("Unit not found");
  const facility = demoFacilities.find((item) => item.id === booking.facility_id);
  if (!facility) throw new Error("Facility not found");
  const amount = rent ?? booking.quoted_monthly_rate;
  const today = nowDate();
  const tenancyId = createId("demo-tenancy");
  const contractId = createId("demo-contract");
  const billingScheduleId = createId("demo-billing-schedule");
  const invoiceId = createId("demo-invoice");
  const accessId = createId("demo-access");
  const workflowId = createId("demo-move-in");

  const tenancy: DemoPmsTenancy = {
    id: tenancyId,
    organization_id: "demo-org",
    facility_id: facility.id,
    customer_id: customer.id,
    resource_id: unit.id,
    status: "active",
    start_date: today,
    move_in_date: today,
    move_out_date: null,
    notice_date: null,
    monthly_rent: amount,
    deposit_amount: 500,
    billing_day: 1,
    contract_id: contractId,
    billing_schedule_id: billingScheduleId,
    access_status: "pending",
    payment_status: "pending",
    created_at: today,
    updated_at: today
  };

  const contract: DemoPmsContract = {
    id: contractId,
    organization_id: "demo-org",
    facility_id: facility.id,
    customer_id: customer.id,
    tenancy_id: tenancyId,
    language: "nl",
    jurisdiction: "Belgium",
    status: "draft",
    contract_number: `CONTRACT-${booking.id.slice(-6).toUpperCase()}`,
    start_date: today,
    created_at: today,
    updated_at: today
  };

  const invoice: DemoPmsInvoice = {
    id: invoiceId,
    organization_id: "demo-org",
    facility_id: facility.id,
    customer_id: customer.id,
    tenancy_id: tenancyId,
    invoice_number: `INV-${booking.id.slice(-6).toUpperCase()}-001`,
    invoice_date: today,
    due_date: addDays(30),
    status: "issued",
    subtotal: amount,
    vat_amount: Math.round(amount * 0.21),
    total: Math.round(amount * 1.21),
    outstanding_amount: Math.round(amount * 1.21),
    currency: "EUR",
    created_at: today,
    updated_at: today
  };

  const invoiceLine: DemoPmsInvoiceLine = {
    id: createId("demo-invoice-line"),
    invoice_id: invoiceId,
    description: "Monthly Storage Rent",
    quantity: 1,
    unit_price: amount,
    vat_rate: 21,
    line_total: amount,
    line_type: "rent",
    created_at: today
  };

  const accessCredential: DemoPmsAccessCredential = {
    id: accessId,
    organization_id: "demo-org",
    customer_id: customer.id,
    tenancy_id: tenancyId,
    credential_type: "manual_code",
    credential_reference: `CODE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: "pending",
    valid_from: today,
    valid_until: null,
    provider: "manual",
    created_at: today,
    updated_at: today
  };

  const moveInWorkflow: DemoPmsMoveInWorkflow = {
    id: workflowId,
    organization_id: "demo-org",
    tenancy_id: tenancyId,
    customer_id: customer.id,
    resource_id: unit.id,
    status: "in_progress",
    customer_details_complete: false,
    contract_accepted: false,
    first_invoice_paid: false,
    deposit_paid: false,
    access_created: false,
    move_in_instructions_sent: false,
    unit_ready: false,
    blocking_reason: null,
    created_at: today,
    updated_at: today
  };

  const baseTask = (title: string, type: TaskType) => ({
    id: createId("demo-task"),
    organization_id: "demo-org",
    related_customer_id: customer.id,
    related_tenancy_id: tenancyId,
    task_type: type,
    title,
    description: null,
    priority: "high" as TaskPriority,
    status: "open" as TaskStatusType,
    due_date: addDays(7),
    assigned_to: "Operations",
    created_at: today,
    updated_at: today
  });

  const tasks: DemoPmsTask[] = [
    baseTask("Complete move-in checklist", "move_in"),
    baseTask("Send welcome invoice", "billing")
  ];

  const updatedBookings = state.bookings.map((item) =>
    item.id === booking.id ? { ...item, status: "converted", updated_at: today } : item
  );

  const next = {
    ...state,
    bookings: updatedBookings,
    tenancies: [tenancy, ...state.tenancies],
    contracts: [contract, ...state.contracts],
    invoices: [invoice, ...state.invoices],
    invoiceLines: [invoiceLine, ...state.invoiceLines],
    accessCredentials: [accessCredential, ...state.accessCredentials],
    moveInWorkflows: [moveInWorkflow, ...state.moveInWorkflows],
    tasks: [...tasks, ...state.tasks]
  };

  saveDemoPmsState(next);
  return next;
}

export function recordDemoPayment(invoiceId: string, amount: number) {
  const state = loadDemoPmsState();
  const invoice = state.invoices.find((item) => item.id === invoiceId);
  if (!invoice) throw new Error("Invoice not found");

  const payment: DemoPmsPayment = {
    id: createId("demo-payment"),
    organization_id: "demo-org",
    invoice_id: invoice.id,
    customer_id: invoice.customer_id,
    tenancy_id: invoice.tenancy_id,
    provider: "manual",
    amount,
    currency: "EUR",
    status: "paid",
    payment_date: nowDate(),
    method: "manual",
    created_at: nowDate(),
    updated_at: nowDate()
  };

  const updatedInvoices = state.invoices.map((item) =>
    item.id === invoiceId ? { ...item, outstanding_amount: 0, status: "paid", updated_at: nowDate() } : item
  );

  const updatedTenancies = state.tenancies.map((tenancy) =>
    tenancy.id === invoice.tenancy_id ? { ...tenancy, payment_status: "current", updated_at: nowDate() } : tenancy
  );

  const next = {
    ...state,
    invoices: updatedInvoices,
    payments: [payment, ...state.payments],
    tenancies: updatedTenancies
  };

  saveDemoPmsState(next);
  return payment;
}

export function activateDemoAccess(accessId: string) {
  const state = loadDemoPmsState();
  const updatedCredentials = state.accessCredentials.map((item) =>
    item.id === accessId ? { ...item, status: "active", updated_at: nowDate() } : item
  );
  const credential = state.accessCredentials.find((item) => item.id === accessId);

  const updatedWorkflows = credential
    ? state.moveInWorkflows.map((workflow) =>
        workflow.tenancy_id === credential.tenancy_id
          ? { ...workflow, access_created: true, updated_at: nowDate() }
          : workflow
      )
    : state.moveInWorkflows;

  const next = { ...state, accessCredentials: updatedCredentials, moveInWorkflows: updatedWorkflows };
  saveDemoPmsState(next);
  return next;
}

export function completeDemoTask(taskId: string) {
  const state = loadDemoPmsState();
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) throw new Error("Task not found");
  const updatedTasks = state.tasks.map((item) =>
    item.id === taskId ? { ...item, status: "done", updated_at: nowDate() } : item
  );

  const updatedWorkflows = task.task_type === "move_in"
    ? state.moveInWorkflows.map((workflow) =>
        workflow.tenancy_id === task.related_tenancy_id
          ? { ...workflow, unit_ready: true, status: "completed", updated_at: nowDate() }
          : workflow
      )
    : state.moveInWorkflows;

  const next = { ...state, tasks: updatedTasks, moveInWorkflows: updatedWorkflows };
  saveDemoPmsState(next);
  return next;
}

export function getDemoPmsCustomerWithRelations(customerId: string) {
  const state = loadDemoPmsState();
  const customer = state.customers.find((item) => item.id === customerId);
  if (!customer) return null;
  const bookings = state.bookings.filter((booking) => booking.customer_id === customerId);
  const tenancies = state.tenancies.filter((tenancy) => tenancy.customer_id === customerId);
  const invoices = state.invoices.filter((invoice) => invoice.customer_id === customerId);
  const payments = state.payments.filter((payment) => payment.customer_id === customerId);
  const access_credentials = state.accessCredentials.filter((credential) => credential.customer_id === customerId);
  const support_tickets: any[] = [];
  const contracts = state.contracts.filter((contract) => contract.customer_id === customerId);

  return {
    ...customer,
    bookings,
    tenancies,
    invoices,
    payments,
    access_credentials,
    support_tickets,
    contracts
  };
}

export function getDemoPmsTenancyWithRelations(tenancyId: string) {
  const state = loadDemoPmsState();
  const tenancy = state.tenancies.find((item) => item.id === tenancyId);
  if (!tenancy) return null;
  const customer = state.customers.find((item) => item.id === tenancy.customer_id);
  const facility = demoFacilities.find((item) => item.id === tenancy.facility_id);
  const unit = demoUnits.find((item) => item.id === tenancy.resource_id);
  const contract = state.contracts.find((item) => item.id === tenancy.contract_id);
  const billing_schedule = state.invoices.some((invoice) => invoice.tenancy_id === tenancyId)
    ? { billing_cycle: "monthly", billing_day: tenancy.billing_day, next_billing_date: addDays(30), status: "active" }
    : null;
  const invoices = state.invoices.filter((invoice) => invoice.tenancy_id === tenancyId);
  const payments = state.payments.filter((payment) => payment.tenancy_id === tenancyId);
  const access_credential = state.accessCredentials.find((item) => item.tenancy_id === tenancyId) ?? null;
  const move_in_workflow = state.moveInWorkflows.find((item) => item.tenancy_id === tenancyId) ?? null;
  const tasks = state.tasks.filter((item) => item.related_tenancy_id === tenancyId);
  const support_tickets: any[] = [];

  return {
    ...tenancy,
    customer,
    facility: facility ? { name: facility.name } : { name: "Demo Facility" },
    resource: unit ? { unit_code: unit.id } : { unit_code: tenancy.resource_id },
    contract,
    billing_schedule,
    invoices,
    payments,
    access_credential,
    move_in_workflow,
    tasks,
    support_tickets
  };
}

export function getDemoPmsReportData() {
  const state = loadDemoPmsState();
  const tenancies = state.tenancies.map((tenancy) => ({
    ...tenancy,
    customer: state.customers.find((item) => item.id === tenancy.customer_id),
    facility: demoFacilities.find((item) => item.id === tenancy.facility_id)
  }));

  const debtors = state.invoices.filter((invoice) => invoice.outstanding_amount > 0).map((invoice) => ({
    ...invoice,
    customers: state.customers.find((item) => item.id === invoice.customer_id)
  }));

  const revenue = state.payments;
  const occupancy = demoUnits;
  const conversions = state.bookings;
  const priceChanges: any[] = [];
  const discounts: any[] = [];
  const owner: any[] = [];
  const portfolio: any[] = [];

  return { tenancies, debtors, revenue, occupancy, conversions, priceChanges, discounts, owner, portfolio };
}
