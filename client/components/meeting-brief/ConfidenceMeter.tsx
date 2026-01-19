import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface ConfidenceMeterProps {
  score: number;
}

export function ConfidenceMeter({ score }: ConfidenceMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Very High Confidence";
    if (score >= 60) return "Good Confidence";
    return "Moderate Confidence";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          AI Confidence Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
            <span className="text-sm text-muted-foreground">
              {getScoreLabel(score)}
            </span>
          </div>
          <Progress value={score} className="h-3 bg-muted" />
        </div>

        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-foreground font-medium mb-2">
            What this means:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              ✓ All key information has been cross-referenced and verified
            </li>
            <li>
              ✓ This prospect is highly likely to value your solution
            </li>
            <li>
              ✓ The timing and opportunity alignment are favorable
            </li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          This confidence score is based on data freshness, source diversity,
          and pattern matching against successful deals.
        </p>
      </CardContent>
    </Card>
  );
}
