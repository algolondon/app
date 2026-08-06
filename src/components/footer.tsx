"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 w-full bg-[#030914] pt-20 pb-10 overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent"></div>
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="mb-6">
              <div className="relative h-[40px] w-auto flex items-center">
                <Image 
                  src="/logo.svg" 
                  alt="16London & Co" 
                  width={160} 
                  height={45} 
                  className="h-[40px] w-auto hidden sm:block" 
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
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-[#00D4FF] hover:text-background transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-[#00D4FF] hover:text-background transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-[#00D4FF] hover:text-background transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Platform</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/#indicator-suite" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Indicator Suite</Link></li>
              <li><Link href="/#how-it-works" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">How it Works</Link></li>
              <li><Link href="/#pricing" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Member Login</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Company</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/#about-carl" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">About Carl</Link></li>
              <li><Link href="/#faq" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">FAQ</Link></li>
              <li><Link href="mailto:support@16londonalgo.com" className="text-muted-foreground hover:text-[#00D4FF] transition-colors text-sm">Contact Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest market insights and algorithm updates straight to your inbox.
            </p>
            <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
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
