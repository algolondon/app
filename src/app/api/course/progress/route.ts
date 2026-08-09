import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId, completed } = await req.json();

    if (!moduleId || typeof completed !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ success: true, completedModules: [moduleId] });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (completed) {
      // Add to array if not exists
      await User.findOneAndUpdate(
        { email: session.user.email },
        { $addToSet: { completedModules: moduleId } },
        { new: true }
      );
    } else {
      // Remove from array
      await User.findOneAndUpdate(
        { email: session.user.email },
        { $pull: { completedModules: moduleId } },
        { new: true }
      );
    }

    const updatedUser = await User.findOne({ email: session.user.email }).lean();

    return NextResponse.json({ 
      success: true, 
      completedModules: (updatedUser.completedModules || []).map((id: any) => id.toString())
    });
  } catch (error: any) {
    console.error("Progress Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ completedModules: [] });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ completedModules: user.completedModules || [] });
  } catch (error: any) {
    console.error("Progress Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
