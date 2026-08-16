import connectToDatabase from "@/lib/db";
import { Course } from "@/models/Course";
import { CourseListClient, CourseItem } from "@/components/admin/CourseListClient";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  let courses: CourseItem[] = [];

  try {
    if (process.env.MOCK_ENV === 'true') {
      courses = [
        { _id: "1", title: "Module 1: Strategy Introduction", url: "https://youtu.be/OjKrub9Hl_Y", youtubeUrl: "https://youtu.be/OjKrub9Hl_Y", order: 1, isActive: true },
        { _id: "2", title: "Module 2: Market Structure", url: "https://youtu.be/2R3GSTRh_k8", youtubeUrl: "https://youtu.be/2R3GSTRh_k8", order: 2, isActive: true },
        { _id: "3", title: "Module 3: Order Blocks & Liquidity", url: "https://youtu.be/u-P_jS7z2..", youtubeUrl: "https://youtu.be/u-P_jS7z2..", order: 3, isActive: true },
        { _id: "4", title: "Module 4: Risk Management", url: "https://youtu.be/s4tMVKiQ..", youtubeUrl: "https://youtu.be/s4tMVKiQ..", order: 4, isActive: true },
      ];
    } else {
      await connectToDatabase();
      const rawCourses = await Course.find().sort({ order: 1, createdAt: 1 }).lean();
      
      courses = (rawCourses || []).map((c: any) => ({
        _id: c._id.toString(),
        title: c.title || "",
        url: c.url || c.youtubeUrl || "",
        youtubeUrl: c.youtubeUrl || c.url || "",
        order: typeof c.order === "number" ? c.order : 0,
        isActive: c.isActive !== false,
        createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
      }));
    }
  } catch (error) {
    console.error("Failed to load courses on server:", error);
  }

  return <CourseListClient initialCourses={courses} />;
}
