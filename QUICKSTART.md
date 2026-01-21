# SalesAI System - Quick Start Guide

Complete setup and run instructions for the full stack (Frontend + Ingestion + Orchestration).

## Prerequisites

- **Node.js** 18+ with pnpm
- **Python** 3.10+ with poetry
- **RabbitMQ** (optional for local dev; can mock)
- **PostgreSQL** 14+ (optional; can use stubs)
- **Milvus** (optional; can use stubs)
- **Neo4j** (optional; can use stubs)

For local development, the system will work with stub implementations of databases.

## Setup: One-Time Installation

### 1. Install Frontend Dependencies
```bash
cd /Users/saurabhramteke/Code/Agents/Project\ BITSOM/SalesAIMVP
pnpm install
```

### 2. Install Ingestion Service Dependencies
```bash
cd server/ingestion
pnpm install
cd ../..
```

### 3. Install Orchestration Service Dependencies
```bash
cd orchestration
poetry install
cd ..
```

### 4. Configure Environment Variables

**Ingestion service** (`server/ingestion/.env`):
```
RABBITMQ_URL=amqp://localhost
RABBITMQ_QUEUE=ingestion.documents
NEWS_API_KEY=7c43ed4c59a14dc08ed41015b40ef98b
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=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
GROQ_MODEL=openai/gpt-oss-120b
SEC_API_URL=https://www.sec.gov
```

**Orchestration service** (`orchestration/.env`):
```
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=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
GROQ_MODEL=openai/gpt-oss-120b

PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=salesai

MILVUS_HOST=localhost
MILVUS_PORT=19530

NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

RABBITMQ_URL=amqp://localhost
RABBITMQ_QUEUE=ingestion.documents

PORT=4011
DEBUG=false
```

**Frontend** (`client/.env`):
```
REACT_APP_ORCHESTRATION_URL=http://localhost:4011
```

## Run: Development Mode (Multiple Terminals)

### Terminal 1: Frontend (React dev server)
```bash
cd /Users/saurabhramteke/Code/Agents/Project\ BITSOM/SalesAIMVP
pnpm dev
```
✅ Runs on `http://localhost:8080`

### Terminal 2: Ingestion Service (Node.js)
```bash
cd /Users/saurabhramteke/Code/Agents/Project\ BITSOM/SalesAIMVP/server/ingestion
pnpm dev
```
✅ Runs on `http://localhost:4010`

### Terminal 3: Orchestration Service (Python/FastAPI)
```bash
cd /Users/saurabhramteke/Code/Agents/Project\ BITSOM/SalesAIMVP/orchestration
poetry run python -m src.main
```
✅ Runs on `http://localhost:4011`

## Test the Full Flow

### 1. Trigger Ingestion (Calendar Event)
```bash
curl -X POST http://localhost:4010/webhook/calendar \
  -H "Content-Type: application/json" \
  -d '{"title":"Meeting with Acme Corp"}'
```

Expected response:
```json
{"ok":true,"pushed":6}
```

### 2. Generate Briefing
```bash
curl -X GET "http://localhost:4011/api/briefing/sample-1?role=ae&query=Meeting+with+Acme"
```

Expected response:
```json
{
  "metadata": {
    "account_id": "sample-1",
    "account_name": "Sample Account",
    "role": "ae",
    "generated_at": "2026-01-21T..."
  },
  "insights": [
    {
      "id": "insight_1",
      "text": "...",
      "category": "opportunity",
      "confidence": 0.92,
      "citations": [...]
    }
  ]
}
```

### 3. Open Frontend
Navigate to `http://localhost:8080` → Click "Briefs" → Select a meeting to see the briefing with AI-generated insights.

### 4. Drill Down (Show Reasoning)
Click "Show Reasoning & Sources" on any insight to expand:
- Reasoning trace (step-by-step LLM reasoning)
- Full context from retrieval
- Related entities from knowledge graph

## Troubleshooting

### Orchestration service fails to start

**Error: `ModuleNotFoundError: No module named 'langchain'`**
```bash
cd orchestration
poetry install
```

**Error: `Connection refused` on database**
- The service uses stub implementations for dev
- DB connections are optional; system works without them

**Error: `GROQ_API_KEY not set`**
- Make sure `orchestration/.env` has the key
- Check: `cat orchestration/.env | grep GROQ_API_KEY`

### Frontend can't reach orchestration

**Error: `Failed to fetch briefing`**
- Confirm orchestration is running: `curl http://localhost:4011/health`
- Check CORS (FastAPI should allow `http://localhost:8080`)
- Verify `REACT_APP_ORCHESTRATION_URL` in `client/.env`

### Ingestion service not running

**Error: `Cannot find module 'amqplib'`**
```bash
cd server/ingestion
pnpm install
```

## Optional: Production Build

### Frontend
```bash
pnpm build
pnpm start
```
Output: `dist/spa/`

### Orchestration
```bash
cd orchestration
poetry build
```

## Architecture Recap

```
Frontend (http://8080)
    ↓ (fetch briefing)
Orchestration (http://4011)
    ↓ (hybrid retrieval: vector + graph + SQL)
Ingestion (http://4010) + External APIs
    ↓ (normalize documents)
RabbitMQ (amqp://localhost)
    ↓ (embed documents)
Milvus (vector search)
Neo4j (knowledge graph)
PostgreSQL (relational data)
```

## Next Steps

1. ✅ All services running
2. ✅ Briefing generation working
3. ⏳ **Storage schemas** (PostgreSQL init scripts)
4. ⏳ **Embedding workers** (document → vector pipeline)
5. ⏳ **Monitoring** (MLflow, Optuna)

## Quick Commands Reference

```bash
# Start all services (in separate terminals)
pnpm dev                                    # Frontend
cd server/ingestion && pnpm dev             # Ingestion
cd orchestration && poetry run python -m src.main  # Orchestration

# Test endpoints
curl http://localhost:4010/webhook/calendar -d '{"title":"Meeting with Acme Corp"}'
curl http://localhost:4011/api/briefing/sample-1?role=ae
curl http://localhost:8080

# Check health
curl http://localhost:4011/health
```
