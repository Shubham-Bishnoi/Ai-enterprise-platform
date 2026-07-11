import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Youtube, Instagram, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { footerColumns, siteContainerClass } from '@/lib/siteContent';

const socials = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/gff-ai/', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: '#', label: 'Email' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer
      className="border-t py-16"
      style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--surface-dark)' }}
    >
      <div className={siteContainerClass}>
        <div className="mb-12 grid grid-cols-1 gap-12 xl:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))]">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="footerLogoGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#9A0003" />
                      <stop offset="15%" stopColor="#FF3040" />
                      <stop offset="40%" stopColor="#C03C85" />
                      <stop offset="70%" stopColor="#6B5BFF" />
                      <stop offset="100%" stopColor="#1173BC" />
                    </linearGradient>
                  </defs>
                  <polygon points="20,2 36,12 36,28 20,38 4,28 4,12" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="2.5" />
                  <path d="M16 28 L16 16 L20 12 L24 16 L24 20 L20 24 L20 28" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>GFF AI</span>
                <span className="text-[8px] tracking-wider uppercase block" style={{ color: 'var(--text-secondary)' }}>Garage | Foundry | Factory</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Building intelligent enterprises for the agentic era through strategy, engineering, governance, platforms, and managed AI operations.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'var(--chip-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {footerColumns.map((column, colIdx) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (colIdx + 1) * 0.08 }}
            >
              <h4 className="text-sm font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-300"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-10 grid gap-4 rounded-[28px] border p-5 backdrop-blur-xl md:grid-cols-3 lg:p-6"
          style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-glass)' }}
        >
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--gff-blue)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              68 Circular Road, #02-01,<br />Singapore- 049422, Singapore
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gff-blue)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>hello@gffai.ai</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--gff-blue)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>+65-93239991</span>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t pt-8 text-center" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            &copy; 2026 GFF AI PTE. LTD. All Rights Reserved.
          </p>
          <p className="mx-auto mt-3 max-w-5xl text-[11px] leading-6 sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
            The information on this website is provided for general informational purposes only. Product features, demonstrations, use
            cases, and roadmap items are illustrative and subject to change without notice. All intellectual property, including
            trademarks, content, methodologies, software, and designs, is the exclusive property of GFF AI PTE. LTD. Unauthorized
            use, reproduction, or distribution is prohibited. Third-party trademarks remain the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
