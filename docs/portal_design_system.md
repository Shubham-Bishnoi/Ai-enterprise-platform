# Portal Design System

## Visual Style
- Dark-first, premium enterprise cockpit.
- Glass panels: `rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]`.
- Gradients: red → purple → blue background halos.

## Interaction
- Hover: `hover:-translate-y-0.5` + `hover:border-white/20`.
- Support modal uses frosted overlay with blur.

## Theme Compatibility
- Portal intentionally keeps a dark cockpit even if the rest of the site is in light mode.
- Text stays high-contrast and readable.
