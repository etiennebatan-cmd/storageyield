'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, CreditCard, AlertTriangle, Key } from 'lucide-react';
import type { Invoice, Payment } from '@/lib/types';

type BillingInvoice = Invoice & { customers?: { first_name: string; last_name: string } };
type BillingPayment = Payment & { customers?: { first_name: string; last_name: string } };

export default function BillingPage() {
  const org = useOrganization();
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [billingSchedules, setBillingSchedules] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [overdueItems, setOverdueItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const [inv, pay, sched, methods, overdue] = await Promise.all([
        supabaseClient
          .from('invoices')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('payments')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('billing_schedules')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('payment_methods')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('invoices')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .eq('status', 'overdue')
      ]);

      if (!inv.error) setInvoices(inv.data || []);
      if (!pay.error) setPayments(pay.data || []);
      if (!sched.error) setBillingSchedules(sched.data || []);
      if (!methods.error) setPaymentMethods(methods.data || []);
      if (!overdue.error) setOverdueItems(overdue.data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading billing...</div>;

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      issued: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-orange-100 text-orange-800',
      revoked: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          <Button variant="outline" size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          <TabsTrigger value="schedules">Billing Schedules ({billingSchedules.length})</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods ({paymentMethods.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue/Dunning ({overdueItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Invoice #</th>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Total</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Due Date</th>
                      <th className="text-left p-2">Outstanding</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice: BillingInvoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{invoice.invoice_number}</td>
                        <td className="p-2">
                          {invoice.customers?.first_name} {invoice.customers?.last_name}
                        </td>
                        <td className="p-2 font-semibold">€{invoice.total.toFixed(2)}</td>
                        <td className="p-2">
                          <Badge className={statusColor(invoice.status)}>{invoice.status}</Badge>
                        </td>
                        <td className="p-2">{invoice.due_date}</td>
                        <td className="p-2">€{invoice.outstanding_amount?.toFixed(2) || '0.00'}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">View</Button>
                            {invoice.status === 'issued' && (
                              <Button variant="outline" size="sm">Mark Paid</Button>
                            )}
                            {invoice.status === 'overdue' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Reminder
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Key className="h-4 w-4 mr-1" />
                                  Suspend Access
                                </Button>
                              </>
                            )}
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

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Method</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment: BillingPayment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{payment.payment_date || payment.created_at?.split('T')[0]}</td>
                        <td className="p-2">
                          {payment.customers?.first_name} {payment.customers?.last_name}
                        </td>
                        <td className="p-2 font-semibold">€{payment.amount.toFixed(2)}</td>
                        <td className="p-2">{payment.method}</td>
                        <td className="p-2">
                          <Badge className={statusColor(payment.status)}>{payment.status}</Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              {billingSchedules.length === 0 ? (
                <p className="text-muted-foreground">No billing schedules found.</p>
              ) : (
                <div className="space-y-2">
                  {billingSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Schedule {schedule.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {schedule.billing_cycle} • Day {schedule.billing_day} • {schedule.status}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <p className="text-muted-foreground">No payment methods found.</p>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{method.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.status} • {method.details}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Invoices & Dunning</CardTitle>
            </CardHeader>
            <CardContent>
              {overdueItems.length === 0 ? (
                <p className="text-muted-foreground">No overdue items found.</p>
              ) : (
                <div className="space-y-2">
                  {overdueItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded border-red-200 bg-red-50">
                      <div>
                        <p className="font-medium">{item.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.customers?.first_name} {item.customers?.last_name} • €{item.outstanding_amount?.toFixed(2)} overdue
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Send Reminder
                        </Button>
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4 mr-1" />
                          Suspend Access
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
