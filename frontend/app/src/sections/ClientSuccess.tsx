import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CTAButton, GlassCard, SectionHeader } from '@/components/shared';
import { clientSuccessStories, siteContainerClass } from '@/lib/siteContent';

export default function ClientSuccess() {
  return (
    <section id="client-success" className="py-20 lg:py-24">
      <div className={siteContainerClass}>
        <SectionHeader
          eyebrow="Client Success"
          title="Enterprise AI Outcomes"
          subtitle="Reference transformation patterns across strategy, architecture, adoption, and measurable business impact."
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {clientSuccessStories.map((story, index) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
            >
              <GlassCard className="h-full rounded-[30px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7" glow="gradient">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                  {story.type}
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{story.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{story.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {story.outcomes.map((outcome) => (
                    <span
                      key={outcome}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70"
                    >
                      {outcome}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <CTAButton to={story.link} variant="secondary" className="w-full justify-between">
                    <span>Explore Story</span>
                    <ArrowRight className="h-4 w-4" />
                  </CTAButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CTAButton to="/resources#case-studies">Explore Client Stories</CTAButton>
        </div>
      </div>
    </section>
  );
}
