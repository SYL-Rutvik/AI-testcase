import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, RefreshCw, AlertTriangle, Cpu, Bookmark, Crown, Zap, Lock, LogIn } from 'lucide-react';
import { PRESET_REQUIREMENTS } from '../data/dummyData';

/**
 * GeneratorPage Component
 * Manages requirement inputs, input type selection, character counter validation (1000 char max limit),
 * 1-click preset templates, generation quota/credit tracker, animated loading state, and error handling.
 */
export default function GeneratorPage({
  inputType,
  setInputType,
  featureDescription,
  setFeatureDescription,
  onGenerate,
  isLoading,
  errorState,
  onRetry,
  user,
  guestGenerationsCount = 0,
  onOpenAuth,
  onOpenPricing
}) {
  const MAX_CHAR_LIMIT = 1000;
  const isOverLimit = featureDescription.length > MAX_CHAR_LIMIT;
  const isEmpty = featureDescription.trim().length === 0;

  const isGuest = !user;
  const isPro = user?.plan === 'Pro' || user?.plan === 'Enterprise';
  const isFreeExhausted = user && !isPro && (user.generationsUsed >= user.freeLimit);
  const isGuestExhausted = isGuest && guestGenerationsCount >= 1;

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

  // Dynamic preset templates fetched from SQLite database
  const [presets, setPresets] = useState(PRESET_REQUIREMENTS);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/presets');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.presets) && data.presets.length > 0) {
            setPresets(data.presets);
          }
        }
      } catch (e) {
        console.warn('Presets database fetch fallback to default templates');
      }
    };
    fetchPresets();
  }, []);

  const handleSelectPreset = (preset) => {
    setInputType(preset.inputType);
    setFeatureDescription(preset.description);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8 mb-8 transition-all">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-6 gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Generate Test Suite</h2>
        </div>
        
        {/* Quota Status Badge */}
        <div className="flex items-center gap-2">
          {isGuest ? (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              isGuestExhausted 
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              <Lock className="w-3 h-3" />
              <span>{isGuestExhausted ? 'Guest Limit Reached (Sign In)' : 'Guest Trial: 1 Free Generation'}</span>
            </span>
          ) : isPro ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Pro Plan: Unlimited Generations</span>
            </span>
          ) : (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              isFreeExhausted
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}>
              <Zap className="w-3 h-3" />
              <span>{isFreeExhausted ? '10/10 Limit Reached (Upgrade)' : `Free Quota: ${user.generationsUsed}/10 Used`}</span>
            </span>
          )}
        </div>
      </div>

      {/* Preset Templates Quick Bar */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-200/60 dark:border-slate-700">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2.5">
          <Bookmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Quick Preset Templates (1-Click Fill):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-all hover:border-indigo-300 dark:hover:border-indigo-500 shadow-xs flex items-center gap-1.5"
            >
              <span>{preset.badge}</span>
              <span className="font-semibold">{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Fallback State UI */}
      {errorState ? (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl p-6 mb-6 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-2 animate-bounce" />
          <h3 className="text-base font-bold text-rose-800 dark:text-rose-300">Generation Failed</h3>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 mb-4">{errorState}</p>
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
          <label htmlFor="input-type" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Input Specification Type
          </label>
          <div className="relative">
            <select
              id="input-type"
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="User Story">User Story</option>
              <option value="Feature Description">Feature Description</option>
              <option value="API Endpoint Spec">API Endpoint Spec</option>
            </select>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Selecting the exact format helps tailor positive, negative, and boundary test scenarios.
          </p>
        </div>

        {/* Textarea with Live Character Counter & Limit Warning */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="feature-description" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Requirement / Feature Specification
            </label>
            <div className="flex items-center gap-3">
              {featureDescription && (
                <button
                  type="button"
                  onClick={() => setFeatureDescription('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear text
                </button>
              )}
              <span className={`text-xs font-mono font-semibold ${
                isOverLimit ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {featureDescription.length} / {MAX_CHAR_LIMIT} characters
              </span>
            </div>
          </div>

          <textarea
            id="feature-description"
            rows={6}
            value={featureDescription}
            onChange={(e) => setFeatureDescription(e.target.value)}
            placeholder="Enter user story, acceptance criteria, or API payload specs here..."
            className={`w-full px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 transition-all resize-y ${
              isOverLimit
                ? 'border-2 border-rose-500 bg-rose-50/30 focus:ring-rose-500'
                : 'border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 focus:bg-white dark:focus:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
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
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-indigo-400 opacity-30"></span>
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">AI Test Case Generation in Progress</p>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mt-1 transition-all">
                {loadingMessages[currentStepIdx]}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            
            {/* Limit notification tip */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isGuest ? (
                isGuestExhausted ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <LogIn className="w-3.5 h-3.5" /> 1 Free trial used. Sign in to unlock 10 more generations.
                  </span>
                ) : (
                  <span>Guest trial: 1 free generation available without login.</span>
                )
              ) : isFreeExhausted ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500" /> Free quota reached (10/10). Upgrade to Pro for unlimited.
                </span>
              ) : isPro ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> Pro Member: Enjoy unlimited AI generations.
                </span>
              ) : (
                <span>Free Plan: <strong>{10 - (user?.generationsUsed || 0)}</strong> generations remaining.</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isEmpty || isOverLimit || isLoading}
              className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white text-sm shadow-md transition-all ${
                isEmpty || isOverLimit || isLoading
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] hover:shadow-indigo-500/25'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isGuestExhausted 
                ? 'Sign In to Generate'
                : isFreeExhausted
                ? 'Upgrade to Generate'
                : 'Generate Test Cases'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
