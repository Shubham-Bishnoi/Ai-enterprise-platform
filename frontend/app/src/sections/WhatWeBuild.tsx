import { motion } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Factory,
  FlaskConical,
  Gavel,
  Network,
  Settings2,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard, SectionHeader } from '@/components/shared';
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
  return (
    <section id="what-we-build" className="py-20 lg:py-24">
      <div className={siteContainerClass}>
        <SectionHeader
          eyebrow="What We Build"
          title="What We Build"
          subtitle="Enterprise AI capabilities, platforms, and operating systems for the next generation of intelligent companies."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {homeWhatWeBuildCards.map((item, index) => {
            const Icon = iconMap[item.title as keyof typeof iconMap] ?? BrainCircuit;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link to={item.link} className="block h-full">
                  <GlassCard className="h-full rounded-[28px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7" glow="gradient">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
                      style={{ boxShadow: `0 0 24px ${item.accent}22` }}
                    >
                      <Icon className="h-5 w-5 text-white" style={{ color: item.accent }} />
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/85">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
