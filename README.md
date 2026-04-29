# s&box Jam

Game jam platform for [s&box](https://sbox.game). Handles registration, team formation, and submissions.

## Stack

- **CMS**: [Payload CMS](https://payloadcms.com/) on Next.js + MongoDB
- **Frontend**: Next.js 15, React 19, Tailwind v4, Zustand
- **Monorepo**: Turborepo + pnpm workspaces

## Structure

```
apps/
  cms/     → Payload admin + REST API (port 3000)
  web/     → Public-facing site (port 3001)
packages/
  types/   → Shared TypeScript types
```

## Setup

```bash
pnpm install
```

Needs a `.env` in `apps/cms/` with `DATABASE_URI` and `PAYLOAD_SECRET`. See `.env.example`.

```bash
# Run both apps
pnpm dev:cms
pnpm dev:web

# Seed data
pnpm db:seed
```

## CMS Collections

`Users` (admin auth), `Participants` (jam entrants w/ auth), `Teams`, `Submissions`, `Prizes`, `Rules`, `Guides`, `ScheduleEvents`, `Media`

Global: `JamSettings` — jam name, dates, registration toggle, theme, judging criteria, etc.
