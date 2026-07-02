class PortalPersonalizationService:
    def get_personalization(self, client_type: str) -> dict:
        ct = (client_type or "enterprise").strip().lower()

        if ct == "banking":
            return {
                "dashboard_subtitle": "Banking Enterprise AI Transformation Control Center",
                "recommended_modules": ["Compliance Readiness", "Risk Controls", "Audit Trail", "Policy Intelligence", "Customer Operations"],
                "governance_focus": ["model risk management", "auditability", "access controls", "human approval"],
                "suggested_next_actions": [
                    {"action": "Book Blueprint Review", "key": "book_blueprint_review"},
                    {"action": "Start AML / Compliance Pilot", "key": "start_pilot"},
                    {"action": "Review Governance Controls", "key": "review_governance"},
                ],
            }

        if ct == "university":
            return {
                "dashboard_subtitle": "University AI Lab and Enablement Workspace",
                "recommended_modules": ["AI Lab Setup", "AI Academy", "Faculty Enablement", "Student Innovation Pipeline", "Research Programs"],
                "governance_focus": ["student privacy", "content review", "secure data access"],
                "suggested_next_actions": [
                    {"action": "Create University AI Lab Blueprint", "key": "create_lab_blueprint"},
                    {"action": "Schedule Faculty Workshop", "key": "schedule_workshop"},
                    {"action": "Upload Research Documents", "key": "upload_documents"},
                ],
            }

        if ct == "government":
            return {
                "dashboard_subtitle": "Government Secure AI Operations and Governance Dashboard",
                "recommended_modules": ["Citizen Service Automation", "Policy Intelligence", "Compliance", "Secure Data Governance", "Public Service Operations"],
                "governance_focus": ["transparency", "audit trail", "access control", "incident response"],
                "suggested_next_actions": [
                    {"action": "Request Governance Review", "key": "request_governance_review"},
                    {"action": "Launch Citizen Service Pilot", "key": "launch_pilot"},
                    {"action": "Schedule Executive Workshop", "key": "schedule_exec_workshop"},
                ],
            }

        if ct == "manufacturing":
            return {
                "dashboard_subtitle": "Manufacturing AI Operations Control Room",
                "recommended_modules": ["Plant Intelligence", "Maintenance Copilots", "Quality Operations", "Safety Analytics", "Supply Chain Visibility"],
                "governance_focus": ["safety controls", "workflow approvals", "production traceability"],
                "suggested_next_actions": [
                    {"action": "Start Maintenance Copilot Pilot", "key": "start_maintenance_pilot"},
                    {"action": "Review Safety Governance", "key": "review_safety_governance"},
                    {"action": "Upload SOP / Manuals", "key": "upload_sop"},
                ],
            }

        if ct == "startup":
            return {
                "dashboard_subtitle": "Startup / SMB AI Build and Delivery Workspace",
                "recommended_modules": ["MVP Build", "AI Product Roadmap", "Automation Pilot", "Investor-Ready Blueprint", "Lean Agent Stack"],
                "governance_focus": ["lean controls", "prompt safety", "basic audit logging"],
                "suggested_next_actions": [
                    {"action": "Generate Investor Blueprint", "key": "generate_blueprint"},
                    {"action": "Start MVP Build Sprint", "key": "start_sprint"},
                    {"action": "Book Architecture Review", "key": "book_arch_review"},
                ],
            }

        return {
            "dashboard_subtitle": "Enterprise AI Transformation Control Center",
            "recommended_modules": ["Blueprint", "Agent Factory", "AI Governance", "Knowledge Graph", "AI Operations"],
            "governance_focus": ["controls", "logging and audit", "human approval", "vendor registry"],
            "suggested_next_actions": [
                {"action": "Book Blueprint Review", "key": "book_blueprint_review"},
                {"action": "Launch Agent Factory", "key": "launch_agent_factory"},
                {"action": "Upload Documents", "key": "upload_documents"},
            ],
        }
