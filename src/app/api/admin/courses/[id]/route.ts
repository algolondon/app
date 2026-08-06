import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Course } from '@/models/Course';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url, order, isActive } = await request.json();
    const resolvedParams = await params;
    
    await connectToDatabase();
    
    // Auto-adjust orders if this course's order is changing
    const existingCourse = await Course.findById(resolvedParams.id);
    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (order !== undefined && existingCourse.order !== order) {
      if (existingCourse.order < order) {
        // Shifting down: push intermediate courses up
        await Course.updateMany(
          { order: { $gt: existingCourse.order, $lte: order } },
          { $inc: { order: -1 } }
        );
      } else if (existingCourse.order > order) {
        // Shifting up: push intermediate courses down
        await Course.updateMany(
          { order: { $gte: order, $lt: existingCourse.order } },
          { $inc: { order: 1 } }
        );
      }
    }

    const course = await Course.findByIdAndUpdate(
      resolvedParams.id,
      { title, url, order, isActive },
      { returnDocument: 'after' } // updated to avoid deprecation warning
    );

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectToDatabase();
    
    const courseToDelete = await Course.findById(resolvedParams.id);
    if (!courseToDelete) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    await Course.findByIdAndDelete(resolvedParams.id);
    
    // Shift all subsequent courses down by 1
    await Course.updateMany(
      { order: { $gt: courseToDelete.order } },
      { $inc: { order: -1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
