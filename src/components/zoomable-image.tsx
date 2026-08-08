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
      // Lock background scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
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
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] transition-colors border border-white/10 z-50 pointer-events-auto shadow-2xl"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Magnified Image */}
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-[#030914] border border-[#00D4FF]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Mac style header in lightbox for premium look */}
                <div className="bg-[#061123] px-4 py-3 border-b border-[#00D4FF]/20 flex items-center gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                  <div className="ml-auto text-[10px] text-gray-500 font-mono uppercase tracking-widest truncate">{alt || "16LONDON TREND ALGO"}</div>
                </div>
                {/* Image Container - Switched from relative fill to standard image tag for better aspect ratio fitting */}
                <div className="w-full flex-1 relative bg-background/50 overflow-hidden flex items-center justify-center p-2 sm:p-4">
                  <img 
                    src={src} 
                    alt={alt}
                    className="max-w-full max-h-full object-contain rounded-lg"
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
