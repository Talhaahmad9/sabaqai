"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.4 },
  }),
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-md border-b border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <Link href="/">
            <span className="text-xl font-extrabold text-white tracking-tight cursor-pointer">
              Sabaq<span className="text-violet-400">AI</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={navItemVariants}
          >
            <Link
              href="/login"
              className="relative text-slate-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-violet-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Login
            </Link>
          </motion.div>
          <motion.div
            custom={1}
            initial="hidden"
            animate="show"
            variants={navItemVariants}
          >
            <Link
              href="/signup"
              className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-300 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="text-slate-300 hover:text-white text-sm font-medium py-2"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => setMobileOpen(false)}
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </motion.nav>
  );
}
