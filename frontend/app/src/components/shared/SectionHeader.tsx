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
        <div className="flex items-center gap-4 mb-4 justify-center">
          <span className="h-px w-16 bg-white/20" />
          <span className="text-sm font-mono text-muted-text tracking-wider uppercase">
            {eyebrow}
          </span>
          <span className="h-px w-16 bg-white/20" />
        </div>
      )}
      <h2 className={`font-display font-bold text-white leading-[1.05] ${sizeClasses[size]}`}>
        {title}
        {highlight && <span className="text-gradient"> {highlight}</span>}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-text max-w-2xl mx-auto text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}
