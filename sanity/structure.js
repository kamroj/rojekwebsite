// sanity/structure.js
// Custom Desk Structure (left sidebar) to match the website IA (PL)
import React from 'react'
import {PublishAllDraftsPane} from './components/PublishAllDraftsPane'

/**
 * @param {import('sanity/structure').StructureBuilder} S
 */
export const structure = (S) =>
  S.list()
    .title('Panel treści')
    .items([
      S.listItem()
        .title('Akcje')
        .child(S.component().id('publish-all-drafts-pane').title('Akcje publikacji').component(PublishAllDraftsPane)),

      S.divider(),

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
              S.listItem()
                .title('Ustawienia produktów')
                .child(
                  S.document()
                    .schemaType('productsPage')
                    .documentId('productsPage')
                    .title('Ustawienia produktów')
                ),
              S.divider(),
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
                title: 'Okna i drzwi ppoż.',
                initialSlug: 'okna-i-drzwi-przeciwpozarowe',
              }),
            ])
        ),

      // --- Cennik HS (konfigurator) ---
      S.listItem()
        .title('Cennik HS (konfigurator)')
        .child(
          S.list()
            .title('Cennik HS')
            .items([
              S.listItem()
                .title('Dodatki i dopłaty')
                .child(
                  S.document()
                    .schemaType('hsPricingSettings')
                    .documentId('hsPricingSettings')
                    .title('Dodatki i dopłaty')
                ),
              S.divider(),
              S.listItem()
                .title('Cenniki schematów')
                .child(
                  S.documentTypeList('hsPricingScheme')
                    .title('Cenniki schematów')
                    .defaultOrdering([{field: 'scheme', direction: 'asc'}])
                ),
            ])
        ),

      // --- Realizacje ---
      S.listItem()
        .title('Realizacje')
        .child(
          S.list()
            .title('Realizacje')
            .items([
              S.listItem().title('Wszystkie realizacje').child(S.documentTypeList('realization').title('Realizacje')),
              S.divider(),
              // Klucz (kategoria filtru) -> jego wartości. Widok zagnieżdżony,
              // żeby od razu było widać, co jest kategorią, a co wartością.
              S.listItem()
                .title('Tagi realizacji (kategorie i wartości)')
                .child(
                  S.documentTypeList('realizationTagKey')
                    .title('Kategorie filtrów (klucze tagów)')
                    .defaultOrdering([{field: 'sortOrder', direction: 'asc'}])
                    .child((keyId) =>
                      S.list()
                        .title('Kategoria filtru')
                        .items([
                          S.listItem()
                            .title('Ustawienia kategorii (klucza)')
                            .child(
                              S.document().schemaType('realizationTagKey').documentId(keyId)
                            ),
                          S.divider(),
                          S.listItem()
                            .title('Wartości w tej kategorii')
                            .child(
                              S.documentList()
                                .title('Wartości w tej kategorii')
                                .schemaType('realizationTag')
                                .filter('_type == "realizationTag" && key._ref == $keyId')
                                .params({keyId})
                            ),
                        ])
                    )
                ),
              S.listItem()
                .title('Wszystkie wartości tagów')
                .child(S.documentTypeList('realizationTag').title('Wszystkie wartości tagów')),
            ])
        ),

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
              S.divider(),
              S.listItem()
                .title('Tagi artykułów')
                .child(S.documentTypeList('articleTag').title('Tagi artykułów')),
            ])
        ),

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