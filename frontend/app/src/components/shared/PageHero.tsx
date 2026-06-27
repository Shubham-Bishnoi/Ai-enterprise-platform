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
    <section className={cn('relative overflow-hidden border-b border-white/[0.06] pt-28 lg:pt-36', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(192,60,133,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(17,115,188,0.16),transparent_32%),linear-gradient(180deg,#050507_0%,#0d0d10_100%)]" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url(/assets/noise-texture.png)', backgroundRepeat: 'repeat' }} />

      <div className={cn(siteContainerClass, 'relative z-10 pb-16 lg:pb-20')}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
            {eyebrow}
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-5xl lg:text-[64px]">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/78 lg:text-xl">
            {subtitle}
          </p>

          {intro && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-text lg:text-lg">
              {intro}
            </p>
          )}

          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </motion.div>
      </div>
    </section>
  );
}
