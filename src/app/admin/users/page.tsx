import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { UsersListClient, UserItem } from "@/components/admin/UsersListClient";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  let users: UserItem[] = [];

  try {
    if (process.env.MOCK_ENV === 'true') {
      users = [
        { _id: "1", name: "Alex Mercer", email: "alex@example.com", tradingviewUsername: "alex_trader", tier: "tier2", active: true, role: "user", createdAt: new Date().toISOString() },
        { _id: "2", name: "Marcus Vance", email: "marcus@trader.io", tradingviewUsername: "marcus_fx", tier: "tier3", active: true, role: "user", createdAt: new Date().toISOString() },
        { _id: "3", name: "Admin Kazi", email: "support@16londonalgo.com", tradingviewUsername: "16london", tier: "tier3", active: true, role: "admin", createdAt: new Date().toISOString() },
      ];
    } else {
      await connectToDatabase();
      const rawUsers = await User.find().sort({ createdAt: -1 }).lean();
      users = (rawUsers || []).map((u: any) => ({
        _id: u._id.toString(),
        name: u.name || "",
        email: u.email || "",
        tradingviewUsername: u.tradingviewUsername || "",
        tier: u.tier || "tier1",
        active: Boolean(u.active),
        role: u.role || "user",
        status: u.status || (u.active ? "active" : "inactive"),
        subscriptionEndDate: u.subscriptionEndDate ? new Date(u.subscriptionEndDate).toISOString() : null,
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch users on server:", error);
  }

  return <UsersListClient initialUsers={users} />;
}
