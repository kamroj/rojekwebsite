import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'rojekwebsite',

  projectId: '6sp9tyie',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Templates used by the desk structure to create a Product with a preselected category.
    // This removes the need to manually choose a category when creating from inside a category.
    templates: (prev) => [
      ...prev,
      {
        id: 'productInCategory',
        title: 'Produkt (w kategorii)',
        schemaType: 'product',
        parameters: [{name: 'categoryId', title: 'Kategoria', type: 'string'}],
        value: ({categoryId}) => ({
          // Mark as weak reference so you can create products before the category document
          // is created/saved for the first time.
          category: {_type: 'reference', _ref: categoryId, _weak: true},
          categoryLocked: true,
        }),
      },
    ],
  },
})
