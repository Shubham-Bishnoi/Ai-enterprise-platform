import { useState, useRef, useEffect } from "react";
import {
  Lock,
  ChevronDown,
  ArrowRight,
  Plus,
  LogOut,
  Zap,
  Flag,
  RefreshCw,
  Building2,
  Briefcase,
  GraduationCap,
  Landmark,
  Factory,
  Rocket,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { ClientData, ClientType } from "./portalDemoData";
import { CLIENT_TYPE_OPTIONS } from "./portalDemoData";

interface PortalHeaderProps {
  data: ClientData;
  onClientTypeChange: (type: ClientType) => void;
  onNewRequest: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Briefcase,
  GraduationCap,
  Landmark,
  Factory,
  Rocket,
};

export default function PortalHeader({ data, onClientTypeChange, onNewRequest }: PortalHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOption = CLIENT_TYPE_OPTIONS.find((o) => o.type === data.type);

  return (
    <div className="glass-card-featured p-8 md:p-12">
      <div className="top-accent-line absolute top-0 left-0 right-0" />

      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="btn-ghost h-7 px-3 text-xs gap-1.5 cursor-default">
            <Lock className="w-3.5 h-3.5" />
            Secure Workspace
          </span>
          <StatusBadge variant="info">{data.stage} Stage</StatusBadge>
          <StatusBadge variant="active" pulse>Active</StatusBadge>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn-secondary h-9 px-4 text-sm gap-2"
            >
              {selectedOption && (
                <>
                  {(() => {
                    const IconComp = iconMap[selectedOption.icon];
                    return IconComp ? <IconComp className="w-4 h-4" /> : null;
                  })()}
                  {selectedOption.label}
                </>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-2 left-0 z-50 w-60 rounded-2xl border border-white/[0.12] bg-[rgba(255,255,255,0.06)] backdrop-blur-xl shadow-dropdown p-2 animate-fade-in">
                {CLIENT_TYPE_OPTIONS.map((option) => {
                  const IconComp = iconMap[option.icon];
                  const isSelected = option.type === data.type;
                  return (
                    <button
                      key={option.type}
                      onClick={() => {
                        onClientTypeChange(option.type);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                        isSelected
                          ? "bg-white/[0.05] border-l-2 border-l-[#178BFF]"
                          : "hover:bg-white/[0.08] border-l-2 border-l-transparent"
                      }`}
                    >
                      {IconComp && <IconComp className={`w-[18px] h-[18px] flex-shrink-0 ${isSelected ? "text-[#F8FAFC]" : "text-[#A1A1AA]"}`} />}
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${isSelected ? "text-[#F8FAFC]" : "text-[#A1A1AA]"}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-[#71717A] truncate">{option.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button className="btn-primary h-9 px-4 text-sm gap-2">
            Enter Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Identity */}
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl md:text-[2.5rem] font-bold text-[#F8FAFC] tracking-tight leading-tight">
          {data.name}
        </h1>
        <p className="text-lg text-[#A1A1AA]">{data.subtitle}</p>
        <div className="flex items-center gap-2 text-sm text-[#71717A]">
          <Zap className="w-3.5 h-3.5" />
          <span>Program: {data.programName}</span>
        </div>
      </div>

      {/* Meta Info Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#71717A] mb-4">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3" />
          <span>Last updated: {data.lastUpdated}</span>
        </div>
        <span className="text-[#52525B]">|</span>
        <div className="flex items-center gap-1.5">
          <Flag className="w-3 h-3" />
          <span>
            Next: {data.nextMilestone.name} — {data.nextMilestone.date}
          </span>
        </div>
      </div>

      {/* Command Statement */}
      <div className="border-l-2 border-[rgba(23,139,255,0.30)] pl-4 mb-6">
        <p className="text-[0.9375rem] text-[#A1A1AA] max-w-[800px] leading-relaxed">
          AI transformation program, governance controls, active projects, and delivery operations in one secure workspace.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onNewRequest} className="btn-secondary h-9 px-4 text-sm gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </button>
        <button className="btn-ghost h-9 px-4 text-sm gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
