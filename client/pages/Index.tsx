import { MainLayout } from "@/layouts/MainLayout";
import { RoleToggle } from "@/components/dashboard/RoleToggle";
import { IntentSpikesAlert } from "@/components/dashboard/IntentSpikesAlert";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { useRole } from "@/hooks/useRole";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { fetchBriefing } from "@/lib/orchestrationClient";

export default function Index() {
  const { role } = useRole();
  const [companyName, setCompanyName] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateInsights = async () => {
    setLoading(true);
    try {
      const briefing = await fetchBriefing(companyName, role);
      setInsights(briefing);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <img src="/Image/Sales AI logo.png" alt="SalesAI" className="w-6 h-6 object-contain" />
                <span className="text-sm font-semibold text-primary">
                  HOME
                </span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Intelligence Sales
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {role === "sdr"
                  ? "Discover prospects, understand their needs, and identify the right fit for your solution."
                  : "Close deals faster with real-time insights on account health, objection handlers, and closing strategies."}
              </p>
            </div>

            <div className="w-full md:w-auto">
              <RoleToggle />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Intent Spikes */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white dark:bg-card rounded-lg border border-border p-5 shadow-sm">
                <IntentSpikesAlert />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Upcoming Meetings Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Upcoming Meetings
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {role === "sdr"
                    ? "Quick summary of your qualification conversations"
                    : "Your closing opportunities and deal progress"}
                </p>
              </div>

              {/* Meetings Grid */}
              <UpcomingMeetings />

              {/* Additional Context for Current Role */}
              <div className="mt-8 p-6 rounded-lg bg-muted/30 border border-border">
                <h3 className="font-semibold mb-2">
                  {role === "sdr" ? "SDR Mode Tips" : "AE Mode Tips"}
                </h3>
                {role === "sdr" ? (
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        Focus on understanding prospect pain points and goals
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        Use Ice Breakers from the Meeting Brief to start
                        conversations
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        Watch for Intent Spikes - prospects showing high
                        engagement
                      </span>
                    </li>
                  </ul>
                ) : (
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        Leverage the Meeting Brief for deep account context
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        Use In-Flight Assistant during calls for live support
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        Focus on value map and financial metrics for decision
                        makers
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generate Insights Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Generate Insights for a Company</h2>
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            <button
              onClick={handleGenerateInsights}
              className="bg-primary text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Insights"}
            </button>
          </div>

          {insights && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Insights</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded-lg overflow-auto">
                {JSON.stringify(insights, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
