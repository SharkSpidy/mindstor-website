import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BRAND_HEX, LOGO_HALF_WIDTH_PX } from '../data/logo';
import { prefersReducedMotion } from '../lib/storage';
import { addBrandLights, clamp01, createRenderer, disposeTree, easeInOut, rand } from '../three/common';
import { WORLD_SCALE, buildLogoMeshes } from '../three/logoGeometry';
import { LogoMark } from './LogoMark';

/** Seconds on the loader timeline. */
const ASM_START = 0.9; // pieces start flying into place
const ASM_END = 3.1; // mark is fully assembled
const HOLD_END = 5.0; // loader begins its exit
const EXIT_MS = 700; // fade-out duration (matches .loader transition in CSS)
const FONT_GRACE = 2.5; // max extra seconds to wait for web fonts

const MARK_Y = 2.0; // lift the mark so the wordmark fits beneath it
const WORD_Y = -6.3; // world y of the wordmark centre

interface Props {
  /** Called once, after the exit fade finishes. */
  onDone: () => void;
}

interface Piece {
  mesh: THREE.Mesh;
  target: THREE.Vector3;
  q: THREE.Quaternion;
  radius: number;
  angle: number;
  height: number;
  speed: number;
  spin: THREE.Vector3;
  delay: number;
}

/**
 * Full-screen loading screen: glowing shards swirl, then lock together into the
 * Mindstor AI brain mark, the wordmark fades in, and the screen lifts away.
 */
export function LogoLoader({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const onDoneRef = useRef(onDone);
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    const word = wordRef.current;
    const glow = glowRef.current;
    const bar = barRef.current;
    if (!root || !host || !word || !glow || !bar) return;

    let leaving = false;
    let exitTimer: number | undefined;
    const finish = () => {
      if (leaving) return;
      leaving = true;
      root.classList.add('is-leaving');
      exitTimer = window.setTimeout(() => onDoneRef.current(), EXIT_MS);
    };
    finishRef.current = finish;

    const renderer = createRenderer();
    if (!renderer) {
      // No WebGL: show the flat mark briefly, then continue.
      setNoGl(true);
      const t = window.setTimeout(finish, 1400);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(exitTimer);
      };
    }
    host.appendChild(renderer.domElement);

    const reduced = prefersReducedMotion();
    let fontsReady = false;
    void document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    // ----- Scene -----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    addBrandLights(scene);
    const main = new THREE.Group();
    scene.add(main);

    // Logo facets: 13 extruded pieces that assemble into the mark.
    const pieces: Piece[] = buildLogoMeshes({ yOffset: MARK_Y, depth: 0.3, radius: 0.26, edgeOpacity: 0 }).map(
      ({ mesh, center }) => {
        main.add(mesh);
        return {
          mesh,
          target: center,
          q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(0, 6), rand(0, 6), rand(0, 6))),
          radius: rand(9, 20),
          angle: rand(0, Math.PI * 2),
          height: rand(-8, 8),
          speed: rand(0.3, 0.7),
          spin: new THREE.Vector3(rand(-0.04, 0.04), rand(-0.04, 0.04), rand(-0.04, 0.04)),
          delay: 0,
        };
      },
    );
    const xs = pieces.map((p) => p.target.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    pieces.forEach((p) => {
      p.delay = Math.min(0.8, ((p.target.x - minX) / (maxX - minX)) * 0.65 + Math.random() * 0.1);
    });

    // Loose glowing shards that swirl and are absorbed into the mark.
    const shards: Piece[] = Array.from({ length: 130 }, () => {
      const size = rand(0.6, 1.5);
      const kind = Math.floor(Math.random() * 3);
      const geo =
        kind === 0
          ? new THREE.TetrahedronGeometry(size, 0)
          : kind === 1
            ? new THREE.OctahedronGeometry(size, 0)
            : new THREE.IcosahedronGeometry(size * 0.8, 0);
      const hex = BRAND_HEX[Math.floor(Math.random() * BRAND_HEX.length)];
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(hex).multiplyScalar(0.8),
          roughness: 0.2,
          metalness: 0.3,
          flatShading: true,
          emissive: hex,
          emissiveIntensity: 0.15,
        }),
      );
      const home = pieces[Math.floor(Math.random() * pieces.length)].target;
      main.add(mesh);
      return {
        mesh,
        target: new THREE.Vector3(home.x + rand(-0.8, 0.8), home.y + rand(-0.8, 0.8), rand(-0.4, 0.4)),
        q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(0, 3), rand(0, 3), rand(0, 3))),
        radius: rand(10, 24),
        angle: rand(0, Math.PI * 2),
        height: rand(-10, 10),
        speed: rand(0.4, 1.2),
        spin: new THREE.Vector3(rand(-0.04, 0.04), rand(-0.04, 0.04), rand(-0.04, 0.04)),
        delay: 0,
      };
    });

    // Orbiting dust.
    const DUST = 1200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST * 3);
    const dustCol = new Float32Array(DUST * 3);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < DUST; i++) {
      const r = rand(8, 20);
      const a = rand(0, Math.PI * 2);
      dustPos.set([Math.cos(a) * r, rand(-2, 2), Math.sin(a) * r], i * 3);
      tmpColor.setHex(BRAND_HEX[Math.floor(Math.random() * BRAND_HEX.length)]);
      dustCol.set([tmpColor.r, tmpColor.g, tmpColor.b], i * 3);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.rotation.set(Math.PI / 6, 0, Math.PI / 12);
    const dustGroup = new THREE.Group();
    dustGroup.add(dust);
    scene.add(dustGroup);

    // ----- Layout -----
    const toScreen = (x: number, y: number) => {
      const v = new THREE.Vector3(x, y, 0).project(camera);
      return { x: ((v.x + 1) / 2) * host.clientWidth, y: ((1 - v.y) / 2) * host.clientHeight };
    };
    const layout = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(0, 2, Math.max(28, 8.8 / (Math.tan((22.5 * Math.PI) / 180) * camera.aspect)));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      const c = toScreen(0, MARK_Y);
      const e = toScreen(LOGO_HALF_WIDTH_PX * WORLD_SCALE, MARK_Y);
      const logoPx = (e.x - c.x) * 2;
      word.style.top = `${toScreen(0, WORD_Y).y}px`;
      word.style.fontSize = `${Math.max(18, logoPx * 0.13)}px`;
      glow.style.top = `${c.y}px`;
      glow.style.width = glow.style.height = `${logoPx * 1.5}px`;
    };
    layout();
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(host);

    // ----- Timeline -----
    const globalFactor = (t: number) =>
      t < ASM_START ? 0 : t < ASM_END ? easeInOut((t - ASM_START) / (ASM_END - ASM_START)) : 1;
    const pieceFactor = (t: number, delay: number) =>
      t < ASM_START ? 0 : easeInOut(clamp01((t - ASM_START - delay) / 1.4));

    const dq = new THREE.Quaternion();
    const de = new THREE.Euler();
    const identity = new THREE.Quaternion();

    const frame = (t: number, step: number) => {
      const f = globalFactor(t);
      main.rotation.y = -t * 0.3 * (1 - f);
      dustGroup.rotation.y = -t * 0.5;

      const swirl = (p: Piece, bob: number, g: number) => {
        const a = p.angle - t * p.speed;
        const vx = p.radius * Math.cos(a);
        const vz = p.radius * Math.sin(a);
        const vy = p.height + Math.sin(t * bob + p.angle) * 2.8;
        p.mesh.position.set(
          vx + (p.target.x - vx) * g,
          vy + (p.target.y - vy) * g,
          vz + (p.target.z - vz) * g,
        );
        if (g < 1) {
          de.set(p.spin.x * step, p.spin.y * step, p.spin.z * step);
          dq.setFromEuler(de);
          p.q.multiply(dq);
        }
      };

      for (const s of shards) {
        swirl(s, 2.0, f);
        s.mesh.quaternion.copy(s.q);
        s.mesh.scale.setScalar(Math.max(0.001, 1 - f));
      }
      for (const p of pieces) {
        const g = pieceFactor(t, p.delay);
        swirl(p, 1.4, g);
        p.mesh.quaternion.copy(p.q).slerp(identity, g);
        p.mesh.scale.setScalar(0.55 + 0.45 * g);
      }

      const w = clamp01((f - 0.7) / 0.3);
      word.style.opacity = w.toFixed(3);
      word.style.transform = `translate(-50%, calc(-50% + ${((1 - w) * 10).toFixed(1)}px))`;
      glow.style.opacity = (f * 0.32).toFixed(3);
      dustGroup.scale.setScalar(1 - f * 0.3);
      dustMat.opacity = 0.4 + f * 0.6;
      bar.style.transform = `scaleX(${clamp01(t / HOLD_END).toFixed(3)})`;

      renderer.render(scene, camera);
    };

    // ----- Run -----
    let raf = 0;
    let exitDelay: number | undefined;
    if (reduced) {
      frame(HOLD_END - 0.5, 0);
      exitDelay = window.setTimeout(finish, 1200);
    } else {
      const start = performance.now();
      let last = start;
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const t = (now - start) / 1000;
        const step = Math.min((now - last) / 1000, 0.05) * 60;
        last = now;
        frame(t, step);
        if (!leaving && t >= HOLD_END && (fontsReady || t >= HOLD_END + FONT_GRACE)) finish();
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(exitDelay);
      resizeObserver.disconnect();
      disposeTree(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`loader${noGl ? ' nogl' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Mindstor AI"
    >
      <div ref={glowRef} className="loader-glow" />
      <div ref={hostRef} className="loader-gl">
        {noGl && <LogoMark className="loader-fallback" />}
      </div>
      <div ref={wordRef} className="loader-word">
        Mindstor AI
      </div>
      <div className="loader-bar" aria-hidden="true">
        <span ref={barRef} />
      </div>
      <button type="button" className="loader-skip" onClick={() => finishRef.current()}>
        Skip
      </button>
    </div>
  );
}
