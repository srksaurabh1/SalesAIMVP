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
  "meeting-3": {
    id: "meeting-3",
    prospectName: "Ananya Gupta",
    companyName: "Wipro",
    role: "CTO",
    industry: "IT Services & Consulting",
    iceBreakers: [
      {
        id: "ice-6",
        question:
          "Wipro has been a leader in sustainability. How does that influence your technology choices?",
        context: "Wipro's recent sustainability report",
      },
      {
        id: "ice-7",
        question:
          "I saw the recent acquisition of Capco. How is the integration of consulting and technology capabilities progressing?",
        context: "News article on Capco acquisition",
      },
    ],
    financialMetrics: [
      { label: "Revenue", value: "₹80,000 Cr", change: 8, trend: "up" },
      { label: "Net Income", value: "₹10,800 Cr", change: 12, trend: "up" },
      { label: "Employees", value: "250,000+", change: 7, trend: "up" },
    ],
    valueMap: [
      {
        feature: "Scalable API Integrations",
        painPoint:
          "Legacy systems are difficult to integrate with new cloud services.",
        relevance: "high",
      },
      {
        feature: "Enhanced Security Protocols",
        painPoint:
          "Ensuring data security across a hybrid cloud environment is a top priority.",
        relevance: "high",
      },
    ],
    confidenceScore: 82,
    citations: [
      {
        text: "Sustainability Report",
        source: "Wipro Website",
        url: "#",
      },
      {
        text: "Capco Acquisition News",
        source: "Economic Times",
        url: "#",
      },
    ],
  },
  "meeting-4": {
    id: "meeting-4",
    prospectName: "Arjun Singh",
    companyName: "HCL Technologies",
    role: "Head of Product",
    industry: "Technology",
    iceBreakers: [
      {
        id: "ice-8",
        question:
          "HCL's 'Mode 1-2-3' strategy is interesting. How does your product fit into that framework?",
        context: "HCL's investor presentation",
      },
      {
        id: "ice-9",
        question:
          "Congratulations on the partnership with Google Cloud. What new product opportunities does that open up?",
        context: "Press release on Google Cloud partnership",
      },
    ],
    financialMetrics: [
      { label: "Market Cap", value: "₹3.5 Lakh Cr", change: 18, trend: "up" },
      { label: "Deal TCV", value: "$2.1B (Last Qtr)", change: 25, trend: "up" },
      { label: "Patents Filed", value: "1500+", change: 30, trend: "up" },
    ],
    valueMap: [
      {
        feature: "Flexible Pricing Tiers",
        painPoint:
          "Current solutions have rigid pricing that doesn't scale with usage.",
        relevance: "high",
      },
      {
        feature: "Usage-based Analytics",
        painPoint:
          "Lack of visibility into which features are driving customer value.",
        relevance: "medium",
      },
    ],
    confidenceScore: 78,
    citations: [
      {
        text: "Mode 1-2-3 Strategy",
        source: "HCL Tech Website",
        url: "#",
      },
      {
        text: "Google Cloud Partnership",
        source: "Company Newsroom",
        url: "#",
      },
    ],
  },
  "meeting-5": {
    id: "meeting-5",
    prospectName: "Saanvi Patel",
    companyName: "Paytm",
    role: "CFO",
    industry: "FinTech",
    iceBreakers: [
      {
        id: "ice-10",
        question:
          "Paytm's journey from a wallet to a full-stack financial services platform is remarkable. What's the next big focus for monetization?",
        context: "Paytm's IPO prospectus and recent news",
      },
      {
        id: "ice-11",
        question:
          "I saw the strong growth in loan disbursals. How are you managing the financial risk and ROI on that portfolio?",
        context: "Quarterly earnings call transcript",
      },
    ],
    financialMetrics: [
      { label: "GMV", value: "₹4.0 Lakh Cr", change: 40, trend: "up" },
      { label: "Revenue from Ops", value: "₹5,264 Cr", change: 65, trend: "up" },
      {
        label: "Contribution Profit",
        value: "₹2,168 Cr",
        change: 210,
        trend: "up",
      },
    ],
    valueMap: [
      {
        feature: "ROI Forecasting Models",
        painPoint:
          "Difficult to accurately forecast ROI on new marketing and sales investments.",
        relevance: "high",
      },
      {
        feature: "Automated Financial Reporting",
        painPoint:
          "Manual report generation for board meetings is time-consuming and prone to errors.",
        relevance: "high",
      },
    ],
    confidenceScore: 91,
    citations: [
      {
        text: "Quarterly Earnings",
        source: "Paytm Investor Relations",
        url: "#",
      },
      {
        text: "Loan Disbursal Growth",
        source: "Livemint Article",
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
