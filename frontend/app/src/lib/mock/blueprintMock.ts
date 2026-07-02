import type { BlueprintFormInput, BlueprintResult, ScoreCategory, AIOpportunity } from '@/types/blueprint';

// Legacy mock fallback retained for offline experimentation only.
// The homepage Blueprint flow now uses backend APIs as the primary path.

// Generate readiness score based on form input
export function computeReadinessScore(form: BlueprintFormInput): number {
  let score = 35;
  if (form.companySize === 'Enterprise') score += 8;
  if (form.companySize === 'Large Enterprise') score += 12;
  if (form.aiJourneyStage === 'Exploring') score += 5;
  if (form.aiJourneyStage === 'Piloting') score += 12;
  if (form.aiJourneyStage === 'Scaling') score += 18;
  if (form.aiJourneyStage === 'Transforming') score += 25;
  score += Math.min(15, form.topPriorities.length * 5);
  if (form.existingSystems && form.existingSystems.length > 0) score += 5;
  if (form.dataReadiness === 'Moderate') score += 5;
  if (form.dataReadiness === 'High') score += 10;
  if (form.leadershipCommitment === 'Committed') score += 8;
  if (form.leadershipCommitment === 'Fully Committed') score += 12;
  return Math.min(98, Math.max(15, score));
}

export function getScoreCategory(score: number): ScoreCategory {
  if (score < 25) return 'AI Beginner';
  if (score < 45) return 'AI Explorer';
  if (score < 65) return 'AI Adopter';
  if (score < 85) return 'AI Transformer';
  return 'AI-Native Leader';
}

// Generate mock blueprint result based on form input
export function generateMockBlueprint(form: BlueprintFormInput): BlueprintResult {
  const score = computeReadinessScore(form);
  const category = getScoreCategory(score);
  const now = new Date().toISOString();

  const industryLabel = form.industry || 'Enterprise';

  const opportunities = getOpportunitiesForIndustry(industryLabel);
  const solutions = getSolutionsForIndustry();
  const impact = getBusinessImpact();

  return {
    id: `bp_${Date.now()}`,
    generatedAt: now,
    readinessScore: {
      score,
      category,
      breakdown: {
        dataMaturity: Math.min(95, score + Math.floor(Math.random() * 20 - 10)),
        aiAdoption: Math.min(95, score + Math.floor(Math.random() * 20 - 10)),
        orgReadiness: Math.min(95, score + Math.floor(Math.random() * 20 - 10)),
        techInfrastructure: Math.min(95, score + Math.floor(Math.random() * 20 - 10)),
        governance: Math.min(95, score + Math.floor(Math.random() * 20 - 10)),
      },
    },
    opportunities,
    recommendedSolutions: solutions,
    businessImpact: impact,
    roadmap: getRoadmap(),
    operatingModel: {
      layers: [
        { name: 'Strategic Layer', components: ['AI Vision & Strategy', 'Executive Sponsorship', 'Investment Planning', 'Change Management'] },
        { name: 'Intelligence Layer', components: ['Knowledge Graphs', 'Data Fabric', 'Vector Stores', 'Real-time Analytics'] },
        { name: 'Agent Layer', components: ['Multi-Agent Systems', 'Task Agents', 'Decision Agents', 'Orchestration Engine'] },
        { name: 'Integration Layer', components: ['API Gateway', 'Event Bus', 'Legacy Connectors', 'Cloud Fabric'] },
        { name: 'Governance Layer', components: ['Trust & Risk', 'Compliance', 'Security', 'Ethics & Bias'] },
      ],
    },
    architecture: {
      layers: [
        { name: 'Experience Layer', description: 'AI interfaces and touchpoints', technologies: ['Conversational AI', 'Digital Twins', 'AR/VR', 'Voice'] },
        { name: 'Agent Layer', description: 'Autonomous agent ecosystem', technologies: ['LangChain', 'AutoGen', 'CrewAI', 'Custom Agents'] },
        { name: 'Intelligence Layer', description: 'Core AI capabilities', technologies: ['LLMs', 'RAG', 'ML Pipelines', 'Knowledge Graphs'] },
        { name: 'Data Layer', description: 'Unified data foundation', technologies: ['Data Lakehouse', 'Vector DBs', 'Streaming', 'ETL/ELT'] },
        { name: 'Infrastructure Layer', description: 'Scalable compute and security', technologies: ['Kubernetes', 'GPU Clusters', 'Zero Trust', 'MLOps'] },
      ],
    },
    governance: {
      pillars: [
        { name: 'Trust', controls: ['Model Validation', 'Explainability', 'Human-in-the-Loop', 'Audit Trails'] },
        { name: 'Risk', controls: ['Risk Assessment', 'Impact Analysis', 'Fallback Systems', 'Incident Response'] },
        { name: 'Security', controls: ['Data Encryption', 'Access Control', 'Threat Detection', 'Secure DevOps'] },
        { name: 'Compliance', controls: ['Regulatory Mapping', 'Policy Engine', 'Reporting', 'Documentation'] },
        { name: 'Ethics', controls: ['Bias Testing', 'Fairness Metrics', 'Diverse Training Data', 'Review Board'] },
      ],
    },
    nextActions: [
      {
        title: 'Schedule Executive Workshop',
        description: 'Align leadership on AI vision and transformation roadmap.',
        cta: 'Book Workshop',
      },
      {
        title: 'Start Pilot Program',
        description: 'Launch a 90-day pilot for quick wins and proof of value.',
        cta: 'Start Pilot',
      },
      {
        title: 'Download Full Blueprint',
        description: 'Get the complete enterprise AI blueprint document.',
        cta: 'Download PDF',
      },
    ],
  };
}

function getOpportunitiesForIndustry(industry: string): AIOpportunity[] {
  const baseOpps: AIOpportunity[] = [
    { id: '1', title: 'Intelligent Document Processing', description: 'Automate extraction and processing of unstructured documents with AI.', impact: 'High', complexity: 'Medium', timeline: '2-4 weeks', category: 'Automation' },
    { id: '2', title: 'Predictive Analytics Platform', description: 'Forecast trends and optimize decisions with ML-driven insights.', impact: 'High', complexity: 'Medium', timeline: '4-8 weeks', category: 'Analytics' },
    { id: '3', title: 'Conversational AI Assistant', description: 'Deploy AI agents for customer service and internal support.', impact: 'High', complexity: 'Low', timeline: '2-4 weeks', category: 'Agentic AI' },
    { id: '4', title: 'Knowledge Graph Construction', description: 'Connect enterprise data into an intelligent knowledge network.', impact: 'Medium', complexity: 'High', timeline: '8-12 weeks', category: 'Data Intelligence' },
    { id: '5', title: 'Autonomous Decision Engine', description: 'AI-powered decision making for complex operational scenarios.', impact: 'High', complexity: 'High', timeline: '12-16 weeks', category: 'Agentic AI' },
  ];

  const industryOpps: Record<string, AIOpportunity[]> = {
    'Banking': [
      { id: 'b1', title: 'AI-Powered Fraud Detection', description: 'Real-time transaction monitoring with ML anomaly detection.', impact: 'High', complexity: 'High', timeline: '8-12 weeks', category: 'Risk' },
      { id: 'b2', title: 'Intelligent Credit Scoring', description: 'Alternative data-driven credit risk assessment models.', impact: 'High', complexity: 'Medium', timeline: '6-10 weeks', category: 'Analytics' },
      { id: 'b3', title: 'Regulatory Compliance AI', description: 'Automated compliance monitoring and reporting system.', impact: 'Medium', complexity: 'High', timeline: '10-14 weeks', category: 'Governance' },
      { id: 'b4', title: 'Conversational Banking Agent', description: 'AI assistant for customer queries, transfers, and advice.', impact: 'High', complexity: 'Medium', timeline: '4-8 weeks', category: 'Agentic AI' },
      { id: 'b5', title: 'Algorithmic Trading Intelligence', description: 'AI-enhanced trading strategies and portfolio optimization.', impact: 'High', complexity: 'High', timeline: '12-16 weeks', category: 'Analytics' },
    ],
    'Healthcare': [
      { id: 'h1', title: 'Clinical Decision Support', description: 'AI-powered diagnostic assistance and treatment recommendations.', impact: 'High', complexity: 'High', timeline: '10-16 weeks', category: 'Diagnostics' },
      { id: 'h2', title: 'Patient Risk Stratification', description: 'Predict patient outcomes and prioritize interventions.', impact: 'High', complexity: 'Medium', timeline: '6-10 weeks', category: 'Analytics' },
      { id: 'h3', title: 'Medical Imaging AI', description: 'Automated analysis of radiology and pathology images.', impact: 'High', complexity: 'High', timeline: '12-20 weeks', category: 'Diagnostics' },
      { id: 'h4', title: 'Drug Discovery Accelerator', description: 'AI-driven molecular screening and compound optimization.', impact: 'High', complexity: 'High', timeline: '20-30 weeks', category: 'R&D' },
      { id: 'h5', title: 'Operational Workflow AI', description: 'Optimize scheduling, resource allocation, and patient flow.', impact: 'Medium', complexity: 'Medium', timeline: '4-8 weeks', category: 'Automation' },
    ],
    'Manufacturing': [
      { id: 'm1', title: 'Predictive Maintenance', description: 'IoT + ML for equipment failure prediction and prevention.', impact: 'High', complexity: 'Medium', timeline: '6-10 weeks', category: 'Operations' },
      { id: 'm2', title: 'Quality Control AI Vision', description: 'Computer vision for automated defect detection.', impact: 'High', complexity: 'Medium', timeline: '4-8 weeks', category: 'Quality' },
      { id: 'm3', title: 'Supply Chain Optimization', description: 'AI-driven demand forecasting and inventory optimization.', impact: 'High', complexity: 'High', timeline: '8-12 weeks', category: 'Supply Chain' },
      { id: 'm4', title: 'Digital Twin Factory', description: 'Virtual simulation of manufacturing processes.', impact: 'Medium', complexity: 'High', timeline: '12-20 weeks', category: 'Digital Twin' },
      { id: 'm5', title: 'Energy Optimization AI', description: 'Reduce energy consumption with intelligent systems.', impact: 'Medium', complexity: 'Medium', timeline: '4-8 weeks', category: 'Sustainability' },
    ],
  };

  return industryOpps[industry] || baseOpps;
}

function getSolutionsForIndustry() {
  return [
    { id: 's1', name: 'Agentic AI Platform', description: 'Multi-agent orchestration and autonomous workflow engine.', category: 'Platform', estimatedValue: '$2M-$5M annually' },
    { id: 's2', name: 'Knowledge Graph Suite', description: 'Enterprise knowledge graph construction and management.', category: 'Data Intelligence', estimatedValue: '$1M-$3M annually' },
    { id: 's3', name: 'AI Governance Hub', description: 'Unified AI governance, risk, and compliance platform.', category: 'Governance', estimatedValue: '$500K-$1.5M annually' },
    { id: 's4', name: 'Intelligent Automation Suite', description: 'End-to-end intelligent process automation platform.', category: 'Automation', estimatedValue: '$1.5M-$4M annually' },
    { id: 's5', name: 'AI Academy Program', description: 'Enterprise-wide AI training and capability building.', category: 'Training', estimatedValue: '$300K-$800K one-time' },
  ];
}

function getBusinessImpact() {
  return [
    { metric: 'Cost Reduction', value: '25-40%', description: 'Operational cost savings through intelligent automation' },
    { metric: 'Revenue Growth', value: '15-30%', description: 'New revenue streams and upsell opportunities' },
    { metric: 'Time to Decision', value: '70% faster', description: 'Accelerated decision-making with AI insights' },
    { metric: 'Productivity Gain', value: '3-5x', description: 'Employee productivity multiplier with AI agents' },
    { metric: 'Risk Reduction', value: '50-70%', description: 'Reduced compliance and operational risks' },
  ];
}

function getRoadmap() {
  return [
    { phase: 1, title: 'Foundation', duration: '0-90 Days', activities: ['AI readiness assessment', 'Stakeholder alignment', 'Data audit & strategy', 'Pilot selection'], deliverables: ['AI Blueprint', 'Data roadmap', 'Pilot plan', 'Executive buy-in'] },
    { phase: 2, title: 'Quick Wins', duration: '90-180 Days', activities: ['Deploy 2-3 pilot agents', 'Knowledge graph MVP', 'Governance framework setup', 'Team training'], deliverables: ['Working pilots', 'Knowledge graph v1', 'Governance policy', 'Trained team'] },
    { phase: 3, title: 'Scale', duration: '6-12 Months', activities: ['Expand agent ecosystem', 'Productionize ML models', 'Integration with core systems', 'Continuous monitoring'], deliverables: ['10+ agents in production', 'ML pipelines', 'System integrations', 'Monitoring dashboard'] },
    { phase: 4, title: 'Transform', duration: '12-18 Months', activities: ['Autonomous operations', 'Cross-functional AI', 'Innovation lab', 'Industry leadership'], deliverables: ['AI-native operations', 'Cross-domain AI', 'Innovation portfolio', 'Market recognition'] },
  ];
}
