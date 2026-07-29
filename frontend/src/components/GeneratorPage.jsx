import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, RefreshCw, AlertTriangle, Cpu, CheckCircle2 } from 'lucide-react';

/**
 * GeneratorPage Component
 * Manages requirement inputs, input type selection, character counter validation (1000 char max limit),
 * animated loading state with rotating status messages, and error boundary handling.
 */
export default function GeneratorPage({
  inputType,
  setInputType,
  featureDescription,
  setFeatureDescription,
  onGenerate,
  isLoading,
  errorState,
  onRetry
}) {
  const MAX_CHAR_LIMIT = 1000;
  const isOverLimit = featureDescription.length > MAX_CHAR_LIMIT;
  const isEmpty = featureDescription.trim().length === 0;

  // Rotating status message state during generation loading
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const loadingMessages = [
    "Analyzing requirement & input parameters...",
    "Extracting positive happy path user flows...",
    "Identifying negative edge cases & error paths...",
    "Calculating boundary conditions & payload limits...",
    "Structuring standardized test case rows..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      setCurrentStepIdx(0);
      interval = setInterval(() => {
        setCurrentStepIdx(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmpty && !isOverLimit && !isLoading) {
      onGenerate();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 mb-8 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800">Generate Test Suite</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Phase 1 Core Generator
        </span>
      </div>

      {/* Error Fallback State UI */}
      {errorState ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-6 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-2 animate-bounce" />
          <h3 className="text-base font-bold text-rose-800">Generation Failed</h3>
          <p className="text-xs text-rose-600 mt-1 mb-4">{errorState}</p>
          <button
            type="button"
            onClick={onRetry || onGenerate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Type Dropdown */}
        <div>
          <label htmlFor="input-type" className="block text-sm font-semibold text-slate-700 mb-2">
            Input Specification Type
          </label>
          <div className="relative">
            <select
              id="input-type"
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="User Story">User Story</option>
              <option value="Feature Description">Feature Description</option>
              <option value="API Endpoint Spec">API Endpoint Spec</option>
            </select>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Selecting the exact format helps tailor positive, negative, and boundary test scenarios.
          </p>
        </div>

        {/* Textarea with Live Character Counter & Limit Warning */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="feature-description" className="text-sm font-semibold text-slate-700">
              Requirement / Feature Specification
            </label>
            <span className={`text-xs font-mono font-semibold ${
              isOverLimit ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded' : 'text-slate-500'
            }`}>
              {featureDescription.length} / {MAX_CHAR_LIMIT} characters
            </span>
          </div>

          <textarea
            id="feature-description"
            rows={6}
            value={featureDescription}
            onChange={(e) => setFeatureDescription(e.target.value)}
            placeholder="Enter user story, acceptance criteria, or API payload specs here..."
            className={`w-full px-4 py-3 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:ring-2 focus:bg-white transition-all resize-y ${
              isOverLimit
                ? 'border-2 border-rose-500 bg-rose-50/30 focus:ring-rose-500'
                : 'border border-slate-300 bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            required
          />

          {/* Character Limit Warning Banner */}
          {isOverLimit && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Input exceeds maximum allowable length of {MAX_CHAR_LIMIT} characters. Please shorten requirement description.</span>
            </div>
          )}
        </div>

        {/* Loading Spinner & Rotating Status Text */}
        {isLoading ? (
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-6 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-indigo-400 opacity-30"></span>
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold text-indigo-900">AI Test Case Generation in Progress</p>
              <p className="text-xs text-indigo-700 font-medium mt-1 transition-all">
                {loadingMessages[currentStepIdx]}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isEmpty || isOverLimit || isLoading}
              className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white text-sm shadow-md transition-all ${
                isEmpty || isOverLimit || isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] hover:shadow-indigo-500/25'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Generate Test Cases
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
