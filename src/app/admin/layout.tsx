import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Check if user is admin
  if ((session.user as any).role !== "admin") {
    redirect("/members-portal");
  }

  return (
    <div className="h-screen bg-[#050B14] text-white flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 md:p-8 md:pt-8 overflow-y-auto w-full h-full">
        <div className="max-w-7xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
