import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizationAccess } from "@/lib/server/org-access";

const schema = z.object({
  booking_id: z.string().uuid(),
  unit_id: z.string().uuid(),
  rent: z.number().nonnegative().optional(),
  tenant_type: z.enum(["private", "business", "unknown"]).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const access = await requireOrganizationAccess();
  if ("error" in access) return access.error;
  const { supabase, organizationIds } = access;

  const { data: booking, error: bookingError } = await supabase
    .from("booking_requests")
    .select("id,organization_id,facility_id,unit_type_id,customer_name,customer_type,quoted_monthly_rate,email,phone")
    .eq("id", parsed.data.booking_id)
    .in("organization_id", organizationIds)
    .single();
  if (bookingError || !booking) return NextResponse.json({ error: "Booking access required" }, { status: 403 });

  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("id,facility_id,unit_type_id,status")
    .eq("id", parsed.data.unit_id)
    .single();
  if (unitError || !unit) return NextResponse.json({ error: "Unit not found" }, { status: 404 });
  if (unit.facility_id !== booking.facility_id || unit.unit_type_id !== booking.unit_type_id) {
    return NextResponse.json({ error: "Selected unit must belong to the booking facility and unit type" }, { status: 400 });
  }

  const rent = parsed.data.rent ?? Number(booking.quoted_monthly_rate ?? 0);
  const tenantType = parsed.data.tenant_type ?? booking.customer_type ?? "unknown";
  const today = new Date().toISOString().slice(0, 10);

  // Create or find customer
  let customerId: string;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", booking.email)
    .eq("organization_id", booking.organization_id)
    .single();
  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({
        organization_id: booking.organization_id,
        customer_type: tenantType === "business" ? "business" : "individual",
        first_name: booking.customer_name.split(" ")[0] || "Unknown",
        last_name: booking.customer_name.split(" ").slice(1).join(" ") || "Unknown",
        email: booking.email,
        phone: booking.phone,
        preferred_language: "nl",
        billing_address: "To be updated",
        id_status: "pending",
        risk_status: "normal"
      })
      .select("id")
      .single();
    if (customerError) return NextResponse.json({ error: customerError.message }, { status: 500 });
    customerId = newCustomer.id;
  }

  // Create tenancy
  const { data: tenancy, error: tenancyError } = await supabase
    .from("tenancies")
    .insert({
      organization_id: booking.organization_id,
      facility_id: booking.facility_id,
      customer_id: customerId,
      resource_id: parsed.data.unit_id,
      status: "pending_move_in",
      start_date: today,
      move_in_date: today,
      monthly_rent: rent,
      deposit_amount: 500,
      billing_day: 1,
      access_status: "pending",
      payment_status: "pending"
    })
    .select("id")
    .single();
  if (tenancyError) return NextResponse.json({ error: tenancyError.message }, { status: 500 });

  // Create draft contract
  const { data: contract, error: contractError } = await supabase
    .from("contracts")
    .insert({
      organization_id: booking.organization_id,
      facility_id: booking.facility_id,
      customer_id: customerId,
      tenancy_id: tenancy.id,
      language: "nl",
      jurisdiction: "Belgium",
      status: "draft",
      contract_number: `CONTRACT-${booking.id.slice(0, 8).toUpperCase()}`,
      start_date: today
    })
    .select("id")
    .single();
  if (contractError) return NextResponse.json({ error: contractError.message }, { status: 500 });

  // Create billing schedule
  const { error: billingError } = await supabase
    .from("billing_schedules")
    .insert({
      organization_id: booking.organization_id,
      tenancy_id: tenancy.id,
      frequency: "monthly",
      next_invoice_date: today,
      billing_day: 1,
      amount: rent,
      status: "active",
      auto_generate_invoice: false
    });
  if (billingError) return NextResponse.json({ error: billingError.message }, { status: 500 });

  // Create first invoice
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      organization_id: booking.organization_id,
      facility_id: booking.facility_id,
      customer_id: customerId,
      tenancy_id: tenancy.id,
      invoice_number: `INV-${booking.id.slice(0, 8).toUpperCase()}-001`,
      invoice_date: today,
      due_date: dueDate.toISOString().slice(0, 10),
      status: "issued",
      subtotal: rent,
      vat_amount: rent * 0.21,
      total: rent * 1.21,
      outstanding_amount: rent * 1.21,
      currency: "EUR"
    })
    .select("id")
    .single();
  if (invoiceError) return NextResponse.json({ error: invoiceError.message }, { status: 500 });

  // Create invoice lines
  const { error: lineError } = await supabase
    .from("invoice_lines")
    .insert({
      invoice_id: invoice.id,
      description: "Monthly Storage Rent",
      quantity: 1,
      unit_price: rent,
      vat_rate: 21,
      line_total: rent,
      line_type: "rent"
    });
  if (lineError) return NextResponse.json({ error: lineError.message }, { status: 500 });

  // Create move-in workflow
  const { error: workflowError } = await supabase
    .from("move_in_workflows")
    .insert({
      organization_id: booking.organization_id,
      facility_id: booking.facility_id,
      tenancy_id: tenancy.id,
      customer_id: customerId,
      resource_id: parsed.data.unit_id,
      status: "in_progress",
      customer_details_complete: true,
      contract_accepted: false,
      first_invoice_paid: false,
      deposit_paid: false,
      access_created: true,
      move_in_instructions_sent: false,
      unit_ready: true
    });
  if (workflowError) return NextResponse.json({ error: workflowError.message }, { status: 500 });

  // Create pending manual access credential
  const { error: accessError } = await supabase
    .from("access_credentials")
    .insert({
      organization_id: booking.organization_id,
      facility_id: booking.facility_id,
      customer_id: customerId,
      tenancy_id: tenancy.id,
      credential_type: "manual_code",
      credential_reference: `CODE-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      status: "pending",
      valid_from: today,
      provider: "manual"
    });
  if (accessError) return NextResponse.json({ error: accessError.message }, { status: 500 });

  // Create access event
  const { error: eventError } = await supabase
    .from("access_events")
    .insert({
      organization_id: booking.organization_id,
      facility_id: booking.facility_id,
      customer_id: customerId,
      tenancy_id: tenancy.id,
      event_type: "created",
      source: "system",
      notes: "Pending manual access credential created on booking conversion"
    });
  if (eventError) return NextResponse.json({ error: eventError.message }, { status: 500 });

  // Create tasks for missing items
  const tasks = [
    { title: "Accept contract", description: "Customer needs to accept the draft contract", task_type: "contract" },
    { title: "Pay first invoice", description: "Customer needs to pay the first invoice", task_type: "billing" },
    { title: "Pay deposit", description: "Customer needs to pay the deposit", task_type: "billing" },
    { title: "Create access credential", description: "Create manual access credential for customer", task_type: "access" },
    { title: "Send move-in instructions", description: "Send move-in instructions to customer", task_type: "move_in" },
    { title: "Prepare unit", description: "Ensure unit is ready for move-in", task_type: "maintenance" }
  ];
  for (const task of tasks) {
    await supabase
      .from("tasks")
      .insert({
        organization_id: booking.organization_id,
        facility_id: booking.facility_id,
        related_customer_id: customerId,
        related_tenancy_id: tenancy.id,
        related_resource_id: parsed.data.unit_id,
        task_type: task.task_type,
        title: task.title,
        description: task.description,
        priority: "high",
        status: "open",
        due_date: today
      });
  }

  // Update unit
  const { error: unitUpdateError } = await supabase
    .from("units")
    .update({
      status: "reserved",
      current_rent_monthly: rent,
      tenant_start_date: today,
      current_tenant_type: tenantType
    })
    .eq("id", parsed.data.unit_id);
  if (unitUpdateError) return NextResponse.json({ error: unitUpdateError.message }, { status: 500 });

  // Update booking
  const { data: updatedBooking, error: bookingUpdateError } = await supabase
    .from("booking_requests")
    .update({
      status: "converted",
      selected_unit_id: parsed.data.unit_id,
      quoted_monthly_rate: rent,
      updated_at: new Date().toISOString()
    })
    .eq("id", parsed.data.booking_id)
    .select("*")
    .single();
  if (bookingUpdateError) return NextResponse.json({ error: bookingUpdateError.message }, { status: 500 });

  await supabase.from("events").insert({
    organization_id: booking.organization_id,
    facility_id: booking.facility_id,
    entity_type: "booking_request",
    entity_id: booking.id,
    event_type: "booking_converted",
    payload: { selected_unit_id: parsed.data.unit_id, rent, tenant_type: tenantType, customer_id: customerId, tenancy_id: tenancy.id }
  });

  return NextResponse.json({ ok: true, booking: updatedBooking, customer_id: customerId, tenancy_id: tenancy.id });
}
