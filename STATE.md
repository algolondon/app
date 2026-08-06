# 16London Algo - Project State & Next Steps

## 🚀 Completed Work (All 6 Phases)
1. **Phase 1: Stripe Checkout** - Successfully integrated Stripe checkout button and session generation.
2. **Phase 2: PostHog Analytics** - Wrapped app in `CSPostHogProvider` and tracked checkout events. (Using mock ID `phc_mock_key_for_now`).
3. **Phase 3: Course Progress Tracking** - Updated DB to store `completedModules`. Added toggles to `CourseLibrary` and a dynamic progress bar to `MembersPortal`.
4. **Phase 4: Billing Portal** - Added Stripe Billing Portal generation via `/api/stripe/create-portal-session` and "Manage Subscription" button in Members Portal.
5. **Phase 5: Abandoned Cart Emails** - Created `/api/cron/abandoned-cart` to email users who are `pending_payment` for >1 hr using `resend`. Configured `vercel.json` for cron.
6. **Phase 6: Tech & SEO Polish** - Verified OpenGraph tags. Created `SystemLog` database schema to track webhook errors.

---

## 🛠️ Environment Variables Needed Before Deployment
Make sure these are present in your `.env.local` or Vercel Environment variables:
- `NEXT_PUBLIC_POSTHOG_KEY` (Get from PostHog)
- `NEXT_PUBLIC_POSTHOG_HOST` (Usually `https://us.i.posthog.com`)
- `RESEND_API_KEY` (Get from Resend.com)
- `CRON_SECRET` (A random string you create, used to secure your cron jobs)
- `STRIPE_WEBHOOK_SECRET` (Get from Stripe Dashboard or Stripe CLI)

---

## 🧪 How to Test Tomorrow Morning

### 1. Test the UI & Course Progress
- Start the server: `npm run dev`
- Go to `http://localhost:3000/course-library`, click "Mark as complete" on some videos.
- Go to `http://localhost:3000/members-portal` and check that the progress bar updates.

### 2. Test Stripe Webhooks & Billing Portal locally
Because you are on `localhost`, Stripe cannot automatically update your local database when a payment succeeds. To test the full workflow:
1. Download the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Open terminal and run: `stripe login`
3. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook secret (`whsec_...`) it gives you, put it in `.env.local` as `STRIPE_WEBHOOK_SECRET`, and restart the dev server.
5. Complete a test checkout. Your user status in MongoDB will become `active` and their `stripeCustomerId` will be saved.
6. Go to the Members Portal and click "Manage Subscription" to test the billing portal.

### 3. Test Abandoned Cart Emails (Cron Job)
- Add a `CRON_SECRET=test123` to your `.env.local` file.
- Open a terminal and run:
  `curl -H "Authorization: Bearer test123" http://localhost:3000/api/cron/abandoned-cart`
- It will find any users sitting in `pending_payment` for over an hour and send them an email!
