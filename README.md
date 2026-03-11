# Shkoli.bg Client

React + TypeScript + Vite SPA for public course and lyceum discovery.

## Stack

- React 18
- TypeScript
- Vite
- React Router v6
- React Query
- Axios
- Tailwind CSS
- react-hook-form + Zod
- i18next

## Development

```bash
npm ci
npm run dev
```

## Quality Gates

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## SEO Build Pipeline

Use the SEO production pipeline for deploy-ready artifacts:

```bash
npm run build:seo
```

This pipeline runs:

1. `seo:sync-content` - pulls route content IDs from backend APIs and updates `public/seo-content-map.json`.
2. `seo:generate` - generates:
   - `public/robots.txt`
   - `public/sitemap.xml` (+ split sitemap files when needed)
   - `public/seo-route-audit.json`
   - `public/site-map.html`
3. `build` - Vite production build.
4. `seo:prerender` - prerenders indexable routes to HTML in `dist/`.
5. `seo:validate` - validates metadata, canonicals, hreflang, H1, sitemap/robots consistency and writes `SEO_VERIFICATION.md`.

Prerender is tuned for faster CI/local runs by default:
- `SEO_PRERENDER_WORKERS=4`
- `SEO_PRERENDER_RETRIES=2`
- `SEO_ROUTE_READY_TIMEOUT_MS=10000`
- `SEO_PAGE_TIMEOUT_MS=20000`

You can override these when needed for stricter runs.
In GitHub Actions CI, the build step overrides this to a more conservative profile:
- `SEO_ALLOW_CACHE_ON_SYNC_FAILURE=false` (if SEO sync API is unreachable, dynamic routes are skipped instead of reused from cache)
- `SEO_PRERENDER_WORKERS=1`
- `SEO_PRERENDER_RETRIES=3`
- `SEO_ROUTE_READY_TIMEOUT_MS=30000`

## Performance Budgets

```bash
npm run perf:budget
```

Checks built asset budgets (largest JS chunk, total JS/CSS/image bytes).

## Environment

Configure variables in `.env` (`.env.example` documents all required keys), including:

- `VITE_API_BASE_URL`
- `VITE_SITE_URL`
- `VITE_SITE_NAME`
- `VITE_SEO_DEFAULT_IMAGE_PATH`
- `VITE_GOOGLE_SITE_VERIFICATION`

## Routing and SEO Notes

- Public indexable routes are locale-prefixed (`/bg/...`, `/en/...`).
- Filter/pagination query variants are canonicalized to base listing routes and set to `noindex,follow`.
- Auth/admin/profile/map/edit flows are blocked from indexation (`noindex` + robots disallow).
- Canonical URLs, hreflang, Open Graph, Twitter, and JSON-LD are centralized in `src/components/ui/SeoHead.tsx` and `src/services/seo.ts`.
- Nginx config normalizes trailing slashes, redirects legacy non-locale paths to locale URLs, and serves immutable asset caching.
