import {
  Calendar,
  FileText,
  Bot,
  Upload,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import type { ActionData } from "./portalDemoData";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  FileText,
  Bot,
  Upload,
  Shield,
};

interface NextActionsProps {
  actions: ActionData[];
  onActionClick?: (action: string) => void;
}

export default function NextActions({ actions, onActionClick }: NextActionsProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);
  const delays = useStaggeredEntrance(actions.length, 0, 80);

  return (
    <div ref={ref} className="glass-card p-7">
      <SectionHeader
        icon={Zap}
        title="Recommended Next Actions"
        contextLabel="Based on your program status"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {actions.map((action, index) => {
          const IconComp = iconMap[action.icon] || Zap;
          const balanceLastRow = actions.length % 3 === 2 && index === actions.length - 1;
          return (
            <div
              key={action.title}
              onClick={() => onActionClick?.(action.title)}
              className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:shadow-glass-elevated ${
                balanceLastRow ? "lg:col-span-2 xl:col-span-1" : ""
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delays[index]}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delays[index]}ms, border-color 300ms ease, background 300ms ease, box-shadow 300ms ease`,
              }}
            >
              {/* Hover gradient top line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(90deg, #EF233C, #A855F7, #178BFF)",
                }}
              />

              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-3 transition-colors duration-200 group-hover:bg-white/[0.08]">
                <IconComp className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-[0.9375rem] font-semibold text-[#F8FAFC] mb-1.5">
                {action.title}
              </h3>

              {/* Description */}
              <p className="mb-3 text-[0.8125rem] leading-relaxed text-[#A1A1AA]">
                {action.description}
              </p>

              {/* CTA */}
              <div className="mt-auto flex items-center gap-1 pt-2 text-xs text-[#71717A] transition-colors duration-200 group-hover:text-[#F8FAFC]">
                <span>{action.cta}</span>
                <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
