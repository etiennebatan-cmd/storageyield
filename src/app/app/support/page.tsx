'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';

export default function SupportPage() {
  const org = useOrganization();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!org?.id) return;

    async function load() {
      const { data, error } = await supabaseClient
        .from('support_tickets')
        .select('*, customers(first_name, last_name)')
        .eq('organization_id', org.id)
        .order('created_at', { ascending: false });
      
      if (!error) setTickets(data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading support...</div>;

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-100 text-red-800',
      waiting_customer: 'bg-yellow-100 text-yellow-800',
      waiting_operator: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
      
      <div className="grid gap-3">
        {tickets.map((ticket: any) => (
          <div key={ticket.id} className="p-4 border rounded hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{ticket.subject}</div>
                <div className="text-sm text-gray-600 mt-1">{ticket.message}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {ticket.customers?.first_name} {ticket.customers?.last_name} • {ticket.category}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-gray-500 text-center py-8">No support tickets found.</div>
      )}
    </div>
  );
}
