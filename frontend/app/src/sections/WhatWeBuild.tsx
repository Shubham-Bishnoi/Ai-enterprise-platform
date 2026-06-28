import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Building2,
  Factory,
  FlaskConical,
  Gavel,
  Network,
  Settings2,
  Wrench,
  ArrowRight,
  Hexagon,
} from 'lucide-react';
import { Link } from 'react-router';
import { homeWhatWeBuildCards, siteContainerClass } from '@/lib/siteContent';

const iconMap = {
  'AI Strategy': Building2,
  'AI Engineering': Wrench,
  'Agentic AI': BrainCircuit,
  'AI Governance': Gavel,
  'AI Labs': FlaskConical,
  'AI Factory': Factory,
  'AI Marketplace': Network,
  'AI Operations': Settings2,
} as const;

export default function WhatWeBuild() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="what-we-build" className="relative py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(107,91,255,0.06), transparent 45%), radial-gradient(circle at 80% 100%, rgba(154,0,3,0.04), transparent 35%)',
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
              <Hexagon className="h-3.5 w-3.5" />
              What We Build
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              AI Capability <span className="text-gradient">Operating System</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-xl text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Enterprise AI capabilities, platforms, and operating systems for the next generation of intelligent companies.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
              {homeWhatWeBuildCards.length} capability modules
            </span>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {homeWhatWeBuildCards.map((item, index) => {
            const Icon = iconMap[item.title as keyof typeof iconMap] ?? BrainCircuit;
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className={`${index === 0 || index === 3 ? 'md:row-span-2' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link to={item.link} className="block h-full">
                  <div
                    className="group relative h-full overflow-hidden rounded-[24px] border p-6 transition-all duration-500"
                    style={{
                      backgroundColor: isHovered ? `${item.accent}08` : 'var(--bg-glass)',
                      borderColor: isHovered ? `${item.accent}40` : 'var(--border-default)',
                      boxShadow: isHovered ? `0 0 40px ${item.accent}12, 0 8px 32px rgba(0,0,0,0.08)` : 'none',
                      opacity: isAnyHovered && !isHovered ? 0.7 : 1,
                    }}
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute left-0 top-0 h-1 w-full transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                        opacity: isHovered ? 1 : 0,
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500"
                      style={{
                        borderColor: isHovered ? `${item.accent}40` : 'var(--border-default)',
                        backgroundColor: isHovered ? `${item.accent}12` : 'var(--chip-bg)',
                      }}
                    >
                      <Icon
                        className="h-5 w-5 transition-colors duration-300"
                        style={{ color: isHovered ? item.accent : 'var(--text-secondary)' }}
                      />
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3">
                      <span style={{ color: item.accent }}>Explore</span>
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
