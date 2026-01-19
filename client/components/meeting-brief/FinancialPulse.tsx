import { FinancialMetric } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FinancialPulseProps {
  metrics: FinancialMetric[];
}

export function FinancialPulse({ metrics }: FinancialPulseProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">
        Financial Pulse
      </h2>
      <p className="text-muted-foreground mb-4">
        Key financial metrics and growth indicators
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {metric.value}
                  </p>
                </div>

                {metric.change !== undefined && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      metric.change > 0
                        ? "text-success"
                        : metric.change < 0
                          ? "text-warning"
                          : "text-muted-foreground"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : metric.trend === "down" ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : null}
                    <span>
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
