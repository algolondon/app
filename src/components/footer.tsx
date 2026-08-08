"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative z-10 w-full bg-[#030914] pt-20 pb-10 overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent"></div>
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-2 lg:col-span-6 pr-0 md:pr-12 flex flex-col">
            <Link href="/" className="mb-6">
              <div className="relative h-[80px] w-auto flex items-center py-2">
                <Image 
                  src="/images/new_assets/Trasparent Logo.png" 
                  alt="16London X Brands LLC" 
                  width={320} 
                  height={80} 
                  className="h-full w-auto hidden sm:block object-contain" 
                />
                <div className="sm:hidden flex items-center gap-1.5 font-bold text-foreground text-[18px] tracking-wider">
                  <span className="bg-[#00D4FF] text-background px-2 py-0.5 rounded-[4px] leading-none">16</span>
                  LONDON
                </div>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
              Built for Legacy. Designed for Wealth. Institutional-grade trading algorithms and education for the serious trader.
            </p>
            <div className="flex items-center gap-4 mb-12">
              <a href="https://t.me/+QJ-dznDcXGFmODJh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-[#00D4FF] hover:text-background transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </a>
              <a href="https://www.tiktok.com/@16londonalgo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-[#00D4FF] hover:text-background transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
              <a href="https://tradingview.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-[#00D4FF] hover:text-background transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3H3v18h18V3zM3 13.5h7.5V21H3v-7.5zM13.5 13.5H21V21h-7.5v-7.5zM13.5 3H21v7.5h-7.5V3zM3 3h7.5v7.5H3V3z"/></svg>
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Stay Updated</h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-sm">
                Get the latest market insights and algorithm updates straight to your inbox.
              </p>
              <form className="flex items-center gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    name="email"
                    id="newsletter-email"
                    placeholder="Enter your email" 
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-[#00D4FF] transition-colors"
                  />
                </div>
                <button className="bg-[#00D4FF] hover:bg-[#00B3D6] text-background font-bold py-2.5 px-6 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:pl-12">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Platform</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/#indicator-suite" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Indicator Suite</Link></li>
              <li><Link href="/#how-it-works" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">How it Works</Link></li>
              <li><Link href="/#pricing" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Member Login</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Company</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/#about-kazi" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">About Kazi</Link></li>
              <li><Link href="/#faq" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">FAQ</Link></li>
              <li><Link href="mailto:support@16londonalgo.com" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} 16London X Brands LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-[#00D4FF] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#00D4FF] transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-[#00D4FF] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
