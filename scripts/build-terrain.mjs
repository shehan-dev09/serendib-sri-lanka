/**
 * Builds the realistic 3D map assets for Sri Lanka.
 *
 *   node scripts/build-terrain.mjs
 *
 * Downloads (once, at build time — never at runtime):
 *   • Satellite imagery: Sentinel-2 cloudless 2016 by EOX IT Services GmbH (CC BY 4.0)
 *     https://s2maps.eu — "Contains modified Copernicus Sentinel data 2016 & 2017"
 *   • Elevation + bathymetry: AWS Terrain Tiles (Mapzen "terrarium" encoding), open data
 *     https://registry.opendata.aws/terrain-tiles/ — SRTM, ETOPO1 and other sources
 *
 * Both are Web-Mercator XYZ tile sets at the same zoom, so their pixels line up exactly.
 *
 * Writes:
 *   public/terrain/satellite-hd.jpg   full-resolution colour texture (land imagery + depth-shaded sea)
 *   public/terrain/satellite-sd.jpg   half resolution, for phones and 2D maps
 *   public/terrain/water.png          8-bit water-depth mask at half resolution (0 = land, 28–255 = shallow → deep)
 *   public/terrain/height.bin(.gz)    Int16 little-endian elevation grid in metres (+ gzipped copy)
 *   src/lib/terrain.ts                exact bounds and grid sizes for the client
 */
import { mkdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "terrain");

const ZOOM = 10;
const TILE = 256;
const BOUNDS = { west: 79.35, east: 82.1, south: 5.7, north: 10.0 };
const GRID_WIDTH = 512; // elevation grid columns used to build the mesh

const SATELLITE = (z, x, y) => `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/${z}/${y}/${x}.jpg`;
const TERRARIUM = (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;

/* ------------------------------------------------------------ Web Mercator */

const WORLD = TILE * 2 ** ZOOM;
const lngToPx = (lng) => ((lng + 180) / 360) * WORLD;
const latToPx = (lat) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * WORLD;
};
const pxToLng = (px) => (px / WORLD) * 360 - 180;
const pxToLat = (py) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * py) / WORLD))) * 180) / Math.PI;

// Snap the crop to whole pixels, then recompute the exact bounds those pixels cover.
const px0 = Math.floor(lngToPx(BOUNDS.west));
const px1 = Math.ceil(lngToPx(BOUNDS.east));
const py0 = Math.floor(latToPx(BOUNDS.north));
const py1 = Math.ceil(latToPx(BOUNDS.south));
const W = px1 - px0;
const H = py1 - py0;
const exact = { west: pxToLng(px0), east: pxToLng(px1), north: pxToLat(py0), south: pxToLat(py1) };

const tx0 = Math.floor(px0 / TILE);
const tx1 = Math.floor((px1 - 1) / TILE);
const ty0 = Math.floor(py0 / TILE);
const ty1 = Math.floor((py1 - 1) / TILE);

console.log(`Crop ${W}×${H}px at z${ZOOM}, tiles x ${tx0}–${tx1}, y ${ty0}–${ty1}`);

/* ------------------------------------------------------------ Download */

async function fetchTile(url, attempt = 1) {
  const res = await fetch(url, { headers: { "User-Agent": "serendib-terrain-builder" } });
  if (!res.ok) {
    if (attempt < 4) return fetchTile(url, attempt + 1);
    throw new Error(`${res.status} ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

/** Downloads a tile range and returns a stitched RGB(A) raw buffer of the crop. */
async function mosaic(urlFor, channels) {
  const jobs = [];
  for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) jobs.push({ tx, ty });
  const out = Buffer.alloc(W * H * channels);
  let done = 0;
  const worker = async () => {
    while (jobs.length) {
      const { tx, ty } = jobs.shift();
      const raw = await sharp(await fetchTile(urlFor(ZOOM, tx, ty)))
        .resize(TILE, TILE, { fit: "fill" })
        .removeAlpha()
        .toColourspace("srgb")
        .raw()
        .toBuffer();
      // Copy the part of this tile that falls inside the crop.
      for (let y = 0; y < TILE; y++) {
        const gy = ty * TILE + y - py0;
        if (gy < 0 || gy >= H) continue;
        for (let x = 0; x < TILE; x++) {
          const gx = tx * TILE + x - px0;
          if (gx < 0 || gx >= W) continue;
          raw.copy(out, (gy * W + gx) * channels, (y * TILE + x) * 3, (y * TILE + x) * 3 + channels);
        }
      }
      done++;
      if (done % 20 === 0) process.stdout.write(`  ${done} tiles\r`);
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  return out;
}

/* ------------------------------------------------------------ Build */

await mkdir(OUT, { recursive: true });

console.log("Downloading elevation…");
const terrRaw = await mosaic(TERRARIUM, 3);
const elevation = new Float32Array(W * H);
let maxElevation = -Infinity;
let minElevation = Infinity;
for (let i = 0; i < W * H; i++) {
  // Terrarium encoding: (R × 256 + G + B / 256) − 32768 metres
  const h = terrRaw[i * 3] * 256 + terrRaw[i * 3 + 1] + terrRaw[i * 3 + 2] / 256 - 32768;
  elevation[i] = h;
  if (h > maxElevation) maxElevation = h;
  if (h < minElevation) minElevation = h;
}
console.log(`Elevation ${Math.round(minElevation)} m … ${Math.round(maxElevation)} m`);

console.log("Downloading satellite imagery…");
const sat = await mosaic(SATELLITE, 3);

// Water depth 0–1 (0 = land). sqrt() spreads the shallow shelf, where the colour changes most.
const depthOf = (h) => (h > 0 ? 0 : Math.sqrt(Math.min(-h, 400) / 400));

// Mask: 0 for land, 28–255 for water (shallow → deep), so the coastline is a clean threshold.
const mask = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) {
  const h = elevation[i];
  mask[i] = h > 0 ? 0 : Math.round(28 + 227 * depthOf(h));
}

// Colour texture: real imagery on land, depth-shaded water at sea (imagery water is too dark to read).
const SHALLOW = [64, 170, 172];
const MID = [23, 96, 128];
const DEEP = [10, 40, 66];
const lerp = (a, b, t) => a + (b - a) * t;
for (let i = 0; i < W * H; i++) {
  const h = elevation[i];
  if (h > 0) continue;
  const d = depthOf(h);
  const [c0, c1, t] = d < 0.35 ? [SHALLOW, MID, d / 0.35] : [MID, DEEP, (d - 0.35) / 0.65];
  // Keep a little of the real imagery in very shallow water (reefs, lagoons, river mouths).
  const keep = d < 0.12 ? 0.45 * (1 - d / 0.12) : 0;
  for (let c = 0; c < 3; c++) sat[i * 3 + c] = Math.round(lerp(lerp(c0[c], c1[c], t), sat[i * 3 + c], keep));
}

const colour = sharp(sat, { raw: { width: W, height: H, channels: 3 } }).modulate({ saturation: 1.08 });
await colour.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT, "satellite-hd.jpg"));
await colour
  .clone()
  .resize(Math.round(W / 2))
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(OUT, "satellite-sd.jpg"));
// Half resolution is plenty: the shader filters it smoothly and it is ~4× smaller.
await sharp(mask, { raw: { width: W, height: H, channels: 1 } })
  .resize(Math.round(W / 2), Math.round(H / 2), { kernel: "lanczos3" })
  .png({ compressionLevel: 9, palette: false })
  .toFile(path.join(OUT, "water.png"));

// Elevation grid: box-filter the full-resolution heights down to GRID_WIDTH columns.
const GW = GRID_WIDTH;
const GH = Math.round((H / W) * GW);
const grid = new Int16Array(GW * GH);
for (let gy = 0; gy < GH; gy++) {
  const y0 = Math.floor((gy / GH) * H);
  const y1 = Math.max(y0 + 1, Math.floor(((gy + 1) / GH) * H));
  for (let gx = 0; gx < GW; gx++) {
    const x0 = Math.floor((gx / GW) * W);
    const x1 = Math.max(x0 + 1, Math.floor(((gx + 1) / GW) * W));
    let sum = 0;
    let n = 0;
    let peak = -Infinity;
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const h = elevation[y * W + x];
        sum += h;
        n++;
        if (h > peak) peak = h;
      }
    // Blend mean with peak so summits are not flattened by averaging.
    const mean = sum / n;
    grid[gy * GW + gx] = Math.round(mean > 0 ? mean * 0.7 + peak * 0.3 : mean);
  }
}
await writeFile(path.join(OUT, "height.bin"), Buffer.from(grid.buffer));
// Gzipped copy: browsers inflate it with DecompressionStream (static hosts don't compress .bin files).
await writeFile(path.join(OUT, "height.bin.gz"), gzipSync(Buffer.from(grid.buffer), { level: 9 }));

const ts = `// Generated by scripts/build-terrain.mjs — do not edit by hand.
// Exact Web-Mercator bounds of the files in /public/terrain.

export const TERRAIN = {
  west: ${exact.west.toFixed(6)},
  east: ${exact.east.toFixed(6)},
  north: ${exact.north.toFixed(6)},
  south: ${exact.south.toFixed(6)},
  /** Elevation grid in height.bin (Int16 little-endian, metres, row 0 = north). */
  gridWidth: ${GW},
  gridHeight: ${GH},
  /** Pixel size of satellite-hd.jpg (water.png is half this). */
  imageWidth: ${W},
  imageHeight: ${H},
  maxElevation: ${Math.round(maxElevation)},
  minElevation: ${Math.round(minElevation)},
} as const;

export const TERRAIN_CREDIT =
  "Sentinel-2 cloudless – s2maps.eu by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016 & 2017) · Elevation: Terrain Tiles, AWS Open Data (SRTM, ETOPO1)";
`;
await writeFile(path.join(ROOT, "src", "lib", "terrain.ts"), ts);

console.log(`\nDone: ${W}×${H} imagery, ${GW}×${GH} elevation grid.`);
