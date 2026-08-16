import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Course } from '@/models/Course';

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, url, order, isActive, courseCategory, description, attachments } = body;
    
    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    await connectToDatabase();
    const course = await Course.create({ 
      title, 
      url, 
      order: order || 0, 
      isActive: isActive ?? true,
      courseCategory: courseCategory || "Course 1: Trend Algo Strategy",
      description: description || "",
      attachments: Array.isArray(attachments) ? attachments : []
    });
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Failed to create course:", error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
