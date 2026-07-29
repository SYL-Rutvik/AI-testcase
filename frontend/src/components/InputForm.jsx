import React from 'react';
import { Sparkles, FileText, Layers, RefreshCw } from 'lucide-react';

/**
 * InputForm Component
 * Allows user to choose input type, enter feature description/user story, and trigger test generation.
 */
export default function InputForm({
  inputType,
  setInputType,
  featureDescription,
  setFeatureDescription,
  onGenerate,
  isLoading,
  onReset
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 mb-8 transition-all hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800">Requirement Input</h2>
        </div>
        
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Load Sample User Story
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropdown for Input Type */}
        <div>
          <label htmlFor="input-type" className="block text-sm font-semibold text-slate-700 mb-2">
            Select Input Type
          </label>
          <div className="relative">
            <select
              id="input-type"
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="User Story">User Story</option>
              <option value="Feature Description">Feature Description</option>
              <option value="API Endpoint">API Endpoint</option>
            </select>
            <div className="absolute inset-y-0 left-72 sm:left-72 flex items-center pointer-events-none pr-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Choose the format of your input requirement to optimize test case generation logic.
          </p>
        </div>

        {/* Textarea for Requirement / Description */}
        <div>
          <label htmlFor="feature-description" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
            <span>Feature Description or User Story</span>
            <span className="text-xs text-slate-400 font-normal">
              {featureDescription.length} characters
            </span>
          </label>
          <div className="relative rounded-xl shadow-inner">
            <textarea
              id="feature-description"
              rows={6}
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              placeholder="e.g., As a registered user, I want to log in using my email and password so that I can access my dashboard..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all resize-y"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || !featureDescription.trim()}
            className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white text-sm shadow-md transition-all ${
              isLoading || !featureDescription.trim()
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] hover:shadow-indigo-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Test Cases...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Test Cases
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
