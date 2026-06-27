import { useState } from 'react';
import { ArrowRight, Check, MessageSquare, Send } from 'lucide-react';
import { CTAButton } from '@/components/shared/CTAButton';
import { GlassCard } from '@/components/shared/GlassCard';
import { GradientText } from '@/components/shared/GradientText';
import { PageHero } from '@/components/shared/PageHero';
import { siteContainerClass } from '@/lib/siteContent';

const contactOptions = [
  {
    id: 'book-workshop',
    title: 'Book Workshop',
    description: 'Design an executive or working session around strategy, architecture, and transformation priorities.',
  },
  {
    id: 'book-consultation',
    title: 'Book Consultation',
    description: 'Connect with GFF AI for discovery, solution fit, and program planning.',
  },
  {
    id: 'sales',
    title: 'Sales',
    description: 'Discuss service offerings, commercial models, and enterprise engagement scope.',
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Reach client success and delivery teams for program support and operational help.',
  },
  {
    id: 'partnership',
    title: 'Partnership',
    description: 'Explore channel, technology, and strategic partnership opportunities.',
  },
  {
    id: 'media',
    title: 'Media',
    description: 'Coordinate press, brand, speaking, and event-related communication.',
  },
  {
    id: 'university',
    title: 'University',
    description: 'Discuss university platforms, capability-building programs, and enablement models.',
  },
  {
    id: 'investors',
    title: 'Investors',
    description: 'Connect on company direction, strategic growth, and investor relations.',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Contact <GradientText>GFF AI</GradientText>
          </>
        }
        subtitle="Choose the right path to connect with GFF AI teams."
        intro="This Phase 1 contact experience introduces route-level discovery and a premium static inquiry form without adding backend dependencies."
        actions={
          <>
            <CTAButton to="/#talk-to-agent">Talk to GFF AI</CTAButton>
            <CTAButton to="/build" variant="secondary">
              Explore Build Paths
            </CTAButton>
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {contactOptions.map((option) => (
                <GlassCard
                  key={option.id}
                  className="rounded-[28px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7"
                  glow="gradient"
                >
                  <div id={option.id} className="scroll-mt-28" />
                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                    {option.title}
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold text-white">{option.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/72">{option.description}</p>
                  <div className="mt-6">
                    <CTAButton to="#contact-form" variant="secondary" className="w-full justify-between">
                      <span>Select This Path</span>
                      <ArrowRight className="h-4 w-4" />
                    </CTAButton>
                  </div>
                </GlassCard>
              ))}
            </div>

            <GlassCard
              className="rounded-[32px] border-white/[0.1] bg-[#101014]/92 p-6 lg:p-8 xl:sticky xl:top-28"
              glow="gradient"
            >
              {!submitted ? (
                <form
                  id="contact-form"
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Premium Contact Form
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold text-white">Start the conversation</h2>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      Share a few details and GFF AI can route your inquiry to the right team.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm text-white/75">Name</span>
                      <input
                        required
                        type="text"
                        className="glass-input h-12 w-full rounded-2xl px-4 text-sm text-white outline-none transition-all focus:ring-4 focus:ring-core-blue/10"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm text-white/75">Company</span>
                      <input
                        required
                        type="text"
                        className="glass-input h-12 w-full rounded-2xl px-4 text-sm text-white outline-none transition-all focus:ring-4 focus:ring-core-blue/10"
                        placeholder="Company name"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm text-white/75">Email</span>
                      <input
                        required
                        type="email"
                        className="glass-input h-12 w-full rounded-2xl px-4 text-sm text-white outline-none transition-all focus:ring-4 focus:ring-core-blue/10"
                        placeholder="you@company.com"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm text-white/75">Interest</span>
                      <select
                        required
                        defaultValue=""
                        className="glass-input h-12 w-full rounded-2xl px-4 text-sm text-white outline-none transition-all focus:ring-4 focus:ring-core-blue/10"
                      >
                        <option value="" disabled>
                          Select interest
                        </option>
                        {contactOptions.map((option) => (
                          <option key={option.id} value={option.title} className="bg-[#101014]">
                            {option.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm text-white/75">Message</span>
                    <textarea
                      required
                      rows={6}
                      className="glass-input w-full rounded-[24px] px-4 py-4 text-sm text-white outline-none transition-all focus:ring-4 focus:ring-core-blue/10"
                      placeholder="Tell us about your transformation goals, timeline, or engagement needs."
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gff-gradient px-5 py-3.5 text-sm font-medium text-white sheen-btn hover-gff-glow"
                  >
                    <Send className="h-4 w-4" />
                    Submit Inquiry
                  </button>
                </form>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gff-gradient">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-bold text-white">Inquiry captured</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/72">
                    This Phase 1 form is static, but the page flow is ready for backend wiring in a later phase.
                  </p>
                  <div className="mt-6">
                    <CTAButton to="/" variant="secondary">
                      Return Home
                    </CTAButton>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  );
}
