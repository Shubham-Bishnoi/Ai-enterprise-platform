import type { Metadata } from 'next'
import {
  Activity,
  FileLock2,
  Gauge,
  LayoutDashboard,
  LifeBuoy,
  ShieldCheck,
} from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { BrandButton } from '@/components/ui/brand-button'

export const metadata: Metadata = {
  title: 'Client Portal — GFF AI',
  description:
    'A secure client workspace for blueprint scores, active projects, governance readiness, document vault, and AI operations.',
}

const modules = [
  {
    icon: Gauge,
    title: 'Blueprint Score',
    body: 'Track enterprise AI readiness over time and see how each initiative moves the score.',
  },
  {
    icon: LayoutDashboard,
    title: 'Active Projects',
    body: 'Live status across every Garage, Foundry, and Factory workstream in your programme.',
  },
  {
    icon: ShieldCheck,
    title: 'Governance Readiness',
    body: 'Policy coverage, model oversight, and audit posture in a single control view.',
  },
  {
    icon: FileLock2,
    title: 'Document Vault',
    body: 'Architecture records, blueprints, and deliverables in one permissioned workspace.',
  },
  {
    icon: Activity,
    title: 'AI Operations',
    body: 'Agent performance, cost, and reliability signals across deployed workloads.',
  },
  {
    icon: LifeBuoy,
    title: 'Support',
    body: 'Direct access to your delivery team, with request history and response tracking.',
  },
]

export default function PortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Client Portal"
        title={
          <>
            Your secure <span className="text-brand-gradient">AI workspace</span>
          </>
        }
        subtitle="A command centre for your transformation programme — readiness, delivery, governance, and operations in one place."
      >
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <BrandButton href="/contact" size="lg">
            Request Portal Access
          </BrandButton>
          <BrandButton href="/contact" variant="secondary" size="lg">
            Book a Demo
          </BrandButton>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Inside the portal"
            title="Everything your programme needs, in one workspace"
            subtitle="Built for enterprise clients running governed AI at scale."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <ScrollReveal key={m.title} delay={(i % 3) * 0.08}>
                <article className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <m.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold text-navy">{m.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-10 text-center shadow-brand-soft">
            <h2 className="text-2xl font-semibold tracking-tight text-navy">Already a GFF AI client?</h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Portal sign-in is provisioned per engagement. Contact your delivery lead or request access and we will set
              up your workspace.
            </p>
            <BrandButton href="/contact">Request Access</BrandButton>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
