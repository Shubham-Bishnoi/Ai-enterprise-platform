import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Building2, GraduationCap, TrendingUp, Factory } from 'lucide-react';
import { Link } from 'react-router';
import { CTAButton } from '@/components/shared';
import { clientSuccessStories, siteContainerClass } from '@/lib/siteContent';

const typeIcons = [Building2, GraduationCap, Factory];
const typeColors = ['#FF3040', '#1173BC', '#10B981'];

export default function ClientSuccess() {
  return (
    <section id="client-success" className="relative py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(154,0,3,0.06), transparent 40%), radial-gradient(circle at 80% 70%, rgba(17,115,188,0.05), transparent 35%)',
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
              <TrendingUp className="h-3.5 w-3.5" />
              Enterprise AI Outcomes
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Enterprise AI <span className="text-gradient">Outcomes</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Reference transformation patterns across strategy, architecture, adoption, and measurable business impact.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <CTAButton to="/resources#case-studies">Explore All Stories</CTAButton>
          </motion.div>
        </div>

        {/* Asymmetric Case Layout - Featured + Two Cards */}
        <div className="mt-14 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Featured Case - Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="group relative h-full overflow-hidden rounded-[28px] border transition-all duration-500"
              style={{
                backgroundColor: 'var(--bg-glass)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${typeColors[0]}40`;
                e.currentTarget.style.boxShadow = `0 0 60px ${typeColors[0]}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Accent top bar */}
              <div className="h-1 w-full bg-gff-gradient" />

              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${typeColors[0]}15` }}
                  >
                    <Building2 className="h-5 w-5" style={{ color: typeColors[0] }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-mono uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {clientSuccessStories[0].type}
                    </span>
                    <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {clientSuccessStories[0].title}
                    </h3>
                  </div>
                </div>

                <p className="mt-5 max-w-lg text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {clientSuccessStories[0].description}
                </p>

                {/* Challenge / Architecture / Outcomes */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4" style={{ color: typeColors[0] }} />
                      <span className="text-xs font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Challenge</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Operational complexity and compliance overhead limiting AI adoption velocity.</p>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4" style={{ color: '#1173BC' }} />
                      <span className="text-xs font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Approach</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Agentic AI architecture with governance-first deployment model.</p>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4" style={{ color: '#10B981' }} />
                      <span className="text-xs font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Impact</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Streamlined operations with embedded compliance controls.</p>
                  </div>
                </div>

                {/* Outcome Chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {clientSuccessStories[0].outcomes.map((outcome) => (
                    <span
                      key={outcome}
                      className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm"
                      style={{ borderColor: `${typeColors[0]}25`, backgroundColor: `${typeColors[0]}08`, color: 'var(--text-primary)' }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: typeColors[0] }} />
                      {outcome}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <CTAButton to={clientSuccessStories[0].link} variant="secondary" className="w-full sm:w-auto">
                    <span>Explore Transformation</span>
                    <ArrowRight className="h-4 w-4" />
                  </CTAButton>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two smaller cards - Right */}
          <div className="grid gap-6 content-start">
            {clientSuccessStories.slice(1).map((story, index) => {
              const Icon = typeIcons[index + 1];
              const color = typeColors[index + 1];
              return (
                <motion.div
                  key={story.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                >
                  <div
                    className="group overflow-hidden rounded-[24px] border transition-all duration-500"
                    style={{
                      backgroundColor: 'var(--bg-glass)',
                      borderColor: 'var(--border-default)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }}
                  >
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                    <div className="p-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon className="h-4 w-4" style={{ color }} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{story.type}</span>
                          <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{story.title}</h3>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{story.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {story.outcomes.slice(0, 2).map((outcome) => (
                          <span
                            key={outcome}
                            className="rounded-full border px-3 py-1 text-xs"
                            style={{ borderColor: `${color}20`, backgroundColor: `${color}08`, color: 'var(--text-secondary)' }}
                          >
                            {outcome}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Link
                          to={story.link}
                          className="inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3"
                          style={{ color }}
                        >
                          Read more <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
