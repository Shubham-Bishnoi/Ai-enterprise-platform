import { useRef } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Building2, Globe, Factory, Network, GraduationCap } from 'lucide-react';

const stats = [
  { icon: BrainCircuit, label: 'AI Use Cases', color: '#EF4444', display: '500+' },
  { icon: Building2, label: 'Industries', color: '#1173BC', display: '20+' },
  { icon: Globe, label: 'Global Delivery Model', color: '#10B981', display: 'Global' },
  { icon: Factory, label: 'Agent Factory', color: '#F59E0B', display: 'Agent Factory' },
  { icon: Network, label: 'Knowledge Graph Factory', color: '#8B5CF6', display: 'KG Factory' },
  { icon: GraduationCap, label: 'AI Academy', color: '#FF3040', display: 'AI Academy' },
];

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center text-center group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
      >
        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
      </div>
      <span className="text-xl lg:text-2xl font-display font-bold text-white mb-1">
        {stat.display}
      </span>
      <span className="text-xs text-muted-text">{stat.label}</span>
    </motion.div>
  );
}

export default function StatsBar() {
  return (
    <section className="relative z-20 -mt-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl px-8 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          style={{
            background: 'rgba(26, 26, 26, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 30px rgba(17,115,188,0.08)',
          }}
        >
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
