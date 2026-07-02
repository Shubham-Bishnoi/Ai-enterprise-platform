import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, Shield, Heart, FlaskConical as Flask, Factory, ShoppingCart, GraduationCap, Building2, Pickaxe, Zap, Wifi, FileSearch, Calculator, Scale, Search, LayoutGrid
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { trackAnalyticsEvent } from '@/lib/api/analyticsApi';
import { fetchIndustries } from '@/lib/api/industriesApi';
import { siteContainerClass } from '@/lib/siteContent';

const industries = [
  { id: 'financial-services', name: 'Financial Services', icon: Landmark, color: '#FF3040', challenges: ['Risk complexity', 'Regulatory pressure', 'Legacy systems'], outcomes: ['Faster decisioning', 'Compliance automation', 'Customer intelligence'] },
  { id: 'insurance', name: 'Insurance', icon: Shield, color: '#FF9F1A', challenges: ['Claims processing', 'Fraud detection', 'Underwriting'], outcomes: ['Claims automation', 'Risk accuracy', 'Service speed'] },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: '#FF3040', challenges: ['Care coordination', 'Documentation', 'Operations'], outcomes: ['Care efficiency', 'Clinical support', 'Cost reduction'] },
  { id: 'life-sciences', name: 'Life Sciences', icon: Flask, color: '#1173BC', challenges: ['Research velocity', 'Compliance', 'Commercial ops'], outcomes: ['Research acceleration', 'Regulatory speed', 'Market insight'] },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, color: '#10B981', challenges: ['Quality control', 'Maintenance', 'Supply chain'], outcomes: ['Uptime improvement', 'Quality intelligence', 'Predictive ops'] },
  { id: 'retail', name: 'Retail', icon: ShoppingCart, color: '#6B5BFF', challenges: ['Demand planning', 'Personalization', 'Store ops'], outcomes: ['Demand accuracy', 'Customer insight', 'Store efficiency'] },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#1173BC', challenges: ['Student support', 'Academic ops', 'Digital learning'], outcomes: ['Student success', 'Faculty enablement', 'Learning outcomes'] },
  { id: 'government', name: 'Government', icon: Building2, color: '#C03C85', challenges: ['Service delivery', 'Data security', 'Mission ops'], outcomes: ['Citizen service', 'Secure analytics', 'Mission efficiency'] },
  { id: 'mining', name: 'Mining', icon: Pickaxe, color: '#A855F7', challenges: ['Field operations', 'Asset intelligence', 'Safety'], outcomes: ['Operational safety', 'Asset optimization', 'Field efficiency'] },
  { id: 'energy', name: 'Energy', icon: Zap, color: '#FF9F1A', challenges: ['Network ops', 'Maintenance', 'Risk controls'], outcomes: ['Grid intelligence', 'Predictive maintenance', 'Risk reduction'] },
  { id: 'telecom', name: 'Telecom', icon: Wifi, color: '#00A3FF', challenges: ['Network assurance', 'Customer ops', 'Automation'], outcomes: ['Network reliability', 'Customer satisfaction', 'Service automation'] },
  { id: 'audit', name: 'Audit', icon: FileSearch, color: '#6B5BFF', challenges: ['Evidence workflows', 'Control review', 'Planning'], outcomes: ['Audit efficiency', 'Control coverage', 'Workflow speed'] },
  { id: 'tax', name: 'Tax', icon: Calculator, color: '#10B981', challenges: ['Research complexity', 'Workflow automation', 'Delivery'], outcomes: ['Research speed', 'Automation coverage', 'Client delivery'] },
  { id: 'legal', name: 'Legal', icon: Scale, color: '#C03C85', challenges: ['Matter intelligence', 'Contract workflows', 'Knowledge mgmt'], outcomes: ['Matter efficiency', 'Contract speed', 'Knowledge access'] },
];

export default function Industries() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);
  const [industriesData, setIndustriesData] = useState(industries);

  const iconMap = useMemo(() => {
    return {
      Landmark,
      Shield,
      Heart,
      FlaskConical: Flask,
      Factory,
      ShoppingCart,
      GraduationCap,
      Building2,
      Pickaxe,
      Zap,
      Wifi,
      FileSearch,
      Calculator,
      Scale,
    } as const;
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchIndustries()
      .then((items) => {
        if (!mounted) return;
        if (!items || items.length === 0) return;
        setIndustriesData(
          items.map((ind) => {
            const ui = (ind.ui || {}) as Record<string, any>;
            const Icon = (iconMap as Record<string, any>)[ui.icon || ''] || Landmark;
            const id = ui.slug || ind.slug;
            return {
              id,
              name: ind.name,
              icon: Icon,
              color: ui.color || '#1173BC',
              challenges: (ui.challenges || ind.common_challenges || []).slice(0, 3),
              outcomes: (ui.outcomes || ind.business_outcomes || []).slice(0, 3),
            };
          }),
        );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [iconMap]);

  const filtered = industriesData.filter((ind) =>
    ind.name.toLowerCase().includes(search.toLowerCase())
  );

  const active = filtered[selected] || filtered[0];

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Industries"
        title={<>AI for <GradientText>Industries</GradientText></>}
        subtitle="Industry-specific AI transformation systems, agents, architectures, and operating models."
        intro="Each industry playbook combines domain challenges, target architectures, reference solutions, AI agents, business outcomes, and demo pathways."
        actions={
          <>
            <CTAButton to="/capabilities">See Capabilities</CTAButton>
            <CTAButton to="/contact#book-workshop" variant="secondary">Book Industry Workshop</CTAButton>
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            {/* Industry Selector */}
            <div>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSelected(0); }}
                  placeholder="Search industries..."
                  className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Industry List */}
              <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
                {filtered.map((ind, index) => (
                  <button
                    key={ind.id}
                    onClick={() => {
                      setSelected(index);
                      trackAnalyticsEvent({
                        eventName: 'content_clicked',
                        source: 'industries_page',
                        component: 'Industries',
                        payload: { slug: ind.id, title: ind.name },
                      });
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300"
                    style={{
                      borderColor: selected === index && active?.id === ind.id ? `${ind.color}35` : 'transparent',
                      backgroundColor: selected === index && active?.id === ind.id ? `${ind.color}08` : 'transparent',
                    }}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: selected === index && active?.id === ind.id ? `${ind.color}15` : 'var(--chip-bg)' }}
                    >
                      <ind.icon className="h-4 w-4" style={{ color: selected === index && active?.id === ind.id ? ind.color : 'var(--text-muted)' }} />
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: selected === index && active?.id === ind.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >
                      {ind.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <LayoutGrid className="h-3.5 w-3.5" />
                {filtered.length} industries
              </div>
            </div>

            {/* Industry Detail */}
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="rounded-[28px] border p-6 lg:p-8"
                    style={{
                      backgroundColor: 'var(--bg-glass)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: `${active.color}15` }}
                      >
                        <active.icon className="h-8 w-8" style={{ color: active.color }} />
                      </div>
                      <div>
                        <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{active.name}</h2>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>AI transformation blueprint</p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      {/* Challenges */}
                      <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-elevated)' }}>
                        <h4 className="mb-3 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Challenges</h4>
                        <ul className="space-y-2">
                          {active.challenges.map((c) => (
                            <li key={c} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: active.color }} />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Outcomes */}
                      <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-elevated)' }}>
                        <h4 className="mb-3 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--status-green-text)' }}>Business Outcomes</h4>
                        <ul className="space-y-2">
                          {active.outcomes.map((o) => (
                            <li key={o} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Architecture & CTA */}
                    <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)' }}>
                      <h4 className="mb-2 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Reference Architecture</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Industry-specific agent architecture with domain models, compliance layer, and integration patterns tailored for {active.name.toLowerCase()} operations.
                      </p>
                    </div>

                    <div className="mt-6">
                      <CTAButton to="/contact">Request Demo</CTAButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
