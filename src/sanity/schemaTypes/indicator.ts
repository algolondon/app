import { defineField, defineType } from 'sanity'

export const indicatorType = defineType({
  name: 'indicator',
  title: 'Indicator',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Indicator Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'features',
      title: 'Features List',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})
