import { notFound } from "next/navigation";
import { requireOrganizationAccess } from "@/lib/server/org-access";
import { createServerComponentClient } from "@/lib/supabase/server";
import { CustomerDetail } from "@/components/app/customer-detail";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export default async function CustomerPage({ params }: PageProps) {
  const { customerId } = await params;
  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: customer, error } = await supabase
    .from("customers")
    .select(`
      *,
      tenancies:tenancies(*),
      bookings:booking_requests(*),
      contracts:contracts(*),
      invoices:invoices(*),
      payments:payments(*),
      access_credentials:access_credentials(*),
      support_tickets:support_tickets(*)
    `)
    .eq("id", customerId)
    .in("organization_id", organizationIds)
    .single();

  if (error || !customer) notFound();

  return <CustomerDetail customer={customer} />;
}