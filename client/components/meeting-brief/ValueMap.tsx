import { ValueMapItem } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ValueMapProps {
  items: ValueMapItem[];
}

export function ValueMap({ items }: ValueMapProps) {
  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "bg-success/20 text-success border-success/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      case "low":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "";
    }
  };

  const getRelevanceLabel = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "High Fit";
      case "medium":
        return "Medium Fit";
      case "low":
        return "Low Fit";
      default:
        return "";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">Value Map</h2>
      <p className="text-muted-foreground mb-4">
        How our solution addresses their specific pain points
      </p>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.feature} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {item.feature}
                    </p>
                  </div>
                  <Badge
                    className={`flex-shrink-0 ${getRelevanceColor(item.relevance)}`}
                    variant="outline"
                  >
                    {getRelevanceLabel(item.relevance)}
                  </Badge>
                </div>

                <div className="flex items-start gap-2 pl-6">
                  <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pain Point:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.painPoint}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
