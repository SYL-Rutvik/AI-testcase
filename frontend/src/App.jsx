import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import GeneratorPage from './components/GeneratorPage';
import ExportToolbar from './components/ExportToolbar';
import TestCaseTable from './components/TestCaseTable';
import HistoryPage from './pages/HistoryPage';
import AdminPortalPage from './pages/AdminPortalPage';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import AccountModal from './components/AccountModal';
import { ToastProvider, useToast } from './context/ToastContext';
import { INITIAL_TEST_CASES, MOCK_USER_STORY } from './data/dummyData';
import { Server, Wifi, WifiOff, Sparkles, Lock, Zap, Crown, ShieldAlert, KeyRound } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'generate' | 'history' | 'admin'
  const [darkMode, setDarkMode] = useState(false);
  const [inputType, setInputType] = useState('User Story');
  const [featureDescription, setFeatureDescription] = useState(MOCK_USER_STORY);
  const [testCases, setTestCases] = useState(INITIAL_TEST_CASES);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [apiSource, setApiSource] = useState('SQLite + Express AI Engine');

  // Authentication & Session States
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_test_user');
      return saved ? JSON.parse(saved) : null; // Guest by default
    } catch (e) {
      return null;
    }
  });

  const [guestGenerationsCount, setGuestGenerationsCount] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_test_guest_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // History State
  const [history, setHistory] = useState([]);

  const { addToast } = useToast();

  // Dark Mode Class Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync User with LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('ai_test_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('ai_test_user');
      }
    } catch (e) {
      console.warn('Failed to persist user to localStorage', e);
    }
  }, [user]);

  // Sync Guest Count
  useEffect(() => {
    try {
      localStorage.setItem('ai_test_guest_count', guestGenerationsCount.toString());
    } catch (e) {
      console.warn('Failed to persist guest count', e);
    }
  }, [guestGenerationsCount]);

  // ==========================================
  // DYNAMIC DATA LOAD FROM DATABASE ON STARTUP
  // ==========================================
  useEffect(() => {
    // 1. Verify user session with /api/auth/me if token exists
    const token = localStorage.getItem('ai_auth_token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('ai_auth_token');
        }
      })
      .catch(() => {});
    }

    // 2. Fetch Initial Test Cases from SQLite database
    fetch('http://localhost:5000/api/test-cases/initial')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.testCases) && data.testCases.length > 0) {
          setTestCases(data.testCases);
        }
      })
      .catch(() => {
        console.warn('Using local fallback initial test cases');
      });

    // 3. Fetch History Suites from SQLite database
    fetch('http://localhost:5000/api/history')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.history) && data.history.length > 0) {
          setHistory(data.history);
        } else {
          // Fallback to local storage if DB empty
          try {
            const saved = localStorage.getItem('ai_test_case_history');
            if (saved) setHistory(JSON.parse(saved));
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem('ai_test_case_history');
          if (saved) setHistory(JSON.parse(saved));
        } catch (e) {}
      });
  }, []);

  // Trigger test case generation with Guest (1 free) & Logged-in (10 limit) guards
  const handleGenerate = async () => {
    // 1. Guard for Guest Users (Allow only 1 free generation)
    if (!user) {
      if (guestGenerationsCount >= 1) {
        setIsAuthModalOpen(true);
        addToast("Guest trial limit reached (1/1). Sign in to unlock 10 free generations!", "info");
        return;
      }
    }

    // 2. Guard for Free Tier Users (Limit 10 generations)
    if (user && user.plan === 'Free Tier' && user.generationsUsed >= user.freeLimit) {
      setIsPricingModalOpen(true);
      addToast("Free generation limit reached (10/10). Upgrade to Pro for unlimited generations!", "warning");
      return;
    }

    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await fetch('http://localhost:5000/api/generate-test-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputType,
          featureDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to communicate with Express API`);
      }

      const result = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (result.success && Array.isArray(result.data)) {
        setTestCases(result.data);
        setSelectedIds([]);
        
        const sourceLabel = result.meta?.isLiveAI 
          ? `Google Gemini AI (${inputType})` 
          : `Express NLP Engine (${inputType})`;
        setApiSource(sourceLabel);

        // Add to Database History
        const token = localStorage.getItem('ai_auth_token');
        try {
          await fetch('http://localhost:5000/api/history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              title: featureDescription.slice(0, 60) + (featureDescription.length > 60 ? '...' : ''),
              inputType,
              isLiveAI: !!result.meta?.isLiveAI,
              testCases: result.data
            })
          });
        } catch (dbErr) {
          console.warn('Failed to save to database history:', dbErr);
        }

        // Add to Local State History
        const newHistoryEntry = {
          id: `SUITE-${Date.now().toString().slice(-4)}`,
          title: featureDescription.slice(0, 60) + (featureDescription.length > 60 ? '...' : ''),
          inputType,
          timestamp: new Date().toISOString().slice(0, 10),
          testCases: result.data,
          isLiveAI: !!result.meta?.isLiveAI
        };

        setHistory(prev => [newHistoryEntry, ...prev]);

        // Increment usage counters
        if (!user) {
          setGuestGenerationsCount(prev => prev + 1);
          addToast(`Generated ${result.data.length} test cases! (1 of 1 Free Guest Generation used)`, 'success');
        } else {
          setUser(prev => ({
            ...prev,
            generationsUsed: (prev.generationsUsed || 0) + 1
          }));

          const updatedUsed = (user.generationsUsed || 0) + 1;
          if (user.plan === 'Free Tier') {
            const left = Math.max(0, user.freeLimit - updatedUsed);
            addToast(`Generated ${result.data.length} test cases! (${updatedUsed}/10 used, ${left} remaining)`, 'success');
          } else {
            addToast(`Generated ${result.data.length} test cases! (Pro Unlimited)`, 'success');
          }
        }
      } else {
        throw new Error(result.message || 'Malformed API response');
      }
    } catch (err) {
      console.warn('Express backend offline or error encountered. Falling back to local dataset.', err);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setTestCases(INITIAL_TEST_CASES);
      setSelectedIds([]);
      setApiSource('Frontend Mock Dataset (Express Server Offline)');

      if (!user) {
        setGuestGenerationsCount(prev => prev + 1);
      } else {
        setUser(prev => ({ ...prev, generationsUsed: (prev.generationsUsed || 0) + 1 }));
      }

      addToast('Generated test cases using fallback mock data', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  // Auth & RBAC Redirection Handler
  const handleLoginSuccess = (authenticatedUser, token, redirectDashboard) => {
    setUser(authenticatedUser);
    if (token) {
      localStorage.setItem('ai_auth_token', token);
    }

    const isAdmin = (authenticatedUser.role || '').toLowerCase() === 'admin' || 
      (authenticatedUser.role || '').toLowerCase().includes('admin');

    if (redirectDashboard === 'admin' || isAdmin) {
      setActiveTab('admin');
      addToast(`Logged in as Administrator (${authenticatedUser.name})! Redirected to Admin Portal.`, 'success');
    } else {
      setActiveTab('dashboard');
      addToast(`Welcome, ${authenticatedUser.name}! (${authenticatedUser.role || 'QA Engineer'}). Redirected to User Dashboard.`, 'success');
    }
  };

  const handleUpgradeSuccess = (planName) => {
    if (user) {
      setUser(prev => ({ 
        ...prev, 
        plan: planName,
        freeLimit: 999999
      }));
    }
    addToast(`Upgraded to ${planName} Plan! Unlimited test generations activated! ⚡`, 'success');
  };

  const handleResetCredits = () => {
    setGuestGenerationsCount(0);
    if (user) {
      setUser(prev => ({ ...prev, generationsUsed: 0, plan: 'Free Tier', freeLimit: 10 }));
    }
    addToast('Demo usage reset! You can now test the complete 1-guest + 10-free limit cycle.', 'info');
  };

  const handleLogout = () => {
    localStorage.removeItem('ai_auth_token');
    localStorage.removeItem('ai_test_user');
    setUser(null);
    setGuestGenerationsCount(0);
    setActiveTab('dashboard');
    addToast('Signed out successfully. Returned to Guest Mode.', 'info');
  };

  // 1-Click Role Switcher for Viva Demo (QA Lead <-> Super Admin)
  const handleSwitchToAdminRole = () => {
    if (user) {
      const isCurrentAdmin = (user.role || '').toLowerCase().includes('admin');
      const updatedRole = isCurrentAdmin ? 'user' : 'admin';
      const updatedRoleName = isCurrentAdmin ? 'QA Automation Lead' : 'Administrator';
      const updatedPlan = isCurrentAdmin ? 'Free Tier' : 'Enterprise';
      const updatedUser = {
        ...user,
        role: updatedRole,
        plan: updatedPlan,
        freeLimit: updatedPlan === 'Enterprise' ? 999999 : 10
      };
      setUser(updatedUser);
      if (updatedRole === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      addToast(`Switched active role to ${updatedRoleName}!`, 'success');
    } else {
      const adminUser = {
        id: 'USR-ADMIN-01',
        name: 'Prof. Jay Pithadiya',
        email: 'admin@rku.ac.in',
        role: 'admin',
        plan: 'Enterprise',
        generationsUsed: 0,
        freeLimit: 999999,
        avatar: 'JP',
        provider: 'demo'
      };
      setUser(adminUser);
      setActiveTab('admin');
      addToast('Logged in as Administrator (Prof. Jay Pithadiya)', 'success');
    }
  };

  // Add custom test case
  const handleAddTestCase = (newCase) => {
    setTestCases((prev) => [newCase, ...prev]);
    addToast(`Added custom test case ${newCase.id}`, 'success');
  };

  // Update existing test case
  const handleUpdateTestCase = (updatedCase) => {
    setTestCases((prev) => prev.map((tc) => (tc.id === updatedCase.id ? updatedCase : tc)));
    addToast(`Updated test case ${updatedCase.id}`, 'info');
  };

  // Update test execution status (Passed, Failed, Blocked, Pending)
  const handleUpdateStatus = (id, newStatus) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, status: newStatus } : tc))
    );
    addToast(`Marked ${id} as ${newStatus}`, 'info');
  };

  // Inline delete row handler
  const handleDeleteRow = (idToDelete) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== idToDelete));
    setSelectedIds((prev) => prev.filter((id) => id !== idToDelete));
    addToast(`Deleted test case ${idToDelete}`, 'warning');
  };

  // Toggle single row selection
  const handleToggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all / Deselect all rows
  const handleSelectAllRows = (shouldSelectAll, visibleIds) => {
    if (shouldSelectAll) {
      setSelectedIds(visibleIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Open historical test suite
  const handleViewHistoricalSuite = (suite) => {
    setTestCases(suite.testCases || []);
    setInputType(suite.inputType || 'User Story');
    setSelectedIds([]);
    setActiveTab('generate');
    addToast(`Opened historical suite "${suite.id}"`, 'info');
  };

  // Delete historical test suite from database & state
  const handleDeleteHistoricalSuite = async (suiteId) => {
    try {
      const token = localStorage.getItem('ai_auth_token');
      await fetch(`http://localhost:5000/api/history/${suiteId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch (e) {
      console.warn('Backend history delete error', e);
    }
    setHistory(prev => prev.filter(item => item.id !== suiteId));
    addToast(`Deleted historical suite "${suiteId}"`, 'warning');
  };

  // Check if current user has admin rights
  const isAdmin = user && ((user.role || '').toLowerCase() === 'admin' || (user.role || '').toLowerCase().includes('admin'));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        guestGenerationsCount={guestGenerationsCount}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Backend & Quota Status Notification Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-sm gap-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Data Engine:</span>
            <span className="font-mono text-indigo-700 dark:text-indigo-400 font-medium">{apiSource}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            {/* User Plan Quota Tag */}
            {!user ? (
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Guest Trial: {1 - guestGenerationsCount > 0 ? '1 Free Generation Left' : '0 Left (Sign In)'}</span>
              </span>
            ) : user.plan === 'Pro' || user.plan === 'Enterprise' ? (
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <Crown className="w-3.5 h-3.5" />
                <span>{user.plan} Member: Unlimited Generations</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Free Tier: {user.generationsUsed || 0}/10 Used ({Math.max(0, 10 - (user.generationsUsed || 0))} Left)</span>
              </span>
            )}

            <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-3">
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">SQLite DB Active</span>
            </div>
          </div>
        </div>

        {/* Tab View Switcher */}
        {activeTab === 'dashboard' ? (
          <DashboardPage
            onNavigateToGenerator={() => setActiveTab('generate')}
            testCases={testCases}
            history={history}
            user={user}
            guestGenerationsCount={guestGenerationsCount}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onOpenAccount={() => setIsAccountModalOpen(true)}
          />
        ) : activeTab === 'history' ? (
          <HistoryPage
            history={history}
            onViewSuite={handleViewHistoricalSuite}
            onDeleteSuite={handleDeleteHistoricalSuite}
            onNavigateToGenerator={() => setActiveTab('generate')}
          />
        ) : activeTab === 'admin' ? (
          /* ======================================================== */
          /* RBAC ROUTE PROTECTION: RESTRICTED ADMIN DASHBOARD GATE    */
          /* ======================================================== */
          !user ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-xl max-w-xl mx-auto my-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Administrator Access Restricted
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                The Super Admin Portal is strictly protected by Role-Based Access Control (RBAC). 
                Please authenticate using administrator credentials (email/password or Google Sign-In) to proceed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all"
                >
                  Sign In with Administrator Account
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Return to User Dashboard
                </button>
              </div>
            </div>
          ) : !isAdmin ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-rose-200 dark:border-rose-900/60 shadow-xl max-w-xl mx-auto my-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Access Denied (403 Forbidden)
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Logged in as <strong>{user.name}</strong> ({user.email}).
              </p>
              <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                Your account is assigned the <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{user.role || 'User'}</strong> role. Administrator privileges are required to view multi-tenant governance and server telemetry.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSwitchToAdminRole()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Switch to Admin Account (Demo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Back to User Dashboard
                </button>
              </div>
            </div>
          ) : (
            <AdminPortalPage
              currentUser={user}
              onSwitchToAdminRole={handleSwitchToAdminRole}
              onNavigateToGenerator={() => setActiveTab('generate')}
            />
          )
        ) : (
          <div>
            <GeneratorPage
              inputType={inputType}
              setInputType={setInputType}
              featureDescription={featureDescription}
              setFeatureDescription={setFeatureDescription}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              errorState={errorState}
              onRetry={handleGenerate}
              user={user}
              guestGenerationsCount={guestGenerationsCount}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenPricing={() => setIsPricingModalOpen(true)}
            />

            <section className="mt-8">
              <ExportToolbar
                allTestCases={testCases}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAllRows}
              />

              <TestCaseTable
                testCases={testCases}
                onDeleteRow={handleDeleteRow}
                onAddTestCase={handleAddTestCase}
                onUpdateTestCase={handleUpdateTestCase}
                onUpdateStatus={handleUpdateStatus}
                selectedIds={selectedIds}
                onToggleSelectRow={handleToggleSelectRow}
                onSelectAllRows={handleSelectAllRows}
                onRegenerate={handleGenerate}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal with Database Integration & RBAC */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Pricing Modal with Dynamic DB Plans & In-App Details View */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        onResetCredits={handleResetCredits}
        currentPlan={user?.plan || 'Free Tier'}
        usageCount={user?.generationsUsed || 10}
        user={user}
      />

      {/* Account Settings Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
        onUpgradeClick={() => setIsPricingModalOpen(true)}
        onResetCredits={handleResetCredits}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchToAdminRole}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
