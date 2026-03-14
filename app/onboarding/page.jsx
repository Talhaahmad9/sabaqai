import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  const isOnboarded =
    user &&
    typeof user.program === "string" &&
    user.program.trim().length > 0 &&
    typeof user.semester === "number" &&
    user.semester >= 1 &&
    Array.isArray(user.subjects) &&
    user.subjects.length > 0;

  if (isOnboarded) redirect("/dashboard");

  return (
    <main className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-4 py-12">
      <OnboardingShell />
    </main>
  );
}
