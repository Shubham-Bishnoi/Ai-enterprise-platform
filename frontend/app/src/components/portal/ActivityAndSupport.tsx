import { useState } from "react";
import {
  Activity,
  MessageSquare,
  Plus,
  X,
  CheckCircle,
  Wrench,
  Compass,
  Users,
  Shield,
  Layers,
  Bot,
} from "lucide-react";
import type { ActivityData, SupportData } from "./portalDemoData";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";

const requestIconMap: Record<string, React.ElementType> = {
  Wrench,
  Compass,
  Users,
  Shield,
  Layers,
  Bot,
};

const tagBgColors: Record<string, string> = {
  Agent: "rgba(23,139,255,0.10)",
  Governance: "rgba(168,85,247,0.10)",
  Document: "rgba(245,158,11,0.10)",
  Support: "rgba(34,197,94,0.10)",
  Project: "rgba(239,35,60,0.10)",
};

const tagTextColors: Record<string, string> = {
  Agent: "#178BFF",
  Governance: "#A855F7",
  Document: "#F59E0B",
  Support: "#22C55E",
  Project: "#EF4444",
};

const variantColors: Record<string, string> = {
  success: "#22C55E",
  info: "#178BFF",
  warning: "#F59E0B",
  neutral: "#71717A",
};

interface ActivityAndSupportProps {
  activities: ActivityData[];
  support: SupportData;
}

export default function ActivityAndSupport({ activities: initialActivities, support: initialSupport }: ActivityAndSupportProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [activities, setActivities] = useState(initialActivities);
  const [openTickets, setOpenTickets] = useState(initialSupport.openTickets);

  const activityDelays = useStaggeredEntrance(activities.length, 0, 80);

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    setFormOpen(true);
    setFormError("");
  };

  const handleSubmit = () => {
    if (!title.trim() || title.trim().length < 3) {
      setFormError("Title must be at least 3 characters");
      return;
    }
    setFormError("");
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setFormOpen(false);
      setTitle("");
      setDescription("");
      setOpenTickets((prev) => prev + 1);

      const newActivity: ActivityData = {
        description: `Support ticket created: ${selectedType || "General Request"} — ${title}`,
        timestamp: "Just now",
        variant: "info",
        tag: "Support",
      };
      setActivities((prev) => [newActivity, ...prev]);

      setToast({ message: "Request submitted successfully" });
      setTimeout(() => setToast(null), 3000);
    }, 500);
  };

  return (
    <div ref={ref} className="glass-card flex h-full flex-col p-7">
      {/* Activity Feed */}
      <div className="mb-6 flex-1">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">Activity Feed</h2>
          </div>
          <button className="text-sm text-[#71717A] hover:text-[#A1A1AA] transition-colors">
            View All
          </button>
        </div>

        <div className="relative max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {/* Timeline Rail */}
          <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-white/[0.06]" />

          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 relative pl-1"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 300ms ease ${activityDelays[index]}ms`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 relative z-10"
                  style={{ backgroundColor: variantColors[activity.variant] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#A1A1AA] leading-snug">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[0.6875rem] font-mono-data text-[#71717A]">
                      {activity.timestamp}
                    </span>
                    {activity.tag && (
                      <span
                        className="text-[0.625rem] font-semibold uppercase px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: tagBgColors[activity.tag] || "rgba(255,255,255,0.05)",
                          color: tagTextColors[activity.tag] || "#71717A",
                        }}
                      >
                        {activity.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-6" />

      {/* Support Center */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">Support Center</h2>
          </div>
          <button
            onClick={() => {
              setSelectedType("");
              setFormOpen(true);
              setFormError("");
            }}
            className="btn-primary h-8 px-3 text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Request
          </button>
        </div>

        {/* SLA Status */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/[0.03] p-3">
            <div className="text-lg font-semibold text-[#F8FAFC] font-mono-data">{openTickets}</div>
            <span className="micro-label">{initialSupport.urgentTickets} urgent</span>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-3">
            <div className="text-lg font-semibold text-[#F8FAFC] font-mono-data">{initialSupport.avgResponse}</div>
            <span className="micro-label">SLA: {initialSupport.sla}</span>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-3">
            <div className="text-lg font-semibold text-[#F8FAFC] font-mono-data">{initialSupport.satisfaction}%</div>
            <span className="micro-label">Last 30 days</span>
          </div>
        </div>

        {/* Request Type Grid */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {initialSupport.requestTypes.map((rt) => {
            const IconComp = requestIconMap[rt.icon] || Wrench;
            const isSelected = selectedType === rt.label && formOpen;
            return (
              <button
                key={rt.label}
                onClick={() => handleTypeClick(rt.label)}
                className={`flex items-center gap-2 h-8 px-3 rounded-[10px] text-xs font-medium transition-all duration-150 ${
                  isSelected
                    ? "bg-white/[0.10] border border-white/[0.20] text-[#F8FAFC]"
                    : "bg-transparent border border-white/[0.08] text-[#71717A] hover:bg-white/[0.04] hover:text-[#A1A1AA]"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span className="truncate">{rt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Request Form */}
        <div
          className="grid transition-all duration-300 ease-out"
          style={{ gridTemplateRows: formOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="pt-3 border-t border-white/[0.06] space-y-3">
              <input
                type="text"
                placeholder="Request title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (formError) setFormError("");
                }}
                className={`glass-input ${formError ? "glass-input-error" : ""}`}
              />
              {formError && <p className="text-xs text-[#EF4444] -mt-2">{formError}</p>}
              <textarea
                placeholder="Describe your request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-textarea"
                rows={3}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setFormOpen(false);
                    setFormError("");
                  }}
                  className="btn-ghost h-9 px-4 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary h-9 px-5 text-sm gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-[14px] border border-[rgba(34,197,94,0.20)] bg-[rgba(34,197,94,0.10)] backdrop-blur-xl px-4 py-3.5 shadow-glass max-w-[360px]">
            <div className="w-1 h-8 rounded-full bg-[#22C55E]" />
            <CheckCircle className="w-[18px] h-[18px] text-[#22C55E] flex-shrink-0" />
            <span className="text-sm text-[#F8FAFC]">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-[#71717A] hover:text-[#F8FAFC] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
