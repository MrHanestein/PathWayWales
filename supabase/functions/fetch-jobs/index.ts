const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Job scraping configuration - to be implemented post-hackathon
// These are the sources we'll scrape from:
// - Indeed API: https://api.indeed.com (requires partnership)
// - Reed API: https://www.reed.co.uk/developers (free tier available)
// - LinkedIn Jobs: https://www.linkedin.com/jobs (requires scraping or official API)
// - GOV.UK Jobs: https://www.gov.uk/jobsearch (free, public sector roles)
// - Firecrawl: For scraping job boards without official APIs

interface JobSource {
  name: string;
  url: string;
  enabled: boolean;
}

const jobSources: JobSource[] = [
  { name: 'indeed', url: 'https://api.indeed.com/ads/apisearch', enabled: false },
  { name: 'reed', url: 'https://www.reed.co.uk/api/1.0/search', enabled: false },
  { name: 'gov_wales', url: 'https://www.gov.wales/jobs', enabled: false },
  { name: 'linkedin', url: 'https://www.linkedin.com/jobs', enabled: false },
];

// Keywords to classify entry level
const easyKeywords = [
  'entry level', 'no experience', 'trainee', 'apprentice', 'junior',
  'graduate', 'intern', 'starter', 'beginner', 'basic'
];

const moderateKeywords = [
  '1-2 years', '2-3 years', 'some experience', 'mid-level', 'developer',
  'analyst', 'associate', 'coordinator'
];

const difficultKeywords = [
  'senior', 'lead', '5+ years', 'expert', 'principal', 'architect',
  'director', 'manager', 'specialist', 'experienced'
];

function classifyEntryLevel(title: string, description: string): 'easy' | 'moderate' | 'difficult' {
  const text = `${title} ${description}`.toLowerCase();
  
  // Check for difficult keywords first (most specific)
  for (const keyword of difficultKeywords) {
    if (text.includes(keyword)) return 'difficult';
  }
  
  // Check for easy keywords
  for (const keyword of easyKeywords) {
    if (text.includes(keyword)) return 'easy';
  }
  
  // Check for moderate keywords
  for (const keyword of moderateKeywords) {
    if (text.includes(keyword)) return 'moderate';
  }
  
  // Default to moderate if unclear
  return 'moderate';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, city, entry_level } = await req.json().catch(() => ({}));

    // For MVP: Return info about the scraping system
    // In production, this would trigger actual scraping

    const response = {
      success: true,
      message: 'Job scraping infrastructure ready',
      configured_sources: jobSources,
      classification_logic: {
        easy: easyKeywords.slice(0, 5),
        moderate: moderateKeywords.slice(0, 5),
        difficult: difficultKeywords.slice(0, 5),
      },
      scrape_schedule: 'Every 24 hours at 00:00 UTC',
      last_scrape: null, // Will be populated when scraping is active
      next_scrape: null,
      filters: {
        city: city || 'all',
        entry_level: entry_level || 'all',
      },
      // Future implementation notes
      notes: [
        'To enable Indeed: Add INDEED_API_KEY secret and partnership approval',
        'To enable Reed: Add REED_API_KEY secret (free tier available)',
        'To enable Firecrawl: Connect via Lovable connector for job board scraping',
        'Cron job can be set up using pg_cron extension',
      ],
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-jobs:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
