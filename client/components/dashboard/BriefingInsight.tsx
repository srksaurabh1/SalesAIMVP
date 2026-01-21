import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, ChevronDown, Loader2 } from "lucide-react";
import { Insight, fetchDrillDown } from "@/lib/orchestrationClient";
import { cn } from "@/lib/utils";

interface BriefingInsightProps {
  insight: Insight;
  accountId: string;
}

export function BriefingInsight({ insight, accountId }: BriefingInsightProps) {
  const [expanded, setExpanded] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDrillDown = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDrillDown(accountId, insight.id);
      setDrillDownData(data);
      setExpanded(true);
    } catch (err) {
      console.error("Error fetching drill-down:", err);
    } finally {
      setLoading(false);
    }
  };

  const categoryColors: Record<string, string> = {
    threat: "bg-red-100 text-red-800",
    opportunity: "bg-green-100 text-green-800",
    competitive: "bg-blue-100 text-blue-800",
    financial: "bg-amber-100 text-amber-800",
  };

  return (
    <Card className="p-4 mb-3">
      <div className="space-y-3">
        {/* Insight header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{insight.text}</p>
          </div>
          <Badge className={cn("shrink-0", categoryColors[insight.category] || "bg-gray-100")}>
            {insight.category}
          </Badge>
        </div>

        {/* Confidence meter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Confidence:</span>
          <div className="flex-1 max-w-xs bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${insight.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-foreground">{(insight.confidence * 100).toFixed(0)}%</span>
        </div>

        {/* Citations preview */}
        {insight.citations.length > 0 && (
          <div className="text-xs">
            <p className="font-semibold text-muted-foreground mb-1">Sources ({insight.citations.length}):</p>
            <ul className="space-y-1">
              {insight.citations.slice(0, 2).map((cite, i) => (
                <li key={i} className="flex items-center gap-1 text-muted-foreground">
                  <span className="truncate text-xs">{cite.title}</span>
                  <a
                    href={cite.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Drill-down button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDrillDown}
          disabled={loading}
          className="w-full justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <ChevronDown className={cn("w-3 h-3 mr-1 transition-transform", expanded && "rotate-180")} />
              {expanded ? "Hide Details" : "Show Reasoning & Sources"}
            </>
          )}
        </Button>

        {/* Expanded details */}
        {expanded && drillDownData && (
          <DrillDownExpanded data={drillDownData} />
        )}
      </div>
    </Card>
  );
}

function DrillDownExpanded({ data }: { data: any }) {
  return (
    <div className="mt-4 p-3 bg-muted/50 rounded border border-border space-y-3">
      {/* Reasoning trace */}
      {data.reasoning_trace?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Reasoning Trace:</p>
          <ol className="text-xs space-y-1 text-muted-foreground">
            {data.reasoning_trace.map((step: string, i: number) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Full context */}
      {data.full_context && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Context:</p>
          <p className="text-xs text-muted-foreground line-clamp-4">{data.full_context}</p>
        </div>
      )}

      {/* Related graph paths */}
      {data.related_graph_paths?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Related Entities:</p>
          <div className="space-y-1">
            {data.related_graph_paths.map((path: any, i: number) => (
              <div key={i} className="text-xs text-muted-foreground">
                <span className="font-mono">{path.from}</span>
                <span className="mx-1">→</span>
                <span className="font-semibold">{path.relation}</span>
                <span className="mx-1">→</span>
                <span className="font-mono">{path.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
