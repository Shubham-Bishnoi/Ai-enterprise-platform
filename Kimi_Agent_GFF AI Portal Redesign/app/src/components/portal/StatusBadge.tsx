import type { ReactNode } from "react";

interface StatusBadgeProps {
  variant: "active" | "warning" | "danger" | "info" | "neutral";
  children: ReactNode;
  pulse?: boolean;
  icon?: boolean;
  size?: "sm" | "md";
}

const variantClasses: Record<string, string> = {
  active: "bg-[rgba(34,197,94,0.12)] text-[#22C55E] border-[rgba(34,197,94,0.20)]",
  warning: "bg-[rgba(245,158,11,0.12)] text-[#F59E0B] border-[rgba(245,158,11,0.20)]",
  danger: "bg-[rgba(239,68,68,0.12)] text-[#EF4444] border-[rgba(239,68,68,0.20)]",
  info: "bg-[rgba(23,139,255,0.12)] text-[#178BFF] border-[rgba(23,139,255,0.20)]",
  neutral: "bg-[rgba(113,113,122,0.12)] text-[#71717A] border-[rgba(113,113,122,0.20)]",
};

const glowColors: Record<string, string> = {
  active: "rgba(34,197,94,0.40)",
  warning: "rgba(245,158,11,0.40)",
  danger: "rgba(239,68,68,0.40)",
  info: "rgba(23,139,255,0.40)",
  neutral: "rgba(113,113,122,0.40)",
};

export default function StatusBadge({
  variant,
  children,
  pulse = false,
  icon = true,
  size = "md",
}: StatusBadgeProps) {
  const sizeClasses = size === "sm" ? "h-5 px-2 text-[11px]" : "h-6 px-3 text-xs";
  const dotSize = size === "sm" ? "w-[5px] h-[5px]" : "w-1.5 h-1.5";
  const glowColor = glowColors[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-[0.04em] border ${sizeClasses} ${variantClasses[variant]}`}
    >
      {icon && (
        <span
          className={`${dotSize} rounded-full inline-block flex-shrink-0`}
          style={{
            backgroundColor: glowColor.replace("0.40", "1"),
            ...(pulse
              ? {
                  animation: "pulse-glow 2s linear infinite",
                  ["--glow-color" as string]: glowColor,
                }
              : {}),
          }}
        />
      )}
      {children}
    </span>
  );
}
