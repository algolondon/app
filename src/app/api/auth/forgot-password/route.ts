import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import connectToDatabase from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ success: true, message: 'Mock reset email sent' });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      // Return a success response even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If an account exists, a reset link was sent." });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Set expiration to 1 hour from now
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Save token to database
    await PasswordResetToken.findOneAndUpdate(
      { email },
      { token, expires },
      { upsert: true, new: true }
    );

    // Send email
    const emailResult = await sendPasswordResetEmail(email, token);

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }

    return NextResponse.json({ message: "If an account exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
