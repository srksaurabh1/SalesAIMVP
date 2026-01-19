import { useState, useEffect } from "react";
import { mockIntentSpikes, IntentSpike } from "@/lib/mockData";

export function useIntentSpikes() {
  const [spikes, setSpikes] = useState<IntentSpike[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Sort by most recent first
      const sortedSpikes = mockIntentSpikes.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );
      setSpikes(sortedSpikes);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (activity: IntentSpike["activity"]) => {
    switch (activity) {
      case "white_paper":
        return "📄";
      case "pricing_page":
        return "💰";
      case "case_study":
        return "📊";
      case "blog":
        return "📝";
      case "demo":
        return "🎬";
      default:
        return "📌";
    }
  };

  const getActivityLabel = (activity: IntentSpike["activity"]) => {
    switch (activity) {
      case "white_paper":
        return "White Paper";
      case "pricing_page":
        return "Pricing Page";
      case "case_study":
        return "Case Study";
      case "blog":
        return "Blog Post";
      case "demo":
        return "Demo Request";
      default:
        return "Activity";
    }
  };

  return {
    spikes,
    isLoading,
    getActivityIcon,
    getActivityLabel,
    total: spikes.length,
  };
}
