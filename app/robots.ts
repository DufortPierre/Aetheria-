import type { MetadataRoute } from 'next'

const siteUrl = 'https://aetheria-tr1u.onrender.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
