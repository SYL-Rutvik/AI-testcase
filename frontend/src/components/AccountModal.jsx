import React from 'react';
import { X, User, Mail, Shield, Zap, Sparkles, LogOut, RefreshCw, Crown } from 'lucide-react';

/**
 * AccountModal Component
 * Displays user profile, current plan, credit balance, upgrade button, and logout action.
 */
export default function AccountModal({ isOpen, onClose, user, onUpgradeClick, onResetCredits, onLogout, onSwitchRole }) {
  if (!isOpen || !user) return null;

  const isPro = user.plan === 'Pro' || user.plan === 'Enterprise';
  const isAdmin = user.role?.toLowerCase().includes('admin');
  const remaining = Math.max(0, user.freeLimit - (user.generationsUsed || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Avatar & Name */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-md shadow-indigo-500/30">
            {user.avatar || 'RS'}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user.email}
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {user.role}
          </span>
        </div>

        {/* Plan & Usage Card */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Subscription Plan
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
              isPro
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
            }`}>
              {isPro ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {user.plan}
            </span>
          </div>

          {isPro ? (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold py-1">
              ✨ Unlimited AI Test Case Generations Active
            </div>
          ) : (
            <div>
              <div className="flex items-baseline justify-between text-xs mb-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <span>Generations Used:</span>
                <span>{user.generationsUsed} / {user.freeLimit}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(100, (user.generationsUsed / user.freeLimit) * 100)}%` }}
                  className={`transition-all duration-300 ${
                    user.generationsUsed >= user.freeLimit ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {remaining > 0 ? `${remaining} free generations remaining.` : 'Free quota exhausted. Upgrade for unlimited generations.'}
              </p>
            </div>
          )}

          {!isPro && (
            <button
              type="button"
              onClick={() => { onClose(); onUpgradeClick(); }}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade to Pro Plan</span>
            </button>
          )}
        </div>

        {/* Demo Helper & Logout Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          {onSwitchRole && (
            <button
              type="button"
              onClick={() => { onSwitchRole(); onClose(); }}
              className="w-full py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-purple-200/60 dark:border-purple-800/60"
            >
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span>{isAdmin ? 'Switch Role: QA Automation Lead' : 'Switch Role: System Administrator'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => { onResetCredits(); onClose(); }}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Usage (Reset to 0)</span>
          </button>

          <button
            type="button"
            onClick={() => { onLogout(); onClose(); }}
            className="w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
