import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Displays a realistic loading simulation UI with spinning indicators and step-by-step progress prompts.
 */
export default function LoadingSpinner() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Analyzing feature description & acceptance criteria...",
    "Extracting positive user flows & happy paths...",
    "Generating negative test scenarios & edge cases...",
    "Calculating boundary conditions & input limits...",
    "Formatting final test case suite..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-8 my-8 text-center max-w-xl mx-auto">
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute animate-ping inline-flex h-16 w-16 rounded-full bg-indigo-400 opacity-20"></div>
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1">
        Simulating AI Test Generation
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Connecting to Express Backend API (<code className="text-indigo-600 font-mono">POST /api/generate-test-cases</code>)
      </p>

      {/* Progress Steps */}
      <div className="space-y-2.5 text-left bg-slate-50 p-4 rounded-xl border border-slate-200/60 max-w-md mx-auto text-xs">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 transition-all duration-300 ${
                isCurrent
                  ? 'text-indigo-700 font-semibold scale-[1.01]'
                  : isDone
                  ? 'text-slate-500'
                  : 'text-slate-300'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0 flex items-center justify-center text-[10px]" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
