# StorageYield

Your PMS stores data. StorageYield turns it into revenue decisions.

StorageYield is a concierge-pilot MVP for independent self-storage operators. It sits above existing tools and helps an operator decide which pricing, discount, competitor, booking and campaign decisions to approve this week to increase NOI. It is not a PMS replacement: it does not handle payments, access control, accounting, tenant portals or facility operations.

## Core Loop

Input data -> detect signals -> create decisions -> operator approves or rejects -> state changes -> impact is tracked -> weekly report shows what changed.

Primary product areas:

- Decision Inbox: approval-ready pricing, competitor, discount, booking and campaign decisions.
- Revenue Control Room: high-level revenue pressure, money map, live activity and data health.
- Market Radar: operator-selected competitors, manual price observations and market evidence.
- Pricing Lab: pricing opportunities, hold-price warnings, leakage and approved price changes.
- Booking Conversion: widget demand pipeline from request to converted tenant.
- Campaign Playbooks: signal-triggered revenue campaigns.
- Impact Report: approved/completed decisions, rent roll movement and conversion impact.
- Data & Integrations: setup checklist, widget installation and honest integration roadmap.

## Local Setup

```bash
npm ci
npm run dev
```

Open:

- Production app: `http://localhost:3000/app/decisions`
- Demo workspace: `http://localhost:3000/app/decisions?demo=1`
- Demo widget: `http://localhost:3000/widget/brussels-north-storage`
- Demo widget redirect: `http://localhost:3000/demo/widget`

## Environment Variables

Copy `.env.example` to `.env.local`.

Demo routes work without Supabase:

- `/demo`
- `/app/*?demo=1`
- `/widget/brussels-north-storage`

Force the whole app into demo mode only for local presentation:

```bash
NEXT_PUBLIC_STORAGEYIELD_FORCE_DEMO=true
```

Production mode requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` for seed/simulation scripts
- `RESEND_API_KEY` optional

Seed the StorageYield PMS demo data with:

```bash
npm run seed:pms
```

**Note:** Requires `.env.local` with valid Supabase credentials. The script will fail with clear instructions if missing.

By default `/app/*` uses production mode and loads Supabase-backed state. It does not silently fall back to demo data.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Re-run `supabase/schema.sql` once to verify idempotency.
4. Enable Email auth or your preferred auth provider.
5. In Supabase Auth URL settings, allow your local/site URL and use `https://yourdomain.com/auth/callback` or `http://localhost:3000/auth/callback` as the email redirect target.
6. Create an account, confirm email if required, then use `/onboarding` to create the first organization, facility, unit types, units and initial competitors.

The schema uses RLS so users can only access organization data where they are members. The public widget can read public facility/unit-type availability and create lead/booking records, but it cannot read private actions, signals, competitors, units or reports.

## Auth And First Workspace Flow

Production login is intentionally separate from demo mode:

1. `/signup` creates the Supabase auth user and sends confirmation to `/auth/callback`.
2. `/auth/callback` exchanges the auth code for a session, upserts the current user profile and routes first users to `/onboarding`.
3. `/login` verifies credentials, refreshes the session, checks whether an organization exists and routes to `/onboarding` or `/app/decisions`.
4. `/app/*` requires an authenticated user and an organization unless `?demo=1` is present.
5. `/onboarding` creates the first production workspace with unit types, units and optional selected competitors, then opens `/app/data-integrations` so the operator can see setup progress honestly.

## Demo Mode

Demo mode uses seeded data and localStorage. It is meant for live product demos and smoke tests without Supabase.

Working demo loop:

1. Open `/app/decisions?demo=1`.
2. Approve a pricing decision.
3. Confirm the visible unit price changes in Pricing Lab.
4. Open `/widget/brussels-north-storage`.
5. Submit a booking request.
6. Return to `/app/booking-conversion?demo=1`.
7. Move the booking through contacted/reserved/converted.
8. Open `/app/impact-report?demo=1` and confirm the report reflects approved decisions or booking conversions.

To reset demo state, use Data & Integrations or clear `storageyield.demoState` in localStorage.

## Production Mode

Production state persists through Supabase-backed API routes:

- `GET /api/storageyield/snapshot`
- `GET /api/actions`
- `POST /api/signals/generate`
- `POST /api/actions/generate`
- `POST /api/actions/approve`
- `POST /api/actions/dismiss`
- `POST /api/actions/complete`
- `POST /api/bookings/convert`
- `POST /api/unit-types/update-price`
- `POST /api/competitors/create`
- `POST /api/competitors/unit-types/create`
- `POST /api/competitors/observations/create`
- `POST /api/competitors/mappings/create`
- `POST /api/campaigns/launch`

Pricing approvals update `unit_types.current_street_rate_monthly` and create `action_events`/`events`. Booking conversion updates `booking_requests`, marks the selected unit occupied, sets current rent and logs an event.

## Booking Widget

Stable demo route:

```text
/widget/brussels-north-storage
```

Embed example:

```html
<iframe src="https://yourdomain.com/widget/brussels-north-storage" width="100%" height="720" style="border:0;border-radius:12px;"></iframe>
```

The widget captures customer name, email, phone, customer type, move-in date, message and selected unit type. In production it calls the Supabase `submit_widget_booking` function. In demo mode it updates localStorage so the request appears in Booking Conversion.

## Competitor Tracking

StorageYield does not automatically decide every nearby facility is a competitor. Operators choose tracked competitors.

Pilot workflow:

1. Add competitor name and pricing URL.
2. Assign competitor to one of your facilities.
3. Mark relationship: direct, partial, benchmark only, or ignore for pricing.
4. Add competitor unit types.
5. Map competitor unit types to your own unit types.
6. Enter manual price observations.
7. Generate signals and decisions.

Direct and partial competitors can influence decisions. Benchmark-only competitors are displayed as evidence but excluded by default. Ignored competitors are never used.

Automated competitor checks are not active in the MVP. Prices are manually verified during pilot setup.

## Verification

Run before handing off:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:acceptance
```

`npm run test:acceptance` runs blocker-focused pure checks first, then the browser demo flow. The pure checks cover evidence normalization, Money Map calculations, stable action generation keys, booking lead scoring, impact reporting, onboarding honesty and removal of the legacy signal engine.

Optional production smoke check with Supabase env vars:

```bash
npm run test:production-smoke
```

If this reports an RLS recursion error on `organization_members`, rerun the latest `supabase/schema.sql` in the target Supabase project. The current schema uses non-recursive membership policies required by the login/workspace guard.

Manual acceptance checklist:

- Open `/demo`.
- Open `/app/decisions?demo=1`.
- View evidence for a pricing decision.
- Approve a pricing decision.
- Confirm unit type price changed.
- Open `/app/impact-report?demo=1` and confirm approved action appears.
- Open `/widget/brussels-north-storage`.
- Submit booking request.
- Confirm booking appears in `/app/booking-conversion?demo=1`.
- Convert booking and assign a unit.
- Confirm unit becomes occupied and report updates.
- Add competitor price observation.
- Run signal/action generation.
- Confirm market-related decision appears.

Production pilot checklist:

- Configure Supabase env vars and run `supabase/schema.sql`.
- Create account at `/signup`.
- Confirm email if required and return through `/auth/callback`.
- Log in and confirm redirect to `/onboarding`.
- Complete onboarding with organization, facility, unit types, unit counts and at least one competitor.
- Confirm redirect to `/app/data-integrations` and verify setup/data health reflects the records created.
- Generate signals/actions.
- Approve pricing action and confirm Supabase `unit_types` row updated.
- Open the production widget for the facility public slug.
- Submit production booking and confirm it appears in Booking Conversion.
- Convert booking and confirm Supabase `booking_requests` and `units` rows update.
- Confirm Impact Report changes.

The full step-by-step production checklist lives in `scripts/acceptance-production-checklist.md`.

## Known MVP Limitations

- No payment processing.
- No access control integration.
- No tenant portal.
- No accounting.
- No automated competitor scraping.
- No native PMS integrations yet.
- No automated Google Sheets sync yet.
- Competitor prices are manually entered during the pilot.
- Production mode is intended for concierge pilots, not open self-serve scale.
