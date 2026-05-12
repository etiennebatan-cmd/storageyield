'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { Invoice, Payment } from '@/lib/types';

type BillingInvoice = Invoice & { customers?: { first_name: string; last_name: string } };
type BillingPayment = Payment & { customers?: { first_name: string; last_name: string } };

export default function BillingPage() {
  const org = useOrganization();
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const [inv, pay] = await Promise.all([
        supabaseClient
          .from('invoices')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('payments')
          .select('*, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
      ]);
      
      if (!inv.error) setInvoices(inv.data || []);
      if (!pay.error) setPayments(pay.data || []);
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
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>
      
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 ${activeTab === 'invoices' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
        >
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 ${activeTab === 'payments' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
        >
          Payments ({payments.length})
        </button>
      </div>

      {activeTab === 'invoices' && (
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
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-2 text-gray-600">{invoice.due_date}</td>
                  <td className="p-2 text-red-600 font-semibold">
                    {invoice.outstanding_amount ? `€${invoice.outstanding_amount.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Method</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: BillingPayment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {payment.customers?.first_name} {payment.customers?.last_name}
                  </td>
                  <td className="p-2 font-semibold">€{payment.amount.toFixed(2)}</td>
                  <td className="p-2 text-gray-600">{payment.method}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-2 text-gray-600">
                    {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(activeTab === 'invoices' && invoices.length === 0) ||
        (activeTab === 'payments' && payments.length === 0) && (
          <div className="text-gray-500 text-center py-8">
            No {activeTab} found.
          </div>
        )}
    </div>
  );
}
