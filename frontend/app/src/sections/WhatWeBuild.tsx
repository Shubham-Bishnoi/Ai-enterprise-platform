import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Building2,
  Factory,
  FlaskConical,
  Network,
  Settings2,
  ShieldCheck,
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
  'AI Governance': ShieldCheck,
  'AI Labs': FlaskConical,
  'AI Factory': Factory,
  'AI Marketplace': Network,
  'AI Operations': Settings2,
} as const;

const statusMap: Record<string, string> = {
  'AI Strategy': 'DISCOVER',
  'AI Engineering': 'BUILD',
  'Agentic AI': 'ORCHESTRATE',
  'AI Governance': 'GOVERN',
  'AI Labs': 'EXPERIMENT',
  'AI Factory': 'PRODUCTION',
  'AI Marketplace': 'DEPLOY',
  'AI Operations': 'OPERATE',
};

const outcomeMap: Record<string, string> = {
  'AI Strategy': 'Prioritized transformation roadmap and operating model.',
  'AI Engineering': 'Production-ready AI systems, integrations, and platforms.',
  'Agentic AI': 'Autonomous workflow agents with measurable execution paths.',
  'AI Governance': 'Trusted AI controls, compliance, oversight, and audit readiness.',
  'AI Labs': 'Rapid experimentation environment for validated AI prototypes.',
  'AI Factory': 'Repeatable deployment engine for enterprise-scale AI systems.',
  'AI Marketplace': 'Reusable agent catalog, accelerators, and solution templates.',
  'AI Operations': 'Managed monitoring, governance, optimization, and continuous improvement.',
};

const accentMap: Record<string, { solid: string; gradient: string }> = {
  'AI Strategy': { solid: '#EF233C', gradient: 'linear-gradient(135deg, rgba(239,35,60,0.65), rgba(239,35,60,0.12))' },
  'AI Engineering': { solid: '#F59E0B', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.65), rgba(245,158,11,0.12))' },
  'Agentic AI': { solid: '#178BFF', gradient: 'linear-gradient(135deg, rgba(23,139,255,0.65), rgba(23,139,255,0.12))' },
  'AI Governance': { solid: '#22C55E', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.6), rgba(34,197,94,0.12))' },
  'AI Labs': { solid: '#A855F7', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.65), rgba(168,85,247,0.12))' },
  'AI Factory': { solid: '#0EA5E9', gradient: 'linear-gradient(135deg, rgba(14,165,233,0.65), rgba(14,165,233,0.12))' },
  'AI Marketplace': { solid: '#C026D3', gradient: 'linear-gradient(135deg, rgba(192,38,211,0.65), rgba(192,38,211,0.12))' },
  'AI Operations': { solid: '#178BFF', gradient: 'linear-gradient(135deg, rgba(239,35,60,0.6), rgba(23,139,255,0.55))' },
};

function hexWithAlpha(hex: string, alphaHex: string): string {
  if (!hex.startsWith('#')) return hex;
  if (hex.length === 4) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}${alphaHex}`;
  }
  if (hex.length === 7) return `${hex}${alphaHex}`;
  return hex;
}

export default function WhatWeBuild() {
  const linksByTitle = Object.fromEntries(homeWhatWeBuildCards.map((card) => [card.title, card.link]));
  const modules = [
    { title: 'AI Strategy', index: '01' },
    { title: 'AI Engineering', index: '02' },
    { title: 'Agentic AI', index: '03' },
    { title: 'AI Governance', index: '04' },
    { title: 'AI Labs', index: '05' },
    { title: 'AI Factory', index: '06' },
    { title: 'AI Marketplace', index: '07' },
    { title: 'AI Operations', index: '08' },
  ].map((module) => {
    const card = homeWhatWeBuildCards.find((item) => item.title === module.title);
    return {
      ...module,
      description: card?.description ?? '',
      link: (linksByTitle[module.title] as string | undefined) ?? '/capabilities',
      status: statusMap[module.title],
      outcome: outcomeMap[module.title],
      accent: accentMap[module.title],
      Icon: iconMap[module.title as keyof typeof iconMap] ?? BrainCircuit,
    };
  });

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

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module, index) => {
            const isLast = index === modules.length - 1;

            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="relative"
              >
                <Link to={module.link} className="group relative block h-full">
                  <span
                    className="pointer-events-none absolute right-[-7px] top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full border border-white/20 opacity-60 transition-opacity duration-500 group-hover:opacity-100 xl:block"
                    style={{
                      background: module.accent.gradient,
                      boxShadow: `0 0 0 6px ${hexWithAlpha(module.accent.solid, '14')}, 0 0 26px ${hexWithAlpha(module.accent.solid, '7a')}`,
                      opacity: isLast ? 0 : undefined,
                    }}
                  />

                  <div className="relative h-full rounded-[24px] p-px transition-transform duration-500 will-change-transform group-hover:-translate-y-1.5">
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: module.accent.gradient }}
                    />
                    <div className="relative flex h-full min-h-[410px] flex-col overflow-hidden rounded-[23px] border border-white/10 bg-[rgba(255,255,255,0.035)] p-7 backdrop-blur-xl lg:min-h-[430px]">
                      <div
                        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(650px circle at 50% 35%, ${hexWithAlpha(module.accent.solid, '22')}, transparent 60%), radial-gradient(900px circle at 0% 0%, rgba(255,255,255,0.06), transparent 52%), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.55))`,
                        }}
                      />

                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-80"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))',
                        }}
                      />

                      <div className="relative flex items-start justify-between">
                        <div className="text-[42px] font-mono tracking-[0.18em] text-white/12">{module.index}</div>
                        <div
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-white/70"
                          style={{
                            color: module.accent.solid,
                            boxShadow: `0 0 18px ${hexWithAlpha(module.accent.solid, '22')}`,
                          }}
                        >
                          {module.status}
                        </div>
                      </div>

                      <div className="relative mt-5 flex flex-1 flex-col items-center justify-center text-center">
                        <div
                          className="pointer-events-none absolute -top-10 h-44 w-44 rounded-full blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                          style={{ backgroundColor: hexWithAlpha(module.accent.solid, '2e') }}
                        />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                          <module.Icon
                            aria-hidden="true"
                            className="h-9 w-9"
                            style={{
                              color: module.accent.solid,
                              filter: `drop-shadow(0 0 18px ${hexWithAlpha(module.accent.solid, '88')})`,
                            }}
                          />
                        </div>

                        <h3 className="mt-6 text-sm font-display font-bold tracking-[0.3em] text-white/90 transition-colors duration-500 group-hover:text-white">
                          {module.title.toUpperCase()}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">{module.description}</p>
                      </div>

                      <div className="relative mt-6 h-px w-full bg-white/10" />

                      <div className="relative mt-5 flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono uppercase tracking-[0.26em] text-white/55">Outcome</div>
                          <div className="mt-2 text-sm leading-relaxed text-white/80">{module.outcome}</div>
                        </div>

                        <div
                          className="mb-[2px] inline-flex shrink-0 items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/60 transition-all duration-500 group-hover:gap-3 group-hover:text-white"
                          style={{ textShadow: `0 0 18px ${hexWithAlpha(module.accent.solid, '2a')}` }}
                        >
                          Explore
                          <ArrowRight
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                            style={{ color: module.accent.solid }}
                          />
                        </div>
                      </div>
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
