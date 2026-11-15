# Study Guide — How Serendib Is Built

This document explains the **whole project**: the idea, the design decisions, the architecture, and how each feature works, with pointers to the exact files. Read it top to bottom, or jump to the part you want to learn.

---

## Contents

1. [The idea](#1-the-idea)
2. [Design language](#2-design-language)
3. [Tech stack and why](#3-tech-stack-and-why)
4. [Folder tour](#4-folder-tour)
5. [Architecture: how a page is made](#5-architecture-how-a-page-is-made)
6. [Content as data](#6-content-as-data)
7. [Technique: liquid glass](#7-technique-liquid-glass)
8. [Technique: traditional ornament without images](#8-technique-traditional-ornament-without-images)
9. [Technique: the realistic 3D satellite terrain (three.js)](#9-technique-the-realistic-3d-satellite-terrain-threejs)
10. [Technique: 3D scroll-driven animation](#10-technique-3d-scroll-driven-animation)
11. [Technique: pointer tilt cards](#11-technique-pointer-tilt-cards)
12. [Forms, Server Actions and saving notes](#12-forms-server-actions-and-saving-notes)
13. [Storage: PostgreSQL with a file fallback](#13-storage-postgresql-with-a-file-fallback)
14. [Interactive components](#14-interactive-components)
15. [Images and performance](#15-images-and-performance)
16. [Accessibility](#16-accessibility)
17. [Exercises to practise](#17-exercises-to-practise)
18. [Glossary](#18-glossary)

---

## 1. The idea

**Goal:** make a foreign visitor *want* to come to Sri Lanka.

The site is a **showcase**, not a shop. There are no bookings or payments. That decision shapes everything:

- **Lead with images and feeling, then give facts.** Every page opens with a photograph in a temple arch, then moves to practical information.
- **Show the whole island, not just the beaches.** Six regions, 18 destinations, culture, food, wildlife.
- **Be honest and useful.** Seasons, etiquette, visas (pointing to official sources), emergency numbers.
- **Let travellers talk to each other.** The guestbook and per-destination notes are the only things visitors write.

**Information architecture** (what goes where):

```
Home ─┬─ Destinations ── Destination guide (×18)
      ├─ Experiences
      ├─ Culture
      ├─ Food & Tea
      ├─ Wildlife
      ├─ Itineraries
      ├─ Travel Guide (practical)
      ├─ Gallery
      ├─ Guestbook   ← visitors write
      └─ Contact     ← visitors write
```

---

## 2. Design language

The visual identity comes from **Kandyan lacquer work and temple ceiling paintings**: flat, saturated colours, lotus petals and beaded borders.

**Rule: solid colours only, no gradients.** Depth comes from layering instead: offset solid "shadow" blocks behind photos, translucent glass, and real 3D.

| Token | Hex | Used for |
| --- | --- | --- |
| `maroon` | `#6f1a28` | Primary brand, headings, heroes |
| `lacquer` | `#b3372a` | Accents, errors |
| `saffron` | `#e4902b` | Buttons, offset blocks |
| `gold` | `#f0b93f` | Highlights on dark backgrounds |
| `leaf` | `#17503f` | Nature sections, "best season" |
| `ocean` | `#14485a` | Coast sections |
| `parchment` / `paper` | `#f3e8d2` / `#faf4e6` | Page backgrounds |
| `ink` | `#1b1411` | Text, dark sections |

These are defined once in `src/app/globals.css` inside Tailwind 4's `@theme { … }` block. That automatically creates utility classes like `bg-maroon`, `text-gold` and `border-leaf`.

**Typography.** Three typefaces designed in Sri Lanka, which also support Sinhala script:

- **Abhaya Libre** — display headings (`.display`)
- **Yaldevi** — body text
- **Gemunu Libre** — small uppercase labels (`.label`)
- **Noto Sans Tamil** — fallback so Tamil text renders properly

They're self-hosted through `@fontsource` packages imported in `src/app/layout.tsx`, so there are no requests to Google Fonts.

**Signature shapes:**

- The **temple arch** frame on photos (`<Arch>`)
- The **lotus-petal border** between sections (`.petals`)
- The **lotus medallion** (`<Mandala>`)

---

## 3. Tech stack and why

| Tool | Why it was chosen |
| --- | --- |
| **Next.js 16 (App Router)** | Server-rendered pages (fast, good for SEO), file-based routing, Server Actions for forms without writing an API |
| **React 19** | Component model; `useTransition` and `useSyncExternalStore` are used |
| **TypeScript** | Catches mistakes early; the content data is fully typed |
| **Tailwind CSS 4** | Fast styling with design tokens from `@theme` |
| **three.js** | WebGL 3D for the satellite terrain, with custom GLSL shaders for the water |
| **sharp** | Image processing in the build-time terrain pipeline |
| **Drizzle ORM + PostgreSQL** | Type-safe SQL and a durable database |
| **JSON-file fallback** | The site works with zero setup and no database |
| **CSS scroll-driven animations** | Scroll effects run on the browser's compositor with no JavaScript |

---

## 4. Folder tour

```
scripts/
└─ build-terrain.mjs           ← one-off pipeline: satellite + elevation → /public/terrain
public/terrain/                 ← generated map assets (imagery, depth mask, elevation grid)
src/
├─ app/                        ← every folder = a URL (App Router)
│  ├─ layout.tsx               ← shell: fonts, <Nav>, <main>, <Footer>, SVG defs
│  ├─ globals.css              ← design tokens, glass, ornaments, animations
│  ├─ page.tsx                 ← Home  (/)
│  ├─ destinations/
│  │  ├─ page.tsx              ← /destinations  (3D explorer + filterable list)
│  │  └─ [slug]/page.tsx       ← /destinations/sigiriya, /destinations/ella …
│  ├─ experiences/ culture/ food/ wildlife/ itineraries/ plan/ gallery/
│  ├─ guestbook/page.tsx       ← reads notes from storage on every request
│  ├─ contact/page.tsx
│  ├─ actions.ts               ← Server Actions: addNote, sendMessage, subscribe
│  ├─ api/health/route.ts      ← GET /api/health
│  ├─ not-found.tsx            ← custom 404
│  └─ icon.svg                 ← favicon
├─ components/
│  ├─ ui.tsx                   ← Photo, Arch, Mandala, LotusMark, SectionHead, PageHero…
│  ├─ Island3D.tsx             ← realistic 3D satellite terrain (client only)
│  ├─ SatelliteMap.tsx         ← 2D satellite map: locator + no-WebGL fallback
│  ├─ AtlasScroll.tsx          ← scroll-driven island tour + IslandExplorer
│  ├─ Nav.tsx / Footer.tsx
│  ├─ DestinationCard.tsx / DestinationsExplorer.tsx
│  ├─ SeasonFinder.tsx / Gallery.tsx / Tilt.tsx
│  ├─ forms.tsx                ← NoteForm, MessageForm, NewsletterForm
│  └─ Notes.tsx                ← renders the list of notes
├─ db/
│  ├─ index.ts                 ← optional Postgres connection (getDb, hasDatabase)
│  └─ schema.ts                ← Drizzle table definitions
└─ lib/
   ├─ data.ts                  ← ALL site content (destinations, dishes, festivals…)
   ├─ photos.ts                ← every photo: id, alt text, photographer
   ├─ geo.ts                   ← Web-Mercator projection (toXY, toUV)
   ├─ terrain.ts               ← generated: exact bounds of the terrain data
   ├─ store.ts                 ← storage layer (Postgres or JSON file)
   └─ form.ts                  ← shared FormState type
```

**Key idea:** `app/` decides *what* the URLs are, `components/` decides *how things look*, and `lib/data.ts` decides *what is said*.

---

## 5. Architecture: how a page is made

### Server Components by default

Every file under `app/` is a **Server Component** unless it starts with `"use client"`. Server Components run on the server, can read data directly, and send plain HTML to the browser with no JavaScript for that part.

```tsx
// src/app/guestbook/page.tsx   (Server Component)
export const dynamic = "force-dynamic";      // render on every request: notes change

export default async function GuestbookPage() {
  const notes = await listNotes(undefined, 80);  // read storage directly, no API needed
  return <NotesList notes={notes} … />;
}
```

### Client Components only where needed

Interactive pieces are **Client Components** (`"use client"` at the top):

| Component | Why it must run in the browser |
| --- | --- |
| `Island3D` | WebGL canvas, animation loop |
| `AtlasScroll` | Reads scroll position |
| `Nav` | Mobile menu open/close state |
| `DestinationsExplorer` | Live filtering |
| `SeasonFinder` | Month buttons |
| `Gallery` | Lightbox dialog |
| `Tilt` | Pointer tracking |
| `forms.tsx` | Form state, pending spinner |

A Server Component can render a Client Component and pass it data as props, like this from `src/app/page.tsx`:

```tsx
<AtlasScroll steps={ATLAS} pins={pins} />
```

### Static vs dynamic routes

The build output marks each route:

```
○ /culture                ← static: pre-rendered once at build time
ƒ /guestbook              ← dynamic: rendered per request (shows live notes)
ƒ /destinations/[slug]    ← dynamic: each guide shows live notes
```

Content pages are static, so they're very fast. Pages showing visitor notes are dynamic.

### Dynamic route segments

`src/app/destinations/[slug]/page.tsx` handles all 18 destinations with one file:

```tsx
export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;            // e.g. "sigiriya"
  const d = getDestination(slug);
  if (!d) notFound();                        // → custom 404 page
  …
}
```

`generateMetadata` in the same file gives each guide its own `<title>` and description for search engines.

---

## 6. Content as data

All text lives in **`src/lib/data.ts`** as typed arrays. Pages just loop over them.

```ts
export interface Destination {
  slug: string;          // URL part
  name: string;
  native: string;        // name in Sinhala or Tamil script
  region: Region;
  tags: Tag[];
  lat: number; lng: number;   // used to place the pin on the 3D island
  photo: PhotoKey;            // must be a key of PHOTOS — checked by TypeScript
  best: number[];             // best months, 1–12
  …
}
```

**Why this matters:**

- **Add a destination once** and it appears in the list, the filters, the 3D map, the season finder, the marquee and the gallery groups.
- **TypeScript guards it.** `photo: "sigiriya"` must match a key in `src/lib/photos.ts`, so a typo fails the build instead of showing a broken image.
- **The same data feeds many views.** `best` months drive the month strip on each guide, the season finder and the "Good in" filter.

`src/lib/photos.ts` maps a readable key to a Pexels photo id, its alt text and the photographer's name. Alt text and credits are written once and reused everywhere.

---

## 7. Technique: liquid glass

"Liquid glass" is a translucent panel that blurs and slightly brightens whatever is behind it, with a bright rim like the edge of real glass. You'll find it on the navigation bar, the scroll-tour cards, the photo captions and the labels on the 3D island.

```css
/* src/app/globals.css */
.glass {
  background: rgb(27 20 17 / 0.62);                    /* solid tint, partly transparent */
  backdrop-filter: blur(18px) saturate(180%) brightness(1.06);  /* frost the background */
  border: 1px solid rgb(255 255 255 / 0.2);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.4),              /* top highlight (specular rim) */
    inset 1px 0 0 rgb(255 255 255 / 0.1),
    inset 0 -1px 0 rgb(0 0 0 / 0.3),                   /* bottom edge */
    0 14px 34px rgb(0 0 0 / 0.3);                      /* lift off the page */
}
```

**Things to notice:**

- **No gradient.** The "shine" comes from thin inset shadows, which keeps the solid-colour rule.
- **`backdrop-filter`** does the frosting. `saturate()` keeps the colours behind it rich.
- **Fallback.** `@supports not (backdrop-filter…)` makes the panel more opaque in browsers without blur, so text stays readable.
- **The "liquid" feel** comes from springy motion: `.liquid` and `.btn` use a custom easing curve (`--ease-spring`, a CSS `linear()` function) that overshoots slightly and settles.

Variants: `.glass-clear` (lighter, used over photos), `.glass-light` (pale), `.glass-deep` (more opaque, for the nav) and `.glass-lg` (a large panel, wide screens only).

---

## 8. Technique: traditional ornament without images

None of the decoration uses image files.

### Temple arch: an SVG `clipPath`

`<SvgDefs>` (in `ui.tsx`, rendered once in the layout) defines a pointed arch shape in 0–1 coordinates:

```tsx
<clipPath id="arch" clipPathUnits="objectBoundingBox">
  <path d="M0,1 L0,0.33 C0,0.19 0.2,0.125 0.35,0.085 … Z" />
</clipPath>
```

Any element with `style={{ clipPath: "url(#arch)" }}` is cut to that shape, whatever its size. `<Arch>` puts a solid saffron copy behind the photo, offset by a few pixels, which gives the layered look.

### Lotus-petal border: a CSS `mask`

```css
.petals {
  height: 20px;
  background-color: currentColor;                 /* colour comes from text-* class */
  mask: url("data:image/svg+xml,…petal path…") repeat-x center bottom / 26px 20px;
}
```

One small petal SVG, repeated horizontally, is used as a mask. Because the colour is `currentColor`, `<div className="petals text-saffron">` gives saffron petals and `text-parchment` gives cream ones. Each section uses it to "bite" into the next. `.beads` works the same way.

### Lotus medallion: SVG generated in code

`<Mandala>` builds concentric rings of petals with loops instead of a hand-drawn file:

```tsx
<Ring n={16} r0={58} r1={113} hw={21} fill="var(--color-parchment)" />
// draws 16 petals, each rotated 360/16 degrees from the last
```

On the home page it slowly rotates as you scroll (`.fx-spin`, see §10).

---

## 9. Technique: the realistic 3D satellite terrain (three.js)

Files: **`scripts/build-terrain.mjs`** (data pipeline), **`src/components/Island3D.tsx`** (renderer), **`src/components/SatelliteMap.tsx`** (2D version), **`src/lib/terrain.ts`** (generated bounds).

The island is built from **real data**, not drawn by hand:

| Data | Source | Licence |
| --- | --- | --- |
| Satellite imagery | Sentinel-2 cloudless 2016, by EOX IT Services GmbH | CC BY 4.0 (attribution shown on the map) |
| Elevation and sea depth | AWS Terrain Tiles (SRTM on land, ETOPO1 at sea) | Open data |

### Step 1: the build-time data pipeline

`node scripts/build-terrain.mjs` runs **once, by the developer**. Visitors never contact the tile servers.

1. **Pick the crop.** Both sources are Web-Mercator "XYZ" tile sets. At zoom 10 their pixels line up exactly. The script works out which tiles cover Sri Lanka (about 100 of each) and snaps the crop to whole pixels.
2. **Download and stitch.** Tiles are fetched 8 at a time and copied into one big buffer with `sharp`.
3. **Decode elevation.** "Terrarium" tiles store height in the colour channels:

   ```js
   const metres = R * 256 + G + B / 256 - 32768;
   ```

   The result runs from −4,310 m (sea floor) to 2,508 m (Pidurutalagala, the highest peak).
4. **Write the output files:**

   | File | What it is |
   | --- | --- |
   | `satellite-hd.jpg` / `satellite-sd.jpg` | The imagery. Water pixels are recoloured by depth, because raw imagery water is nearly black. |
   | `water.png` | An 8-bit depth mask. 0 is land; 28–255 runs from shallow to deep. The coastline is a single threshold. |
   | `height.bin(.gz)` | A 512×808 `Int16` elevation grid. Each cell blends the mean with the peak, so summits aren't flattened. |
   | `src/lib/terrain.ts` | The exact bounds, so the client can line everything up. |

### Step 2: one projection everywhere

Map tiles use **Web Mercator**, so `src/lib/geo.ts` uses it too:

```ts
mercDeg(lat) = ln(tan(π/4 + φ/2)) × 180/π        // northing, in "degree" units
toXY(lat, lng) → [lng − 80.75, mercDeg(lat) − mercDeg(7.85)]   // 3D world position
toUV(lat, lng) → position on the images (0→1)                   // texture / 2D map position
```

Because the terrain mesh, the textures, the 3D pins and the 2D map pins all go through these two functions, a pin for Ella lands exactly on Ella in every view.

### Step 3: the terrain mesh

`buildTerrain()` creates a grid `BufferGeometry` (each vertex gets a position, a uv coordinate and an index):

- **x** goes linearly from west to east; **z** goes linearly in Mercator northing.
- **y** is the elevation × `13 / 111 000`, a **13× vertical exaggeration**. At true scale, 2.5 km of mountain on a 445 km island would look flat.
- The satellite image is draped over it as `MeshStandardMaterial.map`. `computeVertexNormals()` lets the sun light the slopes, so the relief reads.
- **Level of detail:** capable desktops get every vertex (about 414,000). Everyone else gets every second one in each direction (about 103,000).

### Step 4: the water shader (GLSL)

The sea is one flat plane with a custom `ShaderMaterial`. Per pixel, it:

1. **Reads depth** from `water.png`. Land pixels are discarded, so the terrain shows through.
2. **Colours by depth:** lagoon turquoise → shelf blue → open-ocean navy.
3. **Builds a wave normal** from the analytic gradient of three moving sine waves plus fine value noise. No normal-map image is needed.
4. **Fresnel reflection:** at grazing angles the water reflects more sky, `pow(1 − N·V, 4)`.
5. **Sun glint:** a tight specular highlight, `pow(R·V, 220)`.
6. **Shore foam:** a band where the mask is just above the land threshold, broken up by moving noise.
7. **Distance haze** toward the page background colour.
8. **Seamless edges:** beyond the data area, edge values are carried outward and faded into open ocean, so shallow seas such as the Palk Strait never end in a straight line.

> **A bug worth learning from.** The haze originally used a distance computed in the *vertex* shader and passed on as a `varying`. The plane has only 4 vertices, about 45 units away, so the interpolated "distance" was about 45 at **every** pixel and the whole sea was fogged to the background colour. The fix: pass the view-space *position* and take `length()` per pixel. **Values that aren't linear can't be interpolated linearly.**

### Step 5: atmosphere, pins and labels

- **Haze** (`THREE.Fog` for the terrain, the same maths in the water shader) scales with camera distance, so the island stays crisp and the horizon melts into the page.
- **Clouds** are a tileable fractal-noise texture generated on a `<canvas>` at runtime. They drift slowly and fade out as the camera flies in.
- **Pins** sample the elevation grid with **bilinear interpolation** to stand on the real ground. Each has a stem, a gold bead and a pulsing ring.
- **Labels** are real HTML links. Each frame, every bead's 3D position is projected to screen pixels (`vector.project(camera)`), and labels behind the camera are hidden.

### Step 6: performance and fallbacks

- **Small downloads:**
  - the elevation grid ships gzipped and is unzipped in the browser with `DecompressionStream`
  - the depth mask is half resolution
  - phones get the smaller satellite image
- **Adaptive resolution:** if frames take longer than 34 ms, the pixel ratio steps down automatically.
- **Pauses** when off-screen or when the tab is hidden. **Disposes** all GPU memory when it unmounts.
- **Respects `prefers-reduced-motion`:** no idle spin, no wave motion, no easing.
- **No WebGL, or data failed to load?** It shows `SatelliteMap`, a flat satellite image with the same pins positioned by `toUV()`. The same component is the "Where it is" locator on every destination page.

### Camera "rig" and smooth flying

Each view is `{ lat, lng, dist, az, pol }`: what to look at, how far away, and the angle around and above. The camera position comes from **spherical coordinates**:

```ts
camera.position.set(
  x + d * Math.sin(pol) * Math.sin(az),
  d * Math.cos(pol),
  z + d * Math.sin(pol) * Math.cos(az),
);
```

Moving between views uses **smoothstep easing** (`t*t*(3-2t)`) plus **exponential damping** every frame (`cur += (goal - cur) * k`). The flight glides and slows down at the end instead of stopping dead.

## 10. Technique: 3D scroll-driven animation

Two different approaches are used, each where it fits best.

### A. Pure CSS scroll timelines (no JavaScript)

```css
@keyframes fx-flip {
  from { opacity: 0; transform: perspective(1100px) rotateX(38deg) translateY(90px) scale(0.9); }
  to   { opacity: 1; transform: perspective(1100px) rotateX(0deg)  translateY(0)    scale(1); }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .fx-flip {
      animation: fx-flip linear both;
      animation-timeline: view();               /* progress = element moving through viewport */
      animation-range: entry 0% cover 32%;
    }
  }
}
```

Instead of running over time, the animation's progress is tied to the element's position on screen. Cards tip forward in 3D as they scroll into view.

| Class | Effect |
| --- | --- |
| `.fx-flip` | Tip up from flat (cards) |
| `.fx-swing-l` / `.fx-swing-r` | Swing in from the side around the Y axis |
| `.fx-rise` | Fade and rise |
| `.fx-drift` | Parallax: the image moves slower than the page |
| `.fx-zoom-out` | Hero photo settles from zoomed in |
| `.fx-hero-a/b/c` | The three hero arches move at different speeds (`scroll(root)` timeline) |
| `.fx-spin` | The medallion rotates with page scroll |

**Progressive enhancement:** everything is visible by default. The animations are only switched on inside `@supports` and the reduced-motion media query, so older browsers and people who prefer less motion get a static page with no missing content.

### B. JavaScript sticky scroll tour (`AtlasScroll.tsx`)

The home page tour needs to drive a WebGL camera, which CSS can't do, so:

1. The section is tall (one screen per step), and the canvas inside is `position: sticky; top: 0`, so it stays pinned while you scroll past.
2. On scroll, progress through the section is turned into a **fractional step index**:

   ```ts
   const p = -rect.top / (rect.height - window.innerHeight);   // 0 → 1
   progress.current = p * (steps.length - 1);                  // e.g. 2.4
   ```

3. `Island3D` reads `progress.current` inside its animation loop and blends between view 2 and view 3, 40% of the way.

The value is kept in a **ref, not state**. Scrolling then doesn't re-render React 60 times a second; only the rounded step index (which card is highlighted) is state.

`IslandExplorer` on `/destinations` reuses the same component. The region buttons just set `progress.current = i`, and the camera flies there.

---

## 11. Technique: pointer tilt cards

File: **`src/components/Tilt.tsx`**

```ts
const x = (e.clientX - r.left) / r.width - 0.5;      // -0.5 … 0.5
el.style.setProperty("--ry", `${x * max}deg`);
el.style.setProperty("--rx", `${-y * max}deg`);
```

```css
.tilt     { transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)); transform-style: preserve-3d; }
.tilt-pop { transform: translateZ(36px); }     /* badges float above the photo */
```

JavaScript only sets two CSS variables; the browser does the 3D maths. It only reacts to a **mouse** (`pointerType === "mouse"`), so touch scrolling isn't hijacked, and it's turned off for reduced motion.

---

## 12. Forms, Server Actions and saving notes

This is the full journey of a guestbook note:

```
NoteForm (browser)
   │  1. visitor clicks "Add my note"
   │  2. useServerForm → FormData → calls addNote(...)  ──────────┐
   ▼                                                           network
actions.ts  "use server"   (runs on the server)                   │
   │  3. read + trim fields, check honeypot                  ◄─────┘
   │  4. validate → if invalid, return { ok:false, errors }
   │  5. insertNote(...)            → lib/store.ts
   │  6. revalidatePath("/guestbook")  (drop cached render)
   │  7. return { ok:true, message }
   ▼
NoteForm (browser)
   │  8. show message, reset form
   │  9. router.refresh()  → re-render server components → new note appears
```

### Server Actions

`src/app/actions.ts` starts with `"use server"`. Its exported async functions can be called from client code **as if they were local functions**. Next.js turns each call into a secure POST request for you, so there's no API route to write.

### `useServerForm` (in `forms.tsx`)

A small custom hook shared by all three forms:

- `useTransition` gives a `pending` flag, so the button shows "Adding…".
- It builds `FormData` from the form and calls the action.
- **On error, it keeps what the visitor typed** (the form isn't reset).
- On success, it resets the form and, for notes, calls `router.refresh()` so the list updates straight away.

### Validation and safety

- **Server-side validation is the source of truth.** Never trust the browser.
- **Errors are returned per field** and shown under each input, linked by `aria-describedby`.
- **Lengths are capped** (`slice(0, max)`) and numbers clamped.
- **Destination must exist** in `DESTINATIONS`, so nobody can post to a made-up page.
- **Honeypot field.** A hidden "website" input that people never see. Spam bots fill it in and get silently ignored.
- **React escapes all output**, so a note containing `<script>` is shown as text, not run.

---

## 13. Storage: PostgreSQL with a file fallback

### The problem it solves

Originally, `src/db/index.ts` threw an error as soon as it loaded if `DATABASE_URL` was missing. On a laptop or a host with no database, that **crashed the guestbook and every destination page**, so notes couldn't be added at all.

### The design now

`src/db/index.ts` no longer throws. It exports:

- `hasDatabase` — `true` if `DATABASE_URL` is set
- `getDb()` — creates the connection pool **lazily**, on first use, and reuses it

`src/lib/store.ts` offers one set of functions with **two interchangeable backends**:

```ts
export async function insertNote(note: NewNote) {
  if (hasDatabase) {                         // ① PostgreSQL via Drizzle
    await ensureSchema();
    await getDb().insert(notes).values(note);
    return;
  }
  await updateFileData((data) => {           // ② JSON file
    data.notes.push({ id: nextId(data.notes), ...note, createdAt: new Date().toISOString() });
  });
}
```

The rest of the app (`actions.ts`, pages) **never knows which backend is used**. This is the *repository pattern*: callers depend on what the functions do, not how they store data.

**PostgreSQL details:**

- `src/db/schema.ts` defines the tables with Drizzle, giving TypeScript types for every row (`Note = typeof notes.$inferSelect`).
- `ensureSchema()` runs `CREATE TABLE IF NOT EXISTS …` once per server process, so a brand-new database works with no migration step. The promise is cached on `globalThis` so it runs only once.
- TLS is switched on automatically for hosted databases (Neon, Supabase, Render).

**JSON file details:**

- It writes to `./.data/serendib.json`. If that folder isn't writable, it falls back to the system temp folder, and `SERENDIB_DATA_DIR` overrides both.
- **Atomic writes.** It writes to a `.tmp` file, then `rename()`s it over the real one, so a crash mid-write can't corrupt the data.
- **A write queue.** Each read-modify-write cycle waits for the previous one, so two quick submissions can't overwrite each other (a *race condition*).

`/api/health` reports which backend is active: `{ "ok": true, "storage": "postgres" | "file" }`.

> **Why not files in production?** Serverless hosts (Vercel, Netlify) run your code in short-lived containers, and free instances reset their disk on restart. Files written there disappear. Use PostgreSQL in production by providing a `DATABASE_URL` environment variable.

---

## 14. Interactive components

### `DestinationsExplorer`: filtering without a server

Four pieces of state (region, tag, month, search text) and a `useMemo` that filters the array. Nothing is fetched; the 18 items are already in the page. The "Clear filters" button resets all four. An empty result shows a helpful message instead of a blank space.

`/destinations?region=Hill%20Country` pre-selects a filter. The server page reads `searchParams` and passes `initialRegion`, and `key={initialRegion}` resets the component when the URL changes.

### `SeasonFinder`: reading the browser's clock safely

The server doesn't know the visitor's month, and rendering a different month on the server and in the browser causes a *hydration mismatch*. The fix is `useSyncExternalStore` with a **server snapshot** (January) and a **client snapshot** (the real month):

```ts
const current = useSyncExternalStore(subscribeNever, () => new Date().getMonth(), () => 0);
const [picked, setMonth] = useState<number | null>(null);
const month = picked ?? current;      // the visitor's choice wins once they click
```

### `Gallery`: native `<dialog>` lightbox

The browser's built-in `<dialog>` with `showModal()` gives you, for free: focus moved inside, focus kept inside, **Esc to close**, and the page behind made inert. The arrow keys move between photos. The filter buttons use `aria-pressed`.

### `Nav`: mobile menu

It locks page scroll while open, closes on **Esc** or when a link is chosen, and marks the current page with `aria-current="page"`.

---

## 15. Images and performance

`<Photo>` in `ui.tsx` builds a responsive image from a Pexels id:

```tsx
<img
  src={url(1200)}
  srcSet="…480w, …800w, …1200w, …1800w"   // browser picks the right size
  sizes="(min-width: 1024px) 30vw, 90vw"   // how wide it will display
  loading={priority ? "eager" : "lazy"}    // only the hero loads immediately
  fetchPriority={priority ? "high" : undefined}
  decoding="async"
/>
```

- **The right file size for each screen.** A phone downloads a 480 px image, not an 1800 px one.
- **Lazy loading.** Images below the fold load only when you scroll near them.
- **Server-side cropping.** The Pexels CDN crops to the requested shape (`&h=…&fit=crop`), so no pixels are wasted.

Other performance choices:

- **Most pages are static.** They're pre-rendered at build time and served instantly.
- **three.js is code-split.** It only downloads on pages that show the island.
- **CSS animations run on the compositor**, keeping the main thread free.
- **Self-hosted fonts.** No third-party font requests.

---

## 16. Accessibility

- **One `<h1>` per page**, with headings in a logical order.
- **A skip link** ("Skip to content") as the first thing you reach with the Tab key.
- **A visible focus ring** on everything focusable (`:focus-visible`).
- **Every photo has meaningful alt text**, from `photos.ts`. Decorative ornaments are marked `aria-hidden`.
- **Form fields** have labels, errors linked by `aria-describedby`, `aria-invalid`, and status messages in an `aria-live` region.
- **Toggle buttons** use `aria-pressed`, and the month buttons have full month names as labels.
- **Tables** have `<caption>`, `scope="col"` and `scope="row"`.
- **Language tags.** `lang="si"` and `lang="ta"` on Sinhala and Tamil text, so screen readers pronounce them correctly.
- **Reduced motion.** `prefers-reduced-motion` turns off scroll animations, the marquee, spinning and springy hovers.
- **Colour is never the only signal.** The season chart has text labels and symbols as well as colours.

---

## 17. Exercises to practise

Start easy and work down.

1. **Add a destination.** Add a new object to `DESTINATIONS` in `src/lib/data.ts`, for example Bentota or Knuckles. Watch it appear in the list, the filters and on the 3D map automatically.
2. **Change the brand colour.** Edit `--color-maroon` in `globals.css` and see how many places update.
3. **New ornament.** Make a `.diamonds` border using the same `mask` technique as `.petals`.
4. **New scroll effect.** Write `@keyframes fx-scale-in` and use it with `animation-timeline: view()` on one section.
5. **Terrain experiments.** Change the vertical exaggeration (`VERTICAL`) or the water colours in `WATER_FRAG`, or add a gentle day/night cycle by animating `uSun`.
6. **Note moderation.** Add an `approved` boolean column (in `schema.ts`, the SQL in `ensureSchema`, and the JSON backend) and only list approved notes.
7. **Average rating.** Show "★ 4.6 from 12 notes" on each destination page, calculated in `store.ts`.
8. **Search in the guestbook.** Add a client-side filter over the notes list.
9. **Dark mode.** Add a `prefers-color-scheme: dark` variant of the colour tokens.
10. **Translations.** Move strings into `en`, `si` and `ta` dictionaries and add a language switcher.

---

## 18. Glossary

| Term | Meaning |
| --- | --- |
| **App Router** | Next.js routing where folders in `app/` become URLs |
| **Server Component** | React component that runs only on the server and sends HTML |
| **Client Component** | React component (`"use client"`) that also runs in the browser, for interactivity |
| **Server Action** | A `"use server"` function you can call from the browser; Next.js handles the request |
| **Hydration** | The browser attaching React's interactivity to server-sent HTML |
| **ORM** | Library for using the database through code instead of raw SQL strings (here: Drizzle) |
| **Repository pattern** | Hiding storage details behind functions so the backend can change |
| **WebGL** | Browser API for GPU-accelerated 3D graphics; three.js is built on it |
| **Web Mercator** | The map projection used by web map tiles; north–south distances stretch with latitude |
| **DEM / heightmap** | A grid of elevation values used to raise a flat mesh into terrain |
| **Shader (GLSL)** | A small program that runs on the GPU for every vertex or pixel |
| **Fresnel effect** | Surfaces reflect more light when you look at them at a shallow angle |
| **Extrude** | Turning a flat 2D shape into a 3D solid by giving it depth |
| **Spherical coordinates** | Describing a point by distance and two angles, used to orbit the camera |
| **Scroll-driven animation** | A CSS animation whose progress follows scroll position instead of time |
| **`backdrop-filter`** | CSS that applies effects such as blur to whatever is *behind* an element |
| **`clip-path`** | CSS/SVG that cuts an element to a shape |
| **CSS mask** | Uses an image's shape to show or hide parts of an element |
| **Honeypot** | A hidden form field that catches spam bots |
| **Progressive enhancement** | A base that works everywhere, with extras added for capable browsers |
| **Serverless** | Hosting where your code runs in short-lived instances on demand |
