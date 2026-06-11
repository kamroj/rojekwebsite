import {defineField, defineType} from 'sanity'
import HsPriceMatrixInput from '../components/HsPriceMatrixInput'

const SCHEME_OPTIONS = [
  {title: 'Schemat A', value: 'a'},
  {title: 'Schemat A3 (lustrzane A — używa cennika A)', value: 'a3'},
  {title: 'Schemat C', value: 'c'},
  {title: 'Schemat D', value: 'd'},
  {title: 'Schemat E', value: 'e'},
  {title: 'Schemat F', value: 'f'},
  {title: 'Schemat G2', value: 'g2'},
  {title: 'Schemat G3', value: 'g3'},
  {title: 'Schemat H', value: 'h'},
  {title: 'Schemat K', value: 'k'},
]

/**
 * Price matrix for a single HS scheme.
 * `rows[].prices[i]` corresponds to `widthBands[i]`; the value -1 is a sentinel
 * for "CNZ" (price on request) because Sanity does not store nulls in number arrays.
 */
export default defineType({
  name: 'hsPricingScheme',
  title: 'Cennik HS – schemat',
  type: 'document',
  fields: [
    defineField({
      name: 'scheme',
      title: 'Schemat',
      type: 'string',
      description:
        'Jeden dokument na schemat. Schemat A3 nie wymaga osobnego dokumentu — używa cennika A.',
      options: {list: SCHEME_OPTIONS, layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'matrix',
      title: 'Tabela cen (wklej z Excela)',
      type: 'object',
      components: {input: HsPriceMatrixInput},
      fields: [
        defineField({
          name: 'widthBands',
          title: 'Przedziały szerokości',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'band',
              fields: [
                defineField({name: 'min', title: 'Od (mm)', type: 'number'}),
                defineField({name: 'max', title: 'Do (mm)', type: 'number'}),
              ],
            },
          ],
        }),
        defineField({
          name: 'rows',
          title: 'Wiersze (przedziały wysokości)',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'row',
              fields: [
                defineField({name: 'heightMin', title: 'Wysokość od (mm)', type: 'number'}),
                defineField({name: 'heightMax', title: 'Wysokość do (mm)', type: 'number'}),
                defineField({
                  name: 'prices',
                  title: 'Ceny (PLN, -1 = CNZ)',
                  type: 'array',
                  of: [{type: 'number'}],
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'addonQuantities',
      title: 'Ilości dodatków dla schematu',
      type: 'object',
      description:
        'Ile sztuk każdego dodatku przypada na ten schemat (np. liczba klamek zależy od liczby skrzydeł). Ceny jednostkowe ustawia się w „Dodatki i dopłaty”.',
      options: {columns: 3},
      fields: [
        defineField({
          name: 'silentClose',
          title: 'SilentClose (szt.)',
          type: 'number',
          initialValue: 1,
          validation: (rule) => rule.min(0).integer(),
        }),
        defineField({
          name: 'cylinderLock',
          title: 'Wkładki (szt.)',
          type: 'number',
          initialValue: 1,
          validation: (rule) => rule.min(0).integer(),
        }),
        defineField({
          name: 'outerHandle',
          title: 'Klamki zewnętrzne (szt.)',
          type: 'number',
          initialValue: 1,
          validation: (rule) => rule.min(0).integer(),
        }),
      ],
    }),
  ],
  preview: {
    select: {scheme: 'scheme'},
    prepare: ({scheme}) => ({
      title: `Cennik – schemat ${(scheme || '?').toUpperCase()}`,
    }),
  },
})
