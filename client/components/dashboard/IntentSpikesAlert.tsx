import { useIntentSpikes } from "@/hooks/useIntentSpikes";
import { AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function IntentSpikesAlert() {
  const { spikes, isLoading, getActivityIcon, getActivityLabel } =
    useIntentSpikes();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-warning" />
        <h2 className="font-semibold text-foreground">Intent Spikes</h2>
        <span className="ml-auto text-xs bg-warning/20 text-warning font-medium px-2 py-1 rounded">
          {spikes.length}
        </span>
      </div>

      <div className="space-y-2">
        {spikes.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No new intent signals
          </p>
        ) : (
          spikes.map((spike) => (
            <div
              key={spike.id}
              className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border cursor-pointer group"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">
                  {getActivityIcon(spike.activity)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {spike.prospectName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {spike.company}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getActivityLabel(spike.activity)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {formatDistanceToNow(spike.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground pt-2">
        High-intent prospects who recently interacted with your content
      </p>
    </div>
  );
}
