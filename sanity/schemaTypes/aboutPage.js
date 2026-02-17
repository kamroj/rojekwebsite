// sanity/schemaTypes/aboutPage.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'O firmie',
  type: 'document',
  // Singleton document for About page content.
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'pageSettings',
      title: 'Ustawienia strony',
      type: 'object',
      fields: [
        defineField({
          name: 'headerImage',
          title: 'Top zdjęcie',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt (tekst alternatywny)',
              type: 'string',
              description: 'Opis obrazka dla SEO i dostępności.',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'whyUs',
      title: 'Dlaczego my',
      type: 'object',
      fields: [
        defineField({
          name: 'description',
          title: 'Opis (PL/EN/DE)',
          type: 'localizedText',
          rows: 4,
        }),
        defineField({
          name: 'points',
          title: 'Nasze cechy (PL/EN/DE)',
          type: 'array',
          validation: (Rule) => Rule.required().min(4).max(4),
          of: [
            defineField({
              name: 'whyUsPoint',
              title: 'Punkt',
              type: 'localizedString',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'history',
      title: 'Nasza historia',
      type: 'object',
      fields: [
        defineField({
          name: 'description',
          title: 'Opis sekcji (PL/EN/DE)',
          type: 'localizedText',
          rows: 4,
        }),
        defineField({
          name: 'items',
          title: 'Elementy historii',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'aboutHistoryItem',
              title: 'Element historii',
              fields: [
                defineField({
                  name: 'year',
                  title: 'Rok',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'title',
                  title: 'Tytuł (PL/EN/DE)',
                  type: 'localizedString',
                }),
                defineField({
                  name: 'description',
                  title: 'Opis (PL/EN/DE)',
                  type: 'localizedText',
                  rows: 3,
                }),
                defineField({
                  name: 'image',
                  title: 'Zdjęcie',
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    defineField({
                      name: 'alt',
                      title: 'Alt (tekst alternatywny)',
                      type: 'string',
                      description: 'Opis obrazka dla SEO i dostępności.',
                    }),
                  ],
                }),
              ],
              preview: {
                select: {
                  year: 'year',
                  titlePl: 'title.pl',
                  titleEn: 'title.en',
                  titleDe: 'title.de',
                  media: 'image',
                },
                prepare({year, titlePl, titleEn, titleDe, media}) {
                  const localizedTitle = titlePl || titleEn || titleDe || '(bez tytułu)'
                  return {
                    title: `${year || 'Rok'} — ${localizedTitle}`,
                    subtitle: 'Nasza historia',
                    media,
                  }
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'management',
      title: 'Management',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'aboutManagementPerson',
          title: 'Osoba',
          fields: [
            defineField({
              name: 'photo',
              title: 'Zdjęcie',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt (tekst alternatywny)',
                  type: 'string',
                  description: 'Opis obrazka dla SEO i dostępności.',
                }),
              ],
            }),
            defineField({
              name: 'name',
              title: 'Imię i nazwisko',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Rola (PL/EN/DE)',
              type: 'localizedString',
            }),
            defineField({
              name: 'phone',
              title: 'Telefon',
              type: 'string',
            }),
            defineField({
              name: 'email',
              title: 'Adres e-mail',
              type: 'string',
              validation: (Rule) => Rule.email(),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role.pl',
              media: 'photo',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'O firmie'}
    },
  },
})
