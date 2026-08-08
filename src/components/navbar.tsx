"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { name: "Indicator Suite", href: "/#indicator-suite" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "What Members Get", href: "/#what-members-get" },
  { name: "4 Golden Rules", href: "/#golden-rules" },
  { name: "About Kazi", href: "/about" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = navLinks.map(link => link.href.split('#')[1]).filter(Boolean);
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
      {/* ── TOP NAV BAR ── */}
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
            <Link href="/" className="shrink-0 flex items-center">
              <div className="relative h-[60px] sm:h-[80px] w-auto flex items-center py-1">
                <Image
                  src="/images/new_assets/Trasparent Logo.png"
                  alt="16London Algo"
                  width={220}
                  height={60}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            {/* CENTER: Navigation Links (desktop only) */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative group text-[14px] font-medium transition-colors text-foreground/75 hover:text-foreground"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D4FF] transition-all duration-300 group-hover:w-full" />
                  {activeSection === link.href.split('#')[1] && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                  )}
                </Link>
              ))}
            </div>

            {/* RIGHT: Auth buttons + Hamburger */}
            <div className="flex items-center gap-3">
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
                        <div className="h-px bg-foreground/10 my-1" />
                        <button
                          onClick={() => { signOut({ redirect: false }).then(() => { window.location.href = "/"; }); setIsProfileMenuOpen(false); }}
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

              {/* Hamburger — mobile only */}
              <button
                className="lg:hidden text-[#00D4FF] p-2 -mr-2 touch-manipulation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── MOBILE FULL-SCREEN OVERLAY MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in panel from the right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-[#0A1628] border-l border-[#00D4FF]/20 shadow-2xl lg:hidden flex flex-col overflow-y-auto"
            >
              {/* Close button */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-[#00D4FF] font-bold text-lg">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white p-1 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col px-6 py-4 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-base font-medium text-white/80 hover:text-[#00D4FF] py-3 border-b border-white/5 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Auth section */}
                <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                  {session ? (
                    <>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">My Account</div>
                      <Link href="/members-portal" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-white/80 hover:text-[#00D4FF] py-2 transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/course-library" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-white/80 hover:text-[#00D4FF] py-2 transition-colors">
                        Course Library
                      </Link>
                      {(session.user as any)?.role === "admin" && (
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-bold text-yellow-500 hover:text-yellow-400 py-2 transition-colors">
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut({ redirect: false }).then(() => { window.location.href = "/"; }); setIsMobileMenuOpen(false); }}
                        className="mt-2 w-full text-center bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-xl py-3 hover:bg-red-500/20 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-center border border-[#00D4FF] text-[#00D4FF] font-bold rounded-xl py-3 hover:bg-[#00D4FF]/10 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/#pricing"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-center bg-[#00D4FF] text-[#0A1628] font-bold rounded-xl py-3 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                      >
                        Get Access Now
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
