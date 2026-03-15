'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const pixels = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60 + 10,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
}));

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center px-4 pt-20 relative overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(148, 113, 213, 0.03) 25%, rgba(148, 113, 213, 0.03) 26%, transparent 27%, transparent 74%, rgba(148, 113, 213, 0.03) 75%, rgba(148, 113, 213, 0.03) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(148, 113, 213, 0.03) 25%, rgba(148, 113, 213, 0.03) 26%, transparent 27%, transparent 74%, rgba(148, 113, 213, 0.03) 75%, rgba(148, 113, 213, 0.03) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated blobs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-400/5 rounded-full blur-3xl -z-20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Pixel/star layer inside hero */}
      <div className="absolute inset-x-0 top-16 bottom-16 -z-10 pointer-events-none">
        {pixels.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm bg-violet-400/70 shadow-[0_0_12px_rgba(139,92,246,0.7)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto">

        <motion.div variants={item}>
          <motion.span
            className="inline-block bg-violet-900/40 text-violet-300 border border-violet-700/50 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide mb-6"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Powered by Amazon Nova AI
          </motion.span>
        </motion.div>

        <motion.h1 variants={item} className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
          Study Smarter.<br />
          <span className="bg-linear-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            Not Harder.
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
          Upload your lecture slides. Ask questions in Roman Urdu or English. Get instant answers from your own materials.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/signup"
              className="block bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Start for Free
            </Link>
          </motion.div>
          <a
            href="#how-it-works"
            className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
          >
            See how it works
          </a>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full inline-block" />
            For Students
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full inline-block" />
            Amazon Nova AI
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full inline-block" />
            Roman Urdu Support
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
}