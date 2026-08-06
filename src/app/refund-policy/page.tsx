import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-[#030914] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">Refund Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-invert prose-lg text-foreground/80 max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">1. General Policy</h2>
            <p>At <strong>16London X Brands LLC</strong>, we are committed to providing the highest quality trading tools and educational resources. Due to the digital nature of our products and instant access to our proprietary indicators and course library, we generally do not offer refunds once access has been granted.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">2. Exceptions</h2>
            <p>Refunds may be considered in the following limited circumstances:</p>
            <ul>
              <li>If you were charged in error due to a technical glitch.</li>
              <li>If you requested cancellation of your subscription prior to the renewal date, but the charge was still processed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">3. Subscription Cancellations</h2>
            <p>You may cancel your subscription at any time through your member dashboard or by contacting our support team. Canceling your subscription will prevent future charges, but you will retain access to the platform until the end of your current billing period. No prorated refunds will be issued for partial months.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">4. Contacting Support</h2>
            <p>If you believe you are eligible for a refund under our exceptions, please contact our support team within 7 days of the charge in question.</p>
            <p className="font-bold">16London X Brands LLC</p>
            <p>Email: <a href="mailto:support@16londonalgo.com" className="text-[#00D4FF] hover:underline">support@16londonalgo.com</a></p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
