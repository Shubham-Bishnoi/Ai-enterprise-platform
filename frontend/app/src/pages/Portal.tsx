import { Activity, BarChart3, FileText, FolderKanban, LifeBuoy, Shield, Wallet } from 'lucide-react';
import { CTAButton } from '@/components/shared/CTAButton';
import { GlassCard } from '@/components/shared/GlassCard';
import { GradientText } from '@/components/shared/GradientText';
import { PageHero } from '@/components/shared/PageHero';
import { portalCards, siteContainerClass } from '@/lib/siteContent';

const portalHighlights = [
  { label: 'Programs', value: '12', icon: FolderKanban },
  { label: 'Documents', value: '148', icon: FileText },
  { label: 'Invoices', value: '04', icon: Wallet },
  { label: 'AI Ops', value: '99.2%', icon: Activity },
];

const portalUtilities = [
  { label: 'Support Queue', icon: LifeBuoy },
  { label: 'Governance Status', icon: Shield },
  { label: 'Analytics Feed', icon: BarChart3 },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Portal() {
  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Client Portal"
        title={
          <>
            Client <GradientText>Portal</GradientText>
          </>
        }
        subtitle="A secure workspace for programs, documents, invoices, AI operations, analytics, and governance."
        intro="Phase 1 provides a premium mock portal preview that establishes navigation, structure, and future authentication-ready entry points."
        actions={
          <>
            <CTAButton to="/contact">Request Access</CTAButton>
            <CTAButton to="/company" variant="secondary">
              Learn About GFF AI
            </CTAButton>
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <GlassCard className="rounded-[32px] border-white/[0.1] bg-[#101014]/92 p-6 lg:p-8" glow="gradient">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-300">
                    Secure Workspace Preview
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-bold text-white">Program command center</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                    A single surface for executive visibility, delivery coordination, governance, and AI operations.
                  </p>
                </div>
                <CTAButton to="/contact" variant="secondary">
                  Request Demo
                </CTAButton>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {portalHighlights.map((highlight) => (
                  <div key={highlight.label} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <highlight.icon className="h-5 w-5 text-core-blue" />
                    <div className="mt-4 text-3xl font-display font-bold text-white">{highlight.value}</div>
                    <div className="mt-1 text-sm text-white/65">{highlight.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {portalUtilities.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-[#0d0d10] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04]">
                        <item.icon className="h-5 w-5 text-white/80" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.label}</div>
                        <div className="text-xs text-white/55">Preview ready</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="grid gap-6 md:grid-cols-2">
              {portalCards.map((card) => (
                <GlassCard
                  key={card.title}
                  className="rounded-[28px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7"
                  glow="gradient"
                >
                  <div id={slugify(card.title)} className="scroll-mt-28" />
                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                    {card.title}
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold text-white">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/72">{card.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
