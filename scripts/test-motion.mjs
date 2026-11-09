import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['src/three/motion.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { createMotionState, stepMotion } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);

let checked = 0;
function step(s, target, dt = 1 / 60) {
  const before = { ...s };
  stepMotion(s, target, dt);
  assert.ok(s.doorOpen >= 0 && s.doorOpen <= 1);
  assert.ok(Number.isFinite(s.cabinY) && s.cabinY >= 0 && s.cabinY <= 24);
  if (Math.abs(s.cabinY - before.cabinY) > 1e-10) {
    assert.equal(before.doorOpen, 0, 'Car moved before its doors had closed');
    assert.equal(s.doorOpen, 0, 'Car moved while doors were open');
  }
  if (s.doorOpen > 0) {
    assert.equal(s.cabinVel, 0, 'Opening requires a stationary car');
    assert.ok([0, 6, 12, 18, 24].some((y) => Math.abs(s.cabinY - y) < 1e-8));
  }
  checked++;
}

function settle(s, target, seconds = 5) {
  for (let i = 0; i < seconds * 60; i++) step(s, target);
}

const s = createMotionState();
for (const [p, y] of [[0.25, 6], [0.47, 12], [0.69, 18], [0.9, 24]]) {
  settle(s, p);
  assert.equal(s.cabinY, y);
  assert.equal(s.doorOpen, 1);
}
settle(s, 1);
assert.equal(s.cabinY, 24, 'The cabin must remain at the top while the camera visits the machinery');
assert.equal(s.doorOpen, 0);
assert.equal(s.machineBlend, 1);

// Reverse, including a jump directly from the machine room to an open lower stop.
for (const [p, y] of [[0.69, 18], [0.47, 12], [0.25, 6], [0, 0]]) {
  settle(s, p);
  assert.equal(s.cabinY, y);
  assert.equal(s.doorOpen, 1);
}

// Departure at slow scroll: the command closes doors before any vertical travel.
settle(s, 0.055);
assert.equal(s.cabinY, 0);
assert.equal(s.doorOpen, 0);
settle(s, 0.13);
assert.equal(s.doorOpen, 0);
assert.ok(s.cabinY > 0 && s.cabinY < 6);

// Sudden seeking, reversal mid-close, sub-frame motion and low-frame-rate spikes.
let seed = 913;
const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
for (let trial = 0; trial < 250; trial++) {
  const target = random();
  for (let frame = 0; frame < 45; frame++) step(s, target, [1 / 120, 1 / 60, 1 / 20, 0.2][trial % 4]);
}

const beforeIdle = { ...s };
stepMotion(s, 1, 0);
assert.deepEqual(s, beforeIdle, 'Zero elapsed time must not change the pose');

// Doors open after arrival even when the user stops scrolling at the exact boundary.
for (const [p, y] of [[0.2, 6], [0.42, 12], [0.64, 18], [0.86, 24]]) {
  settle(s, p);
  assert.equal(s.cabinY, y);
  assert.equal(s.doorOpen, 1);
}
console.log(`PASS: ${checked.toLocaleString()} frames. Interlock, stops, rapid jumps, reverse travel, finale and low FPS.`);
