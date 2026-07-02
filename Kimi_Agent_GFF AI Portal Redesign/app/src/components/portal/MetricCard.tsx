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
      className={`glass-card p-5 ${featured ? "glass-card-featured" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-[#71717A]" strokeWidth={1.5} />
        <span className="micro-label">{label}</span>
      </div>

      <div className={`text-[2rem] font-bold tracking-tight leading-tight ${featured ? "gradient-text" : "text-[#F8FAFC]"}`}>
        {isVisible ? renderValue() : "0"}
      </div>

      <p className="text-sm text-[#A1A1AA] mt-1">{description}</p>

      {trend && (
        <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${trendColor()}`}>
          {renderTrendIcon()}
          {trend.text.includes("All healthy") && (
            <Circle
              className="w-2 h-2 text-[#22C55E] fill-[#22C55E]"
              style={{
                animation: "pulse-glow 2s linear infinite",
                ["--glow-color" as string]: "rgba(34,197,94,0.40)",
              }}
            />
          )}
          <span>{trend.text}</span>
        </div>
      )}

      {featured && isPercentage && (
        <ProgressBar
          value={numericValue}
          variant="brand"
          height={4}
          enterDelay={enterDelay + 300}
          className="mt-3"
        />
      )}
    </div>
  );
}
