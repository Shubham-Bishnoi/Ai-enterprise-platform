import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  centered = true,
  size = 'lg',
}: SectionHeaderProps) {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl lg:text-4xl',
    md: 'text-3xl md:text-4xl lg:text-5xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={centered ? 'text-center' : ''}
    >
      {eyebrow && (
        <div className={`flex items-center gap-4 mb-4 ${centered ? 'justify-center' : ''}`}>
          <span className="h-px w-16 bg-[var(--border-hover)]" />
          <span className="text-sm font-mono tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>
            {eyebrow}
          </span>
          <span className="h-px w-16 bg-[var(--border-hover)]" />
        </div>
      )}
      <h2 className={`font-display font-bold leading-[1.05] ${sizeClasses[size]}`} style={{ color: 'var(--text-primary)' }}>
        {title}
        {highlight && <span className="text-gradient"> {highlight}</span>}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
