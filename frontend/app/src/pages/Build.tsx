import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, FileText, Gauge, Percent, LayoutGrid, Compass, Container, Send,
  ArrowRight
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { siteContainerClass } from '@/lib/siteContent';

const buildTools = [
  { title: 'Talk to Agent', icon: MessageSquare, color: '#FF3040', desc: 'Speak with a specialist AI advisor and discover the right transformation path.', link: '/#talk-to-agent', status: 'Live', primary: true },
  { title: 'Blueprint Generator', icon: FileText, color: '#1173BC', desc: 'Generate an enterprise AI blueprint with readiness, roadmap, architecture, and governance.', link: '/#blueprint-generator', status: 'Live', primary: true },
  { title: 'AI Readiness', icon: Gauge, color: '#6B5BFF', desc: 'Assess maturity across data, adoption, governance, architecture, and operating readiness.', link: '/build', status: 'Beta', primary: false },
  { title: 'ROI Calculator', icon: Percent, color: '#C03C85', desc: 'Estimate productivity gain, cost reduction, and business impact from AI transformation.', link: '/build', status: 'Beta', primary: false },
  { title: 'Marketplace', icon: LayoutGrid, color: '#00A3FF', desc: 'Explore reusable AI agents, accelerators, templates, and industry assets.', link: '/platforms#marketplace', status: 'Active', primary: false },
  { title: 'Foundry Studio', icon: Compass, color: '#FF9F1A', desc: 'Build, test, and validate enterprise AI systems inside a controlled studio environment.', link: '/platforms#foundry', status: 'Preview', primary: false },
  { title: 'Sandbox', icon: Container, color: '#A855F7', desc: 'Trial controlled AI concepts, workflows, and enterprise agent experiences.', link: '/build', status: 'Preview', primary: false },
  { title: 'Proposal Generator', icon: Send, color: '#10B981', desc: 'Create a structured transformation proposal aligned to your operating priorities.', link: '/contact', status: 'Preview', primary: false },
];

const journeySteps = [
  { label: 'Discover', desc: 'Talk to agent', color: '#FF3040' },
  { label: 'Blueprint', desc: 'Generate plan', color: '#FF9F1A' },
  { label: 'Workshop', desc: 'Validate scope', color: '#1173BC' },
  { label: 'Pilot', desc: 'Build & test', color: '#6B5BFF' },
  { label: 'Scale', desc: 'Deploy factory', color: '#10B981' },
];

export default function Build() {
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Build With GFF"
        title={<>Build With <GradientText>GFF</GradientText></>}
        subtitle="Start with an agent conversation, generate a blueprint, assess readiness, calculate ROI, or build inside the foundry."
        intro="Phase 1 creates the navigation and entry points so buyers can start the right journey."
        actions={
          <>
            <CTAButton to="/#talk-to-agent">Talk to GFF AI</CTAButton>
            <CTAButton to="/#blueprint-generator" variant="secondary">Generate Blueprint</CTAButton>
          </>
        }
      />

      {/* Recommended Journey Flow */}
      <section className="py-12" style={{ backgroundColor: 'var(--surface-dark)' }}>
        <div className={siteContainerClass}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Recommended Path</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>From discovery to enterprise-scale AI</p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
            {journeySteps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-1 rounded-2xl border px-4 py-3"
                  style={{ borderColor: `${step.color}25`, backgroundColor: `${step.color}08` }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${step.color}20` }}>
                    <span className="text-xs font-bold" style={{ color: step.color }}>{i + 1}</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{step.label}</span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{step.desc}</span>
                </motion.div>
                {i < journeySteps.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 mx-1 md:block" style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Launcher Grid */}
      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Action <span className="text-gradient">Launcher</span>
            </h2>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Choose your starting point</p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {buildTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                onMouseEnter={() => setHoveredTool(index)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <a href={tool.link} className="block h-full">
                  <div
                    className="relative h-full overflow-hidden rounded-[24px] border p-6 transition-all duration-500"
                    style={{
                      backgroundColor: tool.primary ? `${tool.color}06` : 'var(--bg-glass)',
                      borderColor: tool.primary ? `${tool.color}30` : hoveredTool === index ? `${tool.color}35` : 'var(--border-default)',
                      boxShadow: tool.primary ? `0 0 30px ${tool.color}08` : 'none',
                    }}
                  >
                    {tool.primary && (
                      <div className="absolute top-0 left-0 h-1 w-full" style={{ background: `linear-gradient(90deg, ${tool.color}, transparent)` }} />
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: hoveredTool === index ? `${tool.color}15` : 'var(--chip-bg)' }}
                      >
                        <tool.icon className="h-5 w-5" style={{ color: hoveredTool === index ? tool.color : 'var(--text-secondary)' }} />
                      </div>
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase"
                        style={{ borderColor: `${tool.color}25`, backgroundColor: `${tool.color}08`, color: tool.color }}
                      >
                        {tool.status}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{tool.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tool.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: tool.color }}>
                      Launch
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
