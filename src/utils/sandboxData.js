export const MOCK_PERSONALITY = {
  opener: "I saw your recent expansion into the APAC market and wanted to reach out—it's rare to see a team scale that quickly while maintaining product quality.",
  dos: [
    "Focus on short-term ROI wins",
    "Use low-friction questions to start",
    "Reference specific industry trends",
    "Keep sentences under 15 words"
  ],
  donts: [
    "Don't pitch on the first email",
    "Avoid using corporate jargon",
    "Never send more than 3 follow-ups",
    "Don't use generic templates"
  ],
  adjectives: ["Direct", "Empathetic", "Insightful", "Professional", "Agile"]
};

export const MOCK_LEADS = [
  { name: "Priya Sharma", company: "Zomato", email: "p.sharma@zomato.com", title: "Product Head", industry: "FoodTech" },
  { name: "James Wilson", company: "Stripe", email: "james.w@stripe.com", title: "VP Sales", industry: "FinTech" },
  { name: "Rahul Verma", company: "Razorpay", email: "verma.r@razorpay.com", title: "Founder", industry: "Payments" },
  { name: "Sarah Chen", company: "ByteDance", email: "s.chen@bytedance.com", title: "Growth lead", industry: "Social Media" },
  { name: "Amit Goenka", company: "Zepto", email: "amit@zepto.in", title: "Supply Chain Head", industry: "Quick Commerce" },
  { name: "Elena Rossi", company: "Ferrari", email: "e.rossi@ferrari.it", title: "Marketing Director", industry: "Automotive" },
  { name: "David Miller", company: "Atlassian", email: "david.m@atlassian.com", title: "Engineering Manager", industry: "DevTools" },
  { name: "Ananya Iyer", company: "CRED", email: "ananya@cred.club", title: "Chief of Staff", industry: "FinTech" }
];

export const MOCK_EMAILS = [
  { 
    subject: "Quick question about {Company} growth",
    body: "Hi {Name},\n\nI was looking at {Company} and noticed you're scaling fast. We've helped similar teams in {Industry} increase their outreach efficiency by 40%.\n\nWould you be open to a 5-minute chat next Tuesday?\n\nBest,\n{User}"
  },
  {
    subject: "Congrats on the {Company} launch!",
    body: "Hey {Name},\n\nJust saw the news about your latest product launch at {Company}. Incredible work.\n\nI'd love to show you how our AI can help maintain that momentum for your sales team.\n\nCheers,\n{User}"
  }
];

export const MOCK_REPLIES = [
  { name: "Priya Sharma", status: "interested", content: "This sounds interesting. Can you send over some more info?" },
  { name: "James Wilson", status: "checking", content: "I'll check with my team and get back to you by Friday." },
  { name: "Sarah Chen", status: "meeting", content: "Let's chat. Does tomorrow at 10 AM work?" }
];
