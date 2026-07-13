# PageCraft — Elementor-Inspired Website Builder

A production-ready visual website builder built with Next.js 15, React 19, TypeScript, TailwindCSS, Shadcn UI, Prisma, and PostgreSQL.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, TailwindCSS, Shadcn UI, Zustand, dnd-kit, Framer Motion, React Hook Form, Zod
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (Auth.js v5)
- **Storage:** Local filesystem (designed for S3/R2 swap)

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start PostgreSQL
docker compose up -d

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:** `demo@pagecraft.dev` / `password123`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed demo user/project/pages |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
app/           → Next.js App Router pages & API routes
components/    → Shared UI, motion helpers, virtual list
features/      → Feature-specific components (auth, projects, templates, preview)
lib/           → Utilities, auth, prisma, validations, styles
hooks/         → Custom React hooks
store/         → Zustand stores
prisma/        → Schema, migrations, seed
server/        → Server-side services
types/         → Shared TypeScript types
editor/        → Visual editor shell, DnD, history, properties
widgets/       → Self-registering widget modules
renderer/      → JSON render engine
docs/          → Architecture & deployment guides
```

## Features

- Visual drag-and-drop editor with Elementor-like nesting
- Device-aware styles (desktop / tablet / mobile)
- Properties panel (typography, spacing, border, background, effects)
- Undo/redo history + clipboard shortcuts
- Autosave, revisions, publish versions
- Templates (save / apply)
- Public published pages at `/p/{projectSlug}/{pageSlug}`
- Draft preview at `/preview/{projectId}/{pageId}`

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)

## Development Phases

All 10 phases are complete:

1. Project initialization
2. Auth + projects/pages CRUD
3. Editor layout
4. JSON renderer
5. Drag and drop
6. Widget system
7. Properties panel
8. History + shortcuts
9. Publishing, versioning, preview, templates, autosave
10. Optimization, animations, performance, testing, docs, deployment

## Environment Variables

See [`.env.example`](.env.example). Required:

```
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
NEXTAUTH_URL=
```
