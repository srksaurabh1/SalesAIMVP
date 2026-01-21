# SalesAI Orchestration Service (Python/LangChain/GROQ)

Hybrid RAG orchestrator for sales intelligence briefing generation. Combines vector search (Milvus), knowledge graph (Neo4j), and SQL queries (PostgreSQL) to build context for GROQ LLM synthesis.

## Quick Start

1. Install dependencies:
```bash
cd orchestration
poetry install
```

2. Set up `.env` with database credentials and GROQ keys (see `.env.example`)

3. Run the service:
```bash
poetry run python -m src.main
```

Service will listen on `http://localhost:4011`

## API Endpoints

### Generate Briefing
```
POST /api/briefing/{account_id}?role=ae&query=...
```

Response:
```json
{
  "metadata": {
    "account_id": "123",
    "account_name": "Acme Corp",
    "trigger_type": "calendar",
    "role": "ae"
  },
  "insights": [
    {
      "id": "insight_1",
      "text": "Acme is shifting to sustainable manufacturing (found in Q4 earnings).",
      "category": "opportunity",
      "confidence": 0.92,
      "citations": [
        {
          "source_url": "https://sec.gov/edgar/...",
          "title": "Acme 10-K Filing",
          "retrieval_method": "sql"
        }
      ]
    }
  ],
  "value_map": { "product_fit": "high", "timing": "now" }
}
```

### Drill-Down (Show Reasoning)
```
POST /api/briefing/{account_id}/drill-down
Body: { "insight_id": "insight_1" }
```

Response:
```json
{
  "insight": {...},
  "reasoning_trace": [
    "Step 1: Vector search found 5 similar docs",
    "Step 2: Neo4j returned related executives",
    "Step 3: GROQ scored confidence at 0.92"
  ]
}
```

## Architecture

- **LangChain**: Orchestrates prompt chains and LLM calls
- **GROQ**: Primary LLM (Llama 3.1 via OpenAI-compatible API)
- **Milvus**: Vector semantic search
- **PostgreSQL + pgvector**: Relational data + hybrid search
- **Neo4j**: Knowledge graph (accounts, people, signals, relationships)
- **FastAPI**: REST API layer

## Notes

- Placeholders for Milvus/Neo4j integration; replace with actual connectors
- PII masking and confidence thresholds to be added
- MLflow monitoring coming soon
