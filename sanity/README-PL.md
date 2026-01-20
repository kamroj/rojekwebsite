# Sanity Studio (rojekwebsite) — instrukcja

## Uruchomienie Studio

```bash
cd sanity
npm run dev -- --host localhost --port 3333
```

Otwórz: http://localhost:3333

## Układ panelu (lewy sidebar)

W `sanity/structure.js` panel jest ułożony dokładnie jak struktura Twojej strony:

1) **Strona główna**
2) **Produkty**
3) **Realizacje**
4) **O firmie**
5) **Kontakt**

Uwaga: na start celowo ukryliśmy dodatkowe kolekcje (np. Tag, Partnerzy, Zespół) z bocznego menu,
żeby panel był maksymalnie prosty. Jeśli będziesz chciał, mogę je dodać później jako osobne sekcje.

## Jak dodać kategorię „OKNA” i produkt „PAVA” (flow jak na stronie)

Kategorie są predefiniowane i już są w menu:
- Okna
- Okna przesuwne
- Drzwi zewnętrzne
- Okna i Drzwi przeciwpożarowe

1) Wejdź w **Produkty → Okna**.
2) Jeśli to pierwsze uruchomienie, uzupełnij **Ustawienia kategorii**.
3) Wejdź w **Produkty w tej kategorii** → **Create / Utwórz**.
4) Uzupełnij produkt (np. **PAVA**) w formularzu: 
   - Nazwa, slug
   - Krótki opis (PL/EN/DE)
   - Długi opis (PL/EN/DE)
   - Galeria zdjęć / wideo
   - Specyfikacja / zalety

> Ważne: jeśli tworzysz produkt z poziomu danej kategorii (np. **Produkty → Okna → Produkty w tej kategorii**),
> to pole **Kategoria** ustawia się automatycznie i jest zablokowane (żeby nie trzeba było wybierać jej ręcznie).

## Jak dodawać Realizacje

Wejdź w **Realizacje** i twórz wpisy typu **Realizacja (zdjęcie)**:
- Zdjęcie
- Tagi (opcjonalnie)

To jest celowo proste: realizacje = lista zdjęć + tagi.

### Predefiniowane grupy tagów
Tagi mają grupy (pod przyszłe filtry i różne języki):
- **Typ**
- **Kolor**
- **Zdobienie**

Każdy tag ma lokalizowaną etykietę (PL/EN/DE), więc w filtrach możesz pokazywać wartości w aktualnym języku.

## Gdzie edytować schematy

- Typy (schema): `sanity/schemaTypes/*.js`
- Lokalizacja pól (PL/EN/DE): `sanity/schemaTypes/l10n.js`
- Układ panelu (sidebar): `sanity/structure.js`

## Co commitować do Git

Commituj folder `sanity/` (to jest kod Studio + schematy).

Nie commituj sekretów (`.env`, tokeny), cache i `node_modules`.
