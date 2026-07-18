# PMOS Forum MVP

A runnable, dependency-free browser prototype for the PMOS experience-sharing forum.

## Run it

From this folder, run:

```bash
python3 -m http.server 5173
```

Then visit [http://localhost:5173](http://localhost:5173) in a browser.

## Included behaviour

- Browse newest posts and filter by category
- Guest read-only mode
- Demo login for creating posts, commenting, and liking
- Title/content validation and up to nine local image attachments
- One like per logged-in user
- One-level comments only
- Author-only post deletion
- Local browser persistence using `localStorage`

## Production handoff

The live version uses Supabase anonymous authentication, PostgreSQL, and Storage. Run [supabase/schema.sql](supabase/schema.sql) in a new Supabase project, then follow [DEPLOYMENT.md](DEPLOYMENT.md) to connect the repository to Vercel.
