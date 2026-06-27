import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Youtube, Instagram, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  Information: ['Responsible AI', 'Careers', 'Resources', 'About Us', 'Contact Us', 'Privacy Policy', 'Terms & Conditions'],
  Service: ['AI Chips', 'Authentication', 'Edtech', 'Femtech', 'TravelTech', 'Proptech'],
};

const socials = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: '#', label: 'Email' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
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
              Building Intelligent Enterprises for the Agentic Era. GFF AI is a global AI consulting, engineering, and transformation company.
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
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (colIdx + 1) * 0.1 }}
            >
              <h4 className="text-sm font-display font-bold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-text hover:text-white transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-sm font-display font-bold text-white mb-4">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-core-blue mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-text">
                  71 Pennington Lane<br />
                  Vernon Rockville, CT 06066
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-core-blue flex-shrink-0" />
                <span className="text-sm text-muted-text">thefactoryai@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-core-blue flex-shrink-0" />
                <span className="text-sm text-muted-text">+91-755-507-8740</span>
              </div>
            </div>
          </motion.div>
        </div>

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
