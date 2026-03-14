"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar, { MobileTopBar } from "@/components/dashboard/Sidebar";
import StatCards from "@/components/dashboard/StatCards";
import RecentSessions from "@/components/dashboard/RecentSessions";
import WeakTopics from "@/components/dashboard/WeakTopics";
import UploadedMaterials from "@/components/dashboard/UploadedMaterials";
import SectionHeader from "@/components/ui/SectionHeader";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function DashboardShell({
  greeting,
  userName,
  userInitial,
  stats,
  sessions,
  weakTopics,
  materials,
  subjects,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);

  const sidebarSubjects = (subjects ?? []).map((s, i) => ({ _id: i, name: s }));

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar
        subjects={sidebarSubjects}
        activeSubject={activeSubject}
        onSubjectSelect={setActiveSubject}
        onNewSubject={() => {}}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        <MobileTopBar
          onMobileOpen={() => setMobileOpen(true)}
          userInitial={userInitial}
        />

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              {greeting}, <span className="text-violet-400">{userName}</span>
            </motion.h1>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp}>
                <StatCards
                  hoursStudied={stats.hoursStudied}
                  sessionsDone={stats.sessionsDone}
                  topicsCovered={stats.topicsCovered}
                  weakTopicsCount={stats.weakTopicsCount}
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <motion.div variants={fadeUp}>
                <SectionHeader title="Recent Sessions" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <RecentSessions sessions={sessions} />
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <motion.div variants={fadeUp}>
                <SectionHeader title="Weak Topics" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <WeakTopics topics={weakTopics} />
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <motion.div variants={fadeUp}>
                <SectionHeader title="Uploaded Materials" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <UploadedMaterials materials={materials} />
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
