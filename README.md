# Arsh Peyma Espadana

Persian RTL elevator journey built with React, TypeScript, Vite, React Three
Fiber, Three.js, Drei, GSAP ScrollTrigger and React Postprocessing.

## Run

```sh
npm install
npm run dev
```

```sh
npx tsc --noEmit
node scripts/test-motion.mjs
npm run build
npm run preview
```

## Motion Contract

- A short wheel movement, touch swipe, arrow/page key, or scrollbar release
  inside the tower journey automatically scrolls exactly one station forward
  or backward. At the ground floor and machine-room ends, outward scrolling
  returns to the surrounding page instead of trapping the visitor.
- Native scrolling writes a target in `[0, 1]` to `src/lib/store.ts`.
- `src/three/config.ts` defines stationary stops and ascending travel segments.
- `src/three/motion.ts` is the single controller for the actual car and doors.
  It closes both door sets completely, confirms the lock, then moves the car.
  After arriving exactly at a floor, it waits for settling before opening.
  Fast scroll jumps and reversals use the same interlock, not a proximity trigger.
- `Cabin.tsx` reads the controller's real door openness without separate damping.
- Service copy reads the actual floor and door state. Its connector is projected
  from the real doorway into screen coordinates.
- The cabin remains at the top floor while the camera visits the machine room.
- There is no pointer tracking, mouse parallax, orbit control or drag-to-rotate.
  The camera path depends only on scroll-controlled travel and the finale blend.

## Rendering

`src/three/palette.ts` and the tokens in `src/index.css` use the original
four-colour identity: paper `#FFFBF4`, sand `#D8CFBC`, stone `#565449`,
and ink `#11120D`. Intermediate stone and paper shades are derived from
these values for material depth without introducing a new accent colour.

The page alternates ink About and Footer against sand Projects and paper
Contact. The 3D shaft uses warm concrete and stone with ink-dark structure
and matte stone doors.

The navbar paints nothing: no background, border, veil or box, and it keeps one
colour (`#FFFFFF` on `.header-inner`) from the first pixel of the page to the
last. Readability comes from `mix-blend-mode: difference` on `.site-header`, so
the type borrows its contrast from whatever is beneath it — the shaft, an ink
band, or paper — and can never be swallowed by the model. A `@supports not`
block restores a solid paper bar with ink text on engines without blend
support. The mobile sheet is rendered as a sibling of the header so it stays
outside the blend and reads as matte ink.

`Journey.tsx` also steps its assisted hop aside: if a real gesture moves the
page away from where the tween placed it, the tween yields instead of dragging
the visitor back.

The canvas renders continuously while the journey is on screen and stops
outside it. All geometry is procedural;
no purchased model, HDR download or 3D image sequence is required. Fonts and
gallery images are served locally. Gallery content is illustrative placeholder
data, not a company project portfolio.

## Browser Verification

With the development server running:

```sh
node scripts/verify-browser.mjs
```

Puppeteer needs its downloaded Chrome binary and the standard Chrome Linux
libraries. The script verifies real WebGL rendering, all four stops, reverse
travel, no movement from mouse input, mobile RTL navigation, horizontal overflow
and reduced-motion fallback. Screenshots are saved under `artifacts/`.

Production can be tested by passing `TEST_URL=http://localhost:4173`. Optional
`TEST_WIDTH` and `TEST_HEIGHT` set the desktop viewport. `?inspect` exposes a
read-only-use snapshot helper for browser tests; normal production visits do
not expose it.

## Content And Deployment

- Edit service and illustrative gallery content in `src/lib/data.ts`.
- Replace placeholder company contact information before publishing.
- The consultation UI is a frontend prototype; a real submission endpoint must
  be connected before claiming requests are delivered to the company.
- Reduced-motion preference or unavailable WebGL uses the static RTL site.
- Font license files are included in `public/fonts/`.
