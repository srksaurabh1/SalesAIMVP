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
    prospectName: "Priya Sharma",
    companyName: "Infosys",
    time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: "ready",
    avatar: "PS",
    context: "VP of Sales - interested in pipeline automation",
    email: "priya.sharma@infosys.com",
  },
  {
    id: "sample-2",
    prospectName: "Rohan Mehta",
    companyName: "Tata Consultancy Services",
    time: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    status: "researching",
    avatar: "RM",
    context: "Director of Engineering - evaluating solutions",
    email: "rohan.mehta@tcs.com",
  },
  {
    id: "meeting-3",
    prospectName: "Ananya Gupta",
    companyName: "Wipro",
    time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: "researching",
    avatar: "AG",
    context: "CTO - exploring integration capabilities",
    email: "ananya.gupta@wipro.com",
  },
  {
    id: "meeting-4",
    prospectName: "Arjun Singh",
    companyName: "HCL Technologies",
    time: new Date(Date.now() + 48 * 60 * 60 * 1000), // In 2 days
    status: "ready",
    avatar: "AS",
    context: "Head of Product - pricing discussion",
    email: "arjun.singh@hcl.com",
  },
  {
    id: "meeting-5",
    prospectName: "Saanvi Patel",
    companyName: "Paytm",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (past)
    status: "ready",
    avatar: "SP",
    context: "CFO - ROI validation",
    email: "saanvi.patel@paytm.com",
  },
];

// Mock Intent Spikes Data
export const mockIntentSpikes: IntentSpike[] = [
  {
    id: "spike-1",
    prospectName: "Priya Sharma",
    activity: "white_paper",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    company: "Infosys",
    details: "Downloaded 'Pipeline Automation 2026' white paper",
  },
  {
    id: "spike-2",
    prospectName: "Vikram Rao",
    activity: "pricing_page",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    company: "Reliance Jio",
    details: "Spent 8 minutes on pricing page - viewed enterprise plan",
  },
  {
    id: "spike-3",
    prospectName: "Aisha Khan",
    activity: "case_study",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    company: "Flipkart",
    details: "Viewed 3 case studies in logistics industry",
  },
  {
    id: "spike-4",
    prospectName: "Aditya Joshi",
    activity: "demo",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    company: "Tata Consultancy Services",
    details: "Requested live product demo - high engagement signal",
  },
];

// Mock Meeting Brief Data
export const mockMeetingBriefs: Record<string, MeetingBrief> = {
  "sample-1": {
    id: "sample-1",
    prospectName: "Priya Sharma",
    companyName: "Infosys",
    role: "VP of Sales",
    industry: "IT Services",
    iceBreakers: [
      {
        id: "ice-1",
        question:
          "I saw Infosys launched a new AI platform last month. How's the market reception?",
        context: "Recent press release about new AI platform",
      },
      {
        id: "ice-2",
        question:
          "Your recent quarterly results showed strong growth in digital services. What's driving that success?",
        context: "Quarterly earnings report",
      },
      {
        id: "ice-3",
        question:
          "I noticed you're expanding your team in Europe. Building out a global delivery center?",
        context: "50 new roles posted in the last 60 days for EU",
      },
    ],
    financialMetrics: [
      { label: "Annual Revenue", value: "₹1.2 Lakh Crores", change: 15, trend: "up" },
      { label: "Employee Count", value: "3,00,000+", change: 10, trend: "up" },
      { label: "Attrition Rate", value: "14.6%", change: -2.1, trend: "down" },
      { label: "Sales Headcount", value: "5,000+", change: 500, trend: "up" },
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
        text: "AI Platform Launch",
        source: "Company Website",
        url: "#",
      },
      {
        text: "Quarterly Results",
        source: "SEBI Filings",
        url: "#",
      },
      {
        text: "Revenue Metrics",
        source: "Annual Report",
        url: "#",
      },
    ],
  },
  "sample-2": {
    id: "sample-2",
    prospectName: "Rohan Mehta",
    companyName: "Tata Consultancy Services",
    role: "Director of Engineering",
    industry: "IT Services & Consulting",
    iceBreakers: [
      {
        id: "ice-4",
        question:
          "Your engineering team has a great reputation. How are you managing innovation at such a large scale?",
        context: "TCS recognized as a top employer",
      },
      {
        id: "ice-5",
        question:
          "I see TCS is investing heavily in cloud-native solutions. What's the strategy there?",
        context: "Recent partnerships with major cloud providers",
      },
    ],
    financialMetrics: [
      {
        label: "Market Cap",
        value: "₹14 Lakh Crores",
        change: 12,
        trend: "up",
      },
      { label: "Fortune 500 Clients", value: "100+", change: 5, trend: "up" },
      {
        label: "R&D Spend",
        value: "₹5,000 Crores",
        change: 20,
        trend: "up",
      },
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
        text: "Top Employer Award",
        source: "LinkedIn",
        url: "#",
      },
      {
        text: "Cloud Partnerships",
        source: "Company Newsroom",
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
