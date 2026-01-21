# SalesAI Ingestion Service (scaffold)

This service ingests calendar events and performs proactive document collection (news, SEC filings, social), normalizes the content, and publishes documents to RabbitMQ for downstream embedding and indexing workers.

Quick start

1. Copy `.env.example` to `.env` and set keys.
2. Install dependencies:

```bash
cd server/ingestion
pnpm install
```

3. Run in development:

```bash
pnpm dev
```

Endpoints

- `POST /webhook/calendar` - Accepts a calendar event payload (JSON) and triggers ingestion.

Notes

- This is a scaffold containing adapters for `news`, `sec`, and `social`. Replace placeholder logic with production-grade connectors and rate limiting.
- The `groqClient` module provides a small adapter to call a GROQ LLM endpoint for synthesis/scoring (used as an "AI judge").
