# Supabase migration status

## Completed foundation

- Browser client: `client/src/lib/supabase.ts`
- Anonymous identity helper: `ensureAnonymousSession()`
- Production database and RLS: `supabase/schema.sql`
- Environment variables: `.env.example`

## Required Supabase console actions

1. Open **Authentication → Providers** and enable **Anonymous sign-ins**.
2. Because this project already has forum tables, open **SQL Editor**, paste the whole of `supabase/001_health_and_team_extension.sql`, and run it once. Do not rerun the original all-in-one schema.
3. Confirm that `forum-images` exists in **Storage**.

## Application migration order

1. Replace Manus OAuth in `client/src/_core/hooks/useAuth.ts` with Supabase session state.
2. Replace the MySQL/Drizzle `server/healthDb.ts` implementation with Supabase Postgres calls.
3. Update tRPC context to read the Supabase access token, then migrate dashboard, check-in, calendar, profile and insights queries.
4. Remove Manus-only server modules and deploy the Vite site to Vercel.

The MySQL service remains in the repository until step 3 is tested. Do not run both databases as live production sources.
