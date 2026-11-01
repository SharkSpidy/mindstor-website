import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '../lib/storage';
import { addBrandLights, clamp01, createRenderer, disposeTree, easeInOut, rand } from '../three/common';
import { buildLogoMeshes } from '../three/logoGeometry';
import { LogoMark } from './LogoMark';

const MARK_Y = 1.6;
/** Seconds: the brain rests assembled, breaks apart at BREAK_AT, re-forms from REFORM_AT. */
const CYCLE = 22;
const BREAK_AT = 10;
const REFORM_AT = 16;

interface BrainPiece {
  mesh: THREE.Mesh;
  target: THREE.Vector3;
  assembled: THREE.Quaternion;
  q: THREE.Quaternion;
  dir: THREE.Vector3;
  dist: number;
  phase: number;
  spin: THREE.Euler;
  delay: number;
}

interface Panel {
  group: THREE.Group;
  radius: number;
  y: number;
  speed: number;
  phase: number;
}

/** 1 = assembled, 0 = fully scattered. Starts assembled so the first frame shows the logo. */
function assembly(t: number, delay: number): number {
  if (t < BREAK_AT) return 1;
  if (t < REFORM_AT) return 1 - easeInOut(clamp01((t - BREAK_AT - delay) / 1.8));
  return easeInOut(clamp01((t - REFORM_AT - delay) / 1.8));
}

/** A glowing flat "screen" (browser, phone, card) that orbits the brain. */
function makeScreen(w: number, h: number, color: number, rows: number): THREE.Group {
  const g = new THREE.Group();
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ color: 0x120a1e, transparent: true, opacity: 0.86, side: THREE.DoubleSide }),
  );
  g.add(plane);
  g.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(plane.geometry),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 }),
    ),
  );
  const strip = (sw: number, sh: number, x: number, y: number, opacity: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(sw, sh),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide }),
    );
    m.position.set(x, y, 0.02);
    g.add(m);
  };
  strip(w * 0.9, h * 0.1, 0, h * 0.37, 0.85);
  for (let r = 0; r < rows; r++) {
    const lw = w * (0.72 - r * 0.14);
    strip(lw, h * 0.055, -w * 0.45 + lw / 2, h * (0.17 - r * 0.13), 0.4);
  }
  return g;
}

/**
 * Hero visual: the faceted brain assembled from logo pieces, orbit rings with moving
 * particles, and floating product screens. Falls back to the flat logo without WebGL.
 */
export function Hero3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const renderer = createRenderer();
    if (!renderer) {
      setNoGl(true);
      return;
    }
    host.appendChild(renderer.domElement);
    const reduced = prefersReducedMotion();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    addBrandLights(scene);
    const stage = new THREE.Group();
    const brain = new THREE.Group();
    stage.add(brain);
    scene.add(stage);

    // ----- Brain pieces -----
    const pieces: BrainPiece[] = buildLogoMeshes({ yOffset: MARK_Y, depth: 0.5, radius: 0.24, edgeOpacity: 0.5 }).map(
      ({ mesh, center }) => {
        // Bow the flat mark into a dome: centre pieces come forward, edge pieces tilt outward.
        const z = 1.7 * Math.cos(Math.max(-1, Math.min(1, center.x / 8.4)) * (Math.PI / 2)) - 0.6;
        brain.add(mesh);
        return {
          mesh,
          target: new THREE.Vector3(center.x, center.y, z),
          assembled: new THREE.Quaternion().setFromEuler(new THREE.Euler(-(center.y - MARK_Y) * 0.035, center.x * 0.05, 0)),
          q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(0, 6), rand(0, 6), rand(0, 6))),
          dir: new THREE.Vector3(rand(-1, 1), rand(-0.6, 1), rand(-0.4, 1)).normalize(),
          dist: rand(7, 12),
          phase: rand(0, Math.PI * 2),
          spin: new THREE.Euler(rand(-0.025, 0.025), rand(-0.025, 0.025), rand(-0.025, 0.025)),
          delay: 0,
        };
      },
    );
    const xs = pieces.map((p) => p.target.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    pieces.forEach((p) => {
      p.delay = Math.min(0.9, ((p.target.x - minX) / (maxX - minX)) * 0.8 + Math.random() * 0.1);
    });

    // ----- Orbit rings with moving particles -----
    const ringDefs = [
      { rx: 8.8, rz: 5.8, tiltX: 1.2, tiltZ: 0.22, y: 0.6, n: 90, speed: 0.16, color: 0xff4770 },
      { rx: 7.8, rz: 5.3, tiltX: 0.95, tiltZ: -0.34, y: 2.4, n: 70, speed: -0.12, color: 0xad32c0 },
      { rx: 9.4, rz: 6.3, tiltX: 1.38, tiltZ: 0.08, y: -1.8, n: 70, speed: 0.1, color: 0xfe7045 },
    ];
    const rings = ringDefs.map((cfg) => {
      const g = new THREE.Group();
      g.rotation.set(cfg.tiltX, 0, cfg.tiltZ);
      g.position.y = cfg.y;
      const curve = new THREE.EllipseCurve(0, 0, cfg.rx, cfg.rz, 0, Math.PI * 2, false, 0);
      g.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(160).map((p) => new THREE.Vector3(p.x, 0, p.y))),
          new THREE.LineBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }),
        ),
      );
      const geo = new THREE.BufferGeometry();
      const attr = new THREE.BufferAttribute(new Float32Array(cfg.n * 3), 3);
      geo.setAttribute('position', attr);
      g.add(
        new THREE.Points(
          geo,
          new THREE.PointsMaterial({
            size: 0.3,
            color: cfg.color,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        ),
      );
      stage.add(g);
      return { cfg, attr, jitter: Array.from({ length: cfg.n }, () => rand(-0.25, 0.25)) };
    });

    // ----- Floating product screens -----
    const panels: Panel[] = [
      { group: makeScreen(6, 4, 0xe12d9b, 3), radius: 9.2, y: 3.2, speed: 0.16, phase: 0.4 },
      { group: makeScreen(2.7, 5.2, 0xfe7045, 4), radius: 8.6, y: -0.8, speed: 0.16, phase: 2.6 },
      { group: makeScreen(3.8, 2.5, 0xad32c0, 2), radius: 9.8, y: -3.6, speed: 0.16, phase: 4.7 },
    ];
    panels.forEach((p) => stage.add(p.group));

    // ----- Interaction + sizing -----
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const stageEl = host.parentElement ?? host;
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    };
    stageEl.addEventListener('pointermove', onMove);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, 0.8, Math.max(9.6 / tanHalf, 10.8 / (tanHalf * camera.aspect)));
      camera.lookAt(0, 0.8, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // ----- Frame -----
    const yAxis = new THREE.Vector3(0, 1, 0);
    const v = new THREE.Vector3();
    const dq = new THREE.Quaternion();
    const frame = (time: number) => {
      const ct = reduced ? 0 : time % CYCLE;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      brain.rotation.y = (reduced ? 0 : Math.sin(time * 0.35) * 0.38) + mx * 0.5;
      brain.rotation.x = -0.06 + my * 0.25;
      stage.rotation.y = reduced ? 0 : Math.sin(time * 0.2) * 0.12;

      for (const p of pieces) {
        const a = assembly(ct, p.delay);
        const inv = 1 - a;
        v.copy(p.dir).multiplyScalar(p.dist * inv);
        v.applyAxisAngle(yAxis, inv * (0.9 + 0.4 * Math.sin(time * 0.5 + p.phase)));
        v.add(p.target);
        v.y += inv * Math.sin(time * 1.3 + p.phase) * 0.8;
        p.mesh.position.copy(v);
        if (a < 1) {
          dq.setFromEuler(p.spin);
          p.q.multiply(dq);
        }
        p.mesh.quaternion.copy(p.q).slerp(p.assembled, a);
        p.mesh.scale.setScalar(0.7 + 0.3 * a);
      }

      for (const r of rings) {
        const arr = r.attr.array as Float32Array;
        for (let i = 0; i < r.cfg.n; i++) {
          const ang = (i / r.cfg.n) * Math.PI * 2 + time * r.cfg.speed;
          arr[i * 3] = Math.cos(ang) * (r.cfg.rx + r.jitter[i]);
          arr[i * 3 + 1] = r.jitter[i] * 0.6;
          arr[i * 3 + 2] = Math.sin(ang) * (r.cfg.rz + r.jitter[i]);
        }
        r.attr.needsUpdate = true;
      }

      for (const p of panels) {
        const ang = p.phase + time * p.speed;
        p.group.position.set(
          Math.cos(ang) * p.radius,
          p.y + Math.sin(time * 0.9 + p.phase) * 0.35,
          Math.sin(ang) * p.radius * 0.62,
        );
        p.group.lookAt(camera.position);
      }

      renderer.render(scene, camera);
    };

    let raf = 0;
    let visible = true;
    let running = false;
    const clock = new THREE.Clock();
    const loop = () => {
      if (!visible) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
      frame(clock.getElapsedTime());
    };
    let observer: IntersectionObserver | undefined;
    if (reduced) {
      frame(0);
    } else {
      observer = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !running) {
          running = true;
          loop();
        }
      });
      observer.observe(host);
      running = true;
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      resizeObserver.disconnect();
      stageEl.removeEventListener('pointermove', onMove);
      disposeTree(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={hostRef} id="hero-gl" className={noGl ? 'nogl' : undefined}>
      {noGl && <LogoMark />}
    </div>
  );
}
