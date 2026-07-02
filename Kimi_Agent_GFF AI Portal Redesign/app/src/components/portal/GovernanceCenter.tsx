import { Shield, Check, Circle } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProgressBar from "./ProgressBar";
import type { GovernanceData } from "@/data/portalDemoData";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";
import { useCountUp } from "@/hooks/useCountUp";

interface GovernanceCenterProps {
  data: GovernanceData;
}

const riskBadgeClass: Record<string, string> = {
  Low: "status-badge-active",
  Moderate: "status-badge-warning",
  High: "status-badge-danger",
};

export default function GovernanceCenter({ data }: GovernanceCenterProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);
  const animatedReadiness = useCountUp(data.readiness, 800, isVisible ? 200 : 9999);

  return (
    <div ref={ref} className="glass-card p-7">
      <SectionHeader
        icon={Shield}
        title="Governance Center"
      />

      {/* Readiness Score */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold gradient-text leading-none">
              {isVisible ? `${animatedReadiness}%` : "0%"}
            </span>
          </div>
          <span className="text-sm text-[#A1A1AA]">
            of {data.totalControls} controls implemented
          </span>
        </div>
        <ProgressBar
          value={data.readiness}
          variant="brand"
          height={8}
          enterDelay={isVisible ? 300 : 9999}
          shimmer
        />
      </div>

      {/* Controls List */}
      <div className="space-y-1.5 mb-5">
        {data.controls.map((control, index) => (
          <div
            key={control.name}
            className="flex items-center justify-between h-9 px-2 rounded-lg transition-colors hover:bg-white/[0.02]"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: `opacity 300ms ease ${400 + index * 60}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              {control.implemented ? (
                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-[#71717A]" strokeWidth={1.5} />
              )}
              <span
                className={`text-sm font-medium ${
                  control.implemented ? "text-[#A1A1AA]" : "text-[#71717A]"
                }`}
              >
                {control.name}
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                control.implemented ? "text-[#22C55E]" : "text-[#71717A]"
              }`}
            >
              {control.implemented ? "Active" : "Pending"}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-5" />

      {/* Risk Assessment */}
      <div className="mb-4">
        <h3 className="text-[0.9375rem] font-semibold text-[#F8FAFC] mb-3">Risk Assessment</h3>
        <span className={riskBadgeClass[data.riskLevel]}>{data.riskLevel}</span>
        <p className="text-[0.8125rem] text-[#A1A1AA] mt-2">{data.riskDescription}</p>
      </div>

      {/* Coverage Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/[0.03] p-3">
          <div className="text-xl font-semibold text-[#F8FAFC] font-mono-data">{data.humanInLoop}%</div>
          <span className="micro-label">Human-in-the-Loop</span>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-3">
          <div className="text-xl font-semibold text-[#F8FAFC]">{data.auditTrail}</div>
          <span className="micro-label">Audit Trail</span>
        </div>
      </div>
    </div>
  );
}
