import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'gradient' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = 'blue',
  padding = 'md',
}: GlassCardProps) {
  const glowClasses = {
    blue: 'hover:shadow-[0_0_30px_rgba(17,115,188,0.18),0_0_30px_rgba(154,0,3,0.12)]',
    gradient: 'hover:shadow-[0_0_40px_rgba(17,115,188,0.22),0_0_40px_rgba(154,0,3,0.16),0_0_40px_rgba(107,91,255,0.12)]',
    none: '',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border backdrop-blur-xl transition-all duration-500',
        paddingClasses[padding],
        hover && 'hover:-translate-y-0.5',
        hover && glowClasses[glow],
        hover && 'hover:border-[var(--border-hover)]',
        className
      )}
      style={{
        background: 'var(--bg-glass)',
        borderColor: 'var(--border-default)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {children}
    </div>
  );
}
