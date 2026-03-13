import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import ChatShell from '@/components/chat/ChatShell';

export default async function ChatPage({ params, searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  const sessionId = params.sessionId === 'new' ? null : params.sessionId;
  const subject = searchParams?.subject || 'General';
  const userName = user?.name?.split(' ')[0] ?? 'Student';
  const userLanguage = user?.language ?? 'english';

  return (
    <div className="min-h-screen bg-slate-900">
      <ChatShell
        sessionId={sessionId}
        subject={subject}
        userLanguage={userLanguage}
        userName={userName}
      />
    </div>
  );
}
