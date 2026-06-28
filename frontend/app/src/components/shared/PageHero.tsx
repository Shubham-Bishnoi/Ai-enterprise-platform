import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { siteContainerClass } from '@/lib/siteContent';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  intro?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  intro,
  actions,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b pt-28 lg:pt-36',
        className
      )}
      style={{
        borderColor: 'var(--border-default)',
        background: 'linear-gradient(135deg, var(--surface-dark) 0%, var(--bg-primary) 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'url(/assets/noise-texture.png)',
          backgroundRepeat: 'repeat',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at top left, rgba(192,60,133,0.08), transparent 28%), radial-gradient(circle at top right, rgba(17,115,188,0.10), transparent 32%)',
        }}
      />

      <div className={cn(siteContainerClass, 'relative z-10 pb-16 lg:pb-20')}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <span
            className="inline-flex items-center rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.24em] backdrop-blur-xl"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--chip-bg)',
              color: 'var(--text-secondary)',
            }}
          >
            {eyebrow}
          </span>

          <h1
            className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] md:text-5xl lg:text-[64px]"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h1>

          <p
            className="mt-5 max-w-3xl text-lg leading-relaxed lg:text-xl"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {subtitle}
          </p>

          {intro && (
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed lg:text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              {intro}
            </p>
          )}

          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </motion.div>
      </div>
    </section>
  );
}
