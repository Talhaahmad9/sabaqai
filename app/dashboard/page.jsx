import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Session from '@/lib/models/Session';
import DashboardShell from '@/components/dashboard/DashboardShell';

function getGreeting() {
  const hour = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    hour: 'numeric',
    hour12: false,
  });
  const h = parseInt(hour);
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  await connectDB();

  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) redirect('/login');

  const sessionsDone = await Session.countDocuments({ userId: user._id });
  const recentSessions = await Session
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const stats = {
    hoursStudied: 0,
    sessionsDone,
    topicsCovered: user.studiedTopics?.length ?? 0,
    weakTopicsCount: user.weakTopics?.length ?? 0,
  };

  const userName = user.name?.split(' ')[0] ?? 'Student';
  const userInitial = user.name?.[0]?.toUpperCase() ?? '?';

  return (
    <DashboardShell
      greeting={getGreeting()}
      userName={userName}
      userInitial={userInitial}
      stats={stats}
      sessions={JSON.parse(JSON.stringify(recentSessions))}
      weakTopics={user.weakTopics ?? []}
      materials={[]}
    />
  );
}
