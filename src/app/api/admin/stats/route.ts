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
      return NextResponse.json({ 
        totalUsers: 145, 
        activeSubscribers: 120, 
        tier1Count: 50, 
        tier2Count: 70,
        tier3Count: 25
      });
    }

    await connectToDatabase();
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ active: true });
    const tier1Count = await User.countDocuments({ active: true, tier: "tier1" });
    const tier2Count = await User.countDocuments({ active: true, tier: "tier2" });
    const tier3Count = await User.countDocuments({ active: true, tier: "tier3" });

    return NextResponse.json({ 
      totalUsers, 
      activeSubscribers, 
      tier1Count, 
      tier2Count,
      tier3Count
    });
  } catch (error: any) {
    console.error("Admin Stats GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
