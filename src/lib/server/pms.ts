import { createClient } from '@supabase/supabase-js';
import type {
  Customer, Tenancy, Contract, Invoice, InvoiceLine, Payment, AccessCredential,
  Task, MaintenanceTicket, SupportTicket, MoveInWorkflow, MoveOutWorkflow,
  AcquisitionTarget
} from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// ========== CUSTOMERS ==========

export async function getCustomers(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Customer[];
}

export async function getCustomer(customerId: string) {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();
  if (error) throw error;
  return data as Customer;
}

export async function createCustomer(organizationId: string, customer: Omit<Customer, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .insert([{ organization_id: organizationId, ...customer }])
    .select()
    .single();
  if (error) throw error;
  return data as Customer;
}

// ========== TENANCIES ==========

export async function getTenancies(organizationId: string, facilityId?: string) {
  let query = supabaseAdmin
    .from('tenancies')
    .select('*')
    .eq('organization_id', organizationId);
  
  if (facilityId) query = query.eq('facility_id', facilityId);
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as Tenancy[];
}

export async function getTenancy(tenancyId: string) {
  const { data, error } = await supabaseAdmin
    .from('tenancies')
    .select('*')
    .eq('id', tenancyId)
    .single();
  if (error) throw error;
  return data as Tenancy;
}

export async function createTenancy(organizationId: string, tenancy: Omit<Tenancy, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('tenancies')
    .insert([{ organization_id: organizationId, ...tenancy }])
    .select()
    .single();
  if (error) throw error;
  return data as Tenancy;
}

export async function updateTenancy(tenancyId: string, updates: Partial<Tenancy>) {
  const { data, error } = await supabaseAdmin
    .from('tenancies')
    .update(updates)
    .eq('id', tenancyId)
    .select()
    .single();
  if (error) throw error;
  return data as Tenancy;
}

// ========== CONTRACTS ==========

export async function getContracts(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('contracts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Contract[];
}

export async function getContract(contractId: string) {
  const { data, error } = await supabaseAdmin
    .from('contracts')
    .select('*')
    .eq('id', contractId)
    .single();
  if (error) throw error;
  return data as Contract;
}

export async function createContract(organizationId: string, contract: Omit<Contract, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('contracts')
    .insert([{ organization_id: organizationId, ...contract }])
    .select()
    .single();
  if (error) throw error;
  return data as Contract;
}

// ========== INVOICES ==========

export async function getInvoices(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Invoice[];
}

export async function getInvoice(invoiceId: string) {
  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select(`
      *,
      invoice_lines (*)
    `)
    .eq('id', invoiceId)
    .single();
  if (error) throw error;
  return data as Invoice & { invoice_lines: InvoiceLine[] };
}

export async function createInvoice(organizationId: string, invoice: Omit<Invoice, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('invoices')
    .insert([{ organization_id: organizationId, ...invoice }])
    .select()
    .single();
  if (error) throw error;
  return data as Invoice;
}

// ========== PAYMENTS ==========

export async function getPayments(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Payment[];
}

export async function createPayment(organizationId: string, payment: Omit<Payment, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .insert([{ organization_id: organizationId, ...payment }])
    .select()
    .single();
  if (error) throw error;
  return data as Payment;
}

// ========== ACCESS CREDENTIALS ==========

export async function getAccessCredentials(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('access_credentials')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as AccessCredential[];
}

export async function createAccessCredential(organizationId: string, credential: Omit<AccessCredential, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('access_credentials')
    .insert([{ organization_id: organizationId, ...credential }])
    .select()
    .single();
  if (error) throw error;
  return data as AccessCredential;
}

// ========== TASKS ==========

export async function getTasks(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('tasks')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Task[];
}

export async function createTask(organizationId: string, task: Omit<Task, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('tasks')
    .insert([{ organization_id: organizationId, ...task }])
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { data, error } = await supabaseAdmin
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

// ========== MAINTENANCE TICKETS ==========

export async function getMaintenanceTickets(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('maintenance_tickets')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as MaintenanceTicket[];
}

export async function createMaintenanceTicket(organizationId: string, ticket: Omit<MaintenanceTicket, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('maintenance_tickets')
    .insert([{ organization_id: organizationId, ...ticket }])
    .select()
    .single();
  if (error) throw error;
  return data as MaintenanceTicket;
}

// ========== SUPPORT TICKETS ==========

export async function getSupportTickets(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('support_tickets')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as SupportTicket[];
}

export async function createSupportTicket(organizationId: string, ticket: Omit<SupportTicket, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('support_tickets')
    .insert([{ organization_id: organizationId, ...ticket }])
    .select()
    .single();
  if (error) throw error;
  return data as SupportTicket;
}

// ========== MOVE-IN/MOVE-OUT WORKFLOWS ==========

export async function getMoveInWorkflow(tenancyId: string) {
  const { data, error } = await supabaseAdmin
    .from('move_in_workflows')
    .select('*')
    .eq('tenancy_id', tenancyId)
    .single();
  if (error) throw error;
  return data as MoveInWorkflow;
}

export async function getMoveOutWorkflow(tenancyId: string) {
  const { data, error } = await supabaseAdmin
    .from('move_out_workflows')
    .select('*')
    .eq('tenancy_id', tenancyId)
    .single();
  if (error) throw error;
  return data as MoveOutWorkflow;
}

export async function createMoveInWorkflow(organizationId: string, workflow: Omit<MoveInWorkflow, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('move_in_workflows')
    .insert([{ organization_id: organizationId, ...workflow }])
    .select()
    .single();
  if (error) throw error;
  return data as MoveInWorkflow;
}

export async function createMoveOutWorkflow(organizationId: string, workflow: Omit<MoveOutWorkflow, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('move_out_workflows')
    .insert([{ organization_id: organizationId, ...workflow }])
    .select()
    .single();
  if (error) throw error;
  return data as MoveOutWorkflow;
}

// ========== ACQUISITION ==========

export async function getAcquisitionTargets(organizationId: string) {
  const { data, error } = await supabaseAdmin
    .from('acquisition_targets')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as AcquisitionTarget[];
}

export async function createAcquisitionTarget(organizationId: string, target: Omit<AcquisitionTarget, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('acquisition_targets')
    .insert([{ organization_id: organizationId, ...target }])
    .select()
    .single();
  if (error) throw error;
  return data as AcquisitionTarget;
}
