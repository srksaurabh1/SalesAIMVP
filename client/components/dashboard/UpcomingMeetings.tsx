import { useMeetings } from "@/hooks/useMeetings";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, Mail, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingMeetings() {
  const { meetings, isLoading } = useMeetings();
  const { role } = useRole();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground text-lg mb-2">No upcoming meetings</p>
        <p className="text-sm text-muted-foreground">
          Schedule some calls to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meetings.map((meeting) => (
        <Card
          key={meeting.id}
          className="hover:shadow-lg transition-shadow hover:border-primary/30"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {meeting.prospectName}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {meeting.companyName}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {meeting.avatar}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Time */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {format(meeting.time, "MMM d, h:mm a")}
              </span>
            </div>

            {/* Email */}
            {meeting.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">
                  {meeting.email}
                </span>
              </div>
            )}

            {/* Context */}
            <div>
              <p className="text-sm text-muted-foreground">
                {meeting.context}
              </p>
            </div>

            {/* Status */}
            <div className="pt-2">
              <Badge
                variant={
                  meeting.status === "ready" ? "default" : "secondary"
                }
                className={
                  meeting.status === "ready"
                    ? "bg-success hover:bg-success/90"
                    : "bg-warning hover:bg-warning/90"
                }
              >
                {meeting.status === "ready" ? "✓ Ready" : "○ Researching"}
              </Badge>
            </div>

            {/* Role-specific context */}
            <div className="pt-2 border-t border-border">
              {role === "sdr" ? (
                <p className="text-xs text-muted-foreground">
                  <strong>Qualification focus:</strong> Understand needs and pain
                  points
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  <strong>Closing focus:</strong> Address objections and
                  negotiate
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Link
                to={`/meeting-brief/${meeting.id}`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  View Brief
                </Button>
              </Link>
              <Link
                to="/in-flight-assistant"
                className="flex-1"
              >
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                  Start Call
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
