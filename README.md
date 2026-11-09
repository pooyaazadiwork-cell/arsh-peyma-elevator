# Arsh Peyma Espadana

Persian RTL elevator journey built with React, TypeScript, Vite, React Three Fiber, Three.js, Drei, GSAP ScrollTrigger and React Postprocessing.

## Status

Most of the project source is already on this repository.  
A few large files still need to be added from the original zip (they are too large for the automated upload path used here):

- `src/components/Journey.tsx`
- `src/components/Sections.tsx`
- `src/index.css`
- `src/three/Cabin.tsx`
- `src/three/Shaft.tsx`
- `public/images/*` (gallery images)
- `scripts/verify-browser.mjs` (optional)

## Quick complete setup

```sh
# clone
git clone https://github.com/pooyaazadiwork-cell/arsh-peyma-elevator.git
cd arsh-peyma-elevator

# copy the missing files from the original extracted zip
# (adjust the path to your extracted folder)
cp /path/to/extracted/src/components/Journey.tsx src/components/
cp /path/to/extracted/src/components/Sections.tsx src/components/
cp /path/to/extracted/src/index.css src/
cp /path/to/extracted/src/three/Cabin.tsx src/three/
cp /path/to/extracted/src/three/Shaft.tsx src/three/
cp -r /path/to/extracted/public/images public/
cp /path/to/extracted/scripts/verify-browser.mjs scripts/  # optional

git add .
git commit -m "Add remaining large source files and assets"
git push
```

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
and ink `#11120D`.

All geometry is procedural; no purchased model, HDR download or 3D image sequence is required.

## Content And Deployment

- Edit service and illustrative gallery content in `src/lib/data.ts`.
- Replace placeholder company contact information before publishing.
- The consultation UI is a frontend prototype; a real submission endpoint must
  be connected before claiming requests are delivered to the company.
- Reduced-motion preference or unavailable WebGL uses the static RTL site.
