import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { trackAnalyticsEvent } from '@/lib/api/analyticsApi';
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
  const handleTrackedClick = () => {
    void trackAnalyticsEvent({
      eventName: 'navigation_clicked',
      source: 'cta_button',
      component: 'CTAButton',
      payload: { to: to || null, variant },
    });
    onClick?.();
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300',
    variant === 'primary'
      ? 'bg-gff-gradient text-white sheen-btn hover-gff-glow'
      : 'border border-[var(--border-default)] bg-[var(--chip-bg)] text-[var(--text-primary)] hover:border-[var(--border-hover)]',
    className
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={handleTrackedClick}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={handleTrackedClick} className={baseClasses}>
      {children}
    </button>
  );
}
