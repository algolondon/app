import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, subscriptionId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    if (process.env.MOCK_ENV === 'true') {
      return NextResponse.json({ success: true });
    }

    await connectToDatabase();

    const updatePayload: any = { active: true, status: 'active' };
    if (subscriptionId) {
      updatePayload.paypalSubscriptionId = subscriptionId;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updatePayload,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Checkout success error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
