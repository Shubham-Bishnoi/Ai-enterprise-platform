import { FolderKanban, ChevronRight, User, Flag } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProgressBar from "./ProgressBar";
import type { ProjectData } from "@/data/portalDemoData";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";

interface ProjectCommandBoardProps {
  projects: ProjectData[];
}

const riskBadgeClass: Record<string, string> = {
  Low: "status-badge-active",
  Medium: "status-badge-warning",
  High: "status-badge-danger",
};

const statusBadgeClass: Record<string, string> = {
  "In Progress": "status-badge-info",
  "On Hold": "status-badge-warning",
  Complete: "status-badge-active",
};

export default function ProjectCommandBoard({ projects }: ProjectCommandBoardProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);
  const delays = useStaggeredEntrance(projects.length, 0, 80);

  return (
    <div ref={ref} className="glass-card p-7">
      <SectionHeader
        icon={FolderKanban}
        title="Project Command Board"
        action={{ label: "View All Projects" }}
      />

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div
            key={project.name}
            className="rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-[18px] cursor-pointer transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-px"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delays[index]}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delays[index]}ms, border-color 200ms ease, background 200ms ease`,
            }}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.9375rem] font-semibold text-[#F8FAFC] truncate pr-3">
                {project.name}
              </span>
              <span className={statusBadgeClass[project.status]}>
                {project.status}
              </span>
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
              <span className="micro-label">{project.phase}</span>
              <div className="flex items-center gap-1 text-xs text-[#71717A]">
                <User className="w-3 h-3" />
                {project.owner}
              </div>
              <span className={riskBadgeClass[project.risk]}>
                {project.risk}
              </span>
            </div>

            {/* Progress Bar */}
            <ProgressBar
              value={project.progress}
              variant="status"
              statusColor={project.risk === "Low" ? "#22C55E" : project.risk === "Medium" ? "#F59E0B" : "#EF4444"}
              height={5}
              enterDelay={isVisible ? delays[index] + 100 : 9999}
              className="mb-3"
            />

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
                <Flag className="w-3 h-3" />
                <span>
                  {project.nextMilestone.name} — {project.nextMilestone.date}
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors">
                View Project
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
