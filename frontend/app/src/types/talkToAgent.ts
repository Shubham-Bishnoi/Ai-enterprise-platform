export type TalkToAgentState =
  | 'welcome'
  | 'guided_discovery'
  | 'recommendations'
  | 'next_actions'
  | 'loading'
  | 'error'
  | 'clarifying';

export interface InlineAgentIdentity {
  id: string;
  name: string;
  label?: string;
  title?: string;
  subtitle?: string;
  desc: string;
  color: string;
  image?: string;
  greeting?: string;
}

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

export interface NextStepAction {
  title: string;
  cta: string;
  href?: string;
  type?: string;
  payload?: Record<string, unknown>;
}

export interface AgentRecommendation {
  detectedIndustry: DetectedIndustry;
  roleObjective: string;
  recommendedPaths: RecommendedPath[];
  relevantSolutions: RelevantSolution[];
  relevantLabs: RelevantLab[];
  nextStepActions: NextStepAction[];
  suggestedQuestions?: string[];
}

export interface TalkToAgentSession {
  id: string;
  state: TalkToAgentState;
  messages: AgentMessage[];
  recommendation?: AgentRecommendation;
  quickActions?: QuickActionChip[];
  selectedAgentId?: string | null;
  createdAt: string;
  updatedAt: string;
}
