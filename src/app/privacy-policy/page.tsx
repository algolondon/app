import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { client } from '@/sanity/client';

export const revalidate = 60;

export default async function PrivacyPolicy() {
  const query = `
    *[_type == "legalPage" && slug.current == "privacy-policy"][0] {
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
    console.error("Failed to fetch privacy policy sanity data", error);
  }

  // Fallback static data if not created in CMS yet
  const fallbackSections = [
    {
      heading: "1. Information We Collect",
      body: "<strong>16London X Brands LLC</strong> (\"we\", \"us\", or \"our\") respects your privacy and is committed to protecting it through our compliance with this policy. We collect information you provide directly to us when you register for an account, subscribe to our services, or communicate with us.<br/><br/>The types of information we may collect include your name, email address, password, payment information (processed securely via PayPal), and any other information you choose to provide."
    },
    {
      heading: "2. How We Use Your Information",
      body: "We use the information we collect to:<br/><ul class='list-disc pl-6 space-y-2 mt-2'><li>Provide, maintain, and improve our services and algorithms.</li><li>Process transactions and send you related information.</li><li>Send you technical notices, updates, security alerts, and support messages.</li><li>Respond to your comments, questions, and customer service requests.</li></ul>"
    },
    {
      heading: "3. Data Security",
      body: "We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Website, you are responsible for keeping this password confidential."
    },
    {
      heading: "4. Third-Party Services",
      body: "We may employ third-party companies and individuals to facilitate our Service (e.g., PayPal for payment processing). These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose."
    },
    {
      heading: "5. Contact Us",
      body: "If you have any questions about this Privacy Policy, please contact us at:<br/><br/><strong>16London X Brands LLC</strong><br/>Email: <a href='mailto:support@16londonalgo.com' class='text-[#00D4FF] hover:underline'>support@16londonalgo.com</a>"
    }
  ];

  const title = sanityData?.title || "Privacy Policy";
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
