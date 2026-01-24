import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface AssessmentData {
  // Page 1: About You
  age_band?: string;
  current_job_title?: string;
  years_experience?: string;
  industry?: string;
  highest_qualification?: string;
  location?: string;
  work_preference?: string;
  
  // Page 2: Income & Security
  current_salary_band?: string;
  minimum_salary_needed?: number;
  target_salary?: string;
  accept_pay_dip?: string;
  financial_runway?: string;
  priority_ranking?: string[];
  
  // Page 3: Life Situation
  employment_status?: string;
  reason_for_change?: string;
  family_situation?: string;
  weekly_hours_available?: number;
  learning_budget?: string;
  redundancy_date?: string;
  notice_period_status?: string;
  biggest_immediate_need?: string;
  
  // Page 4: Your Goal
  goal_type?: string;
  desired_timeline?: string;
  preferred_entry_route?: string;
  
  // Page 5: Tech Interests
  tech_interests?: string[];
  tech_interests_other?: string;
  
  // Page 6: Skills & Upskilling
  digital_comfort_level?: number;
  tools_used?: string[];
  transferable_strengths?: string[];
  learning_style?: string;
  existing_proof?: string;
  
  // Page 7: Stability & AI Impact
  stability_vs_growth?: number;
  biggest_worries?: string[];
  role_preferences?: string[];
  
  // Page 8: Confidence Check
  confidence_level?: number;
  biggest_concern?: string;
  support_needed?: string[];
}

export const useAssessment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AssessmentData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const totalSteps = 8;

  // Load existing assessment
  useEffect(() => {
    const loadAssessment = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: existing, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (existing) {
          setAssessmentId(existing.id);
          setCurrentStep(existing.current_step || 1);
          setData({
            age_band: existing.age_band,
            current_job_title: existing.current_job_title,
            years_experience: existing.years_experience,
            industry: existing.industry,
            highest_qualification: existing.highest_qualification,
            location: existing.location,
            work_preference: existing.work_preference,
            current_salary_band: existing.current_salary_band,
            minimum_salary_needed: existing.minimum_salary_needed,
            target_salary: existing.target_salary,
            accept_pay_dip: existing.accept_pay_dip,
            financial_runway: existing.financial_runway,
            priority_ranking: existing.priority_ranking as string[],
            employment_status: existing.employment_status,
            reason_for_change: existing.reason_for_change,
            family_situation: existing.family_situation,
            weekly_hours_available: existing.weekly_hours_available,
            learning_budget: existing.learning_budget,
            redundancy_date: existing.redundancy_date,
            notice_period_status: existing.notice_period_status,
            biggest_immediate_need: existing.biggest_immediate_need,
            goal_type: existing.goal_type,
            desired_timeline: existing.desired_timeline,
            preferred_entry_route: existing.preferred_entry_route,
            tech_interests: existing.tech_interests,
            tech_interests_other: existing.tech_interests_other,
            digital_comfort_level: existing.digital_comfort_level,
            tools_used: existing.tools_used,
            transferable_strengths: existing.transferable_strengths,
            learning_style: existing.learning_style,
            existing_proof: existing.existing_proof,
            stability_vs_growth: existing.stability_vs_growth,
            biggest_worries: existing.biggest_worries,
            role_preferences: existing.role_preferences,
            confidence_level: existing.confidence_level,
            biggest_concern: existing.biggest_concern,
            support_needed: existing.support_needed,
          });
        }
      } catch (error) {
        console.error('Error loading assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [user]);

  const updateData = useCallback((newData: Partial<AssessmentData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const saveProgress = useCallback(async (step: number) => {
    if (!user) return;
    setSaving(true);

    try {
      const payload = {
        user_id: user.id,
        current_step: step,
        ...data,
      };

      if (assessmentId) {
        const { error } = await supabase
          .from('assessments')
          .update(payload)
          .eq('id', assessmentId);
        if (error) throw error;
      } else {
        const { data: newAssessment, error } = await supabase
          .from('assessments')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        setAssessmentId(newAssessment.id);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error saving progress",
        description: "Your progress could not be saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [user, assessmentId, data, toast]);

  const nextStep = useCallback(async () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      await saveProgress(newStep);
    }
  }, [currentStep, saveProgress]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const completeAssessment = useCallback(async () => {
    if (!user || !assessmentId) return false;
    setSaving(true);

    try {
      // Mark assessment as completed
      const { error: assessmentError } = await supabase
        .from('assessments')
        .update({ completed: true, current_step: totalSteps })
        .eq('id', assessmentId);
      
      if (assessmentError) throw assessmentError;

      // Update profile to mark assessment as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ assessment_completed: true })
        .eq('id', user.id);
      
      if (profileError) throw profileError;

      return true;
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Error completing assessment",
        description: "Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, assessmentId, toast]);

  return {
    data,
    updateData,
    currentStep,
    setCurrentStep,
    totalSteps,
    nextStep,
    prevStep,
    saveProgress,
    completeAssessment,
    loading,
    saving,
    assessmentId,
  };
};
