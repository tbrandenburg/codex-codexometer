---
# Implementation Plan
**Project:** Codex Sentiment Monitor (Reddit)  
**Tech Stack:** Next.js 15.5.4, React 19, shadcn/ui 2.1.3, Supabase (Postgres + Edge Functions + Storage), Vercel deploy target.

---

## 1. Architecture Overview
- **Frontend:** Next.js App Router with React 19 features (async/streaming server components). shadcn/ui provides design system (buttons, tabs, cards, charts wrappers). Charts rendered with `@visx/xychart` for performant SVG-based visualizations compatible with React 19.
- **Backend:** Supabase Postgres for structured storage; Supabase Edge Functions (Deno) for ingestion/processing; Supabase Cron for scheduled polling; Supabase Auth (service key) securing admin-only endpoints. Next.js Route Handlers proxy read operations to avoid exposing service keys.
- **Data Pipeline:** Reddit polling Edge Function → raw staging table → cleaning & enrichment routine (Edge Function) → sentiment scoring via Hugging Face Inference API → daily aggregates materialized in Postgres views and refreshed by cron.
- **Hosting & CI/CD:** Frontend on Vercel; Supabase project hosts database/functions. GitHub Actions orchestrate lint/test/build, trigger Supabase migrations via `supabase db push`.

## 2. Data Model (Supabase)
| Table | Purpose | Key Columns |
| --- | --- | --- |
| `subreddits` | Reference list of monitored subs. | `id`, `name`, `display_name`, `is_active` |
| `reddit_items_raw` | Raw posts/comments ingested. | `id` (Reddit fullname), `subreddit_id`, `type` (`post`/`comment`), `ingested_at`, `payload` (JSONB) |
| `reddit_items_clean` | Normalized & filtered content. | `id`, `raw_id`, `subreddit_id`, `author`, `title`, `body`, `score`, `created_utc`, `permalink`, `is_removed`, `language`, `spam_score` |
| `sentiment_scores` | Model outputs. | `clean_id`, `sentiment` (`pos`/`neu`/`neg`), `confidence`, `model_version`, `inference_meta` |
| `daily_metrics` | Materialized aggregate table (or view). | `metric_date`, `subreddit_id`, `avg_sentiment`, `pos_count`, `neg_count`, `neu_count`, `total_items`, `top_keywords` (JSONB) |
| `keyword_counts` | Keyword frequency per day for drill-down. | `id`, `metric_date`, `subreddit_id`, `term`, `count`, `tfidf` |

### Indexing & Performance
- Index `reddit_items_raw.id`, `reddit_items_clean.subreddit_id`, `sentiment_scores.clean_id`, `daily_metrics.metric_date` (btree).
- Use trigram index on `reddit_items_clean.body` for search in drill-down modal.

## 3. Data Ingestion & Processing
1. **Reddit OAuth Setup:** Service account credentials stored in Supabase secrets. Edge function `fetchRedditBatch` pulls new posts/comments per subreddit using `after` pagination.
2. **Scheduling:** Supabase Cron triggers ingestion every 30 minutes. On cold start, CLI job `supabase functions invoke fetchRedditBatch --env-file` runs with `backfill=true` to populate last 90 days.
3. **Cleaning Stage:** Edge function `cleanAndStore` normalizes Markdown (use `removeMd`), detects language (fastText via npm package bundled in Deno compatibility layer), deduplicates via `pg_trgm` similarity >0.95, calculates simple spam score (karma, link density, user blacklist).
4. **Sentiment Scoring:** After cleaning insert, Postgres trigger enqueues row into `supabase.tasks` (background queue). Workers (Edge Function `scoreSentiment`) batch 50 items, call Hugging Face Inference API with DistilRoBERTa sentiment model, store results in `sentiment_scores`.
5. **Aggregation:** Nightly cron (02:00 UTC) runs stored procedure `refresh_daily_metrics()`:
   - Upsert daily metrics for each subreddit for last 7 days (rolling window) to account for late-arriving data.
   - Extract keywords via Postgres `tsvector` + `ts_rank_cd`. Persist top 30 terms per day per subreddit.
6. **Quality Sampling:** Procedure `sample_for_review(limit int)` selects stratified items by subreddit/confidence <0.6. Export as CSV via Supabase Storage for manual review.

## 4. API & Server-Side Interface
- **Supabase Policies:** Row Level Security enabled; service role used server-side. Public anon key limited to read-only on aggregates.
- **Next.js Route Handlers:**
  - `GET /api/metrics` → paginated daily metrics, filter by `subreddit` & `range`. Cached via Next.js Route segment config `revalidate = 1800`.
  - `GET /api/metrics/[date]` → includes keyword list & sentiment distribution.
  - `GET /api/examples` → returns top N posts/comments for a given day/subreddit with optional sentiment filter.
  - `POST /api/export` → server action generating CSV using `papaparse`; streams file to client.
- **Supabase Client:** Server Components use service role via Vercel Edge Config (protected). Client components use anon key for realtime updates (optional) limited to read aggregated tables/views.

## 5. Frontend Implementation
- **App Structure:**
  - `/app/(dashboard)/page.tsx` → server component fetching initial metrics (last 30 days). Uses Suspense/streaming for charts.
  - `/app/(dashboard)/layout.tsx` → wraps with shadcn `ThemeProvider`, global shell, sidebar.
  - `/app/(docs)/methodology/page.tsx` → static Markdown from `content/methodology.md`.
  - `/app/api/` directory for route handlers described above.
- **State & Data Fetch:** TanStack Query 5 for client-side interactions (day drill-down). Server components prefetch; hydration via `dehydrate`.
- **UI Components:**
  - `ChartCard` (line + bar using visx)
  - `SubredditTabs` (shadcn Tabs)
  - `DateRangePicker` (shadcn Calendar + presets)
  - `KeywordCloud` (SVG layout with D3 scale + shadcn Card)
  - `ExamplesDrawer` (Sheet component showing posts/comments)
  - `ExportButton` (server action invocation + progress state)
- **Theming & Accessibility:** Use shadcn presets, custom Tailwind config for brand colors. Ensure charts include accessible labels and keyboard navigation.

## 6. Operational Concerns
- **Secrets Management:**
  - Reddit API keys stored in Supabase `config vars` and mirrored in Vercel env variables for server-side calls.
  - Hugging Face token stored as Supabase secret used by Edge function.
- **Logging & Monitoring:** Supabase logs ingestion function runs; Vercel Observability monitors Route Handlers. Add Sentry SDK (browser + server) for error tracking.
- **Rate Limits:** Throttle Reddit requests (1 req/sec per subreddit). Maintain checkpoint (last `fullname`) per subreddit in `subreddits` table.
- **Caching:** Aggregated views cached at Postgres / Next.js layer. Use `stale-while-revalidate` for charts to keep UI snappy even if API quota hit.

## 7. Validation & QA
- **Automated Tests:**
  - Unit tests (Vitest) for data transformers and keyword extraction helpers.
  - Integration tests for API routes using Supabase test harness (`@supabase/supakit`).
  - Playwright smoke test covering dashboard load, tab switch, drill-down, CSV export.
- **Data QA Checklist:**
  - Weekly manual sampling workflow (download CSV, annotate, log accuracy).
  - Dashboard banner if `daily_metrics` last updated >6 hours ago.

## 8. Delivery Milestones
1. **Week 1:** Supabase schema, ingestion functions, Reddit auth. Initial backfill working.
2. **Week 2:** Cleaning pipeline, sentiment scoring integration, aggregation routines.
3. **Week 3:** Next.js dashboard skeleton, charts, drill-down, CSV export.
4. **Week 4:** Polish, QA, docs (methodology page, runbooks), deploy to production.

## 9. Deployment Checklist
- `pnpm install` (workspace). Ensure Node 22 runtime.
- `pnpm run lint`, `pnpm run test`, `pnpm run build`.
- `supabase functions deploy --project-ref <ref>` for each edge function.
- Seed `subreddits` table with target communities and backfill via CLI.
- Configure Vercel env variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `HUGGINGFACE_TOKEN`, `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`).
- Set Supabase Cron jobs: `fetchRedditBatch` every 30 minutes, `refresh_daily_metrics` nightly.

---

## 10. Open Questions
- Confirm acceptable latency for sentiment updates (currently up to 30 minutes).
- Decide on fallback if Hugging Face API throttles (queue retries vs. local model hosting).
- Clarify export size limits (cap at 5 MB?).
- Determine if realtime updates are needed (Supabase Realtime subscription) or static refresh suffices.
