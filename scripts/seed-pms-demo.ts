import { createClient } from '@supabase/supabase-js';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}. Copy .env.example to .env.local and fill it in.`);
    process.exit(1);
  }
  return value;
}

const supabaseUrl = requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDemoData() {
  console.log('🌱 Seeding StorageYield PMS demo data...');

  try {
    // Get or create organization
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);
    
    if (orgError) throw orgError;
    let organizationId: string;
    
    if (orgs && orgs.length > 0) {
      organizationId = orgs[0].id;
      console.log('📦 Using existing organization:', organizationId);
    } else {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (userError) throw userError;
      const userId = user?.[0]?.id || 'demo-user';
      
      const { data: newOrg, error: newOrgError } = await supabase
        .from('organizations')
        .insert([{ name: 'StorageYield Demo', owner_user_id: userId }])
        .select('id')
        .single();
      
      if (newOrgError) throw newOrgError;
      organizationId = newOrg.id;
      console.log('✅ Created organization:', organizationId);
    }

    // Get facilities
    const { data: facilities, error: facilError } = await supabase
      .from('facilities')
      .select('id, name')
      .eq('organization_id', organizationId)
      .limit(2);
    
    if (facilError) throw facilError;

    if (!facilities || facilities.length === 0) {
      console.log('⚠️  No facilities found. Please create facilities first.');
      return;
    }

    const facility1Id = facilities[0].id;
    const facility2Id = facilities[1]?.id || facility1Id;

    console.log(`✅ Using ${facilities.length} facilities`);

// Create or lookup customers
    console.log('👥 Creating customers...');
    const customerEmails = [
      'alice@example.com', 'bob@example.com', 'carlos@example.com',
      'diana@example.com', 'emma@example.com', 'frank@example.com',
      'grace@example.com', 'henry@example.com', 'isabella@example.com',
      'jack@example.com', 'kate@example.com', 'liam@example.com'
    ];

    const names = [
      'Alice', 'Bob', 'Carlos', 'Diana', 'Emma', 'Frank',
      'Grace', 'Henry', 'Isabella', 'Jack', 'Kate', 'Liam'
    ];

    const surnames = [
      'Smith', 'Jones', 'Garcia', 'Williams', 'Brown', 'Miller',
      'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez'
    ];

    const customerIds = await Promise.all(
      customerEmails.map(async (email, i) => {
        const { data: existingCustomer, error: lookupError } = await supabase
          .from('customers')
          .select('id')
          .eq('email', email)
          .single();

        if (lookupError && lookupError.code !== 'PGRST116') {
          throw lookupError;
        }

        if (existingCustomer?.id) {
          return existingCustomer.id;
        }

        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .insert([{
            organization_id: organizationId,
            customer_type: i % 3 === 0 ? 'business' : 'individual',
            first_name: names[i],
            last_name: surnames[i],
            company_name: i % 3 === 0 ? `Company ${i + 1}` : null,
            email,
            phone: `+32 4${String(i).padStart(2, '0')}1234567`,
            preferred_language: 'nl',
            billing_address: `Street ${i + 1}, City`,
            id_status: 'verified',
            risk_status: i === 8 ? 'watch' : 'normal'
          }])
          .select('id')
          .single();

        if (customerError) throw customerError;
        if (!customer?.id) throw new Error(`Failed to create customer: ${email}`);
        return customer.id;
      })
    );

    console.log(`✅ Prepared ${customerIds.length} customers`);

    // Get units
    const { data: units, error: unitError } = await supabase
      .from('units')
      .select('id, unit_code, current_rent_monthly')
      .eq('facility_id', facility1Id)
      .limit(10);
    
    if (unitError) throw unitError;
    console.log(`✅ Found ${units?.length || 0} units`);

    // Create tenancies
    console.log('🏠 Creating tenancies...');
    const today = new Date();
    const tenancies: string[] = [];

    // Create 8 active tenancies
    for (let i = 0; i < 8 && units && i < units.length; i++) {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - (30 + i * 10));
      
      const { data: tenancy, error: tenancyError } = await supabase
        .from('tenancies')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          customer_id: customerIds[i],
          resource_id: units[i].id,
          status: 'active',
          start_date: startDate.toISOString().split('T')[0],
          move_in_date: startDate.toISOString().split('T')[0],
          monthly_rent: units[i].current_rent_monthly || 200,
          deposit_amount: 500,
          billing_day: 1,
          access_status: 'active',
          payment_status: 'pending'
        }])
        .select('id')
        .single();
      
      if (tenancyError) throw tenancyError;
      tenancies.push((tenancy as any).id);
    }

    // Create 3 reserved tenancies
    if (units && units.length > 8) {
      for (let i = 8; i < 11 && i < units.length; i++) {
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + (5 + (i - 8) * 10));
        
        const { data: tenancy, error } = await supabase
          .from('tenancies')
          .insert([{
            organization_id: organizationId,
            facility_id: facility1Id,
            customer_id: customerIds[i],
            resource_id: units[i].id,
            status: 'reserved',
            start_date: startDate.toISOString().split('T')[0],
            monthly_rent: units[i].current_rent_monthly || 200,
            deposit_amount: 500,
            billing_day: 1,
            access_status: 'pending',
            payment_status: 'pending'
          }])
          .select('id')
          .single();
        
        if (error) throw error;
        tenancies.push((tenancy as any).id);
      }
    }

    console.log(`✅ Created ${tenancies.length} tenancies`);

    // Create contracts
    console.log('📋 Creating contracts...');
    for (let i = 0; i < Math.min(4, tenancies.length); i++) {
      const { data: contract, error } = await supabase
        .from('contracts')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          customer_id: customerIds[i],
          tenancy_id: tenancies[i],
          language: 'nl',
          jurisdiction: 'Belgium',
          status: i === 0 ? 'active' : i === 1 ? 'signed' : i === 2 ? 'sent' : 'draft',
          contract_number: `CONTRACT-2024-${String(i+1).padStart(3, '0')}`,
          start_date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        }])
        .select('id')
        .single();
      
      if (error) throw error;
    }
    console.log('✅ Created 4 contracts');

    // Create invoices
    console.log('💰 Creating invoices...');
    for (let i = 0; i < Math.min(6, tenancies.length); i++) {
      const daysAgo = 10 + i * 5;
      const invoiceDate = new Date(today);
      invoiceDate.setDate(invoiceDate.getDate() - daysAgo);
      
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      const isOverdue = i >= 4;
      const subtotal = 250;
      const vat = subtotal * 0.21;
      const invoiceNumber = `INV-${String(i + 1).padStart(4, '0')}`;

      const { data: existingInvoice, error: existingError } = await supabase
        .from('invoices')
        .select('id')
        .eq('invoice_number', invoiceNumber)
        .maybeSingle();

      if (existingError) throw existingError;

      let invoiceId: string;
      if (existingInvoice?.id) {
        invoiceId = existingInvoice.id;
      } else {
        const { data: invoice, error } = await supabase
          .from('invoices')
          .insert([{
            organization_id: organizationId,
            facility_id: facility1Id,
            customer_id: customerIds[i],
            tenancy_id: tenancies[i],
            invoice_number: invoiceNumber,
            invoice_date: invoiceDate.toISOString().split('T')[0],
            due_date: dueDate.toISOString().split('T')[0],
            status: isOverdue ? 'overdue' : i === 0 ? 'paid' : 'issued',
            subtotal,
            vat_amount: vat,
            total: subtotal + vat,
            outstanding_amount: isOverdue ? subtotal + vat : 0,
            currency: 'EUR'
          }])
          .select('id')
          .single();

        if (error) throw error;
        invoiceId = (invoice as any).id;
      }
      
      const { data: lines, error: linesError } = await supabase
        .from('invoice_lines')
        .select('id')
        .eq('invoice_id', invoiceId)
        .maybeSingle();

      if (linesError) throw linesError;

      if (!lines?.id) {
        await supabase
          .from('invoice_lines')
          .insert([{
            invoice_id: invoiceId,
            description: 'Monthly Storage Rent',
            quantity: 1,
            unit_price: subtotal,
            vat_rate: 21,
            line_total: subtotal,
            line_type: 'rent'
          }]);
      }
    }
    console.log('✅ Created 6 invoices');

    // Create payments
    console.log('💳 Creating payments...');
    for (let i = 0; i < 5; i++) {
      const paymentDate = new Date(today);
      paymentDate.setDate(paymentDate.getDate() - i * 7);
      
      await supabase
        .from('payments')
        .insert([{
          organization_id: organizationId,
          customer_id: customerIds[i],
          tenancy_id: tenancies[i],
          provider: 'manual',
          amount: 302.5,
          currency: 'EUR',
          status: i === 4 ? 'failed' : 'paid',
          payment_date: i === 4 ? null : paymentDate.toISOString(),
          method: 'bank_transfer'
        }]);
    }
    console.log('✅ Created 5 payments');

    // Create access credentials
    console.log('🔐 Creating access credentials...');
    for (let i = 0; i < Math.min(5, tenancies.length); i++) {
      await supabase
        .from('access_credentials')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          customer_id: customerIds[i],
          tenancy_id: tenancies[i],
          credential_type: i % 3 === 0 ? 'pin' : i % 3 === 1 ? 'qr' : 'manual_code',
          credential_reference: `CRED-${String(i+1).padStart(4, '0')}`,
          status: i === 0 ? 'active' : i === 1 ? 'suspended' : i === 2 ? 'active' : 'pending',
          provider: 'manual'
        }]);
    }
    console.log('✅ Created 5 access credentials');

    // Create access events
    console.log('🚪 Creating access events...');
    for (let i = 0; i < 10; i++) {
      const eventTime = new Date(today);
      eventTime.setHours(eventTime.getHours() - i * 2);
      
      await supabase
        .from('access_events')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          customer_id: customerIds[i % customerIds.length],
          tenancy_id: tenancies[i % tenancies.length],
          event_type: i % 4 === 0 ? 'entry' : i % 4 === 1 ? 'created' : i % 4 === 2 ? 'activated' : 'failed_entry',
          event_time: eventTime.toISOString(),
          source: i % 2 === 0 ? 'manual' : 'system',
          notes: i % 4 === 3 ? 'Access denied - code expired' : null
        }]);
    }
    console.log('✅ Created 10 access events');

    // Create tasks
    console.log('✅ Creating tasks...');
    const taskTypes = ['booking_followup', 'contract', 'billing', 'access', 'maintenance', 'move_in'];
    for (let i = 0; i < 8; i++) {
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + (i - 3));
      
      await supabase
        .from('tasks')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          related_customer_id: customerIds[i % customerIds.length],
          related_tenancy_id: tenancies[i % tenancies.length],
          task_type: taskTypes[i % taskTypes.length],
          title: `Task ${i+1}: ${['Follow up on booking', 'Review contract', 'Process invoice', 'Set up access', 'Schedule maintenance', 'Prepare move-in'][i % 6]}`,
          description: `Description for task ${i+1}`,
          priority: i % 4 === 0 ? 'urgent' : i % 4 === 1 ? 'high' : i % 4 === 2 ? 'medium' : 'low',
          status: i < 2 ? 'done' : i < 4 ? 'in_progress' : 'open',
          due_date: dueDate.toISOString().split('T')[0]
        }]);
    }
    console.log('✅ Created 8 tasks');

    // Create maintenance tickets
    console.log('🔧 Creating maintenance tickets...');
    const categories = ['cleaning', 'damage', 'access', 'security', 'lighting'];
    for (let i = 0; i < 4; i++) {
      await supabase
        .from('maintenance_tickets')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          resource_id: units?.[i]?.id,
          title: `Maintenance Ticket ${i+1}`,
          description: `Maintenance issue description ${i+1}`,
          category: categories[i],
          status: i === 0 ? 'resolved' : i === 1 ? 'in_progress' : 'open',
          priority: i % 2 === 0 ? 'high' : 'medium',
          estimated_cost: 100 + i * 50,
          actual_cost: i === 0 ? 120 : null
        }]);
    }
    console.log('✅ Created 4 maintenance tickets');

    // Create support tickets
    console.log('📞 Creating support tickets...');
    const supportCategories = ['booking', 'payment', 'access', 'contract', 'move_out'];
    for (let i = 0; i < 4; i++) {
      await supabase
        .from('support_tickets')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          customer_id: customerIds[i],
          tenancy_id: tenancies[i],
          subject: `Support Issue ${i+1}`,
          message: `Customer support message ${i+1}`,
          category: supportCategories[i],
          status: i === 0 ? 'resolved' : i === 1 ? 'waiting_customer' : 'open',
          priority: 'medium'
        }]);
    }
    console.log('✅ Created 4 support tickets');

    // Create move-in workflows
    console.log('🔑 Creating move-in workflows...');
    for (let i = 0; i < Math.min(3, tenancies.length); i++) {
      await supabase
        .from('move_in_workflows')
        .insert([{
          organization_id: organizationId,
          facility_id: facility1Id,
          tenancy_id: tenancies[i],
          customer_id: customerIds[i],
          resource_id: units?.[i]?.id,
          status: i === 0 ? 'completed' : i === 1 ? 'in_progress' : 'ready',
          customer_details_complete: i >= 0,
          contract_accepted: i >= 0,
          first_invoice_paid: i > 0,
          deposit_paid: i > 0,
          access_created: i >= 1,
          move_in_instructions_sent: i >= 1,
          unit_ready: i >= 1
        }]);
    }
    console.log('✅ Created 3 move-in workflows');

    // Create acquisition targets
    console.log('🎯 Creating acquisition targets...');
    const targets = [
      { name: 'StoreFlex Amsterdam', country: 'NL', region: 'Amsterdam', asset_type: 'self_storage', status: 'meeting' },
      { name: 'SecureBox Antwerp', country: 'BE', region: 'Antwerp', asset_type: 'garagebox', status: 'nda' },
      { name: 'BoxHub Brussels', country: 'BE', region: 'Brussels', asset_type: 'self_storage', status: 'reviewing' },
      { name: 'FlexSpace Ghent', country: 'BE', region: 'Ghent', asset_type: 'container', status: 'contacted' },
      { name: 'VaultLux Luxembourg', country: 'LU', region: 'Luxembourg', asset_type: 'archive', status: 'longlist' }
    ];

    const targetIds: string[] = [];
    for (const target of targets) {
      const { data: acqTarget, error } = await supabase
        .from('acquisition_targets')
        .insert([{
          organization_id: organizationId,
          name: target.name,
          country: target.country,
          region: target.region,
          asset_type: target.asset_type,
          estimated_units: Math.round(50 + Math.random() * 100),
          estimated_revenue: Math.round(50000 + Math.random() * 100000),
          acquisition_status: target.status,
          digital_weakness_score: Math.round(Math.random() * 100),
          automation_readiness_score: Math.round(Math.random() * 100)
        }])
        .select('id')
        .single();
      
      if (error) throw error;
      targetIds.push((acqTarget as any).id);
    }
    console.log(`✅ Created ${targetIds.length} acquisition targets`);

    // Create due diligence items
    console.log('📝 Creating due diligence items...');
    const ddCategories = ['financial', 'legal', 'commercial', 'technical', 'operational'];
    let ddCount = 0;
    for (const targetId of targetIds.slice(0, 2)) {
      for (let i = 0; i < 4; i++) {
        await supabase
          .from('due_diligence_items')
          .insert([{
            acquisition_target_id: targetId,
            category: ddCategories[i],
            item: `DD Item: ${ddCategories[i]} check ${i+1}`,
            status: i === 0 ? 'cleared' : i === 1 ? 'reviewed' : 'requested',
            owner: 'John Doe',
            notes: `Notes for DD item`
          }]);
        ddCount++;
      }
    }
    console.log(`✅ Created ${ddCount} due diligence items`);

    // Create integration plans
    console.log('📅 Creating integration plans...');
    let integrationCount = 0;
    for (const targetId of targetIds.slice(0, 2)) {
      const phases = ['day_0_15', 'day_15_30', 'day_30_60'];
      for (const phase of phases) {
        await supabase
          .from('integration_plans')
          .insert([{
            acquisition_target_id: targetId,
            phase,
            task: `Integration task for ${phase}`,
            status: 'not_started',
            owner: 'Project Manager'
          }]);
        integrationCount++;
      }
    }
    console.log(`✅ Created ${integrationCount} integration plans`);

    // Create capex items
    console.log('💸 Creating capex items...');
    const capexCategories = ['access', 'security', 'repairs', 'signage', 'software'];
    let capexCount = 0;
    for (const targetId of targetIds.slice(0, 3)) {
      for (let i = 0; i < 2; i++) {
        await supabase
          .from('capex_items')
          .insert([{
            acquisition_target_id: targetId,
            category: capexCategories[i],
            description: `CapEx item: ${capexCategories[i]}`,
            estimated_cost: 1000 + i * 500,
            priority: i === 0 ? 'high' : 'medium',
            status: 'pending'
          }]);
        capexCount++;
      }
    }
    console.log(`✅ Created ${capexCount} capex items`);

    console.log('\n✨ Demo data seeding complete!');
    console.log(`📊 Summary:`);
    console.log(`  - 12 customers`);
    console.log(`  - ${tenancies.length} tenancies`);
    console.log(`  - 4 contracts`);
    console.log(`  - 6 invoices`);
    console.log(`  - 5 payments`);
    console.log(`  - 5 access credentials`);
    console.log(`  - 10 access events`);
    console.log(`  - 8 tasks`);
    console.log(`  - 4 maintenance tickets`);
    console.log(`  - 4 support tickets`);
    console.log(`  - 3 move-in workflows`);
    console.log(`  - 5 acquisition targets`);
    console.log(`  - ${ddCount} due diligence items`);
    console.log(`  - ${integrationCount} integration plans`);
    console.log(`  - ${capexCount} capex items`);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

seedDemoData();
