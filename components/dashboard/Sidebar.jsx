"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

function ChevronLeftIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

function HamburgerIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function SidebarContent({
  collapsed,
  subjects,
  activeSubject,
  onSubjectSelect,
  onNewSubject,
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center h-14 px-4 shrink-0 ${collapsed ? "justify-center" : "justify-start"}`}
      >
        {collapsed ? (
          <span className="text-xl font-extrabold text-white">S</span>
        ) : (
          <span className="text-xl font-extrabold text-white tracking-tight">
            Sabaq<span className="text-violet-400">AI</span>
          </span>
        )}
      </div>

      <div className="border-t border-slate-700 mx-3" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 mb-2">
            Subjects
          </p>
        )}

        {subjects && subjects.length > 0
          ? subjects.map((subject) => (
              <button
                key={subject._id}
                onClick={() => {
                  onSubjectSelect(subject._id);
                  router.push(
                    `/chat/new?subject=${encodeURIComponent(subject.name)}`,
                  );
                }}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors cursor-pointer
                ${
                  activeSubject === subject._id
                    ? "bg-violet-600 text-violet-300"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }
                ${collapsed ? "justify-center" : "justify-start"}`}
              >
                <span className="text-lg shrink-0">📚</span>
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {subject.name}
                  </span>
                )}
              </button>
            ))
          : !collapsed && (
              <p className="text-xs text-slate-500 px-2">No subjects yet.</p>
            )}

        <button
          onClick={onNewSubject}
          className={`w-full flex items-center gap-3 px-2 py-2 mt-2 rounded-lg border border-violet-500 text-violet-400
            hover:bg-violet-500/10 transition-colors
            ${collapsed ? "justify-center" : "justify-start"}`}
        >
          <span className="text-lg font-bold leading-none shrink-0">+</span>
          {!collapsed && (
            <span className="text-sm font-medium whitespace-nowrap">
              New Subject
            </span>
          )}
        </button>
      </div>

      <div className="border-t border-slate-700 mx-3 mb-2" />
      <div
        className={`px-3 pb-4 space-y-1 ${collapsed ? "flex flex-col items-center" : ""}`}
      >
        <button
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-slate-400
            hover:text-white hover:bg-slate-700 transition-colors
            ${collapsed ? "justify-center" : "justify-start"}`}
        >
          <SettingsIcon className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <span className="text-sm whitespace-nowrap">Settings</span>
          )}
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-slate-400
            hover:text-white hover:bg-slate-700 transition-colors
            ${collapsed ? "justify-center" : "justify-start"}`}
        >
          <LogoutIcon className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <span className="text-sm whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({
  subjects,
  activeSubject,
  onSubjectSelect,
  onNewSubject,
  isMobileOpen,
  onMobileClose,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex flex-col relative h-screen bg-slate-800 border-r border-slate-700 shrink-0 overflow-hidden"
      >
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute top-3.5 right-3 z-10 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>

        <SidebarContent
          collapsed={collapsed}
          subjects={subjects}
          activeSubject={activeSubject}
          onSubjectSelect={onSubjectSelect}
          onNewSubject={onNewSubject}
        />
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />

            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed top-0 left-0 z-50 h-full w-[260px] bg-slate-800 border-r border-slate-700 md:hidden"
            >
              <SidebarContent
                collapsed={false}
                subjects={subjects}
                activeSubject={activeSubject}
                onSubjectSelect={(id) => {
                  onSubjectSelect(id);
                  onMobileClose();
                }}
                onNewSubject={() => {
                  onNewSubject();
                  onMobileClose();
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileTopBar({ onMobileOpen, userInitial }) {
  return (
    <header className="md:hidden flex items-center justify-between h-14 px-4 bg-slate-800 border-b border-slate-700 shrink-0">
      <button
        onClick={onMobileOpen}
        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        aria-label="Open menu"
      >
        <HamburgerIcon className="h-5 w-5" />
      </button>

      <span className="text-xl font-extrabold text-white tracking-tight">
        Sabaq<span className="text-violet-400">AI</span>
      </span>

      <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center">
        <span className="text-white text-sm font-semibold uppercase">
          {userInitial ?? "?"}
        </span>
      </div>
    </header>
  );
}
