# GFF AI Intelligence Forge

A drop-in interactive hero concept for the GFF AI homepage.

## What it includes

- True extruded hexagonal body with visible side depth
- Correct front and rear logo faces
- Full automatic 360-degree rotation
- Pointer drag control on desktop and touch devices
- Red and blue rim lighting with restrained data-node motion
- Quiet left-side copy area
- Responsive layout and reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The deployable output is written to `dist/`.

## Integrating into the existing Next.js homepage

Move the Three.js scene in `src/main.js` into a client component and initialize it inside `useEffect`. Keep the canvas inside the right-side hero column. Copy `public/assets/gff-emblem.png` into the site's public assets. Dispose geometries, materials, textures, the renderer and the `ResizeObserver` in the effect cleanup.

Recommended behavior:

- Run the reveal once after the hero enters the viewport.
- Keep the idle rotation subtle after the first full turn.
- Pause rendering when the hero is off-screen.
- On mobile or reduced-motion devices, show a poster/WebM fallback.
- Preserve the left 45-48% as a quiet copy-safe area.

The placeholder homepage text in `index.html` is only for composition testing and can be removed when this scene is placed into the existing website.
