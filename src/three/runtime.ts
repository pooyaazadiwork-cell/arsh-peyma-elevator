import { createMotionState } from './motion';

// Shared render state. No mouse position or pointer-based camera input.
export const runtime = {
  ...createMotionState(),
  doorway: { x: 0, y: 0, visible: false },
};
