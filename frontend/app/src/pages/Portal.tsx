import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, BarChart3, FileText, FolderKanban, LifeBuoy, Shield, Wallet, Lock, Eye, EyeOff,
  CheckCircle, Clock, Cpu
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
  import { GradientText } from '@/components/shared/GradientText';
  import { CTAButton } from '@/components/shared/CTAButton';
  import { siteContainerClass } from '@/lib/siteContent';

const portalModules = [
  { title: 'Dashboard', desc: 'Executive overview of programs, milestones, status, and active workstreams.', icon: BarChart3, color: '#FF3040', status: 'active' },
  { title: 'Projects', desc: 'Delivery workspaces for transformation programs, artifacts, and workflows.', icon: FolderKanban, color: '#1173BC', status: 'active' },
  { title: 'Invoices', desc: 'Billing snapshots, invoice records, and financial coordination touchpoints.', icon: Wallet, color: '#10B981', status: 'active' },
  { title: 'Support', desc: 'Operational tickets, client enablement requests, and response tracking.', icon: LifeBuoy, color: '#FF9F1A', status: 'active' },
  { title: 'Documents', desc: 'Controlled access to blueprints, contracts, policies, and delivery files.', icon: FileText, color: '#6B5BFF', status: 'active' },
  { title: 'AI Operations', desc: 'Monitoring, governance, and run-state views for enterprise AI systems.', icon: Activity, color: '#C03C85', status: 'active' },
  { title: 'Analytics', desc: 'Insights on outcomes, adoption, operational health, and program velocity.', icon: BarChart3, color: '#00A3FF', status: 'preview' },
  { title: 'Governance', desc: 'Policies, approvals, risk controls, audit readiness, and oversight workflows.', icon: Shield, color: '#A855F7', status: 'preview' },
];

const recentActivity = [
  { label: 'Blueprint v2.1 approved', time: '12m ago', type: 'success' },
  { label: 'Agent deployment #47 complete', time: '1h ago', type: 'success' },
  { label: 'Governance review scheduled', time: '2h ago', type: 'info' },
  { label: 'Invoice #2024-08 posted', time: '3h ago', type: 'neutral' },
];

const quickStats = [
  { label: 'Programs', value: '12', icon: FolderKanban, color: '#1173BC' },
  { label: 'Documents', value: '148', icon: FileText, color: '#FF9F1A' },
  { label: 'AI Uptime', value: '99.2%', icon: Activity, color: '#10B981' },
  { label: 'Active Agents', value: '47', icon: Cpu, color: '#6B5BFF' },
];

export default function Portal() {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Client Portal"
        title={<>Client <GradientText>Portal</GradientText></>}
        subtitle="A secure workspace for programs, documents, invoices, AI operations, analytics, and governance."
        intro="Preview the GFF AI client workspace. Request access to unlock full portal capabilities."
        actions={
          <>
            <CTAButton to="/contact">Request Access</CTAButton>
            <CTAButton to="/company" variant="secondary">Learn About GFF AI</CTAButton>
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          {/* Preview Toggle */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border px-3 py-1" style={{ borderColor: 'var(--status-green-border)', backgroundColor: 'var(--status-green-bg)' }}>
                <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-green-text)' }} />
                <span className="text-[11px] font-mono uppercase" style={{ color: 'var(--status-green-text)' }}>Preview Mode</span>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)', color: 'var(--text-secondary)' }}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {showPreview && (
            <>
              {/* Cockpit Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 overflow-hidden rounded-[28px] border"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 lg:p-8" style={{ borderColor: 'var(--border-default)' }}>
                  <div>
                    <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Client Command Center</h2>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>A single surface for executive visibility, delivery coordination, and AI operations.</p>
                  </div>
                  <CTAButton to="/contact" variant="secondary">Request Demo</CTAButton>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
                  {quickStats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl border p-5"
                      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
                    >
                      <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                      <div className="mt-3 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom: Activity + Status */}
                <div className="grid gap-4 border-t p-6 lg:grid-cols-2 lg:p-8" style={{ borderColor: 'var(--border-default)' }}>
                  {/* Activity Feed */}
                  <div>
                    <h4 className="mb-4 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Recent Activity</h4>
                    <div className="space-y-3">
                      {recentActivity.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: item.type === 'success' ? 'rgba(16,185,129,0.12)' : 'var(--chip-bg)' }}>
                            {item.type === 'success' ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Clock className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />}
                          </div>
                          <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Panel */}
                  <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}>
                    <h4 className="mb-4 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>System Status</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'AI Operations', status: 'Operational', color: '#10B981' },
                        { label: 'Governance Engine', status: 'Operational', color: '#10B981' },
                        { label: 'Document Store', status: 'Operational', color: '#10B981' },
                        { label: 'Analytics Pipeline', status: 'Maintenance', color: '#F59E0B' },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-xs" style={{ color: s.color }}>{s.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Module Grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {portalModules.map((mod, i) => (
                  <motion.div
                    key={mod.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-[24px] border p-6 transition-all duration-300 hover:scale-[1.01]"
                    style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${mod.color}30`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${mod.color}10` }}
                      >
                        <mod.icon className="h-5 w-5" style={{ color: mod.color }} />
                      </div>
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase"
                        style={{ borderColor: mod.status === 'active' ? 'rgba(16,185,129,0.25)' : 'var(--border-default)', backgroundColor: mod.status === 'active' ? 'rgba(16,185,129,0.08)' : 'var(--chip-bg)', color: mod.status === 'active' ? '#10B981' : 'var(--text-muted)' }}
                      >
                        {mod.status}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{mod.title}</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{mod.desc}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {!showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[400px] flex-col items-center justify-center rounded-[28px] border py-16 text-center"
              style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'var(--chip-bg)' }}
              >
                <Lock className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Secure Workspace</h3>
              <p className="mt-3 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                Client portal access requires authentication. Contact GFF AI to request credentials.
              </p>
              <div className="mt-6">
                <CTAButton to="/contact">Request Access</CTAButton>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
