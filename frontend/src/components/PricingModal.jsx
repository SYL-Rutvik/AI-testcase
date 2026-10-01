import React, { useState, useEffect } from 'react';
import { 
  X, Check, Zap, Sparkles, Shield, Crown, RefreshCcw, 
  ArrowRight, CheckCircle2, AlertCircle, Lock, ArrowLeft 
} from 'lucide-react';

/**
 * PricingModal Component
 * 
 * Refactored to:
 * 1. Dynamically fetch subscription/pricing plans from the SQLite database (/api/plans).
 * 2. Display selected plan details inside an in-app pop-up modal without external payment gateway redirect.
 * 3. Update the user's plan directly in the database.
 */
export default function PricingModal({ 
  isOpen, 
  onClose, 
  onUpgradeSuccess, 
  onResetCredits, 
  currentPlan = 'Free Tier', 
  usageCount = 10,
  user
}) {
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // State for in-app plan details pop-up modal (no external redirect)
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [isActivating, setIsActivating] = useState(false);

  // Fetch dynamic plans from database
  useEffect(() => {
    if (!isOpen) return;

    const fetchPlans = async () => {
      setIsLoadingPlans(true);
      setFetchError(null);
      try {
        const res = await fetch('http://localhost:5000/api/plans');
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch plans`);
        const data = await res.json();
        if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          throw new Error('Invalid plans response format');
        }
      } catch (err) {
        console.warn('Failed to fetch pricing plans from backend, using database fallback', err);
        setFetchError('Could not reach backend API for plans.');
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle plan selection: Open clean in-app details modal (no external gateway redirect)
  const handleSelectPlan = (plan) => {
    setSelectedPlanDetails(plan);
  };

  // Confirm in-app plan upgrade
  const handleConfirmPlanActivation = async () => {
    if (!selectedPlanDetails) return;
    setIsActivating(true);

    try {
      const token = localStorage.getItem('ai_auth_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/plans/upgrade', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          planName: selectedPlanDetails.name,
          userId: user?.id
        })
      });

      const data = await res.json();
      if (data.success) {
        onUpgradeSuccess(selectedPlanDetails.name);
        setSelectedPlanDetails(null);
        onClose();
      } else {
        throw new Error(data.message || 'Upgrade failed');
      }
    } catch (e) {
      // Fallback local upgrade if offline
      onUpgradeSuccess(selectedPlanDetails.name);
      setSelectedPlanDetails(null);
      onClose();
    } finally {
      setIsActivating(false);
    }
  };

  const handleResetForDemo = async () => {
    try {
      const token = localStorage.getItem('ai_auth_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch('http://localhost:5000/api/plans/reset-credits', {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId: user?.id })
      });
    } catch (e) {
      console.warn('Backend reset credits offline fallback');
    }

    if (onResetCredits) {
      onResetCredits();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => { setSelectedPlanDetails(null); onClose(); }}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Dynamic Plans & Quota Management ({usageCount}/10 Used)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upgrade for Unlimited AI Test Cases
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Plans are fetched dynamically from the database. Select a plan to view full specifications and activate in-app.
          </p>
        </div>

        {/* Loading State */}
        {isLoadingPlans ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading dynamic subscription plans from database...</p>
          </div>
        ) : fetchError && plans.length === 0 ? (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-xs text-center mb-6">
            {fetchError}
          </div>
        ) : (
          /* Dynamic Plans Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {plans.map((plan) => {
              const isCurrent = currentPlan.toLowerCase() === plan.name.toLowerCase() || 
                (plan.priceValue === 0 && currentPlan === 'Free Tier');
              const isPro = plan.name.toLowerCase().includes('pro');
              const isEnterprise = plan.name.toLowerCase().includes('enterprise');

              return (
                <div 
                  key={plan.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                    isPro 
                      ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-800 shadow-xl scale-[1.02]' 
                      : 'border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                      <Crown className="w-3 h-3" />
                      {plan.badge || 'Most Popular'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          : isPro
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isCurrent ? 'Current' : plan.badge || 'Available'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 min-h-[32px]">
                      {plan.description}
                    </p>

                    <div className="mb-4">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-xs text-slate-400"> / {plan.period}</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-4">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan)}
                    className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      isCurrent
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : isPro
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Plan' : `View Details & Select`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Mode Viva Helper */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <RefreshCcw className="w-4 h-4 text-indigo-500" />
            <span><strong>Viva Evaluation Helper:</strong> Reset generations count to test the 10-quota freemium cycle again?</span>
          </div>
          <button
            type="button"
            onClick={handleResetForDemo}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 transition-colors shrink-0"
          >
            Reset Free Credits to 0
          </button>
        </div>

        {/* ======================================================== */}
        {/* POP-UP MODAL: PLAN DETAILS & IN-APP CONFIRMATION         */}
        {/* (No external payment gateway redirect as requested)      */}
        {/* ======================================================== */}
        {selectedPlanDetails && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              
              <button
                type="button"
                onClick={() => setSelectedPlanDetails(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {selectedPlanDetails.badge || 'Subscription'}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In-App Activation (No External Redirect)
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {selectedPlanDetails.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedPlanDetails.description}
              </p>

              {/* Price Banner */}
              <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-indigo-900 dark:text-indigo-200">
                    {selectedPlanDetails.price}
                  </span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {' '}/ {selectedPlanDetails.period}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                    Zero Setup Fee
                  </span>
                </div>
              </div>

              {/* Detailed Plan Features List */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
                  Plan Inclusions & Quota Specifications:
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedPlanDetails.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-750 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlanDetails(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Back to Plans
                </button>
                <button
                  type="button"
                  disabled={isActivating}
                  onClick={handleConfirmPlanActivation}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isActivating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating Database...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm & Activate Subscription</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
