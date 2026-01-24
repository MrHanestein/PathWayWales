// Learning resources with links organized by category

export interface ResourceLink {
  name: string;
  url: string;
  description: string;
  isFree: boolean;
  duration?: string;
  cost?: string;
}

export interface CertificationInfo {
  name: string;
  url: string;
  cost: string;
  duration: string;
  provider: string;
  description: string;
}

// Free learning resources
export const freeResources: Record<string, ResourceLink[]> = {
  support: [
    { name: 'Professor Messer A+', url: 'https://www.professormesser.com/free-a-plus-training/', description: 'Free CompTIA A+ training videos', isFree: true },
    { name: 'Google IT Support', url: 'https://www.coursera.org/professional-certificates/google-it-support', description: 'Google IT Support Professional Certificate', isFree: true, duration: '6 months' },
    { name: 'IT Fundamentals', url: 'https://www.freecodecamp.org/', description: 'Basic IT and coding fundamentals', isFree: true },
  ],
  cybersecurity: [
    { name: 'TryHackMe', url: 'https://tryhackme.com/', description: 'Interactive cybersecurity training', isFree: true },
    { name: 'Cybrary', url: 'https://www.cybrary.it/', description: 'Free cybersecurity courses', isFree: true },
    { name: 'SANS Cyber Aces', url: 'https://www.cyberaces.org/', description: 'Free security fundamentals', isFree: true },
    { name: 'OverTheWire', url: 'https://overthewire.org/wargames/', description: 'Learn security through games', isFree: true },
  ],
  data: [
    { name: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability', description: 'Free statistics and probability course', isFree: true },
    { name: 'SQLZoo', url: 'https://sqlzoo.net/', description: 'Interactive SQL tutorials', isFree: true },
    { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', description: 'Free data science micro-courses', isFree: true },
    { name: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/', description: 'Comprehensive SQL learning', isFree: true },
  ],
  cloud: [
    { name: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', description: 'Free AWS fundamentals course', isFree: true, duration: '6 hours' },
    { name: 'Linux Journey', url: 'https://linuxjourney.com/', description: 'Free Linux learning path', isFree: true },
    { name: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/training/', description: 'Free Azure training modules', isFree: true },
    { name: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/', description: 'Free GCP learning paths', isFree: true },
  ],
  product: [
    { name: 'Scrum Guide', url: 'https://scrumguides.org/', description: 'Official Scrum methodology guide', isFree: true },
    { name: 'Product School Resources', url: 'https://productschool.com/resources/', description: 'Free product management resources', isFree: true },
    { name: 'Agile Alliance', url: 'https://www.agilealliance.org/agile101/', description: 'Agile fundamentals and glossary', isFree: true },
  ],
  webdev: [
    { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', description: 'Full stack web development curriculum', isFree: true, duration: '300+ hours' },
    { name: 'The Odin Project', url: 'https://www.theodinproject.com/', description: 'Full stack open source curriculum', isFree: true },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'Comprehensive web documentation', isFree: true },
    { name: 'JavaScript.info', url: 'https://javascript.info/', description: 'Modern JavaScript tutorial', isFree: true },
  ],
  aitools: [
    { name: 'Google AI Essentials', url: 'https://www.cloudskillsboost.google/paths/118', description: 'AI fundamentals from Google', isFree: true },
    { name: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/courses/', description: 'AI courses from Andrew Ng', isFree: true },
    { name: 'OpenAI Documentation', url: 'https://platform.openai.com/docs/', description: 'Learn to use OpenAI APIs', isFree: true },
    { name: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', description: 'Free prompt engineering course', isFree: true },
  ],
};

// Paid resources
export const paidResources: Record<string, ResourceLink[]> = {
  support: [
    { name: 'CompTIA CertMaster', url: 'https://www.comptia.org/training/certmaster', description: 'Official CompTIA training', isFree: false, cost: '£199+' },
    { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/', description: 'IT Support learning paths', isFree: false, cost: '£29.99/month' },
    { name: 'Pluralsight', url: 'https://www.pluralsight.com/', description: 'Tech skills platform', isFree: false, cost: '£24/month' },
  ],
  cybersecurity: [
    { name: 'Hack The Box Academy', url: 'https://academy.hackthebox.com/', description: 'Structured cybersecurity training', isFree: false, cost: '£14/month' },
    { name: 'Offensive Security', url: 'https://www.offsec.com/', description: 'Advanced penetration testing', isFree: false, cost: '£799+' },
    { name: 'SANS Training', url: 'https://www.sans.org/', description: 'Industry-leading security courses', isFree: false, cost: '£3000+' },
  ],
  data: [
    { name: 'DataCamp', url: 'https://www.datacamp.com/', description: 'Interactive data science learning', isFree: false, cost: '£25/month' },
    { name: 'Coursera Plus', url: 'https://www.coursera.org/courseraplus', description: 'Google Data Analytics Certificate', isFree: false, cost: '£42/month' },
    { name: 'Udemy Data Courses', url: 'https://www.udemy.com/topic/data-analysis/', description: 'Affordable data analysis courses', isFree: false, cost: '£12.99+' },
  ],
  cloud: [
    { name: 'A Cloud Guru', url: 'https://acloudguru.com/', description: 'Cloud certification training', isFree: false, cost: '£30/month' },
    { name: 'Whizlabs', url: 'https://www.whizlabs.com/', description: 'Practice exams and labs', isFree: false, cost: '£15/month' },
    { name: 'Cloud Academy', url: 'https://cloudacademy.com/', description: 'Multi-cloud training platform', isFree: false, cost: '£35/month' },
  ],
  product: [
    { name: 'Scrum.org Training', url: 'https://www.scrum.org/professional-scrum-training', description: 'Official Scrum certification', isFree: false, cost: '£850+' },
    { name: 'PRINCE2 Course', url: 'https://www.axelos.com/certifications/prince2', description: 'Project management certification', isFree: false, cost: '£500+' },
    { name: 'Reforge', url: 'https://www.reforge.com/', description: 'Advanced product management', isFree: false, cost: '£1,500+' },
  ],
  webdev: [
    { name: 'Frontend Masters', url: 'https://frontendmasters.com/', description: 'Expert-led web development', isFree: false, cost: '£32/month' },
    { name: 'Udemy Web Dev', url: 'https://www.udemy.com/topic/web-development/', description: 'Affordable web dev courses', isFree: false, cost: '£12.99+' },
    { name: 'Codecademy Pro', url: 'https://www.codecademy.com/pro', description: 'Interactive coding platform', isFree: false, cost: '£17.99/month' },
  ],
  aitools: [
    { name: 'Microsoft AI Certification', url: 'https://learn.microsoft.com/en-us/credentials/', description: 'Azure AI certifications', isFree: false, cost: '£135+' },
    { name: 'Coursera AI Specializations', url: 'https://www.coursera.org/browse/data-science/machine-learning', description: 'AI and ML specializations', isFree: false, cost: '£42/month' },
  ],
};

// Certification information
export const certifications: Record<string, CertificationInfo[]> = {
  support: [
    { name: 'CompTIA A+', url: 'https://www.comptia.org/certifications/a', cost: '£299', duration: '2-4 weeks', provider: 'CompTIA', description: 'Entry-level IT certification' },
    { name: 'CompTIA Network+', url: 'https://www.comptia.org/certifications/network', cost: '£299', duration: '4-6 weeks', provider: 'CompTIA', description: 'Networking fundamentals' },
    { name: 'ITIL Foundation', url: 'https://www.axelos.com/certifications/itil-service-management', cost: '£299', duration: '2-3 weeks', provider: 'Axelos', description: 'IT service management basics' },
  ],
  cybersecurity: [
    { name: 'CompTIA Security+', url: 'https://www.comptia.org/certifications/security', cost: '£319', duration: '4-8 weeks', provider: 'CompTIA', description: 'Security fundamentals certification' },
    { name: 'Certified Ethical Hacker', url: 'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/', cost: '£950', duration: '8-12 weeks', provider: 'EC-Council', description: 'Ethical hacking certification' },
    { name: 'CISSP', url: 'https://www.isc2.org/certifications/cissp', cost: '£575', duration: '12+ weeks', provider: '(ISC)²', description: 'Advanced security management' },
  ],
  data: [
    { name: 'Google Data Analytics', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', cost: '£312', duration: '6 months', provider: 'Google', description: 'Professional data analytics certificate' },
    { name: 'Microsoft Power BI', url: 'https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/', cost: '£135', duration: '4-6 weeks', provider: 'Microsoft', description: 'Power BI data analyst certification' },
    { name: 'Tableau Desktop Specialist', url: 'https://www.tableau.com/learn/certification/desktop-specialist', cost: '£100', duration: '2-4 weeks', provider: 'Tableau', description: 'Data visualization certification' },
  ],
  cloud: [
    { name: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/', cost: '£85', duration: '4-6 weeks', provider: 'AWS', description: 'Cloud fundamentals certification' },
    { name: 'AWS Solutions Architect', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', cost: '£130', duration: '8-12 weeks', provider: 'AWS', description: 'Cloud architecture certification' },
    { name: 'Azure Administrator', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/', cost: '£135', duration: '6-10 weeks', provider: 'Microsoft', description: 'Azure admin certification' },
  ],
  product: [
    { name: 'Professional Scrum Master I', url: 'https://www.scrum.org/assessments/professional-scrum-master-i-certification', cost: '£130', duration: '2-4 weeks', provider: 'Scrum.org', description: 'Scrum Master certification' },
    { name: 'PRINCE2 Foundation', url: 'https://www.axelos.com/certifications/prince2', cost: '£299', duration: '3-5 weeks', provider: 'Axelos', description: 'Project management methodology' },
    { name: 'PMI CAPM', url: 'https://www.pmi.org/certifications/certified-associate-capm', cost: '£225', duration: '6-8 weeks', provider: 'PMI', description: 'Associate project manager' },
  ],
  webdev: [
    { name: 'freeCodeCamp Certificates', url: 'https://www.freecodecamp.org/learn/', cost: 'Free', duration: '300+ hours', provider: 'freeCodeCamp', description: 'Full stack development certificates' },
    { name: 'Meta Front-End Developer', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer', cost: '£312', duration: '7 months', provider: 'Meta', description: 'Professional front-end certificate' },
    { name: 'AWS Certified Developer', url: 'https://aws.amazon.com/certification/certified-developer-associate/', cost: '£130', duration: '8-12 weeks', provider: 'AWS', description: 'Cloud developer certification' },
  ],
  aitools: [
    { name: 'Google AI Essentials', url: 'https://www.cloudskillsboost.google/paths/118', cost: 'Free', duration: '2-4 weeks', provider: 'Google', description: 'AI fundamentals certificate' },
    { name: 'Microsoft AI-900', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/', cost: '£85', duration: '2-4 weeks', provider: 'Microsoft', description: 'Azure AI fundamentals' },
    { name: 'IBM AI Engineering', url: 'https://www.coursera.org/professional-certificates/ai-engineer', cost: '£312', duration: '6 months', provider: 'IBM', description: 'Professional AI engineering' },
  ],
};

// Job boards
export const jobBoards: ResourceLink[] = [
  { name: 'Indeed Wales', url: 'https://uk.indeed.com/jobs?l=Wales', description: 'Wales job listings', isFree: true },
  { name: 'Reed Wales', url: 'https://www.reed.co.uk/jobs/jobs-in-wales', description: 'Wales tech jobs', isFree: true },
  { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/', description: 'Professional network jobs', isFree: true },
  { name: 'Civil Service Jobs', url: 'https://www.civilservicejobs.service.gov.uk/', description: 'Government tech roles', isFree: true },
  { name: 'Tech Nation Jobs', url: 'https://jobs.technation.io/', description: 'UK tech sector jobs', isFree: true },
  { name: 'CWJobs', url: 'https://www.cwjobs.co.uk/', description: 'IT and tech specialist jobs', isFree: true },
  { name: 'Adzuna', url: 'https://www.adzuna.co.uk/', description: 'Job search aggregator', isFree: true },
];

// Community resources
export const communityResources: ResourceLink[] = [
  { name: 'Tech Wales Discord', url: 'https://discord.gg/techwales', description: 'Wales tech community', isFree: true },
  { name: 'Women in Tech Wales', url: 'https://www.meetup.com/women-in-technology-wales/', description: 'Support network for women', isFree: true },
  { name: 'Cardiff Dev', url: 'https://www.meetup.com/cardiff-dev/', description: 'Cardiff developer meetups', isFree: true },
  { name: 'Tech Cymru', url: 'https://techcymru.org/', description: 'Welsh tech community hub', isFree: true },
  { name: 'Digital Communities Wales', url: 'https://www.digitalcommunities.gov.wales/', description: 'Digital inclusion initiative', isFree: true },
];

// Helper function to get resources for a role
export const getResourcesForRole = (roleId: string, budgetPreference?: string) => {
  const free = freeResources[roleId] || [];
  const paid = paidResources[roleId] || [];
  const certs = certifications[roleId] || [];
  
  if (budgetPreference === 'free') {
    return { free, paid: [], certs: certs.filter(c => c.cost === 'Free') };
  }
  
  return { free, paid, certs };
};
