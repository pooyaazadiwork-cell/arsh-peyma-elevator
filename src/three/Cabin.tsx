import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { runtime } from "./runtime";
import { getMaterials } from "./materials";
import { scrollStore } from "../lib/store";
import { PALETTE } from './palette';
import { BeveledGeometry } from './BeveledGeometry';

/**
 * Elevator cabin — a detailed through-car with doors on both faces,
 * a visible rooftop door-operator mechanism, architectural interior wall
 * panels, threshold sill grooves, and a soft neutral threshold glow that spills out
 * whenever the doors slide open at a floor.
 */
export function Cabin() {
  const mats = getMaterials(scrollStore.quality);
  const fL = useRef<THREE.Group>(null!);
  const fR = useRef<THREE.Group>(null!);
  const bL = useRef<THREE.Mesh>(null!);
  const bR = useRef<THREE.Mesh>(null!);
  const armL = useRef<THREE.Mesh>(null!);
  const armR = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.PointLight>(null!);
  const spill = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    // The same interlocked state drives both the car and its actual door leaves.
    const open = runtime.doorOpen;

    const off = 0.29 + open * 0.62;
    if (fL.current) fL.current.position.x = -off;
    if (fR.current) fR.current.position.x = off;
    if (bL.current) bL.current.position.x = -off;
    if (bR.current) bR.current.position.x = off;
    // operator linkage arms track the doors
    if (armL.current) armL.current.position.x = -off * 0.85;
    if (armR.current) armR.current.position.x = off * 0.85;

    // interior & threshold light swell as the doors open at a floor
    if (glow.current) {
      const base = scrollStore.quality === "high" ? 1.15 : 0.6;
      glow.current.intensity = base + open * 0.25;
    }
    if (spill.current) {
      spill.current.intensity = (scrollStore.quality === "high" ? 0.3 : 0.16) * open;
    }
  });

  return (
    <group name="cabin">
      {/* ======== CAR SLING (structural load frame) ======== */}
      {[-1.215, 1.215].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.42, -0.05]} material={mats.steelDark}>
            <boxGeometry args={[0.08, 3.55, 0.22]} />
          </mesh>
          {/* flange ribs */}
          <mesh position={[x, 1.42, 0.06]} material={mats.steel}>
            <boxGeometry args={[0.12, 3.55, 0.025]} />
          </mesh>
          <mesh position={[x, 1.42, -0.16]} material={mats.steel}>
            <boxGeometry args={[0.12, 3.55, 0.025]} />
          </mesh>
        </group>
      ))}
      {/* cross members */}
      {[0.28, 2.62].map((y) => (
        <mesh key={y} position={[0, y, -0.05]} material={mats.steelDark}>
          <boxGeometry args={[2.4, 0.08, 0.18]} />
        </mesh>
      ))}
      {/* sling shoes / guide brackets */}
      {[-1.2, 1.2].map((x) =>
        [0.28, 2.62].map((y) => (
          <group key={`${x}${y}`} position={[x, y, -0.05]}>
            <mesh material={mats.steelDark}>
              <boxGeometry args={[0.14, 0.24, 0.28]} />
            </mesh>
            <mesh position={[x > 0 ? -0.05 : 0.05, 0.08, 0.08]} rotation={[0, 0, Math.PI / 2]} material={mats.graphite}>
              <cylinderGeometry args={[0.055, 0.055, 0.04, 14]} />
            </mesh>
            <mesh position={[x > 0 ? -0.05 : 0.05, -0.08, -0.08]} rotation={[0, 0, Math.PI / 2]} material={mats.graphite}>
              <cylinderGeometry args={[0.055, 0.055, 0.04, 14]} />
            </mesh>
          </group>
        ))
      )}

      {/* ======== CABIN BODY ======== */}
      {/* floor */}
      <mesh position={[0, 0.02, 0]} material={mats.checker} receiveShadow>
        <boxGeometry args={[2.0, 0.06, 1.7]} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, 2.42, 0]} material={mats.cabinWall}>
        <boxGeometry args={[2.0, 0.06, 1.7]} />
      </mesh>
      {/* side walls */}
      {[-1.0, 1.0].map((x) => (
        <mesh key={x} position={[x, 1.22, 0]} material={mats.cabinWall}>
          <boxGeometry args={[0.04, 2.35, 1.7]} />
        </mesh>
      ))}
      {/* rear wall */}
      <mesh position={[0, 1.22, -0.85]} material={mats.cabinWall}>
        <boxGeometry args={[2.0, 2.35, 0.04]} />
      </mesh>
      {/* front wall (above door) */}
      <mesh position={[0, 2.22, 0.85]} material={mats.cabinWall}>
        <boxGeometry args={[2.0, 0.4, 0.04]} />
      </mesh>

      {/* interior wall panels (decorative) */}
      {[-0.7, 0, 0.7].map((x) => (
        <mesh key={x} position={[x, 1.3, -0.82]} material={mats.cabinAccent}>
          <boxGeometry args={[0.55, 1.8, 0.02]} />
        </mesh>
      ))}

      {/* ======== FRONT DOOR SET ======== */}
      {/* header */}
      <mesh position={[0, 2.32, 0.9]} material={mats.steel}>
        <boxGeometry args={[2.2, 0.36, 0.09]} />
      </mesh>
      {/* jambs */}
      {[-1.06, 1.06].map((x) => (
        <mesh key={x} position={[x, 1.15, 0.9]} material={mats.steelDark}>
          <boxGeometry args={[0.07, 2.3, 0.11]} />
        </mesh>
      ))}
      {/* left door leaf */}
      <group ref={fL} name="door-front-left" position={[-0.91, 1.12, 0.94]}>
        <mesh material={mats.doorPanel}>
          <BeveledGeometry args={[0.58, 2.12, 0.048]} radius={0.006} />
        </mesh>
        <mesh position={[-0.01, 0, 0.026]} material={mats.doorPanel}>
          <boxGeometry args={[0.44, 1.92, 0.006]} />
        </mesh>
        <mesh position={[0.275, 0, 0]} material={mats.graphite}>
          <boxGeometry args={[0.016, 2.12, 0.052]} />
        </mesh>
      </group>
      {/* right door leaf */}
      <group ref={fR} name="door-front-right" position={[0.91, 1.12, 0.94]}>
        <mesh material={mats.doorPanel}>
          <BeveledGeometry args={[0.58, 2.12, 0.048]} radius={0.006} />
        </mesh>
        <mesh position={[0.01, 0, 0.026]} material={mats.doorPanel}>
          <boxGeometry args={[0.44, 1.92, 0.006]} />
        </mesh>
        <mesh position={[-0.275, 0, 0]} material={mats.graphite}>
          <boxGeometry args={[0.016, 2.12, 0.052]} />
        </mesh>
      </group>

      {/* ======== REAR DOOR SET ======== */}
      <mesh position={[0, 2.32, -0.9]} material={mats.steel}>
        <boxGeometry args={[2.2, 0.36, 0.09]} />
      </mesh>
      {[-1.06, 1.06].map((x) => (
        <mesh key={x} position={[x, 1.15, -0.9]} material={mats.steelDark}>
          <boxGeometry args={[0.07, 2.3, 0.11]} />
        </mesh>
      ))}
      <mesh ref={bL} position={[-0.91, 1.12, -0.94]} material={mats.steel}>
        <boxGeometry args={[0.58, 2.12, 0.05]} />
      </mesh>
      <mesh ref={bR} position={[0.91, 1.12, -0.94]} material={mats.steel}>
        <boxGeometry args={[0.58, 2.12, 0.05]} />
      </mesh>

      {/* car bottom skirt + toe guard */}
      <mesh position={[0, -0.11, 0]} material={mats.steelDark}>
        <boxGeometry args={[2.04, 0.24, 1.74]} />
      </mesh>
      <mesh position={[0, -0.28, 0.91]} material={mats.graphite}>
        <boxGeometry args={[1.28, 0.28, 0.02]} />
      </mesh>

      {/* interior practical + threshold spill light */}
      <pointLight
        ref={glow}
        position={[0, 1.55, 0]}
        color={PALETTE.practical}
        intensity={scrollStore.quality === "high" ? 1.2 : 0.7}
        distance={3.6}
        decay={2}
      />
      <pointLight
        ref={spill}
        position={[0, 1.75, 2.9]}
        color={PALETTE.practical}
        intensity={0}
        distance={4.5}
        decay={2}
      />
    </group>
  );
}
