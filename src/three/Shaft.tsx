import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { FLOOR_Y, MACHINE, SHAFT } from "./config";
import { runtime } from "./runtime";
import { getMaterials } from "./materials";
import { scrollStore } from "../lib/store";
import { PALETTE } from './palette';
import { BeveledGeometry } from './BeveledGeometry';

const IN_X = 2.25;
const IN_Z = 2.05;

function signTexture(top: string, bottom: string) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = '#11120D';
  g.fillRect(0, 0, 256, 128);
  g.strokeStyle = '#3A3A36';
  g.lineWidth = 3;
  g.strokeRect(8, 8, 240, 112);
  g.fillStyle = '#FFFBF4';
  g.font = "600 52px Vazirmatn, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(top, 128, 52);
  g.fillStyle = '#565449';
  g.font = "600 21px 'Space Grotesk', sans-serif";
  g.fillText(bottom, 128, 99);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Landing({ index, mats }: { index: number; mats: ReturnType<typeof getMaterials> }) {
  const y = FLOOR_Y[index];
  const labels = ["۰", "۱", "۲", "۳", "۴"];
  const sign = useMemo(() => signTexture(labels[index], `FLOOR ${index}`), [index]);
  return (
    <group position={[0, y, 0]}>
      {/* landing floor slab */}
      <mesh position={[0, -0.05, 1.6]} material={mats.stone} receiveShadow>
        <boxGeometry args={[4.8, 0.12, 2.2]} />
      </mesh>
      {/* landing door opening frame */}
      <mesh position={[0, 1.15, 1.05]} material={mats.steelDark}>
        <boxGeometry args={[2.4, 2.4, 0.08]} />
      </mesh>
      {/* sign plate */}
      <mesh position={[1.5, 1.8, 1.1]} material={new THREE.MeshStandardMaterial({ map: sign, roughness: 0.6 })}>
        <planeGeometry args={[0.5, 0.25]} />
      </mesh>
      {/* call button panel */}
      <mesh position={[-1.4, 1.3, 1.1]} material={mats.steel}>
        <boxGeometry args={[0.12, 0.35, 0.04]} />
      </mesh>
    </group>
  );
}

export function Shaft() {
  const mats = getMaterials(scrollStore.quality);
  const governor = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    if (governor.current && runtime.cabinVel !== 0) {
      governor.current.rotation.z += runtime.cabinVel * 0.8 * dt;
    }
  });

  return (
    <group name="shaft">
      {/* back wall */}
      <mesh position={[0, 15, -IN_Z]} material={mats.concrete} receiveShadow>
        <boxGeometry args={[SHAFT.width, 36, 0.3]} />
      </mesh>
      {/* left wall */}
      <mesh position={[-IN_X, 15, 0]} material={mats.concrete} receiveShadow>
        <boxGeometry args={[0.3, 36, SHAFT.depth]} />
      </mesh>
      {/* right wall (partial for cutaway) */}
      <mesh position={[IN_X + 0.4, 15, -0.6]} material={mats.concreteDeep}>
        <boxGeometry args={[0.25, 36, 2.8]} />
      </mesh>

      {/* guide rails */}
      {[-1.35, 1.35].map((x) => (
        <group key={x}>
          <mesh position={[x, 15, -0.3]} material={mats.rail}>
            <boxGeometry args={[0.06, 34, 0.06]} />
          </mesh>
          {/* rail brackets */}
          {FLOOR_Y.map((fy) => (
            <mesh key={fy} position={[x, fy + 0.5, -0.3]} material={mats.steelDark}>
              <boxGeometry args={[0.14, 0.12, 0.18]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* pit */}
      <mesh position={[0, -2.2, 0]} material={mats.concreteDeep}>
        <boxGeometry args={[SHAFT.width - 0.2, 2.5, SHAFT.depth - 0.2]} />
      </mesh>
      {/* buffers */}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, -1.1, 0]} material={mats.buffer}>
          <cylinderGeometry args={[0.12, 0.12, 0.6, 12]} />
        </mesh>
      ))}

      {/* machine room floor */}
      <mesh position={[0, MACHINE.floor, 0]} material={mats.concrete}>
        <boxGeometry args={[SHAFT.width + 1, 0.25, SHAFT.depth + 1]} />
      </mesh>

      {/* traction machine */}
      <group position={[0, MACHINE.floor + 1.2, -0.4]}>
        <mesh material={mats.sheave}>
          <cylinderGeometry args={[0.55, 0.55, 0.35, 24]} />
        </mesh>
        <mesh position={[0.9, -0.3, 0]} material={mats.steelDark}>
          <boxGeometry args={[0.7, 0.9, 0.6]} />
        </mesh>
        <mesh position={[-0.9, -0.2, 0]} material={mats.counterweight}>
          <boxGeometry args={[0.5, 1.1, 0.4]} />
        </mesh>
      </group>

      {/* governor */}
      <group ref={governor} position={[1.6, MACHINE.floor + 0.8, 0.5]}>
        <mesh material={mats.steel}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
        </mesh>
      </group>

      {/* control cabinet */}
      <mesh position={[-1.8, MACHINE.floor + 1.0, 0.8]} material={mats.steelDark}>
        <boxGeometry args={[0.5, 1.6, 0.4]} />
      </mesh>

      {/* landings */}
      <Landing index={0} mats={mats} />
      <Landing index={1} mats={mats} />
      <Landing index={2} mats={mats} />
      <Landing index={3} mats={mats} />
      <Landing index={4} mats={mats} />
    </group>
  );
}
