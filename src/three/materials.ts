import * as THREE from 'three';
import type { Quality } from '../lib/store';
import { PALETTE } from './palette';

export interface Mats {
  steel: THREE.MeshPhysicalMaterial;
  steelFine: THREE.MeshPhysicalMaterial;
  doorPanel: THREE.MeshStandardMaterial;
  steelDark: THREE.MeshStandardMaterial;
  graphite: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  concreteDeep: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  checker: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  rail: THREE.MeshStandardMaterial;
  rope: THREE.MeshStandardMaterial;
  emissiveCool: THREE.MeshStandardMaterial;
  emissiveWhite: THREE.MeshStandardMaterial;
  emissiveGreen: THREE.MeshStandardMaterial;
  emissiveAccent: THREE.MeshStandardMaterial;
  sheave: THREE.MeshStandardMaterial;
  counterweight: THREE.MeshStandardMaterial;
  buffer: THREE.MeshStandardMaterial;
  cabinAccent: THREE.MeshStandardMaterial;
  cabinWall: THREE.MeshStandardMaterial;
  darkMetal: THREE.MeshStandardMaterial;
}

let cache: Mats | null = null;
let retainers = 0;
let disposal: ReturnType<typeof setTimeout> | undefined;
const textures = new Set<THREE.Texture>();

function randomSeed(seed: number) {
  return () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
}

function textureFrom(canvas: HTMLCanvasElement, color = false, repeats = 1) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeats, repeats);
  texture.anisotropy = 8;
  textures.add(texture);
  return texture;
}

function canvas(size: number) {
  const element = document.createElement('canvas');
  element.width = element.height = size;
  return { element, ctx: element.getContext('2d')! };
}

function surfaces(high: boolean) {
  const size = high ? 1024 : 256;
  const grain = canvas(size);
  const random = randomSeed(9247);
  const image = grain.ctx.createImageData(size, size);
  const columns = Array.from({ length: size }, () => 196 + random() * 28);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const value = columns[x] + random() * 6;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
  }
  grain.ctx.putImageData(image, 0, 0);

  // Warm travertine / board-formed limestone wall (#D8CFBC base with #565449 joints)
  const wall = canvas(512);
  wall.ctx.fillStyle = '#DAD3C2';
  wall.ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 6500; i++) {
    const x = random() * 512, y = random() * 512;
    wall.ctx.fillStyle = random() > 0.5 ? 'rgba(255,255,255,.5)' : 'rgba(60,60,56,.05)';
    wall.ctx.fillRect(x, y, 1 + random() * 3, 1 + random() * 2);
  }
  wall.ctx.strokeStyle = 'rgba(70,70,64,.22)';
  wall.ctx.lineWidth = 1.5;
  wall.ctx.strokeRect(0.75, 0.75, 510.5, 510.5);
  wall.ctx.beginPath();
  wall.ctx.moveTo(0, 256);
  wall.ctx.lineTo(512, 256);
  wall.ctx.stroke();
  for (const x of [60, 452]) for (const y of [90, 346]) {
    wall.ctx.fillStyle = 'rgba(60,60,56,.3)';
    wall.ctx.beginPath(); wall.ctx.arc(x, y, 2.5, 0, Math.PI * 2); wall.ctx.fill();
  }

  // Honed warm alabaster-travertine floor tile
  const stone = canvas(512);
  stone.ctx.fillStyle = '#DED6C4';
  stone.ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 3000; i++) {
    stone.ctx.fillStyle = 'rgba(255,255,255,.5)';
    stone.ctx.fillRect(random() * 512, random() * 512, 2, 1);
  }
  stone.ctx.strokeStyle = 'rgba(70,70,64,.2)';
  stone.ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const o = i * 64;
    stone.ctx.strokeRect(o + 1, o + 1, 62, 62);
  }

  // Checker for cabin floor
  const check = canvas(256);
  check.ctx.fillStyle = '#2A2A26';
  check.ctx.fillRect(0, 0, 256, 256);
  check.ctx.fillStyle = '#3A3A34';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    if ((x + y) % 2 === 0) check.ctx.fillRect(x * 32, y * 32, 32, 32);
  }

  return {
    grain: textureFrom(grain.element),
    wall: textureFrom(wall.element, true, 2),
    stone: textureFrom(stone.element, true, 3),
    check: textureFrom(check.element, true, 4),
  };
}

export function getMaterials(quality: Quality = 'high'): Mats {
  if (cache) return cache;
  const high = quality === 'high';
  const tex = surfaces(high);
  const common = { roughness: 0.85, metalness: 0.05 };

  cache = {
    steel: new THREE.MeshPhysicalMaterial({ color: '#A8A296', metalness: 0.9, roughness: 0.35, clearcoat: 0.3 }),
    steelFine: new THREE.MeshPhysicalMaterial({ color: '#B8B4A8', metalness: 0.85, roughness: 0.28, clearcoat: 0.4 }),
    doorPanel: new THREE.MeshStandardMaterial({ color: '#565449', roughness: 0.55, metalness: 0.2 }),
    steelDark: new THREE.MeshStandardMaterial({ color: '#3A3A34', roughness: 0.6, metalness: 0.4 }),
    graphite: new THREE.MeshStandardMaterial({ color: '#2A2A26', roughness: 0.7, metalness: 0.15 }),
    concrete: new THREE.MeshStandardMaterial({ map: tex.wall, roughness: 0.9, metalness: 0 }),
    concreteDeep: new THREE.MeshStandardMaterial({ color: '#C8C0B0', roughness: 0.95, metalness: 0 }),
    stone: new THREE.MeshStandardMaterial({ map: tex.stone, roughness: 0.75, metalness: 0 }),
    checker: new THREE.MeshStandardMaterial({ map: tex.check, roughness: 0.8, metalness: 0.05 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#E8E4D8', transmission: 0.85, opacity: 0.2, transparent: true, roughness: 0.05, metalness: 0, thickness: 0.1 }),
    rail: new THREE.MeshStandardMaterial({ color: '#6A665C', roughness: 0.4, metalness: 0.7 }),
    rope: new THREE.MeshStandardMaterial({ color: '#4A4A44', roughness: 0.6, metalness: 0.3 }),
    emissiveCool: new THREE.MeshStandardMaterial({ color: '#A0C0D0', emissive: '#6080A0', emissiveIntensity: 0.4 }),
    emissiveWhite: new THREE.MeshStandardMaterial({ color: '#FFFBF4', emissive: '#FFFBF4', emissiveIntensity: 0.6 }),
    emissiveGreen: new THREE.MeshStandardMaterial({ color: '#80C080', emissive: '#40A040', emissiveIntensity: 0.5 }),
    emissiveAccent: new THREE.MeshStandardMaterial({ color: '#C4A574', emissive: '#A08050', emissiveIntensity: 0.3 }),
    sheave: new THREE.MeshStandardMaterial({ color: '#5A564C', roughness: 0.5, metalness: 0.5 }),
    counterweight: new THREE.MeshStandardMaterial({ color: '#4A4A44', roughness: 0.7, metalness: 0.2 }),
    buffer: new THREE.MeshStandardMaterial({ color: '#3A3A34', roughness: 0.8, metalness: 0.1 }),
    cabinAccent: new THREE.MeshStandardMaterial({ color: '#565449', roughness: 0.5, metalness: 0.3 }),
    cabinWall: new THREE.MeshStandardMaterial({ color: '#E8E0D0', roughness: 0.85, metalness: 0 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: '#2A2A26', roughness: 0.55, metalness: 0.5 }),
  };
  return cache;
}

export function retainMaterials() {
  retainers++;
  if (disposal) { clearTimeout(disposal); disposal = undefined; }
  return () => {
    retainers--;
    if (retainers <= 0) {
      disposal = setTimeout(() => {
        if (retainers <= 0 && cache) {
          Object.values(cache).forEach((m) => m.dispose());
          textures.forEach((t) => t.dispose());
          textures.clear();
          cache = null;
        }
      }, 3000);
    }
  };
}
