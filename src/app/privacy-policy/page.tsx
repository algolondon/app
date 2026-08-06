import { Navbar } from "@/components/navbar";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-[#00D4FF]">Privacy Policy</h1>
        <div className="prose prose-invert prose-lg text-gray-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This is a placeholder for the Privacy Policy. You should replace this content with your official privacy policy.</p>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you register for an account.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services.</p>
          <h2>3. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@16londonalgo.com.</p>
        </div>
      </div>
    </main>
  );
}
