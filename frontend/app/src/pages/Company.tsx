import { motion } from 'framer-motion';
import {
  Users, Handshake, Briefcase, Globe, Radio, TrendingUp, GraduationCap, Mail, ArrowRight, Shield
} from 'lucide-react';
import { Link } from 'react-router';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { siteContainerClass } from '@/lib/siteContent';

const companyAreas = [
  { title: 'Leadership', icon: Users, desc: 'Transformation, engineering, and operating leaders aligned to enterprise outcomes.', color: '#FF3040' },
  { title: 'Partners', icon: Handshake, desc: 'Strategic ecosystem partners across platforms, delivery, and domain acceleration.', color: '#1173BC' },
  { title: 'Careers', icon: Briefcase, desc: 'Opportunities for builders, strategists, architects, and AI operations talent.', color: '#6B5BFF' },
  { title: 'Locations', icon: Globe, desc: 'A global delivery model with regional presence and specialist coordination.', color: '#FF9F1A' },
  { title: 'Media', icon: Radio, desc: 'Brand, announcements, speaking, and market visibility touchpoints.', color: '#C03C85' },
  { title: 'Investors', icon: TrendingUp, desc: 'Company growth, strategic backing, and transformation market positioning.', color: '#10B981' },
  { title: 'Advisors', icon: GraduationCap, desc: 'Industry and technology advisors that strengthen program direction.', color: '#00A3FF' },
  { title: 'Contact', icon: Mail, desc: 'Direct paths into sales, partnerships, workshops, and general inquiry channels.', color: '#A855F7' },
];

const timeline = [
  { phase: 'Garage', label: 'Discover', desc: 'AI workshops & opportunity mapping', color: '#FF3040' },
  { phase: 'Foundry', label: 'Engineer', desc: 'Agent & platform development', color: '#FF9F1A' },
  { phase: 'Factory', label: 'Operate', desc: 'Managed AI at scale', color: '#1173BC' },
  { phase: 'Scale', label: 'Transform', desc: 'Enterprise-wide adoption', color: '#6B5BFF' },
];

const presence = [
  { city: 'Singapore', role: 'Global Hub', status: 'active' },
  { city: 'India', role: 'Engineering & Delivery', status: 'active' },
  { city: 'London', role: 'Enterprise Advisory', status: 'active' },
  { city: 'Australia', role: 'Future Expansion', status: 'future' },
  { city: 'Middle East', role: 'Future Expansion', status: 'future' },
  { city: 'USA', role: 'Future Expansion', status: 'future' },
];

export default function Company() {
  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Company"
        title={<>The <GradientText>GFF AI</GradientText> Company</>}
        subtitle="GFF AI brings together strategy, engineering, AI operations, talent, and global delivery."
        intro="The company model is designed to combine executive transformation leadership with the systems and delivery capacity needed to run enterprise AI in production."
        actions={
          <>
            <CTAButton to="/contact">Join the Conversation</CTAButton>
            <CTAButton to="/why-gff-ai" variant="secondary">See Why GFF AI</CTAButton>
          </>
        }
      />

      {/* Global Presence Strip */}
      <section className="border-b py-8" style={{ backgroundColor: 'var(--surface-dark)', borderColor: 'var(--border-default)' }}>
        <div className={siteContainerClass}>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {presence.map((loc) => (
              <div key={loc.city} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: loc.status === 'active' ? '#10B981' : 'var(--text-muted)' }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{loc.city}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{loc.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Areas */}
      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              Company <span className="text-gradient">Areas</span>
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {companyAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-[24px] border p-6 transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${area.color}30`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${area.color}10` }}
                >
                  <area.icon className="h-5 w-5" style={{ color: area.color }} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{area.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{area.desc}</p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: area.color }}
                >
                  Connect <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Operating Model Timeline */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: 'var(--surface-dark)' }}>
        <div className={siteContainerClass}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              Our <span className="text-gradient">Operating Model</span>
            </h2>
            <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>From discovery to enterprise transformation</p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-4">
            {timeline.map((step, i) => (
              <motion.div
                key={step.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < timeline.length - 1 && (
                  <div className="absolute right-0 top-8 hidden -translate-y-1/2 translate-x-1/2 z-10 md:block">
                    <ArrowRight className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
                <div
                  className="rounded-[24px] border p-6 text-center"
                  style={{ backgroundColor: 'var(--bg-glass)', borderColor: `${step.color}25` }}
                >
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <span className="text-lg font-bold" style={{ color: step.color }}>{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{step.phase}</h3>
                  <p className="text-sm font-medium" style={{ color: step.color }}>{step.label}</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Globe, label: 'Global Delivery', value: '6 Regions', desc: 'Singapore, India, London, Australia, Middle East, USA' },
              { icon: Users, label: 'Operating Model', value: 'Garage → Foundry → Factory', desc: 'End-to-end AI transformation lifecycle' },
              { icon: Shield, label: 'Governance First', value: 'Enterprise Grade', desc: 'Built-in compliance, risk, and trust controls' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[24px] border p-6 text-center"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
              >
                <item.icon className="mx-auto h-8 w-8" style={{ color: 'var(--gff-blue)' }} />
                <h3 className="mt-4 font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</h3>
                <p className="mt-1 font-display text-2xl font-bold text-gradient">{item.value}</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
