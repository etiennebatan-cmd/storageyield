"use client";

import { useState } from "react";
import { Customer } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, CreditCard, MessageSquare, StickyNote } from "lucide-react";

interface CustomerDetailProps {
  customer: Customer & {
    tenancies: any[];
    bookings: any[];
    contracts: any[];
    invoices: any[];
    payments: any[];
    access_credentials: any[];
    support_tickets: any[];
  };
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{customer.first_name} {customer.last_name}</h1>
          <p className="text-muted-foreground">{customer.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Tenancy
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
            <MessageSquare className="h-4 w-4 mr-2" />
            Support Ticket
          </Button>
          <Button variant="outline" size="sm">
            <StickyNote className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tenancies">Tenancies ({customer.tenancies.length})</TabsTrigger>
          <TabsTrigger value="bookings">Bookings ({customer.bookings.length})</TabsTrigger>
          <TabsTrigger value="contracts">Contracts ({customer.contracts.length})</TabsTrigger>
          <TabsTrigger value="billing">Billing ({customer.invoices.length})</TabsTrigger>
          <TabsTrigger value="access">Access ({customer.access_credentials.length})</TabsTrigger>
          <TabsTrigger value="support">Support ({customer.support_tickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <p className="capitalize">{customer.customer_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p>{customer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Language</label>
                <p className="uppercase">{customer.preferred_language}</p>
              </div>
              <div>
                <label className="text-sm font-medium">ID Status</label>
                <Badge variant={customer.id_status === 'verified' ? 'default' : 'secondary'}>
                  {customer.id_status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Risk Status</label>
                <Badge variant={customer.risk_status === 'normal' ? 'default' : 'destructive'}>
                  {customer.risk_status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Billing Address</label>
                <p>{customer.billing_address}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenancies">
          <Card>
            <CardHeader>
              <CardTitle>Active Tenancies</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.tenancies.length === 0 ? (
                <p className="text-muted-foreground">No tenancies found.</p>
              ) : (
                <div className="space-y-2">
                  {customer.tenancies.map((tenancy) => (
                    <div key={tenancy.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Tenancy {tenancy.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {tenancy.status} • €{tenancy.monthly_rent}/month
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

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.bookings.length === 0 ? (
                <p className="text-muted-foreground">No bookings found.</p>
              ) : (
                <div className="space-y-2">
                  {customer.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Booking {booking.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.status} • {booking.unit_type_id}
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

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.contracts.length === 0 ? (
                <p className="text-muted-foreground">No contracts found.</p>
              ) : (
                <div className="space-y-2">
                  {customer.contracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{contract.contract_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {contract.status} • {contract.jurisdiction}
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

        <TabsContent value="billing">
          <Tabs defaultValue="invoices">
            <TabsList>
              <TabsTrigger value="invoices">Invoices ({customer.invoices.length})</TabsTrigger>
              <TabsTrigger value="payments">Payments ({customer.payments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="invoices">
              {customer.invoices.length === 0 ? (
                <p className="text-muted-foreground">No invoices found.</p>
              ) : (
                <div className="space-y-2">
                  {customer.invoices.map((invoice) => (
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
              {customer.payments.length === 0 ? (
                <p className="text-muted-foreground">No payments found.</p>
              ) : (
                <div className="space-y-2">
                  {customer.payments.map((payment) => (
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
              <CardTitle>Access Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.access_credentials.length === 0 ? (
                <p className="text-muted-foreground">No access credentials found.</p>
              ) : (
                <div className="space-y-2">
                  {customer.access_credentials.map((cred) => (
                    <div key={cred.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{cred.credential_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {cred.status} • {cred.access_level}
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

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.support_tickets.length === 0 ? (
                <p className="text-muted-foreground">No support tickets found.</p>
              ) : (
                <div className="space-y-2">
                  {customer.support_tickets.map((ticket) => (
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