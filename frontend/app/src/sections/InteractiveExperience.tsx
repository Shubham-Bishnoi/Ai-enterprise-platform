import { motion } from 'framer-motion';
import { ArrowRight, Compass, FileText, Gauge, Layers3, MessageSquare, Percent } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard, SectionHeader } from '@/components/shared';
import { interactiveExperienceCards, siteContainerClass } from '@/lib/siteContent';

const iconMap = {
  'Talk to Agent': MessageSquare,
  'Blueprint Generator': FileText,
  'AI Readiness': Gauge,
  'ROI Calculator': Percent,
  Marketplace: Layers3,
  'Foundry Studio': Compass,
} as const;

export default function InteractiveExperience() {
  return (
    <section id="interactive-experience" className="py-20 lg:py-24">
      <div className={siteContainerClass}>
        <SectionHeader
          eyebrow="Interactive Experience"
          title="Interactive AI Experience"
          subtitle="Start with a conversation, generate a blueprint, assess readiness, calculate ROI, or explore the GFF AI platform ecosystem."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {interactiveExperienceCards.map((item, index) => {
            const Icon = iconMap[item.title as keyof typeof iconMap] ?? Compass;
            const primaryCard = index < 2;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link to={item.link} className="block h-full">
                  <GlassCard
                    className={`h-full rounded-[30px] p-6 lg:p-7 ${
                      primaryCard
                        ? 'border-white/[0.12] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(16,16,20,0.92))]'
                        : 'border-white/[0.09] bg-[#101014]/88'
                    }`}
                    glow="gradient"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
                      style={{ boxShadow: `0 0 28px ${item.accent}22` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: item.accent }} />
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                        {primaryCard ? 'Primary Path' : 'Interactive Tool'}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/85">
                      <span>{primaryCard ? 'Go to section' : 'Explore'}</span>
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
