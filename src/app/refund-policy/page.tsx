import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { client } from '@/sanity/client';

export const revalidate = 60;

export default async function RefundPolicy() {
  const query = `
    *[_type == "legalPage" && slug.current == "refund-policy"][0] {
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
    console.error("Failed to fetch refund policy sanity data", error);
  }

  // Fallback static data if not created in CMS yet
  const fallbackSections = [
    {
      heading: "1. General Policy",
      body: "At <strong>16London X Brands LLC</strong>, we are committed to providing the highest quality trading tools and educational resources. Due to the digital nature of our products and instant access to our proprietary indicators and course library, we generally do not offer refunds once access has been granted."
    },
    {
      heading: "2. Exceptions",
      body: "Refunds may be considered in the following limited circumstances:<br/><ul class='list-disc pl-6 space-y-2 mt-2'><li>If you were charged in error due to a technical glitch.</li><li>If you requested cancellation of your subscription prior to the renewal date, but the charge was still processed.</li></ul>"
    },
    {
      heading: "3. Subscription Cancellations",
      body: "You may cancel your subscription at any time through your member dashboard or by contacting our support team. Canceling your subscription will prevent future charges, but you will retain access to the platform until the end of your current billing period. No prorated refunds will be issued for partial months."
    },
    {
      heading: "4. Contacting Support",
      body: "If you believe you are eligible for a refund under our exceptions, please contact our support team within 7 days of the charge in question.<br/><br/><strong>16London X Brands LLC</strong><br/>Email: <a href='mailto:support@16londonalgo.com' class='text-[#00D4FF] hover:underline'>support@16londonalgo.com</a>"
    }
  ];

  const title = sanityData?.title || "Refund Policy";
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
