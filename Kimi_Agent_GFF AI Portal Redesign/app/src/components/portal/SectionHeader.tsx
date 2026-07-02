import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  contextLabel?: string;
}

export default function SectionHeader({ icon: Icon, title, action, contextLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <Icon className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
        <h2 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {contextLabel && (
          <span className="micro-label hidden sm:inline">{contextLabel}</span>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1 text-sm text-[#71717A] hover:text-[#A1A1AA] transition-colors duration-150"
          >
            {action.label}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
