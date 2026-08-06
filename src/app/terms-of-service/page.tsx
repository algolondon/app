import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#030914] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-invert prose-lg text-foreground/80 max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">1. Agreement to Terms</h2>
            <p>These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <strong>16London X Brands LLC</strong> ("Company", "we", "us", or "our"), concerning your access to and use of the 16London Algo platform as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.</p>
            <p>You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, then you are expressly prohibited from using the site and you must discontinue use immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">2. Disclaimer of Financial Advice</h2>
            <p>The information, indicators, and algorithms provided by 16London X Brands LLC are for educational and informational purposes only. We are not registered financial advisors, and nothing contained on the platform should be construed as personalized financial, investment, or trading advice.</p>
            <p>Trading in financial markets involves a high degree of risk and may not be suitable for all investors. Past performance of any trading system or methodology is not necessarily indicative of future results. You are solely responsible for your own trading decisions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">3. Subscription and Billing</h2>
            <p>Our premium features, including the Indicator Suite and Course Library, are billed on a subscription basis. By selecting a subscription tier, you authorize us to charge your selected payment method on a recurring basis. You may cancel your subscription at any time, but no refunds will be provided for partial months.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">4. Intellectual Property Rights</h2>
            <p>Unless otherwise indicated, the site and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by 16London X Brands LLC.</p>
            <p>Our indicators, algorithms, and course materials are proprietary. You are granted a limited license to access and use them for your personal trading, but you may not share, redistribute, sell, or reverse-engineer any of our proprietary tools.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">5. Account Registration</h2>
            <p>You may be required to register with the site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine it is inappropriate or violates our policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">6. Contact Us</h2>
            <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
            <p className="font-bold">16London X Brands LLC</p>
            <p>Email: <a href="mailto:support@16londonalgo.com" className="text-[#00D4FF] hover:underline">support@16londonalgo.com</a></p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
