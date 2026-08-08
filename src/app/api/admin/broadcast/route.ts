import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, content, isTest, targetAudience = "all" } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 });
    }

    // A nice HTML wrapper for the broadcast email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid rgba(0, 212, 255, 0.15);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00D4FF; margin: 0;">16London Algo</h1>
        </div>
        <div style="color: #E2E8F0; font-size: 16px; line-height: 1.6;">
          ${content}
        </div>
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748B;">
          <p>You are receiving this email because you are registered at 16London Algo.</p>
        </div>
      </div>
    `;

    if (isTest) {
      const adminEmail = process.env.ADMIN_EMAIL || 'support@16londonalgo.com';
      const response = await resend.emails.send({
        from: 'support@16londonalgo.com',
        to: [adminEmail],
        subject: `[TEST] ${subject}`,
        html: emailHtml,
      });
      
      if (response.error) {
         return NextResponse.json({ error: response.error.message }, { status: 400 });
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

      // We will send in batches using Resend's batch API to handle limits
      const BATCH_SIZE = 100;
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        
        const emailsPayload = batch.map(user => ({
          from: 'support@16londonalgo.com',
          to: [user.email],
          subject: subject,
          html: emailHtml
        }));

        const response = await resend.batch.send(emailsPayload);
        
        if (response.error) {
           return NextResponse.json({ error: `Resend API Error: ${response.error.message}` }, { status: 400 });
        }
      }

      return NextResponse.json({ success: true, count: users.length });
    }
  } catch (error: any) {
    console.error("Broadcast API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to send broadcast" }, { status: 500 });
  }
}
