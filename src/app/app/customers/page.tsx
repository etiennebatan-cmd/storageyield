'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { Customer } from '@/lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CustomersPage() {
  const org = useOrganization();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === '1';
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    customer_type: 'individual',
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    preferred_language: 'nl',
    billing_address: '',
    vat_number: '',
    notes: ''
  });
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    if (isDemo) {
      // Demo mode: show empty list
      setCustomers([]);
      setLoading(false);
      return;
    }

    async function load() {
      const { data, error } = await supabaseClient
        .from('customers')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      
      if (!error) setCustomers(data || []);
      setLoading(false);
    }

    load();
  }, [org?.id, isDemo]);

  const handleCreate = async () => {
    if (!org?.id) return;
    setCreating(true);

    if (isDemo) {
      // Demo mode: just add to local state
      const newCustomer = {
        ...createForm,
        id: `demo-${Date.now()}`,
        organization_id: org.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id_status: 'pending',
        risk_status: 'normal'
      };
      setCustomers(prev => [newCustomer as any, ...prev]);
      setIsCreateOpen(false);
      setCreateForm({
        customer_type: 'individual',
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        preferred_language: 'nl',
        billing_address: '',
        vat_number: '',
        notes: ''
      });
      setSuccessMessage('Customer created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setCreating(false);
      return;
    }

    const { error } = await supabaseClient
      .from('customers')
      .insert({
        organization_id: org.id,
        customer_type: createForm.customer_type,
        first_name: createForm.first_name,
        last_name: createForm.last_name,
        company_name: createForm.customer_type === 'business' ? createForm.company_name : null,
        email: createForm.email,
        phone: createForm.phone,
        preferred_language: createForm.preferred_language,
        billing_address: createForm.billing_address,
        vat_number: createForm.vat_number,
        notes: createForm.notes,
        id_status: 'pending',
        risk_status: 'normal'
      });
    if (!error) {
      setCustomers(prev => [createForm as any, ...prev]);
      setIsCreateOpen(false);
      setCreateForm({
        customer_type: 'individual',
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        preferred_language: 'nl',
        billing_address: '',
        vat_number: '',
        notes: ''
      });
      setSuccessMessage('Customer created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setCreating(false);
  };

  if (loading) return <div className="p-4">Loading customers...</div>;

  return (
    <div className="p-4">
      {isDemo && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          Demo workspace enabled
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        {successMessage && (
          <div className="text-green-600 font-semibold">{successMessage}</div>
        )}
        <button onClick={() => setIsCreateOpen(!isCreateOpen)} className="px-4 py-2 bg-blue-500 text-white rounded">Create Customer</button>
      </div>

      {isCreateOpen && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Create Customer</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Customer Type</label>
              <select value={createForm.customer_type} onChange={(e) => setCreateForm(prev => ({ ...prev, customer_type: e.target.value }))} className="w-full p-2 border rounded">
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </div>
            {createForm.customer_type === 'individual' ? (
              <>
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input value={createForm.first_name} onChange={(e) => setCreateForm(prev => ({ ...prev, first_name: e.target.value }))} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input value={createForm.last_name} onChange={(e) => setCreateForm(prev => ({ ...prev, last_name: e.target.value }))} className="w-full p-2 border rounded" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium">Company Name</label>
                <input value={createForm.company_name} onChange={(e) => setCreateForm(prev => ({ ...prev, company_name: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={createForm.email} onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input value={createForm.phone} onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Preferred Language</label>
              <select value={createForm.preferred_language} onChange={(e) => setCreateForm(prev => ({ ...prev, preferred_language: e.target.value }))} className="w-full p-2 border rounded">
                <option value="nl">Dutch</option>
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Billing Address</label>
              <input value={createForm.billing_address} onChange={(e) => setCreateForm(prev => ({ ...prev, billing_address: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            {createForm.customer_type === 'business' && (
              <div>
                <label className="block text-sm font-medium">VAT Number</label>
                <input value={createForm.vat_number} onChange={(e) => setCreateForm(prev => ({ ...prev, vat_number: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Notes</label>
              <input value={createForm.notes} onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            <button onClick={handleCreate} disabled={creating} className="px-4 py-2 bg-blue-500 text-white rounded">
              {creating ? 'Creating...' : 'Create Customer'}
            </button>
          </div>
        </div>
      )}
      
      <div className="grid gap-2">
        {customers.map(customer => (
          <Link key={customer.id} href={`/app/customers/${customer.id}`} className="block p-3 border rounded hover:bg-gray-50">
            <div className="font-semibold">{customer.first_name} {customer.last_name}</div>
            <div className="text-sm text-gray-600">{customer.email}</div>
            <div className="text-xs text-gray-500">
              {customer.customer_type} • Risk: {customer.risk_status}
            </div>
          </Link>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-gray-500 text-center py-8">No customers found. Create one to get started.</div>
      )}
    </div>
  );
}
