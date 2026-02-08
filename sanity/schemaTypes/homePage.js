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
        defineField({
          name: 'backgroundPoster',
          title: 'Poster tła (LQIP)',
          description:
            'Obraz używany jako placeholder zanim załaduje się film. Sanity wygeneruje z niego LQIP automatycznie.',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'realizations',
      title: 'Galeria (Strona główna)',
      description: 'Lista zdjęć do galerii na stronie głównej. To tylko obraz + opcjonalne tagi.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'realization'}]}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Strona główna'}
    },
  },
})
