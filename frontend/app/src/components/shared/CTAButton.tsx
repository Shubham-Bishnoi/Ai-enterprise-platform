import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  children: ReactNode;
  to: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

export function CTAButton({
  children,
  to,
  variant = 'primary',
  className,
  onClick,
}: CTAButtonProps) {
  const classes = cn(
    'inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-300',
    variant === 'primary'
      ? 'bg-gff-gradient text-white sheen-btn hover-gff-glow'
      : 'border border-white/15 bg-white/[0.03] text-white/90 backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.06]',
    className
  );

  if (to.startsWith('#') || to.startsWith('http')) {
    return (
      <a href={to} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} onClick={onClick} className={classes}>
      {children}
    </Link>
  );
}
