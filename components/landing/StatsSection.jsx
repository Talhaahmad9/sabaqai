"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Counter({ target, label, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
        {count}
        {suffix}
      </div>
      <p className="text-slate-400">{label}</p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Trusted by Students</h2>
          <p className="text-lg text-slate-400">
            Join thousands of Pakistani students who are already learning smarter
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Counter target={5000} label="Active Students" suffix="+" />
          <Counter target={50000} label="Materials Uploaded" suffix="+" />
          <Counter target={100000} label="Chats Completed" suffix="+" />
          <Counter target={98} label="Success Rate" suffix="%" />
        </div>
      </div>
    </section>
  );
}
