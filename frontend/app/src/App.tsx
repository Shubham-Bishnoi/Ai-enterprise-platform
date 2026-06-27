import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
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
    const timer = window.setTimeout(() => {
      if (location.hash) {
        const element = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
