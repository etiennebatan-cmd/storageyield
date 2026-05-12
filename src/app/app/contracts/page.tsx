'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { Contract } from '@/lib/types';

export default function ContractsPage() {
  const org = useOrganization();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!org?.id) return;

    async function load() {
      const { data, error } = await supabaseClient
        .from('contracts')
        .select('*, customers(first_name, last_name), tenancies(monthly_rent)')
        .eq('organization_id', org.id)
        .order('created_at', { ascending: false });
      
      if (!error) setContracts(data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading contracts...</div>;

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-purple-100 text-purple-800',
      signed: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      terminated: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contracts</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-2">Number</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Start Date</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract: any) => (
              <tr key={contract.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-mono text-xs">{contract.contract_number}</td>
                <td className="p-2">
                  {contract.customers?.first_name} {contract.customers?.last_name}
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </td>
                <td className="p-2 text-gray-600">{contract.start_date}</td>
                <td className="p-2 text-gray-600">{new Date(contract.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contracts.length === 0 && (
        <div className="text-gray-500 text-center py-8">No contracts found.</div>
      )}
    </div>
  );
}
