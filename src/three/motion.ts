import { clamp01, damp, keysToY, requestedOpenFloor, STOPS } from './config';

export type MotionState = {
  carY: number;
  doorOpen: number;
  floor: number;
  locked: boolean;
};

export function createMotionState(): MotionState {
  return { carY: 0, doorOpen: 0, floor: 0, locked: true };
}

/**
 * Single controller for car height and both door sets.
 * Always closes fully, confirms lock, then travels. After exact arrival
 * it settles before opening. Fast jumps and reversals share the same interlock.
 */
export function stepMotion(
  state: MotionState,
  progress: number,
  dt: number,
): MotionState {
  const targetY = keysToY(progress);
  const openFloor = requestedOpenFloor(progress);
  const near = Math.abs(state.carY - targetY) < 0.02;

  // Door interlock: only open when stationary at a stop and unlocked.
  let doorOpen = state.doorOpen;
  let locked = state.locked;

  if (openFloor !== null && near) {
    locked = false;
    doorOpen = Math.min(1, doorOpen + damp(dt, 6));
  } else {
    // Close first
    doorOpen = Math.max(0, doorOpen - damp(dt, 8));
    if (doorOpen < 0.02) {
      locked = true;
      doorOpen = 0;
    }
  }

  // Move only when doors are closed / locked
  let carY = state.carY;
  if (locked || doorOpen < 0.05) {
    const k = damp(dt, 4.5);
    carY = carY + (targetY - carY) * k;
  }

  // Snap when very close to avoid residual drift
  if (Math.abs(carY - targetY) < 0.005) carY = targetY;

  const floor = STOPS.reduce((best, s) =>
    Math.abs(keysToY(s.arrival) - carY) < Math.abs(keysToY(STOPS[best].arrival) - carY)
      ? s.floor
      : best
  , 0);

  return { carY, doorOpen, floor, locked };
}
