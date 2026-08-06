import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.MOCK_ENV === 'true') {
      const mockUsers = Array.from({ length: 20 }).map((_, i) => ({
        _id: `mock-${i}`,
        name: `Mock User ${i}`,
        email: `user${i}@example.com`,
        tier: i % 3 === 0 ? "tier2" : "tier1",
        active: i % 5 !== 0,
        role: "user",
        createdAt: new Date().toISOString(),
        tradingviewUsername: `tv_user${i}`
      }));
      return NextResponse.json({ users: mockUsers });
    }

    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ message: "Mock user updated", user: { _id: userId, ...updates } });
    }

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error("Admin Users PATCH Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
