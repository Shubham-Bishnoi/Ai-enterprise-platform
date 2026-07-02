import { useState, useCallback } from "react";
import "./PremiumClientPortal.css";
import type { ClientType } from "./portalDemoData";
import { getClientData } from "./portalDemoData";
import PortalHeader from "./PortalHeader";
import ExecutiveSnapshot from "./ExecutiveSnapshot";
import TransformationRoadmap from "./TransformationRoadmap";
import AIOperationsCockpit from "./AIOperationsCockpit";
import ProjectCommandBoard from "./ProjectCommandBoard";
import GovernanceCenter from "./GovernanceCenter";
import DocumentVault from "./DocumentVault";
import ActivityAndSupport from "./ActivityAndSupport";
import NextActions from "./NextActions";

export interface PremiumClientPortalProps {
  initialClientType?: ClientType;
  demoMode?: boolean;
  onDemoLogin?: (clientType: ClientType) => void;
  onNewRequest?: () => void;
  onActionClick?: (action: string) => void;
}

export default function PremiumClientPortal({
  initialClientType = "banking",
  onDemoLogin,
  onNewRequest,
  onActionClick,
}: PremiumClientPortalProps) {
  const [clientType, setClientType] = useState<ClientType>(initialClientType);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const clientData = getClientData(clientType);

  const handleClientTypeChange = useCallback(
    (type: ClientType) => {
      if (type === clientType) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setClientType(type);
        onDemoLogin?.(type);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    },
    [clientType, onDemoLogin]
  );

  return (
    <main className="premium-client-portal relative min-h-screen overflow-hidden bg-[#030305] text-white">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dot Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Ambient Glows */}
        <div
          className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] rounded-full animate-ambient-drift"
          style={{
            background: "radial-gradient(circle, rgba(239,35,60,0.06) 0%, transparent 60%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full animate-ambient-drift"
          style={{
            background: "radial-gradient(circle, rgba(23,139,255,0.05) 0%, transparent 60%)",
            filter: "blur(100px)",
            animationDelay: "-7s",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full animate-ambient-drift"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 60%)",
            filter: "blur(100px)",
            animationDelay: "-14s",
          }}
        />
        {/* Scanline Texture */}
        <div
          className="absolute top-0 left-0 right-0 h-[30vh]"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-14 pt-24 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-28">
        {/* Portal Header */}
        <PortalHeader
          data={clientData}
          onClientTypeChange={handleClientTypeChange}
          onNewRequest={onNewRequest || (() => {})}
        />

        {/* Transition overlay */}
        {isTransitioning && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#030305]/80 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#178BFF] rounded-full animate-spin" />
          </div>
        )}

        {/* Dashboard Content */}
        <div
          key={clientType}
          className={`mt-6 space-y-6 transition-all duration-400 lg:mt-8 lg:space-y-8 ${
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
          style={{ transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Executive Snapshot */}
          <ExecutiveSnapshot metrics={clientData.metrics} />

          {/* Bento Row 1: Roadmap + Operations */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <TransformationRoadmap
                data={clientData.roadmap}
                stageDescription={clientData.stageDescription}
              />
            </div>
            <div className="lg:col-span-5">
              <AIOperationsCockpit data={clientData.operations} />
            </div>
          </div>

          {/* Bento Row 2: Projects + Governance */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ProjectCommandBoard projects={clientData.projects} />
            </div>
            <div className="lg:col-span-4">
              <GovernanceCenter data={clientData.governance} />
            </div>
          </div>

          {/* Bento Row 3: Documents + Activity/Support */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <DocumentVault documents={clientData.documents} />
            </div>
            <div className="lg:col-span-5">
              <ActivityAndSupport
                activities={clientData.activities}
                support={clientData.support}
              />
            </div>
          </div>

          {/* Next Actions */}
          <NextActions actions={clientData.actions} onActionClick={onActionClick} />
        </div>
      </div>
    </main>
  );
}
