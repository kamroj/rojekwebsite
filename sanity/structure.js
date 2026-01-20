// sanity/structure.js
// Custom Desk Structure (left sidebar) to match the website IA (PL)
import React from 'react'

/**
 * @param {import('sanity/structure').StructureBuilder} S
 */
export const structure = (S) =>
  S.list()
    .title('Panel treści')
    .items([
      // --- Strona główna ---
      S.listItem()
        .title('Strona główna')
        .child(S.document().schemaType('homePage').documentId('homePage').title('Strona główna')),

      // --- Produkty ---
      S.listItem()
        .title('Produkty')
        .child(
          S.list()
            .title('Produkty')
            .items([
              // Kategorie są predefiniowane i mają stałe documentId.
              // Dzięki temu panel wygląda jak strona: Okna / Okna przesuwne / Drzwi zewnętrzne / Ppoż.
              categorySection(S, {
                id: 'category_okna',
                title: 'Okna',
                initialSlug: 'okna',
              }),
              categorySection(S, {
                id: 'category_okna_przesuwne',
                title: 'Okna przesuwne',
                initialSlug: 'okna-przesuwne',
              }),
              categorySection(S, {
                id: 'category_drzwi_zewnetrzne',
                title: 'Drzwi zewnętrzne',
                initialSlug: 'drzwi-zewnetrzne',
              }),
              categorySection(S, {
                id: 'category_ppoz',
                title: 'Okna i Drzwi przeciwpożarowe',
                initialSlug: 'okna-i-drzwi-przeciwpozarowe',
              }),

              // Jeśli kiedyś będziesz chciał dodać kolejne kategorie, możemy:
              // - dopisać tu kolejną sekcję,
              // - albo przywrócić listę „Kategorie produktów”.
            ])
        ),

      // --- Realizacje ---
      S.listItem().title('Realizacje').child(S.documentTypeList('realization').title('Realizacje')),

      // --- O firmie ---
      S.listItem().title('O firmie').child(S.document().schemaType('aboutPage').documentId('aboutPage').title('O firmie')),

      // --- Kontakt ---
      S.listItem().title('Kontakt').child(S.document().schemaType('contactPage').documentId('contactPage').title('Kontakt')),

      // Intencjonalnie: na start pokazujemy tylko 5 głównych pozycji,
      // żeby panel był maksymalnie prosty.
    ])

/**
 * Predefiniowana sekcja kategorii produktów.
 *
 * @param {import('sanity/structure').StructureBuilder} S
 * @param {{id: string, title: string, initialSlug: string}} cfg
 */
function categorySection(S, cfg) {
  return S.listItem()
    .title(cfg.title)
    .child(
      S.list()
        .title(cfg.title)
        .items([
          S.listItem()
            .title('Ustawienia kategorii')
            .child(
              S.document()
                .schemaType('productCategory')
                .documentId(cfg.id)
                .title(cfg.title)
            ),
          S.divider(),
          S.listItem()
            .title('Produkty w tej kategorii')
            .child(
              S.documentList()
                .title('Produkty w tej kategorii')
                .schemaType('product')
                .filter('_type == "product" && category._ref == $categoryId')
                .params({categoryId: cfg.id})
                // IMPORTANT: here we must pass InitialValueTemplateItem objects,
                // not Desk list item nodes.
                .initialValueTemplates([
                  {
                    templateId: 'productInCategory',
                    parameters: {categoryId: cfg.id},
                  },
                ])
            ),
        ])
    )
}
