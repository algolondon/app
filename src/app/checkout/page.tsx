"use client";

import { useState, Suspense, useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { signIn } from 'next-auth/react';

const paypalPlanIds = {
  "1": "P-5EX01767RJ348304XNJ3LHYA", 
  "2": "P-2TU154698S017735HNJ3LJQA",
  "3": "P-1RM14190S6572145FNJ3LKIY"
};

const tierDetails = {
  "1": {
    name: "16London Trend Algo",
    price: "$59.99/mo",
    features: [
      "16London Trend Algo V1",
      "Members Portal Access",
      "Full Video Course"
    ]
  },
  "2": {
    name: "Trend Algo + London X",
    price: "$89.99/mo",
    features: [
      "16London Trend Algo V1",
      "London X System",
      "Members Portal Access",
      "Full Video Course"
    ]
  },
  "3": {
    name: "16London Complete System",
    price: "$119.99/mo",
    features: [
      "16London Trend Algo V1",
      "London X System",
      "16London ATM System",
      "Members Portal Access",
      "Complete Video Masterclass",
      "Future System Updates"
    ]
  }
};

function CheckoutContent() {
  const router = useRouter();
  const posthog = usePostHog();
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') || "1";
  
  const selectedTier = tierDetails[tier as keyof typeof tierDetails] || tierDetails["1"];
  const planId = paypalPlanIds[tier as keyof typeof paypalPlanIds] || paypalPlanIds["1"];
  
  useEffect(() => {
    posthog?.capture('checkout_started', { tier, planId });
  }, [posthog, tier, planId]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          tier: `tier${tier}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to register");
      }

      setRegisteredEmail(formData.email);
      setIsRegistered(true);
      posthog?.capture('account_created_before_payment', { email: formData.email, planId });
    } catch (error: any) {
      if (error.message.includes("exists")) {
        setServerError("Account exists. Login instead.");
      } else {
        setServerError(error.message);
      }
      setIsSubmitting(false);
    }
  };

  const handlePayPalSuccess = async () => {
    try {
      await fetch('/api/checkout/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail })
      });
      
      // Auto login user
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      router.push('/thank-you');
    } catch (e) {
      console.error("Failed to update status after payment", e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* LEFT - Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-3xl font-display font-bold text-[#00D4FF] mb-2">You Selected:</h2>
            <p className="text-2xl font-semibold">{selectedTier.name} — {selectedTier.price}</p>
          </div>
          
          <div className="glass-panel rounded-2xl p-8 border border-[#00D4FF]/20 shadow-[0_0_30px_rgba(0,212,255,0.05)]">
            <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-4">What's Included:</h3>
            <ul className="space-y-4">
              {selectedTier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="w-5 h-5 text-[#00D4FF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-foreground/5 p-4 rounded-xl border border-foreground/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span>Secured by PayPal · Cancel Anytime</span>
          </div>
        </motion.div>

        {/* RIGHT - Registration / Payment */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-8 lg:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF] rounded-full blur-[100px] opacity-10 pointer-events-none" />

          <div className="relative z-10">
            {!isRegistered ? (
              <>
                <h2 className="text-3xl font-display font-bold mb-2">Create Your Account</h2>
                <p className="text-muted-foreground mb-8">Set up your login before proceeding to payment.</p>

                {serverError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center justify-between">
                    <span>{serverError}</span>
                    {serverError.includes("Account exists") && (
                      <Link href="/login" className="text-white underline font-semibold text-sm hover:text-[#00D4FF]">
                        Login
                      </Link>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-background border ${errors.name ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-background border ${errors.email ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full bg-background border ${errors.password ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="Min 8 characters"
                    />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full bg-background border ${errors.confirmPassword ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="Must match password"
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#00D4FF] hover:bg-[#00B8D9] text-[#0A1628] font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0A1628]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>Continue to Payment &rarr;</>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-display font-bold mb-2">Complete Payment</h2>
                <p className="text-muted-foreground mb-8">Subscribe securely using PayPal or Card.</p>
                <div className="space-y-6">
                  
                  {/* Stripe Payment Button */}
                  <div className="bg-white/5 border border-foreground/10 p-6 rounded-xl flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-4">Credit / Debit Card</h3>
                    <button
                      onClick={async () => {
                        posthog?.capture('checkout_stripe_clicked', { planId });
                        try {
                          const res = await fetch("/api/stripe/create-checkout-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: formData.email, tier })
                          });
                          const data = await res.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            alert(data.error || "Failed to initiate Stripe checkout");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Failed to connect to Stripe.");
                        }
                      }}
                      className="w-full bg-[#635BFF] hover:bg-[#5249ea] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0zm0 2c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18S29.941 2 20 2zm8.745 13.922c0-1.637-1.32-2.91-3.08-2.91-1.748 0-3.111 1.258-3.111 2.91 0 1.638 1.348 2.872 3.097 2.872 1.66 0 3.094-1.233 3.094-2.872zM14.62 14.86c-.958 0-1.688.756-1.688 1.83 0 1.055.73 1.808 1.688 1.808.97 0 1.69-.753 1.69-1.808 0-1.074-.72-1.83-1.69-1.83zm-2.072 6.837h4.143V31H12.55V21.7z" fillRule="evenodd" clipRule="evenodd"/></svg>
                      Pay with Stripe
                    </button>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-foreground/10"></div>
                    <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">or pay with</span>
                    <div className="flex-grow border-t border-foreground/10"></div>
                  </div>

                  {/* PayPal Container */}
                  <div className="bg-white p-4 rounded-xl">
                    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", vault: true }}>
                      <PayPalButtons 
                        createSubscription={(data, actions) => {
                          return actions.subscription.create({
                            plan_id: planId
                          });
                        }}
                        onApprove={async (data, actions) => {
                          posthog?.capture('checkout_paypal_success', { planId, subscriptionId: data.subscriptionID });
                          await handlePayPalSuccess();
                        }}
                        style={{ layout: "vertical", shape: "pill", color: "gold", label: "subscribe" }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </>
  );
}
