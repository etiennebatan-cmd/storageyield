'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { AccessCredential, AccessEvent } from '@/lib/types';

type AccessWithCustomer = AccessCredential & { customers?: { first_name: string; last_name: string } };
type AccessEventWithCustomer = AccessEvent & { customers?: { first_name: string; last_name: string } };

export default function AccessPage() {
  const org = useOrganization();
  const [credentials, setCredentials] = useState<AccessWithCustomer[]>([]);
  const [events, setEvents] = useState<AccessEventWithCustomer[]>([]);
  const [activeTab, setActiveTab] = useState<'credentials' | 'events'>('credentials');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const [cred, evt] = await Promise.all([
        supabaseClient
          .from('access_credentials')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('access_events')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .order('event_time', { ascending: false })
          .limit(20)
      ]);
      
      if (!cred.error) setCredentials(cred.data || []);
      if (!evt.error) setEvents(evt.data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading access...</div>;

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-orange-100 text-orange-800',
      revoked: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      manual: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Access Control</h1>
      
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-4 py-2 ${activeTab === 'credentials' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
        >
          Credentials ({credentials.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 ${activeTab === 'events' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
        >
          Events ({events.length})
        </button>
      </div>

      {activeTab === 'credentials' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Reference</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Valid Until</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((cred: AccessWithCustomer) => (
                <tr key={cred.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {cred.customers?.first_name} {cred.customers?.last_name}
                  </td>
                  <td className="p-2 text-gray-600">{cred.credential_type}</td>
                  <td className="p-2 font-mono text-xs">{cred.credential_reference}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(cred.status)}`}>
                      {cred.status}
                    </span>
                  </td>
                  <td className="p-2 text-gray-600">{cred.valid_until || 'No limit'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Event</th>
                <th className="text-left p-2">Time</th>
                <th className="text-left p-2">Source</th>
                <th className="text-left p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: AccessEventWithCustomer) => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {event.customers?.first_name} {event.customers?.last_name}
                  </td>
                  <td className="p-2 text-gray-600">{event.event_type}</td>
                  <td className="p-2 text-gray-600">
                    {new Date(event.event_time).toLocaleString()}
                  </td>
                  <td className="p-2 text-xs">{event.source}</td>
                  <td className="p-2 text-gray-600 text-xs">{event.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(activeTab === 'credentials' && credentials.length === 0) ||
        (activeTab === 'events' && events.length === 0) && (
          <div className="text-gray-500 text-center py-8">
            No {activeTab} found.
          </div>
        )}
    </div>
  );
}
