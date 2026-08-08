import { client } from '@/sanity/client'
import HomeClient from './HomeClient'

export const revalidate = 60

export default async function Page() {
  const query = `
    *[_type == "homePage"][0] {
      heroTitle,
      heroTitleGradient,
      tagline,
      testimonialsLabel,
      testimonialsTitle,
      testimonialsSubtitle,
      rulesImage { asset->{url} },
      yearsTrading,
      revenue,
      numberOfAlgos,
      faqs
    }
  `
  
  let sanityData = null
  try {
    sanityData = await client.fetch(query)
  } catch (error) {
    console.error("Failed to fetch sanity data", error)
  }

  return <HomeClient sanityData={sanityData} />
}
