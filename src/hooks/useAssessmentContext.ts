// Hook to load assessment data and build context for AI coach
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getRecommendation, RoleRecommendation } from '@/lib/roleRecommendation';
import { AssessmentData } from './useAssessment';

export interface AssessmentContext {
  data: AssessmentData | null;
  recommendation: RoleRecommendation | null;
  contextString: string | null;
  loading: boolean;
  hasCompletedAssessment: boolean;
}

// Build a detailed context string for the AI coach
function buildContextString(data: AssessmentData, recommendation: RoleRecommendation): string {
  return `
## USER'S PROFILE (From Completed Assessment - DO NOT ask them to repeat this)

### Demographics & Background
- **Age Band**: ${data.age_band || 'Not specified'}
- **Current Role**: ${data.current_job_title || 'Not specified'}
- **Years of Experience**: ${data.years_experience || 'Not specified'}
- **Industry**: ${data.industry || 'Not specified'}
- **Highest Qualification**: ${data.highest_qualification || 'Not specified'}
- **Location**: ${data.location || 'Wales'}
- **Work Preference**: ${data.work_preference || 'Not specified'}

### Financial Situation
- **Current Salary Band**: ${data.current_salary_band || 'Not specified'}
- **Minimum Salary Needed**: ${data.minimum_salary_needed ? `£${data.minimum_salary_needed.toLocaleString()}` : 'Not specified'}
- **Target Salary**: ${data.target_salary || 'Not specified'}
- **Willing to Accept Pay Dip**: ${data.accept_pay_dip || 'Not specified'}
- **Financial Runway**: ${data.financial_runway ? `${data.financial_runway} months` : 'Not specified'}

### Employment & Life Situation
- **Employment Status**: ${data.employment_status || 'Not specified'}
- **Reason for Career Change**: ${data.reason_for_change || 'Not specified'}
- **Family Situation**: ${data.family_situation || 'Not specified'}
- **Weekly Hours for Learning**: ${data.weekly_hours_available ? `${data.weekly_hours_available} hours` : 'Not specified'}
- **Learning Budget**: ${data.learning_budget || 'Not specified'}
${data.redundancy_date ? `- **Redundancy Date**: ${data.redundancy_date}` : ''}
${data.notice_period_status ? `- **Notice Period Status**: ${data.notice_period_status}` : ''}
${data.biggest_immediate_need ? `- **Biggest Immediate Need**: ${data.biggest_immediate_need}` : ''}

### Goals
- **Goal Type**: ${data.goal_type || 'Not specified'}
- **Desired Timeline**: ${data.desired_timeline ? `${data.desired_timeline} months` : 'Not specified'}
- **Preferred Entry Route**: ${data.preferred_entry_route || 'Not specified'}

### Tech Interests & Skills
- **Tech Interests**: ${data.tech_interests?.join(', ') || 'Not specified'}
${data.tech_interests_other ? `- **Other Tech Interests**: ${data.tech_interests_other}` : ''}
- **Digital Comfort Level**: ${data.digital_comfort_level ? `${data.digital_comfort_level}/5` : 'Not specified'}
- **Tools Already Used**: ${data.tools_used?.join(', ') || 'None specified'}
- **Transferable Strengths**: ${data.transferable_strengths?.join(', ') || 'Not specified'}
- **Learning Style**: ${data.learning_style || 'Not specified'}
- **Existing Proof/Portfolio**: ${data.existing_proof || 'None yet'}

### Mindset & Psychology
- **Stability vs Growth Preference**: ${data.stability_vs_growth ? `${data.stability_vs_growth}/5 (1=stability focused, 5=growth focused)` : 'Not specified'}
- **Biggest Worries**: ${data.biggest_worries?.join(', ') || 'Not specified'}
- **Role Preferences**: ${data.role_preferences?.join(', ') || 'Not specified'}
- **Confidence Level**: ${data.confidence_level ? `${data.confidence_level}/5` : 'Not specified'}
- **Biggest Concern**: ${data.biggest_concern || 'Not specified'}
- **Support Needed**: ${data.support_needed?.join(', ') || 'Not specified'}

---

## OUR RECOMMENDATION FOR THIS USER

### Primary Recommended Role
- **Role**: ${recommendation.primary.title}
- **Description**: ${recommendation.primary.description}
- **Entry Salary Range**: £${recommendation.primary.salary.entry[0].toLocaleString()} - £${recommendation.primary.salary.entry[1].toLocaleString()}
- **Senior Salary Range**: £${recommendation.primary.salary.senior[0].toLocaleString()} - £${recommendation.primary.salary.senior[1].toLocaleString()}
- **Time to Entry**: ${recommendation.primary.timeToEntry}
- **Automation Risk**: ${JSON.stringify(recommendation.primary.automationRisk)}
- **Demand Trend**: ${JSON.stringify(recommendation.primary.demandTrend)}
- **Key Certifications**: ${recommendation.primary.certifications.join(', ')}
- **Welsh Employers**: ${recommendation.primary.walesEmployers.join(', ')}

### Why This Fits Them
${recommendation.matchReasons.map(r => `- ${r}`).join('\n')}

### Alternative Roles
${recommendation.alternatives.map(alt => `- ${alt.title}: ${alt.description}`).join('\n')}

### Urgency & Fast Track
- **Urgency Level**: ${recommendation.urgencyLevel}
- **Fast Track Eligible**: ${recommendation.fastTrack ? 'YES - prioritize speed to first role' : 'No - can take standard path'}

---

## CRITICAL INSTRUCTIONS FOR EIRA

1. **DO NOT** ask them to explain their background - you already know everything above
2. **Reference their specific details naturally** in your responses:
   - "Given your ${data.years_experience || 'experience'} in ${data.industry || 'your industry'}..."
   - "I know you mentioned ${data.biggest_concern || 'concerns'} - let's address that..."
   - "Your ${data.transferable_strengths?.[0] || 'skills'} will be valuable because..."
3. **Acknowledge their situation**: ${data.employment_status === 'Facing redundancy' ? 'They are facing redundancy - be extra supportive and focus on speed' : data.reason_for_change ? `They want to change because of ${data.reason_for_change}` : 'Standard career transition'}
4. **Respect their constraints**: ${data.weekly_hours_available ? `Only ${data.weekly_hours_available} hours per week for learning` : 'Limited time'}, ${data.learning_budget ? `${data.learning_budget} budget` : 'budget considerations'}
5. **Address their specific worries**: ${data.biggest_worries?.join(', ') || 'General career change concerns'}
`;
}

// Generate personalized greeting based on assessment
export function getPersonalizedGreeting(data: AssessmentData, recommendation: RoleRecommendation): string {
  const isRedundancy = data.reason_for_change === 'redundancy' || data.employment_status === 'Facing redundancy';
  const isUrgent = recommendation.urgencyLevel === 'urgent';
  const firstName = data.location ? `fellow ${data.location} resident` : '';
  
  if (isRedundancy && isUrgent) {
    return `Hello! I'm Eira, your personal career coach. 🏴󠁧󠁢󠁷󠁬󠁳󠁿

I've reviewed your full assessment - I understand you're facing redundancy and need to move quickly. That takes courage to tackle head-on.

With your ${data.years_experience || ''} years in ${data.industry || 'your field'}${data.transferable_strengths?.[0] ? ` and your ${data.transferable_strengths[0]} skills` : ''}, I genuinely think **${recommendation.primary.title}** is a brilliant match for you.

${recommendation.fastTrack ? "You qualify for our fast-track pathway - I can show you how to get your first role in as little as 3-4 months." : ""}

What would help most right now - understanding why I chose this role for you, or getting straight into the action plan?`;
  }
  
  if (isRedundancy) {
    return `Hello${firstName ? `, ${firstName}` : ''}! I'm Eira. 🏴󠁧󠁢󠁷󠁬󠁳󠁿

I've been through your assessment and I understand you're navigating redundancy. First, I want you to know - this is a chance for something better, and your experience is genuinely valuable.

Your background in ${data.industry || 'your industry'}${data.transferable_strengths?.length ? ` with strengths in ${data.transferable_strengths.slice(0, 2).join(' and ')}` : ''} maps beautifully to **${recommendation.primary.title}**.

I'm here to help you move forward at whatever pace works for you. Would you like to explore why this role fits you, or shall we talk about what's worrying you most?`;
  }
  
  // Standard greeting with personalization
  const interests = data.tech_interests?.[0] || 'cybersecurity';
  const strengthHighlight = data.transferable_strengths?.[0] 
    ? `Your ${data.transferable_strengths[0]} experience is exactly what employers are looking for.`
    : '';
  
  return `Hello${firstName ? `, ${firstName}` : ''}! I'm Eira, your personal cybersecurity career coach. 🏴󠁧󠁢󠁷󠁬󠁳󠁿

I've reviewed your complete career assessment, and I'm excited to work with you! With your background in ${data.industry || 'your field'} and your interest in ${interests}, I think **${recommendation.primary.title}** could be a fantastic fit.

${strengthHighlight}

What would you like to explore first?
• **Why this role?** - I'll explain exactly how your experience transfers
• **The pathway** - Step-by-step plan tailored to your timeline
• **Try a simulation** - Experience a "day in the life" of this role

Just tell me what you're curious about!`;
}

// Quick action type
interface QuickAction {
  label: string;
  message: string;
  type?: string;
  icon: string;
}

// Generate quick action buttons based on assessment
export function getQuickActions(data: AssessmentData, recommendation: RoleRecommendation): QuickAction[] {
  const actions: QuickAction[] = [
    {
      label: `Why ${recommendation.primary.title}?`,
      message: `Explain specifically why you recommended ${recommendation.primary.title} for me based on my background`,
      icon: '🎯',
    },
  ];

  // Add worry-specific action
  if (data.biggest_worries?.includes('Age discrimination')) {
    actions.push({
      label: "Address my age concerns",
      message: "I'm worried about age discrimination in tech. How do I overcome this at my age?",
      icon: '💪',
    });
  } else if (data.biggest_worries?.includes('Not technical enough')) {
    actions.push({
      label: "Am I technical enough?",
      message: "I'm worried I'm not technical enough for cybersecurity. Be honest with me - can I really do this?",
      icon: '🤔',
    });
  } else {
    actions.push({
      label: "Fastest path in",
      message: `What's the absolute fastest way I can get into ${recommendation.primary.title} given my background and constraints?`,
      icon: '⚡',
    });
  }

  // Simulation action
  actions.push({
    label: "Try a Simulation",
    message: `Start a day-in-the-life simulation for ${recommendation.primary.title} so I can experience what the role is like`,
    type: 'day-simulation',
    icon: '🎮',
  });

  // De-jargon action
  actions.push({
    label: "De-jargon Something",
    message: "I heard a cybersecurity term I don't understand. Can you help me decode it?",
    type: 'dejargonise',
    icon: '📚',
  });

  // Alternative roles if there are alternatives
  if (recommendation.alternatives.length > 0) {
    actions.push({
      label: "Other options",
      message: `Tell me about my alternative pathway options: ${recommendation.alternatives.map(a => a.title).join(', ')}`,
      icon: '🔄',
    });
  }

  return actions;
}

export const useAssessmentContext = (): AssessmentContext => {
  const { user } = useAuth();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [recommendation, setRecommendation] = useState<RoleRecommendation | null>(null);
  const [contextString, setContextString] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

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
          .eq('completed', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (existing) {
          const assessmentData: AssessmentData = {
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

          setData(assessmentData);
          setHasCompletedAssessment(true);

          // Generate recommendation
          const rec = getRecommendation(assessmentData);
          setRecommendation(rec);

          // Build context string for AI
          const context = buildContextString(assessmentData, rec);
          setContextString(context);
        }
      } catch (error) {
        console.error('Error loading assessment for context:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [user]);

  return {
    data,
    recommendation,
    contextString,
    loading,
    hasCompletedAssessment,
  };
};
