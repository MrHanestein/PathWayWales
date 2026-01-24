-- Create assessments table for storing user career assessment data
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_step INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  
  -- Page 1: About You
  age_band TEXT,
  current_job_title TEXT,
  years_experience TEXT,
  industry TEXT,
  highest_qualification TEXT,
  location TEXT,
  work_preference TEXT,
  
  -- Page 2: Income & Security
  current_salary_band TEXT,
  minimum_salary_needed INTEGER,
  target_salary TEXT,
  accept_pay_dip TEXT,
  financial_runway TEXT,
  priority_ranking JSONB,
  
  -- Page 3: Life Situation
  employment_status TEXT,
  reason_for_change TEXT,
  family_situation TEXT,
  weekly_hours_available INTEGER,
  learning_budget TEXT,
  redundancy_date TEXT,
  notice_period_status TEXT,
  biggest_immediate_need TEXT,
  
  -- Page 4: Your Goal
  goal_type TEXT,
  desired_timeline TEXT,
  preferred_entry_route TEXT,
  
  -- Page 5: Tech Interests
  tech_interests TEXT[],
  tech_interests_other TEXT,
  
  -- Page 6: Skills & Upskilling
  digital_comfort_level INTEGER,
  tools_used TEXT[],
  transferable_strengths TEXT[],
  learning_style TEXT,
  existing_proof TEXT,
  
  -- Page 7: Stability & AI Impact
  stability_vs_growth INTEGER,
  biggest_worries TEXT[],
  role_preferences TEXT[],
  
  -- Page 8: Confidence Check
  confidence_level INTEGER,
  biggest_concern TEXT,
  support_needed TEXT[]
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own assessment"
ON public.assessments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment"
ON public.assessments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment"
ON public.assessments
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();