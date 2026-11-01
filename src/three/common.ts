import * as THREE from 'three';

/**
 * Colors in this project are authored as plain sRGB values and rendered without
 * conversion, so on-screen colors match the logo artwork exactly.
 * (Modern three.js converts by default, which would wash the brand colors out.)
 */
THREE.ColorManagement.enabled = false;

/** Modern three.js lights are not pre-multiplied by PI; this restores the intended brightness. */
const LIGHT_SCALE = Math.PI;

/** Creates the shared renderer, or null when WebGL is unavailable. */
export function createRenderer(): THREE.WebGLRenderer | null {
  try {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    if (!renderer.getContext()) {
      renderer.dispose();
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    return renderer;
  } catch {
    return null;
  }
}

/** Adds the brand lighting rig (white key, purple fill, orange rim) to a scene. */
export function addBrandLights(scene: THREE.Scene): void {
  scene.add(new THREE.AmbientLight(0xffffff, 0.32 * LIGHT_SCALE));
  const key = new THREE.DirectionalLight(0xffffff, 0.55 * LIGHT_SCALE);
  key.position.set(6, 10, 14);
  const fill = new THREE.DirectionalLight(0xad32c0, 0.5 * LIGHT_SCALE);
  fill.position.set(-12, 2, 6);
  const rim = new THREE.DirectionalLight(0xfe7045, 0.6 * LIGHT_SCALE);
  rim.position.set(8, -8, -10);
  scene.add(key, fill, rim);
}

/** Frees GPU memory for everything under `root`. Call on unmount. */
export function disposeTree(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) mat.dispose();
  });
}

export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

/** Cubic ease-in-out. */
export const easeInOut = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export const rand = (a: number, b: number): number => a + Math.random() * (b - a);
