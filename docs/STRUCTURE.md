# Struktura projektu

Ten repozytorium zawiera aplikację **Astro + React + styled-components** z:

- routingiem po stronie Astro (folder `src/pages/`),
- „widokami” (React) w `src/views/`,
- komponentami współdzielonymi/UI/sekcjami w `src/components/`,
- integracją runtime Sanity (frontend) w `src/lib/sanity/`,
- helperami i18n/routingu w `src/lib/i18n/`,
- Netlify Functions w `netlify/functions/`,
- assetami statycznymi w `public/`.

## Najważniejsze zasady

### 1) Routing Astro

- `src/pages/` zawiera **wyłącznie** pliki `.astro` (oraz ewentualne endpointy Astro).
- Reactowe strony **nie** znajdują się w `src/pages/`.

### 2) React „strony”

Reactowe strony/widoki aplikacji znajdują się w:

- `src/views/` (np. `HomeView.jsx`, `ProductDetailView.jsx`)

### 3) Komponenty

Komponenty React zostały uporządkowane w:

- `src/components/shared/` – elementy współdzielone (header/footer/nawigacja, itp.)
- `src/components/ui/` – komponenty UI (Section, Page, Pagination, itp.)
- `src/components/portable/` – komponenty związane z PortableText (Sanity)
- `src/components/sections/**` – większe fragmenty strony (sekcje home, realizacje, detale produktów)

### 4) Sanity (frontend runtime)

Integracja runtime Sanity (czyli kod używany przez frontend do pobierania danych) jest w:

- `src/lib/sanity/`

> Uwaga: folder `sanity/` w root repo traktujemy jako Sanity Studio i nie przebudowujemy jego struktury.

### 5) i18n / routing helpery

Helpery routingu i18n są w:

- `src/lib/i18n/routing.js`

Plik `src/i18n.js` pozostaje entry pointem konfiguracji i18next.

### 6) Netlify Functions

- Funkcje Netlify trzymamy w `netlify/functions/`.
- Endpointy funkcji są dostępne standardowo pod `/.netlify/functions/<name>`.

### 7) Assets

- Statyczne assets są w `public/` i są dostępne pod ścieżkami typu `/images/...`, `/videos/...`, `/models/...`, `/locales/...`.
- `dist/` jest **wyłącznie** outputem builda (nie jest źródłem zasobów).
