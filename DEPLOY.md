# Deploying QSBS Facts

## Prerequisites

- Node.js >= 22.12.0
- npm

## Build

```bash
npm install
npm run build
```

Output goes to `dist/`.

## Cloudflare Pages

1. Connect your GitHub repo in the Cloudflare Pages dashboard
2. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `22` (set via environment variable `NODE_VERSION=22`)
3. Add custom domain `qsbsfacts.org` in the Pages project settings
4. Deploy

## Vercel

1. Import the GitHub repo in Vercel
2. Framework preset: **Astro**
3. Build settings are auto-detected:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Add custom domain `qsbsfacts.org` in project settings
5. Deploy

## Local Preview

```bash
npm run preview
```

Serves the built site at `http://localhost:4321`.

## Custom Domain DNS

Point `qsbsfacts.org` to your hosting provider:

- **Cloudflare Pages:** Add a CNAME record pointing to `<project>.pages.dev`
- **Vercel:** Add a CNAME record pointing to `cname.vercel-dns.com`
