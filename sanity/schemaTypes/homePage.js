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
      description:
        'Lista realizacji na stronę główną. Dla każdej pozycji możesz dodać własny krótki opis wyświetlany na slajdzie (nie są to tagi).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'homeRealizationItem',
          title: 'Pozycja galerii',
          fields: [
            defineField({
              name: 'realization',
              title: 'Realizacja',
              type: 'reference',
              to: [{type: 'realization'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Opis na slajdzie (PL/EN/DE)',
              description:
                'Krótki tekst widoczny na stronie głównej w sliderze realizacji. Niezależny od tagów realizacji.',
              type: 'localizedString',
            }),
          ],
          preview: {
            select: {
              titlePl: 'title.pl',
              titleEn: 'title.en',
              titleDe: 'title.de',
              media: 'realization.image',
            },
            prepare({titlePl, titleEn, titleDe, media}) {
              return {
                title: titlePl || titleEn || titleDe || 'Pozycja galerii (bez opisu)',
                subtitle: 'Strona główna → realizacje',
                media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Strona główna'}
    },
  },
})
