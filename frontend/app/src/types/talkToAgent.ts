// Talk to Agent Types - API-ready contracts for FastAPI integration

export type TalkToAgentState = 'welcome' | 'guided_discovery' | 'recommendations' | 'next_actions' | 'loading' | 'error';

export interface QuickActionChip {
  id: string;
  label: string;
  prompt: string;
}

export interface AgentMessage {
  id: string;
  role: 'agent' | 'user';
  text: string;
  timestamp: string;
}

export interface DetectedIndustry {
  name: string;
  confidence: number;
}

export interface RecommendedPath {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface RelevantSolution {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface RelevantLab {
  id: string;
  name: string;
  description: string;
}

export interface AgentRecommendation {
  detectedIndustry: DetectedIndustry;
  roleObjective: string;
  recommendedPaths: RecommendedPath[];
  relevantSolutions: RelevantSolution[];
  relevantLabs: RelevantLab[];
  nextStepActions: {
    title: string;
    cta: string;
    href: string;
  }[];
}

export interface TalkToAgentSession {
  id: string;
  state: TalkToAgentState;
  messages: AgentMessage[];
  recommendation?: AgentRecommendation;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types for FastAPI
export interface TalkToAgentStartRequest {
  initialPrompt?: string;
  quickActionId?: string;
}

export interface TalkToAgentMessageRequest {
  sessionId: string;
  message: string;
}

export interface TalkToAgentResponse {
  success: boolean;
  session?: TalkToAgentSession;
  error?: string;
}
