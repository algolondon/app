"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { name: "Indicator Suite", href: "/#indicator-suite" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "What Members Get", href: "/#what-members-get" },
  { name: "4 Golden Rules", href: "/#golden-rules" },
  { name: "About Kazi", href: "/#about-kazi" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Update active section
      const sections = navLinks.map(link => link.href.split('#')[1]);
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= 100) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-center w-full px-4 sm:px-6 pt-4 transition-all duration-500 pointer-events-none">
        <nav 
          className={`pointer-events-auto w-full max-w-[1280px] transition-all duration-500 rounded-full border ${
            isScrolled 
              ? "bg-[#030914]/85 backdrop-blur-xl border-[#00D4FF]/20 shadow-[0_8px_32px_rgba(0,212,255,0.1)] py-2 px-6 sm:px-8" 
              : "bg-[#030914]/80 backdrop-blur-md border-[#00D4FF]/10 py-3 px-6 sm:px-8"
          }`}
        >
          <div className="w-full flex items-center justify-between transition-all duration-300">
          
          {/* LEFT: Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="relative h-[80px] w-auto flex items-center py-2">
              <Image 
                src="/images/new_assets/Trasparent Logo.png" 
                alt="16London Algo" 
                width={280} 
                height={80} 
                className="h-full w-auto object-contain"
                priority
              />
              {/* Fallback for smaller screens if SVG fails or just to meet requirements */}
              <div className="sm:hidden flex items-center gap-1.5 font-bold text-foreground text-[15px] tracking-wider">
                <span className="bg-[#00D4FF] text-background px-1.5 py-0.5 rounded-[4px] leading-none">16</span>
                LONDON
              </div>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative group text-[14px] font-medium transition-colors text-foreground/75 hover:text-foreground"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {link.name}
                
                {/* Hover underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D4FF] transition-all duration-300 group-hover:w-full"></span>
                
                {/* Active dot */}
                {activeSection === link.href.split('#')[1] && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4FF]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* RIGHT: CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Removed ThemeToggle since we're forcing dark mode */}
            
            {session ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-[#00D4FF] text-[#0A1628] font-bold flex items-center justify-center text-lg hover:brightness-110 transition-all"
                >
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </button>
                
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-foreground/10 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                    >
                      <Link href="/members-portal" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5">
                        Dashboard
                      </Link>
                      <Link href="/course-library" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5">
                        Course Library
                      </Link>
                      <Link href="https://paypal.com" target="_blank" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5">
                        My Subscription
                      </Link>
                      {(session.user as any)?.role === "admin" && (
                        <Link href="/admin" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-500/10 font-medium">
                          Admin Panel
                        </Link>
                      )}
                      <div className="h-px bg-foreground/10 my-1"></div>
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setIsProfileMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 font-bold"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center text-foreground font-bold px-4 py-[10px] hover:text-[#00D4FF] transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/#pricing" 
                  className="hidden sm:inline-flex items-center justify-center bg-[#00D4FF] text-[#0A1628] font-bold rounded-[8px] px-[20px] py-[10px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:shadow-[0_0_25px_rgba(0,212,255,0.6)]"
                >
                  Get Access Now
                </Link>
              </>
            )}
            
            <button 
              className="lg:hidden text-[#00D4FF] p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[100px] pb-6 z-40 bg-background border-b border-[#00D4FF]/20 shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground/80 hover:text-[#00D4FF] py-2 border-b border-foreground/5"
                >
                  {link.name}
                </Link>
              ))}
              {session ? (
                <>
                  <div className="h-px bg-foreground/10 my-2"></div>
                  <Link href="/members-portal" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground/80 hover:text-[#00D4FF] py-2">
                    Dashboard
                  </Link>
                  <Link href="/course-library" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground/80 hover:text-[#00D4FF] py-2">
                    Course Library
                  </Link>
                  {(session.user as any)?.role === "admin" && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-yellow-500 hover:text-yellow-400 py-2">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setIsMobileMenuOpen(false); }} className="text-lg font-bold text-red-500 py-2 text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 w-full text-center border border-[#00D4FF] text-[#00D4FF] font-bold rounded-[8px] px-4 py-3">
                    Login
                  </Link>
                  <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 w-full text-center bg-[#00D4FF] text-background font-bold rounded-[8px] px-4 py-3">
                    Get Access Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
