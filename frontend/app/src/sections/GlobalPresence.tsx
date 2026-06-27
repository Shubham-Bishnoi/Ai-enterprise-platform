import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { GlassCard, SectionHeader } from '@/components/shared';
import { globalPresenceLocations, siteContainerClass } from '@/lib/siteContent';

const pinPositions = [
  { left: '67%', top: '34%' },
  { left: '56%', top: '49%' },
  { left: '43%', top: '27%' },
  { left: '79%', top: '71%' },
  { left: '50%', top: '43%' },
  { left: '18%', top: '33%' },
];

export default function GlobalPresence() {
  return (
    <section id="global-presence" className="py-20 lg:py-24">
      <div className={siteContainerClass}>
        <SectionHeader
          eyebrow="Global Presence"
          title="Global AI Transformation Presence"
          subtitle="GFF AI operates across strategic regions with a Garage-Foundry-Factory delivery model."
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="relative overflow-hidden rounded-[32px] border-white/[0.09] bg-[#0d0d10]/92 p-6 lg:p-8" glow="gradient">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,115,188,0.12),transparent_38%),radial-gradient(circle_at_30%_30%,rgba(192,60,133,0.12),transparent_24%)]" />
            <div className="absolute inset-[12%] rounded-full border border-white/10" />
            <div className="absolute inset-[20%] rounded-full border border-dashed border-white/10" />
            <div className="absolute inset-[28%] rounded-full border border-white/10" />
            <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_center,rgba(17,115,188,0.2),rgba(13,13,16,0.04)_55%,transparent_72%)] blur-sm" />

            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.04)_100%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.04)_100%)] bg-[size:38px_38px]" />

              {globalPresenceLocations.map((location, index) => (
                <div
                  key={location.name}
                  className="absolute"
                  style={pinPositions[index]}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#101014]/95"
                      style={{ boxShadow: `0 0 26px ${location.accent}40` }}
                    >
                      <MapPin className="h-4 w-4" style={{ color: location.accent }} />
                    </div>
                    <span className="rounded-full border border-white/10 bg-[#0f0f13]/92 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-white/68">
                      {location.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {globalPresenceLocations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <GlassCard className="h-full rounded-[28px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7" glow="gradient">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold text-white">{location.name}</h3>
                    <span
                      className="rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em]"
                      style={{
                        borderColor: `${location.accent}55`,
                        color: location.accent,
                        backgroundColor: `${location.accent}12`,
                      }}
                    >
                      {location.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-white/72">{location.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
