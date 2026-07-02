import {
  FolderKanban,
  Compass,
  Bot,
  ShieldCheck,
  GitPullRequest,
  FileText,
  MessageSquare,
  Flag,
} from "lucide-react";
import MetricCard from "./MetricCard";
import type { MetricData } from "@/data/portalDemoData";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  FolderKanban,
  Compass,
  Bot,
  ShieldCheck,
  GitPullRequest,
  FileText,
  MessageSquare,
  Flag,
};

interface ExecutiveSnapshotProps {
  metrics: MetricData[];
}

export default function ExecutiveSnapshot({ metrics }: ExecutiveSnapshotProps) {
  const delays = useStaggeredEntrance(metrics.length, 0, 50);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
      {metrics.map((metric, index) => {
        const IconComp = iconMap[metric.icon];
        return (
          <MetricCard
            key={metric.id}
            icon={IconComp}
            label={metric.label}
            value={metric.value}
            description={metric.description}
            trend={metric.trend}
            featured={metric.featured}
            isPercentage={metric.isPercentage}
            isDate={metric.isDate}
            enterDelay={delays[index]}
          />
        );
      })}
    </div>
  );
}
