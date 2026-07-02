import { ApiClientError, apiRequest } from '@/lib/api/client';
import type {
  BlueprintFormInput,
  BlueprintFormOptions,
  BlueprintResult,
} from '@/types/blueprint';

export const BLUEPRINT_BACKEND_ERROR_MESSAGE =
  'Unable to generate blueprint right now. Please check the backend connection or try again.';

interface BackendBlueprintOptionItem {
  label: string;
  value: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface BackendBlueprintOptions {
  industries: BackendBlueprintOptionItem[];
  company_sizes: BackendBlueprintOptionItem[];
  top_priorities: BackendBlueprintOptionItem[];
  ai_journey_stages: BackendBlueprintOptionItem[];
  biggest_challenges: BackendBlueprintOptionItem[];
  advanced_options: {
    data_readiness: BackendBlueprintOptionItem[];
    existing_systems: BackendBlueprintOptionItem[];
    leadership_commitment: BackendBlueprintOptionItem[];
    risk_appetite: BackendBlueprintOptionItem[];
  };
}

interface BackendBlueprintResult {
  id: string;
  request_id: string;
  generated_at: string;
  profile_summary: string;
  readiness_score: number;
  readiness_category: string;
  readiness_breakdown: {
    ai_maturity: number;
    business_need: number;
    data_readiness: number;
    process_complexity: number;
    transformation_readiness: number;
    weighted_score: number;
  };
  top_opportunities: {
    title: string;
    description: string;
    business_area: string;
    impact: 'High' | 'Medium' | 'Low';
    complexity: 'High' | 'Medium' | 'Low';
    time_to_value: string;
    recommended_agent: string;
    why_it_matters: string;
    suggested_first_step: string;
    tags?: string[];
  }[];
  recommended_solutions: {
    name: string;
    category: string;
    description: string;
    rationale: string;
  }[];
  operating_model: {
    name: string;
    description: string;
    capabilities: string[];
  }[];
  recommended_agents: {
    name: string;
    purpose: string;
    trigger: string;
  }[];
  architecture_layers: {
    name: string;
    description: string;
    technologies: string[];
    controls?: string[];
  }[];
  governance_framework: {
    name: string;
    controls: string[];
    priority?: string;
  }[];
  roadmap_phases: {
    phase_number: number;
    name: string;
    objective: string;
    timeline: string;
    activities: string[];
    deliverables: string[];
  }[];
  business_impact: {
    metric: string;
    expected_range: string;
    description: string;
  }[];
  next_actions: {
    action_key: string;
    label: string;
    description: string;
  }[];
  assumptions: string[];
  warnings: string[];
  handoff_summary: {
    workshop_type: string;
    executive_summary: string;
    recommended_scope: string[];
    suggested_attendees: string[];
  };
}

interface BackendBlueprintActionResponse {
  blueprint_id: string;
  action: string;
  status: string;
  message: string;
}

interface BackendBlueprintHandoffResponse {
  blueprint_id: string;
  handoff_summary: {
    workshop_type: string;
    executive_summary: string;
    recommended_scope: string[];
    suggested_attendees: string[];
  };
}

function collectValues(items: BackendBlueprintOptionItem[]): string[] {
  return items.map((item) => item.value);
}

export const FALLBACK_BLUEPRINT_OPTIONS: BlueprintFormOptions = {
  industries: [
    'Banking',
    'Financial Services',
    'Insurance',
    'Healthcare',
    'Life Sciences',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Mining',
    'Energy',
    'Telecom',
    'Audit',
    'Tax',
    'Legal',
    'Other',
  ],
  companySizes: ['Startup', 'SMB', 'Enterprise', 'Large Enterprise', '<100', '100–1000', '1000–10000', '10000+'],
  topPriorities: [
    'Cost Reduction',
    'Productivity',
    'Customer Experience',
    'Revenue Growth',
    'Compliance',
    'AI Transformation',
    'Automate Processes',
    'Faster Decision Making',
    'Employee Experience',
  ],
  aiJourneyStages: [
    'No AI',
    'Just Starting',
    'Exploring AI',
    'Running Pilots',
    'Piloting',
    'Scaling AI',
    'AI-Driven Enterprise',
    'AI-Native',
  ],
  biggestChallenges: [
    'Data Quality',
    'Manual Processes',
    'Knowledge Silos',
    'Compliance Risk',
    'Customer Experience',
    'Legacy Systems',
    'Workforce Readiness',
    'High Operating Cost',
    'Slow Decision Making',
    'Other',
  ],
  dataReadiness: ['Highly fragmented', 'Partially connected', 'Mostly integrated', 'Fully integrated'],
  existingSystems: [
    'CRM',
    'ERP',
    'HRMS',
    'Data Warehouse',
    'Data Lake',
    'BI Tools',
    'Ticketing System',
    'Document Management',
    'Core Banking',
    'Claims System',
    'LMS',
    'MES',
    'SCADA',
    'Other',
  ],
  leadershipCommitment: ['Not Discussed', 'Exploring', 'Budget Approved', 'Executive Mandate'],
  riskAppetite: ['Conservative', 'Balanced', 'Aggressive', 'Highly Regulated'],
};

export function adaptBlueprintOptions(data: BackendBlueprintOptions): BlueprintFormOptions {
  return {
    industries: collectValues(data.industries),
    companySizes: collectValues(data.company_sizes),
    topPriorities: collectValues(data.top_priorities),
    aiJourneyStages: collectValues(data.ai_journey_stages),
    biggestChallenges: collectValues(data.biggest_challenges),
    dataReadiness: collectValues(data.advanced_options.data_readiness),
    existingSystems: collectValues(data.advanced_options.existing_systems),
    leadershipCommitment: collectValues(data.advanced_options.leadership_commitment),
    riskAppetite: collectValues(data.advanced_options.risk_appetite),
  };
}

function mapFormToRequest(formData: BlueprintFormInput): Record<string, unknown> {
  return {
    industry: formData.industry,
    company_size: formData.companySize,
    top_priorities: formData.topPriorities,
    ai_journey_stage: formData.aiJourneyStage,
    biggest_challenge: formData.biggestChallenge,
    email: formData.email,
    data_readiness: formData.dataReadiness || null,
    existing_systems: formData.existingSystems || [],
    leadership_commitment: formData.leadershipCommitment || null,
    risk_appetite: formData.riskAppetite || null,
    source: 'homepage_blueprint',
  };
}

function sanitizeWarnings(warnings: string[]): string[] {
  return warnings.map((warning) => {
    if (/llm synthesis fallback|provider error/i.test(warning)) {
      return 'Blueprint recommendations used the deterministic fallback engine for this run.';
    }
    return warning;
  });
}

export function adaptBlueprintResult(data: BackendBlueprintResult): BlueprintResult {
  return {
    id: data.id,
    requestId: data.request_id,
    generatedAt: data.generated_at,
    profileSummary: data.profile_summary,
    readinessScore: {
      score: data.readiness_score,
      category: data.readiness_category as BlueprintResult['readinessScore']['category'],
      breakdown: {
        dataMaturity: data.readiness_breakdown.data_readiness,
        aiAdoption: data.readiness_breakdown.ai_maturity,
        orgReadiness: data.readiness_breakdown.transformation_readiness,
        techInfrastructure: data.readiness_breakdown.process_complexity,
        governance: data.readiness_breakdown.business_need,
      },
    },
    opportunities: data.top_opportunities.map((item, index) => ({
      id: `${data.id}_opp_${index + 1}`,
      title: item.title,
      description: item.description,
      impact: item.impact,
      complexity: item.complexity,
      timeline: item.time_to_value,
      category: item.business_area,
      businessArea: item.business_area,
      recommendedAgent: item.recommended_agent,
      whyItMatters: item.why_it_matters,
      suggestedFirstStep: item.suggested_first_step,
    })),
    recommendedSolutions: data.recommended_solutions.map((item, index) => ({
      id: `${data.id}_solution_${index + 1}`,
      name: item.name,
      description: item.description,
      category: item.category,
      estimatedValue: item.rationale,
    })),
    businessImpact: data.business_impact.map((item) => ({
      metric: item.metric,
      value: item.expected_range,
      description: item.description,
    })),
    roadmap: data.roadmap_phases.map((item) => ({
      phase: item.phase_number,
      title: item.name,
      duration: item.timeline,
      activities: item.activities,
      deliverables: item.deliverables,
    })),
    operatingModel: {
      layers: data.operating_model.map((item) => ({
        name: item.name,
        components: item.capabilities,
      })),
    },
    architecture: {
      layers: data.architecture_layers.map((item) => ({
        name: item.name,
        description: item.description,
        technologies: item.technologies,
      })),
    },
    governance: {
      pillars: data.governance_framework.map((item) => ({
        name: item.name,
        controls: item.controls,
        priority: item.priority,
      })),
    },
    recommendedAgents: data.recommended_agents.map((item) => ({
      name: item.name,
      purpose: item.purpose,
      trigger: item.trigger,
    })),
    assumptions: data.assumptions,
    warnings: sanitizeWarnings(data.warnings),
    handoffSummary: {
      workshopType: data.handoff_summary.workshop_type,
      executiveSummary: data.handoff_summary.executive_summary,
      recommendedScope: data.handoff_summary.recommended_scope,
      suggestedAttendees: data.handoff_summary.suggested_attendees,
    },
    nextActions: data.next_actions.map((item) => ({
      actionKey: item.action_key,
      title: item.label,
      description: item.description,
      cta: item.label,
    })),
  };
}

export async function getBlueprintOptions(): Promise<BlueprintFormOptions> {
  const data = await apiRequest<BackendBlueprintOptions>('/api/v1/blueprint/options');
  return adaptBlueprintOptions(data);
}

export async function generateBlueprint(formData: BlueprintFormInput): Promise<BlueprintResult> {
  const data = await apiRequest<BackendBlueprintResult>('/api/v1/blueprint/generate', {
    method: 'POST',
    body: JSON.stringify(mapFormToRequest(formData)),
  });
  return adaptBlueprintResult(data);
}

export async function getBlueprint(blueprintId: string): Promise<BlueprintResult> {
  const data = await apiRequest<BackendBlueprintResult>(`/api/v1/blueprint/${blueprintId}`);
  return adaptBlueprintResult(data);
}

export async function regenerateBlueprint(
  blueprintId: string,
  overrides: Partial<BlueprintFormInput>,
): Promise<BlueprintResult> {
  const overridePayload = mapFormToRequest({
    industry: overrides.industry || '',
    companySize: overrides.companySize || '',
    topPriorities: overrides.topPriorities || [],
    aiJourneyStage: overrides.aiJourneyStage || '',
    biggestChallenge: overrides.biggestChallenge || '',
    email: overrides.email || '',
    dataReadiness: overrides.dataReadiness,
    existingSystems: overrides.existingSystems,
    leadershipCommitment: overrides.leadershipCommitment,
    riskAppetite: overrides.riskAppetite,
  }).valueOf() as Record<string, unknown>;

  Object.keys(overridePayload).forEach((key) => {
    const value = overridePayload[key];
    if (
      value === '' ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete overridePayload[key];
    }
  });

  const data = await apiRequest<BackendBlueprintResult>(`/api/v1/blueprint/${blueprintId}/regenerate`, {
    method: 'POST',
    body: JSON.stringify({ overrides: overridePayload }),
  });
  return adaptBlueprintResult(data);
}

export async function exportBlueprint(blueprintId: string): Promise<BackendBlueprintActionResponse> {
  return apiRequest<BackendBlueprintActionResponse>(`/api/v1/blueprint/${blueprintId}/export`, {
    method: 'POST',
  });
}

export async function emailBlueprint(blueprintId: string): Promise<BackendBlueprintActionResponse> {
  return apiRequest<BackendBlueprintActionResponse>(`/api/v1/blueprint/${blueprintId}/email`, {
    method: 'POST',
  });
}

export async function handoffBlueprint(blueprintId: string): Promise<BackendBlueprintHandoffResponse> {
  return apiRequest<BackendBlueprintHandoffResponse>(`/api/v1/blueprint/${blueprintId}/handoff`, {
    method: 'POST',
  });
}

export async function trackBlueprintEvent(args: {
  eventName: string;
  source: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    await apiRequest('/api/v1/analytics/events', {
      method: 'POST',
      body: JSON.stringify({
        event_name: args.eventName,
        source: args.source,
        payload: args.payload || {},
      }),
    });
  } catch {
    // Analytics must never break the Blueprint flow.
  }
}

export function isBlueprintBackendUnavailableError(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) {
    return true;
  }
  return error.status >= 500 || error.status === 0 || error.code === 'internal_error';
}
