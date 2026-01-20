// sanity/schemaTypes/aboutPage.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'O firmie',
  type: 'document',
  // Singleton (edytujesz jeden dokument strony "O firmie")
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({name: 'headerImage', title: 'Zdjęcie nagłówkowe', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'content',
      title: 'Treść',
      type: 'localizedBlockContent',
      description: 'Główna treść strony „O firmie” (PL/EN/DE).',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'O firmie'}
    },
  },
})
