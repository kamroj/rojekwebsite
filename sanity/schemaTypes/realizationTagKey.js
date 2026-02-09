import React, {useEffect} from 'react'
import {defineField, defineType, set, useFormValue} from 'sanity'

const normalizeTechnicalKey = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const TechnicalKeyInput = (props) => {
  const labelPl = useFormValue(['label', 'pl'])
  const normalized = normalizeTechnicalKey(labelPl)

  useEffect(() => {
    if (!normalized) return
    if (props.value === normalized) return
    props.onChange(set(normalized))
  }, [normalized, props.value, props.onChange])

  return props.renderDefault({
    ...props,
    readOnly: true,
    elementProps: {
      ...props.elementProps,
      readOnly: true,
    },
  })
}

export default defineType({
  name: 'realizationTagKey',
  title: 'Klucz tagu realizacji',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Klucz techniczny',
      type: 'string',
      description:
        'Uzupełnia się automatycznie na podstawie Nazwy klucza (PL), np. "Typ drzwi" -> "TYP-DRZWI".',
      initialValue: (_params, context) => normalizeTechnicalKey(context?.document?.label?.pl),
      components: {
        input: TechnicalKeyInput,
      },
      validation: (Rule) =>
        Rule.required()
          .regex(/^[A-Z0-9-]+$/, {
            name: 'slug-like-key',
            invert: false,
          })
          .custom(async (value, context) => {
            const normalized = String(value || '').trim().toUpperCase()
            if (!normalized) return true

            if (normalized !== String(value || '').trim()) {
              return 'Klucz techniczny musi być zapisany WIELKIMI LITERAMI (uppercase).'
            }

            const expectedFromPl = normalizeTechnicalKey(context?.document?.label?.pl)
            if (expectedFromPl && normalized !== expectedFromPl) {
              return `Klucz techniczny musi odpowiadać nazwie PL: ${expectedFromPl}`
            }

            const docId = context?.document?._id?.replace(/^drafts\./, '')
            const sanityClient = context
              .getClient({apiVersion: '2024-01-01'})
              .withConfig({perspective: 'previewDrafts'})

            const duplicate = await sanityClient.fetch(
              `count(*[_type == "realizationTagKey" && upper(key) == $key && !(_id in [$draftId, $publishedId])])`,
              {
                key: normalized,
                draftId: `drafts.${docId}`,
                publishedId: docId,
              }
            )

            if (duplicate > 0) return 'Ten klucz techniczny już istnieje.'
            return true
          })
          .error('Użyj WIELKICH liter, cyfr i myślnika.'),
    }),
    defineField({
      name: 'label',
      title: 'Nazwa klucza (PL/EN/DE)',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label.pl',
      subtitle: 'key',
    },
    prepare({title, subtitle}) {
      return {
        title: title || '(brak nazwy)',
        subtitle: subtitle ? `Klucz: ${subtitle}` : 'Brak klucza',
      }
    },
  },
})
