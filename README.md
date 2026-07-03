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

## Project Structure

```
app/           → Next.js App Router pages & API routes
components/    → Shared UI & layout components
modules/       → Domain modules (Phase 2+)
features/      → Feature-specific components & logic
lib/           → Utilities, auth, prisma, storage
hooks/         → Custom React hooks
store/         → Zustand stores
prisma/        → Schema, migrations, seed
server/        → Server-side services
types/         → Shared TypeScript types
editor/        → Visual editor (Phase 3+)
widgets/       → Widget definitions (Phase 6+)
renderer/      → JSON render engine (Phase 4+)
```

## Development Phases

This project is built incrementally in 10 phases. See the project brief for details.

**Current phase:** Phase 1 — Project Initialization ✅
