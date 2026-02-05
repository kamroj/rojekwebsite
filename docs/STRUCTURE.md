# Project Structure

This repository contains a production website built with **Astro + React (islands) + CSS Modules / scoped CSS**.

Key areas:

- Astro routing: `src/pages/`
- React “views” (legacy SPA views, used as islands): `src/views/`
- Shared components / UI primitives / sections: `src/components/`
- Sanity frontend integration: `src/lib/sanity/`
- i18n + routing helpers: `src/lib/i18n/`
- Netlify Functions: `netlify/functions/`
- Static assets: `public/`

## Core Rules

### 1) Astro routing

- `src/pages/` contains **only** `.astro` files (and optionally Astro endpoints).
- React pages **must not** live in `src/pages/`.

### 2) React “views”

Legacy React pages/views live in:

- `src/views/` (e.g. `HomeView.jsx`, `ProductDetailView.jsx`)

In Astro they are rendered as **islands** via the bridge components.

### 3) Components

React components are organized in:

- `src/components/shared/` – shared elements (Header/Footer/Navigation, etc.)
- `src/components/ui/` – UI primitives (Section, Page, Pagination, etc.)
- `src/components/portable/` – Sanity PortableText rendering
- `src/components/sections/**` – larger page sections (home sections, realizations, product detail sections)

### 4) Sanity (frontend runtime)

Frontend Sanity integration (data fetching, helpers) lives in:

- `src/lib/sanity/`

Note: the top-level `sanity/` directory is **Sanity Studio** and should not be restructured unless explicitly requested.

### 5) i18n / routing helpers

i18n routing helpers live in:

- `src/lib/i18n/routing.js`

`src/i18n.js` remains the i18next entry point.

### 6) Netlify Functions

- Netlify Functions live in `netlify/functions/`.
- Endpoints are available under `/.netlify/functions/<name>`.

### 7) Assets

- Static assets live in `public/` and are referenced via absolute paths like `/images/...`, `/videos/...`, `/models/...`, `/locales/...`.
- `dist/` is **build output only** (never treat it as a source of assets).
