import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";
import Script from "next/script";
import { CSPostHogProvider } from "@/providers/PostHogProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#0A1628",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "16London Algo â€” Institutional Trading Indicators",
  description: "Institutional grade trading algorithms built for serious traders. 8 years of live market experience distilled into proprietary TradingView tools plus complete masterclass.",
  keywords: ["trading indicators", "tradingview algorithms", "forex trading", "crypto trading", "16london", "trend algo", "london breakout strategy"],
  authors: [{ name: "Kazi @ 16London X Brands LLC" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://16londonalgo.com",
    title: "16London Algo â€” Institutional Trading Indicators",
    description: "Built for Legacy. Designed for Wealth. Institutional grade trading algorithms.",
    siteName: "16London X Brands LLC",
    images: [
      {
        url: "https://16londonalgo.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "16London Algo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "16London Algo â€” Institutional Trading Indicators",
    description: "Built for Legacy. Designed for Wealth. Institutional grade trading algorithms.",
    images: ["https://16londonalgo.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "16London Algo",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  applicationName: "16London Algo",
  formatDetection: {
    telephone: false,
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://16londonalgo.com/#organization",
      "name": "16London X Brands LLC",
      "url": "https://16londonalgo.com",
      "logo": "https://16londonalgo.com/logo.png"
    },
    {
      "@type": "Product",
      "@id": "https://16londonalgo.com/#product",
      "name": "16London Trend Algo",
      "description": "Institutional grade trading indicator for TradingView.",
      "brand": {
        "@type": "Brand",
        "name": "16London X Brands LLC"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "89.99",
        "highPrice": "169.99",
        "offerCount": "3"
      }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CSPostHogProvider>
          <Providers>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </Providers>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
