import { useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { CTAButton, GlassCard, SectionHeader } from '@/components/shared';
import { quickSearchChips, quickSearchResults, siteContainerClass } from '@/lib/siteContent';

function includesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default function QuickSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return quickSearchResults.slice(0, 6);
    }

    return quickSearchResults.filter((item) => {
      return (
        includesQuery(item.title, trimmed) ||
        includesQuery(item.category, trimmed) ||
        includesQuery(item.description, trimmed) ||
        item.tags.some((tag) => includesQuery(tag, trimmed))
      );
    });
  }, [query]);

  return (
    <section id="quick-search" className="relative overflow-hidden py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(17,115,188,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(192,60,133,0.08),transparent_28%)]" />
      <div className={siteContainerClass}>
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Quick Search"
            title="Find Your AI Starting Point"
            subtitle="Search by industry, use case, platform, or transformation goal."
          />

          <GlassCard
            className={`mt-10 rounded-[32px] border-white/[0.1] bg-[#101014]/92 p-6 lg:p-8 ${
              focused
                ? 'border-core-blue/40 shadow-[0_0_0_1px_rgba(17,115,188,0.2),0_0_42px_rgba(17,115,188,0.12)]'
                : ''
            }`}
            glow="gradient"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Search AI use cases, industries, platforms, or solutions"
                placeholder="Search for AI use cases, industries, platforms, or solutions..."
                className="glass-input h-16 w-full rounded-[24px] border-white/[0.1] bg-white/[0.04] pl-14 pr-5 text-base text-white outline-none transition-all placeholder:text-white/40 focus:ring-4 focus:ring-core-blue/10"
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {quickSearchChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setQuery(chip)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/78 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  {chip}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {filteredResults.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredResults.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
              >
                <GlassCard className="h-full rounded-[28px] border-white/[0.09] bg-[#101014]/88 p-6 lg:p-7" glow="gradient">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-white/60">
                      {item.category}
                    </span>
                    <span className="text-xs text-white/40">{query.trim() ? 'Matched result' : 'Featured'}</span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>

                  <div className="mt-6">
                    <CTAButton to={item.link} variant="secondary" className="w-full justify-center">
                      Explore
                    </CTAButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <GlassCard className="mx-auto max-w-3xl rounded-[32px] border-white/[0.1] bg-[#101014]/90 p-10 text-center" glow="gradient">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <Sparkles className="h-7 w-7 text-white/75" />
              </div>
              <h3 className="mt-5 font-display text-3xl font-bold text-white">No exact match yet</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Try a broader phrase like banking, governance, agents, blueprint, or education to discover the closest GFF AI pathway.
              </p>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
