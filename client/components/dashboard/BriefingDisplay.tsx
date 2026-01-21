import { Briefing } from "@/lib/orchestrationClient";
import { BriefingInsight } from "./BriefingInsight";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp } from "lucide-react";

interface BriefingDisplayProps {
  briefing: Briefing;
}

export function BriefingDisplay({ briefing }: BriefingDisplayProps) {
  const { metadata, insights, ice_breakers, value_map, competitive_landscape, financial_metrics } = briefing;
  const isSDR = metadata.role === "sdr";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-foreground">{metadata.account_name}</h2>
          <Badge variant="secondary">{isSDR ? "SDR View" : "AE View"}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Generated {new Date(metadata.generated_at).toLocaleString()}
        </p>
      </div>

      {/* Insights */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Key Insights
        </h3>
        <div className="space-y-3">
          {insights.map((insight) => (
            <BriefingInsight key={insight.id} insight={insight} accountId={metadata.account_id} />
          ))}
        </div>
      </div>

      {/* SDR-specific sections */}
      {isSDR && ice_breakers && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-foreground mb-3">Ice Breakers</h3>
          <ul className="space-y-2">
            {ice_breakers.map((breaker, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">→</span>
                <span className="text-foreground">{breaker}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* AE-specific sections */}
      {!isSDR && (
        <>
          {value_map && (
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Value Map
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(value_map).map(([key, value]) => (
                  <div key={key} className="p-2 bg-muted rounded">
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm font-semibold text-foreground">{String(value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {financial_metrics && (
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Financial Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(financial_metrics).map(([key, value]) => (
                  <div key={key} className="p-2 bg-muted rounded">
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm font-semibold text-foreground">{String(value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {competitive_landscape && (
            <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-foreground mb-2">Competitive Landscape</h3>
              <p className="text-sm text-foreground">{competitive_landscape}</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
