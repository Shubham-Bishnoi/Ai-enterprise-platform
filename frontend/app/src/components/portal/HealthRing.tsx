import { useCountUp } from "@/hooks/useCountUp";
import { useId } from "react";

interface HealthRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  enterDelay?: number;
}

export default function HealthRing({
  value,
  size = 120,
  strokeWidth = 8,
  enterDelay = 0,
}: HealthRingProps) {
  const gradientId = useId().replace(/:/g, "");
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const animatedValue = useCountUp(value, 1000, enterDelay);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF233C" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#178BFF" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: `stroke-dashoffset 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
          {animatedValue}
        </span>
        <span className="micro-label mt-0.5">HEALTH</span>
      </div>
      <div
        className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-[rgba(255,255,255,0.10)]"
        style={{
          animation: "pulse-glow 2s linear infinite",
          ["--glow-color" as string]: "rgba(34,197,94,0.30)",
        }}
      />
    </div>
  );
}
