# Fusion Starter

A production-ready full-stack React application template with integrated Express server.

## Tech Stack

- **Frontend**: React 18, React Router 6, TypeScript, Vite, TailwindCSS 3, Radix UI
- **Backend**: Express
- **Testing**: Vitest
- **Tooling**: PNPM

## Quick Start

```bash
pnpm install
pnpm dev        # Start dev server (client + server) on port 8080
```

## Project Structure

- `client/`: React SPA frontend
- `server/`: Express API backend
- `shared/`: Shared types

## Features

- **SPA Routing**: React Router 6 setup in `client/App.tsx`.
- **API**: Express backend with routes in `server/routes/`.
- **Styling**: TailwindCSS + Radix UI components.
- **Type Safety**: Shared types between client and server.

## Development Commands

- **Build**: `pnpm build`
- **Test**: `pnpm test`
- **Typecheck**: `pnpm typecheck`

## Production Deployment

Standard build via `pnpm build`. Compatible with Netlify, Vercel, or containerized environments.

# SalesAI System Architecture

## High-Level Dataflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRIGGER LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│ Calendar Event (Google/Outlook)                                 │
│ Behavioral Intent Spike (CRM)                                   │
│ Manual Query (Dashboard)                                        │
└─────────────┬───────────────────────────────────────────────────┘
              │ (webhook)
              ▼
┌─────────────────────────────────────────────────────────────────┐
│              INGESTION SERVICE (server/ingestion)               │
├─────────────────────────────────────────────────────────────────┤
│ 1. Parse calendar event / query                                 │
│ 2. Parallel data fetchers:                                      │
│    - NewsAPI / GNews (global news)                              │
│    - SEC/EDGAR API (public filings)                             │
│    - Social APIs (Reddit, X)                                    │
│    - CRM data (Salesforce / HubSpot)                           │
│ 3. Normalize documents → canonical JSON                         │
│ 4. Optional: GROQ lightweight scoring                           │
│ 5. Publish to RabbitMQ queue (ingestion.documents)             │
└─────────────┬───────────────────────────────────────────────────┘
              │ (RabbitMQ)
              ▼
┌─────────────────────────────────────────────────────────────────┐
│           EMBEDDING & VECTOR PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│ 1. Consume from RabbitMQ                                        │
│ 2. Call embedding model (Sentence Transformers / OpenAI)        │
│ 3. Store vectors in:                                            │
│    - Milvus (semantic vector DB)                                │
│    - PostgreSQL+pgvector (relational + vector)                 │
│ 4. Update document metadata with embeddings.id                 │
└─────────────┬───────────────────────────────────────────────────┘
              │ (webhook / signal)
              ▼
┌─────────────────────────────────────────────────────────────────┐
│        KNOWLEDGE GRAPH & LINK ENRICHMENT                        │
├─────────────────────────────────────────────────────────────────┤
│ 1. Parse entities from normalized documents (NER)               │
│ 2. Link to CRM accounts (fuzzy match or explicit ID)           │
│ 3. Populate Neo4j graph:                                        │
│    - Nodes: Company, Person, News, Signal, Event               │
│    - Edges: mentions, hasExecutive, submittedFiling, etc.      │
│ 4. Enrich with relationship paths (competitive threats, etc.)  │
└─────────────┬───────────────────────────────────────────────────┘
              │ (graph)
              ▼
┌─────────────────────────────────────────────────────────────────┐
│    ORCHESTRATION & HYBRID RAG (LangChain + GROQ)               │
├─────────────────────────────────────────────────────────────────┤
│ 1. Query: calendar event / intent spike                         │
│ 2. Execute hybrid retrieval:                                    │
│    - Vector search (Milvus) for semantic matches                │
│    - Graph traversal (Neo4j) for relationship context           │
│    - SQL (PostgreSQL) for structured metadata                   │
│ 3. Assemble prompt with:                                        │
│    - Context window (retrieved docs + graph paths)              │
│    - Chain-of-thought reasoning                                 │
│    - Safety guardrails (PII masking, confidence thresholds)     │
│ 4. Primary LLM: Meta Llama 3.1 (via Groq API)                  │
│ 5. Judge: Optional OpenAI GPT for high-stakes synthesis         │
│ 6. Output: Structured briefing with citations                  │
└─────────────┬───────────────────────────────────────────────────┘
              │ (REST API / Push)
              ▼
┌─────────────────────────────────────────────────────────────────┐
│           EXPLAINABILITY LAYER & PROVENANCE                     │
├─────────────────────────────────────────────────────────────────┤
│ 1. Citation tracking: each insight maps to:                     │
│    - Raw source (news URL, SEC filing page, etc.)              │
│    - Retrieval context (embedding score, graph depth)           │
│    - Reasoning trace (which prompt / model step)                │
│    - Confidence score (0–1, based on ensemble voting)           │
│ 2. Return metadata for drill-down UI                            │
└─────────────┬───────────────────────────────────────────────────┘
              │ (REST API)
              ▼
┌─────────────────────────────────────────────────────────────────┐
│    FRONTEND (React Dashboard & Notification Layer)              │
├─────────────────────────────────────────────────────────────────┤
│ 1. Push notification (Slack / Email / In-App)                   │
│ 2. Briefing one-pager:                                          │
│    - SDR view: ice-breakers, objection hooks                    │
│    - AE view: financial metrics, competitive risks              │
│ 3. Interactive drill-down:                                      │
│    - Click insight → expand source + reasoning                  │
│    - View confidence score, citation chain                      │
│    - See relationship graph context                             │
│ 4. Actions: add to CRM, share, feedback (for retraining)       │
└─────────────────────────────────────────────────────────────────┘
```

## Storage & Infrastructure

| Component | Purpose | Config |
|-----------|---------|--------|
| **PostgreSQL + pgvector** | Relational CRM data + hybrid search | `postgresql://user:pass@localhost:5432/salesai` |
| **Milvus** | Pure vector semantic search | `milvus://localhost:19530` |
| **Neo4j** | Knowledge graph (accounts, people, signals, relationships) | `neo4j://localhost:7687` |
| **RabbitMQ** | Event-driven queue (ingestion → embeddings) | `amqp://localhost` |
| **Redis** (optional) | Caching & session storage | `redis://localhost:6379` |

## API Boundaries

### Ingestion Endpoints
- `POST /webhook/calendar` - Trigger ingestion from calendar event
- `POST /webhook/crm/intent-spike` - Trigger on behavioral signal
- `POST /api/ingest/manual` - Manual data source upload

### Retrieval & Briefing Endpoints
- `GET /api/briefing/{accountId}` - Fetch prepared briefing (with citations)
- `GET /api/briefing/{accountId}/drill-down?insightId={id}` - Expand insight reasoning
- `GET /api/graph/{accountId}` - Retrieve relationship map for account

### Admin & Monitoring
- `GET /health` - Service status (all DBs, queues)
- `GET /metrics` - Prometheus metrics (latency, errors, queue depth)
- `POST /admin/refresh-graph` - Force Neo4j re-index

## Failure Handling & Safety

1. **Confidence Thresholds**: Insights < 0.85 confidence flagged for human review
2. **PII Masking**: All rep names, emails, phone numbers stripped before LLM
3. **Human-in-the-Loop**: High-stakes actions (pricing changes, legal threats) require rep approval
4. **Graceful Degradation**: If Milvus down, fall back to SQL-only search; if Neo4j down, use vector + SQL
5. **Audit Logging**: All briefing generation logged (for compliance & improvement)

## Performance Targets

| Metric | Target |
|--------|--------|
| Calendar trigger → briefing ready | < 30s (p95) |
| Insight generation latency | < 5s per question |
| Document ingestion throughput | 1000+ docs/min |
| Vector search latency | < 100ms (p99) |

# Fusion Starter

A production-ready full-stack React application template with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

While the starter comes with a express server, only create endpoint when strictly neccesary, for example to encapsulate logic that must leave in the server, such as private keys handling, or certain DB operations, db...

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

#### Example API Routes
- `GET /api/ping` - Simple ping api
- `GET /api/demo` - Demo endpoint  

### Shared Types
Import consistent types in both client and server:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test          # Run Vitest tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `server/routes/my-route.ts`:
```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
```

3. Register the route in `server/index.ts`:
```typescript
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `pnpm build`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces
