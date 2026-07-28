import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className }: SectionHeaderProps) {
  return (
    <ScrollReveal
      className={cn(
        'flex flex-col gap-3.5',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">{eyebrow}</p>
      )}
      <h2 className="max-w-3xl text-balance text-[1.75rem] font-semibold tracking-tight text-navy md:text-[2.5rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-base">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  )
}
