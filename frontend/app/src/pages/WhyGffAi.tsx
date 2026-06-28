import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, FlaskConical, Factory, Hammer, Target, Eye, Zap, Globe, Shield, Layers } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { siteContainerClass } from '@/lib/siteContent';

const differentiators = [
  { label: 'Traditional Consulting', icon: X, ours: 'Unified operating model', theirs: 'Advisory-only, no delivery' },
  { label: 'Generic AI Tools', icon: X, ours: 'End-to-end transformation', theirs: 'Point solutions, no integration' },
  { label: 'One-off Pilots', icon: X, ours: 'AI operating system', theirs: 'Siloed experiments' },
];

const modelStages = [
  { name: 'Garage', icon: FlaskConical, color: '#FF3040', desc: 'Experimentation & discovery', items: ['AI workshops', 'Opportunity mapping', 'Rapid prototyping'] },
  { name: 'Foundry', icon: Hammer, color: '#FF9F1A', desc: 'Engineering & productization', items: ['Agent engineering', 'Platform build', 'Validation'] },
  { name: 'Factory', icon: Factory, color: '#1173BC', desc: 'Scale & operations', items: ['Deploy at scale', 'Governed operations', 'Continuous optimization'] },
];

const values = [
  { title: 'Mission', icon: Target, desc: 'Build intelligent enterprises that can design, deploy, and govern AI at scale.' },
  { title: 'Vision', icon: Eye, desc: 'Create the reference model for AI-native enterprises across industries and markets.' },
  { title: 'Global Model', icon: Globe, desc: 'Deliver programs through a distributed model balancing proximity, speed, and specialist talent.' },
  { title: 'Trust Layer', icon: Shield, desc: 'Unify governance, compliance, and risk management into every AI deployment.' },
  { title: 'Platform-First', icon: Layers, desc: 'Design modular AI ecosystems integrating agents, knowledge, data, and human oversight.' },
  { title: 'Outcome-Led', icon: Zap, desc: 'Drive measurable transformation with clear ROI and continuous value realization.' },
];

function X(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function WhyGffAi() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Why GFF AI"
        title={<>Why <GradientText>GFF AI</GradientText></>}
        subtitle="A Garage-Foundry-Factory model for building, deploying, and operating AI-native enterprises."
        intro="GFF AI combines strategy, engineering, delivery, governance, and operating rigor into one enterprise transformation system designed for the agentic era."
        actions={
          <>
            <CTAButton to="/contact">Book a Consultation</CTAButton>
            <CTAButton to="/platforms" variant="secondary">Explore Platforms</CTAButton>
          </>
        }
      />

      {/* Operating Model - Visual Pipeline */}
      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              The <span className="text-gradient">Garage → Foundry → Factory</span> Model
            </h2>
            <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>A staged innovation model for enterprise AI transformation.</p>
          </motion.div>

          {/* Pipeline */}
          <div className="grid gap-4 md:grid-cols-3">
            {modelStages.map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveStage(index)}
                className="relative"
              >
                {index < modelStages.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 z-10 md:block">
                    <ArrowRight className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
                <div
                  className="rounded-[24px] border p-6 transition-all duration-500 h-full"
                  style={{
                    backgroundColor: activeStage === index ? `${stage.color}08` : 'var(--bg-glass)',
                    borderColor: activeStage === index ? `${stage.color}40` : 'var(--border-default)',
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${stage.color}15` }}
                  >
                    <stage.icon className="h-6 w-6" style={{ color: stage.color }} />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stage.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{stage.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {stage.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: stage.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: 'var(--surface-dark)' }}>
        <div className={siteContainerClass}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              How GFF AI <span className="text-gradient">Compares</span>
            </h2>
            <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>A fundamentally different approach to enterprise transformation.</p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-3">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[24px] border p-6"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
              >
                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.theirs}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.ours}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl" style={{ color: 'var(--text-primary)' }}>
              The GFF AI <span className="text-gradient">Difference</span>
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[24px] border p-6 transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'var(--chip-bg)' }}
                >
                  <value.icon className="h-5 w-5" style={{ color: 'var(--gff-bright-red)' }} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
