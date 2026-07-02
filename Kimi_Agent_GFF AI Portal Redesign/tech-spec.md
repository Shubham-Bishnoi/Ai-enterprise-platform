# GFF AI Client Portal Cockpit — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | `^18.2.0` | UI framework |
| `react-dom` | `^18.2.0` | DOM renderer |
| `lucide-react` | `^0.400.0` | Icon library (all icons) |
| `tailwindcss` | `^3.4.0` | Utility-first CSS |
| `typescript` | `^5.3.0` | Type safety |

No animation libraries, chart libraries, or paid UI dependencies. All animations are CSS keyframes + React state. All data visualization is CSS-only.

---

## Component Inventory

### Layout (1)

| Component | Source | Notes |
|-----------|--------|-------|
| `PremiumClientPortal` | Custom | Root orchestrator. Manages `clientType` state, renders BackgroundLayer + all sections, handles client switch transitions |

### Sections (9)

All sections are custom-built. Each consumes data from `portalDemoData.ts` filtered by `clientType`.

| Component | Data Source | Grid Position |
|-----------|-------------|---------------|
| `PortalHeader` | `portalDemoData.ts` | Full width |
| `ExecutiveSnapshot` | `portalDemoData.ts` | Full width, 8-col grid |
| `TransformationRoadmap` | `portalDemoData.ts` | Bento row, 7 cols |
| `AIOperationsCockpit` | `portalDemoData.ts` | Bento row, 5 cols |
| `ProjectCommandBoard` | `portalDemoData.ts` | Bento row, 8 cols |
| `GovernanceCenter` | `portalDemoData.ts` | Bento row, 4 cols |
| `DocumentVault` | `portalDemoData.ts` | Bento row, 7 cols |
| `ActivityAndSupport` | `portalDemoData.ts` | Bento row, 5 cols |
| `NextActions` | `portalDemoData.ts` | Full width |

`ActivityAndSupport` combines ActivityFeed + SupportCenter in one glass card to match the 5-column bento allocation. They stack vertically within the shared card.

### Reusable Components (12)

All defined in `shared.md`. Each is a standalone file under `components/portal/`.

| Component | Props | Key Complexity |
|-----------|-------|----------------|
| `GlassCard` | `variant`, `hover`, `enterDelay` | Entrance animation via CSS keyframe + inline `--delay` custom property. Featured variant adds `::after` ambient glow pseudo-element |
| `StatusBadge` | `variant`, `pulse` | Pulse animation via CSS keyframe, glow color derived from variant |
| `MetricCard` | `icon`, `label`, `value`, `trend`, `featured` | Integrates `useCountUp` for numeric values. Featured variant adds gradient text + progress bar |
| `ProgressBar` | `value`, `variant`, `shimmer` | CSS `@property` or SVG stroke-dasharray for ring. `shimmer-sweep` pseudo-element overlay |
| `HealthRing` | `value`, `size` | Inline SVG with `stroke-dasharray`/`stroke-dashoffset`. Arc draw animation synchronized with `useCountUp` |
| `SectionHeader` | `icon`, `title`, `action` | Thin wrapper — icon + title + optional right action |
| `ControlChip` | `label`, `implemented` | Simple conditional styling chip |
| `StagePill` | `stage`, `status`, `stageNumber` | Three visual states (completed/current/future). Current has `pulse-glow` |
| `ActivityItem` | `description`, `timestamp`, `variant`, `tag` | Timeline rail via parent container. `isNew` triggers highlight flash animation |
| `RequestForm` | `initialType`, `onSubmit`, `onCancel`, `isOpen` | Expand/collapse via CSS grid `grid-template-rows` transition (0fr to 1fr). Local validation state |
| `Toast` | `message`, `variant`, `onDismiss` | Fixed positioning. Auto-dismiss timer with hover reset |
| `ClientTypeDropdown` | `selected`, `onSelect` | Positioned dropdown. Mobile: bottom sheet instead of dropdown |
| `TopAccentLine` | `height`, `animate` | CSS `background-size: 300%` + `gradient-sweep` keyframe |

### Hooks (3)

| Hook | Purpose |
|------|---------|
| `useCountUp` | `requestAnimationFrame`-driven numeric animation with ease-out cubic easing. Returns interpolated value. Debounced cleanup |
| `useIntersectionEntrance` | IntersectionObserver wrapper. Returns `{ ref, isVisible }`. Threshold: 0.1. Single-fire (disconnects after trigger) |
| `useStaggeredEntrance` | Generates delay array for lists. `Array.from({ length: count }, (_, i) => baseDelay + i * staggerMs)` |

---

## Animation Implementation

| Animation | Approach | Complexity |
|-----------|----------|------------|
| Card entrance (staggered fade+translate) | CSS `@keyframes card-enter` with inline `animation-delay` set via `--delay` custom property on each card. Triggered by `useIntersectionEntrance` adding a `.entered` class | Low |
| Gradient sweep (top accent line) | CSS `@keyframes gradient-sweep` with `background-size: 300% 100%`. Pure CSS, infinite loop | Low |
| Pulse glow (status dots) | CSS `@keyframes pulse-glow` with box-shadow keyframes. Color passed via CSS custom property `--glow-color` | Low |
| Progress bar fill | CSS `@keyframes progress-fill` animating `width` from 0% to target. `animation-fill-mode: forwards`. Delay via inline style | Low |
| Progress shimmer | Pseudo-element with `linear-gradient` mask, `@keyframes shimmer-sweep` translating X. Overlay on progress fill | Low |
| Value count-up | `useCountUp` hook: `requestAnimationFrame` loop with ease-out cubic interpolation. Returns live value. Re-runs when `target` or `clientType` changes | Medium |
| Health ring draw | Inline SVG `<circle>` with `stroke-dasharray` = circumference, `stroke-dashoffset` animated via CSS from circumference to target offset. Center text uses `useCountUp` | Medium |
| Timeline draw | CSS `@keyframes` animating a wrapper `scaleX(0→1)` with `transform-origin: left`. Nodes pop in via staggered scale+opacity after rail completes | Medium |
| Activity item highlight | CSS `@keyframes` briefly setting `background-color` to `rgba(23,139,255,0.05)` then fading to transparent over 1.5s. Triggered by `isNew` prop adding `.highlight` class | Low |
| Client type content transition | Parent container applies `.transitioning` class → children opacity 0 over 200ms → state update → children opacity 1 + translateY over 400ms. Controlled by `PremiumClientPortal` state machine | Medium |
| Form expand/collapse | CSS `grid-template-rows: 0fr → 1fr` transition on parent, `overflow: hidden` on child. 300ms ease-out. Fields fade in with staggered `animation-delay` | Low |
| Ambient glow drift | CSS `@keyframes ambient-drift` with subtle translate+scale oscillation. 20s infinite. Pure CSS | Low |
| Toast slide | CSS `@keyframes` for enter (translateX 120%→0) and exit (opacity→0). Triggered by mount/unmount | Low |

No animation libraries needed. All are CSS keyframes + React state-driven class toggles. The most complex is the client type switch transition, which requires a small state machine in the root component.

---

## State & Logic

### Client Type Switch State Machine

`PremiumClientPortal` manages a 3-state transition flow for client type switches:

```
IDLE → SWITCHING → UPDATING → IDLE
```

- **IDLE**: Normal rendering. All sections visible with entrance animations completed.
- **SWITCHING**: User selected new type. A 300ms glass overlay with spinner appears. Current content fades out (200ms).
- **UPDATING**: Overlay hidden. `clientType` state updated. New content cross-fades in (400ms). All child animations re-trigger via `key` prop change on the content wrapper.
- **Trigger**: Content wrapper uses `key={clientType}` to force remount on switch, ensuring all entrance animations and `useCountUp` hooks restart with new data.

### Local State (per component)

| Component | State | Type | Notes |
|-----------|-------|------|-------|
| `PremiumClientPortal` | `clientType` | `ClientType` | Selected industry vertical |
| `PremiumClientPortal` | `transitionState` | `'idle' \| 'switching' \| 'updating'` | Switch state machine |
| `PortalHeader` | `dropdownOpen` | `boolean` | Client type dropdown visibility |
| `ActivityAndSupport` | `formOpen` | `boolean` | Request form expand/collapse |
| `ActivityAndSupport` | `formType` | `string` | Pre-selected request type |
| `ActivityAndSupport` | `formData` | `{ title, description, type }` | Form field values |
| `ActivityAndSupport` | `formError` | `string \| null` | Validation error message |
| `ActivityAndSupport` | `submitting` | `boolean` | Form submission loading state |
| `ActivityAndSupport` | `activities` | `ActivityItem[]` | Local activity feed array (initialized from demo data, mutated on submit) |
| `ActivityAndSupport` | `toast` | `{ message, variant } \| null` | Active toast notification |
| `ActivityAndSupport` | `openTickets` | `number` | Mutable ticket count (initialized from demo data) |

All other sections are data-driven from props with no local state.

### Data Flow

```
portalDemoData.ts (static module)
  ↓ filtered by clientType
PremiumClientPortal (orchestrator)
  ↓ passes clientData object
  → PortalHeader
  → ExecutiveSnapshot
  → TransformationRoadmap
  → AIOperationsCockpit
  → ProjectCommandBoard
  → GovernanceCenter
  → DocumentVault
  → ActivityAndSupport (mutates activities + tickets locally)
  → NextActions
```

`portalDemoData.ts` exports a `getClientData(type: ClientType)` function that returns the complete data object for the selected client. All personalization is data-driven — components receive pre-filtered data and render accordingly. No per-component conditional logic for client types.

---

## Other Key Decisions

### HealthRing: SVG not CSS conic-gradient

The design calls for a circular progress ring with brand gradient stroke and rounded endcaps. `conic-gradient` cannot produce rounded caps or a smooth gradient arc with stroke-linecap. Implementation uses inline SVG `<circle>` with `stroke-dasharray`/`stroke-dashoffset` — the only technique that satisfies rounded caps + gradient stroke + animation requirements.

### Form expand/collapse: CSS grid not max-height

The request form uses `display: grid; grid-template-rows: 0fr` → `1fr` with `overflow: hidden` on the inner element. This avoids hardcoded `max-height` values and enables smooth height animation to any content size, including dynamic textarea expansion.

### Activity + Support shared card

The 5-column bento slot must fit both ActivityFeed and SupportCenter. They render as two sub-sections within a single `GlassCard` — ActivityFeed on top, divider line, SupportCenter below. This avoids nested glass cards (visual heaviness) while respecting the bento grid allocation.
