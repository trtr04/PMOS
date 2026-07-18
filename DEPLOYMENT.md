# Deploy PMOS Forum with Supabase + Vercel

## 1. Create Supabase data services

1. Create a project at [Supabase](https://supabase.com/dashboard).
2. In **Authentication → Providers**, enable **Anonymous sign-ins**. Visitors will receive a private anonymous account without seeing a login screen.
3. Open **SQL Editor**, paste and run [supabase/schema.sql](supabase/schema.sql).
4. In **Project Settings → API Keys**, copy the Project URL and the **publishable** key. Do not use a secret/service-role key in this website.

## 2. Test locally

1. Copy `.env.example` to `.env` and replace both values.
2. Install and run:

```bash
npm install
npm run dev
```

3. In a normal browser and an incognito window, create posts, comments, likes, and an image post. Each browser has its own anonymous account. Both must see the same forum data; each may delete only its own post.

## 3. Publish with GitHub and Vercel

1. Create a GitHub repository and push this project. Do not commit `.env`.
2. At [Vercel](https://vercel.com/new), choose **Add New → Project**, import the GitHub repository, and use Vite as the framework preset.
3. In Project → Settings → Environment Variables, add these for **Production**, **Preview**, and **Development**:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

4. Click **Deploy**. Vercel produces a public `*.vercel.app` URL.
5. Optionally add a custom domain in Vercel Project → Settings → Domains.

Every push to GitHub creates a deployment; pushes/merges to `main` update production. A pull request receives a separate preview URL.

## Security boundary

The publishable key is intentionally exposed in the browser; RLS policies in `schema.sql` control data access. Never put a Supabase secret key in Vercel environment variables prefixed with `VITE_`, browser JavaScript, or GitHub.

Anonymous accounts are suitable for this MVP. Before public launch, add rate limiting, reporting/moderation, and a permanent login method so users do not lose ownership after clearing browser storage.
