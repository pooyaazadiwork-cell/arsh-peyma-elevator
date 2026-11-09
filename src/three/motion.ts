import { clamp01, damp, FLOOR_Y, keysToY, machineMask, requestedOpenFloor } from './config';

export type MotionPhase = 'open' | 'opening' | 'closing' | 'locked' | 'travelling' | 'arriving';

export interface MotionState {
  progress: number;
  cabinY: number;
  cabinVel: number;
  doorOpen: number;
  closedFor: number;
  settledFor: number;
  machineBlend: number;
  activeFloor: number;
  phase: MotionPhase;
}

export const createMotionState = (): MotionState => ({
  progress: 0, cabinY: 0, cabinVel: 0, doorOpen: 1, closedFor: 0,
  settledFor: 1, machineBlend: 0, activeFloor: 0, phase: 'open',
});

const approach = (value: number, target: number, step: number) =>
  value < target ? Math.min(target, value + step) : Math.max(target, value - step);

/** Mechanical interlock, independent of frame rate, scroll speed, and direction.
 * A closing frame NEVER moves the car. An arrival frame NEVER opens a door.
 */
export function stepMotion(s: MotionState, requestedProgress: number, elapsed: number): void {
  const dt = Math.min(Math.max(elapsed, 0), 0.1);
  if (!dt) return;
  const targetP = clamp01(requestedProgress);
  s.progress += (targetP - s.progress) * damp(dt, 10);
  if (Math.abs(targetP - s.progress) < 0.00001) s.progress = targetP;

  const targetY = keysToY(s.progress);
  const difference = targetY - s.cabinY;
  const mustTravel = difference !== 0;
  const requestedFloor = requestedOpenFloor(s.progress);
  const parkedFloor = FLOOR_Y.findIndex((y) => Math.abs(y - s.cabinY) < 0.04);
  const mayOpen = !mustTravel && parkedFloor >= 0 && requestedFloor === parkedFloor;
  const previousY = s.cabinY;

  if (!mayOpen && s.doorOpen > 0) {
    s.doorOpen = approach(s.doorOpen, 0, dt / 0.58);
    s.phase = 'closing';
    s.closedFor = 0;
    s.settledFor = 0;
  } else if (mustTravel) {
    s.closedFor += dt;
    s.settledFor = 0;
    s.phase = 'locked';
    // A short lock-confirmation pause also protects abrupt anchor jumps.
    if (s.closedFor >= 0.09 && s.machineBlend < 0.025) {
      const dy = Math.max(-12 * dt, Math.min(12 * dt, difference * damp(dt, 9)));
      s.cabinY = Math.abs(difference) < 0.0015 ? targetY : s.cabinY + dy;
      s.phase = 'travelling';
    }
  } else {
    s.settledFor += dt;
    s.closedFor += dt;
    if (mayOpen && s.settledFor >= 0.12) {
      s.doorOpen = approach(s.doorOpen, 1, dt / 0.7);
      s.phase = s.doorOpen === 1 ? 'open' : 'opening';
      s.closedFor = 0;
    } else {
      s.phase = mayOpen ? 'arriving' : 'locked';
    }
  }

  s.cabinVel = (s.cabinY - previousY) / dt;
  s.activeFloor = FLOOR_Y.findIndex((y) => Math.abs(y - s.cabinY) < 0.04);
  const machineTarget = s.cabinY === 24 && s.doorOpen === 0 && s.cabinVel === 0
    ? machineMask(s.progress) : 0;
  s.machineBlend += (machineTarget - s.machineBlend) * damp(dt, 7);
  // Snap decisively: an asymptotic blend would leave the camera drifting forever
  // and keep the on-demand renderer awake.
  if (Math.abs(machineTarget - s.machineBlend) < 0.0015) s.machineBlend = machineTarget;
}
