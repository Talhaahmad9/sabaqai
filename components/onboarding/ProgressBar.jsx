export default function ProgressBar({ currentStep, totalSteps }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-1.5 mb-8">
      <p className="text-slate-400 text-sm">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
