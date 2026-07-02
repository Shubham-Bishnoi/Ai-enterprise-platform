import { Check, Map } from "lucide-react";
import SectionHeader from "./SectionHeader";
import type { RoadmapData } from "./portalDemoData";
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
  const currentStage = currentStageIndex >= 0 ? data.stages[currentStageIndex] : data.stages[0];
  const completedStages = data.stages.filter((stage) => stage.status === "completed").length;
  const activeMilestone =
    data.milestones.find((milestone) => milestone.status === "in-progress") ??
    data.milestones.find((milestone) => milestone.status === "scheduled") ??
    data.milestones[0];
  const nextMilestone =
    data.milestones.find((milestone) => milestone.status !== "completed") ??
    data.milestones[data.milestones.length - 1];

  return (
    <div ref={ref} className="glass-card h-full p-7">
      <SectionHeader
        icon={Map}
        title="Transformation Roadmap"
        action={{ label: "View Full Roadmap" }}
      />

      {/* Desktop Timeline */}
      <div className="mt-2 mb-7 hidden items-start gap-3 md:flex">
        {data.stages.map((stage, index) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";
          const connectorActive = index <= currentStageIndex - 1;

          return (
            <div key={stage.name} className="contents">
              <div
                className="flex min-w-0 flex-1 flex-col items-center text-center"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.9)",
                  transition: `opacity 240ms cubic-bezier(0.34, 1.56, 0.64, 1) ${200 + index * 70}ms, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1) ${200 + index * 70}ms`,
                }}
              >
                <div
                  className={`flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? "h-9 w-9 border-[#22C55E] bg-[rgba(34,197,94,0.12)]"
                      : isCurrent
                        ? "h-10 w-10 border-[#178BFF] bg-[rgba(23,139,255,0.15)]"
                        : "h-9 w-9 border-white/[0.10] bg-[rgba(255,255,255,0.03)]"
                  }`}
                  style={
                    isCurrent
                      ? {
                          animation: "pulse-glow 2s linear infinite",
                          ["--glow-color" as string]: "rgba(23,139,255,0.30)",
                        }
                      : undefined
                  }
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-[#22C55E]" />
                  ) : (
                    <span className={`text-sm font-bold ${isCurrent ? "text-[#178BFF]" : "text-[#71717A]"}`}>
                      {stage.number}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold ${
                    isCompleted ? "text-[#22C55E]" : isCurrent ? "text-[#178BFF]" : "text-[#71717A]"
                  }`}
                >
                  {stage.name}
                </span>
              </div>

              {index < data.stages.length - 1 && (
                <div className="mt-[18px] flex-[0.65]">
                  <div className="relative h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: connectorActive && isVisible ? "100%" : "0%",
                        background: connectorActive
                          ? "linear-gradient(90deg, #EF233C, #A855F7, #178BFF)"
                          : "rgba(255,255,255,0.10)",
                        transition: `width 420ms cubic-bezier(0.16, 1, 0.3, 1) ${260 + index * 70}ms`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Timeline */}
      <div className="mb-6 space-y-3 md:hidden">
        {data.stages.map((stage, index) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";
          const connectorActive = index <= currentStageIndex - 1;

          return (
            <div
              key={stage.name}
              className="flex gap-3"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 300ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + index * 70}ms, transform 300ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + index * 70}ms`,
              }}
            >
              <div className="flex w-10 flex-col items-center">
                <div
                  className={`flex items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "h-9 w-9 border-[#22C55E] bg-[rgba(34,197,94,0.12)]"
                      : isCurrent
                        ? "h-10 w-10 border-[#178BFF] bg-[rgba(23,139,255,0.15)]"
                        : "h-9 w-9 border-white/[0.10] bg-[rgba(255,255,255,0.03)]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-[#22C55E]" />
                  ) : (
                    <span className={`text-sm font-bold ${isCurrent ? "text-[#178BFF]" : "text-[#71717A]"}`}>
                      {stage.number}
                    </span>
                  )}
                </div>
                {index < data.stages.length - 1 && (
                  <div className="mt-2 flex h-8 w-full justify-center">
                    <div className="w-[3px] rounded-full bg-white/[0.08]">
                      <div
                        className="h-full w-full rounded-full"
                        style={{
                          background: connectorActive
                            ? "linear-gradient(180deg, #EF233C, #A855F7, #178BFF)"
                            : "rgba(255,255,255,0.10)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <div className={`text-sm font-semibold ${isCompleted ? "text-[#22C55E]" : isCurrent ? "text-[#178BFF]" : "text-[#F8FAFC]"}`}>
                  {stage.name}
                </div>
                <div className="mt-1 text-xs text-[#71717A]">
                  {isCompleted ? "Completed" : isCurrent ? "Current stage" : "Upcoming stage"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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

      {/* Current Stage Detail */}
      <div className="mt-4 grid gap-3 md:grid-cols-[1.35fr_0.85fr_0.85fr]">
        <div className="rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="micro-label mb-2">Current Stage Detail</div>
          <div className="text-sm font-semibold text-[#F8FAFC]">{currentStage?.name ?? "Current Stage"}</div>
          <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">{stageDescription}</p>
        </div>

        <div className="rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="micro-label mb-2">Key Milestone</div>
          <div className="text-sm font-semibold text-[#F8FAFC]">{activeMilestone?.title}</div>
          <p className="mt-2 text-sm text-[#A1A1AA]">{activeMilestone?.description}</p>
          <div className="mt-3 text-xs font-mono-data text-[#71717A]">{activeMilestone?.date}</div>
        </div>

        <div className="rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="micro-label mb-2">Roadmap Preview</div>
          <div className="text-sm font-semibold text-[#F8FAFC]">
            {completedStages} of {data.stages.length} stages completed
          </div>
          <p className="mt-2 text-sm text-[#A1A1AA]">Next decision point: {nextMilestone?.title}</p>
          <div className="mt-3 text-xs font-mono-data text-[#71717A]">{nextMilestone?.date}</div>
        </div>
      </div>
    </div>
  );
}
