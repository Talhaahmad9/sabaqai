import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Session from '@/lib/models/Session';

export async function GET(request, { params }) {
  try {
    const sessionAuth = await getServerSession(authOptions);
    if (!sessionAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params || {};
    if (!sessionId) {
      return NextResponse.json({ message: 'Missing session id' }, { status: 400 });
    }

    await connectDB();

    // Ensure the session belongs to the logged-in user
    const chatSession = await Session.findOne({ _id: sessionId, userId: sessionAuth.user.id }).lean();
    if (!chatSession) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ messages: chatSession.messages || [] }, { status: 200 });
  } catch (err) {
    console.error('Get session error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
