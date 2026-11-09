import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { Shaft } from './Shaft';
import { Cabin } from './Cabin';
import { runtime } from './runtime';
import { getMaterials } from './materials';
import { scrollStore } from '../lib/store';
import { blueprintMask } from './config';
import { stepMotion } from './motion';
import { PALETTE } from './palette';

const ROPE_X = [-0.14, 0, 0.14];

export function ElevatorModel() {
  const mats = getMaterials(scrollStore.quality);
  const cabin = useRef<THREE.Group>(null!);
  const ropes = useRef<Array<THREE.Mesh | null>>([]);
  const counterRope = useRef<THREE.Mesh>(null!);
  const dimensions = useRef<THREE.Group>(null!);
  const landingLight = useRef<THREE.PointLight>(null!);
  const dimensionPoints = useMemo(() => [
    [-1.1, 3.6, 0.95], [1.1, 3.6, 0.95],
    [-1.1, 3.48, 0.95], [-1.1, 3.72, 0.95],
    [1.1, 3.48, 0.95], [1.1, 3.72, 0.95],
    [1.7, 0.12, 0.95], [1.7, 2.5, 0.95],
    [1.58, 0.12, 0.95], [1.82, 0.12, 0.95],
    [1.58, 2.5, 0.95], [1.82, 2.5, 0.95],
  ] as [number, number, number][], []);

  useFrame((_, dt) => {
    // This runs before doors, mechanisms, camera and DOM projection.
    stepMotion(runtime, scrollStore.progress, dt);
    cabin.current.position.y = runtime.cabinY;

    const attachY = runtime.cabinY + 3.47;
    const topY = 29.18 - 0.58;
    for (const rope of ropes.current) {
      if (!rope) continue;
      rope.scale.y = topY - attachY;
      rope.position.y = (topY + attachY) / 2;
    }
    const counterY = 26 - runtime.cabinY + 0.85;
    counterRope.current.scale.y = 28.66 - counterY;
    counterRope.current.position.y = (28.66 + counterY) / 2;

    dimensions.current.position.y = runtime.cabinY;
    dimensions.current.visible = blueprintMask(runtime.progress) > 0.1 && runtime.doorOpen > 0.8;
    landingLight.current.position.y = runtime.cabinY + 1.35;
    landingLight.current.intensity = (scrollStore.quality === 'high' ? 0.6 : 0.3) * runtime.doorOpen;
    mats.glass.opacity = 0.2 * (1 - runtime.machineBlend * 0.5);
  }, -3);

  return (
    <group name="elevator-world">
      <Shaft />
      <group ref={cabin} name="cabinRig"><Cabin /></group>
      <group name="suspension">
        {ROPE_X.map((x, index) => (
          <mesh key={x} ref={(el) => { ropes.current[index] = el; }} position={[x, 16, -0.05]} material={mats.rope}>
            <cylinderGeometry args={[0.017, 0.017, 1, 8]} />
          </mesh>
        ))}
        <mesh ref={counterRope} position={[0.9, 27, -1.62]} material={mats.rope}>
          <cylinderGeometry args={[0.018, 0.018, 1, 8]} />
        </mesh>
      </group>
      <group ref={dimensions} visible={false} name="technical-dimensions">
        <Line points={dimensionPoints} segments color={PALETTE.accent} transparent opacity={0.7} lineWidth={1} />
      </group>
      <pointLight ref={landingLight} position={[0, 1.35, 0.1]} color={PALETTE.practical} intensity={0} distance={4.5} decay={2} />
    </group>
  );
}
