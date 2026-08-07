import { NextResponse } from "next/server";
import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "mock_key");

export async function GET(req: Request) {
  // Cron jobs typically use GET
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find users who have status 'pending_payment', haven't been sent an email yet, 
    // and were created more than 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const abandonedUsers = await User.find({
      status: "pending_payment",
      abandonedEmailSent: false,
      createdAt: { $lt: oneHourAgo }
    });

    const sentEmails = [];

    for (const user of abandonedUsers) {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'support@16londonalgo.com', // Replace with verified domain
          to: user.email,
          subject: "Complete your 16London Algo setup",
          html: `<p>Hi ${user.name},</p><p>We noticed you started setting up your 16London Algo account but didn't complete the payment. The markets are moving, and we'd love to have you on board.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout">Click here to complete your checkout and get instant access.</a></p><p>Best,<br>Kazi</p>`,
        });
      }
      
      // Mark as sent whether it actually sent or just simulated
      user.abandonedEmailSent = true;
      await user.save();
      sentEmails.push(user.email);
    }

    return NextResponse.json({ success: true, count: sentEmails.length, emails: sentEmails });
  } catch (error: any) {
    console.error("Abandoned Cart Cron Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
