import { extend, type ThreeElement } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

extend({ RoundedBoxGeometry });
declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedBoxGeometry: ThreeElement<typeof RoundedBoxGeometry>;
  }
}

// Small, real chamfers catch softbox highlights instead of razor-sharp box edges.
export function BeveledGeometry({ args, radius = 0.012 }: {
  args: [number, number, number]; radius?: number;
}) {
  const bevel = Math.min(radius, ...args.map((v) => v * 0.2));
  return <roundedBoxGeometry args={[...args, 2, bevel]} />;
}
