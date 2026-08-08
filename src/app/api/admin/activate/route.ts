import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_dev');

export async function POST(request: Request) {
  try {
    const { email, adminKey } = await request.json();

    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'members.json');
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Members database not found' }, { status: 404 });
    }

    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const members = JSON.parse(fileData);

    const memberIndex = members.findIndex((m: any) => m.email === email);
    if (memberIndex === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = members[memberIndex];
    member.active = true;
    member.status = "active";
    
    fs.writeFileSync(dataFilePath, JSON.stringify(members, null, 2));

    const tierName = member.tier === 'tier1' ? 'Trend Algo' : member.tier === 'tier2' ? 'Trend Algo + London X' : 'All Indicators + Course';

    await resend.emails.send({
      from: 'support@16londonalgo.com',
      to: [email],
      subject: "You're in! Welcome to 16London X Brands LLC 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A1628; color: #ffffff; padding: 40px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00D4FF; margin: 0;">16London X Brands LLC</h1>
          </div>
          
          <h2 style="font-size: 24px; margin-bottom: 20px;">Welcome to the elite circle, ${member.name}! 🎉</h2>
          
          <p style="color: #E2E8F0; font-size: 16px; line-height: 1.5; mb-6">
            Your payment was verified by Kazi and your subscription for the <strong>${tierName}</strong> plan is now active.
          </p>
          
          <h3 style="color: #00D4FF;">Your Next Steps</h3>
          <ol style="color: #E2E8F0; font-size: 16px; line-height: 1.5;">
            <li style="margin-bottom: 10px;">Log in to the <a href="https://16londonalgo.com/login" style="color: #00D4FF;">Members Portal</a>.</li>
            <li style="margin-bottom: 10px;">Submit your TradingView username inside the portal so Kazi can grant you indicator access.</li>
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

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json({ error: 'Failed to activate member' }, { status: 500 });
  }
}
