export type ClientType =
  | "banking"
  | "enterprise"
  | "university"
  | "government"
  | "manufacturing"
  | "startup";

export interface ClientData {
  type: ClientType;
  name: string;
  subtitle: string;
  programName: string;
  stage: string;
  stageNumber: number;
  stageDescription: string;
  lastUpdated: string;
  nextMilestone: { name: string; date: string };
  metrics: MetricData[];
  roadmap: RoadmapData;
  operations: OperationsData;
  projects: ProjectData[];
  governance: GovernanceData;
  documents: DocumentData[];
  actions: ActionData[];
  support: SupportData;
  activities: ActivityData[];
}

export interface MetricData {
  id: string;
  icon: string;
  label: string;
  value: string | number;
  description: string;
  trend?: { direction: "up" | "down" | "neutral"; text: string };
  featured?: boolean;
  isPercentage?: boolean;
  isDate?: boolean;
}

export interface RoadmapData {
  stages: StageData[];
  milestones: MilestoneData[];
}

export interface StageData {
  name: string;
  number: number;
  status: "completed" | "current" | "future";
}

export interface MilestoneData {
  title: string;
  date: string;
  description: string;
  status: "completed" | "in-progress" | "scheduled" | "planned";
}

export interface OperationsData {
  healthScore: number;
  indicators: OperationIndicator[];
  activities: OperationActivity[];
}

export interface OperationIndicator {
  label: string;
  value: string;
  status: "active" | "info" | "warning" | "neutral";
  detail: string;
}

export interface OperationActivity {
  description: string;
  time: string;
  variant: "success" | "info" | "warning" | "neutral";
}

export interface ProjectData {
  name: string;
  phase: string;
  owner: string;
  risk: "Low" | "Medium" | "High";
  progress: number;
  status: "In Progress" | "On Hold" | "Complete";
  nextMilestone: { name: string; date: string };
}

export interface GovernanceData {
  readiness: number;
  controlsImplemented: number;
  totalControls: number;
  controls: ControlData[];
  riskLevel: "Low" | "Moderate" | "High";
  riskDescription: string;
  humanInLoop: number;
  auditTrail: string;
}

export interface ControlData {
  name: string;
  implemented: boolean;
}

export interface DocumentData {
  name: string;
  type: "PDF" | "DOCX" | "XLSX" | "PPTX";
  status: "Ready" | "Draft" | "Generating" | "Review";
  updated: string;
}

export interface ActionData {
  icon: string;
  title: string;
  description: string;
  cta: string;
}

export interface SupportData {
  openTickets: number;
  urgentTickets: number;
  avgResponse: string;
  sla: string;
  satisfaction: number;
  requestTypes: RequestTypeData[];
}

export interface RequestTypeData {
  icon: string;
  label: string;
}

export interface ActivityData {
  description: string;
  timestamp: string;
  variant: "success" | "info" | "warning" | "neutral";
  tag?: string;
}

const CLIENT_DATA: Record<ClientType, ClientData> = {
  banking: {
    type: "banking",
    name: "MetroBank Financial",
    subtitle: "Enterprise AI Transformation Control Center",
    programName: "Enterprise AI Blueprint Program — Q3 2025",
    stage: "Foundry",
    stageNumber: 2,
    stageDescription:
      "Foundry: Building governance frameworks, piloting AI agents, and establishing data foundations.",
    lastUpdated: "2 mins ago",
    nextMilestone: { name: "Governance Framework Review", date: "Jul 15" },
    metrics: [
      {
        id: "projects",
        icon: "FolderKanban",
        label: "Active Projects",
        value: 5,
        description: "Across all workstreams",
        trend: { direction: "up", text: "+2 this quarter" },
      },
      {
        id: "blueprint",
        icon: "Compass",
        label: "Blueprint Score",
        value: 82,
        description: "Overall readiness",
        trend: { direction: "up", text: "+5 pts" },
        featured: true,
      },
      {
        id: "agents",
        icon: "Bot",
        label: "Agents Running",
        value: 3,
        description: "Active AI agents",
        trend: { direction: "up", text: "All healthy" },
      },
      {
        id: "governance",
        icon: "ShieldCheck",
        label: "Governance Readiness",
        value: "71%",
        description: "Controls implemented",
        trend: { direction: "up", text: "+12%" },
        isPercentage: true,
      },
      {
        id: "decisions",
        icon: "GitPullRequest",
        label: "Open Decisions",
        value: 4,
        description: "Awaiting approval",
        trend: { direction: "neutral", text: "2 urgent" },
      },
      {
        id: "documents",
        icon: "FileText",
        label: "Documents",
        value: 24,
        description: "In vault",
        trend: { direction: "up", text: "+3 this week" },
      },
      {
        id: "sla",
        icon: "MessageSquare",
        label: "Support SLA",
        value: "4h",
        description: "Average response",
        trend: { direction: "up", text: "On target" },
      },
      {
        id: "milestone",
        icon: "Flag",
        label: "Next Milestone",
        value: "Jul 15",
        description: "Governance Review",
        trend: { direction: "neutral", text: "18 days" },
        isDate: true,
      },
    ],
    roadmap: {
      stages: [
        { name: "Garage", number: 1, status: "completed" },
        { name: "Foundry", number: 2, status: "current" },
        { name: "Factory", number: 3, status: "future" },
        { name: "Operate", number: 4, status: "future" },
        { name: "Optimize", number: 5, status: "future" },
        { name: "Scale", number: 6, status: "future" },
      ],
      milestones: [
        {
          title: "AI Opportunity Mapping",
          date: "June 2025",
          description: "Full assessment delivered",
          status: "completed",
        },
        {
          title: "Governance Pilot",
          date: "Due Jul 15",
          description: "Policy framework under review",
          status: "in-progress",
        },
        {
          title: "Agent Rollout",
          date: "Aug 2025",
          description: "Factory stage preparation",
          status: "scheduled",
        },
      ],
    },
    operations: {
      healthScore: 87,
      indicators: [
        { label: "Agents Running", value: "3", status: "active", detail: "100%" },
        { label: "Agent Sessions", value: "142", status: "info", detail: "+12 today" },
        { label: "Automation Runs", value: "1,847", status: "active", detail: "98.2% success" },
        { label: "Human Review Queue", value: "7", status: "warning", detail: "3 urgent" },
        { label: "Governance Checks", value: "24/24", status: "active", detail: "All passed" },
        { label: "Model Health", value: "Stable", status: "active", detail: "Last check: 2m ago" },
      ],
      activities: [
        { description: "Compliance Copilot completed policy scan", time: "2 min ago", variant: "info" },
        { description: "Agent session started: Risk Assessment", time: "15 min ago", variant: "success" },
        { description: "Governance check passed: Data Access Controls", time: "1 hr ago", variant: "success" },
        { description: "Human review required: AML alert #2847", time: "2 hr ago", variant: "warning" },
        { description: "Model health check completed", time: "3 hr ago", variant: "neutral" },
      ],
    },
    projects: [
      {
        name: "Enterprise AI Blueprint Program",
        phase: "Program Phase 2",
        owner: "GFF Team",
        risk: "Low",
        progress: 68,
        status: "In Progress",
        nextMilestone: { name: "Architecture Review", date: "Jul 10" },
      },
      {
        name: "Agent Factory Pilot",
        phase: "Pilot Deployment",
        owner: "GFF + MetroBank",
        risk: "Medium",
        progress: 42,
        status: "In Progress",
        nextMilestone: { name: "Agent Testing", date: "Jul 18" },
      },
      {
        name: "Governance Control Framework",
        phase: "Framework Build",
        owner: "Compliance Lead",
        risk: "Low",
        progress: 71,
        status: "In Progress",
        nextMilestone: { name: "Policy Sign-off", date: "Jul 15" },
      },
      {
        name: "Knowledge Graph Foundation",
        phase: "Foundation Phase",
        owner: "Data Team",
        risk: "Medium",
        progress: 35,
        status: "In Progress",
        nextMilestone: { name: "Schema Review", date: "Jul 25" },
      },
      {
        name: "AI Academy Enablement",
        phase: "Enablement",
        owner: "L&D Team",
        risk: "Low",
        progress: 55,
        status: "In Progress",
        nextMilestone: { name: "Workshop #3", date: "Aug 1" },
      },
    ],
    governance: {
      readiness: 71,
      controlsImplemented: 5,
      totalControls: 8,
      controls: [
        { name: "Model Oversight", implemented: true },
        { name: "Data Access Controls", implemented: true },
        { name: "Human Approval Workflows", implemented: true },
        { name: "Logging & Audit Trail", implemented: true },
        { name: "Responsible AI Policy", implemented: true },
        { name: "Bias & Risk Review", implemented: false },
        { name: "Vendor / Model Registry", implemented: false },
        { name: "Incident Response Plan", implemented: false },
      ],
      riskLevel: "Moderate",
      riskDescription: "Regulatory compliance requires additional bias review controls.",
      humanInLoop: 92,
      auditTrail: "Complete",
    },
    documents: [
      { name: "Enterprise AI Blueprint Report", type: "PDF", status: "Ready", updated: "3 days ago" },
      { name: "Architecture Pack", type: "PDF", status: "Ready", updated: "1 week ago" },
      { name: "Governance Checklist", type: "XLSX", status: "Review", updated: "yesterday" },
      { name: "Workshop Notes — Session 2", type: "DOCX", status: "Draft", updated: "2 days ago" },
      { name: "Transformation Roadmap", type: "PDF", status: "Ready", updated: "1 week ago" },
      { name: "Proposal Draft v3", type: "DOCX", status: "Draft", updated: "4 days ago" },
      { name: "Project SOW", type: "PDF", status: "Ready", updated: "2 weeks ago" },
      { name: "Executive Meeting Summary", type: "DOCX", status: "Ready", updated: "5 days ago" },
    ],
    actions: [
      {
        icon: "Calendar",
        title: "Book Blueprint Review",
        description: "Schedule your quarterly blueprint review session with the GFF team.",
        cta: "Book Now",
      },
      {
        icon: "FileText",
        title: "Request Proposal",
        description: "Generate a customized proposal for the next phase of your AI transformation.",
        cta: "Request",
      },
      {
        icon: "Bot",
        title: "Start Pilot",
        description: "Launch your first AI agent pilot in a controlled sandbox environment.",
        cta: "Launch",
      },
      {
        icon: "Upload",
        title: "Upload Documents",
        description: "Add new documents to your secure vault for team access.",
        cta: "Upload",
      },
      {
        icon: "Shield",
        title: "Review Governance",
        description: "Review and approve pending governance controls.",
        cta: "Review",
      },
    ],
    support: {
      openTickets: 3,
      urgentTickets: 2,
      avgResponse: "4h",
      sla: "8h",
      satisfaction: 96,
      requestTypes: [
        { icon: "Wrench", label: "Technical Support" },
        { icon: "Compass", label: "Blueprint Review" },
        { icon: "Users", label: "Workshop Request" },
        { icon: "Shield", label: "Governance Review" },
        { icon: "Layers", label: "Architecture Review" },
        { icon: "Bot", label: "New Agent Request" },
      ],
    },
    activities: [
      { description: "Compliance Copilot started policy scan — Batch #47", timestamp: "2 min ago", variant: "info", tag: "Agent" },
      { description: "Governance checklist 'Data Access Controls' marked complete", timestamp: "1 hr ago", variant: "success", tag: "Governance" },
      { description: "Document 'Workshop Notes — Session 2' uploaded to vault", timestamp: "3 hr ago", variant: "success", tag: "Document" },
      { description: "Human review requested for AML alert #2847", timestamp: "5 hr ago", variant: "warning", tag: "Agent" },
      { description: "Support ticket #128 created: Blueprint Review Request", timestamp: "Yesterday", variant: "info", tag: "Support" },
      { description: "Agent Factory Pilot milestone 'Integration Test' completed", timestamp: "Yesterday", variant: "success", tag: "Project" },
      { description: "Governance control 'Bias Review' flagged for attention", timestamp: "2 days ago", variant: "warning", tag: "Governance" },
      { description: "System health check completed — All systems nominal", timestamp: "3 days ago", variant: "neutral" },
    ],
  },

  enterprise: {
    type: "enterprise",
    name: "Apex Enterprise Group",
    subtitle: "Enterprise AI Transformation Control Center",
    programName: "Operating Model Redesign — Q3 2025",
    stage: "Foundry",
    stageNumber: 2,
    stageDescription:
      "Foundry: Piloting agent factory, building knowledge graph foundations, and establishing enterprise AI governance.",
    lastUpdated: "5 mins ago",
    nextMilestone: { name: "Agent Factory Integration", date: "Jul 22" },
    metrics: [
      {
        id: "projects",
        icon: "FolderKanban",
        label: "Active Projects",
        value: 6,
        description: "Across all workstreams",
        trend: { direction: "up", text: "+1 this quarter" },
      },
      {
        id: "blueprint",
        icon: "Compass",
        label: "Blueprint Score",
        value: 78,
        description: "Overall readiness",
        trend: { direction: "up", text: "+3 pts" },
        featured: true,
      },
      {
        id: "agents",
        icon: "Bot",
        label: "Agents Running",
        value: 4,
        description: "Active AI agents",
        trend: { direction: "up", text: "All healthy" },
      },
      {
        id: "governance",
        icon: "ShieldCheck",
        label: "Governance Readiness",
        value: "68%",
        description: "Controls implemented",
        trend: { direction: "up", text: "+8%" },
        isPercentage: true,
      },
      {
        id: "decisions",
        icon: "GitPullRequest",
        label: "Open Decisions",
        value: 5,
        description: "Awaiting approval",
        trend: { direction: "neutral", text: "1 urgent" },
      },
      {
        id: "documents",
        icon: "FileText",
        label: "Documents",
        value: 28,
        description: "In vault",
        trend: { direction: "up", text: "+5 this week" },
      },
      {
        id: "sla",
        icon: "MessageSquare",
        label: "Support SLA",
        value: "4h",
        description: "Average response",
        trend: { direction: "up", text: "On target" },
      },
      {
        id: "milestone",
        icon: "Flag",
        label: "Next Milestone",
        value: "Jul 22",
        description: "Agent Factory Integration",
        trend: { direction: "neutral", text: "25 days" },
        isDate: true,
      },
    ],
    roadmap: {
      stages: [
        { name: "Garage", number: 1, status: "completed" },
        { name: "Foundry", number: 2, status: "current" },
        { name: "Factory", number: 3, status: "future" },
        { name: "Operate", number: 4, status: "future" },
        { name: "Optimize", number: 5, status: "future" },
        { name: "Scale", number: 6, status: "future" },
      ],
      milestones: [
        {
          title: "Operating Model Assessment",
          date: "May 2025",
          description: "Assessment delivered and approved",
          status: "completed",
        },
        {
          title: "Agent Factory Pilot",
          date: "Due Jul 22",
          description: "Pilot deployment in progress",
          status: "in-progress",
        },
        {
          title: "Knowledge Graph Foundation",
          date: "Aug 2025",
          description: "Schema design and data ingestion",
          status: "scheduled",
        },
      ],
    },
    operations: {
      healthScore: 84,
      indicators: [
        { label: "Agents Running", value: "4", status: "active", detail: "100%" },
        { label: "Agent Sessions", value: "203", status: "info", detail: "+28 today" },
        { label: "Automation Runs", value: "3,421", status: "active", detail: "97.8% success" },
        { label: "Human Review Queue", value: "12", status: "warning", detail: "4 urgent" },
        { label: "Governance Checks", value: "24/24", status: "active", detail: "All passed" },
        { label: "Model Health", value: "Stable", status: "active", detail: "Last check: 5m ago" },
      ],
      activities: [
        { description: "Knowledge Graph Agent updated entity map", time: "5 min ago", variant: "info" },
        { description: "Process Automation Agent completed workflow #892", time: "30 min ago", variant: "success" },
        { description: "Data Quality Agent flagged 3 anomalies", time: "1 hr ago", variant: "warning" },
        { description: "Governance check passed: Model Registry", time: "2 hr ago", variant: "success" },
        { description: "System backup completed successfully", time: "4 hr ago", variant: "neutral" },
      ],
    },
    projects: [
      {
        name: "Operating Model Redesign",
        phase: "Implementation",
        owner: "GFF Team",
        risk: "Low",
        progress: 72,
        status: "In Progress",
        nextMilestone: { name: "Phase 2 Review", date: "Jul 15" },
      },
      {
        name: "Agent Factory Rollout",
        phase: "Pilot Phase",
        owner: "GFF + Apex",
        risk: "Medium",
        progress: 38,
        status: "In Progress",
        nextMilestone: { name: "Factory Integration", date: "Jul 22" },
      },
      {
        name: "Knowledge Graph Platform",
        phase: "Foundation",
        owner: "Data Architecture",
        risk: "Medium",
        progress: 45,
        status: "In Progress",
        nextMilestone: { name: "Schema Finalization", date: "Aug 1" },
      },
      {
        name: "AI Governance Center",
        phase: "Framework Build",
        owner: "Compliance",
        risk: "Low",
        progress: 60,
        status: "In Progress",
        nextMilestone: { name: "Policy Review", date: "Jul 18" },
      },
      {
        name: "Managed AI Operations",
        phase: "Planning",
        owner: "Operations",
        risk: "Low",
        progress: 25,
        status: "In Progress",
        nextMilestone: { name: "Ops Plan Draft", date: "Aug 5" },
      },
    ],
    governance: {
      readiness: 68,
      controlsImplemented: 5,
      totalControls: 8,
      controls: [
        { name: "Model Oversight", implemented: true },
        { name: "Data Access Controls", implemented: true },
        { name: "Human Approval Workflows", implemented: true },
        { name: "Logging & Audit Trail", implemented: true },
        { name: "Responsible AI Policy", implemented: true },
        { name: "Bias & Risk Review", implemented: false },
        { name: "Vendor / Model Registry", implemented: false },
        { name: "Incident Response Plan", implemented: false },
      ],
      riskLevel: "Moderate",
      riskDescription: "Enterprise scale requires strengthened vendor governance controls.",
      humanInLoop: 88,
      auditTrail: "Complete",
    },
    documents: [
      { name: "Operating Model Assessment", type: "PDF", status: "Ready", updated: "1 week ago" },
      { name: "Agent Factory Architecture", type: "PDF", status: "Ready", updated: "3 days ago" },
      { name: "Knowledge Graph Schema", type: "XLSX", status: "Draft", updated: "yesterday" },
      { name: "Governance Framework v2", type: "DOCX", status: "Review", updated: "2 days ago" },
      { name: "Workshop Notes — Leadership", type: "DOCX", status: "Ready", updated: "5 days ago" },
      { name: "AI Readiness Report", type: "PDF", status: "Ready", updated: "1 week ago" },
      { name: "Data Quality Standards", type: "XLSX", status: "Ready", updated: "4 days ago" },
      { name: "Project Charter", type: "DOCX", status: "Ready", updated: "2 weeks ago" },
    ],
    actions: [
      {
        icon: "Calendar",
        title: "Book Operating Model Review",
        description: "Schedule your quarterly operating model review with the GFF team.",
        cta: "Book Now",
      },
      {
        icon: "FileText",
        title: "Request Scale Proposal",
        description: "Generate a scale-out proposal for enterprise-wide AI deployment.",
        cta: "Request",
      },
      {
        icon: "Bot",
        title: "Launch Agent Factory",
        description: "Expand the agent factory pilot to production workflows.",
        cta: "Launch",
      },
      {
        icon: "Upload",
        title: "Upload Process Docs",
        description: "Add process documentation to the knowledge graph.",
        cta: "Upload",
      },
      {
        icon: "Shield",
        title: "Review AI Governance",
        description: "Review and approve pending AI governance controls.",
        cta: "Review",
      },
    ],
    support: {
      openTickets: 4,
      urgentTickets: 1,
      avgResponse: "4h",
      sla: "8h",
      satisfaction: 94,
      requestTypes: [
        { icon: "Wrench", label: "Technical Support" },
        { icon: "Compass", label: "Blueprint Review" },
        { icon: "Users", label: "Workshop Request" },
        { icon: "Shield", label: "Governance Review" },
        { icon: "Layers", label: "Architecture Review" },
        { icon: "Bot", label: "New Agent Request" },
      ],
    },
    activities: [
      { description: "Knowledge Graph Agent updated 47 entities", timestamp: "5 min ago", variant: "info", tag: "Agent" },
      { description: "Operating Model milestone 'Process Map' completed", timestamp: "2 hr ago", variant: "success", tag: "Project" },
      { description: "Document 'Governance Framework v2' uploaded to vault", timestamp: "4 hr ago", variant: "success", tag: "Document" },
      { description: "Data Quality Agent flagged schema inconsistencies", timestamp: "6 hr ago", variant: "warning", tag: "Agent" },
      { description: "Support ticket #145: Architecture Review Request", timestamp: "Yesterday", variant: "info", tag: "Support" },
      { description: "Governance check: Vendor Registry pending review", timestamp: "Yesterday", variant: "warning", tag: "Governance" },
      { description: "Workflow automation completed 847 runs", timestamp: "2 days ago", variant: "success", tag: "Agent" },
      { description: "System health check completed — All systems nominal", timestamp: "3 days ago", variant: "neutral" },
    ],
  },

  university: {
    type: "university",
    name: "Northbridge University",
    subtitle: "Enterprise AI Transformation Control Center",
    programName: "AI Lab & Academy Program — Q3 2025",
    stage: "Garage",
    stageNumber: 1,
    stageDescription:
      "Garage: Establishing AI lab infrastructure, designing curriculum, and building faculty enablement programs.",
    lastUpdated: "10 mins ago",
    nextMilestone: { name: "AI Lab Setup Completion", date: "Aug 1" },
    metrics: [
      {
        id: "projects",
        icon: "FolderKanban",
        label: "Active Projects",
        value: 4,
        description: "Across all workstreams",
        trend: { direction: "up", text: "+1 this quarter" },
      },
      {
        id: "blueprint",
        icon: "Compass",
        label: "Blueprint Score",
        value: 65,
        description: "Overall readiness",
        trend: { direction: "up", text: "+8 pts" },
        featured: true,
      },
      {
        id: "agents",
        icon: "Bot",
        label: "Agents Running",
        value: 2,
        description: "Active AI agents",
        trend: { direction: "neutral", text: "Setting up" },
      },
      {
        id: "governance",
        icon: "ShieldCheck",
        label: "Governance Readiness",
        value: "45%",
        description: "Controls implemented",
        trend: { direction: "up", text: "+15%" },
        isPercentage: true,
      },
      {
        id: "decisions",
        icon: "GitPullRequest",
        label: "Open Decisions",
        value: 3,
        description: "Awaiting approval",
        trend: { direction: "neutral", text: "1 urgent" },
      },
      {
        id: "documents",
        icon: "FileText",
        label: "Documents",
        value: 18,
        description: "In vault",
        trend: { direction: "up", text: "+6 this week" },
      },
      {
        id: "sla",
        icon: "MessageSquare",
        label: "Support SLA",
        value: "6h",
        description: "Average response",
        trend: { direction: "neutral", text: "Within SLA" },
      },
      {
        id: "milestone",
        icon: "Flag",
        label: "Next Milestone",
        value: "Aug 1",
        description: "AI Lab Setup",
        trend: { direction: "neutral", text: "35 days" },
        isDate: true,
      },
    ],
    roadmap: {
      stages: [
        { name: "Garage", number: 1, status: "current" },
        { name: "Foundry", number: 2, status: "future" },
        { name: "Factory", number: 3, status: "future" },
        { name: "Operate", number: 4, status: "future" },
        { name: "Optimize", number: 5, status: "future" },
        { name: "Scale", number: 6, status: "future" },
      ],
      milestones: [
        {
          title: "AI Lab Setup",
          date: "In Progress",
          description: "Infrastructure and compute provisioning",
          status: "in-progress",
        },
        {
          title: "Faculty Enablement",
          date: "Scheduled Aug",
          description: "Training program design",
          status: "scheduled",
        },
        {
          title: "Student Innovation Pipeline",
          date: "Planned Sep",
          description: "Pipeline architecture design",
          status: "planned",
        },
      ],
    },
    operations: {
      healthScore: 72,
      indicators: [
        { label: "Agents Running", value: "2", status: "active", detail: "100%" },
        { label: "Agent Sessions", value: "67", status: "info", detail: "+8 today" },
        { label: "Automation Runs", value: "482", status: "active", detail: "95.1% success" },
        { label: "Human Review Queue", value: "4", status: "active", detail: "1 pending" },
        { label: "Governance Checks", value: "12/24", status: "warning", detail: "50% passed" },
        { label: "Model Health", value: "Stable", status: "active", detail: "Last check: 10m ago" },
      ],
      activities: [
        { description: "Research Assistant processed paper corpus", time: "10 min ago", variant: "info" },
        { description: "Curriculum Agent generated course outline", time: "1 hr ago", variant: "success" },
        { description: "Student Success Agent flagged 2 at-risk students", time: "3 hr ago", variant: "warning" },
        { description: "AI Lab compute environment provisioned", time: "5 hr ago", variant: "success" },
        { description: "System health check completed", time: "Yesterday", variant: "neutral" },
      ],
    },
    projects: [
      {
        name: "AI Lab Establishment",
        phase: "Setup Phase",
        owner: "IT + GFF",
        risk: "Low",
        progress: 55,
        status: "In Progress",
        nextMilestone: { name: "Infrastructure Ready", date: "Jul 28" },
      },
      {
        name: "AI Academy Program",
        phase: "Curriculum Design",
        owner: "Academic Affairs",
        risk: "Medium",
        progress: 40,
        status: "In Progress",
        nextMilestone: { name: "Course Outline Review", date: "Aug 5" },
      },
      {
        name: "Faculty Enablement",
        phase: "Planning",
        owner: "L&D Team",
        risk: "Low",
        progress: 30,
        status: "In Progress",
        nextMilestone: { name: "Training Plan Draft", date: "Aug 10" },
      },
      {
        name: "Student Innovation Pipeline",
        phase: "Architecture",
        owner: "Innovation Office",
        risk: "Medium",
        progress: 20,
        status: "In Progress",
        nextMilestone: { name: "Pipeline Design Review", date: "Aug 15" },
      },
    ],
    governance: {
      readiness: 45,
      controlsImplemented: 3,
      totalControls: 8,
      controls: [
        { name: "Model Oversight", implemented: true },
        { name: "Data Access Controls", implemented: true },
        { name: "Human Approval Workflows", implemented: true },
        { name: "Logging & Audit Trail", implemented: false },
        { name: "Responsible AI Policy", implemented: false },
        { name: "Bias & Risk Review", implemented: false },
        { name: "Vendor / Model Registry", implemented: false },
        { name: "Incident Response Plan", implemented: false },
      ],
      riskLevel: "Low",
      riskDescription: "Academic environment with lower regulatory requirements. Focus on ethical AI use.",
      humanInLoop: 75,
      auditTrail: "Partial",
    },
    documents: [
      { name: "AI Lab Proposal", type: "PDF", status: "Ready", updated: "2 weeks ago" },
      { name: "Curriculum Framework", type: "DOCX", status: "Draft", updated: "3 days ago" },
      { name: "Faculty Training Plan", type: "DOCX", status: "Draft", updated: "5 days ago" },
      { name: "Infrastructure Requirements", type: "XLSX", status: "Ready", updated: "1 week ago" },
      { name: "Student Innovation Guide", type: "PDF", status: "Draft", updated: "yesterday" },
      { name: "Research Ethics Policy", type: "DOCX", status: "Review", updated: "4 days ago" },
    ],
    actions: [
      {
        icon: "Calendar",
        title: "Schedule AI Lab Tour",
        description: "Arrange a tour of the AI lab facilities for stakeholders.",
        cta: "Schedule",
      },
      {
        icon: "FileText",
        title: "Request Curriculum Review",
        description: "Get expert review of your AI curriculum framework.",
        cta: "Request",
      },
      {
        icon: "Bot",
        title: "Enable Faculty Pilot",
        description: "Launch a faculty-focused AI agent pilot program.",
        cta: "Launch",
      },
      {
        icon: "Upload",
        title: "Upload Research Data",
        description: "Add research datasets to the secure vault.",
        cta: "Upload",
      },
      {
        icon: "Shield",
        title: "Review Academic Governance",
        description: "Review and establish academic AI governance policies.",
        cta: "Review",
      },
    ],
    support: {
      openTickets: 2,
      urgentTickets: 0,
      avgResponse: "6h",
      sla: "12h",
      satisfaction: 92,
      requestTypes: [
        { icon: "Wrench", label: "Technical Support" },
        { icon: "Compass", label: "Blueprint Review" },
        { icon: "Users", label: "Workshop Request" },
        { icon: "Shield", label: "Governance Review" },
        { icon: "Layers", label: "Architecture Review" },
        { icon: "Bot", label: "New Agent Request" },
      ],
    },
    activities: [
      { description: "Research Assistant completed paper analysis batch", timestamp: "10 min ago", variant: "info", tag: "Agent" },
      { description: "AI Lab milestone 'Compute Ready' reached", timestamp: "3 hr ago", variant: "success", tag: "Project" },
      { description: "Document 'Curriculum Framework v2' uploaded", timestamp: "5 hr ago", variant: "success", tag: "Document" },
      { description: "Faculty Enablement workshop requested", timestamp: "Yesterday", variant: "info", tag: "Support" },
      { description: "Governance control 'Data Access' implemented", timestamp: "Yesterday", variant: "success", tag: "Governance" },
      { description: "Student Success Agent flagged enrollment trends", timestamp: "2 days ago", variant: "warning", tag: "Agent" },
      { description: "Support ticket #97: Lab Access Request created", timestamp: "2 days ago", variant: "info", tag: "Support" },
      { description: "System health check completed", timestamp: "3 days ago", variant: "neutral" },
    ],
  },

  government: {
    type: "government",
    name: "CivicGov Digital Mission",
    subtitle: "Enterprise AI Transformation Control Center",
    programName: "Citizen Service AI Program — Q3 2025",
    stage: "Foundry",
    stageNumber: 2,
    stageDescription:
      "Foundry: Building secure data governance, deploying citizen service agents, and establishing policy intelligence.",
    lastUpdated: "8 mins ago",
    nextMilestone: { name: "Data Governance Framework Review", date: "Jul 18" },
    metrics: [
      {
        id: "projects",
        icon: "FolderKanban",
        label: "Active Projects",
        value: 5,
        description: "Across all workstreams",
        trend: { direction: "up", text: "+2 this quarter" },
      },
      {
        id: "blueprint",
        icon: "Compass",
        label: "Blueprint Score",
        value: 72,
        description: "Overall readiness",
        trend: { direction: "up", text: "+6 pts" },
        featured: true,
      },
      {
        id: "agents",
        icon: "Bot",
        label: "Agents Running",
        value: 3,
        description: "Active AI agents",
        trend: { direction: "up", text: "All healthy" },
      },
      {
        id: "governance",
        icon: "ShieldCheck",
        label: "Governance Readiness",
        value: "82%",
        description: "Controls implemented",
        trend: { direction: "up", text: "+10%" },
        isPercentage: true,
      },
      {
        id: "decisions",
        icon: "GitPullRequest",
        label: "Open Decisions",
        value: 6,
        description: "Awaiting approval",
        trend: { direction: "neutral", text: "3 urgent" },
      },
      {
        id: "documents",
        icon: "FileText",
        label: "Documents",
        value: 22,
        description: "In vault",
        trend: { direction: "up", text: "+4 this week" },
      },
      {
        id: "sla",
        icon: "MessageSquare",
        label: "Support SLA",
        value: "4h",
        description: "Average response",
        trend: { direction: "up", text: "On target" },
      },
      {
        id: "milestone",
        icon: "Flag",
        label: "Next Milestone",
        value: "Jul 18",
        description: "Data Governance Review",
        trend: { direction: "neutral", text: "21 days" },
        isDate: true,
      },
    ],
    roadmap: {
      stages: [
        { name: "Garage", number: 1, status: "completed" },
        { name: "Foundry", number: 2, status: "current" },
        { name: "Factory", number: 3, status: "future" },
        { name: "Operate", number: 4, status: "future" },
        { name: "Optimize", number: 5, status: "future" },
        { name: "Scale", number: 6, status: "future" },
      ],
      milestones: [
        {
          title: "Citizen Service Audit",
          date: "May 2025",
          description: "Audit completed and approved",
          status: "completed",
        },
        {
          title: "Data Governance Framework",
          date: "Due Jul 18",
          description: "Framework under stakeholder review",
          status: "in-progress",
        },
        {
          title: "Policy Intelligence Pilot",
          date: "Aug 2025",
          description: "Pilot deployment scheduled",
          status: "scheduled",
        },
      ],
    },
    operations: {
      healthScore: 91,
      indicators: [
        { label: "Agents Running", value: "3", status: "active", detail: "100%" },
        { label: "Agent Sessions", value: "189", status: "info", detail: "+22 today" },
        { label: "Automation Runs", value: "2,634", status: "active", detail: "99.1% success" },
        { label: "Human Review Queue", value: "9", status: "warning", detail: "5 urgent" },
        { label: "Governance Checks", value: "24/24", status: "active", detail: "All passed" },
        { label: "Model Health", value: "Stable", status: "active", detail: "Last check: 3m ago" },
      ],
      activities: [
        { description: "Citizen Service Agent handled 47 requests", time: "8 min ago", variant: "info" },
        { description: "Policy Intelligence Agent completed analysis", time: "45 min ago", variant: "success" },
        { description: "Data Governance check passed: Access Controls", time: "2 hr ago", variant: "success" },
        { description: "Transparency Bot published dataset #23", time: "4 hr ago", variant: "success" },
        { description: "Security audit scan completed", time: "6 hr ago", variant: "neutral" },
      ],
    },
    projects: [
      {
        name: "Citizen Service Automation",
        phase: "Deployment",
        owner: "Digital Services",
        risk: "Medium",
        progress: 58,
        status: "In Progress",
        nextMilestone: { name: "Service Integration", date: "Jul 20" },
      },
      {
        name: "Data Governance Framework",
        phase: "Framework Build",
        owner: "Data Protection",
        risk: "High",
        progress: 65,
        status: "In Progress",
        nextMilestone: { name: "Framework Sign-off", date: "Jul 18" },
      },
      {
        name: "Policy Intelligence Platform",
        phase: "Pilot Phase",
        owner: "Policy Team",
        risk: "Medium",
        progress: 40,
        status: "In Progress",
        nextMilestone: { name: "Pilot Launch", date: "Aug 1" },
      },
      {
        name: "Transparency Portal",
        phase: "Development",
        owner: "Communications",
        risk: "Low",
        progress: 50,
        status: "In Progress",
        nextMilestone: { name: "Beta Release", date: "Jul 28" },
      },
      {
        name: "Public Sector AI Academy",
        phase: "Planning",
        owner: "HR + GFF",
        risk: "Low",
        progress: 30,
        status: "In Progress",
        nextMilestone: { name: "Curriculum Draft", date: "Aug 10" },
      },
    ],
    governance: {
      readiness: 82,
      controlsImplemented: 6,
      totalControls: 8,
      controls: [
        { name: "Model Oversight", implemented: true },
        { name: "Data Access Controls", implemented: true },
        { name: "Human Approval Workflows", implemented: true },
        { name: "Logging & Audit Trail", implemented: true },
        { name: "Responsible AI Policy", implemented: true },
        { name: "Bias & Risk Review", implemented: true },
        { name: "Vendor / Model Registry", implemented: false },
        { name: "Incident Response Plan", implemented: false },
      ],
      riskLevel: "High",
      riskDescription: "Public sector accountability demands the highest governance standards. Incident response planning is critical.",
      humanInLoop: 95,
      auditTrail: "Complete",
    },
    documents: [
      { name: "Citizen Service Audit Report", type: "PDF", status: "Ready", updated: "2 weeks ago" },
      { name: "Data Governance Framework", type: "DOCX", status: "Review", updated: "yesterday" },
      { name: "Policy Intelligence Spec", type: "PDF", status: "Ready", updated: "5 days ago" },
      { name: "Transparency Portal Design", type: "PPTX", status: "Draft", updated: "3 days ago" },
      { name: "Security Assessment", type: "PDF", status: "Ready", updated: "1 week ago" },
      { name: "AI Ethics Guidelines", type: "DOCX", status: "Ready", updated: "4 days ago" },
      { name: "Public Consultation Summary", type: "PDF", status: "Ready", updated: "6 days ago" },
    ],
    actions: [
      {
        icon: "Calendar",
        title: "Book Citizen Service Review",
        description: "Review citizen service automation performance with the GFF team.",
        cta: "Book Now",
      },
      {
        icon: "FileText",
        title: "Request Transparency Report",
        description: "Generate a public transparency report on AI use.",
        cta: "Request",
      },
      {
        icon: "Bot",
        title: "Launch Policy Pilot",
        description: "Deploy the policy intelligence agent for a pilot department.",
        cta: "Launch",
      },
      {
        icon: "Upload",
        title: "Upload Policy Docs",
        description: "Add policy documents to the secure vault.",
        cta: "Upload",
      },
      {
        icon: "Shield",
        title: "Review Data Governance",
        description: "Review pending data governance controls and policies.",
        cta: "Review",
      },
    ],
    support: {
      openTickets: 5,
      urgentTickets: 3,
      avgResponse: "4h",
      sla: "6h",
      satisfaction: 93,
      requestTypes: [
        { icon: "Wrench", label: "Technical Support" },
        { icon: "Compass", label: "Blueprint Review" },
        { icon: "Users", label: "Workshop Request" },
        { icon: "Shield", label: "Governance Review" },
        { icon: "Layers", label: "Architecture Review" },
        { icon: "Bot", label: "New Agent Request" },
      ],
    },
    activities: [
      { description: "Citizen Service Agent processed 47 service requests", timestamp: "8 min ago", variant: "info", tag: "Agent" },
      { description: "Data Governance milestone 'Access Controls' approved", timestamp: "2 hr ago", variant: "success", tag: "Governance" },
      { description: "Document 'AI Ethics Guidelines' published", timestamp: "4 hr ago", variant: "success", tag: "Document" },
      { description: "Policy Intelligence Agent flagged 3 policy gaps", timestamp: "6 hr ago", variant: "warning", tag: "Agent" },
      { description: "Support ticket #156: Governance Review Request", timestamp: "Yesterday", variant: "info", tag: "Support" },
      { description: "Transparency Portal beta milestone reached", timestamp: "Yesterday", variant: "success", tag: "Project" },
      { description: "Security audit passed: No vulnerabilities found", timestamp: "2 days ago", variant: "success", tag: "Governance" },
      { description: "System health check completed", timestamp: "3 days ago", variant: "neutral" },
    ],
  },

  manufacturing: {
    type: "manufacturing",
    name: "ForgeWorks Manufacturing",
    subtitle: "Enterprise AI Transformation Control Center",
    programName: "Plant Intelligence Program — Q3 2025",
    stage: "Garage",
    stageNumber: 1,
    stageDescription:
      "Garage: Assessing plant operations, designing maintenance copilots, and planning safety analytics deployment.",
    lastUpdated: "15 mins ago",
    nextMilestone: { name: "Plant Assessment Completion", date: "Jul 25" },
    metrics: [
      {
        id: "projects",
        icon: "FolderKanban",
        label: "Active Projects",
        value: 5,
        description: "Across all workstreams",
        trend: { direction: "up", text: "+2 this quarter" },
      },
      {
        id: "blueprint",
        icon: "Compass",
        label: "Blueprint Score",
        value: 70,
        description: "Overall readiness",
        trend: { direction: "up", text: "+7 pts" },
        featured: true,
      },
      {
        id: "agents",
        icon: "Bot",
        label: "Agents Running",
        value: 4,
        description: "Active AI agents",
        trend: { direction: "up", text: "All healthy" },
      },
      {
        id: "governance",
        icon: "ShieldCheck",
        label: "Governance Readiness",
        value: "60%",
        description: "Controls implemented",
        trend: { direction: "up", text: "+10%" },
        isPercentage: true,
      },
      {
        id: "decisions",
        icon: "GitPullRequest",
        label: "Open Decisions",
        value: 3,
        description: "Awaiting approval",
        trend: { direction: "neutral", text: "1 urgent" },
      },
      {
        id: "documents",
        icon: "FileText",
        label: "Documents",
        value: 20,
        description: "In vault",
        trend: { direction: "up", text: "+4 this week" },
      },
      {
        id: "sla",
        icon: "MessageSquare",
        label: "Support SLA",
        value: "5h",
        description: "Average response",
        trend: { direction: "neutral", text: "Within SLA" },
      },
      {
        id: "milestone",
        icon: "Flag",
        label: "Next Milestone",
        value: "Jul 25",
        description: "Plant Assessment",
        trend: { direction: "neutral", text: "28 days" },
        isDate: true,
      },
    ],
    roadmap: {
      stages: [
        { name: "Garage", number: 1, status: "current" },
        { name: "Foundry", number: 2, status: "future" },
        { name: "Factory", number: 3, status: "future" },
        { name: "Operate", number: 4, status: "future" },
        { name: "Optimize", number: 5, status: "future" },
        { name: "Scale", number: 6, status: "future" },
      ],
      milestones: [
        {
          title: "Plant Assessment",
          date: "In Progress",
          description: "Comprehensive plant operations audit",
          status: "in-progress",
        },
        {
          title: "Maintenance Copilot Design",
          date: "Scheduled Aug",
          description: "Copilot architecture and training plan",
          status: "scheduled",
        },
        {
          title: "Safety Analytics",
          date: "Planned Sep",
          description: "Safety analytics platform design",
          status: "planned",
        },
      ],
    },
    operations: {
      healthScore: 79,
      indicators: [
        { label: "Agents Running", value: "4", status: "active", detail: "100%" },
        { label: "Agent Sessions", value: "178", status: "info", detail: "+31 today" },
        { label: "Automation Runs", value: "2,156", status: "active", detail: "96.4% success" },
        { label: "Human Review Queue", value: "6", status: "warning", detail: "2 urgent" },
        { label: "Governance Checks", value: "18/24", status: "warning", detail: "75% passed" },
        { label: "Model Health", value: "Stable", status: "active", detail: "Last check: 8m ago" },
      ],
      activities: [
        { description: "Maintenance Copilot predicted bearing failure on Line 3", time: "15 min ago", variant: "warning" },
        { description: "Quality Agent passed batch #4457 inspection", time: "1 hr ago", variant: "success" },
        { description: "Safety Monitor completed facility scan", time: "3 hr ago", variant: "success" },
        { description: "Supply Chain Agent updated inventory forecast", time: "5 hr ago", variant: "info" },
        { description: "Plant assessment data ingestion completed", time: "Yesterday", variant: "neutral" },
      ],
    },
    projects: [
      {
        name: "Plant Intelligence Platform",
        phase: "Assessment",
        owner: "Operations + GFF",
        risk: "Medium",
        progress: 48,
        status: "In Progress",
        nextMilestone: { name: "Assessment Report", date: "Jul 25" },
      },
      {
        name: "Maintenance Copilot",
        phase: "Design",
        owner: "Engineering",
        risk: "Medium",
        progress: 35,
        status: "In Progress",
        nextMilestone: { name: "Design Review", date: "Aug 5" },
      },
      {
        name: "Quality Operations AI",
        phase: "Planning",
        owner: "Quality Team",
        risk: "Low",
        progress: 25,
        status: "In Progress",
        nextMilestone: { name: "Requirements Sign-off", date: "Aug 10" },
      },
      {
        name: "Safety Analytics System",
        phase: "Architecture",
        owner: "Safety + IT",
        risk: "High",
        progress: 30,
        status: "In Progress",
        nextMilestone: { name: "Architecture Review", date: "Aug 1" },
      },
      {
        name: "Supply Chain Visibility",
        phase: "Discovery",
        owner: "Supply Chain",
        risk: "Medium",
        progress: 20,
        status: "In Progress",
        nextMilestone: { name: "Discovery Report", date: "Aug 15" },
      },
    ],
    governance: {
      readiness: 60,
      controlsImplemented: 4,
      totalControls: 8,
      controls: [
        { name: "Model Oversight", implemented: true },
        { name: "Data Access Controls", implemented: true },
        { name: "Human Approval Workflows", implemented: true },
        { name: "Logging & Audit Trail", implemented: true },
        { name: "Responsible AI Policy", implemented: false },
        { name: "Bias & Risk Review", implemented: false },
        { name: "Vendor / Model Registry", implemented: false },
        { name: "Incident Response Plan", implemented: false },
      ],
      riskLevel: "Moderate",
      riskDescription: "Manufacturing safety requirements demand robust incident response and bias review controls.",
      humanInLoop: 85,
      auditTrail: "Complete",
    },
    documents: [
      { name: "Plant Assessment Report", type: "PDF", status: "Draft", updated: "3 days ago" },
      { name: "Maintenance Copilot Spec", type: "PDF", status: "Ready", updated: "1 week ago" },
      { name: "Quality Standards Matrix", type: "XLSX", status: "Ready", updated: "5 days ago" },
      { name: "Safety Analytics Design", type: "DOCX", status: "Draft", updated: "yesterday" },
      { name: "Supply Chain Assessment", type: "PDF", status: "Ready", updated: "4 days ago" },
      { name: "Integration Architecture", type: "PPTX", status: "Draft", updated: "2 days ago" },
    ],
    actions: [
      {
        icon: "Calendar",
        title: "Book Plant Assessment",
        description: "Schedule a comprehensive plant operations assessment.",
        cta: "Book Now",
      },
      {
        icon: "FileText",
        title: "Request Scale Proposal",
        description: "Generate a proposal for scaling AI across all plant operations.",
        cta: "Request",
      },
      {
        icon: "Bot",
        title: "Launch Maintenance Copilot",
        description: "Deploy the maintenance copilot pilot on a production line.",
        cta: "Launch",
      },
      {
        icon: "Upload",
        title: "Upload Plant Data",
        description: "Add operational data and schematics to the secure vault.",
        cta: "Upload",
      },
      {
        icon: "Shield",
        title: "Review Safety Governance",
        description: "Review and establish safety-focused AI governance controls.",
        cta: "Review",
      },
    ],
    support: {
      openTickets: 3,
      urgentTickets: 1,
      avgResponse: "5h",
      sla: "10h",
      satisfaction: 91,
      requestTypes: [
        { icon: "Wrench", label: "Technical Support" },
        { icon: "Compass", label: "Blueprint Review" },
        { icon: "Users", label: "Workshop Request" },
        { icon: "Shield", label: "Governance Review" },
        { icon: "Layers", label: "Architecture Review" },
        { icon: "Bot", label: "New Agent Request" },
      ],
    },
    activities: [
      { description: "Maintenance Copilot flagged predictive alert on Line 3", timestamp: "15 min ago", variant: "warning", tag: "Agent" },
      { description: "Quality Agent passed batch inspection #4457", timestamp: "2 hr ago", variant: "success", tag: "Agent" },
      { description: "Document 'Safety Analytics Design' uploaded", timestamp: "4 hr ago", variant: "success", tag: "Document" },
      { description: "Plant Intelligence milestone 'Data Collection' completed", timestamp: "6 hr ago", variant: "success", tag: "Project" },
      { description: "Support ticket #112: Copilot Training Request", timestamp: "Yesterday", variant: "info", tag: "Support" },
      { description: "Governance control 'Human Approval' implemented", timestamp: "Yesterday", variant: "success", tag: "Governance" },
      { description: "Safety Monitor completed weekly facility scan", timestamp: "2 days ago", variant: "success", tag: "Agent" },
      { description: "System health check completed", timestamp: "3 days ago", variant: "neutral" },
    ],
  },

  startup: {
    type: "startup",
    name: "LaunchGrid AI Venture",
    subtitle: "Enterprise AI Transformation Control Center",
    programName: "AI MVP Acceleration Program — Q3 2025",
    stage: "Garage",
    stageNumber: 1,
    stageDescription:
      "Garage: Building the MVP roadmap, designing AI product architecture, and establishing a lean agent stack.",
    lastUpdated: "20 mins ago",
    nextMilestone: { name: "MVP Roadmap Finalization", date: "Aug 5" },
    metrics: [
      {
        id: "projects",
        icon: "FolderKanban",
        label: "Active Projects",
        value: 3,
        description: "Across all workstreams",
        trend: { direction: "up", text: "+1 this quarter" },
      },
      {
        id: "blueprint",
        icon: "Compass",
        label: "Blueprint Score",
        value: 58,
        description: "Overall readiness",
        trend: { direction: "up", text: "+10 pts" },
        featured: true,
      },
      {
        id: "agents",
        icon: "Bot",
        label: "Agents Running",
        value: 2,
        description: "Active AI agents",
        trend: { direction: "neutral", text: "Building" },
      },
      {
        id: "governance",
        icon: "ShieldCheck",
        label: "Governance Readiness",
        value: "35%",
        description: "Controls implemented",
        trend: { direction: "up", text: "+20%" },
        isPercentage: true,
      },
      {
        id: "decisions",
        icon: "GitPullRequest",
        label: "Open Decisions",
        value: 4,
        description: "Awaiting approval",
        trend: { direction: "neutral", text: "2 urgent" },
      },
      {
        id: "documents",
        icon: "FileText",
        label: "Documents",
        value: 12,
        description: "In vault",
        trend: { direction: "up", text: "+5 this week" },
      },
      {
        id: "sla",
        icon: "MessageSquare",
        label: "Support SLA",
        value: "8h",
        description: "Average response",
        trend: { direction: "neutral", text: "Within SLA" },
      },
      {
        id: "milestone",
        icon: "Flag",
        label: "Next Milestone",
        value: "Aug 5",
        description: "MVP Roadmap Final",
        trend: { direction: "neutral", text: "39 days" },
        isDate: true,
      },
    ],
    roadmap: {
      stages: [
        { name: "Garage", number: 1, status: "current" },
        { name: "Foundry", number: 2, status: "future" },
        { name: "Factory", number: 3, status: "future" },
        { name: "Operate", number: 4, status: "future" },
        { name: "Optimize", number: 5, status: "future" },
        { name: "Scale", number: 6, status: "future" },
      ],
      milestones: [
        {
          title: "MVP Roadmap",
          date: "In Progress",
          description: "Product roadmap and feature prioritization",
          status: "in-progress",
        },
        {
          title: "AI Product Architecture",
          date: "Scheduled Aug",
          description: "Architecture design and stack selection",
          status: "scheduled",
        },
        {
          title: "Lean Agent Stack",
          date: "Planned Sep",
          description: "Minimal viable agent architecture",
          status: "planned",
        },
      ],
    },
    operations: {
      healthScore: 68,
      indicators: [
        { label: "Agents Running", value: "2", status: "active", detail: "100%" },
        { label: "Agent Sessions", value: "56", status: "info", detail: "+12 today" },
        { label: "Automation Runs", value: "324", status: "active", detail: "94.2% success" },
        { label: "Human Review Queue", value: "3", status: "active", detail: "1 pending" },
        { label: "Governance Checks", value: "8/24", status: "warning", detail: "33% passed" },
        { label: "Model Health", value: "Stable", status: "active", detail: "Last check: 15m ago" },
      ],
      activities: [
        { description: "MVP Builder Agent generated feature spec v2", time: "20 min ago", variant: "info" },
        { description: "Market Research Agent completed competitor analysis", time: "2 hr ago", variant: "success" },
        { description: "Growth Automation Agent sent 142 outreach messages", time: "4 hr ago", variant: "success" },
        { description: "Investor Blueprint document generated", time: "6 hr ago", variant: "info" },
        { description: "System health check completed", time: "Yesterday", variant: "neutral" },
      ],
    },
    projects: [
      {
        name: "MVP Roadmap Execution",
        phase: "Planning",
        owner: "Product + GFF",
        risk: "Medium",
        progress: 45,
        status: "In Progress",
        nextMilestone: { name: "Roadmap Finalization", date: "Aug 5" },
      },
      {
        name: "AI Product Architecture",
        phase: "Design",
        owner: "Tech Lead",
        risk: "Medium",
        progress: 30,
        status: "In Progress",
        nextMilestone: { name: "Architecture Review", date: "Aug 15" },
      },
      {
        name: "Lean Agent Stack",
        phase: "Architecture",
        owner: "Engineering",
        risk: "Low",
        progress: 25,
        status: "In Progress",
        nextMilestone: { name: "Stack Decision", date: "Aug 20" },
      },
    ],
    governance: {
      readiness: 35,
      controlsImplemented: 2,
      totalControls: 8,
      controls: [
        { name: "Model Oversight", implemented: true },
        { name: "Data Access Controls", implemented: true },
        { name: "Human Approval Workflows", implemented: false },
        { name: "Logging & Audit Trail", implemented: false },
        { name: "Responsible AI Policy", implemented: false },
        { name: "Bias & Risk Review", implemented: false },
        { name: "Vendor / Model Registry", implemented: false },
        { name: "Incident Response Plan", implemented: false },
      ],
      riskLevel: "Low",
      riskDescription: "Early-stage startup with minimal regulatory exposure. Focus on building foundational controls.",
      humanInLoop: 60,
      auditTrail: "Partial",
    },
    documents: [
      { name: "MVP Roadmap", type: "PDF", status: "Draft", updated: "2 days ago" },
      { name: "AI Architecture Spec", type: "DOCX", status: "Draft", updated: "3 days ago" },
      { name: "Investor Blueprint", type: "PDF", status: "Ready", updated: "1 week ago" },
      { name: "Competitor Analysis", type: "XLSX", status: "Ready", updated: "4 days ago" },
      { name: "Product Requirements", type: "DOCX", status: "Draft", updated: "yesterday" },
      { name: "Growth Playbook", type: "PDF", status: "Ready", updated: "5 days ago" },
    ],
    actions: [
      {
        icon: "Calendar",
        title: "Book MVP Review",
        description: "Review your MVP roadmap with the GFF product team.",
        cta: "Book Now",
      },
      {
        icon: "FileText",
        title: "Request Investor Blueprint",
        description: "Generate an investor-ready AI transformation blueprint.",
        cta: "Request",
      },
      {
        icon: "Bot",
        title: "Launch Lean Agent Stack",
        description: "Deploy a minimal viable agent architecture for your product.",
        cta: "Launch",
      },
      {
        icon: "Upload",
        title: "Upload Product Specs",
        description: "Add product specifications and research to the vault.",
        cta: "Upload",
      },
      {
        icon: "Shield",
        title: "Review Lean Governance",
        description: "Establish lightweight governance for your AI product.",
        cta: "Review",
      },
    ],
    support: {
      openTickets: 4,
      urgentTickets: 2,
      avgResponse: "8h",
      sla: "24h",
      satisfaction: 89,
      requestTypes: [
        { icon: "Wrench", label: "Technical Support" },
        { icon: "Compass", label: "Blueprint Review" },
        { icon: "Users", label: "Workshop Request" },
        { icon: "Shield", label: "Governance Review" },
        { icon: "Layers", label: "Architecture Review" },
        { icon: "Bot", label: "New Agent Request" },
      ],
    },
    activities: [
      { description: "MVP Builder Agent generated feature specification v2", timestamp: "20 min ago", variant: "info", tag: "Agent" },
      { description: "Document 'Investor Blueprint' updated with new metrics", timestamp: "3 hr ago", variant: "success", tag: "Document" },
      { description: "Market Research Agent completed competitor analysis", timestamp: "5 hr ago", variant: "success", tag: "Agent" },
      { description: "Support ticket #78: Architecture Review Request", timestamp: "Yesterday", variant: "info", tag: "Support" },
      { description: "Governance control 'Model Oversight' implemented", timestamp: "Yesterday", variant: "success", tag: "Governance" },
      { description: "Growth Automation completed outreach campaign", timestamp: "2 days ago", variant: "success", tag: "Agent" },
      { description: "MVP Roadmap milestone 'Feature List' approved", timestamp: "2 days ago", variant: "success", tag: "Project" },
      { description: "System health check completed", timestamp: "3 days ago", variant: "neutral" },
    ],
  },
};

export function getClientData(type: ClientType): ClientData {
  return CLIENT_DATA[type];
}

export const CLIENT_TYPE_OPTIONS: { type: ClientType; label: string; name: string; icon: string }[] = [
  { type: "banking", label: "Banking", name: "MetroBank Financial", icon: "Building2" },
  { type: "enterprise", label: "Enterprise", name: "Apex Enterprise Group", icon: "Briefcase" },
  { type: "university", label: "University", name: "Northbridge University", icon: "GraduationCap" },
  { type: "government", label: "Government", name: "CivicGov Digital Mission", icon: "Landmark" },
  { type: "manufacturing", label: "Manufacturing", name: "ForgeWorks Manufacturing", icon: "Factory" },
  { type: "startup", label: "Startup", name: "LaunchGrid AI Venture", icon: "Rocket" },
];
