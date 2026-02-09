import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'realizationTag',
  title: 'Wartość tagu realizacji',
  type: 'document',
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
      title: 'Wartość (PL/EN/DE)',
      type: 'localizedString',
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          const plValue = String(value?.pl || '').trim().toLowerCase()
          const keyRef = context?.document?.key?._ref
          if (!plValue || !keyRef) return true

          const docId = context?.document?._id?.replace(/^drafts\./, '')
          const sanityClient = context
            .getClient({apiVersion: '2024-01-01'})
            .withConfig({perspective: 'previewDrafts'})

          const duplicate = await sanityClient.fetch(
            `count(*[_type == "realizationTag" && key._ref == $keyRef && lower(value.pl) == $plValue && !(_id in [$draftId, $publishedId])])`,
            {
              keyRef,
              plValue,
              draftId: `drafts.${docId}`,
              publishedId: docId,
            }
          )

          if (duplicate > 0) {
            return 'Ta wartość już istnieje dla wybranego klucza.'
          }

          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'value.pl',
      keyLabel: 'key.label.pl',
      key: 'key.key',
    },
    prepare({title, keyLabel, key}) {
      return {
        title: title || '(brak wartości)',
        subtitle: keyLabel || key || '(brak klucza)',
      }
    },
  },
})
