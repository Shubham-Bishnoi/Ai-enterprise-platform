import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Hammer, Factory, FileText, LayoutGrid, Monitor, GraduationCap, University, ClipboardCheck, Gem, ShoppingBag, TowerControl, ArrowRight, Sparkles
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { trackAnalyticsEvent } from '@/lib/api/analyticsApi';
import { fetchPlatforms } from '@/lib/api/platformsApi';
import { siteContainerClass } from '@/lib/siteContent';

const platformGroups = [
  {
    label: 'Core Platforms',
    color: '#FF3040',
    platforms: [
      { id: 'garage', name: 'Garage', icon: FlaskConical, desc: 'Launch experiments, ideation sprints, and rapid concept validation.', tags: ['Workshops', 'PoC', 'Discovery'] },
      { id: 'foundry', name: 'Foundry', icon: Hammer, desc: 'Industrialize selected opportunities into production-grade solutions.', tags: ['Engineering', 'Productization', 'Build'] },
      { id: 'factory', name: 'Factory', icon: Factory, desc: 'Operate scaled AI portfolios with managed delivery and optimization.', tags: ['Scale', 'Operate', 'Govern'] },
    ],
  },
  {
    label: 'Intelligence Platforms',
    color: '#1173BC',
    platforms: [
      { id: 'blueprint', name: 'Blueprint', icon: FileText, desc: 'Generate architecture, operating model, and roadmap recommendations.', tags: ['Strategy', 'Roadmap', 'Design'] },
      { id: 'marketplace', name: 'Marketplace', icon: LayoutGrid, desc: 'Discover reusable agents, accelerators, assets, and packaged offerings.', tags: ['Catalog', 'Assets', 'Reuse'] },
      { id: 'control-center', name: 'Control Center', icon: Monitor, desc: 'Monitor AI systems, governance status, analytics, and health.', tags: ['Dashboard', 'Monitoring', 'Analytics'] },
    ],
  },
  {
    label: 'Industry Platforms',
    color: '#6B5BFF',
    platforms: [
      { id: 'oremesh', name: 'OREMesh', icon: Gem, desc: 'Industry platform for resource and operations intelligence.', tags: ['Mining', 'Energy', 'Operations'] },
      { id: 'retailmesh', name: 'RetailMesh', icon: ShoppingBag, desc: 'Retail-specific data, agents, and operating experiences.', tags: ['Retail', 'Demand', 'Store'] },
      { id: 'telecomverse', name: 'TelecomVerse', icon: TowerControl, desc: 'Telecom-oriented architectures, agents, and operations accelerators.', tags: ['Network', 'Service', 'Automation'] },
    ],
  },
  {
    label: 'Enablement Platforms',
    color: '#10B981',
    platforms: [
      { id: 'ai-academy', name: 'AI Academy', icon: GraduationCap, desc: 'Enable workforce transformation with structured AI learning pathways.', tags: ['Training', 'Upskilling', 'Certification'] },
      { id: 'university-oneverse', name: 'University OneVerse', icon: University, desc: 'University-focused AI ecosystems, learning, and collaboration.', tags: ['Education', 'Research', 'Collaboration'] },
      { id: 'assessment-mesh', name: 'Assessment Mesh', icon: ClipboardCheck, desc: 'Assess readiness, maturity, controls, and transformation conditions.', tags: ['Assessment', 'Maturity', 'Readiness'] },
    ],
  },
];

export default function Platforms() {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(0);

  const [groups, setGroups] = useState(platformGroups);

  const iconMap = useMemo(() => {
    return {
      FlaskConical,
      Hammer,
      Factory,
      FileText,
      LayoutGrid,
      Monitor,
      Gem,
      ShoppingBag,
      TowerControl,
      GraduationCap,
      University,
      ClipboardCheck,
    } as const;
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchPlatforms()
      .then((items) => {
        if (!mounted) return;
        if (!items || items.length === 0) return;
        const grouped: Record<string, { label: string; color: string; platforms: any[] }> = {};
        items.forEach((p) => {
          const meta = (p.metadata || {}) as Record<string, any>;
          const groupLabel = meta.group || 'Platforms';
          const groupColor = meta.group_color || p.ui_color || '#1173BC';
          if (!grouped[groupLabel]) grouped[groupLabel] = { label: groupLabel, color: groupColor, platforms: [] };
          const Icon = (iconMap as Record<string, any>)[p.ui_icon || ''] || FileText;
          grouped[groupLabel].platforms.push({
            id: p.slug,
            name: p.name,
            icon: Icon,
            desc: p.description,
            tags: p.tags || [],
          });
        });
        const nextGroups = Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label));
        setGroups(nextGroups.length > 0 ? nextGroups : platformGroups);
        setSelectedGroup(0);
        setSelectedPlatform(0);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [iconMap]);

  const group = groups[selectedGroup] || groups[0];
  const platform = group?.platforms?.[selectedPlatform] || group?.platforms?.[0];

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Platforms"
        title={<>GFF AI <GradientText>Platforms</GradientText></>}
        subtitle="Garage, Foundry, Factory, Blueprint, Marketplace, Control Center, and specialized AI platform ecosystems."
        intro="The platform portfolio provides reusable environments for innovation, productization, operations, training, and industry acceleration."
        actions={
          <>
            <CTAButton to="/build">Build With GFF</CTAButton>
            <CTAButton to="/contact" variant="secondary">Contact Platform Team</CTAButton>
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          {/* Group Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {groups.map((g, i) => (
              <button
                key={g.label}
                onClick={() => { setSelectedGroup(i); setSelectedPlatform(0); }}
                className="rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300"
                style={{
                  borderColor: selectedGroup === i ? `${g.color}40` : 'var(--border-default)',
                  backgroundColor: selectedGroup === i ? `${g.color}08` : 'var(--chip-bg)',
                  color: selectedGroup === i ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.label}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedGroup}-${selectedPlatform}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_0.4fr]">
                {/* Platform Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.platforms.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPlatform(i);
                        trackAnalyticsEvent({
                          eventName: 'content_clicked',
                          source: 'platforms_page',
                          component: 'Platforms',
                          payload: { slug: p.id, title: p.name, group: group.label },
                        });
                      }}
                      className="rounded-[24px] border p-6 text-left transition-all duration-300"
                      style={{
                        backgroundColor: selectedPlatform === i ? `${group.color}08` : 'var(--bg-glass)',
                        borderColor: selectedPlatform === i ? `${group.color}40` : 'var(--border-default)',
                        boxShadow: selectedPlatform === i ? `0 0 40px ${group.color}10` : 'none',
                      }}
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: selectedPlatform === i ? `${group.color}15` : 'var(--chip-bg)' }}
                      >
                        <p.icon className="h-5 w-5" style={{ color: selectedPlatform === i ? group.color : 'var(--text-secondary)' }} />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border px-2.5 py-0.5 text-[11px] font-mono"
                            style={{ borderColor: `${group.color}20`, backgroundColor: `${group.color}08`, color: 'var(--text-muted)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Platform Detail */}
                <div
                  className="rounded-[28px] border p-6 lg:p-8"
                  style={{
                    backgroundColor: 'var(--bg-glass)',
                    borderColor: 'var(--border-default)',
                    boxShadow: `inset 0 1px 0 0 ${group.color}15`,
                  }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${group.color}15` }}
                  >
                    <platform.icon className="h-8 w-8" style={{ color: group.color }} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{platform.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{platform.desc}</p>
                  <div className="mt-6 space-y-3">
                    {platform.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Sparkles className="h-3.5 w-3.5" style={{ color: group.color }} />
                        {tag}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <CTAButton to="/contact">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </CTAButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Ecosystem Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-[28px] border p-8 text-center"
            style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
          >
            <h3 className="font-display text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Platform Ecosystem Map</h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {platformGroups.map((g) => (
                <div key={g.label} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{g.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {platformGroups.flatMap((g) => g.platforms).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-full border px-4 py-2"
                  style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)' }}
                >
                  <p.icon className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
