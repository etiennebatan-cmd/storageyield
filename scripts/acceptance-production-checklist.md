# StorageYield Production Acceptance Checklist

Use this checklist for a real Supabase-backed concierge pilot. Demo acceptance passing is not proof that production auth/state is ready.

1. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
2. Run `supabase/schema.sql` against the target Supabase project, then run it once more to confirm it is rerunnable.
3. Start the app with `npm run dev`.
4. Open `/signup` and create an account.
5. If email confirmation is enabled, confirm the email and verify the confirmation returns through `/auth/callback`.
6. Log in at `/login`.
7. Confirm the app redirects to `/onboarding` for a first user with no organization.
8. Complete onboarding with organization, facility, unit types, unit counts and at least one competitor.
9. Confirm onboarding redirects to `/app/data-integrations`.
10. Confirm setup/data health reflects real created data and does not claim completion for missing records.
11. Generate signals/actions from Decision Inbox or Control Room.
12. Approve a pricing decision.
13. Confirm the matching `unit_types.current_street_rate_monthly` row changed in Supabase.
14. Open the production widget route for the onboarded facility public slug.
15. Submit a booking request.
16. Confirm the booking appears in `/app/booking-conversion`.
17. Convert the booking and assign an available unit.
18. Confirm the booking row is `converted` and the unit row is `occupied` with current rent and tenant start date.
19. Open `/app/impact-report` and confirm approved decisions and converted bookings are reflected.
20. Confirm unauthenticated `/app/decisions` redirects to `/login?next=/app/decisions`.
21. Confirm unauthenticated `/app/decisions?demo=1` still opens the demo workspace.
