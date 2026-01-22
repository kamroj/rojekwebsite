// sanity/schemaTypes/homePage.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Strona główna',
  type: 'document',
  // Singleton (edytujesz jeden dokument strony głównej)
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'intro',
      title: 'Wstęp (Intro)',
      type: 'object',
      fields: [
        defineField({name: 'backgroundVideo', title: 'Wideo w tle', type: 'file'}),
      ],
    }),
    defineField({
      name: 'productTiles',
      title: 'Kafelki produktów (kolejność)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'productCategory'}]}],
    }),
    defineField({
      name: 'realizations',
      title: 'Galeria (Strona główna)',
      description: 'Lista zdjęć do galerii na stronie głównej. To tylko obraz + opcjonalne tagi.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'realization'}]}],
    }),
    defineField({
      name: 'whyUs',
      title: 'Dlaczego my',
      description:
        'Kafelki są predefiniowane (ikony są w kodzie). W CMS edytujesz tylko teksty dla każdego kafelka.',
      type: 'object',
      fields: [
        defineField({
          name: 'tradition',
          title: 'Tradycja i doświadczenie (ikona: okno)',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'localizedString'}),
            defineField({name: 'description', title: 'Opis', type: 'localizedText'}),
          ],
        }),
        defineField({
          name: 'individual',
          title: 'Indywidualne podejście (ikona: współpraca)',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'localizedString'}),
            defineField({name: 'description', title: 'Opis', type: 'localizedText'}),
          ],
        }),
        defineField({
          name: 'ecological',
          title: 'Ekologiczne materiały (ikona: liść)',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'localizedString'}),
            defineField({name: 'description', title: 'Opis', type: 'localizedText'}),
          ],
        }),
        defineField({
          name: 'precision',
          title: 'Precyzja wykonania (ikona: narzędzia)',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'localizedString'}),
            defineField({name: 'description', title: 'Opis', type: 'localizedText'}),
          ],
        }),
        defineField({
          name: 'warranty',
          title: 'Gwarancja i serwis (ikona: tarcza)',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'localizedString'}),
            defineField({name: 'description', title: 'Opis', type: 'localizedText'}),
          ],
        }),
        defineField({
          name: 'delivery',
          title: 'Terminowość dostaw (ikona: zegar)',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'localizedString'}),
            defineField({name: 'description', title: 'Opis', type: 'localizedText'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'partners',
      title: 'Partnerzy (loga)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'partner'}]}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Strona główna'}
    },
  },
})
