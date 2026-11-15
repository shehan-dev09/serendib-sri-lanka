"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import * as THREE from "three";
import { CENTER, mercDeg, toUV, toXY, type Pin, type View } from "@/lib/geo";
import { TERRAIN, TERRAIN_CREDIT } from "@/lib/terrain";
import { SatelliteMap } from "./SatelliteMap";
import { LotusMark } from "./ui";

/*
 * Realistic 3D Sri Lanka.
 *
 *  • Terrain: real elevation (SRTM) displaced into a mesh, draped with real
 *    Sentinel-2 satellite imagery. Heights are exaggerated ×13 so the hills read.
 *  • Water: a custom GLSL shader — depth-based colour from bathymetry, animated
 *    wave normals, Fresnel sky reflection, sun glint and shoreline foam.
 *  • Atmosphere: distance haze matched to the page background, plus a drifting
 *    procedural cloud layer that thins out as the camera comes closer.
 */

const ABYSS = 0x0a1a24; // must match --color-abyss in globals.css
const ABYSS_RGB = [10 / 255, 26 / 255, 36 / 255];
const VERTICAL = 13 / 111_000; // map units per metre, exaggerated ×13 so the highlands read
const LAND_LIFT = 0.0025;

interface Props {
  pins: Pin[];
  views: View[];
  /** Fractional index into `views`, driven by scroll or region buttons. */
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

/* ------------------------------------------------------------------ assets */

interface TerrainAssets {
  heights: Int16Array;
  satellite: THREE.Texture;
  water: THREE.Texture;
}

let cachedHeights: Promise<Int16Array> | null = null;
function loadHeights(): Promise<Int16Array> {
  const gz = typeof DecompressionStream !== "undefined";
  cachedHeights ??= fetch(gz ? "/terrain/height.bin.gz" : "/terrain/height.bin")
    .then((r) => {
      if (!r.ok || !r.body) throw new Error(`height data ${r.status}`);
      // The grid ships gzipped (≈3× smaller); the browser inflates it natively.
      return gz ? new Response(r.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer() : r.arrayBuffer();
    })
    .then((buf) => new Int16Array(buf))
    .catch((e) => {
      cachedHeights = null;
      throw e;
    });
  return cachedHeights;
}

function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => new THREE.TextureLoader().load(url, resolve, undefined, reject));
}

/** Bilinear elevation (metres) at a terrain uv. */
function sampleHeight(heights: Int16Array, u: number, v: number): number {
  const { gridWidth: W, gridHeight: H } = TERRAIN;
  const x = clamp(u, 0, 1) * (W - 1);
  const y = (1 - clamp(v, 0, 1)) * (H - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(W - 1, x0 + 1);
  const y1 = Math.min(H - 1, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;
  const h = (xx: number, yy: number) => heights[yy * W + xx];
  return (h(x0, y0) * (1 - fx) + h(x1, y0) * fx) * (1 - fy) + (h(x0, y1) * (1 - fx) + h(x1, y1) * fx) * fy;
}

const heightToY = (h: number) => (h > 0 ? LAND_LIFT + h * VERTICAL : Math.max(-0.05, h * VERTICAL * 0.05) - 0.004);

/* ------------------------------------------------------------------ meshes */

function buildTerrain(heights: Int16Array, stride: number): THREE.BufferGeometry {
  const { gridWidth: W, gridHeight: H } = TERRAIN;
  const cols = Math.floor((W - 1) / stride) + 1;
  const rows = Math.floor((H - 1) / stride) + 1;
  const nNorth = mercDeg(TERRAIN.north) - mercDeg(CENTER.lat);
  const nSouth = mercDeg(TERRAIN.south) - mercDeg(CENTER.lat);
  const xWest = TERRAIN.west - CENTER.lng;
  const xEast = TERRAIN.east - CENTER.lng;

  const position = new Float32Array(cols * rows * 3);
  const uv = new Float32Array(cols * rows * 2);
  for (let r = 0; r < rows; r++) {
    const gy = Math.min(H - 1, r * stride);
    const v = 1 - gy / (H - 1);
    const n = nSouth + (nNorth - nSouth) * v;
    for (let c = 0; c < cols; c++) {
      const gx = Math.min(W - 1, c * stride);
      const u = gx / (W - 1);
      const i = r * cols + c;
      position[i * 3] = xWest + (xEast - xWest) * u;
      position[i * 3 + 1] = heightToY(heights[gy * W + gx]);
      position[i * 3 + 2] = -n;
      uv[i * 2] = u;
      uv[i * 2 + 1] = v;
    }
  }

  const index = new Uint32Array((cols - 1) * (rows - 1) * 6);
  let k = 0;
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const a = r * cols + c;
      const b = a + 1;
      const d = a + cols;
      const e = d + 1;
      index[k++] = a;
      index[k++] = d;
      index[k++] = b;
      index[k++] = b;
      index[k++] = d;
      index[k++] = e;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(new THREE.BufferAttribute(index, 1));
  geometry.computeVertexNormals();
  return geometry;
}

const WATER_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vView;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 view = viewMatrix * world;
    // Pass the view-space position, not its length: a length interpolated across a
    // 4-vertex plane is wrong everywhere in between, so distance is taken per pixel.
    vView = view.xyz;
    gl_Position = projectionMatrix * view;
  }
`;

const WATER_FRAG = /* glsl */ `
  uniform sampler2D uMask;
  uniform vec4 uBounds;      // xWest, xEast, nSouth, nNorth
  uniform float uTime;
  uniform vec3 uSun;
  uniform vec3 uFogColor;
  uniform vec2 uFog;         // near, far
  varying vec3 vWorld;
  varying vec3 vView;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  void main() {
    vec2 uv = vec2((vWorld.x - uBounds.x) / (uBounds.y - uBounds.x), (-vWorld.z - uBounds.z) / (uBounds.w - uBounds.z));
    // Beyond the data's edge, carry the edge values outward and fade them into open
    // ocean, so shallow seas (e.g. the Palk Strait) never end in a hard straight line.
    // Signed distance to the data edge (negative outside); the fade starts just inside
    // the edge and runs far beyond it, so there is no visible seam.
    float dEdge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float edgeFade = 1.0 - smoothstep(-0.3, 0.03, dEdge);
    float raw = texture2D(uMask, clamp(uv, 0.002, 0.998)).r;
    if (raw < 0.075 && dEdge > 0.0) discard;        // land
    float d = mix(max(raw, 0.12), 1.0, edgeFade);   // land beyond the edge (India's tip) reads as shallows
    float depth = clamp((d - 0.11) / 0.89, 0.0, 1.0);

    // Colour by depth: lagoon turquoise → shelf blue → open-ocean navy.
    vec3 shallow = vec3(0.36, 0.80, 0.78);
    vec3 mid     = vec3(0.10, 0.48, 0.62);
    vec3 deep    = vec3(0.05, 0.22, 0.36);
    vec3 base = depth < 0.35 ? mix(shallow, mid, depth / 0.35) : mix(mid, deep, (depth - 0.35) / 0.65);

    // Wave normal from the analytic gradient of summed directional sines + fine noise.
    vec2 p = vWorld.xz * 55.0;
    float t = uTime;
    vec2 g = vec2(0.0);
    vec2 d1 = normalize(vec2(1.0, 0.35));  g += d1 * cos(dot(d1, p) * 1.0 + t * 1.1) * 0.10;
    vec2 d2 = normalize(vec2(-0.4, 1.0));  g += d2 * cos(dot(d2, p) * 1.7 + t * 1.6) * 0.07;
    vec2 d3 = normalize(vec2(0.8, -0.6));  g += d3 * cos(dot(d3, p) * 2.9 + t * 2.3) * 0.05;
    vec2 q = p * 2.2 + vec2(t * 0.6, -t * 0.4);
    float e = 0.05;
    g += vec2(noise(q + vec2(e, 0.0)) - noise(q - vec2(e, 0.0)), noise(q + vec2(0.0, e)) - noise(q - vec2(0.0, e))) * 0.9;
    vec3 n = normalize(vec3(-g.x * 0.35, 1.0, -g.y * 0.35));

    vec3 V = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - max(dot(n, V), 0.0), 4.0);
    vec3 sky = vec3(0.56, 0.70, 0.80);
    vec3 col = mix(base, sky, fresnel * 0.6);

    vec3 R = reflect(-uSun, n);
    col += vec3(1.0, 0.95, 0.84) * pow(max(dot(R, V), 0.0), 220.0) * 1.6;   // sun glint

    // Surf: a foam band hugging the coast, broken up by moving noise.
    float shore = 1.0 - smoothstep(0.075, 0.15, d);
    float foam = smoothstep(0.35, 0.75, noise(vWorld.xz * 260.0 + vec2(t * 0.8, t * 0.5)));
    col = mix(col, vec3(0.93, 0.96, 0.95), shore * (0.35 + 0.65 * foam));

    float alpha = 1.0;                              // opaque: depth colour comes from the shader
    col = mix(col, uFogColor, smoothstep(uFog.x, uFog.y, length(vView)));
    gl_FragColor = vec4(col, alpha);
  }
`;

/** Soft procedural cumulus as an alpha texture (fractal value noise on a canvas). */
function cloudTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const rand = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const vnoise = (x: number, y: number, period: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const w = (a: number) => ((a % period) + period) % period; // wrap → tileable
    const a = rand(w(xi), w(yi));
    const b = rand(w(xi + 1), w(yi));
    const c = rand(w(xi), w(yi + 1));
    const d = rand(w(xi + 1), w(yi + 1));
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let f = 0;
      let amp = 0.5;
      let freq = 4;
      for (let o = 0; o < 5; o++) {
        f += vnoise((x / size) * freq, (y / size) * freq, freq) * amp;
        amp *= 0.5;
        freq *= 2;
      }
      const a = clamp((f - 0.56) * 3.2, 0, 1);
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ component */

export default function Island3D({ pins, views, progress, active = null, interactive = false, shift = 0, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef<string[] | null>(active);
  const nudge = useRef(0);
  const supported = useSyncExternalStore(subscribeNever, hasWebGL, () => true);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const wrapEl = wrap.current;
    const canvasEl = canvas.current;
    if (!wrapEl || !canvasEl || !supported) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, powerPreference: "high-performance" });
    } catch {
      queueMicrotask(() => setStatus("failed"));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(ABYSS, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 1024;
    // Full 400k-vertex mesh only on capable desktops; everyone else gets the ¼-density mesh.
    const fine = !small && window.innerWidth >= 1280 && (navigator.hardwareConcurrency ?? 4) >= 8;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(ABYSS, 8, 26);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.02, 150);
    const world = new THREE.Group();
    scene.add(world);

    const sunDir = new THREE.Vector3(-0.55, 0.78, 0.3).normalize();
    const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
    sun.position.copy(sunDir).multiplyScalar(10);
    scene.add(sun, new THREE.HemisphereLight(0xd6e8ff, 0x3a3328, 1.15));

    const trash: { dispose(): void }[] = [];
    const keep = <T extends { dispose(): void }>(x: T): T => {
      trash.push(x);
      return x;
    };

    /* ---- water ---- */
    const nNorth = mercDeg(TERRAIN.north) - mercDeg(CENTER.lat);
    const nSouth = mercDeg(TERRAIN.south) - mercDeg(CENTER.lat);
    const waterUniforms = {
      uMask: { value: null as THREE.Texture | null },
      uBounds: { value: new THREE.Vector4(TERRAIN.west - CENTER.lng, TERRAIN.east - CENTER.lng, nSouth, nNorth) },
      uTime: { value: 0 },
      uSun: { value: sunDir },
      uFogColor: { value: new THREE.Vector3(...ABYSS_RGB) },
      uFog: { value: new THREE.Vector2(8, 26) },
    };
    const waterGeo = keep(new THREE.PlaneGeometry(90, 90, 1, 1));
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = keep(
      new THREE.ShaderMaterial({ uniforms: waterUniforms, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG, transparent: false, depthWrite: true }),
    );
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.renderOrder = 1;
    water.visible = false;
    world.add(water);

    /* ---- clouds ---- */
    const clouds = keep(cloudTexture());
    clouds.repeat.set(2.2, 2.2);
    const cloudMat = keep(new THREE.MeshBasicMaterial({ map: clouds, transparent: true, depthWrite: false, opacity: 0, fog: true }));
    const cloudGeo = keep(new THREE.PlaneGeometry(16, 16));
    cloudGeo.rotateX(-Math.PI / 2);
    const cloudLayer = new THREE.Mesh(cloudGeo, cloudMat);
    cloudLayer.position.y = 0.62;
    cloudLayer.renderOrder = 3;
    world.add(cloudLayer);

    /* ---- pins (placed once heights arrive) ---- */
    const pinGroup = new THREE.Group();
    world.add(pinGroup);
    const heads: THREE.Vector3[] = pins.map(() => new THREE.Vector3());
    const beads: THREE.Mesh[] = [];
    const rings: THREE.Mesh[] = [];

    let disposed = false;
    const placePins = (heights: Int16Array) => {
      const stem = keep(new THREE.CylinderGeometry(0.0028, 0.0028, 1, 6));
      const bead = keep(new THREE.SphereGeometry(0.02, 16, 12));
      const ring = keep(new THREE.RingGeometry(0.018, 0.03, 32));
      ring.rotateX(-Math.PI / 2);
      const stemMat = keep(new THREE.MeshBasicMaterial({ color: 0xfaf4e6, transparent: true, opacity: 0.85 }));
      const beadMat = keep(new THREE.MeshBasicMaterial({ color: 0xf0b93f }));
      const ringMat = keep(new THREE.MeshBasicMaterial({ color: 0xf0b93f, transparent: true, opacity: 0.9, depthWrite: false }));
      let hi = 0;
      let lo = 0;
      pins.forEach((pin, i) => {
        const [x, n] = toXY(pin.lat, pin.lng);
        const [u, v] = toUV(pin.lat, pin.lng);
        const ground = heightToY(Math.max(0, sampleHeight(heights, u, v)));
        // Stagger heights so labels of neighbouring places do not overlap.
        const h = pin.high ? 0.26 + (hi++ % 4) * 0.1 : 0.16 + (lo++ % 3) * 0.07;
        const s = new THREE.Mesh(stem, stemMat);
        s.scale.y = h;
        s.position.set(x, ground + h / 2, -n);
        const b = new THREE.Mesh(bead, beadMat);
        b.position.set(x, ground + h, -n);
        const r = new THREE.Mesh(ring, ringMat);
        r.position.set(x, ground + 0.003, -n);
        pinGroup.add(s, b, r);
        beads.push(b);
        rings.push(r);
        heads[i].copy(b.position);
      });
    };

    /* ---- load real terrain ---- */
    const hd = !small && renderer.capabilities.maxTextureSize >= 4096;
    Promise.all([loadHeights(), loadTexture(hd ? "/terrain/satellite-hd.jpg" : "/terrain/satellite-sd.jpg"), loadTexture("/terrain/water.png")])
      .then(([heights, satellite, mask]): TerrainAssets => ({ heights, satellite, water: mask }))
      .then(({ heights, satellite, water: mask }) => {
        if (disposed) {
          satellite.dispose();
          mask.dispose();
          return;
        }
        satellite.colorSpace = THREE.SRGBColorSpace;
        satellite.anisotropy = renderer.capabilities.getMaxAnisotropy();
        keep(satellite);
        mask.colorSpace = THREE.NoColorSpace;
        keep(mask);

        const terrainGeo = keep(buildTerrain(heights, fine ? 1 : 2));
        const terrainMat = keep(new THREE.MeshStandardMaterial({ map: satellite, roughness: 0.9, metalness: 0, color: new THREE.Color(1.12, 1.12, 1.08) }));
        world.add(new THREE.Mesh(terrainGeo, terrainMat));

        waterUniforms.uMask.value = mask;
        water.visible = true;
        placePins(heights);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Terrain failed to load", error);
        if (!disposed) setStatus("failed");
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
      fit = aspect < 0.75 ? 1.45 : aspect < 1.15 ? 1.2 : 1;
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
      userPol = clamp(userPol - (e.clientY - lastY) * 0.004, -0.4, 0.4);
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
    const fog = scene.fog as THREE.Fog;
    // Adaptive resolution: if frames are slow, drop the pixel ratio step by step.
    let ratio = renderer.getPixelRatio();
    let slowFrames = 0;
    let sampled = 0;
    let raf = 0;
    let last = performance.now();
    const start = last;

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

      if (interactive && !dragging && !reduced && f < 0.5) spin += dt * 0.08;
      userAz += nudge.current;
      nudge.current = 0;
      const sway = reduced || interactive ? 0 : Math.sin(now / 2600) * 0.04;

      const goal: Rig = {
        x: a.x + (b.x - a.x) * t,
        z: a.z + (b.z - a.z) * t,
        d: (a.d + (b.d - a.d) * t) * fit,
        az: a.az + (b.az - a.az) * t + userAz + spin + sway,
        pol: clamp(a.pol + (b.pol - a.pol) * t + userPol, 0.3, 1.2),
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
      camera.lookAt(cur.x, 0.05, cur.z);

      // Haze scales with distance so the island stays crisp and the horizon melts into the page.
      fog.near = cur.d * 1.7;
      fog.far = cur.d * 4.2;
      waterUniforms.uFog.value.set(fog.near, fog.far);
      const time = reduced ? 0 : (now - start) / 1000;
      waterUniforms.uTime.value = time;

      // Clouds: present from afar, gone when you fly in close.
      cloudMat.opacity = clamp((cur.d - 7) / 6, 0, 1) * 0.22;
      clouds.offset.set(time * 0.004, time * 0.0025);

      const on = activeRef.current;
      const pulse = reduced ? 1 : 1 + 0.25 * Math.sin(time * 2.4);
      for (let p = 0; p < beads.length; p++) {
        const shown = !on || on.includes(pins[p].slug);
        const target = shown ? 1.4 : 0.7;
        const s = beads[p].scale.x + (target - beads[p].scale.x) * Math.min(1, dt * 8);
        beads[p].scale.setScalar(s);
        rings[p].visible = shown;
        rings[p].scale.setScalar(pulse);
      }

      renderer.render(scene, camera);
      if (dt > 0 && sampled < 600) {
        sampled++;
        slowFrames = dt > 0.034 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (slowFrames > 20 && ratio > 0.75) {
          ratio = Math.max(0.75, ratio - 0.5);
          renderer.setPixelRatio(ratio);
          renderer.setSize(width, height, false);
          slowFrames = 0;
        }
      }

      for (let p = 0; p < heads.length; p++) {
        const el = labels.current[p];
        if (!el) continue;
        v.copy(heads[p]).project(camera);
        const x = (v.x * 0.5 + 0.5) * width;
        const y = (-v.y * 0.5 + 0.5) * height;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        el.style.zIndex = String(1000 - Math.round(v.z * 1000));
        el.style.visibility = v.z > 1 || beads.length === 0 ? "hidden" : "";
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
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

  if (!supported || status === "failed") {
    return (
      <div className={`flex items-center justify-center bg-abyss p-6 ${className}`}>
        <SatelliteMap pins={pins} className="h-full max-h-[80vh]" />
      </div>
    );
  }

  return (
    <div ref={wrap} className={`relative isolate bg-abyss ${className}`}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`block h-full w-full ${interactive ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gold" role="status">
          <LotusMark className="h-10 w-12 animate-pulse" />
          <span className="label text-paper/70">Loading satellite terrain…</span>
        </div>
      )}
      <ul className="pointer-events-none absolute inset-0 m-0 list-none overflow-hidden p-0" aria-label="Destinations on the map">
        {pins.map((pin, i) => (
          <li
            key={pin.slug}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="island-label"
            data-on={status === "ready" && (!active || active.includes(pin.slug))}
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
      <p className="pointer-events-auto absolute bottom-1.5 left-2 z-[2001] max-w-[70%] text-[0.625rem] leading-tight text-paper/55">
        Imagery:{" "}
        <a href="https://s2maps.eu" target="_blank" rel="noopener noreferrer" className="underline hover:text-paper">
          Sentinel-2 cloudless
        </a>{" "}
        by EOX (Copernicus Sentinel data 2016 &amp; 2017) · Elevation: AWS Terrain Tiles
        <span className="sr-only"> — {TERRAIN_CREDIT}</span>
      </p>
    </div>
  );
}
