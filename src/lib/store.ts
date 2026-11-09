/**
 * Mutable cross-module store.
 * Written by GSAP ScrollTrigger callbacks (DOM world),
 * read every frame by the R3F scene (WebGL world).
 */
export type Quality = "high" | "low";

export const scrollStore = {
  /** normalized journey progress 0..1 (drives cabin, camera, masks) */
  progress: 0,
  /** canvas should render frames (inside journey viewport range) */
  active: true,
  /** user's OS reduced-motion preference */
  reduced: false,
  /** device capability tier */
  quality: "high" as Quality,
};

export function detectEnvironment(): { webgl: boolean; reduced: boolean; quality: Quality } {
  let reduced = false;
  let quality: Quality = "high";
  let webgl = true;
  try {
    reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    quality = isSmall ? "low" : "high";
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    webgl = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl = false;
  }
  scrollStore.reduced = reduced;
  scrollStore.quality = quality;
  return { webgl, reduced, quality };
}
