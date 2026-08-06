import { defineField, defineType } from 'sanity'

export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({
      name: 'videoTitle',
      title: 'Video Title',
      type: 'string',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'Unlisted YouTube URL',
      type: 'url',
    }),
  ],
})
