import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, subscriptionId, tier } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedTier = tier ? `tier${tier.toString().replace('tier', '')}` : 'tier1';

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { 
        $set: { 
          active: true, 
          status: "active",
          ...(subscriptionId ? { paypalSubscriptionId: subscriptionId } : {}),
          tier: normalizedTier
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tierName = 
      normalizedTier === 'tier3' ? 'Tier 3 · 16London Complete System ($119.99/mo)' :
      normalizedTier === 'tier2' ? 'Tier 2 · Trend Algo + London X ($89.99/mo)' :
      'Tier 1 · 16London Trend Algo ($59.99/mo)';

    // 1. Send Instant Sale Notification to Admin
    const adminRecipients = ['support@16londonalgo.com', 'kaziyelisrael@gmail.com'];
    try {
      await sendEmail({
        to: adminRecipients,
        subject: `🎉 [NEW SALE] ${updatedUser.name} Subscribed to ${tierName}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #030914; color: #ffffff; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(0, 212, 255, 0.2);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #00D4FF; margin: 0; font-size: 26px; letter-spacing: 1px;">16London X Brands LLC</h1>
              <p style="color: #64748b; font-size: 13px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;">New Paid Subscription Confirmed</p>
            </div>
            
            <div style="background-color: #0A1628; border-left: 4px solid #10B981; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="margin-top: 0; color: #10B981; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 15px;">
                💰 Payment Confirmed & Account Activated
              </h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 35%;">Customer:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: bold; font-size: 14px;">${updatedUser.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #00D4FF; font-weight: bold; font-size: 14px;">${updatedUser.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Plan:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: bold; font-size: 14px;">${tierName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">PayPal Sub ID:</td>
                  <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace; font-size: 13px;">${subscriptionId || 'Active'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Status:</td>
                  <td style="padding: 8px 0; color: #10B981; font-weight: bold; font-size: 14px;">● ACTIVE</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://16londonalgo.com/admin/users" style="display: inline-block; background-color: #00D4FF; color: #030914; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
                Open Admin Users Directory
              </a>
            </div>
          </div>
        `
      });
    } catch (e) {
      console.error("Failed to send admin new sale alert:", e);
    }

    // 2. Send Welcome / Access Email to Customer
    try {
      await sendEmail({
        to: updatedUser.email,
        subject: `Welcome to 16London Algo — Your Access & Indicator Setup`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #030914; color: #ffffff; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(0, 212, 255, 0.2);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #00D4FF; margin: 0; font-size: 26px;">16London Algo VIP</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Your subscription is officially active!</p>
            </div>
            
            <div style="background-color: #0A1628; padding: 25px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 25px;">
              <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Welcome, ${updatedUser.name}!</h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Thank you for subscribing to <strong>${tierName}</strong>. You now have full access to our proprietary TradingView systems, course modules, and community.
              </p>

              <div style="background-color: #050B14; border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="color: #00D4FF; margin: 0 0 8px 0; font-size: 15px;">Next Step: TradingView Access</h3>
                <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5;">
                  If you haven't entered your TradingView username yet, please log in to your Members Portal and submit it so Kazi can grant you invite-only access.
                </p>
              </div>

              <div style="text-align: center; margin: 25px 0;">
                <a href="https://16londonalgo.com/members-portal" style="display: inline-block; background-color: #00D4FF; color: #030914; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
                  Access Members Portal & Courses
                </a>
              </div>
            </div>

            <div style="text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                Need assistance? Reply directly to this email or reach us at <a href="mailto:support@16londonalgo.com" style="color: #00D4FF;">support@16londonalgo.com</a>.
              </p>
            </div>
          </div>
        `
      });
    } catch (custEmailErr) {
      console.error("Failed to send customer welcome email:", custEmailErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Account activated successfully and emails dispatched",
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        active: updatedUser.active,
        status: updatedUser.status
      }
    });
  } catch (error: any) {
    console.error("Error in /api/checkout/success:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
