# Serendib — Discover Sri Lanka

A showcase website about Sri Lanka for visitors from abroad: ancient cities, tea country, wildlife, beaches, food, festivals, suggested routes and practical travel advice. It has an interactive 3D model of the island, "liquid glass" panels, 3D effects that run as you scroll, and a solid-colour design based on traditional Kandyan art.

It only shows the island. There are no bookings and no payments.

| Document | What it's for |
| --- | --- |
| **README.md** (this file) | What the project is and how to run it on your computer |
| **[STUDY.md](./STUDY.md)** | The whole project explained, for learning how it works |

---

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, a 3D island tour driven by scrolling, highlights, season finder |
| `/destinations` | Draggable 3D island + 18 destinations with search and filters |
| `/destinations/[slug]` | A guide to each place, with visitor notes |
| `/experiences` | 10 signature experiences |
| `/culture` | History, UNESCO sites, festivals, crafts, etiquette, phrasebook |
| `/food` | Dishes, drinks, tea regions, spices |
| `/wildlife` | Animals, national parks, responsible travel |
| `/itineraries` | Four day-by-day routes |
| `/plan` | Travel guide: seasons, entry, transport, money, health, FAQ |
| `/gallery` | Photo gallery with a full-screen viewer |
| `/guestbook` | Visitors leave notes and ratings |
| `/contact` | General questions form, official sources, emergency numbers |
| `/api/health` | Health check (`{ ok, storage }`) |

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **three.js** for the 3D island
- **PostgreSQL** + **Drizzle ORM**, with an automatic **JSON-file fallback** when there is no database
- Self-hosted fonts via `@fontsource`: Abhaya Libre, Yaldevi and Gemunu Libre (all Sri Lankan type designs), plus Noto Sans Tamil

## Run it on your computer

You need **Node.js 20.9 or newer** (check with `node -v`).

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env

# 3. Start the development server
npm run dev
```

Open <http://localhost:3000>.

### Do I need a database?

**No — not to try it out.** Leave `DATABASE_URL` empty in `.env` and notes are saved to a JSON file in `./.data/serendib.json`. The site works fully.

**For anything online, yes.** Free hosts throw away files written at runtime, so put notes in PostgreSQL. Set `DATABASE_URL` to any PostgreSQL connection string: a local server, or a free cloud database such as Neon (see [DEPLOY.md](./DEPLOY.md)). The tables are **created automatically** on first use; you don't need to run a migration.

You can check which storage is active at `/api/health`:

```json
{ "ok": true, "storage": "postgres" }
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npx drizzle-kit push` | Optional: push `src/db/schema.ts` to the database manually |

## Content and photographs

- All text content lives in `src/lib/data.ts`, so you can edit places, dishes, festivals or routes there without touching any layout code.
- Photographs are real images from [Pexels](https://www.pexels.com) contributors, loaded from the Pexels CDN. They are listed with captions and credits in `src/lib/photos.ts`, and the credits are shown on `/gallery`.
- Travel facts such as visas, prices and opening hours change. The site points visitors to official sources; check the content before you publish.
