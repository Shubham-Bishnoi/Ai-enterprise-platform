import { useEffect } from 'react';
import Hero from '../sections/Hero';
import QuickSearch from '../sections/QuickSearch';
import GarageFoundryFactoryJourney from '../sections/GarageFoundryFactoryJourney';
import WhatWeBuild from '../sections/WhatWeBuild';
import InteractiveExperience from '../sections/InteractiveExperience';
import GlobalPresence from '../sections/GlobalPresence';
import ClientSuccess from '../sections/ClientSuccess';
import LiveDashboard from '../sections/LiveDashboard';
import LatestResearch from '../sections/LatestResearch';
import TalkToAgent from '../sections/TalkToAgent';
import BlueprintGenerator from '../sections/BlueprintGenerator';

export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">
      <Hero />
      <TalkToAgent />
      <BlueprintGenerator />
      <QuickSearch />
      <GarageFoundryFactoryJourney />
      <WhatWeBuild />
      <InteractiveExperience />
      <GlobalPresence />
      <ClientSuccess />
      <LiveDashboard />
      <LatestResearch />
    </main>
  );
}
