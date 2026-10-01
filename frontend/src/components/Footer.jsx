import React from 'react';
import { ShieldCheck, Code2, Heart } from 'lucide-react';

/**
 * Footer Component
 * Displays copyright details, tech stack badges, and college presentation tags.
 */
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          
          {/* Left info */}
          <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-600 rounded text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              AI-Powered Test Case Generator
            </span>
            <span>— React + Express Architecture</span>
          </div>

          {/* Center Viva / College Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Final Year College Project Defense & Viva Demo</span>
          </div>

          {/* Right copyright */}
          <div className="flex items-center gap-1">
            <span>Built for QA Engineering Excellence</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
