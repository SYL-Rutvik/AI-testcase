import React from 'react';
import { 
  Sparkles, Layers, FileCheck2, Clock, ArrowRight, ShieldCheck, 
  CheckCircle2, Crown, Zap, Lock, LogIn, UserCheck 
} from 'lucide-react';

/**
 * DashboardPage Component
 * Displays live summary cards, welcome hero banner, execution pass-rate progress,
 * plan/quota status card, quick action CTAs, and recent activity overview.
 * (Report display removed as requested).
 */
export default function DashboardPage({ 
  onNavigateToGenerator, 
  testCases = [],
  history = [],
  user,
  guestGenerationsCount = 0,
  onOpenAuth,
  onOpenPricing,
  onOpenAccount
}) {
  const currentSuiteCases = testCases.length;
  const historyTotalCases = history.reduce((acc, h) => acc + (h.testCases?.length || 0), 0);
  const totalCombinedCases = currentSuiteCases + historyTotalCases;

  const passedCount = testCases.filter(tc => tc.status === 'Passed').length;
  const failedCount = testCases.filter(tc => tc.status === 'Failed').length;
  const passRate = currentSuiteCases > 0 ? Math.round((passedCount / currentSuiteCases) * 100) : 100;

  const isGuest = !user;
  const isPro = user?.plan === 'Pro' || user?.plan === 'Enterprise';
  const freeRemaining = user ? Math.max(0, user.freeLimit - (user.generationsUsed || 0)) : 0;
  const guestRemaining = Math.max(0, 1 - guestGenerationsCount);

  const stats = [
    {
      id: 1,
      title: "Total Test Suites",
      value: `${Math.max(history.length, 1)}`,
      change: `${history.length} saved in archive`,
      icon: Layers,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 2,
      title: "Active Test Cases",
      value: `${currentSuiteCases}`,
      change: `${passedCount} Passed (${passRate}% Rate)`,
      icon: FileCheck2,
      color: "from-indigo-600 to-purple-600",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      id: 3,
      title: "Total Scenarios Generated",
      value: `${Math.max(totalCombinedCases, 24)}`,
      change: "Positive, Negative, Boundary",
      icon: Clock,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400"
    }
  ];

  const recentSuites = history.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            QA Engineering Automation SaaS
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {user ? `Welcome back, ${user.name}! 👋` : 'AI-Powered Test Case Generator 👋'}
          </h1>
          
          <p className="mt-2 text-sm sm:text-base text-indigo-200/90 leading-relaxed">
            Accelerate your software quality lifecycle. Automatically generate positive, negative, and boundary test cases directly from user stories, feature descriptions, and REST APIs.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onNavigateToGenerator}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Create New Test Suite
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {isGuest ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                Sign In to Unlock 10 Generations
              </button>
            ) : !isPro ? (
              <button
                type="button"
                onClick={onOpenPricing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold transition-all shadow-md shadow-amber-500/20"
              >
                <Crown className="w-4 h-4 text-slate-900" />
                Upgrade to Pro Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAccount}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500/20 border border-emerald-400/30 text-emerald-300"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Pro License Active
              </button>
            )}
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Plan / Quota Notice Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl text-white ${
            isPro ? 'bg-emerald-600' : isGuest ? 'bg-amber-500' : 'bg-indigo-600'
          }`}>
            {isPro ? <Crown className="w-5 h-5" /> : isGuest ? <Lock className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {isGuest
                ? 'Guest Access Mode'
                : isPro
                ? 'Pro QA Plan License (Unlimited Access)'
                : `Free Plan Tier (${user.generationsUsed}/${user.freeLimit} Generations Used)`}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuest
                ? (guestRemaining > 0 
                    ? 'You have 1 free trial generation available without login.' 
                    : 'Your 1 free trial generation is used. Sign in to unlock 10 additional generations!')
                : isPro
                ? 'Unlimited AI test case generations, advanced boundary rules, and priority processing.'
                : `${freeRemaining} free generations remaining. Upgrade to Pro when you need unlimited access.`}
            </p>
          </div>
        </div>

        <div>
          {isGuest ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all shrink-0"
            >
              Sign In / Register
            </button>
          ) : !isPro ? (
            <button
              type="button"
              onClick={onOpenPricing}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all shrink-0"
            >
              View Upgrade Plans
            </button>
          ) : null}
        </div>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Tracker Banner & Recent Suites Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action CTA Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-indigo-950/40 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-md">
              Current Suite Status
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
              {currentSuiteCases} Active Test Cases
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Execution Pass Rate: <strong className="text-emerald-600 dark:text-emerald-400">{passRate}%</strong> ({passedCount} Passed, {failedCount} Failed).
            </p>

            <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
              <div style={{ width: `${currentSuiteCases ? (passedCount / currentSuiteCases) * 100 : 0}%` }} className="bg-emerald-500"></div>
              <div style={{ width: `${currentSuiteCases ? (failedCount / currentSuiteCases) * 100 : 0}%` }} className="bg-rose-500"></div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToGenerator}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Open Suite in Generator
          </button>
        </div>

        {/* Recent Suites Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Recent Test Suites Activity
            </h3>
            <span className="text-xs text-slate-400 font-mono">{recentSuites.length} Suites</span>
          </div>

          {recentSuites.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No suites created yet. Generate one now!</p>
          ) : (
            <div className="space-y-3">
              {recentSuites.map((suite) => (
                <div
                  key={suite.id}
                  onClick={onNavigateToGenerator}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
                      {suite.id}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                        {suite.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {suite.inputType} • {suite.testCases?.length || 0} scenarios
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{suite.timestamp || 'Today'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
