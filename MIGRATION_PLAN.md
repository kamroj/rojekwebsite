# Migration plan: React (Vite) -> Astro (SSG) + React Islands

Cel: migracja do Astro w trybie **SSG (static output)**, tak aby:

- routing był po stronie Astro (`src/pages/*.astro`)
- treść była generowana jako HTML w buildzie (SEO; widoczne w View Source)
- interaktywne elementy pozostały w React jako islands (`client:*`)
- zachować 1:1 UI/UX, URL i i18n

> This file started as a pure plan/audit, but during the migration we also keep a short **implementation log** here.
> This is intentional: I often work across multiple separate tasks, and this log makes it easy to continue where we left off.

---

## 0) Migration progress (implementation log)

### Completed (so far)

- ✅ **Astro routing structure created** (`src/pages/**/*.astro`) for PL (no prefix), EN (`/en`), DE (`/de`) including products category/detail routes.
- ✅ **React islands bridge added**: `src/views/AstroIslandView.jsx` + per-view island wrappers in `src/components/_astro/islands/*` (used by `src/components/_astro/islands-with-resources/*`) to render legacy React views inside Astro pages.
- ✅ **styled-components fully removed** (no dependency in `package.json`, no imports in the codebase). Styling uses CSS Modules / global CSS.
- ✅ **Router-agnostic navigation implemented**:
  - `src/components/_astro/RouterAgnosticLink.jsx`
  - `Header`, `LanguageSwitcher`, `AppBreadcrumbs` can work with or without React Router context.
- ✅ **Global Astro layout restored**: `src/layouts/SiteLayout.astro` now renders `Header` + `Footer` as React islands for every Astro page.
- ✅ **Astro build fixed and verified**:
  - `Header.jsx` no longer imports images from `/images/...` (Astro assets pipeline). It uses URL strings to files in `/public`.
  - `npm run build` succeeds.
- ✅ **SSR-safety improvement**: `src/utils/index.js` no longer uses `window.innerWidth` as an unguarded default parameter (prevents SSR/build crashes).

- ✅ **Sanity integration tightened**:
  - Fixed `@sanity/image-url` deprecation by using `createImageUrlBuilder` (no default export).
  - Added Astro dev proxy for `/api/sanity/*` in `astro.config.mjs` to avoid CORS locally.

- ✅ **Netlify/SSG cleanup**:
  - Added `src/pages/404.astro`.
  - Removed SPA fallback redirects (`public/_redirects`).
  - Added docs: `SANITY_NETLIFY_REBUILD.md`.

- ✅ **ESM/SSG hardening**:
  - Removed/avoided Node ESM “directory imports” like `../constants` and `../data/products` in runtime code.
  - Updated multiple files to import explicitly from `../constants/index.js` and `../data/products/index.js`.
  - Made `src/lib/i18n/resources.js` build-safe (translation files are resolved correctly during `astro build`).

- ✅ **Products SEO metadata (SSG HTML)**:
  - Added helper `src/lib/seo/productsMeta.js`.
  - Category + product detail pages now render dynamic `<title>` + `<meta name="description">` (PL/EN/DE) in static HTML.

- ✅ **Islands code-splitting**:
  - Replaced the single `ViewIsland` mega-bundle with per-view island wrappers in `src/components/_astro/islands/*`.
  - `ViewIslandWithResources.astro` now lazy-loads the needed island via `import.meta.glob`, reducing initial JS payload.

- ✅ **HTML-first footer**:
  - Footer is rendered SSR-only (no hydration) to reduce JS.

### Known notes / warnings

- `npm run preview` does not work with `@astrojs/netlify` (expected limitation).
- Vite warns that some chunks are large (not a functional issue; can be optimized later by code-splitting islands like `ViewIsland`).

---

## 1) Audyt: aktualne URL-e i routing

### 1.1. Model języków w URL (routing)

Zgodnie z `src/router/index.jsx` i `src/lib/i18n/routing.js`:

- **Domyślny język: `pl`**
  - **bez prefixu w URL**
  - przykłady: `/`, `/produkty`, `/realizacje`
- Języki dodatkowe: `en`, `de`
  - **z prefixem w URL**
  - przykłady: `/en`, `/en/products`, `/de/referenzen`

Zachowanie 1:1 do utrzymania w Astro.

### 1.2. Aktualne sekcje (top-level) i slugi per język

Źródło: `src/lib/i18n/routing.js` (`SECTION_SLUGS`).

| Sekcja (klucz) | pl (bez prefixu) | en (`/en`) | de (`/de`) |
|---|---|---|---|
| home | `/` | `/en` | `/de` |
| products | `/produkty` | `/en/products` | `/de/produkte` |
| realizations | `/realizacje` | `/en/realizations` | `/de/referenzen` |
| about | `/o-firmie` | `/en/about-us` | `/de/ueber-uns` |
| contact | `/kontakt` | `/en/contact` | `/de/kontakt` |
| hsConfigurator | `/konfigurator-hs` | `/en/hs-configurator` | `/de/hs-konfigurator` |

### 1.3. Produkty: URL-e kategorii i detalu

Źródła:

- router: `src/router/index.jsx`
  - produkty: `/{productsSlug}`
  - kategoria: `/{productsSlug}/:category`
  - detal: `/{productsSlug}/:category/:productId`
- mapowanie slugów: `src/lib/i18n/routing.js` (`CATEGORY_SLUGS`)

Aktualny model:

- Category to *slug zależny od języka*, ale mapowany do wspólnego `categoryKey` (`okna`, `drzwi`, `bramy`, `rolety`).
- `productId` jest **niezależny od języka** (slug/id produktu).

#### Kategorie (slug per język)

| categoryKey | pl | en | de |
|---|---|---|---|
| okna | `okna` | `windows` | `fenster` |
| drzwi | `drzwi` | `doors` | `tueren` |
| bramy | `bramy` | `gates` | `garagentore` |
| rolety | `rolety` | `shutters` | `rolllaeden` |

#### Przykłady URL

- PL:
  - lista kategorii: `/produkty/okna`
  - detal: `/produkty/okna/pava`
- EN:
  - lista kategorii: `/en/products/windows`
  - detal: `/en/products/windows/pava`
- DE:
  - lista kategorii: `/de/produkte/fenster`
  - detal: `/de/produkte/fenster/pava`

### 1.4. 404 i SPA fallback

Aktualnie Netlify ma SPA fallback w `public/_redirects`:

```
/*    /index.html   200
/en/* /index.html 200
/de/* /index.html 200
```

W Astro SSG docelowo to usuwamy (w kroku 8) i dodajemy `src/pages/404.astro`.

---

## 2) Audyt: i18n (jak wybierany jest język i mapowanie)

### 2.1. i18next runtime

Źródło: `src/i18n.js`.

- `supportedLngs`: `['pl','en','de']`
- `fallbackLng`: `pl`
- detekcja: `order: ['path','localStorage','navigator','htmlTag','subdomain']`
  - **path ma pierwszeństwo**, więc URL (`/en/...`, `/de/...`) steruje językiem.
- cache: `localStorage`

### 2.2. Sync języka z routem

Źródło: `src/router/I18nRouteSync.jsx`.

- dla trasy zdefiniowanej jako `path: '/'` ustawiany jest `lang="pl"` (bez prefixu)
- dla `/en` i `/de` analogicznie `lang="en" | "de"`
- komponent w `useEffect` robi `i18n.changeLanguage(routeLang)`

### 2.3. Tłumaczenie ścieżek przy przełączaniu języka

Źródła:

- `src/components/shared/LanguageSwitcher.jsx` używa `translatePathname(location.pathname, targetLang)`
- implementacja: `src/lib/i18n/routing.js` (`translatePathname`)

Zachowanie:

- przełącznik języka próbuje zachować *ten sam widok*, tłumacząc:
  - prefix języka (`/en`, `/de`)
  - slugi sekcji (`/produkty` -> `/en/products`)
  - slugi kategorii produktów (`/okna` -> `/en/windows`)
- `productId` nie jest tłumaczony

---

## 3) Audyt: Sanity (typy dokumentów, slugi, zależność od języka)

### 3.1. Typy dokumentów w Sanity Studio

Źródło: `sanity/schemaTypes/index.js`.

Dokumenty:

- `homePage` (singleton)
- `aboutPage` (singleton)
- `contactPage` (singleton)
- `productCategory`
- `product`
- `partner`
- `teamMember`
- `tag`
- `realization`

Ważne dla i18n: `sanity/schemaTypes/l10n.js`:

- pola zlokalizowane jako obiekty `{ pl, en, de }`:
  - `localizedString`, `localizedText`, `localizedBlockContent`

### 3.2. Slugi i strony contentowe

Aktualnie w frontendzie (React SPA):

- **okna** (kategoria `okna`) pobierane z Sanity:
  - lista: `fetchWindowProductsList(lang)`
  - detal: `fetchWindowProductDetail(slug, lang)`
  - query: `*[_type == "product" && category._ref == "category_okna"]` (lista)
  - query: `*[_type == "product" && slug.current == $slug][0]` (detal)
  - `slug` to `slug.current` (niezależny od języka)
  - opisy/tresc są zlokalizowane (np. `shortDescription`, `longDescription`) i wybierane przez helper `pickLocale`.

Pozostałe kategorie (np. `drzwi`) są obecnie zasilane głównie danymi lokalnymi (`src/data/products/*`).

W migracji do Astro SSG:

- strony produktowe z Sanity mają być generowane w buildzie (`getStaticPaths`), minimum:
  - dla okien: generacja `/.../okna/<slug>` + warianty językowe URL
  - docelowo analogicznie dla innych content types, jeśli będą użyte.

### 3.3. Portable Text

Render Portable Text jest w `src/components/portable/SanityPortableText.jsx` (React, `@portabletext/react`).

W SSG plan: ten renderer pozostaje i jest używany w island (jeżeli musi), albo przenosimy render do server-side w Astro (preferowane dla SEO), ale **bez zmiany wyglądu**.

---

## 4) Audyt: komponenty interaktywne (React islands) i użycia window/document

### 4.1. Kluczowe interakcje / islands

Na podstawie aktualnego kodu (m.in. `src/components/shared/*`, `src/views/*`):

**Zdecydowanie interaktywne (React islands):**

- `src/components/shared/Header.jsx`
  - menu mobilne, scroll hide/show, blokada scrolla, ESC
- `src/components/shared/Navigation.jsx`
  - mega menu, hover intent, portal (`document.body`), fetch listy okien
- `src/components/shared/LanguageSwitcher.jsx`
  - dropdown, `document.addEventListener`, nawigacja
- `src/components/shared/ScrollToTop.jsx`
  - scroll restore, `window.scrollTo`, `document.body.style`
- `src/components/ui/LoadingScreen.jsx` + `src/layouts/MainLayout.jsx`
  - overlay loading, blokada scrolla, timery

**Interaktywne sekcje (często client:visible):**

- `src/components/sections/home/IntroSection.jsx`
  - video + play/pause, dynamiczny tekst (timer), `window.visualViewport`
- `src/components/sections/realizations/RealizationsGallery.jsx`
  - Swiper + eventy `document.addEventListener('mouseup', ...)`
- `src/views/RealizationsView.jsx` i `src/views/Realizations2View.jsx`
  - filtry/paginacja, `window.scrollTo`, `document` listenery
- `src/views/HsConfiguratorView.jsx`
  - `@react-three/fiber` / WebGL (heavy widget)
- `react-select` (w `Realizations2View.jsx`): `menuPortalTarget={document.body}`

### 4.2. Użycia window/document (ryzyko SSR)

W repo istnieje dużo odwołań do `window`/`document` (150 wyników w `src/`), m.in.:

- `src/main.jsx` (AOS init, scrollRestoration)
- `src/layouts/MainLayout.jsx` (body styles + scroll)
- `src/components/shared/Header.jsx`, `Navigation.jsx`, `LanguageSwitcher.jsx`
- `src/components/ui/LoadingScreen.jsx`
- `src/components/sections/home/IntroSection.jsx`
- `src/views/RealizationsView.jsx`, `Realizations2View.jsx`
- `src/utils/index.js` ma default parametry `width = window.innerWidth` (ryzyko w SSR jeśli importowane server-side)

W Astro:

- komponenty z browser APIs muszą być:
  - przeniesione do `useEffect` (jeśli nie są)
  - i/lub wyrenderowane jako `client:*` islands
  - unikamy `client:only` chyba że absolutnie konieczne.

---

## 5) Docelowe mapowanie route -> Astro pages

Wszystkie poniższe pliki będą w `src/pages` i będą `.astro`.

### 5.1. PL (bez prefixu)

| URL | Astro file | Źródło treści |
|---|---|---|
| `/` | `src/pages/index.astro` | sekcje home (część statyczna + ewentualnie Sanity później) |
| `/realizacje` | `src/pages/realizacje.astro` | aktualnie lokalne dane (React), docelowo możliwy Sanity |
| `/o-firmie` | `src/pages/o-firmie.astro` | aktualnie tłumaczenia lokalne; w Sanity istnieje `aboutPage` |
| `/kontakt` | `src/pages/kontakt.astro` | aktualnie tłumaczenia lokalne; w Sanity istnieje `contactPage` |
| `/konfigurator-hs` | `src/pages/konfigurator-hs.astro` | heavy React widget |
| `/produkty` | `src/pages/produkty/index.astro` | statyczne kafelki |
| `/produkty/[category]/index.astro` | `src/pages/produkty/[category]/index.astro` | lista produktów (częściowo Sanity dla okien) |
| `/produkty/[category]/[productId].astro` | `src/pages/produkty/[category]/[productId].astro` | detal (Sanity dla okien, lokalne dla reszty) |

### 5.2. EN (prefix `/en`)

| URL | Astro file |
|---|---|
| `/en` | `src/pages/en/index.astro` |
| `/en/realizations` | `src/pages/en/realizations.astro` |
| `/en/about-us` | `src/pages/en/about-us.astro` |
| `/en/contact` | `src/pages/en/contact.astro` |
| `/en/hs-configurator` | `src/pages/en/hs-configurator.astro` |
| `/en/products` | `src/pages/en/products/index.astro` |
| `/en/products/[category]/index.astro` | `src/pages/en/products/[category]/index.astro` |
| `/en/products/[category]/[productId].astro` | `src/pages/en/products/[category]/[productId].astro` |

### 5.3. DE (prefix `/de`)

| URL | Astro file |
|---|---|
| `/de` | `src/pages/de/index.astro` |
| `/de/referenzen` | `src/pages/de/referenzen.astro` |
| `/de/ueber-uns` | `src/pages/de/ueber-uns.astro` |
| `/de/kontakt` | `src/pages/de/kontakt.astro` |
| `/de/hs-konfigurator` | `src/pages/de/hs-konfigurator.astro` |
| `/de/produkte` | `src/pages/de/produkte/index.astro` |
| `/de/produkte/[category]/index.astro` | `src/pages/de/produkte/[category]/index.astro` |
| `/de/produkte/[category]/[productId].astro` | `src/pages/de/produkte/[category]/[productId].astro` |

> Uwaga: `[category]` w Astro będzie trzymać slug językowy (`windows`, `fenster`, itd.), ale w build-time będziemy go mapować na `categoryKey` przez istniejące mapy (`CATEGORY_SLUGS_INV`).

---

## 6) Plan islands (dyrektywy hydration)

Poniżej wstępny przydział (do weryfikacji po uruchomieniu Astro SSR/SSG):

### 6.1. client:load (krytyczne UI globalne)

- `Header` (`src/components/shared/Header.jsx`) – menu, scroll behavior
- `Navigation` (`src/components/shared/Navigation.jsx`) – megamenu + fetch
- `LanguageSwitcher` (`src/components/shared/LanguageSwitcher.jsx`) – dropdown + zmiana języka
- `ScrollToTop` (`src/components/shared/ScrollToTop.jsx`) – zachowanie scrolla
- `MainLayout`/overlay: jeśli zachowujemy loader 1:1 jako React, to wrapper layoutu też jako island

### 6.2. client:visible (poniżej fold / animacje / sekcje)

- `IntroSection` (video + dynamic text) – jeśli jest above the fold, rozważyć `client:load` dla braku migotania
- `RealizationsGallery` (Swiper)
- sekcje z animacjami/sliderami

### 6.3. client:idle / client:visible (heavy)

- `HsConfiguratorView` (`@react-three/fiber`) – preferowane `client:idle` lub `client:visible`

### 6.4. client:only="react" (tylko jeśli konieczne)

Kandydaci, jeśli SSR będzie problematyczne:

- komponenty, które muszą odwoływać się do `window`/`document` przed mountem
- `react-select` z portalem do `document.body` (w `Realizations2View.jsx`)

Zasada: używać selektywnie, nie masowo.

---

## 7) Plan SSG dla slugów (Sanity + i18n)

### 7.1. Produktowe strony dynamiczne

Docelowo dynamiczne strony będą realizowane przez `getStaticPaths()` w Astro.

Minimalny zakres (na podstawie obecnego runtime):

- okna z Sanity:
  - pobierz listę produktów: `*[_type=="product" && category._ref=="category_okna"]{ "slug": slug.current }`
  - wygeneruj ścieżki dla wszystkich języków URL:
    - PL: `/produkty/okna/<slug>`
    - EN: `/en/products/windows/<slug>`
    - DE: `/de/produkte/fenster/<slug>`
  - podczas renderu strony w Astro pobierz dane produktu dla danego `slug` + wybierz locale (`pickLocale` / analog)

### 7.2. Mapowanie category slug -> categoryKey

W build-time:

- `params.category` to slug językowy
- mapujemy go do `categoryKey` przez `CATEGORY_SLUGS_INV[lang][slug]`
- dzięki temu zachowujemy 1:1 URL i jednocześnie używamy spójnych danych wewnętrznych.

### 7.3. Uwaga o Sanity client w build-time

Obecny `src/lib/sanity/client.js` zawiera logikę dev proxy opartą o `window.location.origin`.

W Astro SSG musimy:

- zapewnić build-time client bez zależności od `window`
- dev proxy (jeśli dalej potrzebne) rozwiązać po stronie Astro/Netlify dev, ale bez łamania SSG.

To będzie zrobione w kroku 5 (centralizacja API w `src/lib/sanity/api.js` i `src/lib/sanity/queries.js`).

---

## 8) Netlify + Sanity rebuild hook (wariant A)

Stan obecny:

- `netlify.toml` ma już:
  - build: `npm run build`
  - publish: `dist`
- SPA fallback jest w `public/_redirects`

Plan docelowy (krok 8):

1) Usunąć SPA fallback redirecty.
2) Dodać `src/pages/404.astro`.
3) Utworzyć Netlify Build Hook.
4) W Sanity Studio dodać webhook na publish/update, który uderza w Build Hook.
5) Spisać procedurę w `SANITY_NETLIFY_REBUILD.md`.

---

## 9) Ryzyka / rzeczy do pilnej weryfikacji podczas migracji

1) Dużo `window/document` w kodzie – w Astro SSR będzie wymagało islands / refaktorów do `useEffect`.
2) `src/utils/index.js` ma default param `window.innerWidth` – jeśli importowane przez `.astro` / server-side, to wywali build.
3) `Sanity client` ma logikę dev opartą o `window.location.origin`.
4) `public/_redirects` trzeba usunąć (po przejściu na SSG), inaczej będzie maskować 404 i może psuć SEO.
