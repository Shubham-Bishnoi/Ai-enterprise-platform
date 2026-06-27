import { useEffect } from 'react';
import Navbar from '../sections/Navbar';
import Hero from '../sections/Hero';
import AIFoundryProcess from '../sections/AIFoundryProcess';
import WhatWeBuild from '../sections/WhatWeBuild';
import IndustrySolutions from '../sections/IndustrySolutions';
import TalkToAgent from '../sections/TalkToAgent';
import BlueprintGenerator from '../sections/BlueprintGenerator';
import AILabs from '../sections/AILabs';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <TalkToAgent />
      <BlueprintGenerator />
      <AIFoundryProcess />
      <WhatWeBuild />
      <IndustrySolutions />
      <AILabs />
      <Contact />
      <Footer />
    </main>
  );
}
