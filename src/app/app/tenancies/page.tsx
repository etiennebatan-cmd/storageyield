'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { Tenancy, Customer, Unit } from '@/lib/types';

interface TenancyWithDetails extends Tenancy {
  customer?: Customer;
  unit?: Unit & { unit_code?: string };
}

export default function TenanciesPage() {
  const org = useOrganization();
  const [tenancies, setTenancies] = useState<TenancyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const { data, error } = await supabaseClient
        .from('tenancies')
        .select('*, customers(*), units(*)')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      
      if (!error) setTenancies(data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

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
      <h1 className="text-2xl font-bold mb-4">Tenancies</h1>
      
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
                  {tenancy.customer?.first_name} {tenancy.customer?.last_name}
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
