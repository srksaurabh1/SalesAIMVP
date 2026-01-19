export interface Meeting {
  id: string;
  prospectName: string;
  companyName: string;
  time: Date;
  status: "ready" | "researching";
  avatar?: string;
  context: string;
  email?: string;
}

export interface IntentSpike {
  id: string;
  prospectName: string;
  activity: "white_paper" | "pricing_page" | "case_study" | "blog" | "demo";
  timestamp: Date;
  company: string;
  details: string;
}

export interface IceBreaker {
  id: string;
  question: string;
  context: string;
}

export interface FinancialMetric {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
}

export interface ValueMapItem {
  feature: string;
  painPoint: string;
  relevance: "high" | "medium" | "low";
}

export interface MeetingBrief {
  id: string;
  prospectName: string;
  companyName: string;
  role: string;
  industry: string;
  iceBreakers: IceBreaker[];
  financialMetrics: FinancialMetric[];
  valueMap: ValueMapItem[];
  confidenceScore: number;
  citations: Array<{
    text: string;
    source: string;
    url?: string;
  }>;
}

// Mock Meetings Data
export const mockMeetings: Meeting[] = [
  {
    id: "sample-1",
    prospectName: "Sarah Chen",
    companyName: "TechVenture Inc",
    time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: "ready",
    avatar: "SC",
    context: "VP of Sales - interested in pipeline automation",
    email: "sarah.chen@techventure.com",
  },
  {
    id: "sample-2",
    prospectName: "Michael Rodriguez",
    companyName: "CloudScale Solutions",
    time: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    status: "researching",
    avatar: "MR",
    context: "Director of Engineering - evaluating solutions",
    email: "mrodriguez@cloudscale.io",
  },
  {
    id: "meeting-3",
    prospectName: "Jessica Thompson",
    companyName: "DataFlow Systems",
    time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: "researching",
    avatar: "JT",
    context: "CTO - exploring integration capabilities",
    email: "jthompson@dataflow.com",
  },
  {
    id: "meeting-4",
    prospectName: "David Park",
    companyName: "NextGen Analytics",
    time: new Date(Date.now() + 48 * 60 * 60 * 1000), // In 2 days
    status: "ready",
    avatar: "DP",
    context: "Head of Product - pricing discussion",
    email: "dpark@nextgen.ai",
  },
  {
    id: "meeting-5",
    prospectName: "Emily Watson",
    companyName: "FinTech Innovations",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (past)
    status: "ready",
    avatar: "EW",
    context: "CFO - ROI validation",
    email: "ewatson@fintech.io",
  },
];

// Mock Intent Spikes Data
export const mockIntentSpikes: IntentSpike[] = [
  {
    id: "spike-1",
    prospectName: "Sarah Chen",
    activity: "white_paper",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    company: "TechVenture Inc",
    details: "Downloaded 'Pipeline Automation 2026' white paper",
  },
  {
    id: "spike-2",
    prospectName: "Marcus Johnson",
    activity: "pricing_page",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    company: "Digital First Corp",
    details: "Spent 8 minutes on pricing page - viewed enterprise plan",
  },
  {
    id: "spike-3",
    prospectName: "Lisa Anderson",
    activity: "case_study",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    company: "RetailPro Systems",
    details: "Viewed 3 case studies in logistics industry",
  },
  {
    id: "spike-4",
    prospectName: "Robert Wilson",
    activity: "demo",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    company: "CloudScale Solutions",
    details: "Requested live product demo - high engagement signal",
  },
];

// Mock Meeting Brief Data
export const mockMeetingBriefs: Record<string, MeetingBrief> = {
  "sample-1": {
    id: "sample-1",
    prospectName: "Sarah Chen",
    companyName: "TechVenture Inc",
    role: "VP of Sales",
    industry: "SaaS",
    iceBreakers: [
      {
        id: "ice-1",
        question:
          "I saw TechVenture expanded into the EU market last month. How's that transition going?",
        context: "Recent LinkedIn post about European expansion",
      },
      {
        id: "ice-2",
        question:
          "Your recent funding round focused on sales team expansion. What's driving that growth?",
        context: "Series B funding announcement ($15M)",
      },
      {
        id: "ice-3",
        question:
          "I noticed you're hiring heavily in the sales operations space. Building out a revenue team?",
        context: "5 sales ops roles posted in the last 60 days",
      },
    ],
    financialMetrics: [
      { label: "Annual Revenue", value: "$42M", change: 35, trend: "up" },
      { label: "Customer Count", value: "380", change: 28, trend: "up" },
      { label: "Churn Rate", value: "3.2%", change: -0.8, trend: "down" },
      { label: "Sales Headcount", value: "24", change: 8, trend: "up" },
    ],
    valueMap: [
      {
        feature: "Real-time pipeline tracking",
        painPoint: "Visibility gaps between sales stages",
        relevance: "high",
      },
      {
        feature: "Automated deal scoring",
        painPoint: "Manual forecasting is error-prone",
        relevance: "high",
      },
      {
        feature: "Integrated CRM sync",
        painPoint: "Duplicate data entry across systems",
        relevance: "medium",
      },
    ],
    confidenceScore: 87,
    citations: [
      {
        text: "EU Expansion",
        source: "LinkedIn",
        url: "#",
      },
      {
        text: "Series B Funding",
        source: "TechCrunch",
        url: "#",
      },
      {
        text: "Revenue Metrics",
        source: "SEC Filings",
        url: "#",
      },
    ],
  },
  "sample-2": {
    id: "sample-2",
    prospectName: "Michael Rodriguez",
    companyName: "CloudScale Solutions",
    role: "Director of Engineering",
    industry: "Cloud Infrastructure",
    iceBreakers: [
      {
        id: "ice-4",
        question:
          "Your engineering team grew significantly. How are you managing knowledge sharing at scale?",
        context: "Team grew from 12 to 28 engineers in 6 months",
      },
      {
        id: "ice-5",
        question: "I see you're open-sourcing more projects. What's the strategy there?",
        context: "3 major open-source projects launched this year",
      },
    ],
    financialMetrics: [
      { label: "Monthly Recurring Revenue", value: "$1.2M", change: 42, trend: "up" },
      { label: "Enterprise Customers", value: "12", change: 5, trend: "up" },
      { label: "Infrastructure Cost", value: "$450K", change: 18, trend: "down" },
    ],
    valueMap: [
      {
        feature: "Automated scaling",
        painPoint: "Manual resource allocation is time-consuming",
        relevance: "high",
      },
      {
        feature: "Cost optimization",
        painPoint: "Infrastructure spend growing faster than revenue",
        relevance: "high",
      },
    ],
    confidenceScore: 72,
    citations: [
      {
        text: "Engineering Hiring",
        source: "LinkedIn",
        url: "#",
      },
      {
        text: "Open Source Initiative",
        source: "Company Blog",
        url: "#",
      },
    ],
  },
};

// Talk tracks for in-flight assistant
export const mockTalkTracks = [
  {
    category: "Opening",
    points: [
      "Reference the recent white paper download",
      "Acknowledge their expansion goals",
      "Express genuine interest in their solution",
    ],
  },
  {
    category: "Pain Point Discovery",
    points: [
      "Ask about current process for pipeline visibility",
      "Inquire about forecasting accuracy challenges",
      "Explore data silos between systems",
    ],
  },
  {
    category: "Solution Fit",
    points: [
      "Highlight real-time tracking capabilities",
      "Explain automated deal scoring benefits",
      "Demo the CRM integration",
    ],
  },
];

// Common objections and rebuttals
export const mockRebuttals = [
  {
    objection: "This seems similar to what we already have",
    rebuttal:
      "Many of our customers started with that perspective. What sets us apart is the real-time AI scoring and automatic risk alerts. Would it help to see a quick side-by-side comparison?",
  },
  {
    objection: "We need to get approval from IT first",
    rebuttal:
      "That's completely reasonable. Most of our enterprise customers require IT sign-off. I have an IT summary document that addresses security, compliance, and integration requirements. Should I send that over?",
  },
  {
    objection: "Pricing seems high for our current usage",
    rebuttal:
      "I understand. Most teams find that they use more features than they initially expect. Let's map your actual use case and see if there's a more appropriate plan. Often teams discover 2-3x ROI within 90 days.",
  },
];
