import connectToDatabase from "@/lib/db";
import { SiteContent } from "@/models/SiteContent";
import { LiveVisualCustomizer, SiteContentData } from "@/components/admin/LiveVisualCustomizer";

export const dynamic = 'force-dynamic';

export default async function AdminCustomizerPage() {
  let content: SiteContentData = {
    marqueeText: "🟢 EURUSD: STRONG BUY SIGNAL CONFIRMED  🟢 XAUUSD: BUY SIGNAL @ 2420.50 (+240 PIPS)  🟢 16LONDON TREND ALGO V1: INTRADAY EMA 87 BULLISH  🟢 GBPUSD: LONDON X BREAKOUT CONFIRMED",
    tagline: "8 YEAR PROVEN TRADING SYSTEMS",
    heroTitle: "Built for Legacy.",
    heroTitleGradient: "Designed for Wealth.",
    heroSubtitle: "Institutional grade trading algorithms built for serious traders. 8 years of live market experience distilled into proprietary TradingView tools plus complete masterclass.",
    heroYearsTrading: "8+ Years",
    heroRevenue: "$3,486",
    heroNumberOfAlgos: "3 Algos",

    trendAlgoTitle: "16London Trend ALGO™",
    trendAlgoDesc: "Our flagship indicator. Visually maps the market trend so you never trade against momentum. Multi-timeframe dashboard built in.",
    trendAlgoBadge: "MOST POPULAR",
    londonXTitle: "London X System",
    londonXDesc: "Designed specifically for the London session breakout. Captures explosive moves with pinpoint accuracy. Perfect for early morning traders.",
    atmSystemTitle: "16London ATM System™",
    atmSystemDesc: "ATM stands for Accumulation, Trap, Manipulation. Identifies institutional footprints before the big move. Advanced entries only.",

    rules: [
      "Only trade in the direction of the Trend Algo",
      "Wait for multi-timeframe confirmation",
      "Never risk more than 1% per trade",
      "No trades during high-impact news events"
    ],
    founderName: "Kazi",
    founderTitle: "Founder of 16London Trend Algo",
    founderBio: "I'm Kaziyel, born and raised in Miami, Florida. After 8+ years in the trenches of the financial markets, I realized that consistency doesn't come from flashy indicators—it comes from structure, discipline, and a proven process. I built the 16London Trend Algo to remove the guesswork and help you trade with absolute confidence.",
    founderStoryButtonText: "Read My Full Story",

    tier1Price: "59.99",
    tier1Features: ["16London Trend Algo V1", "Members Portal Access", "Full Video Course"],
    tier2Price: "89.99",
    tier2Features: ["16London Trend Algo V1", "London X System", "Members Portal Access", "Full Video Course"],
    tier3Price: "119.99",
    tier3Features: ["16London Trend Algo V1", "London X System", "16London ATM System", "Members Portal Access", "Complete Video Masterclass", "Future System Updates"],

    faqs: [
      { q: "Is this a one-time payment?", a: "No, access is subscription-based monthly. Cancel anytime from your members portal." },
      { q: "Do I need TradingView Pro?", a: "A free TradingView account is sufficient, but Pro allows for more indicators on one chart." },
      { q: "How do I get access after payment?", a: "After checkout, you'll be asked for your TradingView username. Kazi will manually grant access within 24 hours." },
      { q: "Can I cancel anytime?", a: "Yes, cancel anytime through your PayPal subscription settings. No questions asked." },
      { q: "Are these indicators repaint?", a: "No. The 16London indicators are non-repainting. What you see is what you get." }
    ],

    ctaTitle: "Join 16London X Brands LLC Today.",
    ctaSubtitle: "Stop guessing. Start trading with an institutional edge.",
    ctaButtonText: "Choose Your Plan",

    announcementActive: false,
    announcementText: "🔥 FLASH SALE: Use code LONDON15 for 15% OFF your first month!",
    announcementLink: "/#pricing"
  };

  try {
    await connectToDatabase();
    const doc = await SiteContent.findOne().lean();
    if (doc) {
      content = {
        marqueeText: doc.marqueeText || content.marqueeText,
        tagline: doc.tagline || content.tagline,
        heroTitle: doc.heroTitle || content.heroTitle,
        heroTitleGradient: doc.heroTitleGradient || content.heroTitleGradient,
        heroSubtitle: doc.heroSubtitle || content.heroSubtitle,
        heroYearsTrading: doc.heroYearsTrading || content.heroYearsTrading,
        heroRevenue: doc.heroRevenue || content.heroRevenue,
        heroNumberOfAlgos: doc.heroNumberOfAlgos || content.heroNumberOfAlgos,

        trendAlgoTitle: doc.trendAlgoTitle || content.trendAlgoTitle,
        trendAlgoDesc: doc.trendAlgoDesc || content.trendAlgoDesc,
        trendAlgoBadge: doc.trendAlgoBadge || content.trendAlgoBadge,
        londonXTitle: doc.londonXTitle || content.londonXTitle,
        londonXDesc: doc.londonXDesc || content.londonXDesc,
        atmSystemTitle: doc.atmSystemTitle || content.atmSystemTitle,
        atmSystemDesc: doc.atmSystemDesc || content.atmSystemDesc,

        rules: doc.rules && doc.rules.length ? doc.rules : content.rules,
        founderName: doc.founderName || content.founderName,
        founderTitle: doc.founderTitle || content.founderTitle,
        founderBio: doc.founderBio || content.founderBio,
        founderStoryButtonText: doc.founderStoryButtonText || content.founderStoryButtonText,

        tier1Price: doc.tier1Price || content.tier1Price,
        tier1Features: doc.tier1Features || content.tier1Features,
        tier2Price: doc.tier2Price || content.tier2Price,
        tier2Features: doc.tier2Features || content.tier2Features,
        tier3Price: doc.tier3Price || content.tier3Price,
        tier3Features: doc.tier3Features || content.tier3Features,

        faqs: doc.faqs && doc.faqs.length ? doc.faqs : content.faqs,

        ctaTitle: doc.ctaTitle || content.ctaTitle,
        ctaSubtitle: doc.ctaSubtitle || content.ctaSubtitle,
        ctaButtonText: doc.ctaButtonText || content.ctaButtonText,

        announcementActive: Boolean(doc.announcementActive),
        announcementText: doc.announcementText || content.announcementText,
        announcementLink: doc.announcementLink || content.announcementLink
      };
    }
  } catch (err) {
    console.error("Failed to load site content in admin:", err);
  }

  return <LiveVisualCustomizer initialContent={content} />;
}
