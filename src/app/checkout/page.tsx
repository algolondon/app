"use client";

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { signIn, useSession } from 'next-auth/react';

// Plan IDs are fetched dynamically from /api/paypal-config based on live/sandbox mode

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
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') || "1";
  
  const selectedTier = tierDetails[tier as keyof typeof tierDetails] || tierDetails["1"];

  const [paypalConfig, setPaypalConfig] = useState<{
    mode: string;
    clientId: string;
    planIds: Record<string, string>;
    discountPlanIds?: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    fetch('/api/paypal-config')
      .then(r => r.json())
      .then(data => setPaypalConfig(data))
      .catch(() => setPaypalConfig({
        mode: 'live',
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        planIds: {
          "1": "P-5EX01767RJ348304XNJ3LHYA",
          "2": "P-2TU154698S017735HNJ3LJQA",
          "3": "P-1RM14190S6572145FNJ3LKIY",
        },
        discountPlanIds: {
          "1": "P-5EX01767RJ348304XNJ3LHYA",
          "2": "P-2TU154698S017735HNJ3LJQA",
          "3": "P-1RM14190S6572145FNJ3LKIY",
        }
      }));
  }, []);

  const coupon = searchParams.get('coupon')?.toUpperCase() || "";
  const isDiscountApplied = coupon === "LONDON15";

  const planId = isDiscountApplied
    ? (paypalConfig?.discountPlanIds?.[tier] || paypalConfig?.planIds?.[tier] || '')
    : (paypalConfig?.planIds?.[tier] || '');

  const getPromoDetails = () => {
    if (!isDiscountApplied) return null;
    switch (tier) {
      case "1": return { promoPrice: "$50.99", desc: "First month discounted by 15%" };
      case "2": return { promoPrice: "$76.49", desc: "First month discounted by 15%" };
      case "3": return { promoPrice: "$101.99", desc: "First month discounted by 15%" };
      default: return null;
    }
  };

  const promo = getPromoDetails();

  useEffect(() => {
    // Analytics removed
  }, [tier, planId, coupon]);

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
  
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setIsRegistered(true);
      setRegisteredEmail(session.user.email);
    }
  }, [status, session]);

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
      

    } catch (error: any) {
      if (error.message.includes("exists")) {
        setServerError("Account exists. Login instead.");
      } else {
        setServerError(error.message);
      }
      setIsSubmitting(false);
    }
  };

  const handlePayPalSuccess = async (subscriptionId?: string) => {
    try {
      const emailToActivate = registeredEmail || formData.email;

      // 1. Immediately activate account in database
      if (emailToActivate) {
        await fetch('/api/checkout/success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailToActivate,
            subscriptionId: subscriptionId || null,
            tier: tier
          })
        });
      }

      // 2. Sign in user to create active session
      if (formData.email && formData.password) {
        await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password
        });
      }

      router.push('/thank-you');
    } catch (e) {
      console.error("Failed to process payment success", e);
      router.push('/thank-you');
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
            <div className="text-2xl font-semibold">
              {selectedTier.name} —{" "}
              {promo ? (
                <span className="inline-block">
                  <span className="line-through text-muted-foreground mr-2">{selectedTier.price}</span>
                  <span className="text-[#00D4FF]">{promo.promoPrice} for 1st month</span>
                  <span className="text-xs text-muted-foreground block mt-1 font-normal">Then standard {selectedTier.price} applies automatically.</span>
                </span>
              ) : (
                selectedTier.price
              )}
            </div>
            
            {promo && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs font-semibold flex items-center gap-2 max-w-md">
                <span className="bg-green-500 text-black px-1.5 py-0.5 rounded-[4px] font-extrabold text-[9px] tracking-wide shrink-0">COUPON APPLIED</span>
                <span>Code "{coupon}" has successfully locked in your 15% first-month discount!</span>
              </div>
            )}
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
                      <Link href={`/login?callbackUrl=/checkout?tier=${tier}`} className="text-white underline font-semibold text-sm hover:text-[#00D4FF]">
                        Login to Complete Purchase
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
                      id="checkout-name"
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full bg-background border ${errors.name ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p id="name-error" className="text-red-400 text-sm mt-1" role="alert">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="checkout-email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full bg-background border ${errors.email ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="yourname@email.com"
                    />
                    {errors.email && <p id="email-error" className="text-red-400 text-sm mt-1" role="alert">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="checkout-password"
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      className={`w-full bg-background border ${errors.password ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="Min 8 characters"
                    />
                    {errors.password && <p id="password-error" className="text-red-400 text-sm mt-1" role="alert">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="checkout-confirm-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                      className={`w-full bg-background border ${errors.confirmPassword ? 'border-red-500' : 'border-foreground/20'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all`}
                      placeholder="Must match password"
                    />
                    {errors.confirmPassword && <p id="confirm-password-error" className="text-red-400 text-sm mt-1" role="alert">{errors.confirmPassword}</p>}
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
                <div className="flex items-center gap-3 mb-8">
                  <p className="text-muted-foreground">Subscribe securely with PayPal.</p>
                  {paypalConfig?.mode === 'sandbox' && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-medium">
                      🧪 SANDBOX — Test Mode
                    </span>
                  )}
                </div>
                <div className="space-y-6">
                  
                  {/* PayPal Container */}
                  <div className="bg-white p-4 rounded-xl min-h-[120px]">
                    {!paypalConfig ? (
                      <div className="space-y-3 animate-pulse py-2">
                        {/* Skeleton mimics PayPal button shape */}
                        <div className="w-full h-[45px] bg-[#FFC439]/30 rounded-full" />
                        <div className="flex items-center gap-2 justify-center py-1">
                          <div className="h-px flex-1 bg-gray-200" />
                          <div className="h-3 w-16 bg-gray-200 rounded" />
                          <div className="h-px flex-1 bg-gray-200" />
                        </div>
                        <div className="w-full h-[45px] bg-gray-100 rounded-full" />
                      </div>
                    ) : (
                      <PayPalScriptProvider 
                        key={paypalConfig.clientId}
                        options={{ 
                          clientId: paypalConfig.clientId || 'test', 
                          vault: true,
                          intent: 'subscription'
                        }}
                      >
                        <PayPalButtons 
                          createSubscription={(data, actions) => {
                            return actions.subscription.create({
                              plan_id: planId
                            });
                          }}
                          onApprove={async (data, actions) => {
                            // Analytics removed
                            await handlePayPalSuccess(data.subscriptionID || undefined);
                          }}
                          style={{ layout: "vertical", shape: "pill", color: "gold", label: "subscribe" }}
                        />
                      </PayPalScriptProvider>
                    )}
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
