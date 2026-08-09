"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Navbar } from "@/components/navbar";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") ? "Invalid credentials. Please try again." : "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        // Fetch session to check role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        let callbackUrl = searchParams.get("callbackUrl") || "/members-portal";
        if (session?.user?.role === 'admin' && callbackUrl === "/members-portal") {
          callbackUrl = "/admin";
        }
        
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-background overflow-x-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 bg-[#00D4FF] blur-[150px] opacity-10 rounded-full w-[500px] h-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-card border border-[#00D4FF]/20 p-10 rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.1)] relative z-10 -mt-16"
      >
        <div className="flex flex-col items-center">
          <Link href="/">
            <Image src="/images/new_assets/trasparent-logo.png" alt="16London X Brands LLC" width={340} height={100} className="h-20 w-auto mb-6 object-contain" />
          </Link>
          <h2 className="mt-2 text-center text-3xl font-display font-bold text-foreground">
            Member Login
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your credentials to access the portal.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md text-center font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-foreground/10 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent sm:text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-foreground/10 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent sm:text-sm"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-background bg-[#00D4FF] hover:bg-[#00B3D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00D4FF] transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Login to Your Account"
              )}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <Link href="/forgot-password" className="font-medium text-[#00D4FF] hover:text-[#00B3D6] transition-colors">
              Forgot password? Reset it here
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-[#00D4FF]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
