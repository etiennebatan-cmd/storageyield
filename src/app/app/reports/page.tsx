'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, TrendingUp, Users, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
  const org = useOrganization();
  const [reports, setReports] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function loadReports() {
      // Load various report data
      const [rentRoll, occupancy, revenue, debtors, conversions, priceChanges, discounts, owner, portfolio] = await Promise.all([
        supabaseClient
          .from('tenancies')
          .select('*, customers(first_name, last_name), facilities(name)')
          .eq('organization_id', organizationId)
          .eq('status', 'active'),
        supabaseClient
          .from('units')
          .select('status, facility_id')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('payments')
          .select('amount, created_at')
          .eq('organization_id', organizationId)
          .eq('status', 'paid'),
        supabaseClient
          .from('invoices')
          .select('outstanding_amount, customers(first_name, last_name)')
          .eq('organization_id', organizationId)
          .gt('outstanding_amount', 0),
        supabaseClient
          .from('booking_requests')
          .select('status, created_at')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('units')
          .select('current_rent_monthly, updated_at')
          .eq('organization_id', organizationId)
          .not('current_rent_monthly', 'is', null),
        supabaseClient
          .from('units')
          .select('discount_monthly')
          .eq('organization_id', organizationId)
          .gt('discount_monthly', 0),
        supabaseClient
          .from('facilities')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('acquisition_targets')
          .select('*')
          .eq('organization_id', organizationId)
      ]);

      setReports({
        rentRoll: rentRoll.data || [],
        occupancy: occupancy.data || [],
        revenue: revenue.data || [],
        debtors: debtors.data || [],
        conversions: conversions.data || [],
        priceChanges: priceChanges.data || [],
        discounts: discounts.data || [],
        owner: owner.data || [],
        portfolio: portfolio.data || []
      });
      setLoading(false);
    }

    loadReports();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading reports...</div>;

  const totalRevenue = reports.revenue.reduce((sum: number, p: any) => sum + p.amount, 0);
  const totalOutstanding = reports.debtors.reduce((sum: number, d: any) => sum + d.outstanding_amount, 0);
  const occupancyRate = reports.occupancy.length > 0 ?
    (reports.occupancy.filter((u: any) => u.status === 'occupied').length / reports.occupancy.length * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="text-2xl font-bold">{reports.rentRoll.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Active Tenancies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div className="text-2xl font-bold">{occupancyRate}%</div>
            </div>
            <p className="text-xs text-muted-foreground">Occupancy Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="text-2xl font-bold">€{totalOutstanding.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Outstanding Debt</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rent-roll">
        <TabsList>
          <TabsTrigger value="rent-roll">Rent Roll</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="debtors">Aged Debtors</TabsTrigger>
          <TabsTrigger value="conversions">Lead Conversion</TabsTrigger>
          <TabsTrigger value="pricing">Price Changes</TabsTrigger>
          <TabsTrigger value="discounts">Discount Leakage</TabsTrigger>
          <TabsTrigger value="owner">Owner Report</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Report</TabsTrigger>
        </TabsList>

        <TabsContent value="rent-roll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rent Roll</CardTitle>
              <p className="text-sm text-muted-foreground">Current active tenancies and rent details</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Facility</th>
                      <th className="text-left p-2">Unit</th>
                      <th className="text-left p-2">Monthly Rent</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.rentRoll.map((tenancy: any) => (
                      <tr key={tenancy.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {tenancy.customers?.first_name} {tenancy.customers?.last_name}
                        </td>
                        <td className="p-2">{tenancy.facilities?.name}</td>
                        <td className="p-2">{tenancy.resource?.unit_code}</td>
                        <td className="p-2 font-semibold">€{tenancy.monthly_rent}</td>
                        <td className="p-2">
                          <Badge variant="default">{tenancy.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy by Resource Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Occupancy analysis by unit type and facility.</p>
              {/* Add occupancy charts/tables */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Revenue breakdown by facility and time period.</p>
              {/* Add revenue charts */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debtors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aged Debtors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Outstanding Amount</th>
                      <th className="text-left p-2">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.debtors.map((debtor: any) => (
                      <tr key={debtor.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {debtor.customers?.first_name} {debtor.customers?.last_name}
                        </td>
                        <td className="p-2 font-semibold text-red-600">€{debtor.outstanding_amount?.toFixed(2)}</td>
                        <td className="p-2">
                          <Badge variant="destructive">Overdue</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Booking to tenancy conversion rates and analysis.</p>
              {/* Add conversion funnel */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recent rent adjustments and pricing trends.</p>
              {/* Add price change history */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discount Leakage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analysis of discounts and their impact on revenue.</p>
              {/* Add discount analysis */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Owner Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Executive summary for facility owners.</p>
              {/* Add owner dashboard */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Multi-facility portfolio analysis.</p>
              {/* Add portfolio overview */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
