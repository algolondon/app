import mongoose, { Schema, Document } from "mongoose";

export interface ISiteContent extends Document {
  // Hero & Marquee
  marqueeText: string;
  tagline: string;
  heroTitle: string;
  heroTitleGradient: string;
  heroSubtitle: string;
  heroYearsTrading: string;
  heroRevenue: string;
  heroNumberOfAlgos: string;
  heroCoverImage: string;

  // 3 Systems
  trendAlgoTitle: string;
  trendAlgoDesc: string;
  trendAlgoBadge: string;
  londonXTitle: string;
  londonXDesc: string;
  atmSystemTitle: string;
  atmSystemDesc: string;

  // Rules & About
  rules: string[];
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderStoryButtonText: string;

  // Pricing
  tier1Price: string;
  tier1Features: string[];
  tier2Price: string;
  tier2Features: string[];
  tier3Price: string;
  tier3Features: string[];

  // FAQs
  faqs: Array<{ q: string; a: string }>;

  // CTA Banner
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;

  // Global Announcement
  announcementActive: boolean;
  announcementText: string;
  announcementLink: string;

  updatedAt: Date;
  createdAt: Date;
}

const SiteContentSchema = new Schema(
  {
    marqueeText: { type: String, default: "🟢 EURUSD: STRONG BUY SIGNAL CONFIRMED  🟢 XAUUSD: BUY SIGNAL @ 2420.50 (+240 PIPS)  🟢 16LONDON TREND ALGO V1: INTRADAY EMA 87 BULLISH  🟢 GBPUSD: LONDON X BREAKOUT CONFIRMED" },
    tagline: { type: String, default: "8 YEAR PROVEN TRADING SYSTEMS" },
    heroTitle: { type: String, default: "Built for Legacy." },
    heroTitleGradient: { type: String, default: "Designed for Wealth." },
    heroSubtitle: { type: String, default: "Institutional grade trading algorithms built for serious traders. 8 years of live market experience distilled into proprietary TradingView tools plus complete masterclass." },
    heroYearsTrading: { type: String, default: "8+ Years" },
    heroRevenue: { type: String, default: "$3,486" },
    heroNumberOfAlgos: { type: String, default: "3 Algos" },
    heroCoverImage: { type: String, default: "/images/cover.jpg" },

    trendAlgoTitle: { type: String, default: "16London Trend ALGO™" },
    trendAlgoDesc: { type: String, default: "Our flagship indicator. Visually maps the market trend so you never trade against momentum. Multi-timeframe dashboard built in." },
    trendAlgoBadge: { type: String, default: "MOST POPULAR" },
    londonXTitle: { type: String, default: "London X System" },
    londonXDesc: { type: String, default: "Designed specifically for the London session breakout. Captures explosive moves with pinpoint accuracy. Perfect for early morning traders." },
    atmSystemTitle: { type: String, default: "16London ATM System™" },
    atmSystemDesc: { type: String, default: "ATM stands for Accumulation, Trap, Manipulation. Identifies institutional footprints before the big move. Advanced entries only." },

    rules: { 
      type: [String], 
      default: [
        "Only trade in the direction of the Trend Algo",
        "Wait for multi-timeframe confirmation",
        "Never risk more than 1% per trade",
        "No trades during high-impact news events"
      ] 
    },
    founderName: { type: String, default: "Kazi" },
    founderTitle: { type: String, default: "Founder of 16London Trend Algo" },
    founderBio: { type: String, default: "I'm Kaziyel, born and raised in Miami, Florida. After 8+ years in the trenches of the financial markets, I realized that consistency doesn't come from flashy indicators—it comes from structure, discipline, and a proven process. I built the 16London Trend Algo to remove the guesswork and help you trade with absolute confidence." },
    founderStoryButtonText: { type: String, default: "Read My Full Story" },

    tier1Price: { type: String, default: "59.99" },
    tier1Features: {
      type: [String],
      default: [
        "16London Trend Algo V1",
        "Members Portal Access",
        "Full Video Course"
      ]
    },
    tier2Price: { type: String, default: "89.99" },
    tier2Features: {
      type: [String],
      default: [
        "16London Trend Algo V1",
        "London X System",
        "Members Portal Access",
        "Full Video Course"
      ]
    },
    tier3Price: { type: String, default: "119.99" },
    tier3Features: {
      type: [String],
      default: [
        "16London Trend Algo V1",
        "London X System",
        "16London ATM System",
        "Members Portal Access",
        "Complete Video Masterclass",
        "Future System Updates"
      ]
    },

    faqs: {
      type: [{ q: String, a: String }],
      default: [
        { q: "Is this a one-time payment?", a: "No, access is subscription-based monthly. Cancel anytime from your members portal." },
        { q: "Do I need TradingView Pro?", a: "A free TradingView account is sufficient, but Pro allows for more indicators on one chart." },
        { q: "How do I get access after payment?", a: "After checkout, you'll be asked for your TradingView username. Kazi will manually grant access within 24 hours." },
        { q: "Can I cancel anytime?", a: "Yes, cancel anytime through your PayPal subscription settings. No questions asked." },
        { q: "Are these indicators repaint?", a: "No. The 16London indicators are non-repainting. What you see is what you get." }
      ]
    },

    ctaTitle: { type: String, default: "Join 16London X Brands LLC Today." },
    ctaSubtitle: { type: String, default: "Stop guessing. Start trading with an institutional edge." },
    ctaButtonText: { type: String, default: "Choose Your Plan" },

    announcementActive: { type: Boolean, default: false },
    announcementText: { type: String, default: "🔥 FLASH SALE: Use code LONDON15 for 15% OFF your first month!" },
    announcementLink: { type: String, default: "/#pricing" }
  },
  { timestamps: true }
);

export const SiteContent = mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
