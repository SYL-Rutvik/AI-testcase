import React, { useState } from 'react';
import { Clock, Layers, Trash2, Eye, FileText, Search, Sparkles, FolderOpen } from 'lucide-react';

/**
 * HistoryPage Component
 * Displays historical test suites stored in LocalStorage/State.
 * Allows re-opening past suites, searching history, and deleting history records.
 */
export default function HistoryPage({ history = [], onViewSuite, onDeleteSuite, onNavigateToGenerator }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.inputType?.toLowerCase().includes(term) ||
      item.id?.toLowerCase().includes(term)
    );
  });

  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
          <FolderOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          No Test Suite History Yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          Generate your first test suite using the AI Test Case Generator to populate your historical archive!
        </p>
        <button
          type="button"
          onClick={onNavigateToGenerator}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Generate First Test Suite
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Test Suite Archive History
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View, re-open, or export previously generated test case suites.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {item.inputType || 'User Story'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.timestamp || 'Today'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <strong>{item.testCases?.length || 0}</strong> scenarios
                </span>
                {item.isLiveAI && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Gemini AI
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onViewSuite(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View Suite
              </button>

              <button
                type="button"
                onClick={() => onDeleteSuite(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                title="Delete history entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
