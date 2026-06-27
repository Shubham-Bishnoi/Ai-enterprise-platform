import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'GARAGE',
    subtitle: 'IDEATE',
    desc: 'We explore ideas, problems and possibilities.',
    image: '/assets/Frame.png',
    border: '#FF3040',
  },
  {
    num: '02',
    title: 'FOUNDRY',
    subtitle: 'FORGE',
    desc: 'We engineer, train and forge AI models and agents.',
    image: '/assets/Frame (1).png',
    border: '#FF9F1A',
  },
  {
    num: '03',
    title: 'FACTORY',
    subtitle: 'ORCHESTRATE',
    desc: 'We orchestrate intelligent workflows and integrate systems.',
    image: '/assets/Frame (2).png',
    border: '#1173BC',
  },
  {
    num: '04',
    title: 'DEPLOY',
    subtitle: 'DEPLOY',
    desc: 'We launch AI solutions into your enterprise environment.',
    image: '/assets/Frame (3).png',
    border: '#00A3FF',
  },
  {
    num: '05',
    title: 'EVOLVE',
    subtitle: 'EVOLVE',
    desc: 'We monitor, learn and continuously evolve for greater impact.',
    border: '#9B5CFF',
  },
];

export default function AIFoundryProcess() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="foundry-process" className="py-20 lg:py-24" ref={ref}>
      <div className="w-[95vw] max-w-[1800px] mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-6">
            <span className="h-px w-24 bg-white/20" />
            <h2 className="text-white font-bold tracking-[0.05em] text-lg sm:text-xl">
              THE <span className="text-gradient">AI FOUNDRY</span> PROCESS
            </h2>
            <span className="h-px w-24 bg-white/20" />
          </div>
        </motion.div>

        {/* Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative rounded-3xl p-5 cursor-default overflow-hidden h-[460px] flex flex-col min-w-0"
              style={{
                backgroundColor: '#050505',
                border: `1px solid ${step.border}`,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                boxShadow: `0 0 0 1px ${step.border}, 0 22px 55px ${step.border}30, 0 0 26px ${step.border}22`,
              }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(900px 420px at 50% 0%, ${step.border}12, transparent 60%)`,
                  }}
                />
              </div>

              {/* Icon */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-[240px] h-[240px]">
                  <div
                    className="absolute inset-0 rounded-[32px] blur-2xl opacity-70"
                    style={{ backgroundColor: `${step.border}22` }}
                  />
                  {'image' in step ? (
                    <img
                      src={(step as { image: string }).image}
                      alt={step.title}
                      className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Brain
                        className="w-28 h-28 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          color: step.border,
                          filter: `drop-shadow(0 0 18px ${step.border}66) drop-shadow(0 0 38px ${step.border}33)`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Number */}
              <span className="mt-3 text-xs font-mono text-white/60 mb-2 block">{step.num}</span>

              {/* Title */}
              <h3 className="text-lg font-display font-bold text-white/85 mb-2 transition-colors group-hover:text-white">
                {step.subtitle}
              </h3>

              {/* Subtitle */}
              <span className="text-xs font-mono tracking-wider uppercase mb-4 block" style={{ color: step.border }}>
                {step.title}
              </span>

              {/* Description */}
              <p className="text-sm text-muted-text leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-10 text-lg text-white"
        >
          BUILT IN OUR <span className="text-[#FF3040] font-medium">GARAGE</span>. FORGED IN OUR{' '}
          <span className="text-[#FF9F1A] font-medium">FOUNDRY</span>. DEPLOYED IN YOUR{' '}
          <span className="text-[#1173BC] font-medium">FACTORY</span>.
        </motion.p>
      </div>
    </section>
  );
}
