import type { MetadataRoute } from 'next'

const siteUrl = 'https://aetheria-tr1u.onrender.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
