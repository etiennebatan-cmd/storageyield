import { notFound } from "next/navigation";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { createServerComponentClient } from "@/lib/supabase/server";
import { TenancyDetail } from "@/components/app/tenancy-detail";

interface PageProps {
  params: Promise<{ tenancyId: string }>;
}

export default async function TenancyPage({ params }: PageProps) {
  const { tenancyId } = await params;
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: tenancy, error } = await supabase
    .from("tenancies")
    .select(`
      *,
      customer:customers(*),
      facility:facilities(*),
      resource:units(*),
      contract:contracts(*),
      billing_schedule:billing_schedules(*),
      invoices:invoices(*),
      payments:payments(*),
      access_credential:access_credentials(*),
      move_in_workflow:move_in_workflows(*),
      tasks:tasks(*),
      support_tickets:support_tickets(*)
    `)
    .eq("id", tenancyId)
    .in("organization_id", organizationIds)
    .single();

  if (error || !tenancy) notFound();

  return <TenancyDetail tenancy={tenancy} />;
}