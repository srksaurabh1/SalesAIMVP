import { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { TalkTrackSidebar } from "@/components/in-flight/TalkTrackSidebar";
import { RebuttalsPanel } from "@/components/in-flight/RebuttalsPanel";
import { EngagementThrottle } from "@/components/in-flight/EngagementThrottle";
import { EscalateButton } from "@/components/in-flight/EscalateButton";
import { mockTalkTracks, mockRebuttals } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Mic,
  Video,
  Phone,
  AlertCircle,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function InFlightAssistant() {
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Simulate call timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <MainLayout>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-secondary/10 to-primary/10 py-6 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-success">
                  CALL IN PROGRESS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Sarah Chen — TechVenture Inc
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                VP of Sales • Call Duration: {formatTime(callTime)}
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                onClick={() => setIsMuted(!isMuted)}
                className="flex-1 sm:flex-none"
              >
                <Mic className="w-4 h-4 mr-2" />
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <Button
                variant={!isVideoOn ? "destructive" : "outline"}
                size="lg"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="flex-1 sm:flex-none"
              >
                <Video className="w-4 h-4 mr-2" />
                {isVideoOn ? "Stop Video" : "Start Video"}
              </Button>
              <Link to="/" className="flex-1 sm:flex-none">
                <Button variant="outline" size="lg" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          {/* Engagement Alert */}
          <div className="mb-6">
            <EngagementThrottle />
          </div>

          {/* Main Layout: Tabs + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Panel (col-span-3) */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="rebuttals" className="w-full">
                {/* Tab Navigation */}
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-6">
                  <TabsTrigger value="rebuttals">Rebuttals</TabsTrigger>
                  <TabsTrigger value="talking-points">
                    Talking Points
                  </TabsTrigger>
                  <TabsTrigger className="hidden lg:inline-flex" value="notes">
                    Notes
                  </TabsTrigger>
                </TabsList>

                {/* Rebuttals Tab */}
                <TabsContent value="rebuttals">
                  <RebuttalsPanel rebuttals={mockRebuttals} />
                </TabsContent>

                {/* Talking Points Tab */}
                <TabsContent value="talking-points">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Live Talking Points by Phase
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockTalkTracks.map((track, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                        >
                          <h3 className="font-semibold text-foreground mb-2">
                            {track.category}
                          </h3>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {track.points.map((point, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-primary flex-shrink-0">
                                  •
                                </span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Call Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 rounded-lg p-4 min-h-40 border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">
                          Real-time transcription and notes would appear here
                          during the call. This space captures key discussion
                          points, action items, and next steps.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <span className="text-sm font-semibold text-foreground">
                        Objection Detected
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI detected pricing concern. Check Rebuttals tab for
                      responses.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-secondary" />
                      <span className="text-sm font-semibold text-foreground">
                        Meeting Phase
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Solution Fit → Transitioning to closing phase
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar (col-span-1) */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Live Talk Track */}
              <TalkTrackSidebar tracks={mockTalkTracks} />

              {/* Call Info Card */}
              <Card className="bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Call Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">
                      Prospect
                    </p>
                    <p className="font-semibold text-foreground">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">VP of Sales</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">
                      Company
                    </p>
                    <p className="font-semibold text-foreground">
                      TechVenture Inc
                    </p>
                    <p className="text-xs text-muted-foreground">SaaS</p>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                      Intelligence Score
                    </p>
                    <Badge
                      className="bg-success/20 text-success"
                      variant="outline"
                    >
                      87% Confidence
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Link to="/meeting-brief/sample-1" className="w-full block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        View Full Brief
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Escalate Button */}
              <EscalateButton />
            </div>
          </div>

          {/* Mobile-only: All sections stacked */}
          <div className="lg:hidden space-y-6 mt-6">
            <RebuttalsPanel rebuttals={mockRebuttals} />
            <TalkTrackSidebar tracks={mockTalkTracks} />
          </div>

          {/* Footer - Keyboard Shortcuts */}
          <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">
              💡 Pro Tip: Keyboard Shortcuts
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <kbd className="px-2 py-1 bg-background rounded border border-border text-xs">
                  M
                </kbd>{" "}
                to toggle mute
              </div>
              <div>
                <kbd className="px-2 py-1 bg-background rounded border border-border text-xs">
                  V
                </kbd>{" "}
                to toggle video
              </div>
              <div>
                <kbd className="px-2 py-1 bg-background rounded border border-border text-xs">
                  R
                </kbd>{" "}
                for rebuttals
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
