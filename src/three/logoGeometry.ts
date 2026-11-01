import * as THREE from 'three';
import { LOGO, LOGO_CENTER } from '../data/logo';

/** World units per source-image pixel. */
export const WORLD_SCALE = 0.04;

/** Rounds the corners of a polygon with small quadratic curves. */
export function roundedShape(pts: readonly THREE.Vector2[], radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const d0 = prev.clone().sub(cur);
    const d2 = next.clone().sub(cur);
    const a = cur.clone().add(d0.clone().normalize().multiplyScalar(Math.min(radius, d0.length() * 0.4)));
    const b = cur.clone().add(d2.clone().normalize().multiplyScalar(Math.min(radius, d2.length() * 0.4)));
    if (i === 0) shape.moveTo(a.x, a.y);
    else shape.lineTo(a.x, a.y);
    shape.quadraticCurveTo(cur.x, cur.y, b.x, b.y);
  }
  shape.closePath();
  return shape;
}

export interface LogoMesh {
  mesh: THREE.Mesh;
  /** Where the facet sits in the assembled logo (mesh geometry is centred on origin). */
  center: THREE.Vector3;
}

export interface LogoMeshOptions {
  /** Vertical offset of the assembled mark in world units. */
  yOffset: number;
  /** Extrusion depth. */
  depth: number;
  /** Corner radius in world units. */
  radius: number;
  /** Opacity of the white facet outlines (0 hides them). */
  edgeOpacity: number;
}

/** Builds one extruded, glowing mesh per logo facet. */
export function buildLogoMeshes(opts: LogoMeshOptions): LogoMesh[] {
  return LOGO.map((facet) => {
    const world = facet.points.map(
      ([x, y]) =>
        new THREE.Vector2((x - LOGO_CENTER.x) * WORLD_SCALE, -(y - LOGO_CENTER.y) * WORLD_SCALE + opts.yOffset),
    );
    const geo = new THREE.ExtrudeGeometry(roundedShape(world, opts.radius), {
      depth: opts.depth,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.045,
      bevelSegments: 2,
      curveSegments: 6,
    });
    geo.computeBoundingBox();
    const center = new THREE.Vector3();
    geo.boundingBox!.getCenter(center);
    geo.translate(-center.x, -center.y, -center.z);

    const base = new THREE.Color(facet.color);
    const material = new THREE.MeshStandardMaterial({
      color: base.clone().multiplyScalar(0.55),
      emissive: base.clone().multiplyScalar(0.45),
      roughness: 0.42,
      metalness: 0.15,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(geo, material);
    if (opts.edgeOpacity > 0) {
      mesh.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geo, 35),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: opts.edgeOpacity }),
        ),
      );
    }
    return { mesh, center: new THREE.Vector3(center.x, center.y, 0) };
  });
}
