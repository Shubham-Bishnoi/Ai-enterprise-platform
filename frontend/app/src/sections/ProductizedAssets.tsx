import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, BookOpen, Shield, Play, FileText, Code, Settings } from 'lucide-react';

const products = [
  { icon: ShoppingBag, label: 'Agent Marketplace', desc: 'Pre-built AI agents for common enterprise tasks' },
  { icon: BookOpen, label: 'AI Academy', desc: 'Learn AI engineering from industry experts' },
  { icon: Shield, label: 'Control Center', desc: 'Unified AI governance and monitoring dashboard' },
  { icon: Play, label: 'Runtime Governance', desc: 'Real-time AI policy enforcement and compliance' },
  { icon: FileText, label: 'Blueprint Generator', desc: 'Auto-generate AI transformation roadmaps' },
  { icon: Code, label: 'Developer Platform', desc: 'APIs, SDKs, and tools for AI builders' },
];

const garageFeatures = ['Discover AI', 'Workshops', 'AI Labs', 'Experiment Zone'];
const featuresList = ['Build Agents', 'Runtime', 'Data Fabric', 'AI Engineering'];
const architectureItems = ['Data & Intelligence Layer', 'AI & Agent Layer', 'Orchestration Layer', 'Integration Layer'];

export default function ProductizedAssets() {
  return (
    <section id="productized-assets" className="py-24 lg:py-32 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left */}
            <div className="lg:w-1/3">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                PRODUCTIZED<br /><span className="text-gradient">ASSETS</span>
              </h2>
              <p className="text-muted-text mb-6">
                Challenges — Solutions — Architecture — ROI — Talk To Agent
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((p, i) => (
                  <motion.button
                    key={p.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group flex items-center gap-2 px-4 py-3 glass-card rounded-lg text-left text-sm text-white hover:glow-border-blue transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 text-core-blue group-hover:translate-x-0.5 transition-transform" />
                    {p.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right - Dashboard */}
            <div className="lg:w-2/3 glass-card rounded-2xl p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Garage Column */}
                <div>
                  <h4 className="text-sm font-display font-bold text-white mb-4">Garage</h4>
                  <div className="space-y-2">
                    {garageFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-muted-text hover:text-white transition-colors cursor-default">
                        <ArrowRight className="w-3 h-3 text-core-blue" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Column */}
                <div>
                  <h4 className="text-sm font-display font-bold text-white mb-4">Features</h4>
                  <div className="space-y-2">
                    {featuresList.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-muted-text hover:text-white transition-colors cursor-default">
                        <ArrowRight className="w-3 h-3 text-core-blue" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architecture Column */}
                <div>
                  <h4 className="text-sm font-display font-bold text-ice-blue mb-4">AI ARCHITECTURE</h4>
                  <div className="space-y-2">
                    {architectureItems.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-muted-text hover:text-white transition-colors cursor-default">
                        <ArrowRight className="w-3 h-3 text-ice-blue" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative chip graphic */}
              <div className="mt-8 flex justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-xl border border-white/10 bg-gff-gradient-soft animate-pulse-glow" />
                  <div className="absolute inset-2 rounded-lg border border-white/15 flex items-center justify-center">
                    <Settings className="w-10 h-10 text-white/70" />
                  </div>
                  {/* Orbiting dots */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-core-blue"
                      animate={{
                        x: [Math.cos((i * Math.PI) / 2) * 50, Math.cos((i * Math.PI) / 2 + Math.PI) * 50, Math.cos((i * Math.PI) / 2) * 50],
                        y: [Math.sin((i * Math.PI) / 2) * 50, Math.sin((i * Math.PI) / 2 + Math.PI) * 50, Math.sin((i * Math.PI) / 2) * 50],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                      style={{ left: '50%', top: '50%', marginLeft: -4, marginTop: -4 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
