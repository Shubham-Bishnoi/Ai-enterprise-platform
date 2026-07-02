import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Sparkles, Command, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { trackAnalyticsEvent } from '@/lib/api/analyticsApi';
import { fetchSearchIndex, search as searchBackend, type SearchResult } from '@/lib/api/searchApi';
import { quickSearchChips, quickSearchResults, siteContainerClass } from '@/lib/siteContent';

function includesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default function QuickSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [remoteChips, setRemoteChips] = useState<string[] | null>(null);
  const [remoteDefaultResults, setRemoteDefaultResults] = useState<SearchResult[] | null>(null);
  const [remoteResults, setRemoteResults] = useState<SearchResult[] | null>(null);
  const debounceRef = useRef<number | null>(null);
  const lastTrackedQuery = useRef<string>('');

  useEffect(() => {
    let mounted = true;
    fetchSearchIndex()
      .then((data) => {
        if (!mounted) return;
        setRemoteChips(data.chips || []);
        setRemoteDefaultResults(
          (data.featured || []).map((entry) => ({
            title: entry.title,
            category: entry.category,
            description: entry.description,
            link: entry.link,
            tags: entry.tags || [],
            source_type: entry.source_type,
            relevance_score: 1,
          })),
        );
      })
      .catch(() => {
        if (!mounted) return;
        setRemoteChips(null);
        setRemoteDefaultResults(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (!trimmed) {
      setRemoteResults(null);
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      searchBackend(trimmed)
        .then((data) => {
          setRemoteResults(data.results || []);
          if (lastTrackedQuery.current !== trimmed) {
            lastTrackedQuery.current = trimmed;
            trackAnalyticsEvent({
              eventName: 'search_performed',
              source: 'quick_search',
              component: 'QuickSearch',
              payload: { query: trimmed, total: data.total },
            });
          }
        })
        .catch(() => {
          setRemoteResults(null);
        });
    }, 250);
  }, [query, remoteDefaultResults, remoteResults]);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      const fallback = quickSearchResults.slice(0, 6);
      const remoteFallback = (remoteDefaultResults || []).slice(0, 6).map((item) => ({
        title: item.title,
        category: item.category,
        description: item.description,
        link: item.link,
        tags: item.tags || [],
      }));
      return remoteFallback.length > 0 ? remoteFallback : fallback;
    }

    if (remoteResults && remoteResults.length > 0) {
      return remoteResults.map((item) => ({
        title: item.title,
        category: item.category,
        description: item.description,
        link: item.link,
        tags: item.tags || [],
      }));
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

  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof quickSearchResults> = {};
    filteredResults.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredResults]);

  const chips = remoteChips && remoteChips.length > 0 ? remoteChips : quickSearchChips;

  return (
    <section id="quick-search" className="relative overflow-hidden py-20 lg:py-24">
      {/* Background effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(17,115,188,0.08), transparent 50%), radial-gradient(circle at 80% 100%, rgba(192,60,133,0.05), transparent 40%)',
        }}
      />
      <div className={siteContainerClass}>
        <div className="relative mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.24em]"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)', color: 'var(--text-secondary)' }}
            >
              <Command className="h-3.5 w-3.5" />
              Quick Search
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Find Your <span className="text-gradient">AI Starting Point</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-4 max-w-xl text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Search by industry, use case, platform, or transformation goal.
            </motion.p>
          </div>

          {/* Command Console */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <div
              className="relative overflow-hidden rounded-[28px] border p-6 lg:p-8"
              style={{
                background: 'var(--bg-glass)',
                borderColor: focused ? 'rgba(17,115,188,0.35)' : 'var(--border-default)',
                boxShadow: focused ? '0 0 0 1px rgba(17,115,188,0.15), 0 0 60px rgba(17,115,188,0.08)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Scan line effect when focused */}
              <AnimatePresence>
                {focused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(17,115,188,0.4), transparent)' }}
                  />
                )}
              </AnimatePresence>

              {/* Search Input */}
              <div className="relative">
                <div className="pointer-events-none absolute left-5 top-1/2 flex -translate-y-1/2 items-center gap-3">
                  <Search className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  aria-label="Search AI use cases, industries, platforms, or solutions"
                  placeholder="Search for AI use cases, industries, platforms, or solutions..."
                  className="w-full rounded-[20px] border py-5 pl-14 pr-28 text-base outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: focused ? 'rgba(17,115,188,0.3)' : 'var(--input-border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <div
                  className="pointer-events-none absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-mono"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
                >
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setQuery(chip)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      borderColor: 'var(--chip-border)',
                      backgroundColor: 'var(--chip-bg)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Zap className="h-3 w-3" />
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results - Grouped by Category */}
          <div className="mt-8">
            {filteredResults.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={query}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category}>
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className="rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em]"
                          style={{
                            borderColor: 'var(--chip-border)',
                            backgroundColor: 'var(--chip-bg)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {category}
                        </span>
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div
                              className="group cursor-pointer rounded-[20px] border p-5 transition-all duration-300 hover:scale-[1.01]"
                              style={{
                                backgroundColor: 'var(--bg-glass)',
                                borderColor: 'var(--border-default)',
                              }}
                              onClick={() => {
                                trackAnalyticsEvent({
                                  eventName: 'search_result_clicked',
                                  source: 'quick_search',
                                  component: 'QuickSearch',
                                  payload: { query: query.trim(), title: item.title, link: item.link, category: item.category },
                                });
                                navigate(item.link);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-hover)';
                                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-default)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-display text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                    {item.title}
                                  </h3>
                                  <p className="mt-1 text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                    {item.description}
                                  </p>
                                </div>
                                <div
                                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110"
                                  style={{ borderColor: 'var(--border-default)' }}
                                >
                                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--text-secondary)' }} />
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                  {item.tags.slice(0, 3).join(' · ')}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-[28px] border p-10 text-center"
                style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-default)' }}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border"
                  style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)' }}
                >
                  <Sparkles className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  No exact match yet
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Try a broader phrase like banking, governance, agents, blueprint, or education to discover the closest GFF AI pathway.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
