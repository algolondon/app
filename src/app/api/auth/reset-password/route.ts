import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ success: true, message: 'Mock password reset successfully' });
    }

    await connectToDatabase();

    const resetToken = await PasswordResetToken.findOne({ token });

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    if (new Date() > new Date(resetToken.expires)) {
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 });
    }

    const user = await User.findOne({ email: resetToken.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
