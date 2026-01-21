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
