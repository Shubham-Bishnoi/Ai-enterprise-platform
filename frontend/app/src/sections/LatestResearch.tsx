import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CTAButton, GlassCard, SectionHeader } from '@/components/shared';
import { latestResearchItems, siteContainerClass } from '@/lib/siteContent';

export default function LatestResearch() {
  return (
    <section id="latest-research" className="py-20 lg:py-24">
      <div className={siteContainerClass}>
        <SectionHeader
          eyebrow="Latest Research"
          title="Latest Research & Intelligence"
          subtitle="Ideas, architectures, and operating models for AI-native enterprise transformation."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {latestResearchItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <GlassCard className="h-full rounded-[28px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7" glow="gradient">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                  {item.type}
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>

                <div className="mt-6">
                  <CTAButton to={item.link} variant="secondary" className="w-full justify-between">
                    <span>Read more</span>
                    <ArrowRight className="h-4 w-4" />
                  </CTAButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CTAButton to="/resources">View Resources</CTAButton>
        </div>
      </div>
    </section>
  );
}
