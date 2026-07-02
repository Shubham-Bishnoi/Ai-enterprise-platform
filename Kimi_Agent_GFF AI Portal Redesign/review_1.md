# Review Round 1 — Findings

## Critical (must fix)

1. **index.css `body` background/text forces dark globally** — The `@apply bg-[#030305] text-white` on `body` will conflict with any existing light theme. The portal should scope its own background. Fix: Remove the bg/text from `body` and scope it to the portal's `<main>` element only.

2. **index.css `* { @apply border-border }` conflicts** — The `border-border` uses shadcn's HSL vars which may not match portal dark theme. This was pre-existing but could cause visual issues.

## Major (should fix)

3. **SectionHeader layout breaks when both action and contextLabel provided** — Design spec shows action right-aligned. Current code shows both action and contextLabel on the right side without proper handling. They'll overlap if both are provided. Fix: Ensure only one shows, or properly separate them.

4. **Client type dropdown doesn't use PortalHeader's `onNewRequest` properly** — The `onNewRequest` prop is passed to the New Request button correctly, but the `New Request` button in the header should open the support form. Currently it's passed but there's no link between PortalHeader and ActivityAndSupport.

5. **ActivityAndSupport form doesn't reset when client type changes** — When switching client types, the form state (open/closed, values) persists because it's local state. Should reset when activities/support props change.

6. **ExecutiveSnapshot type import uses `LucideIcon` but `ElementType` would be more accurate** — The `iconMap: Record<string, LucideIcon>` matches but the data stores icon as strings. This is actually correct as-is since we're mapping string → LucideIcon component.

7. **NextActions grid responsive breakpoints may not match design** — Design says: Desktop 5 cols, Tablet 3+2 or horizontal scroll, Mobile horizontal scroll snap. Current code uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5` which on tablet (640-1024px) shows only 2 columns instead of 3.

## Minor (polish)

8. **StatusBadge pulse uses CSS custom property but it's set inline** — The `--glow-color` is set via inline style with type assertion. This is correct for dynamic values, but could use a cleaner approach.

9. **Missing StatusBadge size="sm" usage anywhere** — The component supports size="sm" but it's never used. Not a bug but unused capability.

10. **Glass card `p-4.5` in ProjectCommandBoard** — `p-4.5` isn't a standard Tailwind spacing value. Should be `p-[18px]` or `p-4` / `p-5`.

11. **HealthRing SVG gradient `id` is not unique** — If multiple HealthRings render on the same page, the gradient `id="healthGradient"` will conflict. Should use a unique ID per instance.

12. **AIOperationsCockpit SectionHeader missing right-side status** — Design spec shows a status badge "Systems Nominal" with Activity icon on the right side of the section header. Current implementation omits this.

13. **DocumentVault SectionHeader action uses document count but no Upload button** — Design spec shows both "24 documents" ghost badge AND an "Upload" secondary button. Current only shows the count.

14. **Missing `onActionClick` prop handling in NextActions** — The PremiumClientPortal receives `onActionClick` prop but doesn't pass it down to NextActions. Action cards are clickable but don't trigger the callback.

15. **PortalHeader `Enter Workspace` button is non-functional** — Should trigger `onDemoLogin` callback.

16. **Toast in ActivityAndSupport uses `fixed` positioning relative to viewport but is inside a scrollable card** — Could cause positioning issues. Should portal to body.

17. **The `React.ElementType` import is missing in DocumentVault and NextActions** — Actually they don't explicitly import `React`, but `React.ElementType` is used. This could cause TS errors depending on JSX transform. Need to check if it compiles... it does since React 17+ JSX transform, but it's cleaner to import.

18. **ProgressBar CSS animation `progress-fill` uses `--target-width` CSS variable but the keyframe animation doesn't reference it** — The `progress-fill` keyframe in tailwind.config.js only sets `from { width: "0%" }` but doesn't set `to { width: var(--target-width) }`. The animation will fill to 100% (default), not to the actual target value. This is a real bug.

## Fixes to apply:

### Fix 1: index.css body scoping
- Remove `@apply bg-[#030305] text-white` from `body`
- Keep `antialiased` and `font-family`
- The portal's `<main>` already has `bg-[#030305] text-white`

### Fix 2: ProgressBar animation target width
- Add `to { width: var(--target-width, 100%) }` to the `progress-fill` keyframe in tailwind.config.js

### Fix 3: SectionHeader right-side layout
- When both action and contextLabel provided, show contextLabel; otherwise show action
- Or restructure to handle both properly

### Fix 4: HealthRing unique gradient ID
- Use `useId()` from React to generate unique gradient IDs

### Fix 5: Add missing Systems Nominal badge to AIOperationsCockpit header

### Fix 6: Connect onActionClick to NextActions

### Fix 7: Fix NextActions responsive grid
- Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5` for better tablet support

### Fix 8: Fix p-4.5 to proper Tailwind value
- Change to `p-[18px]`

### Fix 9: Connect PortalHeader onNewRequest to ActivityAndSupport
- Need to lift state or use callback

### Fix 10: Add Upload button to DocumentVault header
