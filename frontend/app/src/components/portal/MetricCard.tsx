import { TrendingUp, TrendingDown, AlertTriangle, Check, Minus, Circle } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";
import ProgressBar from "./ProgressBar";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description: string;
  trend?: { direction: "up" | "down" | "neutral"; text: string };
  featured?: boolean;
  enterDelay?: number;
  isPercentage?: boolean;
  isDate?: boolean;
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  featured = false,
  enterDelay = 0,
  isPercentage = false,
  isDate = false,
}: MetricCardProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);

  const numericValue = typeof value === "number" ? value : isPercentage ? parseInt(String(value)) : 0;
  const shouldAnimate = typeof value === "number" || isPercentage;
  const animatedValue = useCountUp(
    shouldAnimate ? numericValue : 0,
    800,
    isVisible ? enterDelay + 200 : 9999
  );

  const renderValue = () => {
    if (isDate) return <span className="font-mono-data">{value}</span>;
    if (isPercentage) return <span className="font-mono-data">{animatedValue}%</span>;
    if (typeof value === "number") return <span className="font-mono-data">{animatedValue}</span>;
    return <span className="font-mono-data">{value}</span>;
  };

  const renderTrendIcon = () => {
    if (!trend) return null;
    const iconClass = "w-3.5 h-3.5 flex-shrink-0";
    switch (trend.direction) {
      case "up":
        return <TrendingUp className={`${iconClass} text-[#22C55E]`} />;
      case "down":
        return <TrendingDown className={`${iconClass} text-[#EF4444]`} />;
      default:
        if (trend.text.includes("urgent")) return <AlertTriangle className={`${iconClass} text-[#F59E0B]`} />;
        if (trend.text.includes("On target") || trend.text.includes("All healthy") || trend.text.includes("Complete"))
          return <Check className={`${iconClass} text-[#22C55E]`} />;
        return <Minus className={`${iconClass} text-[#71717A]`} />;
    }
  };

  const trendColor = () => {
    if (!trend) return "text-[#71717A]";
    switch (trend.direction) {
      case "up": return "text-[#22C55E]";
      case "down": return "text-[#EF4444]";
      default:
        if (trend.text.includes("urgent")) return "text-[#F59E0B]";
        return "text-[#71717A]";
    }
  };

  return (
    <div
      ref={ref}
      className={`glass-card flex h-full min-h-[206px] flex-col p-6 ${featured ? "glass-card-featured" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms`,
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="micro-label max-w-[70%] leading-relaxed">{label}</span>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
          <Icon className="h-5 w-5 text-[#71717A]" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className={`text-[2rem] font-bold tracking-tight leading-tight sm:text-[2.15rem] ${featured ? "gradient-text" : "text-[#F8FAFC]"}`}>
          {isVisible ? renderValue() : "0"}
        </div>

        <div className="space-y-3">
          <p className="min-h-[2.75rem] text-sm leading-relaxed text-[#A1A1AA]">{description}</p>

          {trend && (
            <div className={`flex min-h-[1.25rem] items-center gap-1.5 text-xs font-medium ${trendColor()}`}>
              {renderTrendIcon()}
              {trend.text.includes("All healthy") && (
                <Circle
                  className="h-2 w-2 text-[#22C55E] fill-[#22C55E]"
                  style={{
                    animation: "pulse-glow 2s linear infinite",
                    ["--glow-color" as string]: "rgba(34,197,94,0.40)",
                  }}
                />
              )}
              <span className="leading-relaxed">{trend.text}</span>
            </div>
          )}

          {!trend && <div className="min-h-[1.25rem]" />}

          {featured && isPercentage && (
            <ProgressBar
              value={numericValue}
              variant="brand"
              height={4}
              enterDelay={enterDelay + 300}
              className="mt-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}
