"use client";

import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fade in up animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
};

const SLIDES = [
  { 
    image: "/chart-screenshot-1.svg",
    pair: "XAUUSD",
    signal: "STRONG BUY",
    pips: "+240 PIPS",
    system: "Trend Algo V1",
    label: "EXAMPLE 1"
  },
  { 
    image: "/chart-screenshot-2.svg",
    pair: "NAS100",
    signal: "STRONG BUY", 
    pips: "+180 PIPS",
    system: "London X",
    label: "EXAMPLE 2"
  },
  { 
    image: "/chart-screenshot-1.svg",
    pair: "GBPUSD",
    signal: "SELL",
    pips: "+95 PIPS",
    system: "Trend Algo V1",
    label: "EXAMPLE 3"
  },
  { 
    image: "/chart-screenshot-2.svg",
    pair: "EURUSD",
    signal: "STRONG BUY",
    pips: "+130 PIPS",
    system: "London X",
    label: "EXAMPLE 4"
  },
  { 
    image: "/chart-screenshot-1.svg",
    pair: "XAUUSD",
    signal: "BUY",
    pips: "+310 PIPS",
    system: "ATM System",
    label: "EXAMPLE 5"
  },
  { 
    image: "/chart-screenshot-2.svg",
    pair: "US30",
    signal: "STRONG SELL",
    pips: "+220 PIPS",
    system: "Trend Algo V1",
    label: "EXAMPLE 6"
  }
];

export function AlgoInAction() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const getSignalBadgeColor = (signal: string) => {
    switch(signal) {
      case "STRONG BUY": return "bg-[#00FF88] text-background";
      case "BUY": return "bg-[#00D4FF] text-background";
      case "SELL": return "bg-[#FF6B35] text-foreground";
      case "STRONG SELL": return "bg-[#FF3B3B] text-foreground";
      default: return "bg-gray-500 text-foreground";
    }
  };

  return (
    <section id="algo-in-action" className="py-24 relative z-10 border-t border-[#00D4FF]/10 bg-background/50 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="text-[#00D4FF] font-bold tracking-[0.2em] text-xs uppercase mb-4">PRO ENVIRONMENTS</div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">Algo In Action</h2>
          <p className="text-muted-foreground dark:text-muted-foreground text-lg mx-auto max-w-[600px] leading-relaxed">
            Take a look at real TradingView setups powered by our institutional-grade indicator suite. Clean, precise, and highly actionable.
          </p>
        </motion.div>
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing pb-12" ref={emblaRef}>
          <div className="flex -ml-4 py-4">
            {SLIDES.map((slide, index) => {
              const isActive = index === selectedIndex;
              return (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] sm:flex-[0_0_65%] lg:flex-[0_0_33.333%] pl-4 transition-all duration-500 ease-out"
                  style={{
                    transform: isActive ? "scale(1.05)" : "scale(0.92)",
                    opacity: isActive ? 1 : 0.6,
                    zIndex: isActive ? 10 : 0
                  }}
                >
                  <div className="bg-background border border-[#00D4FF]/25 rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.1)] overflow-hidden h-full flex flex-col">
                    {/* Window Chrome Bar */}
                    <div className="bg-muted px-4 py-3 flex items-center justify-between border-b border-[#00D4FF]/20">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                      </div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                        TRADINGVIEW.COM
                      </div>
                      <div className="w-12"></div> {/* Spacer to center title */}
                    </div>

                    {/* Chart Image Placeholder */}
                    <div className="relative aspect-[16/9] w-full bg-muted">
                      {/* TODO: Replace placeholder SVGs with real TradingView screenshots from Carl when received. */}
                      {/* Images go in: public/trades/trade-1.jpg etc. */}
                      <Image 
                        src={slide.image} 
                        alt={`${slide.pair} Trade Setup`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Card Footer */}
                    <div className="bg-card p-4 lg:p-6 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-muted-foreground font-medium text-sm">16London {slide.system}</span>
                        <span className="text-foreground font-bold tracking-wide">{slide.pair}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${getSignalBadgeColor(slide.signal)}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                          {slide.signal} SIGNAL CONFIRMED
                        </div>
                        <div className="bg-[#00D4FF]/20 text-[#00D4FF] px-3 py-1.5 rounded-full text-xs font-bold border border-[#00D4FF]/30">
                          {slide.pips}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={scrollPrev}
          className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-foreground/10 flex items-center justify-center text-[#00D4FF] hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all z-20 backdrop-blur-sm shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={scrollNext}
          className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-foreground/10 flex items-center justify-center text-[#00D4FF] hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all z-20 backdrop-blur-sm shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dot Navigation */}
        <div className="flex justify-center items-center gap-3 mt-4">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? "w-5 bg-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.5)]" 
                  : "w-2 bg-gray-600 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
