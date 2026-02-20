import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'slidingCommonUsage',
  title: 'Sliding: Usage details (shared section)',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sectionOverline',
      title: 'Section overline',
      type: 'localizedString',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section title',
      type: 'localizedString',
    }),
    defineField({
      name: 'useDefaultTabs',
      title: 'Use default tabs (Glazing / Hardware / Silent Close)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'customTabs',
      title: 'Custom tabs (full replacement)',
      type: 'array',
      hidden: ({parent}) => parent?.useDefaultTabs !== false,
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'tabId', title: 'Tab ID', type: 'string'}),
            defineField({name: 'tabLabel', title: 'Tab label', type: 'localizedString'}),
            defineField({name: 'title', title: 'Title', type: 'localizedString'}),
            defineField({name: 'description', title: 'Description', type: 'localizedBlockContent'}),
            defineField({name: 'benefitLabel', title: 'Benefit label', type: 'localizedString'}),
            defineField({name: 'benefitText', title: 'Benefit text', type: 'localizedText'}),
          ],
          preview: {
            select: {
              title: 'tabLabel.pl',
              subtitle: 'tabId',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'defaultTabOverrides',
      title: 'Default tab overrides',
      type: 'array',
      hidden: ({parent}) => parent?.useDefaultTabs === false,
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'tabId',
              title: 'Tab to override',
              type: 'string',
              options: {
                list: [
                  {title: 'Glazing', value: 'glazing'},
                  {title: 'Hardware', value: 'hardware'},
                  {title: 'Silent Close', value: 'silentClose'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'overrideTabLabel', title: 'Override tab label', type: 'boolean', initialValue: false}),
            defineField({
              name: 'tabLabel',
              title: 'New tab label',
              type: 'localizedString',
              hidden: ({parent}) => !parent?.overrideTabLabel,
            }),
            defineField({name: 'overrideTitle', title: 'Override title', type: 'boolean', initialValue: false}),
            defineField({
              name: 'title',
              title: 'New title',
              type: 'localizedString',
              hidden: ({parent}) => !parent?.overrideTitle,
            }),
            defineField({name: 'overrideDescription', title: 'Override description', type: 'boolean', initialValue: false}),
            defineField({
              name: 'description',
              title: 'New description',
              type: 'localizedBlockContent',
              hidden: ({parent}) => !parent?.overrideDescription,
            }),
            defineField({name: 'overrideBenefitLabel', title: 'Override benefit label', type: 'boolean', initialValue: false}),
            defineField({
              name: 'benefitLabel',
              title: 'New benefit label',
              type: 'localizedString',
              hidden: ({parent}) => !parent?.overrideBenefitLabel,
            }),
            defineField({name: 'overrideBenefitText', title: 'Override benefit text', type: 'boolean', initialValue: false}),
            defineField({
              name: 'benefitText',
              title: 'New benefit text',
              type: 'localizedText',
              hidden: ({parent}) => !parent?.overrideBenefitText,
            }),
          ],
          preview: {
            select: {
              title: 'tabId',
              subtitle: 'title.pl',
            },
            prepare: ({title, subtitle}) => ({
              title: `Override ${title || 'tab'}`,
              subtitle: subtitle || 'Default tab override',
            }),
          },
        },
      ],
    }),
  ],
})
