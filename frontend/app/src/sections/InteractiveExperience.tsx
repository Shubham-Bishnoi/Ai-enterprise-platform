import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Compass,
  FileText,
  Gauge,
  Layers3,
  MessageSquare,
  Percent,
  Zap,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router';
import { interactiveExperienceCards, siteContainerClass } from '@/lib/siteContent';

const iconMap = {
  'Talk to Agent': MessageSquare,
  'Blueprint Generator': FileText,
  'AI Readiness': Gauge,
  'ROI Calculator': Percent,
  Marketplace: Layers3,
  'Foundry Studio': Compass,
} as const;

const cardStatus = [
  { label: 'Live', color: '#10B981', pulse: true },
  { label: 'Live', color: '#10B981', pulse: true },
  { label: 'Beta', color: '#F59E0B', pulse: false },
  { label: 'Beta', color: '#F59E0B', pulse: false },
  { label: 'Active', color: '#3B82F6', pulse: true },
  { label: 'Preview', color: '#8B5CF6', pulse: false },
];

export default function InteractiveExperience() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const primaryCards = [0, 1]; // Talk to Agent and Blueprint Generator

  return (
    <section id="interactive-experience" className="relative py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 100%, rgba(17,115,188,0.08), transparent 45%), radial-gradient(circle at 30% 0%, rgba(154,0,3,0.05), transparent 35%)',
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
              <Radio className="h-3.5 w-3.5" />
              Interactive Experience
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Interactive <span className="text-gradient">AI Experience</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Start with a conversation, generate a blueprint, assess readiness, calculate ROI, or explore the GFF AI platform ecosystem.
            </motion.p>
          </div>

          {/* Start Here Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: 'rgba(16,185,129,0.3)', backgroundColor: 'var(--status-green-bg)' }}
          >
            <Zap className="h-4 w-4" style={{ color: 'var(--status-green-text)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--status-green-text)' }}>Start here</span>
          </motion.div>
        </div>

        {/* Command Center Grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {interactiveExperienceCards.map((item, index) => {
            const Icon = iconMap[item.title as keyof typeof iconMap] ?? Compass;
            const isPrimary = primaryCards.includes(index);
            const isHovered = hoveredIndex === index;
            const status = cardStatus[index];

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link to={item.link} className="block h-full">
                  <div
                    className="group relative h-full overflow-hidden rounded-[24px] border transition-all duration-500"
                    style={{
                      backgroundColor: isPrimary
                        ? isHovered ? `${item.accent}10` : 'var(--bg-glass-strong)'
                        : isHovered ? `${item.accent}08` : 'var(--bg-glass)',
                      borderColor: isPrimary
                        ? isHovered ? `${item.accent}50` : `${item.accent}30`
                        : isHovered ? `${item.accent}40` : 'var(--border-default)',
                      boxShadow: isHovered ? `0 0 40px ${item.accent}12` : 'none',
                      padding: '28px',
                    }}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-1.5 rounded-full border px-2.5 py-1" style={{ borderColor: `${status.color}30`, backgroundColor: `${status.color}10` }}>
                          {status.pulse && (
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: status.color }} />
                              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
                            </span>
                          )}
                          {!status.pulse && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />}
                          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: status.color }}>{status.label}</span>
                        </div>
                      </div>

                      {isPrimary && (
                        <div className="rounded-full border px-2.5 py-1" style={{ borderColor: 'var(--chip-border)', backgroundColor: 'var(--chip-bg)' }}>
                          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Primary Path</span>
                        </div>
                      )}
                    </div>

                    {/* Icon & Content */}
                    <div className="mt-6">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500"
                        style={{
                          borderColor: isHovered ? `${item.accent}40` : 'var(--border-default)',
                          backgroundColor: isHovered ? `${item.accent}12` : 'var(--chip-bg)',
                        }}
                      >
                        <Icon className="h-5 w-5 transition-colors duration-300" style={{ color: isHovered ? item.accent : 'var(--text-secondary)' }} />
                      </div>

                      <h3 className="mt-5 font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3">
                      <span style={{ color: item.accent }}>{isPrimary ? 'Go to section' : 'Explore'}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: item.accent }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
