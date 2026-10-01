import React from 'react';
import { 
  FileCheck, LayoutDashboard, Sparkles, Clock, Moon, Sun, 
  PlusCircle, User, LogIn, Crown, Zap, ShieldCheck 
} from 'lucide-react';

/**
 * Navbar Component
 * Navigation bar featuring active tab highlighting, dark mode toggle,
 * user authentication status, credit usage badge, and profile modal trigger.
 * (Project Report tab removed as requested).
 */
export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode,
  user,
  guestGenerationsCount = 0,
  onOpenAuth,
  onOpenAccount,
  onOpenPricing
}) {
  const isGuest = !user;
  const isPro = user?.plan === 'Pro' || user?.plan === 'Enterprise';
  const isAdmin = user?.role?.toLowerCase().includes('admin') || user?.role?.toLowerCase().includes('lead');
  const freeRemaining = user ? Math.max(0, user.freeLimit - (user.generationsUsed || 0)) : 0;
  const guestRemaining = Math.max(0, 1 - guestGenerationsCount);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
                AI TestGen
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                QA SaaS
              </span>
            </div>
          </div>

          {/* Navigation Links (Dashboard, Generator, History, Admin Portal) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'generate'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generator
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              History
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Right Action Icons: Credits, Auth/Profile, Dark Mode, New Suite */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Credit / Plan Badge */}
            {isGuest ? (
              <div 
                onClick={onOpenAuth}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                title="Guest Mode: 1 free generation allowed before login"
              >
                <span className={`w-2 h-2 rounded-full ${guestRemaining > 0 ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <span>{guestRemaining > 0 ? 'Guest: 1 Free Left' : 'Trial Ended (Login)'}</span>
              </div>
            ) : isPro ? (
              <div 
                onClick={onOpenAccount}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Pro Plan (Unlimited)</span>
              </div>
            ) : (
              <div 
                onClick={user.generationsUsed >= user.freeLimit ? onOpenPricing : onOpenAccount}
                className={`cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  user.generationsUsed >= user.freeLimit
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                }`}
                title={user.generationsUsed >= user.freeLimit ? "Click to upgrade to Pro plan" : "Click to view account usage"}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {user.generationsUsed >= user.freeLimit 
                    ? 'Limit Reached (Upgrade)' 
                    : `${user.generationsUsed}/10 Used (${freeRemaining} Left)`}
                </span>
              </div>
            )}

            {/* Auth / Account Profile Button */}
            {isGuest ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAccount}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Account Settings"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.avatar || 'RS'}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden lg:inline-block max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* New Suite CTA button */}
            <button
              type="button"
              onClick={() => setActiveTab('generate')}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Suite
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
