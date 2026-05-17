# Bergara Demo Storefront

Demo e-commerce storefront for Bergara rifles, magazines, and accessories. Built with React, Vite, TypeScript, and Tailwind CSS.

## Project structure

| Path | Description |
|------|-------------|
| `store/` | React app (pages, design system, catalog UI) |
| `store/src/data/catalog.json` | Product catalog data |
| `assets/` | Source product images |
| `bergara.json` | Catalog source export |

## Getting started

```bash
cd store
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

Run from the `store/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (also regenerates sitemap) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Features

- Product listing, series pages, and product detail pages
- Predictive search, filters, and sort (alphabetical / price)
- Cart, checkout (demo), account (demo), Canada shipping & taxes
- SEO: sitemap, robots.txt, JSON-LD structured data

This is a **demo** storefront — no real payments or orders are processed.
