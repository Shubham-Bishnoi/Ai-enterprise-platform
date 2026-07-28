---
name: GFF AI
description: Cinematic engineering in daylight - the enterprise AI forge rendered light, precise, and in motion
colors:
  signal-blue: "#155dfc"
  signal-blue-deep: "#0f4bd8"
  harbor-navy: "#07162f"
  navy-abyss: "#0b1026"
  forge-red: "#ef233c"
  coral-flare: "#ff4d6d"
  ion-purple: "#a855f7"
  soft-lavender: "#c084fc"
  daylight: "#f8faff"
  panel-white: "#ffffff"
  mist-blue: "#eef3fb"
  ice-blue: "#eaf2ff"
  hairline-blue: "#e4eaf5"
  slate-signal: "#4b5b76"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.2rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  sm: "0.6rem"
  md: "0.8rem"
  lg: "1rem"
  xl: "1.4rem"
  2xl: "1.8rem"
  3xl: "2.2rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "2rem"
  lg: "4rem"
  section: "5rem"
  section-lg: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.72)"
    textColor: "{colors.harbor-navy}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.harbor-navy}"
    rounded: "{rounded.3xl}"
    padding: "32px"
  eyebrow-pill:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.signal-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  nav-link-active:
    backgroundColor: "{colors.ice-blue}"
    textColor: "{colors.signal-blue-deep}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
---

# Design System: GFF AI

## Overview

**Creative North Star: "The Intelligence Forge"**

GFF AI's visual world is a forge that runs in daylight. Where competitors stage enterprise AI as a dark, mysterious cockpit, this system shows the machinery being assembled in a bright, airy room: near-white blue-tinted surfaces (#f8faff), deep harbor-navy ink, and one electric signal-blue accent, with the full brand spectrum (red through purple to blue) reserved for the moments where intelligence visibly flows. The mood is **cinematic engineering**: the page choreographs real spectacle (a 3D forge emblem, page-wide data ribbons, a 500vh pinned assembly sequence), but every effect is engineered, capability-gated, and honest about what the product does.

Density is generous and confident. Content floats in rounded white panels on soft tinted shadows; sections breathe at 80 to 96px of vertical rhythm; type is Inter at semibold, never bold, with hierarchy carried by scale and color rather than weight. Motion is a first-class material: staggered reveals on a house easing curve, scroll-driven storytelling, and a lift-and-glow response on everything interactive.

Confirmed rejections: no dark mode on the public site (dark belongs exclusively to the portal cockpit), no gradient-filled buttons, no heavy black shadows.

**Key Characteristics:**
- Light-only, blue-tinted daylight world with a single electric accent
- The red-to-purple-to-blue brand spectrum appears as flowing signal, not as decoration
- Pill-shaped interactive elements; large soft-radius (2.2rem) content panels
- Cinematic, scroll-choreographed motion that always degrades gracefully
- Semibold ceiling: weight never exceeds 600

## Colors

A cool daylight neutral field carrying one dominant electric blue, with red and purple held in reserve as the outer stops of the brand spectrum.

### Primary
- **Signal Blue** (#155dfc): The single working accent. Primary buttons, active nav states, links, key icons, focus rings, and progress indicators. Roughly 80% of all accent usage on any page.
- **Signal Blue Deep** (#0f4bd8): Hover state of Signal Blue and accent-on-tint text.

### Secondary
- **Forge Red** (#ef233c) and **Coral Flare** (#ff4d6d): The hot end of the brand spectrum. Destructive states, occasional stat highlights, and the warm stops of gradients and 3D rim lighting. Never a button fill.
- **Ion Purple** (#a855f7) and **Soft Lavender** (#c084fc): The spectrum's midpoint. Tinted icon chips (bg at 10% opacity), the brand divider, gradient midpoints.

### Neutral
- **Harbor Navy** (#07162f): All headings and primary text; the dark surface of the footer/CTA bands. Navy Abyss (#0b1026) is its deepest variant.
- **Daylight** (#f8faff): Page background.
- **Panel White** (#ffffff): Card and popover surfaces.
- **Mist Blue** (#eef3fb): Secondary surface, muted fills, soft section tints.
- **Ice Blue** (#eaf2ff): Accent tint for active states and blue-touched surfaces.
- **Hairline Blue** (#e4eaf5): All borders and input strokes.
- **Slate Signal** (#4b5b76): Muted body text and captions.

### Named Rules
**The One Spectrum Rule.** The full red-to-purple-to-blue gradient (`#ef233c → #a855f7 → #155dfc`) is the brand's signature and lives in one composed signature moment per page: on the home page, the hero's data ribbons plus its gradient display text form that single moment. Elsewhere the spectrum appears only as the 1px brand divider. It never fills buttons, cards, icons, or metric numbers.

**The Daylight Rule.** The public site is light-only (`color-scheme: light`). Dark surfaces exist only as intentional navy bands and in the portal's separate dark cockpit world.

## Typography

**Display Font:** Inter (with system-ui fallback)
**Body Font:** Inter (same family, single-typeface system)

**Character:** A single-family system that gets its personality from discipline rather than contrast: tight tracking and semibold weight up top, relaxed slate body text below, and wide-tracked uppercase micro-labels as the technical grace note. OpenType features `ss01` and `cv01` give Inter a slightly more engineered voice.

### Hierarchy
- **Display** (600, clamp(3rem, 6vw, 4.2rem), 1.04): Hero headlines only. Tracking -0.025em; `text-balance`.
- **Headline** (600, 1.875rem to 3rem, 1.15): Section H2s via SectionHeader; max-width 48rem.
- **Title** (600, 1.125rem to 1.5rem, 1.3): Card headings and sub-features.
- **Body** (400, 1rem base with 1.125rem lead paragraphs, 1.625): Slate Signal color; `text-pretty`; keep measure at or under 65ch.
- **Label** (600, 0.75rem, 0.2em tracking, UPPERCASE): Eyebrow pills, footer column headers, data captions.

### Named Rules
**The Semibold Ceiling.** Font weight never exceeds 600. Hierarchy is carried by size, color (Harbor Navy vs Slate Signal), and spacing, never by bolding.

## Layout

The standard stage is `max-w-7xl` (80rem) centered with 16/24/32px responsive gutters; cinematic set pieces (hero, scroll sequence) widen to 1400 to 1440px. Section rhythm is 80 to 112px vertical padding (py-20 at mobile, md:py-24 to md:py-28 on desktop), with heroes opening at 128 to 160px top padding to clear the fixed nav. Feature layouts favor asymmetric splits (46/54, 44/56, 38/62) over symmetric halves; card grids run 2 to 4 columns and collapse to single column below 768px. The navbar is fixed, 64px tall, transparent over the hero, and gains a glass panel treatment after 12px of scroll; it collapses to a mobile menu below the `xl` (1280px) breakpoint. Enhanced 3D and pinned-scroll experiences mount only at 1024px and above.

## Elevation & Depth

Depth is buoyant and ambient. Surfaces float on soft, navy-tinted shadows rather than sitting behind borders alone, and elevation is a response to interaction: cards and buttons rise (-2 to -4px translate) and their shadow deepens or takes on a blue glow. There are no hard black shadows and no purely flat surfaces; even resting cards carry the ambient soft shadow. Glass (`rgba(255,255,255,0.72)` + 16px backdrop blur) is the material for chrome that overlays content: the scrolled navbar and secondary buttons.

### Shadow Vocabulary
- **Ambient rest** (`box-shadow: 0 8px 30px rgba(7,22,47,0.07)`): Default for every card, pill, and the scrolled navbar.
- **Hover lift** (`box-shadow: 0 18px 48px rgba(7,22,47,0.10)`): Cards on hover, paired with -4px translate.
- **Blue glow** (`box-shadow: 0 12px 36px rgba(21,93,252,0.28)`): Primary buttons on hover, paired with -2px translate.
- **Deep stage** (`box-shadow: 0 20px 60px rgba(7,22,47,0.16)`): Featured media panels and modal-scale surfaces.

### Named Rules
**The Lift-and-Glow Rule.** Every interactive surface responds to hover with a small upward translate plus a shadow change: neutral surfaces deepen their ambient shadow, primary actions glow Signal Blue. Nothing merely changes color.

## Shapes

Two silhouettes define the system: the pill and the soft slab. All buttons, nav links, chips, and eyebrows are fully rounded (9999px); all content panels are large-radius slabs (2.2rem / rounded-3xl, stepping down to 1.8rem for nested surfaces). Borders are 1px Hairline Blue and delimit surfaces, not sections; section boundaries are made with spacing, tint shifts, or the 1px purple-fade brand divider. The recurring geometry motif is the hexagonal forge emblem and its flowing bezier ribbons, echoed in SVG rather than repeated as a UI pattern.

## Components

### Buttons (BrandButton)
- **Shape:** Full pill (9999px)
- **Primary:** Signal Blue fill, white text, medium weight; `px-6 py-3` at 0.875rem (lg: `px-8 py-4` at 1rem); ambient shadow at rest
- **Hover / Focus:** Signal Blue Deep fill, -2px lift, blue glow shadow; 300ms all-property transition; 2px Signal Blue focus ring with offset
- **Secondary:** Glass panel (white at 72% + blur), Harbor Navy text, Hairline Blue border; hover lifts and warms the border to Signal Blue at 40%

### Eyebrows
- **Pill form:** Panel White fill, Hairline Blue border, ambient shadow; Label typography in Signal Blue. Used in cinematic set pieces (hero, scroll sequence).
- **Plain form:** Bare Label typography in Signal Blue, no container. Used by SectionHeader for standard content sections.
- **Use:** One per hero or section header, above the headline; never both forms stacked in one column

### Cards / Containers
- **Corner Style:** 2.2rem (rounded-3xl)
- **Background:** Panel White; softer variants at 70% white or Mist Blue at 40%
- **Shadow Strategy:** Ambient rest, hover lift per Elevation
- **Border:** 1px Hairline Blue
- **Internal Padding:** 32px, stepping to 40 to 48px on desktop feature cards

### Inputs / Fields (SelectField)
- **Style:** Custom WAI-ARIA combobox; Panel White surface, Hairline Blue stroke, pill or soft radius to match context
- **Focus:** 2px Signal Blue ring; animated open transition via framer-motion
- **Error:** Forge Red icon and message below the field

### Navigation
- **Fixed top bar, 64px; transparent at page top, glass panel + hairline border + ambient shadow after 12px scroll.** Links are pills: idle Slate Signal, hover Harbor Navy, active Ice Blue fill with Signal Blue Deep text. Primary CTA is a compact BrandButton. Collapses below 1280px to a menu-icon sheet.

### The Forge Stage (signature)
The hero pairs page-wide SVG data ribbons (22 bezier paths in the brand spectrum gradient, with traveling light pulses and pointer parallax) with the interactive 3D Intelligence Forge emblem (extruded hexagon, red and blue rim lights). Both are capability-gated: below 1024px, with reduced motion, or without WebGL they freeze or fall back to the static emblem image. Any new cinematic set piece must follow this pattern: full experience gated, honest static fallback always shipped.

## Do's and Don'ts

### Do:
- **Do** use Signal Blue (#155dfc) as the only button and link accent; keep red and purple in tints, gradients, and lighting.
- **Do** give every interactive element the lift-and-glow hover response and a visible `focus-visible` ring (2px Signal Blue, offset 2).
- **Do** use the house easing `cubic-bezier(0.21, 0.47, 0.32, 0.98)` with 0.6 to 0.8s durations for reveals, staggering hero elements by 0.1s steps.
- **Do** honor `prefers-reduced-motion` everywhere: reveals render static, ribbons and 3D scenes freeze, scroll choreography collapses to stacked content.
- **Do** keep headings Harbor Navy, body Slate Signal, and measure at or under 65ch.

### Don't:
- **Don't** introduce dark sections on the public site beyond intentional navy CTA/footer bands; the dark cockpit belongs to the portal alone.
- **Don't** fill buttons, icons, or cards with the brand gradient; the spectrum flows (ribbons, divider, display text) at most once per page.
- **Don't** exceed font-weight 600 or add a second typeface.
- **Don't** use hard black shadows, borderless floating text sections, or square-cornered interactive elements.
- **Don't** ship a 3D or scroll-driven experience without its sub-1024px and reduced-motion fallback.
