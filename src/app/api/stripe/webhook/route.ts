import { NextResponse } from "next/server";
import Stripe from "stripe";
import { User } from "@/models/User";
import { SystemLog } from "@/models/SystemLog";
import connectDB from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(payload, signature as string, endpointSecret);
    } else {
      // In dev mode without webhook secret, just parse it
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    if (process.env.MOCK_ENV !== 'true') {
      try {
        await connectDB();
        await SystemLog.create({
          source: "stripe_webhook",
          message: `Webhook signature verification failed: ${err.message}`,
        });
      } catch (e) {}
    }
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (process.env.MOCK_ENV === 'true') {
      console.log("MOCK_ENV true: Bypassing DB write for webhook event", event.type);
      return NextResponse.json({ received: true });
    }

    await connectDB();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer as string;
      if (userId) {
        const user = await User.findByIdAndUpdate(userId, {
          status: "active",
          active: true,
          tier: session.metadata?.planId === "P-2" ? "tier2" : "tier1",
          stripeCustomerId: stripeCustomerId,
        });
        console.log(`User ${userId} activated via Stripe!`);

        // Send Welcome Email
        if (user) {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_dev');
          const tierName = user.tier === 'tier1' ? 'Trend Algo' : user.tier === 'tier2' ? 'Trend Algo + London X' : 'All Indicators + Course';
          
          try {
            // 1. Send Welcome Email to User
            const userEmailRes = await resend.emails.send({
              from: 'support@16londonalgo.com',
              to: [user.email],
              subject: 'Welcome to 16London X Brands LLC! 🎉',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 10px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00D4FF; margin: 0;">16London X Brands LLC</h1>
                  </div>
                  <h2 style="font-size: 24px; margin-bottom: 20px;">Welcome to the elite circle, ${user.name}! 🎉</h2>
                  <p style="color: #E2E8F0; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Your payment was successful and your subscription for the <strong>${tierName}</strong> plan is now active.
                  </p>
                  <div style="background-color: #050E1A; border: 1px solid rgba(0, 212, 255, 0.2); padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="margin-top: 0; color: #00D4FF;">Your Login Credentials</h3>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> The password you chose during registration.</p>
                  </div>
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="https://16londonalgo.com/login" style="background-color: #00D4FF; color: #0A1628; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">Go to Members Portal</a>
                  </div>
                </div>
              `
            });
            console.log("User email sent:", userEmailRes);

            // 2. Send Notification to Admin
            const adminEmail = process.env.ADMIN_EMAIL || 'support@16londonalgo.com';
            const adminEmailRes = await resend.emails.send({
              from: 'support@16londonalgo.com',
              to: [adminEmail],
              subject: '💰 New Subscriber Alert - 16London Algo',
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2 style="color: #00D4FF;">New Subscription Activated!</h2>
                  <p><strong>Name:</strong> ${user.name}</p>
                  <p><strong>Email:</strong> ${user.email}</p>
                  <p><strong>Plan:</strong> ${tierName}</p>
                  <p><strong>Stripe Customer ID:</strong> ${stripeCustomerId}</p>
                  <hr/>
                  <p><em>Make sure to add their TradingView username if they have provided it.</em></p>
                </div>
              `
            });
            console.log("Admin email sent:", adminEmailRes);

          } catch(e) {
            console.error("Email send failed:", e);
          }
        }
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier || "1";

      if (userId) {
        const user = await User.findById(userId);
        if (user && user.status === "pending_payment" && !user.abandonedEmailSent) {
          console.log(`Sending abandoned cart email to user ${userId}`);
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_dev');
          
          try {
            await resend.emails.send({
              from: 'support@16londonalgo.com',
              to: [user.email],
              subject: "Complete your 16London Algo setup",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 10px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00D4FF; margin: 0;">16London X Brands LLC</h1>
                  </div>
                  <h2 style="font-size: 24px; margin-bottom: 20px;">Hi ${user.name},</h2>
                  <p style="color: #E2E8F0; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We noticed you started setting up your 16London Algo account but didn't complete the payment. The markets are moving, and we'd love to have you on board.
                  </p>
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://16londonalgo.com'}/checkout?tier=${tier}" style="background-color: #00D4FF; color: #0A1628; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">Complete Your Checkout</a>
                  </div>
                  <p style="color: #E2E8F0; font-size: 14px;">Best,<br>Kazi</p>
                </div>
              `
            });
            user.abandonedEmailSent = true;
            await user.save();
          } catch (e) {
            console.error("Abandoned cart email send failed:", e);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing failed:", err);
    if (process.env.MOCK_ENV !== 'true') {
      try {
        await connectDB();
        await SystemLog.create({
          source: "stripe_webhook",
          message: `Processing failed: ${err.message}`,
        });
      } catch(e) {}
    }
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
