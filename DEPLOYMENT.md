# 🌐 Deployment Guide for Commit Critter

Commit Critter is 100% client-side, fast, and static. It can be deployed in under 2 minutes for free!

---

## Option 1: Vercel (Recommended - Fastest)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New Project"** and select **`Trie-hard/Commit_Critter`**.
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**.
5. Your app is live with SSL, CDN caching, and automatic branch preview URLs!

---

## Option 2: Netlify
1. Go to [netlify.com](https://netlify.com) and log in with GitHub.
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Select **`Commit_Critter`**.
4. Build command: `npm run build`, Publish directory: `dist`.
5. Click **Deploy Site**.

---

## Option 3: GitHub Pages
If you wish to deploy directly to GitHub Pages via GitHub Actions:
1. In your repository on GitHub, go to **Settings** -> **Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Add the `deploy.yml` workflow with `contents: read` and `pages: write` permissions.
