import { useState, useEffect } from "react";
import { mockMeetings, Meeting } from "@/lib/mockData";

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Filter out past meetings and sort by time
      const upcomingMeetings = mockMeetings
        .filter((m) => m.time > new Date())
        .sort((a, b) => a.time.getTime() - b.time.getTime());
      setMeetings(upcomingMeetings);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getMeetingById = (id: string) => {
    return mockMeetings.find((m) => m.id === id);
  };

  return {
    meetings,
    isLoading,
    getMeetingById,
    total: meetings.length,
  };
}
