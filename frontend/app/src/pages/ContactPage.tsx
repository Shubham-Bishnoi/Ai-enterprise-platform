import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, MessageSquare, Send, Lightbulb, Calendar, DollarSign, Wrench, Handshake,
  Radio, GraduationCap, TrendingUp, Mail, User, Building2, FileText
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { siteContainerClass } from '@/lib/siteContent';

const contactOptions = [
  { id: 'book-workshop', title: 'Book Workshop', icon: Lightbulb, desc: 'Design an executive or working session around strategy, architecture, and transformation priorities.', color: '#FF3040' },
  { id: 'book-consultation', title: 'Book Consultation', icon: Calendar, desc: 'Connect with GFF AI for discovery, solution fit, and program planning.', color: '#FF9F1A' },
  { id: 'sales', title: 'Sales', icon: DollarSign, desc: 'Discuss service offerings, commercial models, and enterprise engagement scope.', color: '#10B981' },
  { id: 'support', title: 'Support', icon: Wrench, desc: 'Reach client success and delivery teams for program support and operational help.', color: '#1173BC' },
  { id: 'partnership', title: 'Partnership', icon: Handshake, desc: 'Explore channel, technology, and strategic partnership opportunities.', color: '#6B5BFF' },
  { id: 'media', title: 'Media', icon: Radio, desc: 'Coordinate press, brand, speaking, and event-related communication.', color: '#C03C85' },
  { id: 'university', title: 'University', icon: GraduationCap, desc: 'Discuss university platforms, capability-building programs, and enablement models.', color: '#00A3FF' },
  { id: 'investors', title: 'Investors', icon: TrendingUp, desc: 'Connect on company direction, strategic growth, and investor relations.', color: '#A855F7' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState('');
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Contact"
        title={<>Contact <GradientText>GFF AI</GradientText></>}
        subtitle="Choose the right path to connect with GFF AI teams."
        intro="Select your intent and start a focused conversation with the right team."
        actions={
          <>
            <CTAButton to="/#talk-to-agent">Talk to GFF AI</CTAButton>
            <CTAButton to="/build" variant="secondary">Explore Build Paths</CTAButton>
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <div className="grid gap-8 xl:grid-cols-[1fr_0.45fr]">
            {/* Intent Selection */}
            <div>
              <h2 className="mb-6 font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                How can we help?
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {contactOptions.map((option, i) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedIntent(option.title)}
                    className="rounded-[20px] border p-5 text-left transition-all duration-300"
                    style={{
                      backgroundColor: selectedIntent === option.title ? `${option.color}06` : 'var(--bg-glass)',
                      borderColor: selectedIntent === option.title ? `${option.color}35` : 'var(--border-default)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ backgroundColor: selectedIntent === option.title ? `${option.color}15` : 'var(--chip-bg)' }}
                      >
                        <option.icon className="h-4 w-4" style={{ color: option.color }} />
                      </div>
                      <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>{option.title}</h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{option.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[28px] border p-6 lg:p-8 xl:sticky xl:top-28"
              style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
            >
              {!submitted ? (
                <form
                  className="space-y-5"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {selectedIntent || 'Select an intent above'}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Start the conversation</h3>
                  </div>

                  <div className="grid gap-4">
                    <label>
                      <span className="mb-1.5 block text-sm" style={{ color: 'var(--text-secondary)' }}>Name</span>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none"
                          style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          placeholder="Your name" />
                      </div>
                    </label>
                    <label>
                      <span className="mb-1.5 block text-sm" style={{ color: 'var(--text-secondary)' }}>Company</span>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input required type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none"
                          style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                          placeholder="Company name" />
                      </div>
                    </label>
                  </div>

                  <label>
                    <span className="mb-1.5 block text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none"
                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                        placeholder="you@company.com" />
                    </div>
                  </label>

                  <label>
                    <span className="mb-1.5 block text-sm" style={{ color: 'var(--text-secondary)' }}>Intent</span>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <select value={selectedIntent} onChange={(e) => setSelectedIntent(e.target.value)}
                        className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none appearance-none"
                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}>
                        <option value="">Select interest</option>
                        {contactOptions.map((o) => <option key={o.id} value={o.title}>{o.title}</option>)}
                      </select>
                    </div>
                  </label>

                  <label>
                    <span className="mb-1.5 block text-sm" style={{ color: 'var(--text-secondary)' }}>Message</span>
                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                      style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      placeholder="Tell us about your transformation goals, timeline, or engagement needs." />
                  </label>

                  <button type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gff-gradient px-5 py-3.5 text-sm font-medium text-white sheen-btn hover-gff-glow">
                    <Send className="h-4 w-4" />
                    Submit Inquiry
                  </button>
                </form>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gff-gradient">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Inquiry captured</h3>
                  <p className="mt-3 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
                    GFF AI will route your inquiry to the right team and respond shortly.
                  </p>
                  <div className="mt-6">
                    <CTAButton to="/" variant="secondary">Return Home</CTAButton>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
