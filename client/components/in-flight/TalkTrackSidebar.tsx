import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Zap } from "lucide-react";

interface TalkTrack {
  category: string;
  points: string[];
}

interface TalkTrackSidebarProps {
  tracks: TalkTrack[];
}

export function TalkTrackSidebar({ tracks }: TalkTrackSidebarProps) {
  const [activeTrack, setActiveTrack] = useState(0);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTrack((prev) => (prev + 1) % tracks.length);
      setAnimatingIndex(Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(timer);
  }, [tracks.length]);

  const currentTrack = tracks[activeTrack];

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <CardTitle className="text-base">Live Talk Track</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Category:{" "}
          <span className="font-semibold">{currentTrack.category}</span>
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {currentTrack.points.map((point, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg bg-muted/50 border border-border transition-all duration-500 transform ${
                animatingIndex === index
                  ? "bg-success/10 border-success/50 scale-105"
                  : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                <p className="text-sm text-foreground leading-snug">{point}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex gap-1">
            {tracks.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTrack(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeTrack
                    ? "bg-primary w-6"
                    : "bg-muted w-2 hover:bg-muted/80"
                }`}
                aria-label={`Go to track ${index + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {activeTrack + 1} of {tracks.length} talking points
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
