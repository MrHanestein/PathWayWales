import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AssessmentData } from '@/hooks/useAssessment';
import { getRecommendation, RoleRecommendation } from '@/lib/roleRecommendation';
import SalaryCard from '@/components/results/SalaryCard';
import RiskBadge from '@/components/results/RiskBadge';
import DemandBadge from '@/components/results/DemandBadge';
import WhyThisFits from '@/components/results/WhyThisFits';
import PathwayPhase from '@/components/results/PathwayPhase';
import AlternativeRoles from '@/components/results/AlternativeRoles';
import RedundancyFastTrack from '@/components/results/RedundancyFastTrack';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [recommendation, setRecommendation] = useState<RoleRecommendation | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const { data: existing, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (!existing) {
          // No completed assessment, redirect to home
          navigate('/');
          return;
        }

        const data: AssessmentData = {
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
        };

        setAssessmentData(data);
        setRecommendation(getRecommendation(data));
      } catch (error) {
        console.error('Error loading assessment:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [user, navigate]);

  const handleSelectAlternativeRole = (roleId: string) => {
    // Could navigate to a role detail page or update recommendation
    console.log('Selected alternative role:', roleId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your pathway...</p>
        </div>
      </div>
    );
  }

  if (!recommendation || !assessmentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No assessment data found</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const { primary, alternatives, matchReasons, fastTrack, urgencyLevel } = recommendation;
  const isRedundancy = assessmentData.reason_for_change === 'redundancy' || 
                       assessmentData.employment_status === 'Facing redundancy';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Your Pathway</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Hero Section */}
        <div className="rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Recommended for you</span>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Your Pathway to
          </h2>
          <h3 className="text-3xl font-bold text-primary mb-3">
            {primary.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4">
            {primary.description}
          </p>

          {assessmentData.industry && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>From {assessmentData.industry}</span>
              </div>
              {assessmentData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{assessmentData.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Risk and Demand badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <RiskBadge risk={primary.automationRisk} />
            <DemandBadge trend={primary.demandTrend} />
          </div>
        </div>

        {/* Redundancy Fast-Track (Conditional) */}
        {isRedundancy && (urgencyLevel === 'urgent' || urgencyLevel === 'high') && (
          <RedundancyFastTrack urgencyLevel={urgencyLevel as 'urgent' | 'high'} />
        )}

        {/* Salary Card */}
        <SalaryCard 
          roleTitle={primary.title}
          salary={primary.salary}
          targetSalary={assessmentData.minimum_salary_needed}
        />

        {/* Why This Fits */}
        <WhyThisFits 
          reasons={matchReasons}
          roleTitle={primary.title}
        />

        {/* Learning Pathway */}
        <PathwayPhase phases={primary.learningPath} />

        {/* Certifications */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3">Recommended Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {primary.certifications.map((cert) => (
              <span
                key={cert}
                className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Wales Employers */}
        {primary.walesEmployers.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Wales-Based Employers</h3>
            <div className="flex flex-wrap gap-2">
              {primary.walesEmployers.map((employer) => (
                <span
                  key={employer}
                  className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm"
                >
                  {employer}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Roles */}
        {alternatives.length > 0 && (
          <AlternativeRoles 
            roles={alternatives}
            onSelectRole={handleSelectAlternativeRole}
          />
        )}

        {/* CTA */}
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 text-center">
          <h3 className="font-semibold text-foreground mb-2">Ready to Start?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Access learning resources tailored to your pathway
          </p>
          <Button onClick={() => navigate('/')} className="w-full">
            Explore Resources
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AssessmentResults;
