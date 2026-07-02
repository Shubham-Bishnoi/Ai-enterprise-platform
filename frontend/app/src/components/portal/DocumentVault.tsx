import { FileText, Table, Presentation, Download, ExternalLink, Upload } from "lucide-react";
import type { DocumentData } from "./portalDemoData";
import { useIntersectionEntrance } from "@/hooks/useIntersectionEntrance";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";

interface DocumentVaultProps {
  documents: DocumentData[];
}

const typeIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: Table,
  PPTX: Presentation,
};

const typeColors: Record<string, string> = {
  PDF: "#EF4444",
  DOCX: "#178BFF",
  XLSX: "#22C55E",
  PPTX: "#F59E0B",
};

const statusBadgeClass: Record<string, string> = {
  Ready: "status-badge-active",
  Draft: "status-badge-warning",
  Generating: "status-badge-info",
  Review: "status-badge-warning",
};

export default function DocumentVault({ documents }: DocumentVaultProps) {
  const { ref, isVisible } = useIntersectionEntrance(0.1);
  const delays = useStaggeredEntrance(documents.length, 0, 60);
  const readyCount = documents.filter((doc) => doc.status === "Ready").length;
  const draftCount = documents.filter((doc) => doc.status === "Draft").length;
  const reviewCount = documents.filter((doc) => doc.status === "Review").length;

  return (
    <div ref={ref} className="glass-card flex h-full flex-col p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">Document Vault</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="micro-label hidden sm:inline">{documents.length} documents</span>
          <button className="btn-secondary h-8 px-3 text-xs gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      </div>

      <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 md:grid-cols-2">
        {documents.map((doc, index) => {
          const TypeIcon = typeIcons[doc.type] || FileText;
          const color = typeColors[doc.type] || "#A1A1AA";

          return (
            <div
              key={doc.name}
              className="flex h-full items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 cursor-pointer transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] hover:-translate-y-px"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delays[index]}ms, transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delays[index]}ms, border-color 200ms ease, background 200ms ease`,
              }}
            >
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <TypeIcon className="w-5 h-5" style={{ color }} />
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col">
                <h4 className="text-sm font-semibold text-[#F8FAFC] truncate">{doc.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="micro-label">{doc.type}</span>
                  <span className={statusBadgeClass[doc.status]}>{doc.status}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-[0.6875rem] font-mono-data text-[#71717A]">
                    Updated {doc.updated}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-[0.75rem] text-[#71717A] hover:text-[#A1A1AA] transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Open
                    </button>
                    <button className="text-[0.75rem] text-[#71717A] hover:text-[#A1A1AA] transition-colors flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="font-mono-data text-lg font-semibold text-[#F8FAFC]">{readyCount}</div>
          <span className="micro-label">Ready</span>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="font-mono-data text-lg font-semibold text-[#F8FAFC]">{draftCount}</div>
          <span className="micro-label">Draft</span>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="font-mono-data text-lg font-semibold text-[#F8FAFC]">{reviewCount}</div>
          <span className="micro-label">Review</span>
        </div>
      </div>
    </div>
  );
}
