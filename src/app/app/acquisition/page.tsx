'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckSquare, FileText, DollarSign, Zap } from 'lucide-react';
import type { AcquisitionTarget } from '@/lib/types';

export default function AcquisitionPage() {
  const org = useOrganization();
  const [targets, setTargets] = useState<AcquisitionTarget[]>([]);
  const [ddItems, setDdItems] = useState<any[]>([]);
  const [integrationPlans, setIntegrationPlans] = useState<any[]>([]);
  const [capexItems, setCapexItems] = useState<any[]>([]);
  const [automationScores, setAutomationScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const [targ, dd, plans, capex, scores] = await Promise.all([
        supabaseClient
          .from('acquisition_targets')
          .select('*')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('due_diligence_items')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('integration_plans')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('capex_items')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('automation_readiness_scores')
          .select('*')
          .eq('organization_id', organizationId)
      ]);

      if (!targ.error) setTargets(targ.data || []);
      if (!dd.error) setDdItems(dd.data || []);
      if (!plans.error) setIntegrationPlans(plans.data || []);
      if (!capex.error) setCapexItems(capex.data || []);
      if (!scores.error) setAutomationScores(scores.data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading acquisition...</div>;

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      longlist: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      meeting: 'bg-yellow-100 text-yellow-800',
      nda: 'bg-purple-100 text-purple-800',
      reviewing: 'bg-orange-100 text-orange-800',
      loi: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      closed: 'bg-green-200 text-green-900',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Acquisition Toolkit</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Target
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Create DD Checklist
          </Button>
        </div>
      </div>

      <Tabs defaultValue="targets">
        <TabsList>
          <TabsTrigger value="targets">Targets ({targets.length})</TabsTrigger>
          <TabsTrigger value="dd">DD Checklist ({ddItems.length})</TabsTrigger>
          <TabsTrigger value="integration">Integration Plans ({integrationPlans.length})</TabsTrigger>
          <TabsTrigger value="capex">Capex ({capexItems.length})</TabsTrigger>
          <TabsTrigger value="automation">Automation Readiness ({automationScores.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="targets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acquisition Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {targets.map((target: AcquisitionTarget) => (
                  <div key={target.id} className="p-4 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{target.name}</div>
                        <div className="text-sm text-gray-600">
                          {target.asset_type} • {target.country} {target.region && `• ${target.region}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Units: ~{Math.round(target.estimated_units || 0)} • Revenue: €{Math.round(target.estimated_revenue || 0).toLocaleString()}
                        </div>
                        {target.automation_readiness_score && (
                          <div className="text-xs mt-2">
                            Automation Score: {Math.round(target.automation_readiness_score)}%
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={statusColor(target.acquisition_status)}>
                          {target.acquisition_status}
                        </Badge>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {targets.length === 0 && (
                <div className="text-gray-500 text-center py-8">No acquisition targets found. Create one to get started.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dd" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              {ddItems.length === 0 ? (
                <p className="text-muted-foreground">No due diligence items found.</p>
              ) : (
                <div className="space-y-2">
                  {ddItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {integrationPlans.length === 0 ? (
                <p className="text-muted-foreground">No integration plans found.</p>
              ) : (
                <div className="space-y-2">
                  {integrationPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{plan.title}</p>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capex" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capital Expenditure</CardTitle>
            </CardHeader>
            <CardContent>
              {capexItems.length === 0 ? (
                <p className="text-muted-foreground">No capex items found.</p>
              ) : (
                <div className="space-y-2">
                  {capexItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          €{item.amount?.toLocaleString()} • {item.category}
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

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              {automationScores.length === 0 ? (
                <p className="text-muted-foreground">No automation scores found.</p>
              ) : (
                <div className="space-y-2">
                  {automationScores.map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{score.target_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Score: {Math.round(score.score)}% • {score.category}
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
      </Tabs>
    </div>
  );
}
