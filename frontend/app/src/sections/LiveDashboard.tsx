import { motion } from 'framer-motion';
import { Activity, Dot, ShieldCheck } from 'lucide-react';
import { GlassCard, SectionHeader } from '@/components/shared';
import { liveDashboardMetrics, liveDashboardPanels, siteContainerClass } from '@/lib/siteContent';

export default function LiveDashboard() {
  return (
    <section id="live-dashboard" className="py-20 lg:py-24">
      <div className={siteContainerClass}>
        <SectionHeader
          eyebrow="Live Dashboard"
          title="Live AI Transformation Dashboard"
          subtitle="A command-center view of the GFF AI ecosystem."
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <GlassCard className="rounded-[32px] border-white/[0.1] bg-[#101014]/92 p-6 lg:p-8" glow="gradient">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-300">
                  <Dot className="h-6 w-6 animate-pulse" />
                  Ecosystem Snapshot
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold text-white">Command center overview</h3>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72">
                Static visualization for Phase 2
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {liveDashboardMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="rounded-[24px] border border-white/10 bg-[#0d0d10] p-4"
                >
                  <div className="text-3xl font-display font-bold text-white">{metric.value}</div>
                  <div className="mt-2 text-sm text-white/62">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5">
              <div className="flex items-center gap-3 text-sm text-white/72">
                <Activity className="h-4 w-4 text-core-blue" />
                Active programs, advisory sessions, and platform readiness signals are summarized here for a premium ecosystem view.
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
            {liveDashboardPanels.map((panel, index) => (
              <motion.div
                key={panel.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <GlassCard className="rounded-[28px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7" glow="gradient">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white/80">{panel.title}</span>
                    <ShieldCheck className="h-4 w-4 text-core-blue" />
                  </div>
                  <div className="mt-4 font-display text-4xl font-bold text-white">{panel.value}</div>
                  <p className="mt-3 text-sm leading-7 text-white/66">{panel.detail}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
