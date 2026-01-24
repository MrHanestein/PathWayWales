-- Add url column to jobs table for original job listing links
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS url TEXT;

COMMENT ON COLUMN public.jobs.url IS 'Original job listing URL for applying';

-- Update existing jobs with search URLs based on title/company
UPDATE public.jobs 
SET url = 'https://www.google.com/search?q=' || REPLACE(title || ' ' || company || ' jobs wales', ' ', '+')
WHERE url IS NULL;