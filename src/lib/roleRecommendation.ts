// Role recommendation engine
// Matches assessment data to the best career pathway

import { AssessmentData } from '@/hooks/useAssessment';
import { RoleData, roleDatabase, getAllRoles } from './careerData';

export interface RoleRecommendation {
  primary: RoleData;
  alternatives: RoleData[];
  matchReasons: string[];
  fastTrack: boolean;
  urgencyLevel: 'normal' | 'high' | 'urgent';
}

// Map tech interests to role IDs
const interestToRoleMap: Record<string, string> = {
  cybersecurity: 'cybersecurity',
  data: 'data',
  cloud: 'cloud',
  webdev: 'webdev',
  support: 'support',
  product: 'product',
  aitools: 'aitools',
  other: 'support', // Default for "unsure"
};

// Determine urgency based on assessment
function getUrgencyLevel(data: AssessmentData): 'normal' | 'high' | 'urgent' {
  const isRedundancy = data.reason_for_change === 'redundancy' || 
                       data.employment_status === 'Facing redundancy';
  const urgentTimeline = data.desired_timeline === '0-3';
  const shortRunway = data.financial_runway === '0-1' || data.financial_runway === '2-3';

  if (isRedundancy && (urgentTimeline || shortRunway)) return 'urgent';
  if (isRedundancy || urgentTimeline || shortRunway) return 'high';
  return 'normal';
}

// Check if user has leadership experience
function hasLeadershipExperience(data: AssessmentData): boolean {
  const strengths = data.transferable_strengths || [];
  return strengths.includes('Leadership') || 
         strengths.includes('Stakeholder Management') ||
         strengths.includes('Project Management');
}

// Check minimum salary requirement
function hasHighSalaryRequirement(data: AssessmentData): boolean {
  return (data.minimum_salary_needed || 0) >= 35000;
}

// Build match reasons based on assessment
function buildMatchReasons(data: AssessmentData, role: RoleData): string[] {
  const reasons: string[] = [];
  const strengths = data.transferable_strengths || [];
  const tools = data.tools_used || [];

  // Check for matching strengths
  role.bestFor.forEach(trait => {
    if (strengths.some(s => trait.toLowerCase().includes(s.toLowerCase()))) {
      reasons.push(`Your ${trait} experience transfers directly`);
    }
  });

  // Check for tool matches
  if (role.id === 'data' && tools.includes('Excel / Google Sheets')) {
    reasons.push('Your Excel skills give you a head start in data analysis');
  }
  if (role.id === 'data' && tools.includes('SQL / Databases')) {
    reasons.push('SQL experience is directly applicable');
  }
  if (role.id === 'cloud' && tools.includes('Cloud tools (AWS, Azure, GCP)')) {
    reasons.push('You already have cloud platform exposure');
  }
  if (role.id === 'webdev' && tools.includes('GitHub / Version Control')) {
    reasons.push('Git experience puts you ahead of most beginners');
  }

  // Industry-specific matches
  if (data.industry === 'Finance & Banking' && role.id === 'cybersecurity') {
    reasons.push('Finance background valued in security roles');
  }
  if (data.industry === 'Healthcare' && role.id === 'data') {
    reasons.push('Healthcare data experience is in high demand');
  }

  // Work preference match
  if (data.work_preference === 'remote' && 
      (role.id === 'webdev' || role.id === 'cloud' || role.id === 'data')) {
    reasons.push('This role offers strong remote work opportunities');
  }

  // Add role-specific strengths
  if (reasons.length < 2) {
    reasons.push(...role.bestFor.slice(0, 2 - reasons.length).map(t => `Ideal for those with ${t.toLowerCase()}`));
  }

  return reasons.slice(0, 4); // Max 4 reasons
}

// Get alternative roles
function getAlternativeRoles(primaryId: string, data: AssessmentData): RoleData[] {
  // Note: allRoles defined but not used directly - we filter from interests
  const alternatives: RoleData[] = [];
  const techInterests = data.tech_interests || [];

  // Add roles from other selected interests
  techInterests.forEach(interest => {
    const roleId = interestToRoleMap[interest];
    if (roleId && roleId !== primaryId && roleDatabase[roleId]) {
      alternatives.push(roleDatabase[roleId]);
    }
  });

  // If not enough alternatives, add based on profile
  if (alternatives.length < 2) {
    // Add support role if not already there (always good fallback)
    if (primaryId !== 'support' && !alternatives.some(r => r.id === 'support')) {
      alternatives.push(roleDatabase.support);
    }
    // Add product role for leaders
    if (hasLeadershipExperience(data) && primaryId !== 'product' && !alternatives.some(r => r.id === 'product')) {
      alternatives.push(roleDatabase.product);
    }
  }

  return alternatives.slice(0, 3); // Max 3 alternatives
}

// Main recommendation function
export function getRecommendation(data: AssessmentData): RoleRecommendation {
  const urgency = getUrgencyLevel(data);
  const techInterests = data.tech_interests || [];
  const primaryInterest = techInterests[0] || 'support';
  
  let recommendedRoleId: string;
  let fastTrack = false;

  // Priority 1: Redundancy + urgent timeline -> IT Support (fastest entry)
  if (urgency === 'urgent') {
    recommendedRoleId = 'support';
    fastTrack = true;
  }
  // Priority 2: High salary requirement (35k+) -> Cloud (best pay progression)
  else if (hasHighSalaryRequirement(data) && techInterests.includes('cloud')) {
    recommendedRoleId = 'cloud';
  }
  // Priority 3: Leadership experience -> Product/Project roles
  else if (hasLeadershipExperience(data) && techInterests.includes('product')) {
    recommendedRoleId = 'product';
  }
  // Priority 4: Primary tech interest
  else {
    recommendedRoleId = interestToRoleMap[primaryInterest] || 'support';
  }

  const primaryRole = roleDatabase[recommendedRoleId] || roleDatabase.support;
  const matchReasons = buildMatchReasons(data, primaryRole);
  const alternatives = getAlternativeRoles(recommendedRoleId, data);

  return {
    primary: primaryRole,
    alternatives,
    matchReasons,
    fastTrack,
    urgencyLevel: urgency,
  };
}

// Get role by ID (for direct lookup)
export function getRoleById(roleId: string): RoleData | null {
  return roleDatabase[roleId] || null;
}

// Check if assessment qualifies for fast-track
export function checkFastTrackEligibility(data: AssessmentData): boolean {
  const urgency = getUrgencyLevel(data);
  return urgency === 'urgent' || urgency === 'high';
}
