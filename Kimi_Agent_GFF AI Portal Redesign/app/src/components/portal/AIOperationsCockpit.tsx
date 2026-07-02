import { Cpu, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";
import HealthRing from "./HealthRing";
import type { OperationsData } from "@/data/portalDemoData";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";

interface AIOperationsCockpitProps {
  data: OperationsData;
}

const statusColors: Record<string, string> = {
  active: "#22C55E",
  info: "#178BFF",
  warning: "#F59E0B",
  neutral: "#71717A",
};

export default function AIOperationsCockpit({ data }: AIOperationsCockpitProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);
  const indicatorDelays = useStaggeredEntrance(data.indicators.length, 400, 60);
  const activityDelays = useStaggeredEntrance(data.activities.length, 600, 80);

  return (
    <div ref={ref} className="glass-card p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">AI Operations Cockpit</h2>
        </div>
        <StatusBadge variant="active" pulse>Systems Nominal</StatusBadge>
      </div>

      {/* System Health Ring */}
      <div className="flex justify-center mb-6">
        <HealthRing
          value={data.healthScore}
          size={120}
          strokeWidth={8}
          enterDelay={isVisible ? 200 : 9999}
        />
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {data.indicators.map((indicator, index) => (
          <div
            key={indicator.label}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${indicatorDelays[index]}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${indicatorDelays[index]}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="micro-label">{indicator.label}</span>
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: statusColors[indicator.status],
                  ...(indicator.status === "active"
                    ? {
                        animation: "pulse-glow 2s linear infinite",
                        ["--glow-color" as string]: `${statusColors[indicator.status]}40`,
                      }
                    : {}),
                }}
              />
            </div>
            <div className="font-mono-data text-lg font-semibold text-[#F8FAFC]">
              {indicator.value}
            </div>
            <div className="text-xs text-[#71717A] mt-0.5">{indicator.detail}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Stream */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[#71717A]" />
          <span className="text-[0.9375rem] font-semibold text-[#F8FAFC]">Recent Activity</span>
        </div>
        <div className="space-y-3">
          {data.activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity 300ms ease ${activityDelays[index]}ms`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: statusColors[activity.variant] }}
              />
              <div className="min-w-0">
                <p className="text-[0.8125rem] text-[#A1A1AA] leading-snug">{activity.description}</p>
                <span className="text-[0.6875rem] font-mono-data text-[#71717A]">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
