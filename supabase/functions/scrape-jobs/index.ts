const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Welsh cities with coordinates
const WELSH_CITIES = ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Bangor', 'Bridgend', 'Merthyr Tydfil', 'Neath'];

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Cardiff': { lat: 51.4816, lng: -3.1791 },
  'Swansea': { lat: 51.6214, lng: -3.9436 },
  'Newport': { lat: 51.5842, lng: -3.0000 },
  'Wrexham': { lat: 53.0462, lng: -2.9916 },
  'Bangor': { lat: 53.2274, lng: -4.1272 },
  'Bridgend': { lat: 51.5079, lng: -3.5768 },
  'Merthyr Tydfil': { lat: 51.7475, lng: -3.3750 },
  'Neath': { lat: 51.6604, lng: -3.8075 },
};

// Job boards we want direct links from
const JOB_BOARD_DOMAINS = [
  'indeed.co.uk', 'indeed.com',
  'reed.co.uk',
  'linkedin.com/jobs',
  'totaljobs.com',
  'cwjobs.co.uk',
  'gov.wales', 'gov.uk/jobs',
  'glassdoor.co.uk', 'glassdoor.com',
  'monster.co.uk'
];

// Entry level classification keywords
const easyKeywords = ['entry level', 'no experience', 'trainee', 'apprentice', 'junior', 'graduate', 'intern', 'beginner', 'starter'];
const moderateKeywords = ['1-2 years', '2-3 years', 'some experience', 'mid-level', 'developer', 'analyst'];
const difficultKeywords = ['senior', 'lead', '5+ years', 'expert', 'principal', 'architect', 'manager', 'director'];

function classifyEntryLevel(text: string): 'easy' | 'moderate' | 'difficult' {
  const lowerText = text.toLowerCase();
  
  for (const kw of difficultKeywords) {
    if (lowerText.includes(kw)) return 'difficult';
  }
  for (const kw of easyKeywords) {
    if (lowerText.includes(kw)) return 'easy';
  }
  for (const kw of moderateKeywords) {
    if (lowerText.includes(kw)) return 'moderate';
  }
  return 'moderate';
}

function isValidJobBoardUrl(url: string): boolean {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return JOB_BOARD_DOMAINS.some(domain => hostname.includes(domain.split('/')[0]));
  } catch {
    return false;
  }
}

function extractCompanyFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace('www.', '').split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return 'Company';
  }
}

function extractJobBoardName(url: string): string {
  if (!url) return 'Job Board';
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('indeed')) return 'Indeed';
    if (hostname.includes('reed')) return 'Reed';
    if (hostname.includes('linkedin')) return 'LinkedIn';
    if (hostname.includes('totaljobs')) return 'Totaljobs';
    if (hostname.includes('cwjobs')) return 'CWJobs';
    if (hostname.includes('glassdoor')) return 'Glassdoor';
    if (hostname.includes('monster')) return 'Monster';
    if (hostname.includes('gov.wales') || hostname.includes('gov.uk')) return 'Government';
    return 'Job Board';
  } catch {
    return 'Job Board';
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('Starting job scrape for Welsh cities with direct job board URLs...');
    const jobsFound: any[] = [];

    // Site-specific searches for each city - targeting actual job board URLs
    const siteSearches = [
      'site:indeed.co.uk',
      'site:reed.co.uk',
      'site:linkedin.com/jobs',
      'site:totaljobs.com',
      'site:cwjobs.co.uk'
    ];

    for (const city of WELSH_CITIES) {
      // Search across multiple job boards for this city
      for (const siteQuery of siteSearches) {
        const searchQuery = `${siteQuery} ${city} Wales tech junior entry level developer IT support cyber`;
        
        console.log(`Searching: ${searchQuery}`);
        
        try {
          const response = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: searchQuery,
              limit: 5, // Fewer results per site but from actual job boards
              tbs: 'qdr:w', // Last week for fresher results
            }),
          });

          if (!response.ok) {
            console.error(`Firecrawl search failed for ${city} on ${siteQuery}:`, response.status);
            continue;
          }

          const data = await response.json();
          
          if (data.success && data.data) {
            for (const result of data.data) {
              // Only accept results with valid job board URLs
              if (!isValidJobBoardUrl(result.url)) {
                console.log(`Skipping non-job-board URL: ${result.url}`);
                continue;
              }

              const coords = cityCoordinates[city];
              const entryLevel = classifyEntryLevel((result.title || '') + ' ' + (result.description || ''));
              const jobBoardName = extractJobBoardName(result.url);
              
              // Extract company name - prefer from title/description over URL
              let company = 'Company';
              const titleParts = (result.title || '').split(' - ');
              if (titleParts.length > 1) {
                company = titleParts[titleParts.length - 1].replace(/ Jobs$/, '').trim();
              } else if (result.description) {
                // Try to extract company from description
                const companyMatch = result.description.match(/at\s+([A-Z][a-zA-Z\s&]+?)(?:\.|,|\s+in\s+)/);
                if (companyMatch) {
                  company = companyMatch[1].trim();
                }
              }
              
              if (company === 'Company' || company.length < 2) {
                company = extractCompanyFromUrl(result.url);
              }

              // Clean up title - remove job board suffix
              let title = result.title || 'Tech Position';
              title = title.replace(/\s*-\s*(Indeed|Reed|LinkedIn|Totaljobs|CWJobs).*$/i, '').trim();
              title = title.replace(/\s*\|\s*.*$/, '').trim();

              jobsFound.push({
                title: title.substring(0, 200),
                company: company.substring(0, 100),
                city: city,
                url: result.url, // This is now a REAL job board URL
                description: result.description?.substring(0, 500),
                entry_level: entryLevel,
                source: jobBoardName.toLowerCase(),
                lat: coords?.lat,
                lng: coords?.lng,
                posted_date: new Date().toISOString(),
                requirements: [],
                skills: [],
              });

              console.log(`✓ Found valid job: ${title} at ${company} on ${jobBoardName}`);
            }
          }
        } catch (cityError) {
          console.error(`Error searching ${city} on ${siteQuery}:`, cityError);
        }
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    console.log(`Found ${jobsFound.length} jobs with valid job board URLs`);

    // Insert jobs into database
    if (jobsFound.length > 0) {
      // First, delete old jobs to prevent duplicates
      const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/jobs?source=neq.manual`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        console.warn('Could not delete old jobs:', await deleteResponse.text());
      }

      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates',
        },
        body: JSON.stringify(jobsFound),
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Failed to insert jobs:', errorText);
      } else {
        console.log('Jobs inserted successfully with direct URLs');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobsScraped: jobsFound.length,
        cities: WELSH_CITIES,
        jobBoardsSearched: siteSearches.length,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scrape error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
