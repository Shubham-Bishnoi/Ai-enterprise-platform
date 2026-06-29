import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';
import { globalPresenceLocations, siteContainerClass } from '@/lib/siteContent';
import { GlobalNetwork3D } from '@/components/global-network';

export default function GlobalPresence() {
  return (
    <section id="global-presence" className="relative py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(17,115,188,0.06), transparent 40%), radial-gradient(circle at 70% 80%, rgba(154,0,3,0.04), transparent 35%)',
        }}
      />

      <div className={siteContainerClass}>
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.24em]"
            style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)', color: 'var(--text-secondary)' }}
          >
            <Globe className="h-3.5 w-3.5" />
            Global Presence
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Global AI Transformation <span className="text-gradient">Presence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            GFF AI operates across strategic regions with a Garage-Foundry-Factory delivery model.
          </motion.p>
        </div>

        {/* Network Map Layout */}
        <div className="mt-14 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Map Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[28px] border"
            style={{
              backgroundColor: 'var(--bg-glass)',
              borderColor: 'var(--border-default)',
              minHeight: '480px',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at center, rgba(17,115,188,0.12), transparent 38%), radial-gradient(circle at 30% 30%, rgba(192,60,133,0.10), transparent 24%)',
              }}
            />
            <div className="absolute inset-0">
              <GlobalNetwork3D bare className="h-full w-full" />
            </div>
          </motion.div>

          {/* Location Cards */}
          <div className="grid gap-4 content-start">
            {globalPresenceLocations.map((location, index) => {
              const isFuture = location.status === 'Future';
              return (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group rounded-[20px] border p-5 transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    backgroundColor: 'var(--bg-glass)',
                    borderColor: 'var(--border-default)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${location.accent}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${location.accent}12` }}
                      >
                        <MapPin className="h-4 w-4" style={{ color: location.accent }} />
                      </div>
                      <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {location.name}
                      </h3>
                    </div>
                    <span
                      className="rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-wider"
                      style={{
                        borderColor: isFuture ? 'var(--border-default)' : `${location.accent}30`,
                        backgroundColor: isFuture ? 'var(--chip-bg)' : `${location.accent}10`,
                        color: isFuture ? 'var(--text-muted)' : location.accent,
                      }}
                    >
                      {location.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {location.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
