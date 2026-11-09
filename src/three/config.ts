// One continuous shaft. Downward page scrolling requests upward car travel.
export const FLOOR_GAP = 6;
export const FLOOR_Y = [0, 6, 12, 18, 24];
export const SHAFT = { width: 4.4, depth: 4, top: 33.5, bottom: -3.8 };
export const MACHINE = { floor: 28.2, ceil: 33.5 };
export const CABIN = { w: 2.2, h: 2.5, d: 1.9 };

// Open/close commands belong ONLY to the stationary portions of the journey.
export const STOPS = [
  { floor: 0, arrival: 0, open: 0, close: 0.028, departure: 0.08 },
  { floor: 1, arrival: 0.2, open: 0.2, close: 0.275, departure: 0.3 },
  { floor: 2, arrival: 0.42, open: 0.42, close: 0.495, departure: 0.52 },
  { floor: 3, arrival: 0.64, open: 0.64, close: 0.715, departure: 0.74 },
  { floor: 4, arrival: 0.86, open: 0.86, close: 0.918, departure: 0.94 },
] as const;

export const KEYS: Array<[number, number]> = [
  [0, 0], [0.08, 0], [0.2, 6], [0.3, 6], [0.42, 12],
  [0.52, 12], [0.64, 18], [0.74, 18], [0.86, 24], [1, 24],
];
export const PANEL_RANGES = STOPS.slice(1).map((s) => [s.open, s.close] as const);
export const DOOR_CENTERS = [0.25, 0.47, 0.69, 0.9];
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const sstep = (v: number) => {
  const x = clamp01(v);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export const band = (p: number, a: number, b: number, m = 0.025) =>
  sstep((p - a + m) / (2 * m)) * (1 - sstep((p - b + m) / (2 * m)));
export const damp = (dt: number, lambda: number) => 1 - Math.exp(-dt * lambda);

export function keysToY(progress: number): number {
  const p = clamp01(progress);
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [a, y0] = KEYS[i];
    const [b, y1] = KEYS[i + 1];
    if (p <= b) return y0 + (y1 - y0) * sstep((p - a) / (b - a));
  }
  return 24;
}

export function requestedOpenFloor(p: number): number | null {
  const stop = STOPS.find((s) => p >= s.open && p <= s.close);
  return stop?.floor ?? null;
}

export function floorIndex(p: number): number {
  if (p >= 0.945) return 5;
  return Math.max(0, Math.min(4, Math.round(keysToY(p) / FLOOR_GAP)));
}

export const blueprintMask = (p: number) => band(p, 0.65, 0.715, 0.018);
export const cutawayMask = (p: number) => sstep((p - 0.945) / 0.04);
export const machineMask = (p: number) => sstep((p - 0.945) / 0.045);
