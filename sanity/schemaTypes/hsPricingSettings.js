import {defineField, defineType} from 'sanity'

/**
 * Shared HS pricing settings (singleton, documentId: hsPricingSettings).
 * Unit prices for add-ons are kept here in one place — per-scheme documents
 * only define quantities of each add-on.
 */
export default defineType({
  name: 'hsPricingSettings',
  title: 'Cennik HS – dodatki i dopłaty',
  type: 'document',
  fields: [
    defineField({
      name: 'silentClosePrice',
      title: 'SilentClose / StopUnit (PLN/szt.)',
      type: 'number',
      description: 'Cena jednostkowa dopłaty SilentClose / StopUnit.',
      initialValue: 1500,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'cylinderLockPrice',
      title: 'Wkładka (PLN/szt.)',
      type: 'number',
      description: 'Cena jednostkowa wkładki.',
      initialValue: 200,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'outerHandlePrice',
      title: 'Klamka zewnętrzna (PLN/szt.)',
      type: 'number',
      description: 'Cena jednostkowa klamki zewnętrznej.',
      initialValue: 400,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'temperedGlassPricePerM2',
      title: 'Szyba hartowana (PLN/m²)',
      type: 'number',
      description: 'Dopłata liczona od powierzchni okna (szerokość × wysokość).',
      initialValue: 54,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'woodSpecies',
      title: 'Gatunki drewna (dopłata %)',
      type: 'array',
      description:
        'Dopłata procentowa do ceny bazowej. Gatunek bazowy (np. sosna) powinien mieć dopłatę 0%. Klucze rozpoznawane przez stronę: pine, meranti, oak.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Klucz (np. pine, meranti, oak)',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-z][a-z0-9-]*$/, {name: 'slug (małe litery, cyfry, myślniki)'}),
            }),
            defineField({
              name: 'title',
              title: 'Nazwa',
              type: 'localizedString',
              description: 'Nazwa wyświetlana na stronie w wybranym języku.',
            }),
            defineField({
              name: 'surchargePercent',
              title: 'Dopłata (%)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: {title: 'title.pl', key: 'key', percent: 'surchargePercent'},
            prepare: ({title, key, percent}) => ({
              title: title || key || 'Gatunek',
              subtitle: `+${percent ?? 0}%`,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Cennik HS – dodatki i dopłaty'}),
  },
})
