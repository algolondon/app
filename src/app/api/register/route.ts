import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';


export async function POST(request: Request) {
  try {
    const { name, email, password, tier } = await request.json();

    if (!name || !email || !password || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ success: true, userId: "mock-123" });
    }

    await connectToDatabase();

    const existingMember = await User.findOne({ email });
    if (existingMember) {
      return NextResponse.json({ error: 'Account exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const tierName = tier === 'tier1' ? 'Trend Algo' : tier === 'tier2' ? 'Trend Algo + London X' : 'All Indicators + Course';

    const newMember = await User.create({
      name,
      email,
      password: hashedPassword,
      tier,
      status: "pending_payment",
      tradingviewUsername: "",
      active: false
    });

    try {
      await sendEmail({
        to: 'support@16londonalgo.com',
        subject: `New Registration: ${name} — ${tierName}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00D4FF; margin: 0; font-size: 28px; letter-spacing: 2px;">16London X Brands LLC</h1>
              <p style="color: #64748b; font-size: 14px; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">Admin Notification</p>
            </div>
            
            <div style="background-color: #050E1A; border-left: 4px solid #00D4FF; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="margin-top: 0; color: #ffffff; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
                🚨 New Registration Alert
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
                  <td style="padding: 10px 0; color: #8ba1b8; width: 30%; border-bottom: 1px solid rgba(255,255,255,0.05);">Selected Tier</td>
                  <td style="padding: 10px 0; color: #00D4FF; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05);">${tierName}</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0 5px 0; color: #8ba1b8; width: 30%;">Status</td>
                  <td style="padding: 15px 0 5px 0; color: #F59E0B; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                    ⌛ Awaiting Payment Confirmation
                  </td>
                </tr>
              </table>
            </div>
            
            <p style="color: #8ba1b8; font-size: 14px; text-align: center; margin-top: 30px;">
              This user has registered but has not completed PayPal checkout yet. If they pay via Crypto, you may need to activate them manually.
            </p>
          </div>
        `
      });
    } catch (e) {
      console.error("Email error:", e);
    }

    return NextResponse.json({ success: true, userId: newMember._id });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register account' }, { status: 500 });
  }
}
