'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from '@/components/onboarding/ProgressBar';
import StepProgram from '@/components/onboarding/StepProgram';
import StepSemester from '@/components/onboarding/StepSemester';
import StepSubjects from '@/components/onboarding/StepSubjects';

const TOTAL_STEPS = 3;

function slideVariants(direction) {
  return {
    enter:  { x: direction > 0 ? 60 : -60, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit:   { x: direction > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  };
}

export default function OnboardingShell() {
  const router = useRouter();

  const [step, setStep]           = useState(1);
  const [direction, setDirection] = useState(1);
  const [program, setProgram]     = useState('');
  const [semester, setSemester]   = useState(null);
  const [subjects, setSubjects]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  function canProceed() {
    if (step === 1) return !!program;
    if (step === 2) return semester !== null;
    if (step === 3) return subjects.length > 0;
    return false;
  }

  function goNext() {
    if (!canProceed()) return;
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function goBack() {
    if (step === 1) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program, semester, subjects }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const variants = slideVariants(direction);

  return (
    <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
      {/* Logo */}
      <div className="mb-6">
        <span className="text-2xl font-extrabold text-white tracking-tight">
          Sabaq<span className="text-violet-400">AI</span>
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      {/* Step content */}
      <div className="overflow-hidden min-h-72">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 1 && <StepProgram value={program} onChange={setProgram} />}
            {step === 2 && <StepSemester value={semester} onChange={setSemester} />}
            {step === 3 && <StepSubjects subjects={subjects} onChange={setSubjects} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm text-center mt-4"
        >
          {error}
        </motion.p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 text-sm font-medium
            hover:border-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors"
        >
          Back
        </button>

        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canProceed() || loading}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500
            disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm
            transition-colors duration-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : step === TOTAL_STEPS ? (
            'Start Studying \u2192'
          ) : (
            'Next'
          )}
        </motion.button>
      </div>
    </div>
  );
}
