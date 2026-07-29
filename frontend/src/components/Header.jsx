import React from 'react';
import { Sparkles, FileCheck, Code2, ShieldCheck } from 'lucide-react';

/**
 * Header Component
 * Displays the title banner with modern indigo/blue gradient aesthetics
 */
export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white border-b border-indigo-800/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI QA & Testing Tool
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ready for Gemini Integration
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-md">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              AI-Powered Test Case Generator
            </h1>
            
            <p className="mt-2 text-base text-indigo-200/90 max-w-2xl">
              Transform user stories, feature specs, and API endpoints into comprehensive positive, negative, and boundary test scenarios automatically.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs text-indigo-200">
            <Code2 className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Full-Stack Architecture</p>
              <p className="text-indigo-300/80">React Frontend + Express API Server</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
