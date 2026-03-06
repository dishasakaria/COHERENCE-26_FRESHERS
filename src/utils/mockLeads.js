const FIRST_NAMES = ['Sarah', 'John', 'Michael', 'Emily', 'David', 'Jessica', 'Alex', 'Rachel', 'Chris', 'Amanda', 'Robert', 'Megan', 'Daniel', 'Sophie', 'James', 'Elena', 'Ryan', 'Clara', 'Matthew', 'Olivia'];
const LAST_NAMES = ['Chen', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker'];
const COMPANIES = [
  { name: 'Acme SaaS', domain: 'acmesaas.com', industry: 'Software', size: '50-200' },
  { name: 'GlobalTech', domain: 'globaltech.io', industry: 'Cloud Computing', size: '500-1000' },
  { name: 'BrightCRM', domain: 'brightcrm.net', industry: 'CRM Solutions', size: '10-50' },
  { name: 'DataMax', domain: 'datamax.ai', industry: 'Artificial Intelligence', size: '20-100' },
  { name: 'ByteForce', domain: 'byteforce.com', industry: 'Cybersecurity', size: '200-500' },
  { name: 'Innovate Inc', domain: 'innovate-inc.org', industry: 'R&D', size: '100-250' },
  { name: 'TechCorp', domain: 'techcorp.co', industry: 'Enterprise Software', size: '1000+' },
  { name: 'FlowSystems', domain: 'flowsystems.io', industry: 'Logistics Tech', size: '50-150' },
  { name: 'Solaris', domain: 'solaris.energy', industry: 'Renewable Tech', size: '150-300' },
  { name: 'CloudPeak', domain: 'cloudpeak.cloud', industry: 'Cloud Infrastructure', size: '300-600' }
];

const ROLES = ['Head of Growth', 'CTO', 'VP Engineering', 'Full-stack Developer', 'Marketing Director', 'CEO', 'Operations Manager', 'Project Lead', 'Sales Manager', 'Product Manager'];
const STAGES = ['new', 'in_sequence', 'engaged', 'hot', 'replied', 'meeting_scheduled', 'converted', 'nurture'];
const DISC_CATEGORIES = ['D', 'I', 'S', 'C'];

const AI_INSIGHTS = [
  {
    disc: 'Influential',
    summary: 'Relationship-driven decision maker who values trust and enthusiasm.',
    approach: 'Use conversational and energetic outreach. Lead with social proof.',
    opener: "Hi {name} — saw how {company} is scaling quickly. Curious how you're handling outbound right now?"
  },
  {
    disc: 'Dominant',
    summary: 'Results-oriented and fast-paced. Values efficiency and clear ROI.',
    approach: 'Be direct and concise. Focus on bottom-line results and efficiency gains.',
    opener: "Hey {name}, I noticed {company}'s recent growth. We help teams like yours double output with 30% less effort."
  },
  {
    disc: 'Steady',
    summary: 'Values stability and team collaboration. Needs to feel supported and safe.',
    approach: 'Provide extensive documentation and case studies. Be patient and build long-term trust.',
    opener: "Hi {name}, I've been following {company} for a while. I thought you might appreciate this case study on how we supported a similar transition."
  },
  {
    disc: 'Conscientious',
    summary: 'Analytical and detail-oriented. Values accuracy and well-thought-out processes.',
    approach: 'Lead with data and technical specs. Avoid fluff; use precise language.',
    opener: "Hello {name}, I've analyzed {company}'s current public tech stack. Our data shows a potential 15% optimization path if integrated correctly."
  }
];

export function generateMockLeads() {
  const leads = [];
  const count = 18;

  // Distribute stages roughly as requested
  // 4 leads → New, 3 leads → In Sequence, 3 leads → Engaged, 2 leads → Hot, 2 leads → Replied, 1 lead → Meeting Scheduled, plus some for others
  const stageDistribution = [
    'new', 'new', 'new', 'new',
    'in_sequence', 'in_sequence', 'in_sequence',
    'engaged', 'engaged', 'engaged',
    'hot', 'hot',
    'replied', 'replied',
    'meeting_scheduled',
    'converted',
    'nurture', 'nurture'
  ];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const companyInfo = COMPANIES[i % COMPANIES.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyInfo.domain}`;
    const insight = AI_INSIGHTS[i % AI_INSIGHTS.length];

    leads.push({
      id: `lead-${i + 1}`,
      name,
      company: companyInfo.name,
      email,
      role: ROLES[i % ROLES.length],
      company_size: companyInfo.size,
      industry: companyInfo.industry,
      stage: stageDistribution[i] || 'new',
      disc_category: DISC_CATEGORIES[i % DISC_CATEGORIES.length],
      assertiveness_score: Math.floor(Math.random() * 41) + (insight.disc === 'Dominant' ? 60 : 20),
      warmth_score: Math.floor(Math.random() * 41) + (insight.disc === 'Influential' ? 60 : 20),
      analytical_score: Math.floor(Math.random() * 41) + (insight.disc === 'Conscientious' ? 60 : 20),
      ai_summary: insight.summary,
      recommended_approach: insight.approach,
      best_opening_line: insight.opener.replace('{name}', firstName).replace('{company}', companyInfo.name),
      research_depth: ['basic', 'standard', 'deep'][Math.floor(Math.random() * 3)],
      interest_score: Math.floor(Math.random() * 100),
      trust_score: Math.floor(Math.random() * 100),
      fatigue_score: Math.floor(Math.random() * 80)
    });
  }

  return leads;
}
