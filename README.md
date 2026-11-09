# Arsh Peyma Espadana

Persian RTL scroll-driven 3D elevator website — React, TypeScript, Vite, React Three Fiber, Three.js, Drei, GSAP ScrollTrigger.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:5173

```sh
npx tsc --noEmit
node scripts/test-motion.mjs
npm run build
npm run preview
```

## What’s included

- Full source structure (App, Header, Hero, Journey, Sections)
- Complete Three.js scene: Shaft, Cabin, ElevatorModel, materials, motion controller, camera rig
- Scroll-driven station hops with door interlock
- RTL layout, brand palette (paper / sand / stone / ink)
- Reduced-motion & no-WebGL static fallback
- Test script for motion interlock

## Optional assets

Gallery images live under `public/images/`. If they are missing, the Projects section still renders titles and tags. You can drop the four JPG files from the original package into that folder:

- `gallery-cabin.jpg`
- `gallery-machine.jpg`
- `gallery-lobby.jpg`
- `gallery-design.jpg`

Font binary files (`.woff2`) are referenced in `src/fonts.css` but are not required for a first run — the browser will fall back to system fonts until you add them under `public/fonts/`.

## Content

Edit services and project list in `src/lib/data.ts`.  
Replace contact details in `src/components/Sections.tsx` before publishing.

## Notes

Some of the larger 3D and CSS files were uploaded in a compact but fully functional form so the site runs end-to-end from this repository. If you need the absolute original line-by-line versions of `Shaft.tsx`, `Cabin.tsx`, `Journey.tsx` or `index.css`, they remain available in the original zip and can be dropped in to replace the current files.
