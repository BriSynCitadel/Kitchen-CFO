# Kitchen CFO

## Overview

Kitchen CFO is an AI-powered nutrition and food intelligence web app. Users photograph food, meals, receipts, and pantry items → Gemini Vision AI identifies everything → the app tracks nutrition and builds a personalized profile → personalized food recommendations based on what's actually in their kitchen and what their body needs.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **State management**: TanStack Query (React Query)
- **AI**: Google Gemini Vision API (`@google/genai`)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080, path /api)
│   └── kitchen-cfo/        # React + Vite frontend (port 24775, path /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

Tables in PostgreSQL:
- `profiles` — User nutrition profile (age, gender, height, weight, blood type, dietary preferences, health goals, allergies, medical conditions, lab values)
- `food_logs` — Food diary entries with full nutrient data as JSONB
- `inventory` — Kitchen inventory items (name, category, quantity, expiry)
- `settings` — User settings (Gemini API key, unit system, default meal type)

## API Endpoints

All routes under `/api`:

- `GET /healthz` — Health check
- `POST /analyze` — Gemini Vision food photo analysis
- `GET /food-logs` — Get food log entries (filterable by date)
- `POST /food-logs` — Create food log entry
- `DELETE /food-logs/:id` — Delete food log entry
- `GET /food-logs/summary` — Get daily nutrient totals
- `GET /profile` — Get nutrition profile
- `PUT /profile` — Update nutrition profile
- `GET /inventory` — Get kitchen inventory
- `POST /inventory` — Add inventory item
- `PUT /inventory/:id` — Update inventory item
- `DELETE /inventory/:id` — Delete inventory item
- `GET /recommendations` — Get AI recommendations
- `POST /recommendations` — Refresh AI recommendations
- `GET /settings` — Get user settings
- `PUT /settings` — Update settings (including Gemini API key)

## Gemini API Key

Two ways to configure:
1. **Environment variable**: `GEMINI_API_KEY` secret (takes priority)
2. **In-app settings**: Enter via the Settings screen → stored in the `settings` table

The backend checks the env var first, then the database.

## Frontend Pages

- `/` — Home / Scan (camera + food analysis results)
- `/diary` — Daily food diary with nutrient summary
- `/kitchen` — Kitchen inventory management
- `/recommendations` — AI-generated personalized recommendations
- `/profile` — Nutrition profile setup
- `/settings` — Gemini API key and preferences

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all lib packages as project references.

## Running Codegen

Run after any changes to `lib/api-spec/openapi.yaml`:
```bash
pnpm --filter @workspace/api-spec run codegen
```

## Development

```bash
# API server
pnpm --filter @workspace/api-server run dev

# Frontend
pnpm --filter @workspace/kitchen-cfo run dev

# Push DB schema
pnpm --filter @workspace/db run push
```
