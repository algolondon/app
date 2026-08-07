"use client";

import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MockupFrame } from "./mockup-frame";

// Fade in up animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
};

const SLIDES = [
  { image: "/images/new_assets/Tesitmonial Review 1.png" },
  { image: "/images/new_assets/Testimonial Review 2.png" },
  { image: "/images/new_assets/Test review 3.png" },
  { image: "/images/new_assets/Testimonal 4.png" }
];

export function AlgoInAction() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="testimonials-carousel" className="py-24 relative z-10 border-t border-[#00D4FF]/10 bg-background/50 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="text-[#00D4FF] font-bold tracking-[0.2em] text-xs uppercase mb-4">MEMBER SUCCESS</div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">Real Traders. Real Results.</h2>
          <p className="text-muted-foreground dark:text-muted-foreground text-lg mx-auto max-w-[600px] leading-relaxed">
            Don't just take our word for it. See what our community is achieving. Click to view clearly.
          </p>
        </motion.div>
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing pb-12" ref={emblaRef}>
          <div className="flex -ml-4 py-4">
            {SLIDES.map((slide, index) => {
              const isActive = index === selectedIndex;
              return (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] sm:flex-[0_0_80%] lg:flex-[0_0_50%] pl-4 transition-all duration-500 ease-out"
                  style={{
                    transform: isActive ? "scale(1.02)" : "scale(0.95)",
                    opacity: isActive ? 1 : 0.5,
                    zIndex: isActive ? 10 : 0
                  }}
                  onClick={() => setLightboxImage(slide.image)}
                >
                  <MockupFrame title={`TESTIMONIAL REVIEW 0${index + 1}`} className="h-[500px] cursor-pointer hover:shadow-[0_0_60px_rgba(0,212,255,0.2)] transition-shadow">
                    <div className="w-full h-full relative p-2">
                      <Image 
                        src={slide.image} 
                        alt={`Testimonial ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </MockupFrame>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={scrollPrev}
          className="absolute left-4 sm:left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-foreground/10 flex items-center justify-center text-[#00D4FF] hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all z-20 backdrop-blur-sm shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={scrollNext}
          className="absolute right-4 sm:right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-foreground/10 flex items-center justify-center text-[#00D4FF] hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all z-20 backdrop-blur-sm shadow-xl"
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] transition-colors border border-white/10 z-50"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <MockupFrame title="16LONDON ALGO · TESTIMONIAL VIEW" className="w-full h-full">
                <div className="w-full h-full relative p-4">
                  <Image 
                    src={lightboxImage} 
                    alt="Testimonial Expanded"
                    fill
                    className="object-contain"
                  />
                </div>
              </MockupFrame>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
