import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    }

    await connectToDatabase();
    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found." }, { status: 404 });
    }

    // Verify current password if user has one set
    if (adminUser.password) {
      const isValid = await bcrypt.compare(currentPassword || "", adminUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Failed to change admin password:", error);
    return NextResponse.json({ error: "An unexpected error occurred while updating password." }, { status: 500 });
  }
}
