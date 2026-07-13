# Deployment

## Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add a PostgreSQL database (Vercel Postgres, Neon, Supabase, or Railway).
4. Configure environment variables:

| Variable | Example |
|---|---|
| `DATABASE_URL` | `postgresql://…` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-domain.vercel.app` |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` |

5. Deploy. `vercel.json` runs `prisma generate && next build`.
6. Run migrations against production:

```bash
DATABASE_URL="…" npx prisma migrate deploy
DATABASE_URL="…" npm run db:seed   # optional demo data
```

### Notes

- Framework preset is Next.js (`vercel.json`).
- Do not set a custom `outputDirectory` — Next handles `.next`.
- Auth uses JWT sessions; no Prisma calls in Edge middleware.

## Docker Compose (local / self-host DB)

```bash
docker compose up -d   # PostgreSQL only
npm run db:migrate
npm run build
npm run start
```

## Production checklist

- [ ] Strong unique `AUTH_SECRET`
- [ ] `AUTH_URL` / `NEXTAUTH_URL` match the public origin
- [ ] `prisma migrate deploy` applied
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Optional: remove or rotate demo credentials after seeding

## Published URLs

After publish, pages are public at:

```
https://{host}/p/{projectSlug}/{pageSlug}
```

Authenticated draft preview:

```
https://{host}/preview/{projectId}/{pageId}
```
