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
    defineField({ name: 'ticketUrl', title: 'Ticket URL', type: 'url', description: 'Link to your ticketing provider' }),
    defineField({ name: 'doorsOpen', title: 'Doors Open', type: 'string' }),
    defineField({ name: 'lastEntry', title: 'Last Entry', type: 'string' }),
    defineField({ name: 'ageRestriction', title: 'Age Restriction', type: 'string', initialValue: '18+' }),
    defineField({ name: 'priceFrom', title: 'Price From (£)', type: 'number' }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true })
  ]
})
