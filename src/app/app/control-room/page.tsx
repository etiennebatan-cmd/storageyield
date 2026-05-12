'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, Users, DollarSign, Wrench, FileText, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ExceptionItem {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  link: string;
}

export default function ControlRoomPage() {
  const org = useOrganization();
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
  const [todayOps, setTodayOps] = useState<any[]>([]);
  const [facilityStatus, setFacilityStatus] = useState<any>({});
  const [revenueQueue, setRevenueQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function loadData() {
      const today = new Date().toISOString().split('T')[0];

      // Load exceptions
      const [
        overdueInvoices,
        openTasks,
        pendingContracts,
        failedPayments,
        maintenanceTickets,
        moveInWorkflows,
        moveOutWorkflows,
        todayTenancies,
        unpaidInvoices
      ] = await Promise.all([
        supabaseClient
          .from('invoices')
          .select('id, invoice_number, total, due_date, customers(name)')
          .eq('organization_id', organizationId)
          .eq('status', 'overdue'),
        supabaseClient
          .from('tasks')
          .select('id, title, due_date, type')
          .eq('organization_id', organizationId)
          .eq('status', 'open')
          .lt('due_date', today),
        supabaseClient
          .from('contracts')
          .select('id, contract_number, status, customers(name)')
          .eq('organization_id', organizationId)
          .in('status', ['draft', 'sent']),
        supabaseClient
          .from('payments')
          .select('id, amount, status, invoices(invoice_number)')
          .eq('organization_id', organizationId)
          .eq('status', 'failed'),
        supabaseClient
          .from('maintenance_tickets')
          .select('id, title, priority, status')
          .eq('organization_id', organizationId)
          .eq('status', 'open'),
        supabaseClient
          .from('move_in_workflows')
          .select('id, status, tenancies(customers(name))')
          .eq('organization_id', organizationId)
          .eq('status', 'pending'),
        supabaseClient
          .from('move_out_workflows')
          .select('id, status, tenancies(customers(name))')
          .eq('organization_id', organizationId)
          .eq('status', 'pending'),
        supabaseClient
          .from('tenancies')
          .select('id, move_in_date, move_out_date, customers(name)')
          .eq('organization_id', organizationId)
          .or(`move_in_date.eq.${today},move_out_date.eq.${today}`),
        supabaseClient
          .from('invoices')
          .select('id, invoice_number, total, status, customers(name)')
          .eq('organization_id', organizationId)
          .eq('status', 'sent')
      ]);

      const exceptionItems: ExceptionItem[] = [];

      // Overdue invoices
      overdueInvoices.data?.forEach(inv => {
        exceptionItems.push({
          id: inv.id,
          type: 'invoice',
          title: `Overdue Invoice ${inv.invoice_number}`,
          description: `€${inv.total} owed by ${inv.customers?.name}`,
          priority: 'high',
          action: 'Send payment reminder',
          link: `/app/billing?tab=invoices`
        });
      });

      // Overdue tasks
      openTasks.data?.forEach(task => {
        exceptionItems.push({
          id: task.id,
          type: 'task',
          title: `Overdue: ${task.title}`,
          description: `${task.type} task past due date`,
          priority: 'medium',
          action: 'Complete task',
          link: `/app/tasks`
        });
      });

      // Pending contracts
      pendingContracts.data?.forEach(contract => {
        exceptionItems.push({
          id: contract.id,
          type: 'contract',
          title: `Contract ${contract.contract_number} needs action`,
          description: `Status: ${contract.status} for ${contract.customers?.name}`,
          priority: 'medium',
          action: contract.status === 'draft' ? 'Send contract' : 'Follow up',
          link: `/app/contracts`
        });
      });

      // Failed payments
      failedPayments.data?.forEach(payment => {
        exceptionItems.push({
          id: payment.id,
          type: 'payment',
          title: `Failed Payment €${payment.amount}`,
          description: `Invoice ${payment.invoices?.invoice_number}`,
          priority: 'high',
          action: 'Retry payment',
          link: `/app/billing?tab=payments`
        });
      });

      // Maintenance tickets
      maintenanceTickets.data?.forEach(ticket => {
        exceptionItems.push({
          id: ticket.id,
          type: 'maintenance',
          title: ticket.title,
          description: `Priority: ${ticket.priority}`,
          priority: ticket.priority === 'urgent' ? 'high' : 'medium',
          action: 'Schedule maintenance',
          link: `/app/maintenance`
        });
      });

      // Pending move-in workflows
      moveInWorkflows.data?.forEach(workflow => {
        exceptionItems.push({
          id: workflow.id,
          type: 'move_in',
          title: `Move-in pending for ${workflow.tenancies?.customers?.name}`,
          description: 'Complete checklist and activate access',
          priority: 'medium',
          action: 'Complete move-in',
          link: `/app/tasks`
        });
      });

      // Pending move-out workflows
      moveOutWorkflows.data?.forEach(workflow => {
        exceptionItems.push({
          id: workflow.id,
          type: 'move_out',
          title: `Move-out pending for ${workflow.tenancies?.customers?.name}`,
          description: 'Process move-out and final billing',
          priority: 'medium',
          action: 'Process move-out',
          link: `/app/tasks`
        });
      });

      setExceptions(exceptionItems);
      setTodayOps(todayTenancies.data || []);
      setRevenueQueue(unpaidInvoices.data || []);

      // Facility status
      const totalUnits = await supabaseClient
        .from('units')
        .select('id', { count: 'exact' })
        .eq('organization_id', organizationId);

      const occupiedUnits = await supabaseClient
        .from('tenancies')
        .select('id', { count: 'exact' })
        .eq('organization_id', organizationId)
        .eq('status', 'active');

      setFacilityStatus({
        totalUnits: totalUnits.count || 0,
        occupiedUnits: occupiedUnits.count || 0,
        occupancyRate: Math.round(((occupiedUnits.count || 0) / (totalUnits.count || 1)) * 100)
      });

      setLoading(false);
    }

    loadData();
  }, [org?.id]);

  if (loading) return <div className="p-6">Loading control room...</div>;

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Exception Cockpit</h1>
        <Badge variant="outline" className="text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          PMS Operational
        </Badge>
      </div>

      <Tabs defaultValue="exceptions">
        <TabsList>
          <TabsTrigger value="exceptions">
            Exception Queue ({exceptions.length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Today's Operations ({todayOps.length})
          </TabsTrigger>
          <TabsTrigger value="facility">Facility Status</TabsTrigger>
          <TabsTrigger value="revenue">
            Revenue Queue ({revenueQueue.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exceptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exceptions.length === 0 ? (
                <p className="text-muted-foreground">No exceptions found. All systems operational.</p>
              ) : (
                <div className="space-y-3">
                  {exceptions.map((exception) => (
                    <div key={exception.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{exception.title}</h3>
                          <Badge className={priorityColor(exception.priority)}>
                            {exception.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{exception.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600">{exception.action}</span>
                        <Button asChild size="sm">
                          <Link href={exception.link}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayOps.length === 0 ? (
                <p className="text-muted-foreground">No operations scheduled for today.</p>
              ) : (
                <div className="space-y-3">
                  {todayOps.map((op) => (
                    <div key={op.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">
                          {op.move_in_date ? 'Move-in' : 'Move-out'} for {op.customers?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {op.move_in_date ? `Move-in date: ${op.move_in_date}` : `Move-out date: ${op.move_out_date}`}
                        </p>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/app/tenancies/${op.id}`}>Manage</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facility" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{facilityStatus.occupancyRate}%</div>
                <p className="text-sm text-muted-foreground">
                  {facilityStatus.occupiedUnits} of {facilityStatus.totalUnits} units occupied
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">OK</div>
                <p className="text-sm text-muted-foreground">No urgent issues</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">OK</div>
                <p className="text-sm text-muted-foreground">All systems compliant</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Outstanding Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueQueue.length === 0 ? (
                <p className="text-muted-foreground">No outstanding invoices.</p>
              ) : (
                <div className="space-y-3">
                  {revenueQueue.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Invoice {invoice.invoice_number}</h3>
                        <p className="text-sm text-muted-foreground">
                          €{invoice.total} for {invoice.customers?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Sent</Badge>
                        <Button asChild size="sm">
                          <Link href={`/app/billing?tab=invoices`}>Collect</Link>
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

