import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';
import { primaryNavItems } from '@/lib/siteContent';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopNavItems = useMemo(
    () => primaryNavItems.filter((item) => !item.mobileOnly && item.label !== 'Contact'),
    []
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
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
            <motion.div
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to="/"
                onClick={() => {
                  if (location.pathname === '/' && !location.hash) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2"
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
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden min-[1180px]:flex items-center gap-0.5">
              {desktopNavItems.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `group relative rounded-xl px-3 py-2 text-[13px] transition-colors duration-300 xl:px-4 xl:text-sm ${isActive ? 'text-white' : 'text-muted-text hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-gff-gradient transition-all duration-300 ${isActive ? 'w-1/2' : 'w-0 group-hover:w-1/2'
                          }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden min-[1180px]:flex items-center gap-3">
              <Link
                to="/portal"
                className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-2 text-sm text-white/85 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                Client Login
              </Link>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex"
              >
                <Link
                  to="/contact"
                  className="rounded-2xl bg-gff-gradient px-5 py-2.5 text-sm font-medium text-white sheen-btn transition-all duration-300 hover-gff-glow"
                >
                  Book a Consultation
                </Link>
              </motion.div>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="min-[1180px]:hidden p-2 text-white"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
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
            id="mobile-navigation"
            className="fixed inset-0 z-40 pt-20"
            style={{
              background: 'rgba(13,13,13,0.97)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {primaryNavItems.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `text-2xl font-display transition-colors ${isActive ? 'text-white' : 'text-white hover-text-gradient'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 flex flex-col items-center gap-3"
              >
                <Link
                  to="/portal"
                  className="rounded-2xl border border-white/12 bg-white/[0.03] px-8 py-3 text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Client Login
                </Link>
                <Link
                  to="/contact"
                  className="rounded-2xl bg-gff-gradient px-8 py-3 font-medium text-white hover-gff-glow transition-all"
                >
                  Book a Consultation
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
