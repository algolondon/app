import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#030914] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-invert prose-lg text-foreground/80 max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">1. Information We Collect</h2>
            <p><strong>16London X Brands LLC</strong> ("we", "us", or "our") respects your privacy and is committed to protecting it through our compliance with this policy. We collect information you provide directly to us when you register for an account, subscribe to our services, or communicate with us.</p>
            <p>The types of information we may collect include your name, email address, password, payment information (processed securely via Stripe), and any other information you choose to provide.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services and algorithms.</li>
              <li>Process transactions and send you related information.</li>
              <li>Send you technical notices, updates, security alerts, and support messages.</li>
              <li>Respond to your comments, questions, and customer service requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">3. Data Security</h2>
            <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Website, you are responsible for keeping this password confidential.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">4. Third-Party Services</h2>
            <p>We may employ third-party companies and individuals to facilitate our Service (e.g., Stripe for payment processing). These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00D4FF] mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="font-bold">16London X Brands LLC</p>
            <p>Email: <a href="mailto:support@16londonalgo.com" className="text-[#00D4FF] hover:underline">support@16londonalgo.com</a></p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
