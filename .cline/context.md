Jasne — poniżej masz **czysty tekst Markdown**, **bez code blocków**, **bez potrójnych backticków**, tak żeby **nic się nie „psuło” w widoku** i żebyś mógł to wkleić bezpośrednio jako plik `.md`.

---

# Global Project Context (Must Always Be Respected)

This repository is a production-grade company website built with
**Astro + React (Islands) + Astro Scoped Styles + Sanity + Netlify**.

The project follows an **HTML-first, Static Site Generation (SSG)** architecture.
All changes must preserve existing behavior, UI/UX, SEO, i18n logic, and Sanity authoring workflows unless explicitly instructed otherwise.

This file defines **non-negotiable global rules** for all work done in this repository.

---

## Technology Stack

* **Framework**: Astro (Static Site Generation – SSG)
* **UI / Interactivity**: React (Astro Islands only)
* **Language**: JavaScript only

  * No TypeScript
  * Use .js, .jsx, .astro
* **Styling**:

  * **Astro Scoped Styles (<style> in .astro) are the default**
  * Classic CSS (scoped or global)
  * CSS variables / design tokens for consistency
  * **styled-components are deprecated and must not be used for new work**
* **CMS**: Sanity

  * sanity/ directory is Sanity Studio (separate project)
  * Existing schemas are the source of truth
* **Hosting**: Netlify

  * Static output (SSG)
  * Rebuild triggered via Netlify Build Hook on Sanity publish

---

## Core Architectural Rules

### Astro (Primary Layer)

Astro is the **owner of the page and HTML output**.

Astro is responsible for:

* Routing (file-based, src/pages)
* Layout composition
* Build-time data fetching
* SEO-critical HTML generation
* Rendering CMS content (Sanity) to static HTML

Rules:

* src/pages/ **must contain only .astro files**
* No React Router for primary routing
* No SPA shell
* Pages must render meaningful HTML without client-side JS

---

### React (Islands Only)

React is used **only where interactivity is required**.

Rules:

* React components are **Astro Islands**
* Hydration must be explicit (client:*)
* No React SPA lifecycle assumptions
* React must not control routing
* Prefer .astro components for static / presentational sections

---

## Styling Rules (Critical)

### Default Styling Strategy

* **Astro scoped styles are the default and preferred solution**
* Styles live in the same .astro file as the markup they style
* Styles are scoped automatically by Astro (no global leakage)
* No runtime styling for static content

For shared styling and consistency across pages/components:

* Use design tokens in: `src/styles/tokens.css`
* Use global base styles/reset in: `src/styles/global.css`

For React islands (interactive components):

* Use **CSS Modules** (`Component.module.css`) + `className`
* Avoid global class leakage from islands

---

### styled-components Policy

* **styled-components are deprecated and must be removed from the codebase**
* Do NOT introduce new styled-components
* Do NOT refactor Astro components to use styled-components
* **Migrate existing styled-components to CSS (Astro scoped styles, global CSS, or CSS Modules)**
* All new sections and refactors must use:

  * Astro scoped styles
  * or shared CSS (tokens, utilities)

styled-components must **never** be used for:

* CMS content
* Typography
* Layout
* Page sections
* SEO-critical markup

---

## Directory Structure (Authoritative)

src/
├── pages/        (Astro routing ONLY – .astro)
├── layouts/      (Astro layouts – .astro)
├── components/
│   ├── ui/       (Astro UI primitives: Section, Container, PageHeader)
│   ├── sections/ (Reusable Astro sections)
│   ├── islands/  (React interactive components – explicit islands)
│   └── portable/ (Sanity Portable Text rendering)
├── hooks/        (React hooks – islands only)
├── context/      (React context providers – islands only)
├── lib/
│   ├── sanity/   (Sanity client, queries, api)
│   ├── i18n/     (Language resolution and routing helpers)
│   └── seo/      (SEO helpers – meta, sitemap)
├── styles/
│   ├── tokens.css   (Design tokens: colors, spacing, typography)
│   └── global.css   (Global resets and base styles)
├── utils/
└── data/

---

## Routing Rules (Critical)

* **Astro routing only**
* URLs are defined by files in src/pages
* React Router must NOT be used
* React components are never routes
* src/pages must never contain:

  * .jsx pages
  * SPA logic
  * application state

---

## Sanity Rules (Very Important)

### Sanity Studio

* sanity/ is not part of the frontend
* Do not restructure Sanity Studio unless explicitly instructed
* Do not break authoring workflows

### Frontend Sanity Integration

Must live in:
src/lib/sanity/

Responsibilities:

* client.js – Sanity client initialization
* config.js – projectId, dataset, apiVersion, useCdn
* queries.js – GROQ queries
* api.js – data-fetching functions
* image.js – image URL builder
* i18n.js – language helpers if needed

Rules:

* Pages and components must fetch data **only via lib/sanity**
* Do not inline GROQ queries in components
* CMS content must be rendered to HTML at build time whenever possible

---

## CMS Content Styling Rule

* CMS content must be rendered as semantic HTML (h1–h6, p, ul, etc.)
* Styling is done via:

  * scoped CSS
  * or dedicated content containers (e.g. .content, .rich-text)
* No runtime styling for CMS content
* No styled-components for PortableText

SEO depends on **HTML presence**, not styling method.

---

## i18n Rules

* Existing i18n behavior is non-negotiable
* URL model must remain unchanged
* Language resolution is centralized in:
  src/lib/i18n/

Rules:

* Astro controls language routing
* React may consume language context
* Do not introduce a new i18n strategy

---

## Public Assets Rules

* public/ is the single source of truth for static assets
* Assets must be referenced via absolute URLs:

  * /images/…
  * /videos/…
* dist/ is build output only and must never be treated as source

---

## Netlify Rules

* Netlify Functions live only in:
  netlify/functions/

Rules:

* No SPA fallback redirects
* Environment variables must be build-time safe

---

## React Code Quality Rules

* React is for **interaction**, not layout
* Components must be:

  * small
  * predictable
  * accessible
* Avoid unnecessary state
* Side effects only in useEffect
* Browser APIs only inside effects or client:*

---

## Non-Negotiable Rules

* No TypeScript
* No UI/UX changes unless requested
* No i18n or URL changes
* No breaking Sanity authoring workflows
* No SPA routing
* No styled-components for new work
* Write code and documentation only in English

---

This file is the **single source of truth** for project structure and architectural rules.
All future work must comply with it unless explicitly overridden.

---