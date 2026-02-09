// sanity/schemaTypes/realization.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'realization',
  title: 'Realizacja (zdjęcie)',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt (tekst alternatywny)',
          type: 'localizedString',
          description: 'Opis obrazka dla SEO i dostępności (PL/EN/DE).',
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tagi realizacji',
      type: 'array',
      description:
        'Najpierw wybierz klucz tagu, a potem wartość przypisaną do tego klucza.',
      validation: (Rule) =>
        Rule.custom((items) => {
          if (!Array.isArray(items) || items.length === 0) return true

          const seen = new Set()
          for (const item of items) {
            const keyRef = item?.key?._ref
            const valueRef = item?.value?._ref
            if (!keyRef || !valueRef) continue

            const pair = `${keyRef}::${valueRef}`
            if (seen.has(pair)) {
              return 'Ta sama para klucz + wartość została dodana więcej niż raz.'
            }
            seen.add(pair)
          }

          return true
        }),
      of: [
        {
          type: 'object',
          name: 'realizationTagItem',
          title: 'Tag',
          fields: [
            defineField({
              name: 'key',
              title: 'Klucz tagu',
              type: 'reference',
              to: [{type: 'realizationTagKey'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Wartość tagu',
              type: 'reference',
              to: [{type: 'realizationTag'}],
              options: {
                filter: ({parent}) => {
                  const keyRef = parent?.key?._ref
                  if (!keyRef) {
                    return {
                      filter: '_type == "realizationTag"',
                    }
                  }

                  return {
                    filter: '_type == "realizationTag" && key._ref == $keyRef',
                    params: {keyRef},
                  }
                },
              },
              validation: (Rule) =>
                Rule.required().custom(async (value, context) => {
                  if (!value?._ref) return true

                  const selectedKeyRef = context?.parent?.key?._ref
                  if (!selectedKeyRef) return 'Najpierw wybierz klucz tagu.'

                  const sanityClient = context
                    .getClient({apiVersion: '2024-01-01'})
                    .withConfig({perspective: 'previewDrafts'})

                  const valueKeyRef = await sanityClient.fetch(
                    '*[_type == "realizationTag" && _id == $id][0].key._ref',
                    {id: value._ref}
                  )

                  if (valueKeyRef && valueKeyRef !== selectedKeyRef) {
                    return 'Wybrana wartość nie należy do wskazanego klucza tagu.'
                  }

                  return true
                }),
            }),
          ],
          preview: {
            select: {
              value: 'value.value.pl',
              keyLabel: 'key.label.pl',
              key: 'key.key',
            },
            prepare({value, keyLabel, key}) {
              return {
                title: value || '(brak wartości)',
                subtitle: keyLabel || key || '(brak klucza)',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      media: 'image',
    },
    prepare({media}) {
      return {title: 'Realizacja', media}
    },
  },
})
