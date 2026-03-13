import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Session from '@/lib/models/Session';
import { queryKnowledgeBase } from '@/lib/bedrockKB';

export async function POST(request) {
  try {
    const sessionAuth = await getServerSession(authOptions);
    if (!sessionAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { question, sessionId, language = 'english', subject } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ message: 'Question is required' }, { status: 400 });
    }

    // Query KB
    const kbRes = await queryKnowledgeBase(question, sessionId, language);
    const answer = kbRes?.answer ?? '';
    const citations = kbRes?.citations ?? [];

    await connectDB();

    // Find user
    const user = await User.findOne({ email: sessionAuth.user.email });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    // Find or create session document
    let chatSession;
    if (sessionId) {
      chatSession = await Session.findById(sessionId);
    }

    if (!chatSession) {
      chatSession = new Session({
        userId: user._id,
        subject: subject || 'General',
        messages: [],
      });
    }

    // Push user and assistant messages
    chatSession.messages.push({ role: 'user', content: question });
    chatSession.messages.push({ role: 'assistant', content: answer, sourcePageNumber: null });

    await chatSession.save();

    // Update user's studiedTopics
    if (subject) {
      await User.findByIdAndUpdate(user._id, { $addToSet: { studiedTopics: subject } });
    }

    // Simple weak topic detection: count occurrences of subject string in user messages
    if (subject) {
      const subjectLower = subject.toLowerCase();
      const userMessages = chatSession.messages.filter((m) => m.role === 'user').map((m) => m.content.toLowerCase());
      const occurrences = userMessages.reduce((acc, msg) => acc + (msg.includes(subjectLower) ? 1 : 0), 0);
      if (occurrences > 2) {
        await User.findByIdAndUpdate(user._id, { $addToSet: { weakTopics: subject } });
      }
    }

    return NextResponse.json({ answer, citations, sessionId: chatSession._id }, { status: 200 });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
