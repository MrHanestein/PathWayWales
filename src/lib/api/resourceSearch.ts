import { supabase } from '@/integrations/supabase/client';

export interface SearchedResource {
  url: string;
  title: string;
  description: string;
  source: string;
}

interface SearchResourcesParams {
  roleId: string;
  resourceType?: 'free' | 'all';
  location?: string;
}

export const searchResources = async ({
  roleId,
  resourceType = 'all',
  location,
}: SearchResourcesParams): Promise<SearchedResource[]> => {
  try {
    console.log('[ResourceSearch] Searching for:', { roleId, resourceType, location });
    
    const { data, error } = await supabase.functions.invoke('search-resources', {
      body: { roleId, resourceType, location },
    });

    if (error) {
      console.error('[ResourceSearch] Edge function error:', error);
      throw error;
    }

    if (!data.success) {
      console.error('[ResourceSearch] API error:', data.error);
      return [];
    }

    console.log('[ResourceSearch] Found resources:', data.resources?.length);
    return data.resources || [];
  } catch (error) {
    console.error('[ResourceSearch] Failed to search resources:', error);
    return [];
  }
};
