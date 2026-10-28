# Segments Cloud hosting website

Bitcoin mining hosting site for Segments Cloud (UAE). Next.js 16, React 19, TypeScript.

## Run locally
```bash
npm install
cp .env.example .env.local   # add RESEND_API_KEY to test the form
npm run dev                  # http://localhost:3000
```

## Checks (all must pass)
```bash
npm run lint && npm run typecheck && npm run build
grep -rn "TODO" src content   # what is still missing
```

## Where things live
- `content/` — source of truth for every fact; see `CLAUDE.md`
- `src/lib/site.ts` — all site facts, each naming its `content/` file
- `src/app/` — pages, enquiry API, sitemap, robots, social image
- `public/photos/` — compressed site photos (originals in `assets/photos/`)

## Deploy (Vercel)
Import the repo, set `RESEND_API_KEY` (and later `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`). The preview stays out of search engines until `NEXT_PUBLIC_ALLOW_INDEXING=true`.
