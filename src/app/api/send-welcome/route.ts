import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Security: Only admins can trigger manual welcome emails
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, tier, temporaryPassword } = await request.json();

    if (!name || !email || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tierName = tier === 'tier1' ? 'Trend Algo' : tier === 'tier2' ? 'Trend Algo + London X' : 'All Indicators + Course';

    // 1. Send Welcome Email to the User
    await sendEmail({
      to: email,
      subject: 'Welcome to 16London X Brands LLC! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00D4FF; margin: 0;">16London X Brands LLC</h1>
          </div>
          
          <h2 style="font-size: 24px; margin-bottom: 20px;">Welcome to the elite circle, ${name}! 🎉</h2>
          
          <p style="color: #E2E8F0; font-size: 16px; line-height: 1.5; mb-6">
            Your payment was successful and your subscription for the <strong>${tierName}</strong> plan is now active.
          </p>
          
          <div style="background-color: #050E1A; border: 1px solid rgba(0, 212, 255, 0.2); padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #00D4FF;">Your Login Credentials</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${temporaryPassword || 'password123'}</p>
          </div>
          
          <h3 style="color: #00D4FF;">Your Next Steps</h3>
          <ol style="color: #E2E8F0; font-size: 16px; line-height: 1.5;">
            <li style="margin-bottom: 10px;">Log in to the <a href="https://16londonalgo.com/login" style="color: #00D4FF;">Members Portal</a> using the credentials above.</li>
            <li style="margin-bottom: 10px;">Submit your TradingView username inside the portal.</li>
            <li style="margin-bottom: 10px;">Kazi will manually grant you indicator access within 24 hours.</li>
          </ol>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://16londonalgo.com/login" style="background-color: #00D4FF; color: #0A1628; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">Go to Members Portal</a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Need help? Reply to this email or contact <a href="mailto:support@16londonalgo.com" style="color: #00D4FF;">support@16londonalgo.com</a>
          </p>
        </div>
      `
    });

    // 2. Send Notification Email to Admin
    await sendEmail({
      to: 'support@16londonalgo.com',
      subject: `New Member: ${name} subscribed to ${tierName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00D4FF; margin: 0; font-size: 28px; letter-spacing: 2px;">16London X Brands LLC</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">Admin Notification</p>
          </div>
          
          <div style="background-color: #050E1A; border-left: 4px solid #10B981; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="margin-top: 0; color: #ffffff; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
              💰 New Subscription Received
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #8ba1b8; width: 30%; border-bottom: 1px solid rgba(255,255,255,0.05);">Name</td>
                <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05);">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #8ba1b8; width: 30%; border-bottom: 1px solid rgba(255,255,255,0.05);">Email</td>
                <td style="padding: 10px 0; color: #ffffff; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05);"><a href="mailto:${email}" style="color: #00D4FF; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #8ba1b8; width: 30%; border-bottom: 1px solid rgba(255,255,255,0.05);">Purchased Tier</td>
                <td style="padding: 10px 0; color: #00D4FF; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05);">${tierName}</td>
              </tr>
              <tr>
                <td style="padding: 15px 0 5px 0; color: #8ba1b8; width: 30%;">Status</td>
                <td style="padding: 15px 0 5px 0; color: #10B981; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                  ✅ Payment Successful
                </td>
              </tr>
            </table>
          </div>
          
          <p style="color: #8ba1b8; font-size: 14px; text-align: center; margin-top: 30px;">
            This user has successfully subscribed. Keep an eye out for their TradingView username submission in the portal.
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
