import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Youtube, Instagram, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { footerColumns, siteContainerClass } from '@/lib/siteContent';

const socials = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: '#', label: 'Email' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#07070a] py-16">
      <div className={siteContainerClass}>
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] mb-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
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
                <span className="text-white font-display font-bold text-sm">GFF AI</span>
                <span className="text-[8px] text-muted-text tracking-wider uppercase block">Garage | Foundry | Factory</span>
              </div>
            </div>
            <p className="text-sm text-muted-text leading-relaxed mb-6">
              Building intelligent enterprises for the agentic era through strategy, engineering, governance, platforms, and managed AI operations.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 text-muted-text btn-secondary hover:text-white transition-all duration-300"
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
              <h4 className="text-sm font-display font-bold text-white mb-4">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-muted-text hover:text-white transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-10 grid gap-4 rounded-[28px] border border-white/[0.08] bg-[#101014]/80 p-5 backdrop-blur-xl md:grid-cols-3 lg:p-6"
        >
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-core-blue" />
            <span className="text-sm text-muted-text">
              71 Pennington Lane
              <br />
              Vernon Rockville, CT 06066
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 flex-shrink-0 text-core-blue" />
            <span className="text-sm text-muted-text">thefactoryai@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 flex-shrink-0 text-core-blue" />
            <span className="text-sm text-muted-text">+91-755-507-8740</span>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-muted-text">
            &copy; {new Date().getFullYear()} GFF AI. All Rights Reserved. Garage | Foundry | Factory.
          </p>
        </div>
      </div>
    </footer>
  );
}
