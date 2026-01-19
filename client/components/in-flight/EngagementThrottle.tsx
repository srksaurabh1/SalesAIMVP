import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function EngagementThrottle() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-lg border-l-4 border-l-warning bg-warning/10 p-4 mb-4">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 hover:bg-warning/20 rounded transition-colors"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4 text-warning" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />

        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            ⚠️ Campaign Saturation Alert
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            You've contacted this prospect <strong>5 times in the last 7 days</strong>.
            They may be experiencing outreach fatigue.
          </p>

          <div className="bg-white dark:bg-card rounded p-2 text-xs text-muted-foreground border border-warning/20 mb-3">
            <strong>Recommendation:</strong> Consider reducing outreach frequency or
            adding unique value in your next message. Personalize further based on
            their recent activity.
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              View Outreach History
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              Adjust Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
