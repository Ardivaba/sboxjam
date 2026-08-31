# s&box LFG

Team-finding platform for the [s&box](https://sbox.game) gamejam. Create a team, recruit for the roles you're missing, or showcase your portfolio and get recruited — before the theme drops.

## Stack

- **CMS**: [Payload CMS](https://payloadcms.com/) on Next.js + MongoDB
- **Frontend**: Next.js 15, React 19, Tailwind v4, Zustand
- **Auth**: Discord OAuth only (no passwords)
- **Monorepo**: Turborepo + pnpm workspaces

## Structure

```
apps/
  cms/     → Payload admin + REST API + Discord OAuth (port 3000)
  web/     → Public-facing site (port 3001)
packages/
  types/   → Shared TypeScript types
```

## Setup

```bash
pnpm install
```

Needs a `.env` in `apps/cms/` — see `.env.example`. Required:

- `DATABASE_URI`, `PAYLOAD_SECRET`
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` — from a [Discord application](https://discord.com/developers/applications) with `SERVER_URL + /api/participants/oauth/discord/callback` registered as an OAuth2 redirect
- `SERVER_URL` (CMS public URL), `WEB_URL` (web app public URL)

```bash
# Run both apps
pnpm dev:cms
pnpm dev:web

# Seed demo data
pnpm db:seed
```

## How it works

- Participants sign in with Discord; an account is created on first login (`/api/participants/oauth/discord`). Passwords are random and rotate on every login — nobody ever sees one.
- Players set roles (programmer, artist, animator, sound, design, writer), skills, bio, and portfolio pieces (screenshots, YouTube videos, project links), and flag themselves as looking for a team.
- Teams recruit for specific roles. Joining happens via invite code (instant) or join request (leader accepts/declines).

## CMS Collections

`Users` (admin auth), `Participants` (Discord auth + profile/portfolio), `Teams`, `JoinRequests`, `Media`
