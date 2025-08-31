import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'image', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'lineup', title: 'Lineup', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true })
  ]
})
