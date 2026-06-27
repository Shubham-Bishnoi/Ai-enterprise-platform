import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const capabilities = [
  {
    title: 'Agentic AI Systems',
    desc: 'Autonomous agents that plan, reason and execute complex enterprise tasks.',
    image: '/assets/f0.png',
    border: '#FF3040',
  },
  {
    title: 'AI Strategy & Advisory',
    desc: 'Roadmaps and operating models for AI-driven transformation.',
    image: '/assets/f.png',
    border: '#FF9F1A',
  },
  {
    title: 'AI Engineering',
    desc: 'Custom AI solutions and platforms built for scale.',
    image: '/assets/f1.png',
    border: '#4B8DFF',
  },
  {
    title: 'Intelligent Automation',
    desc: 'End-to-end automation of enterprise workflows with AI at the core.',
    image: '/assets/f2.png',
    border: '#1173BC',
  },
  {
    title: 'AI Governance',
    desc: 'Responsible AI with trust, transparency and compliance.',
    image: '/assets/f3.png',
    border: '#2563EB',
  },
  {
    title: 'AI Labs & Innovation',
    desc: "Co-innovate in our labs and build what's next together.",
    image: '/assets/f4.png',
    border: '#A855F7',
  },
];

export default function WhatWeBuild() {
  return (
    <section id="what-we-build" className="py-20 lg:py-24">
      <div className="w-[95vw] max-w-[1800px] mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <span className="h-px w-24 bg-[#1173BC]/40" />
            <span className="text-sm font-semibold tracking-[0.12em] uppercase text-[#1173BC]">
              WHAT WE BUILD
            </span>
            <span className="h-px w-24 bg-[#1173BC]/40" />
          </div>
          <h2 className="font-display font-extrabold text-white leading-[1.05] tracking-tight text-[32px] md:text-[48px] lg:text-[64px]">
            AI SOLUTIONS FOR THE <span className="text-[#1173BC]">NEXT GENERATION</span> ENTERPRISE
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 mt-10">
          {capabilities.map((cap, i) => (
            <BuildCard
              key={cap.title}
              cap={cap}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function BuildCard({
  cap,
  index,
}: {
  cap: { title: string; desc: string; image: string; border: string };
  index: number;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rX = useSpring(rotateX, { stiffness: 220, damping: 18, mass: 0.6 });
  const rY = useSpring(rotateY, { stiffness: 220, damping: 18, mass: 0.6 });

  const { r, g, b } = hexToRgb(cap.border);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group relative rounded-3xl overflow-hidden p-5 h-[380px] flex flex-col min-w-0"
      style={{
        backgroundColor: '#050505',
        border: `1px solid ${cap.border}`,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        transformStyle: 'preserve-3d',
        rotateX: rX,
        rotateY: rY,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
        boxShadow: `0 0 0 1px ${cap.border}, 0 24px 60px rgba(${r},${g},${b},0.28), 0 0 26px rgba(${r},${g},${b},0.20)`,
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
        const max = 4.5;
        rotateY.set(Math.max(-max, Math.min(max, (dx / (rect.width / 2)) * max)));
        rotateX.set(Math.max(-max, Math.min(max, (-dy / (rect.height / 2)) * max)));
      }}
      onMouseLeave={(e) => {
        rotateX.set(0);
        rotateY.set(0);
        e.currentTarget.style.setProperty('--mx', '50%');
        e.currentTarget.style.setProperty('--my', '30%');
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(${r},${g},${b},0.08) 0%, rgba(5,5,5,0) 65%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(520px circle at var(--mx, 50%) var(--my, 30%), rgba(${r},${g},${b},0.18), transparent 55%)`,
        }}
      />

      <div className="flex items-center justify-center mt-1">
        <div className="relative w-[170px] h-[170px]">
          <div
            className="absolute inset-0 blur-2xl opacity-70"
            style={{ backgroundColor: `rgba(${r},${g},${b},0.18)` }}
          />
          <img
            src={cap.image}
            alt={cap.title}
            className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            style={{
              filter: `drop-shadow(0 0 18px rgba(${r},${g},${b},0.22))`,
              transform: 'translateZ(24px)',
            }}
          />
        </div>
      </div>

      <h3 className="mt-4 text-base font-display font-bold text-white/90 group-hover:text-white transition-colors">
        {cap.title}
      </h3>

      <p className="mt-2 text-sm text-muted-text leading-relaxed">
        {cap.desc}
      </p>

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-1 text-sm font-medium text-white/75 group-hover:text-white transition-colors">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
