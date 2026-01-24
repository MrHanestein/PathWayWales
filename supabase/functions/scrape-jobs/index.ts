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

function extractCompany(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace('www.', '').split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return 'Company';
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

    console.log('Starting job scrape for Welsh cities...');
    const jobsFound: any[] = [];

    // Search for tech jobs in Welsh cities
    for (const city of WELSH_CITIES) {
      const searchQuery = `tech jobs ${city} Wales entry level junior developer IT support cyber security`;
      
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
            limit: 10,
            tbs: 'qdr:d', // Last 24 hours
          }),
        });

        if (!response.ok) {
          console.error(`Firecrawl search failed for ${city}:`, response.status);
          continue;
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          for (const result of data.data) {
            const coords = cityCoordinates[city];
            const entryLevel = classifyEntryLevel((result.title || '') + ' ' + (result.description || ''));
            
            jobsFound.push({
              title: result.title || 'Tech Position',
              company: extractCompany(result.url || ''),
              city: city,
              url: result.url,
              description: result.description?.substring(0, 500),
              entry_level: entryLevel,
              source: 'firecrawl',
              lat: coords?.lat,
              lng: coords?.lng,
              posted_date: new Date().toISOString(),
              requirements: [],
              skills: [],
            });
          }
        }
      } catch (cityError) {
        console.error(`Error searching ${city}:`, cityError);
      }
      
      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Found ${jobsFound.length} jobs total`);

    // Insert jobs into database
    if (jobsFound.length > 0) {
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
        console.log('Jobs inserted successfully');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobsScraped: jobsFound.length,
        cities: WELSH_CITIES,
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
