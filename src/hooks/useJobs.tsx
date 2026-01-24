import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: string;
  title: string;
  company: string;
  city: string;
  entry_level: 'easy' | 'moderate' | 'difficult';
  salary_min: number | null;
  salary_max: number | null;
  requirements: string[];
  skills: string[];
  source: string;
  posted_date: string;
  description: string | null;
  lat: number | null;
  lng: number | null;
}

export const useJobs = (filterLevel?: 'easy' | 'moderate' | 'difficult' | null) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('jobs')
      .select('*')
      .order('posted_date', { ascending: false });

    if (filterLevel) {
      query = query.eq('entry_level', filterLevel);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      setJobs([]);
    } else {
      setJobs((data as Job[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [filterLevel]);

  const refetch = () => {
    fetchJobs();
  };

  const getJobsByCity = (city: string) => {
    return jobs.filter(job => job.city.toLowerCase() === city.toLowerCase());
  };

  const getJobCounts = () => {
    return {
      easy: jobs.filter(j => j.entry_level === 'easy').length,
      moderate: jobs.filter(j => j.entry_level === 'moderate').length,
      difficult: jobs.filter(j => j.entry_level === 'difficult').length,
    };
  };

  return { jobs, loading, error, refetch, getJobsByCity, getJobCounts };
};
