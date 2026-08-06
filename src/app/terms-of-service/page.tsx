import { Navbar } from "@/components/navbar";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-[#00D4FF]">Terms of Service</h1>
        <div className="prose prose-invert prose-lg text-gray-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This is a placeholder for the Terms of Service. You should replace this content with your official terms of service.</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using our services, you agree to be bound by these Terms.</p>
          <h2>2. Subscription and Payments</h2>
          <p>Our services are billed on a subscription basis. You will be billed in advance on a recurring schedule.</p>
          <h2>3. Trading Disclaimer</h2>
          <p>Trading involves significant risk. Our indicators are tools to assist your analysis, not financial advice.</p>
          <h2>4. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@16londonalgo.com.</p>
        </div>
      </div>
    </main>
  );
}
