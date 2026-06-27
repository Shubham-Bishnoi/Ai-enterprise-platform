import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Zap, ChevronRight } from 'lucide-react';

const industries = [
  {
    name: 'Banking',
    image: '/assets/Z4.png',
    tagline: 'Intelligent Financial Operations',
    solutions: ['AI-Powered Fraud Detection', 'Intelligent Credit Scoring', 'Conversational Banking', 'Regulatory Compliance AI', 'Algorithmic Trading Intelligence'],
    impact: '25-40% cost reduction',
    icon: TrendingUp,
    color: '#1173BC',
  },
  {
    name: 'Healthcare',
    image: '/assets/Z2.png',
    tagline: 'AI-Driven Patient Care',
    solutions: ['Clinical Decision Support', 'Patient Risk Stratification', 'Medical Imaging AI', 'Drug Discovery Accelerator', 'Operational Workflow AI'],
    impact: '30-50% faster diagnosis',
    icon: Users,
    color: '#10B981',
  },
  {
    name: 'Insurance',
    image: '/assets/Z1.png',
    tagline: 'Autonomous Claims & Risk',
    solutions: ['Claims Automation', 'Risk Assessment AI', 'Fraud Detection', 'Customer Experience AI', 'Predictive Underwriting'],
    impact: '40% faster claims processing',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    name: 'Manufacturing',
    image: '/assets/Z9.png',
    tagline: 'Smart Factory Operations',
    solutions: ['Predictive Maintenance', 'Quality Control AI Vision', 'Supply Chain Optimization', 'Digital Twin Factory', 'Energy Optimization AI'],
    impact: '20-35% efficiency gain',
    icon: Zap,
    color: '#FF3040',
  },
  {
    name: 'Energy',
    image: '/assets/Z12.png',
    tagline: 'Intelligent Grid Management',
    solutions: ['Grid Optimization', 'Predictive Maintenance', 'Energy Trading AI', 'Smart Meter Analytics', 'Carbon Footprint AI'],
    impact: '15-25% energy savings',
    icon: TrendingUp,
    color: '#8B5CF6',
  },
  {
    name: 'Education',
    image: '/assets/Z8.png',
    tagline: 'Personalized Learning AI',
    solutions: ['AI Tutoring Systems', 'Administrative Automation', 'Research Acceleration', 'Student Success Analytics', 'AI Lab Setup'],
    impact: '3-5x learning outcomes',
    icon: Users,
    color: '#C03C85',
  },
  {
    name: 'Retail',
    image: '/assets/Z10.png',
    tagline: 'Intelligent Commerce',
    solutions: ['Demand Forecasting', 'Personalization Engine', 'Supply Chain AI', 'Visual Search', 'Customer Analytics'],
    impact: '20-30% revenue growth',
    icon: TrendingUp,
    color: '#FF6B21',
  },
  {
    name: 'Public Sector',
    image: '/assets/Z11.png',
    tagline: 'Smart Governance',
    solutions: ['Smart Cities Platform', 'Citizen Service AI', 'Policy Analytics', 'Emergency Response AI', 'Document Intelligence'],
    impact: '30-50% service improvement',
    icon: Users,
    color: '#2563EB',
  },
  {
    name: 'Telecom',
    image: '/assets/Z14.png',
    tagline: 'Network Intelligence',
    solutions: ['Network Operations AI', 'Customer Experience AI', '5G Analytics', 'Churn Prediction', 'Revenue Assurance'],
    impact: '25-40% OPEX reduction',
    icon: Zap,
    color: '#00A3FF',
  },
  {
    name: 'Life Sciences',
    image: '/assets/Z3.png',
    tagline: 'Accelerated Discovery',
    solutions: ['Clinical Trials Optimization', 'Genomics AI', 'Research Intelligence', 'Regulatory AI', 'Molecule Generation'],
    impact: '2-3x faster research cycles',
    icon: TrendingUp,
    color: '#A855F7',
  },
  {
    name: 'Audit',
    image: '/assets/Z5.png',
    tagline: 'Intelligent Assurance',
    solutions: ['Risk Analytics', 'Compliance Automation', 'Continuous Auditing', 'Fraud Detection AI', 'Reporting Intelligence'],
    impact: '50-70% audit efficiency',
    icon: Users,
    color: '#EF4444',
  },
  {
    name: 'Advisory',
    image: '/assets/Z7.png',
    tagline: 'AI-Enhanced Consulting',
    solutions: ['Strategy AI', 'Transformation Advisory', 'M&A Intelligence', 'Market Analysis AI', 'Client Insight Platform'],
    impact: '3-5x advisory capacity',
    icon: Zap,
    color: '#6B5BFF',
  },
];

export default function IndustrySolutions() {
  const [activeIndustry, setActiveIndustry] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="industries" className="py-24 lg:py-32 px-6 lg:px-16" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16 bg-white/20" />
            <span className="text-sm font-mono text-muted-text tracking-wider uppercase">Industry Solutions</span>
            <span className="h-px w-16 bg-white/20" />
          </div>
          <h2 className="font-display font-bold text-white text-3xl md:text-5xl lg:text-6xl leading-tight">
            Enterprise AI for <span className="text-gradient">Every Industry</span>
          </h2>
          <p className="mt-4 text-muted-text max-w-2xl mx-auto text-lg">
            Industry-specific AI solutions designed to transform operations, unlock new revenue, and accelerate growth.
          </p>
        </motion.div>

        {/* Featured Industries - Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {industries.slice(0, 6).map((ind, i) => (
            <FeaturedIndustryCard
              key={ind.name}
              ind={ind}
              index={i}
              onExpand={() => setActiveIndustry(activeIndustry === i ? null : i)}
              isExpanded={activeIndustry === i}
            />
          ))}
        </div>

        {/* More Industries - Compact Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(26,26,26,0.4)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h3 className="text-sm font-mono text-muted-text tracking-wider uppercase mb-4 text-center">
            Also Serving
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.slice(6).map((ind, i) => (
              <CompactIndustryCard key={ind.name} ind={ind} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedIndustryCard({
  ind,
  index,
  onExpand,
  isExpanded,
}: {
  ind: typeof industries[0];
  index: number;
  onExpand: () => void;
  isExpanded: boolean;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rX = useSpring(rotateX, { stiffness: 220, damping: 18, mass: 0.6 });
  const rY = useSpring(rotateY, { stiffness: 220, damping: 18, mass: 0.6 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        backgroundColor: '#0A0A0A',
        border: `1px solid ${ind.color}20`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.04)`,
        transformStyle: 'preserve-3d',
        rotateX: rX,
        rotateY: rY,
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        borderColor: `${ind.color}50`,
        boxShadow: `0 0 0 1px ${ind.color}40, 0 20px 50px ${ind.color}20, 0 0 30px ${ind.color}15`,
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        el.style.setProperty('--mx', `${px}%`);
        el.style.setProperty('--my', `${py}%`);

        const dx = x - rect.width / 2;
        const dy = y - rect.height / 2;
        const max = 3.5;
        rotateY.set(Math.max(-max, Math.min(max, (dx / (rect.width / 2)) * max)));
        rotateX.set(Math.max(-max, Math.min(max, (-dy / (rect.height / 2)) * max)));
      }}
      onMouseLeave={(e) => {
        rotateX.set(0);
        rotateY.set(0);
        e.currentTarget.style.setProperty('--mx', '50%');
        e.currentTarget.style.setProperty('--my', '40%');
      }}
    >
      {/* Radial glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(500px circle at var(--mx, 50%) var(--my, 40%), ${ind.color}15, transparent 55%)`,
        }}
      />

      <div className="p-5 relative z-10">
        {/* Top row: Icon + Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-60"
              style={{ backgroundColor: `${ind.color}20` }}
            />
            <img
              src={ind.image}
              alt={ind.name}
              className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              style={{ filter: `drop-shadow(0 0 12px ${ind.color}30)` }}
            />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white group-hover:text-gradient transition-all">
              {ind.name}
            </h3>
            <p className="text-xs text-muted-text">{ind.tagline}</p>
          </div>
        </div>

        {/* Impact badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium mb-3"
          style={{ backgroundColor: `${ind.color}12`, color: ind.color, border: `1px solid ${ind.color}25` }}
        >
          <TrendingUp className="w-3 h-3" />
          {ind.impact}
        </div>

        {/* Solutions list */}
        <div className="space-y-1.5 mb-4">
          {ind.solutions.slice(0, 3).map((sol) => (
            <div key={sol} className="flex items-center gap-2 text-xs text-white/60">
              <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: ind.color }} />
              {sol}
            </div>
          ))}
          {ind.solutions.length > 3 && (
            <div className="text-[11px] text-muted-text pl-5">+{ind.solutions.length - 3} more solutions</div>
          )}
        </div>

        {/* Expand button */}
        <button
          onClick={(e) => { e.stopPropagation(); onExpand(); }}
          className="flex items-center gap-1 text-xs font-medium text-white/60 hover:text-white transition-colors group/btn"
        >
          <span>{isExpanded ? 'Show Less' : 'Explore Solutions'}</span>
          <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : 'group-hover/btn:translate-x-0.5'}`} />
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-1.5">
                {ind.solutions.slice(3).map((sol) => (
                  <div key={sol} className="flex items-center gap-2 text-xs text-white/60">
                    <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: ind.color }} />
                    {sol}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CompactIndustryCard({ ind, index }: { ind: typeof industries[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col items-center text-center p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
      whileHover={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: `${ind.color}40`,
        boxShadow: `0 8px 24px ${ind.color}15`,
      }}
    >
      <div className="relative w-12 h-12 mb-2">
        <div
          className="absolute inset-0 rounded-xl blur-lg opacity-40"
          style={{ backgroundColor: `${ind.color}25` }}
        />
        <img
          src={ind.image}
          alt={ind.name}
          className="relative w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          style={{ filter: `drop-shadow(0 0 8px ${ind.color}25)` }}
        />
      </div>
      <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
        {ind.name}
      </span>
    </motion.div>
  );
}
