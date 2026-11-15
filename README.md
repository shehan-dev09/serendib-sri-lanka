# Serendib — Discover Sri Lanka 🇱🇰

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

An immersive showcase web application for Sri Lanka designed for international travellers. Featuring a **realistic 3D satellite terrain** with real digital elevation data and custom GLSL ocean shaders, scroll-driven camera storytelling, "liquid glass" UI surfaces, and a design language rooted in traditional Kandyan temple arts.

Built purely as a **cultural showcase** (content, culture, and discovery — zero bookings or payment barriers).

---

## 📚 Project Documentation

| Document | Purpose |
| --- | --- |
| **[README.md](./README.md)** | Project overview, tech stack, and local development guide |
| **[STUDY.md](./STUDY.md)** | Architecture breakdown, 3D math & shaders, design decisions, and deep-dive guide |
| **[DEPLOY.md](./DEPLOY.md)** | Step-by-step free deployment tutorial (Vercel, Render, Netlify + Neon PostgreSQL) |

---

## ✨ Key Features

- **Realistic 3D Satellite Island (WebGL / Three.js):**
  - Generated using real Copernicus Sentinel-2 cloudless satellite imagery and AWS Terrain elevation data.
  - Custom GLSL ocean shaders with sun glint and depth-based wave animation.
  - Interactive camera controls and scroll-driven storytelling through 6 distinct geographic regions.
  - Automatic collision-avoidance layout with dynamic SVG leader lines for destination pins.
  - Graceful 2D satellite map fallback for devices without WebGL.
- **Rich Curated Content:**
  - 18 comprehensive destination guides with elevation, highlights, and locator maps.
  - Cultural history, UNESCO World Heritage sites, traditional festivals, crafts, phrasebooks, and etiquette.
  - Culinary guide detailing regional tea, spices, and iconic dishes.
  - Wildlife and national park guide emphasizing responsible tourism.
  - Four curated day-by-day travel itineraries.
- **Liquid Glass UI & Sri Lankan Typography:**
  - Glassmorphic panels with warm amber and deep abyss colour palettes inspired by traditional Kandyan lacquerware.
  - Beautiful typefaces celebrating Sri Lankan design heritage (*Abhaya Libre*, *Gemunu Libre*, *Yaldevi*, and *Noto Sans Tamil*).
- **Hybrid Storage & Server Actions:**
  - PostgreSQL with Drizzle ORM for guestbook notes, visitor ratings, and contact messages.
  - **Automatic zero-config JSON-file fallback** when no database URL is provided — works immediately out of the box.

---

## 🗺️ Application Routes

| Route | Description |
| --- | --- |
| `/` | **Home**: Hero, interactive scroll-driven 3D island tour, island highlights, and season finder |
| `/destinations` | **Destinations**: Full-screen draggable 3D island explorer with search and regional filters |
| `/destinations/[slug]` | **Destination Guide**: Deep dive per location with visitor notes and 2D locator map |
| `/experiences` | **Experiences**: 10 signature Sri Lankan travel experiences |
| `/culture` | **Culture**: History, UNESCO heritage citadels, festivals, crafts, and Sinhala phrasebook |
| `/food` | **Food & Tea**: Regional specialties, street food, tea elevations, and spice profiles |
| `/wildlife` | **Wildlife**: Endemic animals, national parks, and ethical wildlife watching guidelines |
| `/itineraries` | **Itineraries**: Four curated routes (from 7-day highlights to comprehensive 21-day journeys) |
| `/plan` | **Practical Guide**: Monsoons, visa guidelines, currency, transport, and emergency info |
| `/gallery` | **Gallery**: Curated high-resolution photography with full-screen viewer |
| `/guestbook` | **Guestbook**: Interactive visitor reviews and star ratings |
| `/contact` | **Contact**: Message portal, official diplomatic and emergency contact points |
| `/api/health` | **Health check**: System and database connectivity check (`{ ok, storage }`) |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **3D Graphics & Shaders:** [Three.js](https://threejs.org/) with custom WebGL GLSL shaders
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Fallback Data Store:** Local atomic JSON storage (when running without PostgreSQL)
- **Typography:** Self-hosted fonts via `@fontsource` (*Abhaya Libre*, *Gemunu Libre*, *Yaldevi*, *Noto Sans Tamil*)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20.9+** (Check version with `node -v`)
- **npm** or **pnpm** / **yarn**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/shehan-dev09/serendib-sri-lanka.git
cd serendib-sri-lanka

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Database:** You don't need a database to run the site locally. If `DATABASE_URL` is omitted, visitor notes are automatically stored locally in `.data/serendib.json`. For production deployments with PostgreSQL (e.g. Neon), refer to [DEPLOY.md](./DEPLOY.md).

---

## 📜 Available Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `npm run dev` | Starts local Next.js development server with hot reload |
| `build` | `npm run build` | Builds optimized production bundle |
| `start` | `npm run start` | Runs the production build locally |
| `lint` | `npm run lint` | Runs ESLint analysis |
| `typecheck` | `npm run typecheck` | Validates TypeScript types across the project |
| `build-terrain` | `node scripts/build-terrain.mjs` | Rebuilds the satellite terrain tiles in `public/terrain/` (pre-built assets included) |

---

## 🌿 Data & Media Attribution

- **3D Satellite & Elevation:** Sentinel-2 cloudless 2016 imagery by EOX IT Services GmbH (CC BY 4.0; contains modified Copernicus Sentinel data 2016 & 2017). Elevation and bathymetry from AWS Open Data Terrain Tiles (SRTM & ETOPO1).
- **Photography:** Photography contributed by creators on [Pexels](https://www.pexels.com), referenced with full credits in `src/lib/photos.ts`.

---

## 📄 License

This project is open-source and available under the [MIT License](./LICENSE).

---

Developed by **Shehan Nadeesha**
