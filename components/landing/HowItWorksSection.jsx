"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload your materials",
    description:
      "Upload your lecture PDFs or PowerPoint slides. We handle the conversion automatically.",
  },
  {
    number: "02",
    title: "Ask your question",
    description:
      "Type your question in English or Roman Urdu — however feels natural to you.",
  },
  {
    number: "03",
    title: "Get instant answers",
    description:
      "Receive accurate answers with source citations showing exactly which file they came from.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-slate-800/20 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-violet-400 text-sm font-semibold tracking-widest uppercase">
            How It Works
          </span>
          <h2 className="text-white font-black text-4xl md:text-5xl mt-2">
            Three steps to better grades
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto relative">
          {/* Animated connecting line on desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="hidden md:block absolute top-1/3 left-0 right-0 h-1 bg-linear-to-r from-violet-500 via-violet-400 to-transparent origin-left"
            style={{ zIndex: -1 }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="flex-1 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-7xl font-black text-violet-900 leading-none"
              >
                {step.number}
              </motion.div>
              <h3 className="text-white font-bold text-xl mt-3">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
