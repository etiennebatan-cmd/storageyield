create extension if not exists "pgcrypto";

do $$
begin
  create type member_role as enum ('owner', 'admin', 'viewer');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type unit_status as enum ('available', 'occupied', 'reserved', 'maintenance', 'unavailable');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type tenant_type as enum ('private', 'business', 'unknown');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'lost');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type booking_status as enum ('requested', 'reserved', 'approved', 'rejected', 'cancelled', 'converted');
exception
  when duplicate_object then null;
end $$;

alter type booking_status add value if not exists 'contacted';
alter type booking_status add value if not exists 'lost';

do $$
begin
  create type recommendation_category as enum ('pricing', 'occupancy', 'unit_mix', 'collections', 'lead_conversion', 'b2b', 'operations');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type recommendation_priority as enum ('high', 'medium', 'low');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type recommendation_status as enum ('open', 'accepted', 'dismissed', 'completed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type competitor_status as enum ('active', 'inactive');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type competitor_relationship_type as enum ('direct', 'partial', 'benchmark', 'ignored');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type competitor_observation_method as enum ('manual', 'scrape_stub', 'import');
exception
  when duplicate_object then null;
end $$;

alter type competitor_observation_method add value if not exists 'future_scrape';

do $$
begin
  create type operator_priority as enum ('high', 'medium', 'low');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type signal_category as enum (
    'competitor_price_up',
    'competitor_price_down',
    'high_demand_unit_type',
    'low_occupancy_unit_type',
    'discount_leakage',
    'tenant_below_market',
    'arrears_risk',
    'booking_conversion_drop',
    'seasonal_campaign_opportunity',
    'large_unit_split_candidate',
    'stale_competitor_price'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type signal_severity as enum ('high', 'medium', 'low');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type operator_action_category as enum (
    'pricing',
    'discount_recovery',
    'booking_follow_up',
    'collections',
    'competitor_response',
    'campaign',
    'unit_mix',
    'b2b_growth'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type operator_action_status as enum ('proposed', 'approved', 'active', 'completed', 'dismissed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type campaign_status as enum ('draft', 'active', 'paused', 'completed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type campaign_customer_type as enum ('private', 'business', 'student', 'contractor', 'archive', 'e-commerce');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type campaign_objective as enum ('fill_vacancy', 'boost_demand', 'seasonal_campaign');
exception
  when duplicate_object then null;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role member_role not null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists facilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text not null,
  city text not null,
  country text not null,
  public_slug text not null unique,
  currency text not null default 'EUR',
  default_vat_rate numeric,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists unit_types (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  name text not null,
  size_m2 numeric not null,
  volume_m3 numeric,
  floor text,
  access_type text,
  description text,
  current_street_rate_monthly numeric not null,
  target_rate_monthly numeric,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  unit_type_id uuid not null references unit_types(id),
  unit_code text not null,
  status unit_status not null,
  current_rent_monthly numeric,
  current_tenant_type tenant_type,
  tenant_start_date date,
  discount_monthly numeric not null default 0,
  arrears_amount numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  unique (facility_id, unit_code)
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid not null references facilities(id) on delete cascade,
  unit_type_id uuid references unit_types(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_type tenant_type not null default 'unknown',
  preferred_move_in_date date,
  message text,
  source text not null default 'widget',
  status lead_status not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid not null references facilities(id) on delete cascade,
  unit_type_id uuid not null references unit_types(id),
  selected_unit_id uuid references units(id),
  lead_id uuid references leads(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_type tenant_type not null default 'unknown',
  preferred_move_in_date date,
  status booking_status not null default 'requested',
  quoted_monthly_rate numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid not null references facilities(id) on delete cascade,
  title text not null,
  description text not null,
  category recommendation_category not null,
  estimated_monthly_uplift numeric,
  priority recommendation_priority not null,
  status recommendation_status not null default 'open',
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  unit_type_id uuid references unit_types(id) on delete set null,
  title text not null,
  description text not null,
  exact_next_step text not null,
  category operator_action_category not null,
  estimated_monthly_uplift numeric,
  confidence numeric not null default 0.7,
  priority operator_priority not null default 'medium',
  status operator_action_status not null default 'proposed',
  evidence jsonb not null default '{}'::jsonb,
  linked_signal_ids uuid[] not null default '{}'::uuid[],
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  unit_type_id uuid references unit_types(id) on delete set null,
  title text not null,
  category signal_category not null,
  severity signal_severity not null default 'medium',
  evidence jsonb not null default '{}'::jsonb,
  linked_action_id uuid references actions(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists action_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  action_id uuid references actions(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid not null references facilities(id) on delete cascade,
  target_unit_type_id uuid references unit_types(id) on delete set null,
  name text not null,
  start_date date not null,
  end_date date not null,
  promotion_text text not null,
  target_customer_type campaign_customer_type not null default 'private',
  objective campaign_objective not null default 'boost_demand',
  status campaign_status not null default 'draft',
  leads_count integer not null default 0,
  bookings_count integer not null default 0,
  conversions_count integer not null default 0,
  estimated_rent_created numeric not null default 0,
  units_affected integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists pricing_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  unit_type_id uuid references unit_types(id) on delete cascade,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists seasonal_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  name text not null,
  period_start_month integer not null check (period_start_month between 1 and 12),
  period_end_month integer not null check (period_end_month between 1 and 12),
  target_customer_type campaign_customer_type,
  objective campaign_objective not null default 'seasonal_campaign',
  rule_text text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists competitors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  website_url text,
  pricing_url text,
  city text,
  address text,
  country text not null default 'Belgium',
  notes text,
  status competitor_status not null default 'active',
  last_observed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists facility_competitors (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  competitor_id uuid not null references competitors(id) on delete cascade,
  relationship_type competitor_relationship_type not null default 'direct',
  influence_weight numeric not null default 1.0,
  distance_km numeric,
  notes text,
  created_at timestamptz not null default now(),
  unique (facility_id, competitor_id)
);

create table if not exists competitor_unit_types (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references competitors(id) on delete cascade,
  name text not null,
  size_m2 numeric,
  volume_m3 numeric,
  access_type text,
  climate_controlled boolean,
  floor text,
  description text,
  source_url text,
  created_at timestamptz not null default now()
);

create table if not exists competitor_price_observations (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references competitors(id) on delete cascade,
  competitor_unit_type_id uuid references competitor_unit_types(id) on delete set null,
  observed_price_monthly numeric not null,
  currency text not null default 'EUR',
  promo_text text,
  availability_text text,
  source_url text,
  observed_at timestamptz not null,
  observation_method competitor_observation_method not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists competitor_unit_mappings (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  own_unit_type_id uuid not null references unit_types(id) on delete cascade,
  competitor_id uuid not null references competitors(id) on delete cascade,
  competitor_unit_type_id uuid not null references competitor_unit_types(id) on delete cascade,
  comparability_score numeric not null default 1.0,
  notes text,
  created_at timestamptz not null default now(),
  unique (facility_id, own_unit_type_id, competitor_unit_type_id)
);

create table if not exists competitor_prices (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  competitor_name text not null,
  city text,
  unit_size_m2 numeric not null,
  monthly_price numeric not null,
  source_url text,
  observed_at date not null,
  created_at timestamptz not null default now()
);

create table if not exists weekly_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id uuid references facilities(id) on delete set null,
  period_start date not null,
  period_end date not null,
  summary text not null,
  metrics jsonb not null,
  recommendations jsonb not null,
  created_at timestamptz not null default now()
);

alter table competitors add column if not exists last_observed_at timestamptz;

alter table users enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table facilities enable row level security;
alter table unit_types enable row level security;
alter table units enable row level security;
alter table leads enable row level security;
alter table booking_requests enable row level security;
alter table events enable row level security;
alter table recommendations enable row level security;
alter table actions enable row level security;
alter table signals enable row level security;
alter table action_events enable row level security;
alter table campaigns enable row level security;
alter table pricing_rules enable row level security;
alter table seasonal_rules enable row level security;
alter table competitors enable row level security;
alter table facility_competitors enable row level security;
alter table competitor_unit_types enable row level security;
alter table competitor_price_observations enable row level security;
alter table competitor_unit_mappings enable row level security;
alter table competitor_prices enable row level security;
alter table weekly_reports enable row level security;

create index if not exists competitors_organization_id_idx on competitors(organization_id);
create index if not exists actions_organization_status_idx on actions(organization_id, status, created_at desc);
create index if not exists actions_facility_idx on actions(facility_id, created_at desc);
create index if not exists signals_organization_created_idx on signals(organization_id, created_at desc);
create index if not exists signals_facility_category_idx on signals(facility_id, category, created_at desc);
create index if not exists action_events_action_id_idx on action_events(action_id, created_at desc);
create index if not exists campaigns_organization_status_idx on campaigns(organization_id, status, start_date);
create index if not exists campaigns_facility_idx on campaigns(facility_id, start_date);
create index if not exists pricing_rules_organization_idx on pricing_rules(organization_id, is_active);
create index if not exists seasonal_rules_organization_idx on seasonal_rules(organization_id, is_active);
create index if not exists facility_competitors_facility_id_idx on facility_competitors(facility_id);
create index if not exists facility_competitors_competitor_id_idx on facility_competitors(competitor_id);
create index if not exists competitor_unit_types_competitor_id_idx on competitor_unit_types(competitor_id);
create index if not exists competitor_price_observations_competitor_id_observed_at_idx on competitor_price_observations(competitor_id, observed_at desc);
create index if not exists competitor_price_observations_unit_type_idx on competitor_price_observations(competitor_unit_type_id, observed_at desc);
create index if not exists competitor_unit_mappings_facility_unit_type_idx on competitor_unit_mappings(facility_id, own_unit_type_id);
create index if not exists competitor_unit_mappings_competitor_idx on competitor_unit_mappings(competitor_id);

create or replace function is_org_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function is_org_owner(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role = 'owner'
  );
$$;

create or replace function is_valid_public_facility(org_id uuid, fac_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from facilities f
    where f.id = fac_id
      and f.organization_id = org_id
      and f.is_active = true
  );
$$;

create or replace function is_valid_public_unit_type(fac_id uuid, ut_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from unit_types ut
    join facilities f on f.id = ut.facility_id
    where ut.id = ut_id
      and ut.facility_id = fac_id
      and ut.is_public = true
      and f.is_active = true
  );
$$;

create or replace function setup_operator_onboarding(
  p_organization_name text,
  p_facility_name text,
  p_address text,
  p_city text,
  p_country text,
  p_public_slug text
)
returns table (organization_id uuid, facility_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text := nullif(auth.jwt() ->> 'email', '');
  v_organization_id uuid;
  v_facility_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if v_email is null then
    v_email := v_user_id::text || '@storageyield.local';
  end if;

  insert into users (id, email)
  values (v_user_id, v_email)
  on conflict (id) do update
    set email = excluded.email;

  insert into organizations (name, owner_user_id)
  values (trim(p_organization_name), v_user_id)
  returning id into v_organization_id;

  insert into organization_members (organization_id, user_id, role)
  values (v_organization_id, v_user_id, 'owner')
  on conflict (organization_id, user_id) do update
    set role = excluded.role;

  insert into facilities (
    organization_id,
    name,
    address,
    city,
    country,
    public_slug
  )
  values (
    v_organization_id,
    trim(p_facility_name),
    trim(p_address),
    trim(p_city),
    trim(p_country),
    lower(trim(p_public_slug))
  )
  returning id into v_facility_id;

  return query select v_organization_id, v_facility_id;
end;
$$;

create or replace function submit_widget_booking(
  p_facility_id uuid,
  p_unit_type_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text default null,
  p_customer_type text default 'unknown',
  p_preferred_move_in_date date default null,
  p_message text default null
)
returns table (lead_id uuid, booking_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_facility facilities%rowtype;
  v_customer_type tenant_type := coalesce(nullif(p_customer_type, ''), 'unknown')::tenant_type;
  v_lead_id uuid;
  v_booking_id uuid;
begin
  select *
  into v_facility
  from facilities
  where id = p_facility_id
    and is_active = true;

  if not found then
    raise exception 'Facility not found or inactive' using errcode = 'P0001';
  end if;

  if not exists (
    select 1
    from unit_types
    where id = p_unit_type_id
      and facility_id = p_facility_id
      and is_public = true
  ) then
    raise exception 'Unit type is not available for public booking' using errcode = 'P0001';
  end if;

  insert into leads (
    organization_id,
    facility_id,
    unit_type_id,
    customer_name,
    customer_email,
    customer_phone,
    customer_type,
    preferred_move_in_date,
    message,
    source,
    status
  )
  values (
    v_facility.organization_id,
    v_facility.id,
    p_unit_type_id,
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    nullif(trim(coalesce(p_customer_phone, '')), ''),
    v_customer_type,
    p_preferred_move_in_date,
    nullif(trim(coalesce(p_message, '')), ''),
    'widget',
    'new'
  )
  returning id into v_lead_id;

  insert into booking_requests (
    organization_id,
    facility_id,
    unit_type_id,
    lead_id,
    customer_name,
    customer_email,
    customer_phone,
    customer_type,
    preferred_move_in_date,
    status,
    quoted_monthly_rate
  )
  select
    v_facility.organization_id,
    v_facility.id,
    p_unit_type_id,
    v_lead_id,
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    nullif(trim(coalesce(p_customer_phone, '')), ''),
    v_customer_type,
    p_preferred_move_in_date,
    'requested',
    ut.current_street_rate_monthly
  from unit_types ut
  where ut.id = p_unit_type_id
  returning id into v_booking_id;

  insert into events (
    organization_id,
    facility_id,
    entity_type,
    entity_id,
    event_type,
    payload
  )
  values
    (
      v_facility.organization_id,
      v_facility.id,
      'lead',
      v_lead_id,
      'lead_created',
      jsonb_build_object(
        'unit_type_id', p_unit_type_id,
        'customer_type', v_customer_type,
        'source', 'widget'
      )
    ),
    (
      v_facility.organization_id,
      v_facility.id,
      'booking_request',
      v_booking_id,
      'booking_requested',
      jsonb_build_object('unit_type_id', p_unit_type_id)
    );

  return query select v_lead_id, v_booking_id;
end;
$$;

create or replace function get_public_unit_type_availability(p_facility_id uuid)
returns table (unit_type_id uuid, availability_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select u.unit_type_id, count(*)::bigint as availability_count
  from units u
  join facilities f on f.id = u.facility_id
  join unit_types ut on ut.id = u.unit_type_id
  where u.facility_id = p_facility_id
    and u.status = 'available'
    and f.is_active = true
    and ut.is_public = true
  group by u.unit_type_id;
$$;

create or replace function update_booking_status(
  p_booking_id uuid,
  p_status text,
  p_selected_unit_id uuid default null,
  p_quoted_monthly_rate numeric default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking booking_requests%rowtype;
  v_status booking_status := p_status::booking_status;
  v_unit units%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select *
  into v_booking
  from booking_requests
  where id = p_booking_id
  for update;

  if not found or not is_org_member(v_booking.organization_id) then
    raise exception 'Booking not found' using errcode = 'P0001';
  end if;

  if p_selected_unit_id is not null then
    select *
    into v_unit
    from units
    where id = p_selected_unit_id
    for update;

    if not found or v_unit.facility_id <> v_booking.facility_id then
      raise exception 'Selected unit does not belong to this booking facility' using errcode = 'P0001';
    end if;

    if v_status = 'converted' and v_unit.status not in ('available', 'reserved') and v_unit.id is distinct from v_booking.selected_unit_id then
      raise exception 'Selected unit is not available for conversion' using errcode = 'P0001';
    end if;
  end if;

  update booking_requests
  set
    status = v_status,
    selected_unit_id = p_selected_unit_id,
    quoted_monthly_rate = p_quoted_monthly_rate,
    updated_at = now()
  where id = p_booking_id;

  if v_status = 'converted' then
    if p_selected_unit_id is null then
      raise exception 'A selected unit is required to convert a booking' using errcode = 'P0001';
    end if;

    update units
    set
      status = 'occupied',
      current_rent_monthly = coalesce(p_quoted_monthly_rate, current_rent_monthly)
    where id = p_selected_unit_id;
  end if;

  insert into events (
    organization_id,
    facility_id,
    entity_type,
    entity_id,
    event_type,
    payload
  )
  values (
    v_booking.organization_id,
    v_booking.facility_id,
    'booking_request',
    p_booking_id,
    'booking_status_changed',
    jsonb_build_object(
      'status', v_status,
      'selected_unit_id', p_selected_unit_id,
      'quoted_monthly_rate', p_quoted_monthly_rate
    )
  );
end;
$$;

grant execute on function is_org_member(uuid) to anon, authenticated;
grant execute on function is_org_owner(uuid) to authenticated;
grant execute on function is_valid_public_facility(uuid, uuid) to anon, authenticated;
grant execute on function is_valid_public_unit_type(uuid, uuid) to anon, authenticated;
grant execute on function setup_operator_onboarding(text, text, text, text, text, text) to authenticated;
grant execute on function submit_widget_booking(uuid, uuid, text, text, text, text, date, text) to anon, authenticated;
grant execute on function get_public_unit_type_availability(uuid) to anon, authenticated;
grant execute on function update_booking_status(uuid, text, uuid, numeric) to authenticated;

drop policy if exists "users can read own profile" on users;
drop policy if exists "users can upsert own profile" on users;
drop policy if exists "members can read organizations" on organizations;
drop policy if exists "members can manage organizations" on organizations;
drop policy if exists "members can read org membership" on organization_members;
drop policy if exists "owner can manage org membership" on organization_members;
drop policy if exists "org members can read facilities" on facilities;
drop policy if exists "org members can manage facilities" on facilities;
drop policy if exists "public read active facilities by slug" on facilities;
drop policy if exists "org members unit_types" on unit_types;
drop policy if exists "public read unit types by active facility" on unit_types;
drop policy if exists "org members units" on units;
drop policy if exists "org members leads" on leads;
drop policy if exists "public create leads" on leads;
drop policy if exists "org members bookings" on booking_requests;
drop policy if exists "public create bookings" on booking_requests;
drop policy if exists "org members events" on events;
drop policy if exists "public insert events" on events;
drop policy if exists "org members recommendations" on recommendations;
drop policy if exists "org members actions" on actions;
drop policy if exists "org members signals" on signals;
drop policy if exists "org members action events" on action_events;
drop policy if exists "org members campaigns" on campaigns;
drop policy if exists "org members pricing rules" on pricing_rules;
drop policy if exists "org members seasonal rules" on seasonal_rules;
drop policy if exists "org members competitors" on competitors;
drop policy if exists "org members facility competitors" on facility_competitors;
drop policy if exists "org members competitor unit types" on competitor_unit_types;
drop policy if exists "org members competitor price observations" on competitor_price_observations;
drop policy if exists "org members competitor unit mappings" on competitor_unit_mappings;
drop policy if exists "org members competitor prices" on competitor_prices;
drop policy if exists "org members weekly reports" on weekly_reports;

create policy "users can read own profile" on users
for select
using (id = auth.uid());

create policy "users can upsert own profile" on users
for all
using (id = auth.uid())
with check (id = auth.uid());

create policy "members can read organizations" on organizations
for select
using (is_org_member(id));

create policy "members can manage organizations" on organizations
for all
using (is_org_member(id))
with check (is_org_member(id));

create policy "members can read org membership" on organization_members
for select
using (is_org_member(organization_id));

create policy "owner can manage org membership" on organization_members
for all
using (is_org_owner(organization_id))
with check (is_org_owner(organization_id));

create policy "org members can read facilities" on facilities
for select
using (is_org_member(organization_id));

create policy "org members can manage facilities" on facilities
for all
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

create policy "public read active facilities by slug" on facilities
for select
using (is_active = true);

create policy "org members unit_types" on unit_types
for all
using (
  exists (
    select 1
    from facilities f
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
)
with check (
  exists (
    select 1
    from facilities f
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
);

create policy "public read unit types by active facility" on unit_types
for select
using (
  is_public = true
  and exists (
    select 1
    from facilities f
    where f.id = facility_id
      and f.is_active = true
  )
);

create policy "org members units" on units
for all
using (
  exists (
    select 1
    from facilities f
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
)
with check (
  exists (
    select 1
    from facilities f
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
);

create policy "org members leads" on leads
for all
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

create policy "org members bookings" on booking_requests
for all
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

create policy "org members events" on events
for all
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

create policy "org members recommendations" on recommendations
for all
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

create policy "org members actions" on actions
for all
using (is_org_member(organization_id))
with check (
  is_org_member(organization_id)
  and (
    facility_id is null
    or exists (
      select 1
      from facilities f
      where f.id = facility_id
        and f.organization_id = actions.organization_id
    )
  )
  and (
    unit_type_id is null
    or exists (
      select 1
      from unit_types ut
      join facilities f on f.id = ut.facility_id
      where ut.id = unit_type_id
        and f.organization_id = actions.organization_id
    )
  )
);

create policy "org members signals" on signals
for all
using (is_org_member(organization_id))
with check (
  is_org_member(organization_id)
  and (
    facility_id is null
    or exists (
      select 1
      from facilities f
      where f.id = facility_id
        and f.organization_id = signals.organization_id
    )
  )
  and (
    unit_type_id is null
    or exists (
      select 1
      from unit_types ut
      join facilities f on f.id = ut.facility_id
      where ut.id = unit_type_id
        and f.organization_id = signals.organization_id
    )
  )
);

create policy "org members action events" on action_events
for all
using (is_org_member(organization_id))
with check (
  is_org_member(organization_id)
  and (
    action_id is null
    or exists (
      select 1
      from actions a
      where a.id = action_id
        and a.organization_id = action_events.organization_id
    )
  )
);

create policy "org members campaigns" on campaigns
for all
using (is_org_member(organization_id))
with check (
  is_org_member(organization_id)
  and exists (
    select 1
    from facilities f
    where f.id = facility_id
      and f.organization_id = campaigns.organization_id
  )
);

create policy "org members pricing rules" on pricing_rules
for all
using (is_org_member(organization_id))
with check (
  is_org_member(organization_id)
  and (
    facility_id is null
    or exists (
      select 1
      from facilities f
      where f.id = facility_id
        and f.organization_id = pricing_rules.organization_id
    )
  )
);

create policy "org members seasonal rules" on seasonal_rules
for all
using (is_org_member(organization_id))
with check (
  is_org_member(organization_id)
  and (
    facility_id is null
    or exists (
      select 1
      from facilities f
      where f.id = facility_id
        and f.organization_id = seasonal_rules.organization_id
    )
  )
);

create policy "org members competitors" on competitors
for all
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

create policy "org members facility competitors" on facility_competitors
for all
using (
  exists (
    select 1
    from facilities f
    join competitors c on c.id = competitor_id
    where f.id = facility_id
      and c.organization_id = f.organization_id
      and is_org_member(f.organization_id)
  )
)
with check (
  exists (
    select 1
    from facilities f
    join competitors c on c.id = competitor_id
    where f.id = facility_id
      and c.organization_id = f.organization_id
      and is_org_member(f.organization_id)
  )
);

create policy "org members competitor unit types" on competitor_unit_types
for all
using (
  exists (
    select 1
    from competitors c
    where c.id = competitor_id
      and is_org_member(c.organization_id)
  )
)
with check (
  exists (
    select 1
    from competitors c
    where c.id = competitor_id
      and is_org_member(c.organization_id)
  )
);

create policy "org members competitor price observations" on competitor_price_observations
for all
using (
  exists (
    select 1
    from competitors c
    where c.id = competitor_id
      and is_org_member(c.organization_id)
  )
)
with check (
  exists (
    select 1
    from competitors c
    where c.id = competitor_id
      and is_org_member(c.organization_id)
  )
  and (
    competitor_unit_type_id is null
    or exists (
      select 1
      from competitor_unit_types cut
      where cut.id = competitor_unit_type_id
        and cut.competitor_id = competitor_price_observations.competitor_id
    )
  )
);

create policy "org members competitor unit mappings" on competitor_unit_mappings
for all
using (
  exists (
    select 1
    from facilities f
    join unit_types ut on ut.id = own_unit_type_id and ut.facility_id = f.id
    join competitors c on c.id = competitor_id and c.organization_id = f.organization_id
    join competitor_unit_types cut on cut.id = competitor_unit_type_id and cut.competitor_id = c.id
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
)
with check (
  exists (
    select 1
    from facilities f
    join unit_types ut on ut.id = own_unit_type_id and ut.facility_id = f.id
    join competitors c on c.id = competitor_id and c.organization_id = f.organization_id
    join competitor_unit_types cut on cut.id = competitor_unit_type_id and cut.competitor_id = c.id
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
);

create policy "org members competitor prices" on competitor_prices
for all
using (
  exists (
    select 1
    from facilities f
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
)
with check (
  exists (
    select 1
    from facilities f
    where f.id = facility_id
      and is_org_member(f.organization_id)
  )
);

create policy "org members weekly reports" on weekly_reports
for all
using (is_org_member(organization_id))
with check (is_org_member(organization_id));
