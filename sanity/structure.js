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
            ])
        ),

      // --- Realizacje ---
      S.listItem().title('Realizacje').child(S.documentTypeList('realization').title('Realizacje')),

      // --- Artykuły ---
      S.listItem()
        .title('Artykuły')
        .child(
          S.list()
            .title('Artykuły')
            .items([
              S.listItem()
                .title('Ustawienia artykułów')
                .child(
                  S.document()
                    .schemaType('articlesPage')
                    .documentId('articlesPage')
                    .title('Ustawienia artykułów')
                ),
              S.divider(),
              S.listItem()
                .title('Wszystkie artykuły')
                .child(
                  S.documentTypeList('article')
                    .title('Artykuły')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            ])
        ),

      // --- Tagi artykułów ---
      S.listItem().title('Tagi artykułów').child(S.documentTypeList('articleTag').title('Tagi artykułów')),

      // --- O firmie ---
      S.listItem().title('O firmie').child(S.document().schemaType('aboutPage').documentId('aboutPage').title('O firmie')),

      // --- Kontakt ---
      S.listItem().title('Kontakt').child(S.document().schemaType('contactPage').documentId('contactPage').title('Kontakt')),
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