import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Session from "@/lib/models/Session";
import Material from "@/lib/models/Material";
import DashboardShell from "@/components/dashboard/DashboardShell";

function getGreeting() {
  const hour = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Karachi",
    hour: "numeric",
    hour12: false,
  });
  const h = parseInt(hour);
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) redirect("/login");

  const isOnboarded =
    user &&
    typeof user.program === "string" &&
    user.program.trim().length > 0 &&
    typeof user.semester === "number" &&
    user.semester >= 1 &&
    Array.isArray(user.subjects) &&
    user.subjects.length > 0;

  if (!isOnboarded) redirect("/onboarding");

  const sessionsDone = await Session.countDocuments({ userId: user._id });
  const recentSessions = await Session.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const materials = await Material.find({ userId: user._id })
    .sort({ uploadedAt: -1 })
    .limit(10)
    .lean();

  const stats = {
    hoursStudied: parseFloat(((sessionsDone * 10) / 60).toFixed(1)),
    sessionsDone,
    topicsCovered: user.studiedTopics?.length ?? 0,
    weakTopicsCount: user.weakTopics?.length ?? 0,
  };

  const userName = user.name?.split(" ")[0] ?? "Student";
  const userInitial = user.name?.[0]?.toUpperCase() ?? "?";

  return (
    <DashboardShell
      greeting={getGreeting()}
      userName={userName}
      userInitial={userInitial}
      stats={stats}
      sessions={JSON.parse(JSON.stringify(recentSessions))}
      weakTopics={user.weakTopics ?? []}
      materials={JSON.parse(JSON.stringify(materials))}
      subjects={user.subjects ?? []}
    />
  );
}
