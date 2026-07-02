interface ProgressBarProps {
  value: number;
  variant?: "default" | "brand" | "status";
  statusColor?: string;
  height?: number;
  animated?: boolean;
  enterDelay?: number;
  shimmer?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  variant = "default",
  statusColor = "#22C55E",
  height = 6,
  animated = true,
  enterDelay = 0,
  shimmer = false,
  className = "",
}: ProgressBarProps) {
  const getFillStyle = () => {
    switch (variant) {
      case "brand":
        return { background: "linear-gradient(90deg, #EF233C, #A855F7, #178BFF)" };
      case "status":
        return { background: statusColor };
      default:
        return { background: "#F8FAFC" };
    }
  };

  return (
    <div
      className={`w-full rounded-full bg-white/[0.06] overflow-hidden relative ${className}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-full relative"
        style={{
          ...getFillStyle(),
          width: animated ? undefined : `${value}%`,
          animation: animated
            ? `progress-fill 800ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms forwards`
            : undefined,
          ["--target-width" as string]: `${value}%`,
        }}
      />
      {shimmer && (
        <div
          className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
          style={{ height }}
        >
          <div
            className="absolute top-0 bottom-0 w-1/2"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              animation: "shimmer-sweep 3s linear infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}
