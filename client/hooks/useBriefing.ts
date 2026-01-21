import { useState, useEffect } from "react";
import { fetchBriefing, Briefing } from "@/lib/orchestrationClient";

export function useBriefing(accountId: string, role: "sdr" | "ae" = "ae", query: string = "") {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchBriefing(accountId, role, query)
      .then(setBriefing)
      .catch((err) => {
        console.error("Error fetching briefing:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [accountId, role, query]);

  return { briefing, loading, error, refetch: () => fetchBriefing(accountId, role, query).then(setBriefing) };
}
