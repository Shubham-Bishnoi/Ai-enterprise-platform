import { HeroSection } from '@/components/home/hero-section'
import { HowGffWorksSection } from '@/components/home/how-gff-works-section'
import { ScrollSequenceSection } from '@/components/home/scroll-sequence-section'
import { QuickSearchSection } from '@/components/home/quick-search-section'
import { JourneySection } from '@/components/home/journey-section'
import { WhatWeBuildSection } from '@/components/home/what-we-build-section'
import { InteractiveExperienceSection } from '@/components/home/interactive-experience-section'
import { TalkToAgentSection } from '@/components/home/talk-to-agent-section'
import { BlueprintSection } from '@/components/home/blueprint-section'
import { GlobalPresenceSection } from '@/components/home/global-presence-section'
import { EnterpriseOutcomesSection } from '@/components/home/enterprise-outcomes-section'
import { LiveDashboardSection } from '@/components/home/live-dashboard-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* Philosophy first: visitors meet Enterprise Intelligence Engineering
          before the visual journey and the interactive tools. */}
      <HowGffWorksSection />
      <ScrollSequenceSection />
      {/* The two live experiences lead, directly after the pinned story. */}
      <TalkToAgentSection />
      <BlueprintSection />
      <QuickSearchSection />
      <JourneySection />
      <WhatWeBuildSection />
      <InteractiveExperienceSection />
      <GlobalPresenceSection />
      <EnterpriseOutcomesSection />
      <LiveDashboardSection />
    </>
  )
}
