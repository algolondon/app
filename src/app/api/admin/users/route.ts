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
    const { userId, userIds, updates } = body;

    if (!updates) {
      return NextResponse.json({ error: "Missing updates content" }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ message: "Mock updates applied successfully" });
    }

    await connectToDatabase();

    // Prevent changing current admin's role in bulk or single if it downgrades them
    const currentAdminId = (session.user as any).id;
    if (updates.role && updates.role !== "admin") {
      if (userId && userId === currentAdminId) {
        return NextResponse.json({ error: "Cannot downgrade your own admin role" }, { status: 400 });
      }
      if (userIds && userIds.includes(currentAdminId)) {
        return NextResponse.json({ error: "Cannot downgrade your own admin role in bulk operation" }, { status: 400 });
      }
    }

    if (userIds && Array.isArray(userIds)) {
      const result = await User.updateMany({ _id: { $in: userIds } }, updates);
      return NextResponse.json({ message: `${result.modifiedCount} users updated successfully` });
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId or userIds" }, { status: 400 });
    }

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

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userIdsParam = searchParams.get('userIds');

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ message: "Mock deletion successful" });
    }

    await connectToDatabase();
    const currentAdminId = (session.user as any).id;
    const currentAdminEmail = session.user.email;

    if (userIdsParam) {
      // Bulk delete
      let userIds = userIdsParam.split(',').filter(Boolean);
      
      // Filter out current admin from the delete list by ID or email
      if (currentAdminId) {
        userIds = userIds.filter(id => id !== currentAdminId);
      }
      
      // If we don't have userIds left, or we want to double check against database email
      const admins = await User.find({ _id: { $in: userIds }, role: "admin" });
      const safeUserIds = userIds.filter(id => {
        const adminObj = admins.find(a => a._id.toString() === id);
        return !adminObj || adminObj.email !== currentAdminEmail;
      });

      if (safeUserIds.length === 0) {
        return NextResponse.json({ error: "No valid users to delete (cannot delete yourself)" }, { status: 400 });
      }

      const result = await User.deleteMany({ _id: { $in: safeUserIds } });
      return NextResponse.json({ message: `${result.deletedCount} users deleted successfully` });
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Double check email comparison to prevent admin self-deletion
    const userToDelete = await User.findById(userId);
    if (userToDelete && (userToDelete.email === currentAdminEmail || userToDelete._id.toString() === currentAdminId)) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Admin Users DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

