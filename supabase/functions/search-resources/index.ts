const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  roleId: string;
  resourceType?: 'free' | 'all';
  location?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roleId, resourceType, location }: SearchRequest = await req.json();

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query based on role
    const roleQueries: Record<string, string> = {
      'support': 'IT Support technician certification training courses',
      'cybersecurity': 'Cybersecurity training CompTIA Security+ courses certification',
      'data-analyst': 'Data Analyst SQL Python training courses certification',
      'cloud': 'AWS Azure cloud engineer certification training courses',
      'web-dev': 'Web development frontend developer training courses',
      'product': 'Product management certification training courses',
      'devops': 'DevOps engineer training courses certification',
      'ai-ml': 'Machine learning AI training courses certification',
    };

    let query = roleQueries[roleId] || 'tech career training courses UK';
    
    // Add free filter if requested
    if (resourceType === 'free') {
      query = `free ${query}`;
    }
    
    // Add location context
    if (location) {
      query = `${query} ${location}`;
    } else {
      query = `${query} Wales UK`;
    }

    console.log('Searching for resources:', query);

    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit: 8,
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed with status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform results to a cleaner format
    const resources = (data.data || []).map((item: any) => ({
      url: item.url,
      title: item.title || 'Learning Resource',
      description: item.description || '',
      source: new URL(item.url).hostname.replace('www.', ''),
    }));

    console.log(`Found ${resources.length} resources for role: ${roleId}`);

    return new Response(
      JSON.stringify({ success: true, resources }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching resources:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search resources';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
