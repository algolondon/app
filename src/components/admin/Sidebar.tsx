"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Video, 
  Mail, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Palette,
  Sparkles
} from "lucide-react";
import Image from "next/image";
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
    { name: "Live Page Editor", href: "/admin/customizer", icon: Palette, badge: "Live" },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="16London" width={80} height={24} className="object-contain" priority />
          <span className="font-display font-bold text-lg text-white">Admin</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        bg-[#0A1628]/95 backdrop-blur-2xl border-r border-white/5 h-full flex flex-col z-50 transition-all duration-300 ease-in-out
        fixed left-0 top-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:static md:translate-x-0 shrink-0
        ${isCollapsed ? 'w-64 md:w-20' : 'w-64'}
      `}>
        
        {/* Desktop Header & Toggle */}
        <div className={`p-4 hidden md:flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} border-b border-white/5`}>
          <Link href="/" className="flex items-center gap-2 group" title="Return to Website">
            <Image src="/logo.png" alt="16London" width={100} height={30} className="object-contain group-hover:scale-105 transition-transform" priority />
            {!isCollapsed && <span className="font-display font-bold text-xl text-white whitespace-nowrap">Admin</span>}
          </Link>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-1.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Spacer */}
        <div className="h-16 md:hidden"></div>

        {/* Navigation Links */}
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-3.5'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/admin");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                title={item.name}
                className={`flex items-center gap-3 py-3 rounded-2xl transition-all font-medium text-sm ${
                  isCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  isActive 
                    ? "bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 shadow-[0_0_20px_rgba(0,212,255,0.15)] font-bold" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#00D4FF]" : "text-gray-400 group-hover:text-white"}`} />
                {!isCollapsed && (
                  <span className="whitespace-nowrap flex-1 flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Section */}
        <div className="p-3.5 border-t border-white/5">
          <button
            onClick={() => signOut({ redirect: false }).then(() => { window.location.href = "/" })}
            title="Sign Out"
            className={`flex items-center gap-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-colors text-sm font-semibold ${
              isCollapsed ? 'justify-center w-full' : 'px-4 w-full'
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
