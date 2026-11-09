import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { ElevatorModel } from './ElevatorModel';
import { runtime } from './runtime';
import { scrollStore } from '../lib/store';
import { sstep } from './config';
import { PALETTE } from './palette';
import { createMotionState } from './motion';
import { retainMaterials } from './materials';

function CameraRig() {
  const { camera, size } = useThree();
  const key = useRef<THREE.SpotLight>(null!);
  const fill = useRef<THREE.PointLight>(null!);
  const keyTarget = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const machinePosition = useMemo(() => new THREE.Vector3(6.5, 31.9, 8.7), []);
  const machineTarget = useMemo(() => new THREE.Vector3(0.1, 29.45, -0.45), []);
  const mobileMachineOffset = useMemo(() => new THREE.Vector3(1.4, 1.3, 3.1), []);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const mobile = size.width < 900;
    perspective.setViewOffset(size.width, size.height, mobile ? 0 : size.width * 0.22,
      mobile ? size.height * 0.16 : 0, size.width, size.height);
    perspective.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame(() => {
    const { progress: p, cabinY: y } = runtime;
    const machine = runtime.machineBlend > 0.9985 ? 1 : runtime.machineBlend;
    const intro = 1 - sstep(p / 0.12);
    const mobile = size.width < 900;
    const angle = 0.43 + p * 0.09;
    const radius = (mobile ? 14.8 : 10.8) + intro * 1.6;
    position.set(Math.sin(angle) * radius, y + 2.5 + intro * 0.65, Math.cos(angle) * radius);
    target.set(0, y + 1.35, 0);
    position.lerp(machinePosition, machine);
    if (mobile && machine > 0) position.addScaledVector(mobileMachineOffset, machine);
    target.lerp(machineTarget, machine);
    camera.position.copy(position);
    camera.lookAt(target);
    if (key.current) {
      key.current.position.set(position.x * 0.6, y + 4, position.z * 0.6);
      keyTarget.position.copy(target);
      key.current.target = keyTarget;
    }
    if (fill.current) fill.current.position.set(-2, y + 2, 3);
    // Project doorway for service panel connector
    projected.set(0, y + 1.1, 1.05);
    projected.project(camera);
    runtime.doorway.x = (projected.x * 0.5 + 0.5) * size.width;
    runtime.doorway.y = (-projected.y * 0.5 + 0.5) * size.height;
    runtime.doorway.visible = runtime.doorOpen > 0.3 && machine < 0.5;
  });

  return (
    <>
      <spotLight ref={key} intensity={1.8} angle={0.5} penumbra={0.6} color={PALETTE.keyLight} castShadow={scrollStore.quality === 'high'} />
      <pointLight ref={fill} intensity={0.6} color={PALETTE.fillLight} />
    </>
  );
}

function SceneSetup() {
  const { scene, gl } = useThree();
  useEffect(() => {
    const release = retainMaterials();
    const maximum = scrollStore.quality === 'high' ? 8 : 4;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      let movingOrMechanical = false;
      let p: THREE.Object3D | null = mesh;
      while (p) {
        if (p.name === 'cabinRig' || p.name === 'suspension' || p.name === 'machineRoom') movingOrMechanical = true;
        p = p.parent;
      }
      mesh.castShadow = scrollStore.quality === 'high' && movingOrMechanical && !materials.some((m) => m.transparent);
      mesh.receiveShadow = scrollStore.quality === 'high';
      for (const material of materials) {
        const standard = material as THREE.MeshStandardMaterial;
        for (const texture of [standard.map, standard.roughnessMap, standard.bumpMap]) {
          if (texture) texture.anisotropy = maximum;
        }
      }
    });
    return () => { release(); Object.assign(runtime, createMotionState()); };
  }, [scene, gl]);
  return null;
}

function Finish({ high }: { high: boolean }) {
  return <EffectComposer multisampling={high ? 4 : 2} enableNormalPass={false}>
    {high ? <N8AO quality="medium" halfRes aoRadius={0.45} intensity={1.25} distanceFalloff={0.9} /> : <></>}
    <Bloom intensity={0.03} luminanceThreshold={1.95} luminanceSmoothing={0.3} mipmapBlur />
    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    <Vignette eskil={false} offset={0.34} darkness={0.16} />
  </EffectComposer>;
}

export function ExperienceCanvas({ active }: { active: boolean }) {
  const high = scrollStore.quality === 'high';
  return <Canvas dpr={high ? [1, 2] : [1, 1.25]} frameloop={active ? "always" : "never"}
    gl={{ antialias: !high, powerPreference: 'high-performance', stencil: false }}
    camera={{ fov: 34, near: 0.1, far: 90, position: [5.2, 3.15, 11.2] }}
    shadows={high}
    onCreated={({ gl }) => { gl.toneMapping = THREE.NoToneMapping; gl.toneMappingExposure = 1; }}>
    <color attach="background" args={[PALETTE.background]} />
    <fog attach="fog" args={[PALETTE.background, 26, 78]} />
    <ambientLight intensity={0.5} color={PALETTE.pearl} />
    <hemisphereLight args={['#FFFBF4', '#D8CFBC', 0.85]} />
    <ElevatorModel />
    <CameraRig />
    <SceneSetup />
    <Environment frames={1} resolution={high ? 512 : 128}>
      <Lightformer intensity={1.15} position={[3, 3, 7]} rotation-y={-0.4} scale={[9, 8, 1]} color={PALETTE.keyLight} />
      <Lightformer intensity={0.8} position={[-6, 3, 2]} rotation-y={Math.PI / 2} scale={[8, 9, 1]} color={PALETTE.fillLight} />
      <Lightformer intensity={1.3} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} color={PALETTE.keyLight} />
      <Lightformer intensity={0.5} position={[1, 2, -6]} rotation-y={Math.PI} scale={[8, 8, 1]} color={PALETTE.fillLight} />
    </Environment>
    <Finish high={high} />
  </Canvas>;
}
