// Career data from official UK sources
// Salary data from ONS Annual Survey of Hours and Earnings (ASHE)
// AI/Automation risk from ONS research
// Demand trends from WEF Future of Jobs 2025

export interface SalaryRange {
  entry: [number, number];
  mid: [number, number];
  senior: [number, number];
}

export interface AutomationRisk {
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
}

export interface DemandTrend {
  trend: 'GROWING' | 'STABLE' | 'DECLINING';
  detail: string;
}

export interface LearningPhase {
  phase: number;
  title: string;
  duration: string;
  description: string;
  resources: string[];
}

export interface RoleData {
  id: string;
  title: string;
  description: string;
  salary: SalaryRange;
  automationRisk: AutomationRisk;
  demandTrend: DemandTrend;
  timeToEntry: string;
  bestFor: string[];
  certifications: string[];
  learningPath: LearningPhase[];
  walesEmployers: string[];
}

// ONS ASHE Salary Data (2024)
export const roleDatabase: Record<string, RoleData> = {
  support: {
    id: 'support',
    title: 'IT Support Specialist',
    description: 'Help users troubleshoot technical issues and maintain IT systems',
    salary: {
      entry: [22000, 28000],
      mid: [28000, 38000],
      senior: [38000, 50000],
    },
    automationRisk: {
      risk: 'MEDIUM',
      reason: 'Basic queries automating, complex issues remain human',
    },
    demandTrend: {
      trend: 'STABLE',
      detail: 'Consistent need across all sectors',
    },
    timeToEntry: '1-3 months',
    bestFor: ['Customer Service', 'Problem Solving', 'Fast entry needed'],
    certifications: ['CompTIA A+', 'CompTIA Network+', 'ITIL Foundation'],
    learningPath: [
      {
        phase: 1,
        title: 'Foundation',
        duration: '2-4 weeks',
        description: 'Core IT fundamentals and troubleshooting basics',
        resources: ['CompTIA A+ Study Guide', 'Professor Messer (Free)', 'Google IT Support Certificate'],
      },
      {
        phase: 2,
        title: 'Certification',
        duration: '4-6 weeks',
        description: 'Industry certification preparation',
        resources: ['CompTIA A+ Exam Prep', 'Practice Labs', 'Exam Voucher'],
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '2-4 weeks',
        description: 'CV, portfolio, and interview preparation',
        resources: ['LinkedIn Optimization', 'Mock Interviews', 'Job Applications'],
      },
    ],
    walesEmployers: ['Admiral', 'DVLA', 'Welsh Government', 'NHS Wales'],
  },
  cybersecurity: {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    description: 'Protect systems and data from cyber threats and security breaches',
    salary: {
      entry: [30000, 40000],
      mid: [40000, 55000],
      senior: [55000, 80000],
    },
    automationRisk: {
      risk: 'LOW',
      reason: 'Threat landscape requires human judgment and creativity',
    },
    demandTrend: {
      trend: 'GROWING',
      detail: '35% increase expected by 2030',
    },
    timeToEntry: '6-12 months',
    bestFor: ['Compliance / Regulation', 'Problem Solving', 'Risk-aware mindset'],
    certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'CISSP'],
    learningPath: [
      {
        phase: 1,
        title: 'Foundation',
        duration: '6-8 weeks',
        description: 'Networking fundamentals and security basics',
        resources: ['CompTIA Network+', 'TryHackMe (Free)', 'Cybrary Free Courses'],
      },
      {
        phase: 2,
        title: 'Certification',
        duration: '8-12 weeks',
        description: 'Security+ certification and hands-on labs',
        resources: ['CompTIA Security+ Prep', 'HackTheBox', 'Blue Team Labs'],
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '4-8 weeks',
        description: 'Portfolio building and interview prep',
        resources: ['Home Lab Setup', 'CTF Competitions', 'Security Blog'],
      },
    ],
    walesEmployers: ['GCHQ (Cheltenham)', 'Admiral', 'Thales', 'Welsh Government'],
  },
  data: {
    id: 'data',
    title: 'Data Analyst',
    description: 'Analyze and visualize data to drive business decisions',
    salary: {
      entry: [28000, 35000],
      mid: [35000, 48000],
      senior: [48000, 65000],
    },
    automationRisk: {
      risk: 'MEDIUM',
      reason: 'AI assists but interpretation needs human insight',
    },
    demandTrend: {
      trend: 'GROWING',
      detail: 'Highest demand across sectors',
    },
    timeToEntry: '3-6 months',
    bestFor: ['Data Analysis', 'Excel / Google Sheets power users', 'Business background'],
    certifications: ['Google Data Analytics', 'Microsoft Power BI', 'SQL Certification'],
    learningPath: [
      {
        phase: 1,
        title: 'Foundation',
        duration: '4-6 weeks',
        description: 'SQL, Excel advanced, and statistics basics',
        resources: ['Khan Academy Statistics', 'SQLZoo (Free)', 'Google Sheets Advanced'],
      },
      {
        phase: 2,
        title: 'Tools & Visualization',
        duration: '6-8 weeks',
        description: 'Power BI, Tableau, and Python for data',
        resources: ['Power BI Desktop', 'Kaggle Courses', 'DataCamp'],
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '4-6 weeks',
        description: 'Portfolio projects and case studies',
        resources: ['GitHub Portfolio', 'Kaggle Projects', 'LinkedIn Learning'],
      },
    ],
    walesEmployers: ['ONS', 'Admiral', 'Confused.com', 'GoCompare'],
  },
  cloud: {
    id: 'cloud',
    title: 'Cloud Administrator',
    description: 'Manage and optimize cloud infrastructure on AWS, Azure, or GCP',
    salary: {
      entry: [35000, 45000],
      mid: [45000, 60000],
      senior: [60000, 85000],
    },
    automationRisk: {
      risk: 'LOW',
      reason: 'Infrastructure complexity requires expertise',
    },
    demandTrend: {
      trend: 'GROWING',
      detail: 'Digital transformation driving demand',
    },
    timeToEntry: '6-9 months',
    bestFor: ['Operations Management', 'Technical interest', 'Higher salary target'],
    certifications: ['AWS Cloud Practitioner', 'AWS Solutions Architect', 'Azure Administrator'],
    learningPath: [
      {
        phase: 1,
        title: 'Foundation',
        duration: '4-6 weeks',
        description: 'Cloud concepts and Linux basics',
        resources: ['AWS Cloud Practitioner', 'Linux Journey (Free)', 'A Cloud Guru'],
      },
      {
        phase: 2,
        title: 'Certification',
        duration: '8-12 weeks',
        description: 'Solutions Architect or Azure Admin prep',
        resources: ['AWS Free Tier Labs', 'Whizlabs Practice', 'Exam Prep'],
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '4-6 weeks',
        description: 'Real-world projects and portfolio',
        resources: ['Personal Cloud Projects', 'GitHub Repos', 'Tech Blog'],
      },
    ],
    walesEmployers: ['AWS (if remote)', 'Admiral', 'Airbus', 'General Dynamics'],
  },
  product: {
    id: 'product',
    title: 'Product/Project Coordinator',
    description: 'Manage tech projects and coordinate between stakeholders',
    salary: {
      entry: [30000, 40000],
      mid: [40000, 55000],
      senior: [55000, 75000],
    },
    automationRisk: {
      risk: 'LOW',
      reason: 'Strategy and stakeholder work hard to automate',
    },
    demandTrend: {
      trend: 'GROWING',
      detail: 'Tech expansion creating management roles',
    },
    timeToEntry: '3-6 months',
    bestFor: ['Leadership', 'Stakeholder Management', 'Project Management'],
    certifications: ['PRINCE2 Foundation', 'Scrum Master (PSM I)', 'PMP'],
    learningPath: [
      {
        phase: 1,
        title: 'Foundation',
        duration: '4-6 weeks',
        description: 'Agile fundamentals and project basics',
        resources: ['Agile Manifesto', 'Scrum Guide (Free)', 'LinkedIn Learning'],
      },
      {
        phase: 2,
        title: 'Certification',
        duration: '6-8 weeks',
        description: 'Scrum Master or PRINCE2 certification',
        resources: ['PSM I Prep', 'PRINCE2 Course', 'Practice Exams'],
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '4-6 weeks',
        description: 'Case studies and interview preparation',
        resources: ['Mock Projects', 'Interview Prep', 'Networking'],
      },
    ],
    walesEmployers: ['Admiral', 'DVLA', 'Welsh Government', 'BBC Wales'],
  },
  webdev: {
    id: 'webdev',
    title: 'Junior Web Developer',
    description: 'Build and maintain websites and web applications',
    salary: {
      entry: [25000, 32000],
      mid: [32000, 45000],
      senior: [45000, 65000],
    },
    automationRisk: {
      risk: 'MEDIUM',
      reason: 'AI code assist rising, but design/UX human-led',
    },
    demandTrend: {
      trend: 'STABLE',
      detail: 'Saturated entry-level, mid+ strong demand',
    },
    timeToEntry: '6-12 months',
    bestFor: ['Creative types', 'Visual thinkers', 'Portfolio builders'],
    certifications: ['freeCodeCamp Responsive Web Design', 'Meta Front-End Developer', 'JavaScript Certification'],
    learningPath: [
      {
        phase: 1,
        title: 'Foundation',
        duration: '8-12 weeks',
        description: 'HTML, CSS, JavaScript fundamentals',
        resources: ['freeCodeCamp (Free)', 'The Odin Project', 'MDN Web Docs'],
      },
      {
        phase: 2,
        title: 'Framework & Tools',
        duration: '8-12 weeks',
        description: 'React/Vue, Git, and responsive design',
        resources: ['React Documentation', 'Frontend Masters', 'GitHub Learning'],
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '6-8 weeks',
        description: 'Portfolio projects and freelance',
        resources: ['Personal Portfolio', 'Open Source Contributions', 'Freelance Projects'],
      },
    ],
    walesEmployers: ['Box UK', 'Sequence', 'Storm Ideas', 'Freelance'],
  },
  aitools: {
    id: 'aitools',
    title: 'AI Tools Specialist',
    description: 'Implement and optimize AI tools for business productivity',
    salary: {
      entry: [32000, 42000],
      mid: [42000, 55000],
      senior: [55000, 75000],
    },
    automationRisk: {
      risk: 'LOW',
      reason: 'Human oversight of AI systems essential',
    },
    demandTrend: {
      trend: 'GROWING',
      detail: 'Explosive growth as AI adoption increases',
    },
    timeToEntry: '3-6 months',
    bestFor: ['Process Improvement', 'Training / Teaching', 'Early adopters'],
    certifications: ['Google AI Essentials', 'Microsoft AI-900', 'Prompt Engineering Cert'],
    learningPath: [
      {
        phase: 1,
        title: 'Foundation',
        duration: '4-6 weeks',
        description: 'AI fundamentals and prompt engineering',
        resources: ['Google AI Essentials', 'DeepLearning.AI (Free)', 'OpenAI Docs'],
      },
      {
        phase: 2,
        title: 'Tools & Integration',
        duration: '6-8 weeks',
        description: 'ChatGPT, Copilot, automation workflows',
        resources: ['Microsoft Copilot Training', 'Make/Zapier', 'AI for Business'],
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '4-6 weeks',
        description: 'Case studies and implementation projects',
        resources: ['AI Use Case Portfolio', 'ROI Documentation', 'Training Materials'],
      },
    ],
    walesEmployers: ['Various (Cross-sector)', 'Consulting Firms', 'Enterprise Companies'],
  },
};

// Quick lookup functions
export const getSalaryRange = (roleId: string): SalaryRange | null => {
  return roleDatabase[roleId]?.salary || null;
};

export const getAutomationRisk = (roleId: string): AutomationRisk | null => {
  return roleDatabase[roleId]?.automationRisk || null;
};

export const getDemandTrend = (roleId: string): DemandTrend | null => {
  return roleDatabase[roleId]?.demandTrend || null;
};

export const getRoleData = (roleId: string): RoleData | null => {
  return roleDatabase[roleId] || null;
};

export const getAllRoles = (): RoleData[] => {
  return Object.values(roleDatabase);
};

// Wales-specific resources
export const walesResources = {
  funding: [
    {
      name: 'ReAct+',
      url: 'https://businesswales.gov.wales/skillsgateway/react',
      description: 'Support for people facing or at risk of redundancy',
    },
    {
      name: 'Careers Wales',
      url: 'https://careerswales.gov.wales/',
      description: 'Free career advice and job matching',
    },
    {
      name: 'Personal Learning Accounts',
      url: 'https://workingwales.gov.wales/how-we-can-help/personal-learning-accounts',
      description: 'Funding for flexible training courses',
    },
  ],
  redundancy: [
    {
      name: 'Gov.uk Redundancy Rights',
      url: 'https://www.gov.uk/redundancy-your-rights',
      description: 'Official guidance on redundancy rights',
    },
    {
      name: 'ACAS Redundancy',
      url: 'https://www.acas.org.uk/redundancy',
      description: 'Advice on redundancy processes',
    },
    {
      name: 'Citizens Advice',
      url: 'https://www.citizensadvice.org.uk/work/leaving-a-job/redundancy/',
      description: 'Free, confidential advice',
    },
  ],
};
