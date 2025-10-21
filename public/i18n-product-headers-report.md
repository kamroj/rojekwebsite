# Raport: ProductHeader / ProductHeaderSubtitle — miejsca z hardcoded tekstem

Data: 2025-10-21

Cel: Zmapować miejsca w repozytorium, gdzie komponenty `ProductHeader` i `ProductHeaderSubtitle` zawierają zahardcodowane napisy. Przygotować proponowane klucze i wskazówki do dodania do plików tłumaczeń (public/locales/{pl,en,de}/translation.json). Ten plik to raport — nie wprowadzono zmian w kodzie.

---

## Podsumowanie wykrytych wystąpień (pliki + fragmenty)

1) `src/components/home/WhyUsSection.jsx`  
- ProductHeader: "DLACZEGO MY"  
- ProductHeaderSubtitle: "Co odróznia nas od innych"  
- Proponowane klucze:
  - `sections.whyUs` (istnieje — używane już w AboutUsPage)
  - `aboutPage.headers.whyUsSubtitle` (dodać do PL/EN/DE)

Uwagi: AboutUsPage już używa `t('sections.whyUs')` i `aboutPage.headers.whyUsSubtitle` — warto ujednolicić użycie.

---

2) `src/components/home/ProducSection.jsx`  
- ProductHeader: "NASZE PRODUKTY"  
- ProductHeaderSubtitle: "Nowoczesność, styl, ekologia"  
- Proponowane klucze:
  - `sections.products` (istnieje)
  - `sections.productsSubtitle` (dodać do PL/EN/DE)

---

3) `src/components/home/PartnersSection.jsx`  
- ProductHeader: "PARTNERZY"  
- ProductHeaderSubtitle: "Firmy, z którymi współpracujemy"  
- Proponowane klucze:
  - `sections.partners` (istnieje)
  - `partners.subtitle` (dodać do PL/EN/DE)

---

4) `src/components/home/CompanyPresentationSection.jsx`  
- ProductHeader: "NASZA FIRMA"  
- ProductHeaderSubtitle (na ciemnym tle): "Poznaj nas od środka"  
- Proponowane klucze:
  - `company.title` (istnieje)
  - `company.subtitle` lub `presentation.subtitle` — proponuję `company.subtitle` (dodać do PL/EN/DE)

---

5) `src/components/gallery/RealizationsGallery.jsx`  
- ProductHeader: "REALIZACJE"  
- ProductHeaderSubtitle: "Zobacz nasze realizacje"  
- Proponowane klucze:
  - `sections.realizations` (istnieje)
  - `realizations.subtitle` (dodać do PL/EN/DE)  
Uwagi: istnieje `realizations.description`; `realizations.subtitle` będzie krótszym tekstem nagłówkowym.

---

6) `src/pages/ContactPage.jsx`  
- ProductHeader / ProductHeaderSubtitle — już zrefaktoryzowane (używają `t('contactPage.header.title')` itd.) — zmiana wykonana.

7) `src/pages/AboutUsPage.jsx`  
- Już zrefaktoryzowane (używają `t('sections.whyUs')`, `t('history.title')`, `aboutPage.headers.*`) — zmiana wykonana.

8) `src/pages/HomePage.jsx`  
- Tylko definicje styli `ProductHeader` i `ProductHeaderSubtitle` — brak tekstu do podmiany w tym pliku.

---

## Pliki zmodyfikowane wcześniej (już zrefaktoryzowane)
- `src/pages/ContactPage.jsx` — przeniesiono napisy do `contactPage.*` (PL/EN/DE dodane)
- `src/pages/AboutUsPage.jsx` — część nagłówków przeniesiona do i18n
- `src/components/home/IntroNavigation.jsx` — usunięto zahardcodowaną etykietę "oferta" (zastąpiono tłumaczeniem)

---

## Proponowany plan wdrożenia (po akceptacji)
1. Dodać brakujące klucze do plików tłumaczeń:
   - public/locales/pl/translation.json
   - public/locales/en/translation.json
   - public/locales/de/translation.json
   (klucze: aboutPage.headers.whyUsSubtitle, sections.productsSubtitle, partners.subtitle, company.subtitle, realizations.subtitle, itp.)
2. W każdym z plików wskazanych w raporcie zastąpić hardcoded teksty:
   - zamiana wewnątrz komponentów `ProductHeader` / `ProductHeaderSubtitle` na `t('...')`.
3. Uruchomić szybkie sprawdzenie (lint / build / npm run dev) aby zweryfikować brak błędów importów/tłumaczeń.
4. Przejść ręcznie po krytycznych stronach (Home, About, Contact, Realizations) aby potwierdzić poprawne wyświetlanie.

Wykonanie proponowanych zmian mogę przeprowadzić automatycznie etapami — po Twojej akceptacji.

---

## Pliki do zmiany (lista skrócona)
- src/components/home/WhyUsSection.jsx
- src/components/home/ProducSection.jsx
- src/components/home/PartnersSection.jsx
- src/components/home/CompanyPresentationSection.jsx
- src/components/gallery/RealizationsGallery.jsx

(Dodatkowo — ewentualne drobne użycia w innych komponentach, które wykryje kolejny skan.)

---

Jeśli chcesz, mogę teraz:
- A) Automatycznie wprowadzić zmiany (zamienić teksty na `t('...')` i dodać klucze do PL/EN/DE) — wykonam etapami i pokażę zmiany po każdym etapie. (zalecane)  
- B) Wygenerować plik patch / szczegółowy raport JSON/MD z liniami kodu do ręcznej akceptacji (bez wprowadzania zmian).  
- C) Zatrzymać się i tylko dostarczyć ten raport (co właśnie zrobiłem).

Wybierz A, B lub C. Jeżeli wybierzesz A, potwierdź że mogę edytować pliki i zapisać tłumaczenia w public/locales/*.
