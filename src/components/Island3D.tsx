"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import * as THREE from "three";
import { OUTLINE, toXY, type Pin, type View } from "@/lib/geo";

/** Height of the land surface above the sea plate. */
const TOP = 0.155;

const C = {
  land: 0x2f7d57,
  hillDark: 0x1f5c40,
  hillLight: 0x4a9a6b,
  side: 0xe4902b,
  sand: 0xf3e8d2,
  sea: 0x14485a,
  seaLine: 0x2f7388,
  gold: 0xf0b93f,
  lacquer: 0xb3372a,
  paper: 0xfaf4e6,
  rock: 0xc8642b,
};

/** Central highlands as low-poly peaks: [lat, lng, height, radius]. */
const PEAKS: [number, number, number, number][] = [
  [7.0, 80.77, 0.46, 0.2],
  [6.81, 80.5, 0.42, 0.15],
  [6.8, 80.8, 0.36, 0.2],
  [6.93, 81.1, 0.34, 0.16],
  [7.45, 80.8, 0.34, 0.2],
  [7.2, 80.75, 0.24, 0.17],
  [6.75, 80.95, 0.3, 0.16],
  [6.95, 80.6, 0.28, 0.17],
  [6.6, 80.65, 0.22, 0.16],
  [6.42, 80.45, 0.2, 0.16],
  [7.1, 80.95, 0.22, 0.15],
  [7.6, 80.72, 0.16, 0.13],
  [6.65, 80.35, 0.16, 0.13],
  [7.3, 80.5, 0.14, 0.12],
];

interface Props {
  pins: Pin[];
  views: View[];
  /** Fractional index into `views`, driven by scroll. */
  progress?: RefObject<number>;
  /** Slugs whose labels are shown; null shows all. */
  active?: string[] | null;
  /** Drag to rotate, with a slow idle spin. */
  interactive?: boolean;
  /** Shift the model sideways on wide screens (fraction of width) to leave room for text. */
  shift?: number;
  className?: string;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

let webgl: boolean | null = null;
/** Whether this browser can create a WebGL context (checked once). */
function hasWebGL(): boolean {
  if (webgl === null) {
    try {
      const probe = document.createElement("canvas");
      webgl = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}
const subscribeNever = () => () => {};

export default function Island3D({ pins, views, progress, active = null, interactive = false, shift = 0, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef<string[] | null>(active);
  const nudge = useRef(0);
  const supported = useSyncExternalStore(subscribeNever, hasWebGL, () => true);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const wrapEl = wrap.current;
    const canvasEl = canvas.current;
    if (!wrapEl || !canvasEl) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const world = new THREE.Group();
    scene.add(world);

    scene.add(new THREE.HemisphereLight(0xfff1d0, 0x5a3a2a, 1.7));
    const sun = new THREE.DirectionalLight(0xffffff, 2.3);
    sun.position.set(-3, 6, 4);
    scene.add(sun);

    const trash: { dispose(): void }[] = [];
    const geo = <T extends THREE.BufferGeometry>(g: T): T => {
      trash.push(g);
      return g;
    };
    const flat = (color: number) => {
      const m = new THREE.MeshLambertMaterial({ color, flatShading: true });
      trash.push(m);
      return m;
    };
    const smooth = (color: number) => {
      const m = new THREE.MeshLambertMaterial({ color });
      trash.push(m);
      return m;
    };
    const place = <T extends THREE.Object3D>(obj: T, lat: number, lng: number, y: number): T => {
      const [x, n] = toXY(lat, lng);
      obj.position.set(x, y, -n);
      world.add(obj);
      return obj;
    };

    /* ---- the island ---- */
    const outline = OUTLINE.map(([lng, lat]) => {
      const [x, y] = toXY(lat, lng);
      return new THREE.Vector3(x, y, 0);
    });
    const curve = new THREE.CatmullRomCurve3(outline, true, "catmullrom", 0.5);
    const shape = new THREE.Shape(curve.getPoints(200).map((v) => new THREE.Vector2(v.x, v.y)));
    const landGeo = geo(
      new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 2 }),
    );
    landGeo.rotateX(-Math.PI / 2);
    world.add(new THREE.Mesh(landGeo, [flat(C.land), flat(C.side)]));

    const beach = new THREE.Mesh(landGeo, flat(C.sand));
    beach.scale.set(1.045, 0.45, 1.03);
    beach.position.y = -0.02;
    world.add(beach);

    /* ---- sea plate with a lotus-petal rim ---- */
    const R = 3.3;
    const plate = new THREE.Mesh(geo(new THREE.CylinderGeometry(R, R, 0.08, 96)), smooth(C.sea));
    plate.position.y = -0.085;
    world.add(plate);

    const ringMat = smooth(C.seaLine);
    for (const r of [2.72, 3.02]) {
      const ring = new THREE.Mesh(geo(new THREE.TorusGeometry(r, 0.012, 6, 128)), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.043;
      world.add(ring);
    }
    const rim = new THREE.Mesh(geo(new THREE.TorusGeometry(R, 0.045, 8, 128)), smooth(C.gold));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.06;
    world.add(rim);

    const petalShape = new THREE.Shape();
    petalShape.moveTo(-0.19, 0);
    petalShape.quadraticCurveTo(-0.22, 0.3, 0, 0.56);
    petalShape.quadraticCurveTo(0.22, 0.3, 0.19, 0);
    petalShape.closePath();
    const petalGeo = geo(new THREE.ExtrudeGeometry(petalShape, { depth: 0.05, bevelEnabled: false }));
    petalGeo.translate(0, R - 0.04, 0);
    petalGeo.rotateX(-Math.PI / 2);
    const petalMats = [smooth(C.gold), smooth(C.lacquer)];
    const PETALS = 44;
    for (let i = 0; i < PETALS; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMats[i % 2]);
      petal.rotation.y = (i / PETALS) * Math.PI * 2;
      petal.position.y = -0.15;
      world.add(petal);
    }

    /* ---- relief and landmarks ---- */
    const cone = geo(new THREE.ConeGeometry(1, 1, 6));
    const hills = [flat(C.hillDark), flat(C.hillLight)];
    PEAKS.forEach(([lat, lng, h, r], i) => {
      const peak = place(new THREE.Mesh(cone, hills[i % 2]), lat, lng, TOP + h / 2 - 0.004);
      peak.scale.set(r, h, r);
      peak.rotation.y = i * 1.3;
    });

    // Sigiriya — a flat-topped rock
    place(new THREE.Mesh(geo(new THREE.CylinderGeometry(0.05, 0.062, 0.14, 7)), flat(C.rock)), 7.957, 80.76, TOP + 0.07);

    // Stupas at the ancient capitals
    const dome = geo(new THREE.SphereGeometry(0.075, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2));
    const cube = geo(new THREE.BoxGeometry(0.036, 0.026, 0.036));
    const spire = geo(new THREE.ConeGeometry(0.014, 0.1, 8));
    const white = smooth(C.paper);
    const gold = smooth(C.gold);
    const stupa = (lat: number, lng: number, s: number) => {
      const g = new THREE.Group();
      const b = new THREE.Mesh(cube, white);
      b.position.y = 0.086;
      const t = new THREE.Mesh(spire, gold);
      t.position.y = 0.148;
      g.add(new THREE.Mesh(dome, white), b, t);
      g.scale.setScalar(s);
      place(g, lat, lng, TOP);
    };
    stupa(8.34, 80.4, 1);
    stupa(7.94, 81.0, 0.7);

    // Galle lighthouse
    place(new THREE.Mesh(geo(new THREE.CylinderGeometry(0.014, 0.022, 0.17, 8)), white), 6.05, 80.23, TOP + 0.085);
    place(new THREE.Mesh(geo(new THREE.SphereGeometry(0.02, 8, 6)), smooth(C.lacquer)), 6.05, 80.23, TOP + 0.18);

    // Colombo's Lotus Tower
    place(new THREE.Mesh(geo(new THREE.CylinderGeometry(0.011, 0.018, 0.26, 8)), white), 6.93, 79.9, TOP + 0.13);
    const bud = place(new THREE.Mesh(geo(new THREE.SphereGeometry(0.032, 10, 8)), smooth(C.lacquer)), 6.93, 79.9, TOP + 0.27);
    bud.scale.y = 1.25;

    // A gopuram for Jaffna
    place(new THREE.Mesh(geo(new THREE.ConeGeometry(0.055, 0.17, 4)), flat(C.gold)), 9.66, 80.04, TOP + 0.085);

    /* ---- pins ---- */
    const stick = geo(new THREE.CylinderGeometry(0.006, 0.006, 1, 6));
    const bead = geo(new THREE.SphereGeometry(0.034, 14, 10));
    const stickMat = smooth(C.paper);
    const beadMat = smooth(C.gold);
    const heads: THREE.Vector3[] = [];
    const beads: THREE.Mesh[] = [];
    // Stagger pin heights so labels of neighbouring places do not sit on top of each other.
    let hi = 0;
    let lo = 0;
    pins.forEach((pin) => {
      const h = pin.high ? 0.5 + (hi++ % 4) * 0.2 : 0.24 + (lo++ % 3) * 0.11;
      const s = place(new THREE.Mesh(stick, stickMat), pin.lat, pin.lng, TOP + h / 2);
      s.scale.y = h;
      const b = place(new THREE.Mesh(bead, beadMat), pin.lat, pin.lng, TOP + h);
      beads.push(b);
      heads.push(b.position.clone());
    });

    /* ---- camera rig ---- */
    type Rig = { x: number; z: number; d: number; az: number; pol: number };
    const rigs: Rig[] = views.map((v) => {
      const [x, n] = toXY(v.lat, v.lng);
      return { x, z: -n, d: v.dist, az: v.az, pol: v.pol };
    });
    const cur: Rig = { ...rigs[0] };
    let fit = 1;
    let width = 1;
    let height = 1;
    let userAz = 0;
    let userPol = 0;
    let spin = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let first = true;

    const resize = () => {
      const w = wrapEl.clientWidth;
      const h = wrapEl.clientHeight;
      if (!w || !h) return;
      width = w;
      height = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const aspect = w / h;
      fit = aspect < 0.75 ? 1.5 : aspect < 1.15 ? 1.22 : 1;
      if (shift && w >= 1024) camera.setViewOffset(w, h, -w * shift, 0, w, h);
      else if (shift) camera.setViewOffset(w, h, 0, h * 0.17, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrapEl);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrapEl);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvasEl.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      userAz -= (e.clientX - lastX) * 0.006;
      userPol = clamp(userPol - (e.clientY - lastY) * 0.004, -0.4, 0.45);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };
    if (interactive) {
      canvasEl.addEventListener("pointerdown", onDown);
      canvasEl.addEventListener("pointermove", onMove);
      canvasEl.addEventListener("pointerup", onUp);
      canvasEl.addEventListener("pointercancel", onUp);
    }

    const v = new THREE.Vector3();
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;

      const f = progress?.current ?? 0;
      const i = Math.max(0, Math.min(rigs.length - 2, Math.floor(f)));
      const a = rigs[i];
      const b = rigs[Math.min(rigs.length - 1, i + 1)];
      let t = clamp(f - i, 0, 1);
      t = t * t * (3 - 2 * t);

      if (interactive && !dragging && !reduced && f < 0.5) spin += dt * 0.1;
      userAz += nudge.current;
      nudge.current = 0;
      const sway = reduced || interactive ? 0 : Math.sin(now / 2600) * 0.05;

      const goal: Rig = {
        x: a.x + (b.x - a.x) * t,
        z: a.z + (b.z - a.z) * t,
        d: (a.d + (b.d - a.d) * t) * fit,
        az: a.az + (b.az - a.az) * t + userAz + spin + sway,
        pol: clamp(a.pol + (b.pol - a.pol) * t + userPol, 0.3, 1.25),
      };
      const k = first || reduced ? 1 : 1 - Math.exp(-dt * 4.5);
      first = false;
      cur.x += (goal.x - cur.x) * k;
      cur.z += (goal.z - cur.z) * k;
      cur.d += (goal.d - cur.d) * k;
      cur.az += (goal.az - cur.az) * k;
      cur.pol += (goal.pol - cur.pol) * k;

      const sp = Math.sin(cur.pol);
      camera.position.set(cur.x + cur.d * sp * Math.sin(cur.az), cur.d * Math.cos(cur.pol), cur.z + cur.d * sp * Math.cos(cur.az));
      camera.lookAt(cur.x, 0.1, cur.z);

      const on = activeRef.current;
      for (let p = 0; p < pins.length; p++) {
        const target = !on || on.includes(pins[p].slug) ? 1.35 : 0.75;
        const s = beads[p].scale.x + (target - beads[p].scale.x) * Math.min(1, dt * 8);
        beads[p].scale.setScalar(s);
      }

      renderer.render(scene, camera);

      for (let p = 0; p < heads.length; p++) {
        const el = labels.current[p];
        if (!el) continue;
        v.copy(heads[p]).project(camera);
        const x = (v.x * 0.5 + 0.5) * width;
        const y = (-v.y * 0.5 + 0.5) * height;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        el.style.zIndex = String(1000 - Math.round(v.z * 1000));
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvasEl.removeEventListener("pointerdown", onDown);
      canvasEl.removeEventListener("pointermove", onMove);
      canvasEl.removeEventListener("pointerup", onUp);
      canvasEl.removeEventListener("pointercancel", onUp);
      trash.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [pins, views, progress, interactive, shift, supported]);

  if (!supported) return <IslandFlat pins={pins} className={className} />;

  return (
    <div ref={wrap} className={`relative isolate ${className}`}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`block h-full w-full ${interactive ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}
      />
      <ul className="pointer-events-none absolute inset-0 m-0 list-none overflow-hidden p-0" aria-label="Destinations on the map">
        {pins.map((pin, i) => (
          <li
            key={pin.slug}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="island-label"
            data-on={!active || active.includes(pin.slug)}
          >
            <Link href={`/destinations/${pin.slug}`} className="glass">
              {pin.name}
            </Link>
          </li>
        ))}
      </ul>
      {interactive && (
        <div className="absolute top-1/2 right-4 z-[2001] flex -translate-y-1/2 flex-col gap-2">
          <button type="button" onClick={() => (nudge.current += 0.6)} className="glass liquid flex h-11 w-11 items-center justify-center rounded-full" aria-label="Rotate the island left">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" onClick={() => (nudge.current -= 0.6)} className="glass liquid flex h-11 w-11 items-center justify-center rounded-full" aria-label="Rotate the island right">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 4l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/** Flat SVG map shown when WebGL is unavailable. */
function IslandFlat({ pins, className }: { pins: Pin[]; className: string }) {
  const points = OUTLINE.map(([lng, lat]) => {
    const [x, y] = toXY(lat, lng);
    return `${(x * 100).toFixed(0)},${(-y * 100).toFixed(0)}`;
  }).join(" ");
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="-150 -225 300 450" className="h-full max-h-[80vh] w-auto" role="img" aria-label="Map of Sri Lanka with destinations">
        <polygon points={points} fill="var(--color-leaf)" stroke="var(--color-saffron)" strokeWidth="5" strokeLinejoin="round" />
        {pins.map((pin) => {
          const [x, y] = toXY(pin.lat, pin.lng);
          return (
            <a key={pin.slug} href={`/destinations/${pin.slug}`}>
              <circle cx={x * 100} cy={-y * 100} r="5" fill="var(--color-gold)" />
              <text x={x * 100 + 8} y={-y * 100 + 4} fontSize="11" fill="var(--color-paper)" fontFamily="var(--font-label)">
                {pin.name}
              </text>
            </a>
          );
        })}
      </svg>
    </div>
  );
}
