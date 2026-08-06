"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAMES_ARRAY = [
  { initials: "MK", name: "Marcus K.", country: "Germany", tier: "All Indicators + Course" },
  { initials: "JT", name: "James T.", country: "United States", tier: "Trend Algo + London X" },
  { initials: "RP", name: "Raj P.", country: "United Kingdom", tier: "Trend Algo" },
  { initials: "AL", name: "Andre L.", country: "Canada", tier: "All Indicators + Course" },
  { initials: "SM", name: "Sarah M.", country: "Australia", tier: "Trend Algo + London X" },
  { initials: "DK", name: "David K.", country: "South Africa", tier: "All Indicators + Course" }
];

export function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [minutesAgo, setMinutesAgo] = useState(5);

  useEffect(() => {
    // Hidden on page load, start after 2 seconds
    const initialDelay = setTimeout(() => {
      showNext();
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNext = () => {
    setMinutesAgo(Math.floor(Math.random() * 8) + 1); // 1-8 mins
    setIsVisible(true);

    // Show for 4 seconds, then slide out
    setTimeout(() => {
      setIsVisible(false);

      // After 3 second gap, show next name
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % NAMES_ARRAY.length);
        showNext();
      }, 3000);
    }, 4000);
  };

  const currentPerson = NAMES_ARRAY[currentIndex];

  return (
    <div className="fixed bottom-0 left-0 z-[9999] m-[0_0_24px_24px] pointer-events-none hidden lg:block">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-white dark:bg-card text-black dark:text-foreground p-4 rounded-xl shadow-2xl flex items-center gap-4 border border-gray-100 dark:border-[#00D4FF]/20 max-w-sm pointer-events-auto"
          >
            <div className="w-12 h-12 bg-[#00D4FF] rounded-full flex items-center justify-center text-background font-bold text-lg shrink-0">
              {currentPerson.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm sm:text-base">{currentPerson.name} ({currentPerson.country})</span>
                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-bold">✓ VERIFIED</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground mb-1">Subscribed to {currentPerson.tier}</div>
              <div className="text-xs text-muted-foreground dark:text-gray-500">{minutesAgo} minute{minutesAgo !== 1 ? 's' : ''} ago</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
