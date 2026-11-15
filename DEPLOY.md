# Hosting Tutorial — Put Serendib Online for Free

This guide takes you from the project on your computer to a public website, without paying anything. No server experience is needed.

> **Free-tier details checked in November 2026.** Free plans change, so look at each provider's pricing page before relying on a limit.

---

## Contents

1. [Which free option should I pick?](#1-which-free-option-should-i-pick)
2. [Before you start (all options)](#2-before-you-start-all-options)
3. [Step A — Put the code on GitHub](#step-a--put-the-code-on-github)
4. [Step B — Create a free database on Neon](#step-b--create-a-free-database-on-neon)
5. [Option 1 — Vercel (recommended)](#option-1--vercel-recommended)
6. [Option 2 — Render](#option-2--render)
7. [Option 3 — Netlify](#option-3--netlify)
8. [After deploying: check everything works](#after-deploying-check-everything-works)
9. [Add your own domain name](#add-your-own-domain-name)
10. [Updating the site later](#updating-the-site-later)
11. [Troubleshooting](#troubleshooting)

---

## 1. Which free option should I pick?

The site has two parts:

- **The website itself** (Next.js) — runs on a hosting service.
- **The database** for guestbook notes, contact messages and newsletter sign-ups. It runs on a database service.

> ⚠️ **Why you need a database online.** On your computer, notes are saved to a JSON file if there's no database. Free hosts **don't keep files** your site writes: Vercel and Netlify run it as short-lived serverless functions, and Render wipes its disk on every restart. Online, notes saved to a file would disappear. Connect a free PostgreSQL database and they are kept forever.

| | **Vercel + Neon** ⭐ | **Render + Neon** | **Netlify + Neon** |
| --- | --- | --- | --- |
| Cost | Free | Free | Free |
| Made by | The company behind Next.js | Render | Netlify |
| Speed of first visit | Fast | **Slow after idle** (server sleeps after 15 min; ~1 min to wake) | Fast |
| Setup difficulty | Easiest | Easy | Easy |
| Main free-tier catch | Personal / non-commercial use only | Sleeping server | Monthly usage credits |

**Recommendation:** use **Vercel + Neon**. It's the simplest setup and has no sleeping server.

**Why Neon for the database?**

- Its free plan is permanent: no credit card and no expiry.
- You get 1 GB of storage per project, far more than this site will ever need.
- The database pauses after 5 minutes without use. The first visit after a pause takes a moment longer while it wakes.

Avoid Render's own free PostgreSQL for this project: it is **deleted after 30 days**.

---

## 2. Before you start (all options)

You need:

- [ ] The project folder on your computer
- [ ] **Node.js 20.9+** installed (`node -v`)
- [ ] **Git** installed (`git --version`). Download it from <https://git-scm.com> if needed.
- [ ] A free **GitHub** account: <https://github.com/signup>

Check that the project builds on your machine first. It's much easier to fix problems here than online.

```bash
npm install
npm run build
```

If the build finishes with `✓ Compiled successfully`, you're ready.

---

## Step A — Put the code on GitHub

All three hosts deploy straight from a GitHub repository, and redeploy automatically every time you push.

1. Go to <https://github.com/new>.
2. Name it, e.g. `serendib-sri-lanka`. Choose **Public** or **Private** (both work). **Don't** tick "Add a README"; the project already has one.
3. Click **Create repository**. GitHub shows a page of commands.
4. In a terminal, inside your project folder, run:

```bash
git init
git add .
git commit -m "Serendib — Sri Lanka showcase"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/serendib-sri-lanka.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

> 🔒 **Your secrets stay private.** The included `.gitignore` already keeps `.env`, `node_modules/`, `.next/` and `.data/` out of Git. Never commit your database password.

Refresh the GitHub page and your files should be there.

---

## Step B — Create a free database on Neon

1. Go to <https://neon.com> and click **Sign up**. Signing in with GitHub is quickest.
2. Create a project:
   - **Project name:** `serendib`
   - **Postgres version:** leave the default
   - **Region:** pick the one nearest your visitors, e.g. *Asia Pacific (Singapore)* for Sri Lanka and Asia, or *Europe (Frankfurt)* for Europe.
3. Click **Create project**.
4. On the project dashboard, click **Connect**. Copy the **connection string**. It looks like this:

```
postgresql://neondb_owner:AbC123xyz@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

5. Keep it somewhere safe; you'll paste it into your host in the next step. **This string contains your password**, so treat it like one.

**You don't need to create any tables.** The app creates `traveller_notes`, `messages` and `subscribers` automatically the first time it needs them.

*(Optional) To use Neon from your own computer too, put the same string in your local `.env` as `DATABASE_URL=...`.*

---

## Option 1 — Vercel (recommended)

1. Go to <https://vercel.com/signup> and choose **Continue with GitHub**.
2. Pick the **Hobby** (free) plan.
3. On the dashboard click **Add New… → Project**.
4. Find your `serendib-sri-lanka` repository and click **Import**. If it isn't listed, click **Adjust GitHub App Permissions** and give Vercel access to it.
5. On the configuration screen:
   - **Framework Preset:** Next.js (detected automatically)
   - **Root Directory:** `./`
   - **Build & Output Settings:** leave the defaults
6. Open **Environment Variables** and add:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | *your Neon connection string from Step B* |

7. Click **Deploy**. The build takes about 1–3 minutes.
8. When you see 🎉 **Congratulations**, click the preview to open your live site. The address looks like `https://serendib-sri-lanka.vercel.app`.

**Faster alternative: Neon from inside Vercel.** Instead of Step B, open your Vercel project → **Storage** → **Create Database** → **Neon**. Vercel creates the database and adds the connection variable for you. If the variable it creates isn't called `DATABASE_URL`, add a `DATABASE_URL` variable with the same value, then redeploy.

**Free-tier notes:**

- Hobby is for **personal, non-commercial** projects. A showcase like this fits.
- Vercel's limits are generous for a small site. You'll find them under **Settings → Usage** in your dashboard.

---

## Option 2 — Render

Render runs the site as a normal Node.js server.

1. Go to <https://render.com> and sign up with GitHub.
2. Click **New + → Web Service** and connect your repository.
3. Fill in the form:

   | Field | Value |
   | --- | --- |
   | **Name** | `serendib` |
   | **Region** | *nearest to your visitors (e.g. Singapore or Frankfurt)* |
   | **Branch** | `main` |
   | **Runtime** | Node |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm run start` |
   | **Instance Type** | **Free** |

4. Under **Environment Variables** add:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | *your Neon connection string* |
   | `NODE_VERSION` | `22` |

5. Click **Create Web Service** and watch the log until it says your service is live.
6. Your site is at `https://serendib.onrender.com` (or similar).

> 💤 **The free server sleeps.** After 15 minutes with no visitors it shuts down. The next visitor waits about a minute while it starts again. That's normal on the free plan.

> 🗄️ Don't use Render's own free PostgreSQL here. It is deleted after 30 days. Keep using Neon.

**Optional health check:** in **Settings → Health Check Path**, enter `/api/health`.

---

## Option 3 — Netlify

Netlify also supports Next.js, including Server Actions, with automatic setup.

1. Go to <https://app.netlify.com/signup> and sign up with GitHub.
2. Click **Add new site → Import an existing project → GitHub** and choose your repository.
3. Netlify detects Next.js. Leave the build command (`npm run build`) and the publish settings as they are.
4. Click **Add environment variables** and add `DATABASE_URL` = *your Neon connection string*.
5. Click **Deploy**. Your site appears at `https://something.netlify.app`. You can rename it under **Site configuration → Change site name**.

**Free-tier note:** Netlify's free plan gives a monthly allowance of usage credits. A small showcase site normally stays well inside it. You can check usage in your team's **Billing** page.

---

## After deploying: check everything works

Use this checklist on your live address (replace `YOUR-SITE`):

- [ ] **Health check.** Open `https://YOUR-SITE/api/health`. You should see:

  ```json
  { "ok": true, "storage": "postgres" }
  ```

  If it says `"storage": "file"`, the `DATABASE_URL` variable is missing. Go back to your host's environment variables, add it, and **redeploy**.

- [ ] **Home page.** It loads and the 3D island appears when you scroll.
- [ ] **Add a note.** Go to `/guestbook`, write a note and press **Add my note**. It should appear immediately, and still be there after a refresh.
- [ ] **A destination.** Open `/destinations/sigiriya` and add a note there too.
- [ ] **Contact form.** Send a test message from `/contact`.
- [ ] **Mobile.** Open the site on your phone.

You can see the saved data in **Neon → your project → Tables**.

---

## Add your own domain name

You can use the free address (`*.vercel.app`, `*.onrender.com`, `*.netlify.app`) forever. If you buy a domain such as `serendib-lanka.com` from any registrar:

- **Vercel:** Project → **Settings → Domains → Add**
- **Render:** Service → **Settings → Custom Domains → Add**
- **Netlify:** Site → **Domain management → Add a domain**

Each one shows the DNS records to add at your registrar. HTTPS certificates are created automatically and for free.

---

## Updating the site later

Every push to `main` redeploys automatically:

```bash
git add .
git commit -m "Describe your change"
git push
```

After about a minute or two the live site shows your change. To change the text content (places, dishes, festivals…), edit `src/lib/data.ts`.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Build fails with a Node.js version error | Next.js 16 needs Node 20.9+. On Render set `NODE_VERSION=22`; on Vercel check **Settings → General → Node.js Version**. |
| `/api/health` shows `"storage": "file"` | `DATABASE_URL` isn't set on the host. Add it under environment variables, then **redeploy**. Variables only apply to new deployments. |
| `/api/health` shows `"ok": false` | The connection string is wrong or the database is unreachable. Copy it again from Neon → **Connect**, keep `?sslmode=require` at the end, update the variable and redeploy. |
| Notes disappear after a while | You're on file storage on a free host. Connect Neon as described in Step B. |
| The first visit is slow | Normal on free tiers: Neon wakes the database after 5 idle minutes, and Render's free server wakes after 15. |
| Neon says the compute is suspended | You used up the month's free compute hours. It resets at the start of the next month. |
| Photos don't show | Photos load from the Pexels CDN (`images.pexels.com`). Check the visitor's network isn't blocking it. |
| The 3D map shows a flat image instead | The 3D terrain needs WebGL. Without it, or if the map data fails to load, a flat satellite map is shown automatically. Check that `public/terrain/` was committed to Git (about 2.3 MB). |
| The 3D map is slow on an old phone | It lowers its resolution automatically. Very old devices may still find it heavy; everything else on the site works regardless. |
