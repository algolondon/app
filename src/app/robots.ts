import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/members-portal/', '/course-library/', '/thank-you/', '/api/'],
    },
    sitemap: 'https://16londonalgo.com/sitemap.xml',
  }
}
