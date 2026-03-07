import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { program, semester, subjects } = await request.json();

    // Validation
    if (!program || semester === undefined || semester === null || !subjects) {
      return NextResponse.json({ message: 'program, semester, and subjects are required' }, { status: 400 });
    }

    if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
      return NextResponse.json({ message: 'Semester must be a number between 1 and 8' }, { status: 400 });
    }

    if (!Array.isArray(subjects) || subjects.length < 1) {
      return NextResponse.json({ message: 'At least one subject is required' }, { status: 400 });
    }

    await connectDB();

    await User.findOneAndUpdate(
      { email: session.user.email },
      { program, semester, subjects },
      { new: true }
    );

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Onboarding update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
