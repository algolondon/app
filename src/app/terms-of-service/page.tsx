import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { client } from '@/sanity/client';

export const revalidate = 60;

export default async function TermsOfService() {
  const query = `
    *[_type == "legalPage" && slug.current == "terms-of-service"][0] {
      title,
      lastUpdated,
      sections[] {
        heading,
        body
      }
    }
  `;

  let sanityData = null;
  try {
    sanityData = await client.fetch(query);
  } catch (error) {
    console.error("Failed to fetch terms of service sanity data", error);
  }

  // Fallback static data if not created in CMS yet
  const fallbackSections = [
    {
      heading: "1. Agreement to Terms",
      body: "These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (\"you\") and <strong>16London X Brands LLC</strong> (\"Company\", \"we\", \"us\", or \"our\"), concerning your access to and use of the 16London Algo platform as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.<br/><br/>You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, then you are expressly prohibited from using the site and you must discontinue use immediately."
    },
    {
      heading: "2. Disclaimer of Financial Advice",
      body: "The information, indicators, and algorithms provided by 16London X Brands LLC are for educational and informational purposes only. We are not registered financial advisors, and nothing contained on the platform should be construed as personalized financial, investment, or trading advice.<br/><br/>Trading in financial markets involves a high degree of risk and may not be suitable for all investors. Past performance of any trading system or methodology is not necessarily indicative of future results. You are solely responsible for your own trading decisions."
    },
    {
      heading: "3. Subscription and Billing",
      body: "Our premium features, including the Indicator Suite and Course Library, are billed on a subscription basis. By selecting a subscription tier, you authorize us to charge your selected payment method on a recurring basis. You may cancel your subscription at any time, but no refunds will be provided for partial months."
    },
    {
      heading: "4. Intellectual Property Rights",
      body: "Unless otherwise indicated, the site and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the \"Content\") and the trademarks, service marks, and logos contained therein are owned or controlled by 16London X Brands LLC.<br/><br/>Our indicators, algorithms, and course materials are proprietary. You are granted a limited license to access and use them for your personal trading, but you may not share, redistribute, sell, or reverse-engineer any of our proprietary tools."
    },
    {
      heading: "5. Account Registration",
      body: "You may be required to register with the site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine it is inappropriate or violates our policies."
    },
    {
      heading: "6. Contact Us",
      body: "In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:<br/><br/><strong>16London X Brands LLC</strong><br/>Email: <a href='mailto:support@16londonalgo.com' class='text-[#00D4FF] hover:underline'>support@16londonalgo.com</a>"
    }
  ];

  const title = sanityData?.title || "Terms and Conditions";
  const lastUpdated = sanityData?.lastUpdated || new Date().toLocaleDateString();
  const sections = sanityData?.sections || fallbackSections;

  return (
    <main className="min-h-screen bg-[#030914] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">{title}</h1>
        <p className="text-muted-foreground mb-12">Last updated: {lastUpdated}</p>
        
        <div className="prose prose-invert prose-lg text-foreground/80 max-w-none space-y-8 font-sans">
          {sections.map((section: any, index: number) => (
            <section key={index}>
              <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">{section.heading}</h2>
              <div 
                className="leading-relaxed text-foreground/80 space-y-4"
                dangerouslySetInnerHTML={{ __html: section.body }} 
              />
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
