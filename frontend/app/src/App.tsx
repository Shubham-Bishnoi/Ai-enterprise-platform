import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router';
import { PageShell } from '@/components/shared/PageShell';
import Build from '@/pages/Build';
import Capabilities from '@/pages/Capabilities';
import Company from '@/pages/Company';
import ContactPage from '@/pages/ContactPage';
import Home from '@/pages/Home';
import Industries from '@/pages/Industries';
import Platforms from '@/pages/Platforms';
import Portal from '@/pages/Portal';
import Resources from '@/pages/Resources';
import WhyGffAi from '@/pages/WhyGffAi';

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const targetId = decodeURIComponent(location.hash.slice(1));

    const scrollToHashTarget = () => {
      if (cancelled) return;

      const element = document.getElementById(targetId);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        window.setTimeout(scrollToHashTarget, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const timer = window.setTimeout(scrollToHashTarget, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollManager />
      <PageShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/why-gff-ai" element={<WhyGffAi />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/platforms" element={<Platforms />} />
          <Route path="/build" element={<Build />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portal" element={<Portal />} />
        </Routes>
      </PageShell>
    </HashRouter>
  );
}
