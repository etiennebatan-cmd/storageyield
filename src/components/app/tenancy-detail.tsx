"use client";

import { useState } from "react";
import { Tenancy } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, FileText, CreditCard, Key, CheckSquare, MessageSquare } from "lucide-react";

interface TenancyDetailProps {
  tenancy: Tenancy & {
    customer: any;
    facility: any;
    resource: any;
    contract: any;
    billing_schedule: any;
    invoices: any[];
    payments: any[];
    access_credential: any;
    move_in_workflow: any;
    tasks: any[];
    support_tickets: any[];
  };
}

export function TenancyDetail({ tenancy }: TenancyDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tenancy {tenancy.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">
            {tenancy.customer.first_name} {tenancy.customer.last_name} • {tenancy.facility.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Create Contract
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          <Button variant="outline" size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
          <Button variant="outline" size="sm">
            <Key className="h-4 w-4 mr-2" />
            Manage Access
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Support Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">€{tenancy.monthly_rent}</div>
            <p className="text-xs text-muted-foreground">Monthly Rent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Badge variant={tenancy.status === 'active' ? 'default' : 'secondary'}>
              {tenancy.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Tenancy Status</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Badge variant={tenancy.payment_status === 'current' ? 'default' : 'destructive'}>
              {tenancy.payment_status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Payment Status</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Badge variant={tenancy.access_status === 'active' ? 'default' : 'secondary'}>
              {tenancy.access_status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Access Status</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tenancy.tasks.length})</TabsTrigger>
          <TabsTrigger value="support">Support ({tenancy.support_tickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenancy Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Customer</label>
                <p>{tenancy.customer.first_name} {tenancy.customer.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Facility</label>
                <p>{tenancy.facility.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Resource</label>
                <p>{tenancy.resource.unit_code}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <p>{tenancy.start_date}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Move-in Date</label>
                <p>{tenancy.move_in_date}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Billing Day</label>
                <p>{tenancy.billing_day}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle>Contract</CardTitle>
            </CardHeader>
            <CardContent>
              {tenancy.contract ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Contract Number</label>
                      <p>{tenancy.contract.contract_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge>{tenancy.contract.status}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <p className="uppercase">{tenancy.contract.language}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Jurisdiction</label>
                      <p>{tenancy.contract.jurisdiction}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Mark Accepted</Button>
                    <Button variant="outline" size="sm">View Contract</Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No contract found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Tabs defaultValue="invoices">
            <TabsList>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="invoices">Invoices ({tenancy.invoices.length})</TabsTrigger>
              <TabsTrigger value="payments">Payments ({tenancy.payments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule">
              {tenancy.billing_schedule ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Billing Cycle</label>
                        <p className="capitalize">{tenancy.billing_schedule.billing_cycle}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Billing Day</label>
                        <p>{tenancy.billing_schedule.billing_day}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Next Billing Date</label>
                        <p>{tenancy.billing_schedule.next_billing_date}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Badge>{tenancy.billing_schedule.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-muted-foreground">No billing schedule found.</p>
              )}
            </TabsContent>
            <TabsContent value="invoices">
              {tenancy.invoices.length === 0 ? (
                <p className="text-muted-foreground">No invoices found.</p>
              ) : (
                <div className="space-y-2">
                  {tenancy.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{invoice.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">
                          €{invoice.total} • {invoice.status}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="payments">
              {tenancy.payments.length === 0 ? (
                <p className="text-muted-foreground">No payments found.</p>
              ) : (
                <div className="space-y-2">
                  {tenancy.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">€{payment.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.status} • {payment.method}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Credential</CardTitle>
            </CardHeader>
            <CardContent>
              {tenancy.access_credential ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <p className="capitalize">{tenancy.access_credential.credential_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge>{tenancy.access_credential.status}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Access Level</label>
                      <p className="capitalize">{tenancy.access_credential.access_level}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Valid From</label>
                      <p>{tenancy.access_credential.valid_from}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Activate</Button>
                    <Button variant="outline" size="sm">Suspend</Button>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No access credential found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Move-in Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              {tenancy.move_in_workflow ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={tenancy.move_in_workflow.contract_accepted} />
                    <label className="text-sm">Contract accepted</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={tenancy.move_in_workflow.first_invoice_paid} />
                    <label className="text-sm">First invoice paid</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={tenancy.move_in_workflow.deposit_paid} />
                    <label className="text-sm">Deposit paid</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={tenancy.move_in_workflow.access_created} />
                    <label className="text-sm">Access created</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={tenancy.move_in_workflow.move_in_instructions_sent} />
                    <label className="text-sm">Move-in instructions sent</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={tenancy.move_in_workflow.unit_ready} />
                    <label className="text-sm">Unit ready</label>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No move-in workflow found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tenancy.tasks.length === 0 ? (
                <p className="text-muted-foreground">No tasks found.</p>
              ) : (
                <div className="space-y-2">
                  {tenancy.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {task.status} • {task.priority}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Complete</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {tenancy.support_tickets.length === 0 ? (
                <p className="text-muted-foreground">No support tickets found.</p>
              ) : (
                <div className="space-y-2">
                  {tenancy.support_tickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.status} • {ticket.priority}
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
      </Tabs>
    </div>
  );
}