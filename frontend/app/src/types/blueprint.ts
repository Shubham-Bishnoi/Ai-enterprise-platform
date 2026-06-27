// Blueprint Generator Types - API-ready contracts for FastAPI integration

export type BlueprintPhase = 'idle' | 'input_incomplete' | 'ready_to_generate' | 'generating' | 'loaded' | 'error' | 'regenerating';

export type ScoreCategory = 'AI Beginner' | 'AI Explorer' | 'AI Adopter' | 'AI Transformer' | 'AI-Native Leader';

export interface BlueprintFormInput {
  industry: string;
  companySize: string;
  topPriorities: string[];
  aiJourneyStage: string;
  biggestChallenge: string;
  email: string;
  // Optional advanced fields
  dataReadiness?: string;
  existingSystems?: string[];
  leadershipCommitment?: string;
  riskAppetite?: string;
}

export interface AIReadinessScore {
  score: number;
  category: ScoreCategory;
  breakdown: {
    dataMaturity: number;
    aiAdoption: number;
    orgReadiness: number;
    techInfrastructure: number;
    governance: number;
  };
}

export interface AIOpportunity {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  complexity: 'High' | 'Medium' | 'Low';
  timeline: string;
  category: string;
}

export interface GFFSolution {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedValue: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  activities: string[];
  deliverables: string[];
}

export interface AIOperatingModel {
  layers: {
    name: string;
    components: string[];
  }[];
}

export interface AIArchitecture {
  layers: {
    name: string;
    description: string;
    technologies: string[];
  }[];
}

export interface GovernanceFramework {
  pillars: {
    name: string;
    controls: string[];
  }[];
}

export interface BusinessImpact {
  metric: string;
  value: string;
  description: string;
}

export interface BlueprintResult {
  id: string;
  generatedAt: string;
  readinessScore: AIReadinessScore;
  opportunities: AIOpportunity[];
  recommendedSolutions: GFFSolution[];
  businessImpact: BusinessImpact[];
  roadmap: RoadmapPhase[];
  operatingModel: AIOperatingModel;
  architecture: AIArchitecture;
  governance: GovernanceFramework;
  nextActions: {
    title: string;
    description: string;
    cta: string;
  }[];
}

// API Request/Response types for FastAPI
export interface BlueprintGenerateRequest {
  formData: BlueprintFormInput;
}

export interface BlueprintGenerateResponse {
  success: boolean;
  result?: BlueprintResult;
  error?: string;
}

export interface BlueprintRegenerateRequest {
  blueprintId: string;
  adjustments?: Partial<BlueprintFormInput>;
}
