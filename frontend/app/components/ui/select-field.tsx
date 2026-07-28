'use client'

/**
 * SelectField — an accessible, website-native replacement for the browser's
 * native <select>. The native control renders an unstyleable OS menu; this one
 * is a portalled combobox/listbox with the GFF AI surface treatment.
 *
 * No third-party dropdown library is installed in this project, so this is a
 * self-contained implementation (framer-motion for the open transition only).
 * It implements the WAI-ARIA combobox pattern:
 *   - trigger: role=combobox, aria-haspopup=listbox, aria-expanded, aria-controls
 *   - popover: role=listbox, options role=option with aria-selected
 *   - active option tracked with aria-activedescendant
 *   - ArrowUp/Down, Home/End, Enter/Space, Escape, typeahead
 *   - Escape / select / outside-click close and return focus to the trigger
 *   - portalled to <body> so it is never clipped, repositioned on scroll/resize
 *
 * `searchable` adds a sticky filter input (used for the long Industry list) and
 * optional "Popular / All" grouping.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown, AlertCircle, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type SelectFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  searchable?: boolean
  /** When searchable, these values are surfaced under a "Popular" group. */
  popular?: string[]
  required?: boolean
  optional?: boolean
  error?: string | null
  name?: string
}

type Placement = 'bottom' | 'top'

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  searchable = false,
  popular = [],
  required = false,
  optional = false,
  error = null,
  name,
}: SelectFieldProps) {
  const reduce = useReducedMotion()
  const baseId = useId()
  const listId = `${baseId}-list`
  const errorId = `${baseId}-error`

  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [rect, setRect] = useState<{ top: number; left: number; width: number; placement: Placement; maxH: number } | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ term: '', at: 0 })

  useEffect(() => setMounted(true), [])

  /* --------------------------- Option list (filtered/grouped) -------------- */

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options
    const q = query.trim().toLowerCase()
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [options, query, searchable])

  // Flat rows for rendering (headers + options); options carry their flat index.
  const rows = useMemo(() => {
    type Row = { kind: 'header'; label: string } | { kind: 'option'; value: string; index: number }
    const out: Row[] = []
    let idx = 0
    if (searchable && popular.length && !query.trim()) {
      const pop = popular.filter((p) => options.includes(p))
      const rest = options.filter((o) => !pop.includes(o))
      if (pop.length) {
        out.push({ kind: 'header', label: 'Popular' })
        pop.forEach((v) => out.push({ kind: 'option', value: v, index: idx++ }))
      }
      out.push({ kind: 'header', label: 'All industries' })
      rest.forEach((v) => out.push({ kind: 'option', value: v, index: idx++ }))
      return { rows: out, values: [...pop, ...rest] }
    }
    filtered.forEach((v) => out.push({ kind: 'option', value: v, index: idx++ }))
    return { rows: out, values: filtered }
  }, [filtered, options, popular, query, searchable])

  const values = rows.values

  /* ------------------------------- Positioning ----------------------------- */

  const measure = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const gap = 8
    const spaceBelow = window.innerHeight - r.bottom - gap
    const spaceAbove = r.top - gap
    const placement: Placement = spaceBelow >= 240 || spaceBelow >= spaceAbove ? 'bottom' : 'top'
    const maxH = Math.min(320, Math.max(180, (placement === 'bottom' ? spaceBelow : spaceAbove) - 4))
    setRect({ top: placement === 'bottom' ? r.bottom + gap : r.top - gap, left: r.left, width: r.width, placement, maxH })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    measure()
    const onChangeView = () => measure()
    window.addEventListener('scroll', onChangeView, true)
    window.addEventListener('resize', onChangeView)
    return () => {
      window.removeEventListener('scroll', onChangeView, true)
      window.removeEventListener('resize', onChangeView)
    }
  }, [open, measure])

  /* --------------------------- Open / close lifecycle ---------------------- */

  const openMenu = useCallback(() => {
    setOpen(true)
    setQuery('')
    const current = values.indexOf(value)
    setActiveIndex(current >= 0 ? current : 0)
  }, [value, values])

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false)
    setActiveIndex(-1)
    if (returnFocus) triggerRef.current?.focus()
  }, [])

  const commit = useCallback(
    (v: string) => {
      onChange(v)
      closeMenu()
    },
    [onChange, closeMenu],
  )

  // Focus the search input when a searchable menu opens.
  useEffect(() => {
    if (open && searchable) {
      const t = setTimeout(() => searchRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
  }, [open, searchable])

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return
    const node = listRef.current?.querySelector<HTMLElement>(`[data-opt="${activeIndex}"]`)
    node?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  // Reset the active row to the first match while filtering.
  useEffect(() => {
    if (open && searchable) setActiveIndex(values.length ? 0 : -1)
  }, [query, open, searchable, values.length])

  // Outside click closes without stealing focus back to the trigger.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || listRef.current?.contains(t)) return
      closeMenu(false)
    }
    window.addEventListener('pointerdown', onDown, true)
    return () => window.removeEventListener('pointerdown', onDown, true)
  }, [open, closeMenu])

  /* ------------------------------- Keyboard -------------------------------- */

  const move = (delta: number) => {
    if (!values.length) return
    setActiveIndex((i) => {
      const next = i < 0 ? 0 : i + delta
      return (next + values.length) % values.length
    })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openMenu()
        else move(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openMenu()
        else move(-1)
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setActiveIndex(values.length - 1)
        }
        break
      case 'Enter':
        if (open && activeIndex >= 0 && values[activeIndex]) {
          e.preventDefault()
          commit(values[activeIndex])
        } else if (!open) {
          e.preventDefault()
          openMenu()
        }
        break
      case ' ':
        // Space selects only when not typing in the search field.
        if (!searchable) {
          e.preventDefault()
          if (!open) openMenu()
          else if (activeIndex >= 0 && values[activeIndex]) commit(values[activeIndex])
        }
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          closeMenu()
        }
        break
      case 'Tab':
        if (open) closeMenu(false)
        break
      default:
        // Typeahead for non-searchable lists.
        if (!searchable && open && e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now()
          typeahead.current.term = now - typeahead.current.at > 700 ? e.key : typeahead.current.term + e.key
          typeahead.current.at = now
          const term = typeahead.current.term.toLowerCase()
          const found = values.findIndex((v) => v.toLowerCase().startsWith(term))
          if (found >= 0) setActiveIndex(found)
        }
    }
  }

  const activeId = activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined

  /* --------------------------------- Render -------------------------------- */

  return (
    <div className="flex flex-col gap-2">
      <label id={`${baseId}-label`} htmlFor={`${baseId}-trigger`} className="text-sm font-medium text-navy">
        {label}
        {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
      </label>

      <button
        ref={triggerRef}
        id={`${baseId}-trigger`}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && !searchable ? activeId : undefined}
        aria-labelledby={`${baseId}-label`}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onClick={() => (open ? closeMenu(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex h-14 w-full items-center justify-between gap-2 rounded-[16px] border bg-background px-4 text-left text-[15px] transition-colors',
          'outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          error
            ? 'border-brand-red/60 focus-visible:ring-brand-red/50'
            : 'border-border hover:border-brand-blue/40 focus-visible:ring-brand-blue/60',
          open && !error && 'border-brand-blue ring-2 ring-brand-blue/30',
        )}
      >
        <span className={cn('truncate', value ? 'font-medium text-navy' : 'text-muted-foreground')}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180 text-brand-blue')}
          aria-hidden="true"
        />
      </button>

      {name && <input type="hidden" name={name} value={value} readOnly />}

      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-brand-red">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && rect && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: rect.placement === 'bottom' ? -6 : 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: rect.placement === 'bottom' ? -6 : 6, scale: 0.98 }}
                transition={{ duration: reduce ? 0 : 0.16, ease: [0.21, 0.47, 0.32, 0.98] }}
                style={{
                  position: 'fixed',
                  top: rect.placement === 'bottom' ? rect.top : undefined,
                  bottom: rect.placement === 'top' ? window.innerHeight - rect.top : undefined,
                  left: rect.left,
                  width: rect.width,
                  maxHeight: rect.maxH,
                  zIndex: 80,
                }}
                className="flex flex-col overflow-hidden rounded-[18px] border border-brand-blue/25 bg-white/95 p-2 shadow-[0_20px_60px_rgba(7,22,47,0.16)] backdrop-blur-[20px]"
              >
                {searchable && (
                  <div className="sticky top-0 z-10 mb-1 flex items-center gap-2 rounded-[12px] border border-border bg-white px-3">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={onKeyDown}
                      role="combobox"
                      aria-expanded={open}
                      aria-controls={listId}
                      aria-activedescendant={activeId}
                      aria-label={`Search ${label.toLowerCase()}`}
                      placeholder="Search…"
                      className="h-11 w-full bg-transparent text-[15px] text-navy outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                )}

                <ul ref={listRef} id={listId} role="listbox" aria-label={label} className="min-h-0 flex-1 overflow-y-auto">
                  {values.length === 0 && (
                    <li className="px-3 py-3 text-sm text-muted-foreground">No matches</li>
                  )}
                  {rows.rows.map((row, i) =>
                    row.kind === 'header' ? (
                      <li
                        key={`h-${row.label}-${i}`}
                        role="presentation"
                        className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        {row.label}
                      </li>
                    ) : (
                      <li key={row.value} role="none">
                        <button
                          type="button"
                          id={`${baseId}-opt-${row.index}`}
                          data-opt={row.index}
                          role="option"
                          aria-selected={row.value === value}
                          tabIndex={-1}
                          onMouseEnter={() => setActiveIndex(row.index)}
                          onClick={() => commit(row.value)}
                          className={cn(
                            'flex min-h-[44px] w-full items-center justify-between gap-2 rounded-[11px] px-3 py-2 text-left text-[15px] transition-colors',
                            row.value === value
                              ? 'bg-brand-blue/10 font-medium text-navy'
                              : 'text-navy/90',
                            activeIndex === row.index && row.value !== value && 'bg-secondary',
                            activeIndex === row.index && row.value === value && 'bg-brand-blue/15',
                          )}
                        >
                          <span className="truncate">{row.value}</span>
                          {row.value === value && <Check className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
