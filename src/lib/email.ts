import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  try {
    const data = await resend.emails.send({
      from: '16London Algo <support@16londonalgo.com>',
      to: email,
      subject: 'Reset your password - 16London Algo',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #030914; color: #ffffff; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(0, 212, 255, 0.15);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://16londonalgo.com/images/new_assets/Trasparent%20Logo.png" alt="16London Algo Logo" style="max-height: 80px; width: auto;" />
          </div>
          
          <div style="background-color: #0A1628; padding: 30px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <h2 style="color: #00D4FF; margin-top: 0; font-size: 20px; font-weight: bold; font-family: sans-serif;">Password Reset Request</h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">We received a request to reset your password for your 16London Algo account.</p>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Click the button below to reset your password. This link will remain active for 1 hour.</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" style="display: inline-block; background-color: #00D4FF; color: #0A1628; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.25);">
                Reset Password
              </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">If you did not request a password reset, you can safely ignore this email.</p>
          </div>

          <div style="text-align: center; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <p style="color: #64748B; font-size: 12px; margin: 0 0 8px 0;">You are receiving this because you registered at 16London Algo.</p>
            <p style="color: #64748B; font-size: 12px; margin: 0;">© 2026 16London X Brands LLC. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
