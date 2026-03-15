"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const floatingParticles = [
  { id: 1, top: '10%', left: '5%', delay: 0 },
  { id: 2, top: '20%', right: '8%', delay: 0.5 },
  { id: 3, bottom: '20%', left: '10%', delay: 1 },
  { id: 4, top: '40%', right: '5%', delay: 1.5 },
  { id: 5, bottom: '10%', right: '15%', delay: 0.8 },
  { id: 6, top: '60%', left: '8%', delay: 1.2 },
];

export default function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Floating particles */}
      {floatingParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-violet-400/20 rounded-full blur-sm pointer-events-none"
          style={{
            top: particle.top,
            bottom: particle.bottom,
            left: particle.left,
            right: particle.right,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-linear-to-br from-violet-900/30 to-slate-800/30 border border-violet-700/30 rounded-3xl p-12 relative overflow-hidden"
        >
          {/* Animated gradient border effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0) 50%)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <h2 className="text-white font-black text-4xl md:text-5xl mb-4 relative z-10">
            Ready to study smarter?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto relative z-10">
            Join students who are already using SabaqAI to understand their
            lectures faster.
          </p>
          <motion.div
            whileHover={{ scale: 1.08 }}
            animate={{
              boxShadow: [
                '0 0 0px rgb(139 92 246 / 0)',
                '0 0 30px rgb(139 92 246 / 0.4)',
                '0 0 0px rgb(139 92 246 / 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block relative z-10"
          >
            <Link
              href="/signup"
              className="inline-block bg-violet-600 hover:bg-violet-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Start for Free
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
