"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ZoomableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function ZoomableImage({ src, alt, width = 800, height = 600, className = "", priority = false }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`relative group cursor-zoom-in overflow-hidden ${className}`}
      >
        <Image 
          src={src} 
          alt={alt} 
          width={width} 
          height={height} 
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority={priority}
        />
        {/* Hover overlay badge */}
        <div className="absolute inset-0 bg-[#00D4FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-[#030914]/90 text-[#00D4FF] border border-[#00D4FF]/30 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-mono shadow-2xl backdrop-blur-sm">
            <ZoomIn className="w-4 h-4" />
            <span>TAP TO ZOOM</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] transition-colors border border-white/10 z-50 pointer-events-auto shadow-2xl"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Magnified Image */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-[#030914] border border-[#00D4FF]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                {/* Mac style header in lightbox for premium look */}
                <div className="bg-[#061123] px-4 py-3 border-b border-[#00D4FF]/20 flex items-center gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                  <div className="ml-auto text-[10px] text-gray-500 font-mono uppercase tracking-widest">{alt || "16LONDON TREND ALGO"}</div>
                </div>
                {/* Image Container */}
                <div className="w-full flex-1 relative p-4 bg-background/50">
                  <Image 
                    src={src} 
                    alt={alt}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
