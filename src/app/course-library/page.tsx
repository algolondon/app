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

  let courses: {
    _id: string;
    videoTitle: string;
    youtubeUrl: string;
    courseCategory?: string;
    description?: string;
    attachments?: { title: string; url: string; type?: string }[];
  }[] = [];
  
  let completedModules: string[] = [];
  let shouldRedirect = false;
  let redirectUrl = "";

  try {
    await connectDB();
    const [dbCourses, dbUser] = await Promise.all([
      Course.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
      process.env.MOCK_ENV !== 'true' ? User.findOne({ email: session.user.email }).lean() : Promise.resolve(null)
    ]);
    
    courses = (dbCourses || []).map((c: any) => ({
      _id: c._id.toString(),
      videoTitle: c.title,
      youtubeUrl: c.url || c.youtubeUrl,
      courseCategory: c.courseCategory || "Course 1: Trend Algo Strategy",
      description: c.description || "",
      attachments: (c.attachments || []).map((a: any) => ({
        title: a.title,
        url: a.url,
        type: a.type || "pdf"
      }))
    }));

    if (process.env.MOCK_ENV !== 'true' && dbUser) {
      completedModules = (dbUser.completedModules || []).map((id: any) => id.toString());
      if (!dbUser.active && dbUser.role !== 'admin') {
        const defaultTier = dbUser.tier ? dbUser.tier.replace('tier', '') : '1';
        shouldRedirect = true;
        redirectUrl = `/checkout?tier=${defaultTier}`;
      }
    }
  } catch (error) {
    console.error("Failed to fetch data from DB", error);
  }

  if (process.env.MOCK_ENV === 'true') {
    const mockUser = session.user as any;
    if (!mockUser.active && mockUser.role !== 'admin') {
      const defaultTier = mockUser.tier ? mockUser.tier.replace('tier', '') : '1';
      shouldRedirect = true;
      redirectUrl = `/checkout?tier=${defaultTier}`;
    }
  }

  if (shouldRedirect) {
    redirect(redirectUrl);
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#050B14] text-white">
      <Navbar />
      <div className="flex-1 mt-[72px]">
        <CoursePlayer courses={courses} completedModules={completedModules} />
      </div>
    </main>
  );
}
