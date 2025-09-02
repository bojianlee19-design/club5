// sanity/image.ts
import createImageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export function urlForImage(source: any) {
  return createImageUrlBuilder({ projectId, dataset }).image(source)
}
