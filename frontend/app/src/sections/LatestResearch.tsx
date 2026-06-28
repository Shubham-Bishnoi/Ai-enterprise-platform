import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, FileText, Library, Radio, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { CTAButton } from '@/components/shared';
import { latestResearchItems, siteContainerClass } from '@/lib/siteContent';

const typeIcons: Record<string, typeof Radio> = {
  'Research': Radio,
  'Whitepaper': FileText,
  'Architecture': Sparkles,
  'Article': BookOpen,
};

const typeColors: Record<string, string> = {
  'Research': '#FF3040',
  'Whitepaper': '#1173BC',
  'Architecture': '#6B5BFF',
  'Article': '#10B981',
};

const filterTypes = ['All', 'Research', 'Whitepaper', 'Architecture', 'Article'];
const readingTimes: Record<string, string> = {
  'Agentic AI Operating Model': '8 min read',
  'AI Governance for Enterprises': '12 min read',
  'Building Enterprise Agent Factories': '15 min read',
  'Knowledge Graphs for AI Transformation': '6 min read',
};

export default function LatestResearch() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? latestResearchItems
    : latestResearchItems.filter((item) => item.type === activeFilter);

  // Featured = first item when showing all
  const featured = activeFilter === 'All' ? latestResearchItems[0] : null;
  const gridItems = activeFilter === 'All' ? filtered.slice(1) : filtered;

  return (
    <section id="latest-research" className="relative py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 80% 30%, rgba(192,60,133,0.06), transparent 40%), radial-gradient(circle at 10% 80%, rgba(17,115,188,0.05), transparent 35%)',
        }}
      />

      <div className={siteContainerClass}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.24em]"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)', color: 'var(--text-secondary)' }}
            >
              <Library className="h-3.5 w-3.5" />
              Latest Research & Intelligence
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Research & <span className="text-gradient">Intelligence</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Ideas, architectures, and operating models for AI-native enterprise transformation.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <CTAButton to="/resources">View All Resources</CTAButton>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className="rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300"
              style={{
                borderColor: activeFilter === type ? 'var(--gff-blue)' : 'var(--border-default)',
                backgroundColor: activeFilter === type ? 'rgba(17,115,188,0.08)' : 'var(--chip-bg)',
                color: activeFilter === type ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {type}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {featured && (
              /* Featured Card */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <Link to={featured.link} className="block">
                  <div
                    className="group relative overflow-hidden rounded-[28px] border transition-all duration-500 lg:grid lg:grid-cols-[1fr_0.6fr]"
                    style={{
                      backgroundColor: 'var(--bg-glass)',
                      borderColor: 'var(--border-default)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${typeColors[featured.type]}40`;
                      e.currentTarget.style.boxShadow = `0 0 60px ${typeColors[featured.type]}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Left content */}
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em]"
                          style={{ borderColor: `${typeColors[featured.type]}30`, backgroundColor: `${typeColors[featured.type]}10`, color: typeColors[featured.type] }}
                        >
                          {(() => {
                            const Icon = typeIcons[featured.type] || Radio;
                            return <Icon className="h-3 w-3" />;
                          })()}
                          {featured.type}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="h-3 w-3" />
                          {readingTimes[featured.title] || '5 min read'}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {featured.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {featured.description}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium" style={{ color: typeColors[featured.type] }}>
                        Read featured article
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Right visual */}
                    <div
                      className="hidden lg:flex items-center justify-center border-l p-8"
                      style={{
                        borderColor: 'var(--border-default)',
                        background: `radial-gradient(circle at center, ${typeColors[featured.type]}08, transparent 70%)`,
                      }}
                    >
                      <div
                        className="flex h-32 w-32 items-center justify-center rounded-3xl border"
                        style={{
                          borderColor: `${typeColors[featured.type]}20`,
                          backgroundColor: `${typeColors[featured.type]}08`,
                        }}
                      >
                        {(() => {
                          const Icon = typeIcons[featured.type] || Radio;
                          return <Icon className="h-16 w-16" style={{ color: `${typeColors[featured.type]}60` }} />;
                        })()}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid Items */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gridItems.map((item, index) => {
                const Icon = typeIcons[item.type] || Radio;
                const color = typeColors[item.type] || '#1173BC';
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.06 }}
                  >
                    <Link to={item.link} className="block h-full">
                      <div
                        className="group h-full overflow-hidden rounded-[24px] border p-6 transition-all duration-500"
                        style={{
                          backgroundColor: 'var(--bg-glass)',
                          borderColor: 'var(--border-default)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-default)';
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
                            style={{ borderColor: `${color}25`, backgroundColor: `${color}08`, color }}
                          >
                            <Icon className="h-2.5 w-2.5" />
                            {item.type}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <Clock className="h-3 w-3" />
                            {readingTimes[item.title] || '5 min read'}
                          </span>
                        </div>
                        <h3 className="mt-5 font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {item.description}
                        </p>
                        <div className="mt-5 flex items-center gap-2 text-sm font-medium" style={{ color }}>
                          Read more
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
