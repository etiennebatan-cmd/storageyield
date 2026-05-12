'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { Customer } from '@/lib/types';

export default function CustomersPage() {
  const org = useOrganization();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

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
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading customers...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      
      <div className="grid gap-2">
        {customers.map(customer => (
          <div key={customer.id} className="p-3 border rounded hover:bg-gray-50">
            <div className="font-semibold">{customer.first_name} {customer.last_name}</div>
            <div className="text-sm text-gray-600">{customer.email}</div>
            <div className="text-xs text-gray-500">
              {customer.customer_type} • Risk: {customer.risk_status}
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-gray-500 text-center py-8">No customers found. Create one to get started.</div>
      )}
    </div>
  );
}
