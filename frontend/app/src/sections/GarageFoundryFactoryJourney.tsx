import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CTAButton, GlassCard, SectionHeader } from '@/components/shared';
import { garageFoundryFactoryJourney, siteContainerClass } from '@/lib/siteContent';

export default function GarageFoundryFactoryJourney() {
  return (
    <section id="garage-foundry-factory" className="relative overflow-hidden py-20 lg:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,115,188,0.03)_0%,rgba(0,0,0,0)_100%)]" />
      <div className={siteContainerClass}>
        <SectionHeader
          eyebrow="Journey"
          title="Garage"
          highlight="→ Foundry → Factory"
          subtitle="From AI discovery to engineered systems to enterprise-scale operations."
        />

        <div className="relative mt-12">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-[#ff3040]/50 via-[#1173bc]/40 to-[#6b5bff]/30 md:hidden" />
          <div className="absolute left-0 right-0 top-20 hidden h-px bg-gradient-to-r from-[#ff3040]/35 via-[#1173bc]/35 to-[#6b5bff]/35 xl:block" />

          <div className="grid gap-6 xl:grid-cols-6">
            {garageFoundryFactoryJourney.map((stage, index) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className="relative"
              >
                <div className="absolute left-[21px] top-6 h-3 w-3 rounded-full border border-white/20 bg-[#0f0f12] md:hidden" />
                <div className="relative pl-12 md:pl-0">
                  <GlassCard className="h-full rounded-[28px] border-white/[0.08] bg-[#101014]/88 p-6 lg:p-7" glow="gradient">
                    <div className={`absolute inset-x-0 top-0 h-1 rounded-t-[28px] bg-gradient-to-r ${stage.accent}`} />
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                        Stage {index + 1}
                      </span>
                      {index < garageFoundryFactoryJourney.length - 1 && (
                        <ArrowRight className="hidden h-4 w-4 text-white/30 xl:block" />
                      )}
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-bold text-white">{stage.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/72">{stage.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {stage.bullets.map((bullet) => (
                        <span
                          key={bullet}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70"
                        >
                          {bullet}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6">
                      <CTAButton to={stage.link} variant="secondary" className="w-full justify-center">
                        Explore Stage
                      </CTAButton>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
