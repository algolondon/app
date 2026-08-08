import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ message: "Username updated successfully (Mocked)" });
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { tradingviewUsername: username },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send instant email notification to admin to alert them of the submission
    const adminEmail = process.env.ADMIN_EMAIL || "support@16londonalgo.com";
    try {
      await resend.emails.send({
        from: '16London Algo Alerts <support@16londonalgo.com>',
        to: adminEmail,
        subject: `[TV ACCESS REQUEST] @${username} submitted by ${updatedUser.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #030914; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(0, 212, 255, 0.15);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #00D4FF; margin: 0; font-size: 22px;">TradingView Access Request</h2>
              <p style="color: #94a3b8; margin-top: 5px; font-size: 14px;">A member has submitted their username for indicator access.</p>
            </div>
            
            <div style="background-color: #0A1628; padding: 25px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <td style="padding: 10px 0; color: #94a3b8; font-weight: bold; font-size: 14px;">Member Name:</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${updatedUser.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <td style="padding: 10px 0; color: #94a3b8; font-weight: bold; font-size: 14px;">Email Address:</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right;">${updatedUser.email}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <td style="padding: 10px 0; color: #94a3b8; font-weight: bold; font-size: 14px;">TradingView Username:</td>
                  <td style="padding: 10px 0; color: #00D4FF; font-weight: bold; font-size: 16px; font-family: monospace; text-align: right;">@${username}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #94a3b8; font-weight: bold; font-size: 14px;">Subscription Plan:</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 14px; text-align: right; text-transform: uppercase;">${updatedUser.tier}</td>
                </tr>
              </table>
            </div>

            <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">Please log in to TradingView and grant invite-only access to this user for the correct indicators.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL || 'https://16londonalgo.com'}/admin/users" style="display: inline-block; background-color: #00D4FF; color: #0A1628; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
                Open Admin Directory
              </a>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error("Failed to send TradingView username email alert to admin:", emailErr);
    }

    return NextResponse.json({ message: "Username updated successfully" });
  } catch (error: any) {
    console.error("Error updating TV username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
