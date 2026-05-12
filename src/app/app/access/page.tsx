'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Key, AlertTriangle, Settings, Cpu } from 'lucide-react';
import type { AccessCredential, AccessEvent } from '@/lib/types';

type AccessWithCustomer = AccessCredential & { customers?: { first_name: string; last_name: string } };
type AccessEventWithCustomer = AccessEvent & { customers?: { first_name: string; last_name: string } };

export default function AccessPage() {
  const org = useOrganization();
  const [credentials, setCredentials] = useState<AccessWithCustomer[]>([]);
  const [events, setEvents] = useState<AccessEventWithCustomer[]>([]);
  const [suspended, setSuspended] = useState<AccessWithCustomer[]>([]);
  const [manualOverrides, setManualOverrides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const [cred, evt, susp, overrides] = await Promise.all([
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
          .limit(50),
        supabaseClient
          .from('access_credentials')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .eq('status', 'suspended'),
        supabaseClient
          .from('access_events')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('event_type', 'manual_override')
          .order('event_time', { ascending: false })
      ]);

      if (!cred.error) setCredentials(cred.data || []);
      if (!evt.error) setEvents(evt.data || []);
      if (!susp.error) setSuspended(susp.data || []);
      if (!overrides.error) setManualOverrides(overrides.data || []);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Access Control</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Manual Credential
          </Button>
          <Button variant="outline" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Log Manual Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="credentials">
        <TabsList>
          <TabsTrigger value="credentials">Credentials ({credentials.length})</TabsTrigger>
          <TabsTrigger value="events">Access Events ({events.length})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({suspended.length})</TabsTrigger>
          <TabsTrigger value="overrides">Manual Overrides ({manualOverrides.length})</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Reference</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Valid Until</th>
                      <th className="text-left p-2">Actions</th>
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
                          <Badge className={statusColor(cred.status)}>{cred.status}</Badge>
                        </td>
                        <td className="p-2">{cred.valid_until || 'No expiry'}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">Activate</Button>
                            <Button variant="outline" size="sm">Suspend</Button>
                            <Button variant="outline" size="sm">Revoke</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Event Type</th>
                      <th className="text-left p-2">Details</th>
                      <th className="text-left p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event: AccessEventWithCustomer) => (
                      <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{new Date(event.event_time).toLocaleString()}</td>
                        <td className="p-2">
                          {event.customers?.first_name} {event.customers?.last_name}
                        </td>
                        <td className="p-2">{event.event_type}</td>
                        <td className="p-2">{event.details}</td>
                        <td className="p-2">
                          <Badge variant={event.success ? 'default' : 'destructive'}>
                            {event.success ? 'Success' : 'Failed'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suspended Access</CardTitle>
            </CardHeader>
            <CardContent>
              {suspended.length === 0 ? (
                <p className="text-muted-foreground">No suspended credentials found.</p>
              ) : (
                <div className="space-y-2">
                  {suspended.map((cred) => (
                    <div key={cred.id} className="flex items-center justify-between p-3 border rounded border-orange-200 bg-orange-50">
                      <div>
                        <p className="font-medium">
                          {cred.customers?.first_name} {cred.customers?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cred.credential_type} • Suspended
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">Reactivate</Button>
                        <Button variant="outline" size="sm">Revoke</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overrides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Overrides</CardTitle>
            </CardHeader>
            <CardContent>
              {manualOverrides.length === 0 ? (
                <p className="text-muted-foreground">No manual overrides found.</p>
              ) : (
                <div className="space-y-2">
                  {manualOverrides.map((override) => (
                    <div key={override.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{override.event_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(override.event_time).toLocaleString()} • {override.details}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap: Hardware Integrations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Advanced access control systems are planned for future development.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded">
                  <Cpu className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Smart Locks Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Automated access control with RFID cards and mobile app integration.
                    </p>
                  </div>
                  <Badge variant="secondary">Q2 2026</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded">
                  <Settings className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-medium">IoT Gate Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Remote gate and barrier control with real-time monitoring.
                    </p>
                  </div>
                  <Badge variant="secondary">Q3 2026</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded">
                  <Key className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-medium">Biometric Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Fingerprint and facial recognition for enhanced security.
                    </p>
                  </div>
                  <Badge variant="secondary">Q4 2026</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
