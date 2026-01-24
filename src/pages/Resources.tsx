import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Award, MapPin, Briefcase, Users, 
  GraduationCap, Sparkles, Filter, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getRoleData, walesResources } from '@/lib/careerData';
import { getRecommendation } from '@/lib/roleRecommendation';
import { 
  freeResources, 
  paidResources, 
  certifications, 
  jobBoards, 
  communityResources 
} from '@/lib/resourcesData';
import { AssessmentData } from '@/hooks/useAssessment';
import ResourceCard from '@/components/resources/ResourceCard';
import CertificationCard from '@/components/resources/CertificationCard';
import WalesFundingCard from '@/components/resources/WalesFundingCard';
import ResourceCategory from '@/components/resources/ResourceCategory';
import RedundancySupport from '@/components/resources/RedundancySupport';

const Resources = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<string>('support');
  const [budgetFilter, setBudgetFilter] = useState<'all' | 'free'>('all');
  const [isRedundancy, setIsRedundancy] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: assessment } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (assessment) {
          const data: AssessmentData = {
            age_band: assessment.age_band,
            current_job_title: assessment.current_job_title,
            years_experience: assessment.years_experience,
            industry: assessment.industry,
            highest_qualification: assessment.highest_qualification,
            location: assessment.location,
            work_preference: assessment.work_preference,
            current_salary_band: assessment.current_salary_band,
            minimum_salary_needed: assessment.minimum_salary_needed,
            target_salary: assessment.target_salary,
            accept_pay_dip: assessment.accept_pay_dip,
            financial_runway: assessment.financial_runway,
            priority_ranking: assessment.priority_ranking as string[],
            employment_status: assessment.employment_status,
            reason_for_change: assessment.reason_for_change,
            family_situation: assessment.family_situation,
            weekly_hours_available: assessment.weekly_hours_available,
            learning_budget: assessment.learning_budget,
            redundancy_date: assessment.redundancy_date,
            notice_period_status: assessment.notice_period_status,
            biggest_immediate_need: assessment.biggest_immediate_need,
            goal_type: assessment.goal_type,
            desired_timeline: assessment.desired_timeline,
            preferred_entry_route: assessment.preferred_entry_route,
            tech_interests: assessment.tech_interests,
            tech_interests_other: assessment.tech_interests_other,
            digital_comfort_level: assessment.digital_comfort_level,
            tools_used: assessment.tools_used,
            transferable_strengths: assessment.transferable_strengths,
            learning_style: assessment.learning_style,
            existing_proof: assessment.existing_proof,
            stability_vs_growth: assessment.stability_vs_growth,
            biggest_worries: assessment.biggest_worries,
            role_preferences: assessment.role_preferences,
            confidence_level: assessment.confidence_level,
            biggest_concern: assessment.biggest_concern,
            support_needed: assessment.support_needed,
          };

          setAssessmentData(data);
          
          // Get recommended role
          const recommendation = getRecommendation(data);
          setRoleId(recommendation.primary.id);
          
          // Check redundancy status
          setIsRedundancy(
            data.reason_for_change === 'redundancy' || 
            data.employment_status === 'Facing redundancy'
          );
          
          // Set budget filter based on assessment
          if (data.learning_budget === 'Free resources only') {
            setBudgetFilter('free');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const role = getRoleData(roleId);
  const roleFreeResources = freeResources[roleId] || [];
  const rolePaidResources = paidResources[roleId] || [];
  const roleCertifications = certifications[roleId] || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Learning Resources</h1>
            {role && (
              <p className="text-xs text-muted-foreground">For {role.title}</p>
            )}
          </div>
          
          {/* Budget Filter */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={budgetFilter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBudgetFilter('all')}
              className="h-7 text-xs"
            >
              All
            </Button>
            <Button
              variant={budgetFilter === 'free' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBudgetFilter('free')}
              className="h-7 text-xs"
            >
              Free Only
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Personalization Banner */}
        {role && (
          <div className="rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Personalized for your pathway</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Resources for <span className="text-primary">{role.title}</span>
            </h2>
            {assessmentData?.weekly_hours_available && (
              <p className="text-sm text-muted-foreground mt-1">
                Based on {assessmentData.weekly_hours_available} hours/week available
              </p>
            )}
          </div>
        )}

        {/* Redundancy Support (Conditional) */}
        {isRedundancy && <RedundancySupport />}

        {/* Certifications */}
        <ResourceCategory
          title="Recommended Certifications"
          description="Industry-recognized credentials"
          icon={Award}
          iconColor="text-primary"
          count={budgetFilter === 'free' ? roleCertifications.filter(c => c.cost === 'Free').length : roleCertifications.length}
        >
          <div className="space-y-3">
            {(budgetFilter === 'free' 
              ? roleCertifications.filter(c => c.cost === 'Free')
              : roleCertifications
            ).map((cert) => (
              <CertificationCard key={cert.name} {...cert} />
            ))}
          </div>
        </ResourceCategory>

        {/* Free Learning Resources */}
        <ResourceCategory
          title="Free Learning Resources"
          description="Start learning without any cost"
          icon={BookOpen}
          iconColor="text-green-600"
          count={roleFreeResources.length}
        >
          <div className="grid gap-3">
            {roleFreeResources.map((resource) => (
              <ResourceCard key={resource.name} {...resource} />
            ))}
          </div>
        </ResourceCategory>

        {/* Paid Resources (only if not free-only filter) */}
        {budgetFilter !== 'free' && rolePaidResources.length > 0 && (
          <ResourceCategory
            title="Premium Courses & Platforms"
            description="Structured learning with support"
            icon={GraduationCap}
            iconColor="text-purple-600"
            count={rolePaidResources.length}
            defaultOpen={false}
          >
            <div className="grid gap-3">
              {rolePaidResources.map((resource) => (
                <ResourceCard key={resource.name} {...resource} />
              ))}
            </div>
          </ResourceCategory>
        )}

        {/* Wales Funding */}
        <ResourceCategory
          title="Wales Funding & Support"
          description="Financial support for your training"
          icon={MapPin}
          iconColor="text-green-600"
          count={walesResources.funding.length}
        >
          <div className="space-y-3">
            {walesResources.funding.map((resource, index) => (
              <WalesFundingCard 
                key={resource.name} 
                {...resource} 
                isHighlighted={index === 0 && isRedundancy}
              />
            ))}
          </div>
        </ResourceCategory>

        {/* Job Boards */}
        <ResourceCategory
          title="Job Boards"
          description="Find your next opportunity"
          icon={Briefcase}
          iconColor="text-blue-600"
          count={jobBoards.length}
          defaultOpen={false}
        >
          <div className="grid gap-3">
            {jobBoards.map((job) => (
              <ResourceCard key={job.name} {...job} />
            ))}
          </div>
        </ResourceCategory>

        {/* Community */}
        <ResourceCategory
          title="Community & Networking"
          description="Connect with others on the same journey"
          icon={Users}
          iconColor="text-orange-500"
          count={communityResources.length}
          defaultOpen={false}
        >
          <div className="grid gap-3">
            {communityResources.map((resource) => (
              <ResourceCard key={resource.name} {...resource} />
            ))}
          </div>
        </ResourceCategory>

        {/* CTA to Results */}
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 text-center">
          <h3 className="font-semibold text-foreground mb-2">View Your Full Pathway</h3>
          <p className="text-sm text-muted-foreground mb-4">
            See your personalized career roadmap and timeline
          </p>
          <Button onClick={() => navigate('/results')} variant="outline" className="w-full">
            View My Pathway
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Resources;
