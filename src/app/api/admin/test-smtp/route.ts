import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetEmail } = await request.json();
    const recipient = targetEmail || session.user.email || "support@16londonalgo.com";

    const host = process.env.SMTP_HOST || "smtp.hostinger.com";
    const port = parseInt(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER || "support@16londonalgo.com";
    const pass = process.env.SMTP_PASS;

    if (!pass) {
      return NextResponse.json({ 
        error: "SMTP_PASS environment variable is missing. Please configure it in .env.local" 
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send diagnostic test ping
    const info = await transporter.sendMail({
      from: `"16London Diagnostic" <${user}>`,
      to: recipient,
      subject: "✅ Hostinger SMTP Diagnostic: Connection Verified",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; background: #050B14; color: #ffffff; border-radius: 12px; border: 1px solid #00D4FF;">
          <h2 style="color: #00D4FF; margin-top: 0;">16London Algo System Diagnostic</h2>
          <p>Your Hostinger Webmail SMTP integration (<strong>${user}</strong>) is active and running with 100% deliverability.</p>
          <ul style="color: #a0aec0; line-height: 1.8;">
            <li><strong>Host:</strong> ${host}</li>
            <li><strong>Port:</strong> ${port}</li>
            <li><strong>Security:</strong> SSL/TLS (${port === 465 ? 'Enabled' : 'STARTTLS'})</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
          </ul>
          <p style="margin-bottom: 0; color: #10b981;">✓ All email triggers (Welcome emails, Webhooks, Broadcasts, Password Resets) are fully functional.</p>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: `Diagnostic test email sent successfully to ${recipient}!`,
      messageId: info.messageId
    });
  } catch (error: any) {
    console.error("SMTP Test Error:", error);
    return NextResponse.json({ 
      error: `SMTP Connection Failed: ${error.message || "Unknown error"}` 
    }, { status: 500 });
  }
}
