import { client } from '@/sanity/client'
import HomeClient from './HomeClient'
import connectToDatabase from '@/lib/db'
import { SiteContent } from '@/models/SiteContent'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let customContent: any = null;
  let sanityData: any = null;

  try {
    await connectToDatabase();
    customContent = await SiteContent.findOne().lean();
  } catch (err) {
    console.error("Failed to fetch custom site content:", err);
  }

  try {
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
    `;
    sanityData = await client.fetch(query);
  } catch (error) {
    // Sanity fallback
  }

  // Merge MongoDB customizer content as top priority
  const mergedData = {
    tagline: customContent?.tagline || sanityData?.tagline,
    marqueeText: customContent?.marqueeText,
    heroTitle: customContent?.heroTitle || sanityData?.heroTitle,
    heroTitleGradient: customContent?.heroTitleGradient || sanityData?.heroTitleGradient,
    heroSubtitle: customContent?.heroSubtitle,
    yearsTrading: customContent?.heroYearsTrading || sanityData?.yearsTrading,
    revenue: customContent?.heroRevenue || sanityData?.revenue,
    numberOfAlgos: customContent?.heroNumberOfAlgos || sanityData?.numberOfAlgos,
    rulesImage: sanityData?.rulesImage,
    rules: customContent?.rules,
    founderBio: customContent?.founderBio,
    tier1Price: customContent?.tier1Price,
    tier2Price: customContent?.tier2Price,
    tier3Price: customContent?.tier3Price,
    faqs: customContent?.faqs?.length 
      ? customContent.faqs.map((f: any) => ({ question: f.q || f.question, answer: f.a || f.answer, q: f.q || f.question, a: f.a || f.answer })) 
      : sanityData?.faqs,
    ctaTitle: customContent?.ctaTitle,
    ctaSubtitle: customContent?.ctaSubtitle,
    ctaButtonText: customContent?.ctaButtonText,
  };

  return <HomeClient sanityData={mergedData} />
}
