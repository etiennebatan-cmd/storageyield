# StorageYield MVP

StorageYield is an online booking + revenue intelligence layer for independent self-storage operators.

## Tech stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, RLS)
- Zod + React Hook Form
- Recharts + date-fns

## Environment variables

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (optional; app can run with mocked email behavior)

## Supabase setup

1. Create a Supabase project.
2. Run SQL in `supabase/schema.sql`.
3. Enable Email auth (or your preferred provider) in Supabase Auth.
4. Set env vars in `.env.local`.

## Run locally

```bash
npm install
npm run dev
```

## Seed demo data

```bash
npm run seed:demo
```

## Simulate core operational flow

Run an end-to-end synthetic flow (org -> facility -> inventory -> lead -> booking -> conversion) to catch regressions early:

```bash
npm run simulate:flow
```

Use this after schema changes, booking workflow updates, or deployment checks as a feedback loop.

Then open `/demo` and `/app`. Demo mode loads a seeded operator workspace without Supabase auth unless `STORAGEYIELD_DEMO_MODE=false` or `NEXT_PUBLIC_STORAGEYIELD_DEMO_MODE=false`.

## Create a facility

Use onboarding flow at `/onboarding`:

1. Create organization
2. Create facility (with `public_slug`)
3. Create unit types
4. Add units manually or by CSV import (initial setup)

## Embed the widget

1. Go to `/app/settings`
2. Copy the widget URL/snippet
3. Embed in your site:

```html
<iframe src="https://yourdomain.com/widget/brussels-north-storage" width="100%" height="720" style="border:0;border-radius:12px;"></iframe>
```

The stable demo widget route is `/widget/brussels-north-storage`.

## Revenue decision workflow

The app navigation is organized around the live operating loop:

- Decision Inbox: approval-ready pricing, campaign, competitor, discount and booking decisions.
- Revenue Control Room: open decision value, what changed this week, money map, risk radar and data health.
- Booking Conversion: widget requests move through contacted, reserved, converted or lost states.
- Pricing Lab: raise, hold, discount, remap and experiment decisions by unit type.
- Market Radar: operator-selected competitors, manual price observations and unit mappings.
- Campaign Playbooks: signal-triggered seasonal and targeted promotions with performance tracking.
- Impact Report: approved decisions, simulated uplift, conversion impact and risks.
- Data & Integrations: booking capture, pricing rules, market rules and data health.

## Track competitors

Use `/app/competitors` to manage Market Radar. StorageYield does not assume every nearby facility is a competitor.

Workflow:

1. Add a tracked competitor with its website or pricing URL.
2. Assign it to one or more of your facilities.
3. Mark the relationship as `direct`, `partial`, `benchmark only`, or `ignore for pricing`.
4. Add competitor unit types, such as `3-4 m² unit` or `18-22 m² business unit`.
5. Enter manual price observations from pricing-page reviews.
6. Map your own unit types to competitor unit types with a comparability score.
7. Review `/app/facilities/[facilityId]/competitors` for our price vs market, freshness, and which competitors are used in revenue decisions.

Decision rules only use fresh direct and partial competitor prices by default. Benchmark-only competitors are displayed as evidence but excluded from calculations. Ignored competitors are never used.

Automated scraping is intentionally not part of the MVP. Future extraction should be implemented per website with permission and compliance checks. Placeholder fetchers live in `src/lib/competitors/priceFetchers.ts`.

## MVP limitations

- No Stripe/payment processing yet
- No full PMS replacement
- No access-control integration
- No automated Google Sheets sync (stub only)
- No competitor crawler automation; competitor prices are manually observed in the MVP

## Next steps

- Stripe payments and deposits
- Google Sheet sync connector
- PMS integrations
- Access control integrations
- Permission-aware competitor price extraction
- Automated weekly emails (Resend)
# storageyield
