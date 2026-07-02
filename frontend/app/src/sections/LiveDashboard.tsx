import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Dot, ShieldCheck, TrendingUp, Users, Cpu, Globe, Layers } from 'lucide-react';
import { fetchDashboardActivity, fetchDashboardMetrics } from '@/lib/api/dashboardApi';
import { liveDashboardMetrics, liveDashboardPanels, siteContainerClass } from '@/lib/siteContent';

const metricIcons = [Users, Cpu, Layers, Globe, TrendingUp];

const activityFeed = [
  { label: 'New blueprint request', time: '2m ago', type: 'request' },
  { label: 'Agent deployment completed', time: '15m ago', type: 'deployment' },
  { label: 'Governance check passed', time: '32m ago', type: 'governance' },
  { label: 'Platform update rolled out', time: '1h ago', type: 'update' },
];

export default function LiveDashboard() {
  const [metrics, setMetrics] = useState(liveDashboardMetrics);
  const [activity, setActivity] = useState(activityFeed);

  useEffect(() => {
    let mounted = true;
    fetchDashboardMetrics()
      .then((items) => {
        if (!mounted) return;
        if (items && items.length > 0) {
          setMetrics(items.map((m) => ({ label: m.label, value: m.value })));
        }
      })
      .catch(() => {});

    fetchDashboardActivity()
      .then((data) => {
        if (!mounted) return;
        if (data.activity && data.activity.length > 0) {
          setActivity(
            data.activity.map((a) => ({
              label: a.label,
              time: a.time,
              type: a.activity_type,
            })),
          );
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const icons = useMemo(() => {
    return [Users, Cpu, Layers, Globe, TrendingUp];
  }, []);

  return (
    <section id="live-dashboard" className="relative py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(17,115,188,0.06), transparent 50%), radial-gradient(circle at 90% 10%, rgba(154,0,3,0.04), transparent 30%)',
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
            <Activity className="h-3.5 w-3.5" />
            Live Dashboard
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Live AI Transformation <span className="text-gradient">Dashboard</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            A command-center view of the GFF AI ecosystem. Ecosystem snapshot for executive visibility.
          </motion.p>
        </div>

        {/* Dashboard Layout */}
        <div className="mt-14 grid gap-6 xl:grid-cols-[1fr_0.35fr]">
          {/* Main Dashboard Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[28px] border"
            style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
          >
            {/* Panel Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 lg:p-8" style={{ borderColor: 'var(--border-default)' }}>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1" style={{ borderColor: 'var(--status-green-border)', backgroundColor: 'var(--status-green-bg)' }}>
                  <Dot className="h-5 w-5 animate-pulse" style={{ color: 'var(--status-green-text)' }} />
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--status-green-text)' }}>Ecosystem Snapshot</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Command center overview
                </h3>
              </div>
              <div
                className="rounded-2xl border px-4 py-2.5 text-sm"
                style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)', color: 'var(--text-muted)' }}
              >
                Example operating view
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:p-8">
              {metrics.map((metric, index) => {
                const Icon = icons[index] || metricIcons[index] || Users;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                    <div className="mt-4 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {metric.value}
                    </div>
                    <div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {metric.label}
                    </div>
                    {/* Mini bar chart */}
                    <div className="mt-3 flex items-end gap-1 h-6">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 5 ? 'var(--gff-blue)' : 'var(--border-hover)',
                            opacity: 0.6 + (i * 0.06),
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Panel - Status */}
            <div className="mx-6 mb-6 rounded-2xl border p-5 lg:mx-8 lg:mb-8" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)' }}>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Activity className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gff-blue)' }} />
                Active programs, advisory sessions, and platform readiness signals are summarized here for a premium ecosystem view.
              </div>
            </div>
          </motion.div>

          {/* Side Panels */}
          <div className="space-y-6">
            {/* Detail Panels */}
            {liveDashboardPanels.map((panel, index) => (
              <motion.div
                key={panel.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>{panel.title}</span>
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gff-blue)' }} />
                </div>
                <div className="mt-3 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{panel.value}</div>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{panel.detail}</p>
              </motion.div>
            ))}

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
            >
              <h4 className="mb-4 text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Recent Activity</h4>
              <div className="space-y-3">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: i === 0 ? '#10B981' : 'transparent' }} />
                      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: i === 0 ? '#10B981' : 'var(--border-hover)' }} />
                    </div>
                    <span className="flex-1 text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
