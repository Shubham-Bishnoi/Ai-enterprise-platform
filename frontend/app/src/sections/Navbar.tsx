import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';

const navLinks = [
  { label: 'Why GFF AI', href: '#hero' },
  { label: 'Solutions', href: '#what-we-build' },
  { label: 'Industries', href: '#industries' },
  { label: 'AI Foundry', href: '#foundry-process' },
  { label: 'Resources', href: '#productized-assets' },
  { label: 'Company', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0D0D0D]/70 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
        style={scrolled ? {
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3), 0 0 40px rgba(17,115,188,0.04)',
        } : {}}
      >
        <div className="mx-auto max-w-[1740px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#9A0003" />
                      <stop offset="15%" stopColor="#FF3040" />
                      <stop offset="40%" stopColor="#C03C85" />
                      <stop offset="70%" stopColor="#6B5BFF" />
                      <stop offset="100%" stopColor="#1173BC" />
                    </linearGradient>
                  </defs>
                  <polygon points="20,2 36,12 36,28 20,38 4,28 4,12" fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" />
                  <polygon points="20,8 30,14 30,26 20,32 10,26 10,14" fill="url(#logoGrad)" opacity="0.15" />
                  <path d="M16 28 L16 16 L20 12 L24 16 L24 20 L20 24 L20 28" fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display font-bold text-lg leading-none tracking-tight">GFF AI</span>
                <span className="text-[10px] text-muted-text tracking-[0.2em] uppercase leading-none mt-0.5">Garage | Foundry | Factory</span>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="relative px-4 py-2 text-sm text-muted-text hover:text-white transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gff-gradient rounded-full group-hover:w-1/2 transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-sm text-muted-text hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
                <span>Global</span>
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo('#contact')}
                className="px-5 py-2.5 bg-gff-gradient text-white text-sm font-medium rounded-2xl sheen-btn hover-gff-glow transition-all duration-300"
              >
                Book a Consultation
              </motion.button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pt-20"
            style={{
              background: 'rgba(13,13,13,0.97)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl font-display text-white hover-text-gradient transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => scrollTo('#contact')}
                className="mt-4 px-8 py-3 bg-gff-gradient text-white font-medium rounded-2xl hover-gff-glow transition-all"
              >
                Book a Consultation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
