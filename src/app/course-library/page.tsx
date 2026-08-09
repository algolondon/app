import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CoursePlayer } from "@/components/course-player";
import { User } from "@/models/User";
import { Course } from "@/models/Course";
import connectDB from "@/lib/db";

export const dynamic = 'force-dynamic';
export default async function CourseLibrary() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  let courses: { _id: string, videoTitle: string, youtubeUrl: string }[] = [];

  try {
    await connectDB();
    const dbCourses = await Course.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    
    courses = dbCourses.map(c => ({
      _id: c._id.toString(),
      videoTitle: c.title,
      youtubeUrl: c.youtubeUrl || c.url
    }));
  } catch (error) {
    console.error("Failed to fetch courses from DB", error);
  }

  let completedModules: string[] = [];
  
  if (process.env.MOCK_ENV !== 'true') {
    try {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email }).lean();
      completedModules = (dbUser?.completedModules || []).map((id: any) => id.toString());
      if (!dbUser?.active && dbUser?.role !== 'admin') {
        const defaultTier = dbUser?.tier ? dbUser.tier.replace('tier', '') : '1';
        redirect(`/checkout?tier=${defaultTier}`);
      }
    } catch (e) {
      console.error("Failed to fetch user progress:", e);
    }
  } else {
    // In mock env, allow mock user to access
    const mockUser = session.user as any;
    if (!mockUser.active && mockUser.role !== 'admin') {
      const defaultTier = mockUser.tier ? mockUser.tier.replace('tier', '') : '1';
      redirect(`/checkout?tier=${defaultTier}`);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1 mt-[64px]">
         <CoursePlayer courses={courses} completedModules={completedModules} />
      </div>
    </main>
  );
}
