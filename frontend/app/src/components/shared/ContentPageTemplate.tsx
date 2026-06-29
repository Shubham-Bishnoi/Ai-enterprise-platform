import { ArrowRight } from 'lucide-react';
import { CTAButton } from '@/components/shared/CTAButton';
import { GlassCard } from '@/components/shared/GlassCard';
import { GradientText } from '@/components/shared/GradientText';
import { PageHero } from '@/components/shared/PageHero';
import type { ContentPageData } from '@/lib/siteContent';
import { siteContainerClass } from '@/lib/siteContent';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ContentPageTemplateProps {
  page: ContentPageData;
}

function renderTitle(title: string) {
  const parts = title.split(' ');
  if (parts.length === 1) {
    return <GradientText>{title}</GradientText>;
  }

  return (
    <>
      {parts.slice(0, -1).join(' ')} <GradientText>{parts[parts.length - 1]}</GradientText>
    </>
  );
}

export function ContentPageTemplate({ page }: ContentPageTemplateProps) {
  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow={page.eyebrow}
        title={renderTitle(page.title)}
        subtitle={page.subtitle}
        intro={page.intro}
        actions={
          <>
            {page.actions?.map((action) => (
              <CTAButton key={action.label} to={action.to} variant={action.variant}>
                {action.label}
              </CTAButton>
            ))}
          </>
        }
      />

      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {page.cards.map((card) => (
              <GlassCard
                key={card.title}
                className="h-full rounded-[28px] border-[color:var(--border-default)] bg-[var(--bg-card)] p-6 lg:p-7"
                glow="gradient"
              >
                <div id={slugify(card.title)} className="scroll-mt-28" />
                <div className="mb-4 inline-flex rounded-full border border-[color:var(--border-subtle)] bg-[var(--chip-bg)] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-[color:var(--text-tertiary)]">
                  {card.title}
                </div>
                <h2 className="font-display text-2xl font-bold text-[color:var(--text-primary)]">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{card.description}</p>

                {card.bullets && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.bullets.map((bullet) => (
                      <span
                        key={bullet}
                        className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--chip-bg)] px-3 py-1 text-xs text-[color:var(--text-secondary)]"
                      >
                        {bullet}
                      </span>
                    ))}
                  </div>
                )}

                {card.ctaLabel && card.ctaTo && (
                  <div className="mt-6">
                    <CTAButton to={card.ctaTo} variant="secondary" className="w-full justify-between">
                      <span>{card.ctaLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </CTAButton>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          {page.bottomNote && (
            <div className="mt-10 rounded-[28px] border border-[color:var(--border-subtle)] bg-[var(--bg-glass)] p-6 text-sm text-[color:var(--text-secondary)] backdrop-blur-xl lg:p-8">
              {page.bottomNote}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
