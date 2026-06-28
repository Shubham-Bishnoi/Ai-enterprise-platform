import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Radio, FileText, Briefcase, LayoutGrid, Video, Presentation, Calendar, Code, Download,
  ArrowRight, Clock, Search, Library, Sparkles
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { siteContainerClass } from '@/lib/siteContent';

const resourceTypes = [
  { id: 'all', label: 'All', icon: Library },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'research', label: 'Research', icon: Radio },
  { id: 'whitepapers', label: 'Whitepapers', icon: FileText },
  { id: 'case-studies', label: 'Case Studies', icon: Briefcase },
  { id: 'architecture', label: 'Architecture', icon: LayoutGrid },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'webinars', label: 'Webinars', icon: Presentation },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'developer', label: 'Developer', icon: Code },
  { id: 'downloads', label: 'Downloads', icon: Download },
];

const resources = [
  { title: 'Agentic AI Operating Model', type: 'research', desc: 'How enterprises should organize agents, humans, controls, and AI operations.', date: '2024', readTime: '8 min', featured: true },
  { title: 'AI Governance for Enterprises', type: 'whitepapers', desc: 'Controls, audit trails, risk systems, and responsible AI practices for production AI.', date: '2024', readTime: '12 min', featured: false },
  { title: 'Building Enterprise Agent Factories', type: 'architecture', desc: 'A practical model for designing, testing, deploying, and operating AI agents.', date: '2024', readTime: '15 min', featured: true },
  { title: 'Knowledge Graphs for AI Transformation', type: 'blog', desc: 'Why enterprise memory, context, and structured knowledge matter for scalable AI.', date: '2024', readTime: '6 min', featured: false },
  { title: 'Banking AI Transformation Guide', type: 'case-studies', desc: 'Reference patterns for banking AI transformation programs.', date: '2024', readTime: '10 min', featured: false },
  { title: 'AI Readiness Assessment Framework', type: 'whitepapers', desc: 'Evaluate enterprise readiness across data, governance, and architecture dimensions.', date: '2024', readTime: '14 min', featured: false },
  { title: 'University AI Lab Blueprint', type: 'architecture', desc: 'Architecture and operating model for university AI innovation labs.', date: '2024', readTime: '11 min', featured: false },
  { title: 'Manufacturing Operations Intelligence', type: 'case-studies', desc: 'Plant copilots, predictive maintenance, and quality intelligence reference.', date: '2024', readTime: '9 min', featured: false },
  { title: 'AI Agent Security Patterns', type: 'developer', desc: 'Security architectures for enterprise AI agent deployments.', date: '2024', readTime: '13 min', featured: false },
  { title: 'ROI Calculator Template', type: 'downloads', desc: 'Structured template for estimating AI transformation ROI.', date: '2024', readTime: '5 min', featured: false },
];

const typeColors: Record<string, string> = {
  blog: '#10B981',
  research: '#FF3040',
  whitepapers: '#1173BC',
  'case-studies': '#6B5BFF',
  architecture: '#FF9F1A',
  videos: '#C03C85',
  webinars: '#00A3FF',
  events: '#A855F7',
  developer: '#10B981',
  downloads: '#475467',
};

export default function Resources() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = resources.filter((r) => {
    const matchesType = filter === 'all' || r.type === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const featured = filtered.filter((r) => r.featured);
  const rest = filtered.filter((r) => !r.featured);

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Resources"
        title={<>Research & <GradientText>Knowledge Hub</GradientText></>}
        subtitle="Research, architecture libraries, case studies, videos, webinars, and developer resources for enterprise AI."
        intro="The resource library brings thought leadership and implementation assets together for executive, architecture, and delivery audiences."
        actions={
          <>
            <CTAButton to="/contact">Contact GFF AI</CTAButton>
            <CTAButton to="/platforms" variant="secondary">Explore Platforms</CTAButton>
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {resourceTypes.slice(0, 6).map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilter(type.id)}
                  className="rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300"
                  style={{
                    borderColor: filter === type.id ? 'var(--gff-blue)' : 'var(--border-default)',
                    backgroundColor: filter === type.id ? 'rgba(17,115,188,0.08)' : 'var(--chip-bg)',
                    color: filter === type.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Resources */}
          {featured.length > 0 && (
            <div className="mb-10">
              <h3 className="mb-4 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Featured</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {featured.map((r, i) => (
                  <motion.div
                    key={r.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-[24px] border p-6 transition-all duration-300 hover:scale-[1.01]"
                    style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="rounded-full border px-3 py-1 text-[10px] font-mono uppercase"
                        style={{ borderColor: `${typeColors[r.type]}25`, backgroundColor: `${typeColors[r.type]}08`, color: typeColors[r.type] }}
                      >
                        {r.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="h-3 w-3" />{r.readTime}
                      </span>
                    </div>
                    <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{r.title}</h4>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
                    <button className="mt-4 flex items-center gap-2 text-sm font-medium" style={{ color: typeColors[r.type] }}>
                      Read <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Resource Grid */}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-[20px] border p-5 transition-all duration-300 hover:border-[var(--border-hover)]"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase"
                    style={{ borderColor: `${typeColors[r.type]}20`, backgroundColor: `${typeColors[r.type]}06`, color: typeColors[r.type] }}
                  >
                    {r.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="h-3 w-3" />{r.readTime}
                  </span>
                </div>
                <h4 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>{r.title}</h4>
                <p className="mt-2 text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="mx-auto h-10 w-10 mb-4" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
