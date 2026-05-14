'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { Tenancy, Customer, Unit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TenancyWithDetails extends Tenancy {
  customer?: Customer;
  unit?: Unit & { unit_code?: string };
}

export default function TenanciesPage() {
  const org = useOrganization();
  const [tenancies, setTenancies] = useState<TenancyWithDetails[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    customer_id: '',
    resource_id: '',
    start_date: '',
    monthly_rent: '',
    deposit_amount: '',
    billing_day: '1',
    status: 'reserved',
    payment_status: 'pending',
    access_status: 'pending'
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const [tenanciesRes, customersRes, unitsRes] = await Promise.all([
        supabaseClient
          .from('tenancies')
          .select('*, customers(*), units(*)')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('customers')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('units')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('status', 'available')
      ]);

      if (!tenanciesRes.error) setTenancies(tenanciesRes.data || []);
      if (!customersRes.error) setCustomers(customersRes.data || []);
      if (!unitsRes.error) setUnits(unitsRes.data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  const handleCreate = async () => {
    if (!org?.id) return;
    setCreating(true);
    const { error } = await supabaseClient
      .from('tenancies')
      .insert({
        organization_id: org.id,
        facility_id: units.find(u => u.id === createForm.resource_id)?.facility_id || '',
        customer_id: createForm.customer_id,
        resource_id: createForm.resource_id,
        status: createForm.status,
        start_date: createForm.start_date,
        monthly_rent: parseFloat(createForm.monthly_rent),
        deposit_amount: parseFloat(createForm.deposit_amount) || 0,
        billing_day: parseInt(createForm.billing_day),
        payment_status: createForm.payment_status,
        access_status: createForm.access_status
      });
    if (!error) {
      setTenancies(prev => [{ ...createForm, id: 'new' } as any, ...prev]);
      setIsCreateOpen(false);
      setCreateForm({
        customer_id: '',
        resource_id: '',
        start_date: '',
        monthly_rent: '',
        deposit_amount: '',
        billing_day: '1',
        status: 'reserved',
        payment_status: 'pending',
        access_status: 'pending'
      });
    }
    setCreating(false);
  };

  if (loading) return <div className="p-4">Loading tenancies...</div>;

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      reserved: 'bg-blue-100 text-blue-800',
      pending_move_in: 'bg-yellow-100 text-yellow-800',
      notice_given: 'bg-orange-100 text-orange-800',
      moved_out: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tenancies</h1>
        <button onClick={() => setIsCreateOpen(!isCreateOpen)} className="px-4 py-2 bg-blue-500 text-white rounded">Create Tenancy</button>
      </div>

      {isCreateOpen && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Create Tenancy</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Customer</label>
              <select value={createForm.customer_id} onChange={(e) => setCreateForm(prev => ({ ...prev, customer_id: e.target.value }))} className="w-full p-2 border rounded">
                <option value="">Select customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Unit</label>
              <select value={createForm.resource_id} onChange={(e) => setCreateForm(prev => ({ ...prev, resource_id: e.target.value }))} className="w-full p-2 border rounded">
                <option value="">Select unit</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    Unit {unit.id.slice(0, 8)} - {unit.unit_type_id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input type="date" value={createForm.start_date} onChange={(e) => setCreateForm(prev => ({ ...prev, start_date: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Monthly Rent (€)</label>
              <input type="number" value={createForm.monthly_rent} onChange={(e) => setCreateForm(prev => ({ ...prev, monthly_rent: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Deposit Amount (€)</label>
              <input type="number" value={createForm.deposit_amount} onChange={(e) => setCreateForm(prev => ({ ...prev, deposit_amount: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Billing Day</label>
              <input type="number" min="1" max="31" value={createForm.billing_day} onChange={(e) => setCreateForm(prev => ({ ...prev, billing_day: e.target.value }))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select value={createForm.status} onChange={(e) => setCreateForm(prev => ({ ...prev, status: e.target.value }))} className="w-full p-2 border rounded">
                <option value="reserved">Reserved</option>
                <option value="pending_move_in">Pending Move-in</option>
                <option value="active">Active</option>
              </select>
            </div>
            <button onClick={handleCreate} disabled={creating} className="px-4 py-2 bg-blue-500 text-white rounded">
              {creating ? 'Creating...' : 'Create Tenancy'}
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Unit</th>
              <th className="text-left p-2">Rent/mo</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Payment</th>
              <th className="text-left p-2">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {tenancies.map((tenancy: TenancyWithDetails) => (
              <tr key={tenancy.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-semibold">
                  <Link href={`/app/tenancies/${tenancy.id}`} className="text-blue-600 hover:underline">
                    {tenancy.customer?.first_name} {tenancy.customer?.last_name}
                  </Link>
                </td>
                <td className="p-2 text-gray-600">{tenancy.unit?.unit_code}</td>
                <td className="p-2">€{tenancy.monthly_rent}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(tenancy.status)}`}>
                    {tenancy.status}
                  </span>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    tenancy.payment_status === 'current' ? 'bg-green-100 text-green-800' :
                    tenancy.payment_status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenancy.payment_status}
                  </span>
                </td>
                <td className="p-2 text-gray-600">{tenancy.start_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tenancies.length === 0 && (
        <div className="text-gray-500 text-center py-8">No tenancies found.</div>
      )}
    </div>
  );
}
