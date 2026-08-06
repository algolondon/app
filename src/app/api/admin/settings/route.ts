import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Setting } from '@/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Setting.find();
    
    // Convert array of key-value pairs to an object
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    return NextResponse.json(settingsObj);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    await connectToDatabase();

    // Update each setting provided in the request body
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string') {
        await Setting.findOneAndUpdate(
          { key },
          { value },
          { upsert: true, new: true }
        );
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
