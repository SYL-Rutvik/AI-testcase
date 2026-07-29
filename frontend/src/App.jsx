import React, { useState } from 'react';
import Header from './components/Header';
import GeneratorPage from './components/GeneratorPage';
import ExportToolbar from './components/ExportToolbar';
import TestCaseTable from './components/TestCaseTable';
import { INITIAL_TEST_CASES, MOCK_USER_STORY } from './data/dummyData';
import { Server, Wifi, WifiOff } from 'lucide-react';

export default function App() {
  const [inputType, setInputType] = useState('User Story');
  const [featureDescription, setFeatureDescription] = useState(MOCK_USER_STORY);
  const [testCases, setTestCases] = useState(INITIAL_TEST_CASES);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [apiSource, setApiSource] = useState('Initial Mock Suite');

  // Trigger test case generation (fetches from Express API or falls back to mock)
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorState(null);

    try {
      // Send POST request to backend Express server on port 5000
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

      // Artificial slight delay for smooth loading animation transition
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (result.success && Array.isArray(result.data)) {
        setTestCases(result.data);
        setSelectedIds([]); // reset selection
        setApiSource(`Express API (${inputType})`);
      } else {
        throw new Error(result.message || 'Malformed API response');
      }
    } catch (err) {
      console.warn('Express backend offline or error encountered. Falling back to local dataset.', err);

      // Simulate network request delay for realistic UI presentation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTestCases(INITIAL_TEST_CASES);
      setSelectedIds([]);
      setApiSource('Frontend Mock Dataset (Express Server Offline)');
    } finally {
      setIsLoading(false);
    }
  };

  // Inline delete row handler
  const handleDeleteRow = (idToDelete) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== idToDelete));
    setSelectedIds((prev) => prev.filter((id) => id !== idToDelete));
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Banner Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Backend Connectivity Status Bar */}
        <div className="mb-6 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">Data Source:</span>
            <span className="font-mono text-indigo-700 font-medium">{apiSource}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            {apiSource.includes('Express API') ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-medium">Backend Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 font-medium">Fallback Local Mode</span>
              </>
            )}
          </div>
        </div>

        {/* Phase 1 Generator Section */}
        <GeneratorPage
          inputType={inputType}
          setInputType={setInputType}
          featureDescription={featureDescription}
          setFeatureDescription={setFeatureDescription}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          errorState={errorState}
          onRetry={handleGenerate}
        />

        {/* Results & Export Section */}
        <section className="mt-8">
          <ExportToolbar
            allTestCases={testCases}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAllRows}
          />

          <TestCaseTable
            testCases={testCases}
            onDeleteRow={handleDeleteRow}
            selectedIds={selectedIds}
            onToggleSelectRow={handleToggleSelectRow}
            onSelectAllRows={handleSelectAllRows}
            onRegenerate={handleGenerate}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <p>© AI-Powered Test Case Generator — College Viva & Project Defense (Phase 1 Complete)</p>
      </footer>
    </div>
  );
}
