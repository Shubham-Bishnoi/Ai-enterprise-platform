import { Check, Map } from "lucide-react";
import SectionHeader from "./SectionHeader";
import type { RoadmapData } from "@/data/portalDemoData";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";

interface TransformationRoadmapProps {
  data: RoadmapData;
  stageDescription: string;
}

const statusDotColors = {
  completed: "bg-[#22C55E]",
  "in-progress": "bg-[#178BFF]",
  scheduled: "bg-[#71717A]",
  planned: "bg-[#52525B]",
};

export default function TransformationRoadmap({ data, stageDescription }: TransformationRoadmapProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);
  const currentStageIndex = data.stages.findIndex((s) => s.status === "current");
  const progressPercent = currentStageIndex >= 0 ? ((currentStageIndex) / (data.stages.length - 1)) * 100 : 0;

  return (
    <div ref={ref} className="glass-card p-7">
      <SectionHeader
        icon={Map}
        title="Transformation Roadmap"
        action={{ label: "View Full Roadmap" }}
      />

      {/* Timeline Track */}
      <div className="relative mb-8 mt-2">
        {/* Background track */}
        <div className="h-[3px] rounded-full bg-white/[0.06] relative overflow-hidden">
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
            style={{
              width: isVisible ? `${progressPercent}%` : "0%",
              background: "linear-gradient(90deg, #EF233C, #A855F7, #178BFF)",
              transition: `width 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms`,
            }}
          >
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                animation: "shimmer-sweep 3s linear infinite",
              }}
            />
          </div>
        </div>

        {/* Stage Nodes */}
        <div className="flex justify-between absolute top-0 left-0 right-0 -translate-y-1/2">
          {data.stages.map((stage, index) => {
            const isCompleted = stage.status === "completed";
            const isCurrent = stage.status === "current";

            return (
              <div
                key={stage.name}
                className="flex flex-col items-center"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.8)",
                  transition: `opacity 200ms cubic-bezier(0.34, 1.56, 0.64, 1) ${300 + index * 80}ms, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1) ${300 + index * 80}ms`,
                }}
              >
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isCompleted
                      ? "bg-[rgba(34,197,94,0.12)] border-[#22C55E]"
                      : isCurrent
                      ? "bg-[rgba(23,139,255,0.15)] border-[#178BFF] w-10 h-10"
                      : "bg-[rgba(255,255,255,0.03)] border-white/[0.10]"
                  }`}
                  style={
                    isCurrent
                      ? {
                          animation: "pulse-glow 2s linear infinite",
                          ["--glow-color" as string]: "rgba(23,139,255,0.30)",
                        }
                      : {}
                  }
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-[#22C55E]" />
                  ) : (
                    <span
                      className={`text-sm font-bold ${
                        isCurrent ? "text-[#178BFF]" : "text-[#71717A]"
                      }`}
                    >
                      {stage.number}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold mt-2 ${
                    isCompleted
                      ? "text-[#22C55E]"
                      : isCurrent
                      ? "text-[#178BFF]"
                      : "text-[#71717A]"
                  }`}
                >
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer for node labels */}
      <div className="h-6" />

      {/* Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {data.milestones.map((milestone, i) => (
          <div
            key={milestone.title}
            className="rounded-[14px] border border-white/[0.06] bg-white/[0.03] p-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 100}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 100}ms`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDotColors[milestone.status]}`} />
              <span className="text-[0.9375rem] font-semibold text-[#F8FAFC]">{milestone.title}</span>
            </div>
            <p className="text-sm text-[#A1A1AA] mb-1">{milestone.description}</p>
            <span className="text-xs text-[#71717A] font-mono-data">{milestone.date}</span>
          </div>
        ))}
      </div>

      {/* Stage Description */}
      <p className="text-[0.8125rem] text-[#A1A1AA] italic mt-4">{stageDescription}</p>
    </div>
  );
}
