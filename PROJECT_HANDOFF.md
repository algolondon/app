# 16London Algo - Project Handoff & Context

**Welcome, future Agent/Claude!** 
If you are reading this, the user has switched accounts/models to continue development on this project. This document contains everything you need to know about what we have built so far, how the architecture works, and the core flows of the application.

---

## 1. Project Overview
This is a Next.js (App Router) SaaS web application for **16London X Brands LLC**. The platform sells proprietary TradingView algorithms (indicators) and video courses to traders. 

**Client/Owner Name:** Kazi
**Core Proposition:** Users subscribe to a tier, receive automated access to TradingView scripts (handled manually by Kazi via email alerts for now), and get access to a gated Members Portal and Video Course Library.

---

## 2. Tech Stack
*   **Framework:** Next.js (App Router)
*   **Styling:** TailwindCSS (with glassmorphism UI & custom glowing gradients)
*   **Animations:** Framer Motion
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** NextAuth.js (Credentials Provider)
*   **Payments:** Stripe (via Webhooks) & PayPal (via `@paypal/react-paypal-js`)
*   **Emails:** Resend
*   **Analytics:** PostHog

---

## 3. Database Schema (`src/models/`)
*   **User:** Stores `name`, `email`, `password` (bcrypt), `tier` (tier1, tier2, tier3), `tradingviewUsername`, `active` (boolean, indicates if they have paid), `role` (user/admin).
*   **Course:** Stores video courses (`title`, `url`, `order`, `isActive`).
*   **Setting:** Stores global config like `telegramLink` and `pdfLink`.
*   **SystemLog:** Used to log Stripe webhook errors or system events.

---

## 4. The Core Flows

### A. Authentication & Registration Flow
1. User goes to `/checkout?tier=1`.
2. If they are not logged in, they see a registration form. They submit Name, Email, and Password.
3. `/api/register` creates their account in MongoDB with `active: false`.
4. They are now presented with the Payment Buttons (Stripe & PayPal).

### B. SaaS Routing Logic (Recent Update)
We implemented standard SaaS gating logic:
*   Inactive users (`active: false`) **are allowed** to log in via NextAuth.
*   However, if an inactive user tries to access `/members-portal` or `/course-library`, the page instantly redirects them back to `/checkout?tier=${user.tier}`.
*   This prevents unpaid users from accessing gated content but allows them to log in to complete their purchase.

### C. Payment Integration
*   **Stripe:** 
    *   Creates a Checkout Session via `/api/stripe/create-checkout-session`.
    *   Listens for `checkout.session.completed` on `/api/stripe/webhook` to mark `active: true` in the DB and send Welcome emails.
*   **PayPal:** 
    *   Uses hardcoded `Plan IDs` generated from the client's PayPal Developer Dashboard.
    *   Renders Gold "Pill" shaped subscription buttons.
    *   On `onApprove`, it hits `/api/checkout/success` to mark `active: true` and logs the user in immediately.

### D. Abandoned Cart Flow
*   If a user starts a Stripe checkout but abandons it, Stripe fires a `checkout.session.expired` webhook.
*   Our webhook listener (`/api/stripe/webhook`) catches this and uses Resend to email the user a recovery link.
*   **Crucial Routing:** The recovery link points to `/login?callbackUrl=/checkout?tier=X`. This forces the user to log in first, which then gracefully redirects them to the checkout page where the payment buttons are revealed (since they are authenticated).

---

## 5. UI / UX Design System
*   **Theme:** Dark mode (`bg-background` which is `#0A1628`), with cyan neon accents (`#00D4FF`).
*   **Components:** We heavily use a "Mac-style Window" UI component for images and feature boxes. You will see headers with red/yellow/green Mac buttons in the Hero section and the "4 Golden Rules" section.
*   **Glassmorphism:** Most cards use a `.glass-panel` class (defined in `globals.css`) that applies a translucent backdrop filter with thin borders.

---

## 6. Environment Variables (`.env.local`)
To run this project locally, ensure the following are set:
*   `MONGODB_URI`
*   `NEXTAUTH_SECRET` & `NEXTAUTH_URL`
*   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` & `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`
*   `NEXT_PUBLIC_PAYPAL_CLIENT_ID` & `PAYPAL_SECRET_KEY`
*   `RESEND_API_KEY`
*   `NEXT_PUBLIC_POSTHOG_KEY` & `NEXT_PUBLIC_POSTHOG_HOST`

*(Note: The latest `NEXT_PUBLIC_PAYPAL_CLIENT_ID` for the live subscription plans is `BAApJJrquEQ1rl0Zkny5nBuTSi3lNtex00o1yb5XAzD5srCnhhe2MXw310KQroW76_5hol7pBhGwuMqsLE`. Make sure this is synced in Vercel.)*

---

## 7. Where to Pick Up
The client (Kazi) is currently testing the live PayPal and Stripe flows on Vercel. The last things we fixed were:
1. Hardcoding the 3 PayPal Plan IDs.
2. Fixing the authentication routing so existing/unpaid users are redirected to the checkout page gracefully.

If the user asks you to modify payments, check `checkout/page.tsx` or `stripe/webhook/route.ts`. If they ask to modify UI, look in `HomeClient.tsx` or `components/`.

**Good luck, and build something awesome!**
