import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';
import { trackAnalyticsEvent } from '@/lib/api/analyticsApi';
import { useTheme } from '../context/ThemeContext';
import { primaryNavItems } from '../lib/siteContent';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const onHero = location.pathname === '/' && !location.hash && !scrolled;
  const lightOnHero = theme === 'light' && onHero;

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

  const navBackdrop = scrolled
    ? 'bg-[var(--bg-primary)]/70 backdrop-blur-2xl border-b border-[var(--border-default)]'
    : 'bg-transparent';

  const trackNavClick = (label: string, to: string) => {
    void trackAnalyticsEvent({
      eventName: 'navigation_clicked',
      source: 'navbar',
      component: 'Navbar',
      payload: { label, to },
    });
    if (label.toLowerCase().includes('consultation')) {
      void trackAnalyticsEvent({
        eventName: 'book_consultation_clicked',
        source: 'navbar',
        component: 'Navbar',
        payload: { label, to },
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBackdrop}`}
        style={scrolled ? {
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: 'var(--gff-nav-shadow)',
        } : {}}
      >
        <div className="mx-auto max-w-[1740px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 group flex-shrink-0"
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to="/"
                onClick={() => {
                  trackNavClick('Home', '/');
                  if (location.pathname === '/' && !location.hash) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
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
                  <span className="font-display font-bold text-lg leading-none tracking-tight" style={{ color: lightOnHero ? '#ffffff' : 'var(--text-primary)' }}>GFF AI</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5" style={{ color: lightOnHero ? 'rgba(255,255,255,0.72)' : 'var(--text-secondary)' }}>Garage | Foundry | Factory</span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Nav - hidden below 1180px */}
            <div className="hidden min-[1180px]:flex flex-1 min-w-0 items-center justify-center gap-1 px-4 xl:gap-2 2xl:gap-3">
              {desktopNavItems.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `group relative whitespace-nowrap rounded-xl px-2 py-2 text-[12px] leading-none transition-colors duration-300 xl:px-2.5 xl:text-[13px] 2xl:px-3 2xl:text-sm ${isActive ? (lightOnHero ? 'text-white' : 'text-[var(--text-primary)]') : (lightOnHero ? 'text-white/70 hover:text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]')
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
            <div className="hidden min-[1180px]:flex shrink-0 items-center gap-2.5">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${lightOnHero ? 'border-white/12 bg-white/[0.06] text-white/80 hover:border-white/20 hover:text-white' : 'border-[var(--border-default)] bg-[var(--chip-bg)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <Link
                to="/portal"
                className={`rounded-2xl border px-3.5 py-2 text-[13px] transition-all duration-300 whitespace-nowrap xl:px-4 xl:text-sm ${lightOnHero ? 'border-white/12 bg-white/[0.06] text-white/90 hover:border-white/20' : 'border-[var(--border-default)] bg-[var(--chip-bg)] hover:border-[var(--border-hover)]'}`}
                style={lightOnHero ? undefined : { color: 'var(--text-primary)' }}
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
                  onClick={() => trackNavClick('Book a Consultation', '/contact')}
                  className="rounded-2xl bg-gff-gradient px-4 py-2.5 text-[13px] font-medium text-white sheen-btn transition-all duration-300 hover-gff-glow whitespace-nowrap xl:px-5 xl:text-sm"
                >
                  Book a Consultation
                </Link>
              </motion.div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-2 min-[1180px]:hidden">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${lightOnHero ? 'border-white/12 text-white/85' : 'border-[var(--border-default)] text-[var(--text-secondary)]'}`}
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2"
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                style={{ color: lightOnHero ? '#ffffff' : 'var(--text-primary)' }}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
              background: theme === 'dark' ? 'rgba(13,13,13,0.97)' : 'rgba(246,248,252,0.97)',
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
                    onClick={() => trackNavClick(link.label, link.to)}
                    className={({ isActive }) =>
                      `text-2xl font-display transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)] hover-text-gradient'
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
                  onClick={() => trackNavClick('Client Login', '/portal')}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--chip-bg)] px-8 py-3 transition-all duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Client Login
                </Link>
                <Link
                  to="/contact"
                  onClick={() => trackNavClick('Book a Consultation', '/contact')}
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
