# Frontend Integration with Orchestration Service

This document describes how the React frontend integrates with the orchestration (Python/LangChain/GROQ) service.

## Setup

1. **Copy environment file:**
```bash
cp client/.env.example client/.env
```

2. **Set orchestration URL** (edit `client/.env`):
```
REACT_APP_ORCHESTRATION_URL=http://localhost:4011
```

3. **Start both services:**

Terminal 1 (Frontend):
```bash
pnpm dev
```

Terminal 2 (Ingestion):
```bash
cd server/ingestion
pnpm dev
```

Terminal 3 (Orchestration):
```bash
cd orchestration
poetry run python -m src.main
```

## Integration Points

### API Client: `client/lib/orchestrationClient.ts`
Core functions for calling the orchestration service:
- `fetchBriefing(accountId, role, query)` - Get briefing with insights
- `fetchDrillDown(accountId, insightId)` - Expand insight details
- `fetchAccountGraph(accountId)` - Get relationship map

### Hook: `client/hooks/useBriefing.ts`
React hook that wraps the API client:
```tsx
const { briefing, loading, error, refetch } = useBriefing(accountId, "ae");
```

### Components

**BriefingDisplay** (`client/components/dashboard/BriefingDisplay.tsx`)
- Renders full briefing with insights and role-specific sections
- SDR: ice-breakers, discovery tips
- AE: value map, financial metrics, competitive landscape

**BriefingInsight** (`client/components/dashboard/BriefingInsight.tsx`)
- Individual insight card with:
  - Main insight text
  - Confidence meter
  - Source citations (clickable links)
  - Drill-down button to expand reasoning

### Page Integration

**MeetingBrief** (`client/pages/MeetingBrief.tsx`)
- Now fetches briefing from orchestration service
- Falls back to mock data if service unavailable
- Shows loading/error states
- Uses `BriefingDisplay` component

## Workflow: Calendar Event → Briefing

```
1. User navigates to meeting brief page
   ↓
2. `useBriefing` hook fires with accountId + role
   ↓
3. Frontend calls POST /api/briefing/{accountId}?role=ae
   ↓
4. Orchestration service:
   - Retrieves ingested documents via hybrid search
   - Calls GROQ LLM to synthesize insights
   - Returns structured briefing with citations
   ↓
5. Frontend displays briefing in role-specific format
   ↓
6. User clicks "Show Reasoning & Sources"
   ↓
7. Frontend calls POST /api/briefing/{accountId}/drill-down
   ↓
8. Shows reasoning trace and knowledge graph context
```

## Extending the Integration

### Add new insight categories
Edit `BriefingInsight.tsx` to add color codes:
```tsx
const categoryColors: Record<string, string> = {
  threat: "bg-red-100 text-red-800",
  opportunity: "bg-green-100 text-green-800",
  // Add new categories here
};
```

### Add role-specific UI sections
Edit `BriefingDisplay.tsx` to conditionally render:
```tsx
{isSDR && <SDRSpecificSection />}
{!isSDR && <AESpecificSection />}
```

### Add drill-down analysis types
Edit `DrillDownExpanded` to render additional data fields from orchestration response.

## Error Handling

- If orchestration service is down, the frontend falls back to mock data
- Failed API calls display error alerts with retry options
- All errors are logged to browser console for debugging

## Performance

- Briefing generation typically completes in 3-5 seconds
- Results are not cached (always fresh retrieval)
- Consider adding React Query for caching in production
