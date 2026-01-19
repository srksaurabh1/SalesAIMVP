import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { mockMeetingBriefs, mockMeetings } from "@/lib/mockData";
import { IceBreakers } from "@/components/meeting-brief/IceBreakers";
import { FinancialPulse } from "@/components/meeting-brief/FinancialPulse";
import { ValueMap } from "@/components/meeting-brief/ValueMap";
import { ConfidenceMeter } from "@/components/meeting-brief/ConfidenceMeter";
import { Citations } from "@/components/meeting-brief/Citations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Briefcase } from "lucide-react";

export default function MeetingBrief() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  // Get the mock brief data
  const brief = mockMeetingBriefs[accountId || "sample-1"];
  const meeting = mockMeetings.find((m) => m.id === accountId);

  if (!brief) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Brief Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The meeting brief you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")} variant="default">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {brief.prospectName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {brief.role}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {brief.companyName}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">
                  {brief.industry}
                </span>
              </div>
            </div>

            {meeting && (
              <div className="flex flex-col gap-2 text-right">
                <div className="flex items-center gap-2 justify-end text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {meeting.time.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {meeting.email && (
                  <div className="text-sm text-muted-foreground">
                    {meeting.email}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ice-breakers">Ice Breakers</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger className="hidden lg:inline-flex" value="value-map">
                Value Map
              </TabsTrigger>
              <TabsTrigger className="hidden lg:inline-flex" value="sources">
                Sources
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Key Info Cards */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Role</h3>
                  </div>
                  <p className="text-lg font-bold text-primary mb-1">
                    {brief.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Typical decision maker
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold text-foreground">Company</h3>
                  </div>
                  <p className="text-lg font-bold text-primary mb-1">
                    {brief.companyName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {brief.industry}
                  </p>
                </div>

                {/* Confidence Score - Prominent */}
                <div className="lg:col-span-1 row-span-2 lg:row-span-1">
                  <ConfidenceMeter score={brief.confidenceScore} />
                </div>
              </div>

              {/* Brief Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Meeting Context
                </h3>
                <p className="text-muted-foreground">
                  This meeting brief has been compiled from multiple sources to
                  give you a comprehensive view of {brief.prospectName} at{" "}
                  {brief.companyName}. Use the tabs below to explore specific
                  sections:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Ice Breakers:</strong> Contextual conversation
                    starters
                  </li>
                  <li>
                    • <strong>Financials:</strong> Key metrics and growth trends
                  </li>
                  <li>
                    • <strong>Value Map:</strong> How our solution fits their
                    needs
                  </li>
                  <li>
                    • <strong>Sources:</strong> Data sources backing our
                    insights
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Ice Breakers Tab */}
            <TabsContent value="ice-breakers">
              <IceBreakers items={brief.iceBreakers} />
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials" className="space-y-6">
              <FinancialPulse metrics={brief.financialMetrics} />
            </TabsContent>

            {/* Value Map Tab */}
            <TabsContent value="value-map">
              <ValueMap items={brief.valueMap} />
            </TabsContent>

            {/* Sources Tab */}
            <TabsContent value="sources">
              <Citations citations={brief.citations} />
            </TabsContent>
          </Tabs>

          {/* All Sections (Mobile/Fallback) */}
          <div className="lg:hidden space-y-8 mt-8">
            <IceBreakers items={brief.iceBreakers} />
            <FinancialPulse metrics={brief.financialMetrics} />
            <ValueMap items={brief.valueMap} />
            <Citations citations={brief.citations} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
