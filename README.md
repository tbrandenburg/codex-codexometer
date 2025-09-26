# Codexometer Demo

Codexometer Demo is a set of three parallel prototype dashboards that monitor sentiment across Codex-related Reddit communities. The project showcases how OpenAI Codex CLI, VS Code integration, and Codex Cloud agents can collaborate with GitHub and Vercel to deliver production-ready UI prototypes with minimal manual effort. All three variants were generated from a single PRD and implementation plan captured in this repository.

**🎥 Watch the Tutorial** ► [Codex Built 3 Apps In Parallel... While I Drank Coffee (Codex CLI, IDE, Web)](youtube.com/watch?v=PkJoZJ6aC98)

**🧰 Get the Builder Pack** ► [Codex Builder Pack](https://rebrand.ly/dc0eb5)

**🎯Join the Insiders Club** ► [Join for FREE](https://insiders.aioriented.dev)

---

## Documentation
- `docs/PRD.md` — Product Requirements Document produced with the Vector AI workflow from the lesson.
- `docs/IMPLEMENTATION.md` — Detailed implementation plan covering Supabase schema, ingestion jobs, API routes, and delivery milestones.

Keep these documents close while iterating; they capture the agreed product scope, architecture, and operational checklists referenced throughout the tutorial.

## Branch Lineup
| Branch | Availability | Highlights |
| --- | --- | --- |
| `attempt-version-1` | 🔒 Insiders Builder Pack | Light/dark mode toggle, deep methodology write-up, rich transparency log with a bold purple theme. |
| `attempt-version-2` | 🔒 Insiders Builder Pack | Improved visual hierarchy, drill-down modal showing example Reddit posts, methodology page, Codex-powered contrast fix. |
| `attempt-version-3` | ✅ Public (this repo) | Custom date-range picker, sentiment vs. volume comparison card, streamlined neutral theme, CSV export entry point. |

> Tip: Each variant ships with mock data and supporting assets so you can evaluate UX trade-offs quickly. Start from `main` for documentation, then move to the branch that matches your access level.

## 🚀 Insiders Club & Builder Pack
Join the [Insiders Club](https://insiders.aioriented.dev) to inlock the full bundle to get every Codex-generated variant along with premium assets:
- 🔐 Private GitHub access to `attempt-version-1` and `attempt-version-2`, including ongoing improvements.
- 🧠 Downloadable PRD prompts, Codex Cloud task logs, and high-resolution design exports.
- 📅 Early previews of future Codex workflow tutorials, plus members-only Q&A sessions.

Join the Insiders Club AI Builder Pack to deploy the entire sentiment suite and reuse the workflows in your own products.

## Tech Stack
- Next.js 15.5.4 (App Router, React 19 server components)
- shadcn/ui 2.1.3 for component primitives and theming
- visx charting utilities for visualizations
- Supabase (Postgres, Edge Functions, Storage) for the planned production backend
- Vercel for automated preview deployments
- pnpm for package management (Node.js 22 recommended)

## Getting Started
1. Clone the repository and fetch all branches available to you.
2. Checkout the variant you want to explore—for example, `git checkout attempt-version-3` if you are using the public demo branch.
3. Install dependencies with `pnpm install`.
4. Run the development server via `pnpm run dev` and open the indicated port (defaults to `http://localhost:3000`).
5. Preview builds are triggered automatically on Vercel when you push commits or open pull requests.

> The current UI uses mock sentiment data to illustrate interactions. Follow the implementation plan to connect Supabase ingestion, scoring, and aggregation pipelines when you are ready to work with live Reddit data.

## Recommended Workflow
- Use Codex CLI or the VS Code extension to spin up Codex Cloud agents for parallel feature exploration. The transcript illustrates running three background agents simultaneously to explore diverse UX directions.
- Comment on GitHub pull requests with `@codex` to offload targeted fixes (e.g., styling adjustments) and sync results back to your local workspace from Codex Cloud.
- Lean on Vercel preview deployments for rapid stakeholder feedback without switching local branches.

## Roadmap Highlights
- Wire up the Supabase data pipeline (Reddit ingestion, sentiment scoring, nightly aggregations).
- Harden automated testing (Vitest unit tests, API integration tests, Playwright dashboard smoke tests).
- Add monitoring (Sentry, Supabase logs) and freshness indicators before exposing live metrics.
- Refine the chosen UI variant with real data insights, accessibility tweaks, and performance profiling.

## Credits
This repository accompanies the Codex sentiment tracker tutorial episode, demonstrating how Codex Cloud, GitHub, and Vercel workflows can multiply developer output. Follow along with the video to see the end-to-end process in action.
