'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { AcquisitionTarget } from '@/lib/types';

export default function AcquisitionPage() {
  const org = useOrganization();
  const [targets, setTargets] = useState<AcquisitionTarget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const { data, error } = await supabaseClient
        .from('acquisition_targets')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      
      if (!error) setTargets(data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading acquisition targets...</div>;

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Acquisition Toolkit</h1>
      
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
              <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusColor(target.acquisition_status)}`}>
                {target.acquisition_status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {targets.length === 0 && (
        <div className="text-gray-500 text-center py-8">No acquisition targets found. Create one to get started.</div>
      )}
    </div>
  );
}
