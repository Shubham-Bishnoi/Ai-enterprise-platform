import type { QuickActionChip, AgentRecommendation, TalkToAgentSession } from '@/types/talkToAgent';

export const quickActionChips: QuickActionChip[] = [
  { id: 'banking', label: 'Build AI for Banking', prompt: 'I want to build AI solutions for my banking organization. We need help with fraud detection, credit scoring, and customer experience.' },
  { id: 'university', label: 'Create University AI Lab', prompt: 'We want to set up an AI lab at our university for research, student training, and industry collaboration.' },
  { id: 'manufacturing', label: 'Improve Manufacturing Operations', prompt: 'Looking to improve our manufacturing operations with AI-powered predictive maintenance, quality control, and supply chain optimization.' },
  { id: 'compliance', label: 'Reduce Compliance Cost', prompt: 'Need to reduce compliance costs while maintaining regulatory standards. Interested in AI governance and automated compliance.' },
  { id: 'explore', label: 'Explore AI Opportunities', prompt: 'Want to explore AI opportunities for our enterprise. Not sure where to start, need guidance on use cases and ROI.' },
  { id: 'blueprint', label: 'Generate My Enterprise AI Blueprint', prompt: 'I want to generate a comprehensive enterprise AI blueprint for our organization.' },
];

export function createMockSession(): TalkToAgentSession {
  return {
    id: `session_${Date.now()}`,
    state: 'welcome',
    messages: [
      {
        id: `msg_${Date.now()}`,
        role: 'agent',
        text: "Hello! I'm GFF AI, your enterprise transformation advisor. How can I help you today? Select a quick action below or type your question.",
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateMockRecommendation(prompt: string): AgentRecommendation {
  const industryKeywords: Record<string, { name: string; confidence: number }> = {
    banking: { name: 'Banking & Financial Services', confidence: 0.94 },
    finance: { name: 'Banking & Financial Services', confidence: 0.91 },
    healthcare: { name: 'Healthcare & Life Sciences', confidence: 0.93 },
    hospital: { name: 'Healthcare & Life Sciences', confidence: 0.92 },
    manufacturing: { name: 'Manufacturing & Industrials', confidence: 0.95 },
    factory: { name: 'Manufacturing & Industrials', confidence: 0.90 },
    retail: { name: 'Retail & Consumer', confidence: 0.88 },
    education: { name: 'Education & Research', confidence: 0.91 },
    university: { name: 'Education & Research', confidence: 0.93 },
    energy: { name: 'Energy & Utilities', confidence: 0.89 },
    insurance: { name: 'Insurance', confidence: 0.92 },
    telecom: { name: 'Telecommunications', confidence: 0.87 },
  };

  let detectedIndustry = { name: 'Enterprise', confidence: 0.75 };
  const lowerPrompt = prompt.toLowerCase();

  for (const [keyword, industry] of Object.entries(industryKeywords)) {
    if (lowerPrompt.includes(keyword)) {
      detectedIndustry = industry;
      break;
    }
  }

  return {
    detectedIndustry,
    roleObjective: 'AI Transformation Leader seeking to build an AI-native enterprise with focus on operational excellence, innovation, and competitive advantage.',
    recommendedPaths: [
      { id: 'p1', title: 'AI Foundry Process', description: 'Garage → Foundry → Factory methodology for end-to-end AI transformation', icon: 'factory' },
      { id: 'p2', title: 'Blueprint-First Strategy', description: 'Generate your enterprise AI blueprint before any implementation', icon: 'blueprint' },
      { id: 'p3', title: 'Agent Factory Approach', description: 'Build and deploy autonomous agents at enterprise scale', icon: 'bot' },
    ],
    relevantSolutions: [
      { id: 's1', name: 'Agentic AI Platform', description: 'Multi-agent orchestration for enterprise workflows', category: 'Platform' },
      { id: 's2', name: 'Knowledge Graph Suite', description: 'Connect enterprise data into intelligent networks', category: 'Data Intelligence' },
      { id: 's3', name: 'AI Governance Hub', description: 'Unified governance, risk, and compliance', category: 'Governance' },
    ],
    relevantLabs: [
      { id: 'l1', name: 'Agentic AI Lab', description: 'Multi-agent systems and autonomous workflows' },
      { id: 'l2', name: 'Generative AI Lab', description: 'LLMs, RAG systems, and prompt engineering' },
    ],
    nextStepActions: [
      { title: 'Generate Enterprise Blueprint', cta: 'Get Started', href: '#blueprint' },
      { title: 'Book a Strategy Workshop', cta: 'Book Now', href: '#contact' },
      { title: 'Explore AI Labs', cta: 'Discover', href: '#ai-labs' },
    ],
  };
}
