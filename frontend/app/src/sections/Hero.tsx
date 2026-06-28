import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, FileText, MessageSquare } from 'lucide-react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#030305]">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url(/assets/noise-texture.png)', backgroundRepeat: 'repeat' }} />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#030305] via-[#030305]/75 to-transparent" />

      <div className="relative z-10 flex flex-col pt-16 lg:pt-20">
        <div className="relative min-h-[560px] lg:min-h-[600px] xl:min-h-[630px]">
          <div className="absolute inset-y-0 right-0 w-full overflow-hidden lg:w-[56%] xl:w-[54%]">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover lg:translate-x-12 xl:translate-x-20 2xl:translate-x-24"
              style={{
                objectFit: 'cover',
                objectPosition: '70% center',
                filter: 'brightness(1.05) contrast(1.08) saturate(1.02)',
              }}
            >
              <source src="/assets/hero-video.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 72% 45%, rgba(17,115,188,0.18), transparent 38%), radial-gradient(circle at 90% 28%, rgba(154,0,3,0.12), transparent 28%)',
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]/18" />
            <ParticleField />
          </div>

          <div className="relative z-20 flex min-h-[560px] items-center lg:min-h-[600px] xl:min-h-[620px] 2xl:min-h-[650px]">
            <div className="mx-auto w-full max-w-[1740px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
              <div className="relative z-20 w-full min-w-0 max-w-[780px] overflow-visible">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={loaded ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-mono tracking-[0.22em] text-ice-blue backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                    GARAGE | FOUNDRY | FACTORY
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-5 w-full max-w-full min-w-0 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-5xl lg:text-[48px] xl:text-[56px] 2xl:text-[62px]"
                >
                  <span className="block whitespace-normal lg:whitespace-nowrap">
                    Building the World's First
                  </span>
                  <span className="block whitespace-normal text-gradient lg:whitespace-nowrap">
                    AI-Native Enterprise
                  </span>
                  <span className="block whitespace-normal lg:whitespace-nowrap">
                    Transformation Company
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="w-full max-w-full break-normal text-base leading-relaxed text-muted-text lg:max-w-[820px] lg:text-lg xl:text-[19px]"
                >
                  <span className="hidden lg:block">
                    Combining Agentic AI, Knowledge Graphs, Industry Platforms, Talent Cloud,
                    <br />
                    and Managed AI Operations into a single transformation ecosystem.
                  </span>
                  <span className="block lg:hidden">
                    Combining Agentic AI, Knowledge Graphs, Industry Platforms, Talent Cloud, and Managed AI Operations into a single transformation ecosystem.
                  </span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="mt-8 flex max-w-full flex-wrap items-center gap-3 overflow-visible lg:flex-nowrap lg:gap-2.5 xl:gap-3"
                >
                  <button
                    onClick={() => document.querySelector('#blueprint')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex h-11 w-full max-w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gff-gradient px-4 text-[13px] text-white transition-all duration-300 hover-gff-glow sheen-btn sm:w-auto sm:justify-start lg:w-auto lg:px-4 xl:px-5 xl:text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="whitespace-nowrap">Generate My Enterprise AI Blueprint</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => document.querySelector('#foundry-process')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex h-11 w-full max-w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 text-[13px] text-white transition-all duration-300 btn-secondary sm:w-auto sm:justify-start lg:w-auto lg:px-4 xl:px-5 xl:text-sm"
                  >
                    <Play className="h-4 w-4" />
                    <span className="whitespace-nowrap">Experience GFF AI Live</span>
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('talk-to-agent-trigger');
                      if (el) el.click();
                    }}
                    className="group flex h-11 w-full max-w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 text-[13px] text-white transition-all duration-300 btn-secondary sm:w-auto sm:justify-start lg:w-auto lg:px-4 xl:px-5 xl:text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="whitespace-nowrap">Talk to GFF AI</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative z-20 mt-8 px-6 pb-6 sm:px-8 lg:mt-10 lg:px-12 xl:px-14 2xl:px-16"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 rounded-[28px] border border-white/8 bg-[#0b0b10]/92 px-5 py-6 backdrop-blur-xl sm:px-6 md:grid-cols-3 md:gap-5 md:px-8 lg:grid-cols-6 lg:gap-6 lg:px-10 lg:py-8">
            {[
              { value: '500+', label: 'AI Use Cases' },
              { value: '20+', label: 'Industries' },
              { value: 'Global', label: 'Global Delivery Model' },
              { value: 'Agent Factory', label: 'Agent Factory' },
              { value: 'KG Factory', label: 'Knowledge Graph Factory' },
              { value: 'AI Academy', label: 'AI Academy' },
            ].map((metric) => (
              <div
                key={metric.label + metric.value}
                className="flex min-h-[110px] min-w-0 flex-col items-center justify-center text-center"
              >
                <span className="mb-2 text-lg font-display font-bold leading-tight text-white lg:text-[1.7rem]">
                  {metric.value}
                </span>
                <span className="max-w-[10rem] text-xs leading-snug text-muted-text sm:text-sm">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* Floating Particle Field */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getSize = () => {
      const parent = canvas.parentElement;
      return {
        w: parent?.clientWidth ?? window.innerWidth,
        h: parent?.clientHeight ?? window.innerHeight,
      };
    };

    let { w, h } = getSize();
    canvas.width = w;
    canvas.height = h;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17, 115, 188, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(17, 115, 188, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      ({ w, h } = getSize());
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[5]"
    />
  );
}
