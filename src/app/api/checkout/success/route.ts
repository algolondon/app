import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, subscriptionId, tier } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { 
        $set: { 
          active: true, 
          status: "active",
          ...(subscriptionId ? { paypalSubscriptionId: subscriptionId } : {}),
          ...(tier ? { tier: `tier${tier.replace('tier', '')}` } : {})
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Account activated successfully",
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        active: updatedUser.active,
        status: updatedUser.status
      }
    });
  } catch (error: any) {
    console.error("Error in /api/checkout/success:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
