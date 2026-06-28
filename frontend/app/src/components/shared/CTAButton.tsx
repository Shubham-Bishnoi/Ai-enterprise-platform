import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  children: ReactNode;
  to?: string;
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
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300',
    variant === 'primary'
      ? 'bg-gff-gradient text-white sheen-btn hover-gff-glow'
      : 'border border-[var(--border-default)] bg-[var(--chip-bg)] text-[var(--text-primary)] hover:border-[var(--border-hover)]',
    className
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
}
