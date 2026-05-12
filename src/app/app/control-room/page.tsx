'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';

export default function ControlRoomPage() {
  const org = useOrganization();
  const [stats, setStats] = useState({
    todayMoveIns: 0,
    todayMoveOuts: 0,
    openBookings: 0,
    contractsNeedingAction: 0,
    unpaidTenants: 0,
    overdueTasks: 0,
    overallOccupancy: 0,
    totalRevenue: 0,
    outstandingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function loadStats() {
      const today = new Date().toISOString().split('T')[0];

      const [
        tenancies,
        bookings,
        contracts,
        invoices,
        tasks,
        units
      ] = await Promise.all([
        supabaseClient
          .from('tenancies')
          .select('*')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('booking_requests')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('status', 'requested'),
        supabaseClient
          .from('contracts')
          .select('*')
          .eq('organization_id', organizationId)
          .in('status', ['draft', 'sent', 'accepted']),
        supabaseClient
          .from('invoices')
          .select('total, status')
          .eq('organization_id', organizationId),
        supabaseClient
          .from('tasks')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('status', 'open'),
        supabaseClient
          .from('units')
          .select('*')
          .eq('organization_id', organizationId)
      ]);

      const moveIns = tenancies.data?.filter((t: { move_in_date: string | null }) => t.move_in_date === today).length || 0;
      const moveOuts = tenancies.data?.filter((t: { move_out_date: string | null }) => t.move_out_date === today).length || 0;
      const active = tenancies.data?.filter((t: { status: string }) => t.status === 'active').length || 0;
      const unpaid = tenancies.data?.filter((t: { payment_status: string }) => t.payment_status === 'overdue').length || 0;
      const totalUnits = units.data?.length || 1;
      const totalRevenue = invoices.data?.reduce((sum: number, inv: { total?: number }) => sum + (inv.total || 0), 0) || 0;
      const outstandingByStatus = invoices.data?.filter((inv: { status?: string }) => inv.status === 'overdue').length || 0;

      setStats({
        todayMoveIns: moveIns,
        todayMoveOuts: moveOuts,
        openBookings: bookings.data?.length || 0,
        contractsNeedingAction: contracts.data?.length || 0,
        unpaidTenants: unpaid,
        overdueTasks: tasks.data?.length || 0,
        overallOccupancy: Math.round((active / totalUnits) * 100),
        totalRevenue: Math.round(totalRevenue),
        outstandingInvoices: outstandingByStatus,
      });

      setLoading(false);
    }

    loadStats();
  }, [org?.id]);

  if (loading) return <div className="p-6">Loading control room...</div>;

  const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) => (
    <div className={`p-4 rounded border-2 ${color}`}>
      <div className="text-sm font-semibold text-gray-600">{label}</div>
      <div className="text-3xl font-bold mt-2">{icon} {value}</div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PMS Operations Dashboard</h1>
        <p className="text-gray-600">Real-time facility management overview</p>
      </div>

      {/* Today's Operations */}
      <div className="bg-blue-50 border rounded-lg p-4">
        <h2 className="font-bold text-lg mb-3">📅 Today&apos;s Operations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Move-Ins" value={stats.todayMoveIns} color="border-green-300" icon="✅" />
          <StatCard label="Move-Outs" value={stats.todayMoveOuts} color="border-orange-300" icon="👋" />
          <StatCard label="Open Bookings" value={stats.openBookings} color="border-blue-300" icon="📋" />
          <StatCard label="Contracts Pending" value={stats.contractsNeedingAction} color="border-purple-300" icon="📝" />
        </div>
      </div>

      {/* Operational Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-3">⚠️ Action Required</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Overdue Payments" value={stats.unpaidTenants} color="border-red-300" icon="🚨" />
          <StatCard label="Overdue Tasks" value={stats.overdueTasks} color="border-red-300" icon="⏰" />
          <StatCard label="Outstanding Invoices" value={stats.outstandingInvoices} color="border-red-300" icon="💰" />
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-3">📊 Portfolio Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          <div className="p-4 bg-white border rounded">
            <div className="text-sm font-semibold text-gray-600">Overall Occupancy</div>
            <div className="text-4xl font-bold mt-2">{stats.overallOccupancy}%</div>
          </div>
          <div className="p-4 bg-white border rounded">
            <div className="text-sm font-semibold text-gray-600">Total Monthly Revenue</div>
            <div className="text-3xl font-bold mt-2">€{stats.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span>PMS Status: <strong>Beschikbaar (Available)</strong></span>
        </div>
        <div className="text-xs text-gray-600 mt-2">
          ✓ Customers • ✓ Tenancies • ✓ Contracts • ✓ Invoices • ✓ Payments • ✓ Access Control •
          ✓ Tasks • ✓ Move-In/Out • ✓ Reports
        </div>
      </div>
    </div>
  );
}

