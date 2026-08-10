import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/email";


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, content, isTest, targetAudience = "all", couponCode, buttonUrl } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 });
    }

    // Convert newlines to HTML br tags if it is plain text (doesn't contain typical HTML structural elements)
    let formattedContent = content;
    if (!content.includes("<p>") && !content.includes("<br") && !content.includes("<div")) {
      formattedContent = content.replace(/\n/g, '<br/>');
    }

    // If a coupon code is supplied, inject it dynamically along with the checkout button
    if (couponCode) {
      formattedContent = `
        <div>${formattedContent}</div>
        <div style="background-color: #0c203b; border: 1px dashed #00D4FF; padding: 18px; border-radius: 8px; text-align: center; font-size: 22px; font-weight: bold; color: #00D4FF; margin: 25px 0; font-family: monospace; letter-spacing: 2px; shadow: 0 4px 12px rgba(0,212,255,0.1);">
          ${couponCode}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${buttonUrl || 'https://16londonalgo.com/#pricing'}" style="background-color: #00D4FF; color: #0A1628; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-family: Arial, sans-serif; font-size: 15px;">
            Complete Your Checkout Now
          </a>
        </div>
      `;
    }

    // A nice HTML wrapper for the broadcast email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid rgba(0, 212, 255, 0.15);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00D4FF; margin: 0;">16London Algo</h1>
        </div>
        <div style="color: #E2E8F0; font-size: 16px; line-height: 1.6;">
          ${formattedContent}
        </div>
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748B;">
          <p>You are receiving this email because you are registered at 16London Algo.</p>
        </div>
      </div>
    `;

    if (isTest) {
      const adminEmail = process.env.ADMIN_EMAIL || 'support@16londonalgo.com';
      const response = await sendEmail({
        to: adminEmail,
        subject: `[TEST] ${subject}`,
        html: emailHtml,
      });
      
      if (!response.success) {
         return NextResponse.json({ error: response.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, count: 1 });
    } else {
      await connectDB();
      
      let queryCond = {};
      if (targetAudience === "active") {
        queryCond = { active: true };
      } else if (targetAudience === "abandoned") {
        queryCond = { tier: 'none', active: false, role: { $ne: 'admin' } };
      }

      // Fetch target users
      const users = await User.find(queryCond).select("email");
      
      if (!users || users.length === 0) {
        return NextResponse.json({ error: `No users found matching target audience: ${targetAudience}` }, { status: 404 });
      }

      // We will send in batches using Nodemailer loop
      const BATCH_SIZE = 50; // Use a slightly smaller batch size for SMTP
      let sentCount = 0;
      
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (user) => {
          try {
            await sendEmail({
              to: user.email,
              subject: subject,
              html: emailHtml
            });
            sentCount++;
          } catch (err) {
            console.error("Failed to send broadcast to", user.email, err);
          }
        }));
        
        // Small delay between batches to avoid rate limits
        if (i + BATCH_SIZE < users.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      return NextResponse.json({ success: true, count: users.length });
    }
  } catch (error: any) {
    console.error("Broadcast API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to send broadcast" }, { status: 500 });
  }
}
