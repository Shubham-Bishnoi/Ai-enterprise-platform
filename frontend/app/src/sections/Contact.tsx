import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, ChevronDown, Check } from 'lucide-react';

const services = [
  'AI Strategy Consulting',
  'Agentic AI Development',
  'AI Governance',
  'Data Platform Engineering',
  'Digital Twins',
  'AI Training & Upskilling',
  'Managed AI Services',
  'Other',
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', country: '', service: '' });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Neural constellation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 80;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(13, 13, 13, 0.15)';
      ctx.fillRect(0, 0, w, h);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 48, 64, 0.55)' : 'rgba(17, 115, 188, 0.6)';
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(17, 115, 188, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 px-6 lg:px-16 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left - Map Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <canvas
              ref={canvasRef}
              className="w-full h-80 lg:h-full rounded-2xl"
              style={{ background: '#0D0D0D', minHeight: 400 }}
            />
            {/* Overlay title */}
            <div className="absolute top-6 left-6">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
                Global <span className="text-gradient">Reach</span>
              </h2>
              <p className="text-sm text-muted-text mt-2">Singapore — UK — India</p>
            </div>

            {/* Stats overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-4">
              {[
                { label: 'Countries', value: '8+' },
                { label: 'Clients', value: '50+' },
                { label: 'Experts', value: '200+' },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 glass-card rounded-lg p-3 text-center">
                  <span className="text-lg font-display font-bold text-white block">{stat.value}</span>
                  <span className="text-[10px] text-muted-text uppercase">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-display font-bold text-white mb-6">Get in Touch</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-muted-text mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Enter"
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-text/40 focus:border-core-blue/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-text mb-1.5 block">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                      placeholder="Enter"
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-text/40 focus:border-core-blue/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-muted-text mb-1.5 block">Business Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="Enter"
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-text/40 focus:border-core-blue/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-text mb-1.5 block">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="Enter"
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-text/40 focus:border-core-blue/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-muted-text mb-1.5 block">Country / Region</label>
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                      placeholder="Enter"
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-text/40 focus:border-core-blue/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs text-muted-text mb-1.5 block">Service Interest</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
                      className="w-full appearance-none bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-core-blue/50 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select a Service</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-[38px] w-4 h-4 text-muted-text pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gff-gradient text-white font-medium rounded-2xl sheen-btn hover-gff-glow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-12 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gff-gradient-soft border border-white/10 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-muted-text">Our team will get back to you within 24 hours.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
