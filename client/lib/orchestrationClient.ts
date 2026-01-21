/**
 * API client for orchestration service (briefing generation).
 */

export interface Citation {
  source_url: string;
  title: string;
  text_snippet: string;
  retrieval_method: string;
  confidence: number;
}

export interface Insight {
  id: string;
  text: string;
  category: string;
  confidence: number;
  citations: Citation[];
  reasoning: string;
  action: string;
}

export interface BriefingMetadata {
  account_id: string;
  account_name: string;
  trigger_type: string;
  generated_at: string;
  role: string;
}

export interface Briefing {
  metadata: BriefingMetadata;
  insights: Insight[];
  ice_breakers?: string[];
  value_map?: Record<string, any>;
  competitive_landscape?: string;
  financial_metrics?: Record<string, any>;
}

export interface DrillDownResponse {
  insight: Insight;
  full_context: string;
  reasoning_trace: string[];
  related_graph_paths: Array<Record<string, any>>;
}

const ORCHESTRATION_BASE_URL = import.meta.env.VITE_ORCHESTRATION_URL || "http://localhost:4011";

export async function fetchBriefing(
  accountId: string,
  role: "sdr" | "ae" = "ae",
  query: string = ""
): Promise<Briefing> {
  const params = new URLSearchParams({ role, query });
  const response = await fetch(
    `${ORCHESTRATION_BASE_URL}/api/briefing/${accountId}?${params}`,
    { method: "POST" }
  );
  if (!response.ok) throw new Error(`Failed to fetch briefing: ${response.statusText}`);
  return response.json();
}

export async function fetchDrillDown(
  accountId: string,
  insightId: string
): Promise<DrillDownResponse> {
  const response = await fetch(
    `${ORCHESTRATION_BASE_URL}/api/briefing/${accountId}/drill-down`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insight_id: insightId }),
    }
  );
  if (!response.ok) throw new Error(`Failed to fetch drill-down: ${response.statusText}`);
  return response.json();
}

export async function fetchAccountGraph(accountId: string) {
  const response = await fetch(`${ORCHESTRATION_BASE_URL}/api/graph/${accountId}`);
  if (!response.ok) throw new Error(`Failed to fetch graph: ${response.statusText}`);
  return response.json();
}
