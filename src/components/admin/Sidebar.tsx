"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, ShieldAlert, Video, Mail, Menu, X, ChevronLeft, ChevronRight, Database } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Course Library", href: "/admin/courses", icon: Video },
    { name: "Broadcast", href: "/admin/broadcast", icon: Mail },
    { name: "Content CMS", href: "/studio", icon: Database },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A1628] border-b border-white/5 z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#00D4FF]" />
          <span className="font-display font-bold text-lg text-white">Admin</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        bg-[#0A1628] border-r border-white/5 h-screen flex flex-col z-50 transition-all duration-300 ease-in-out
        fixed left-0 top-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:sticky md:translate-x-0 shrink-0
        ${isCollapsed ? 'w-64 md:w-20' : 'w-64'}
      `}>
        
        {/* Desktop Header & Toggle */}
        <div className={`p-4 hidden md:flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} border-b border-white/5`}>
          <Link href="/" className="flex items-center gap-2" title="Admin Panel">
            <ShieldAlert className="w-8 h-8 text-[#00D4FF] shrink-0" />
            {!isCollapsed && <span className="font-display font-bold text-xl text-white whitespace-nowrap">Admin</span>}
          </Link>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Spacer */}
        <div className="h-16 md:hidden"></div>

        <nav className={`flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                title={item.name}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${
                  isActive 
                    ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#00D4FF]" : ""}`} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign Out"
            className={`flex items-center gap-3 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors ${isCollapsed ? 'justify-center w-full' : 'px-4 w-full'}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
}
