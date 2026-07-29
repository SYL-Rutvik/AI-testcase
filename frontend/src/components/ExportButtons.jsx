import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Check } from 'lucide-react';

/**
 * ExportButtons Component
 * Provides UI buttons for exporting generated test cases to Excel and CSV formats.
 */
export default function ExportButtons({ testCases = [] }) {
  const [copiedNotification, setCopiedNotification] = useState('');

  /**
   * Helper function to export test cases directly to CSV file
   */
  const handleExportCSV = () => {
    if (!testCases || testCases.length === 0) return;

    // Define CSV Headers
    const headers = ['Test Case ID', 'Scenario', 'Steps', 'Test Data', 'Expected Result', 'Priority', 'Type'];
    
    // Map rows
    const rows = testCases.map(tc => [
      `"${tc.id || ''}"`,
      `"${(tc.scenario || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(tc.steps) ? tc.steps.join('; ') : tc.steps || '').replace(/"/g, '""')}"`,
      `"${(tc.testData || '').replace(/"/g, '""')}"`,
      `"${(tc.expectedResult || '').replace(/"/g, '""')}"`,
      `"${tc.priority || ''}"`,
      `"${tc.type || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `test_cases_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification('CSV Downloaded!');
    setTimeout(() => setCopiedNotification(''), 3000);
  };

  /**
   * Helper function to simulate Excel Export
   */
  const handleExportExcel = () => {
    // Falls back to CSV standard format or triggers notification
    handleExportCSV();
    setCopiedNotification('Exported to Excel compatible format!');
    setTimeout(() => setCopiedNotification(''), 3000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-700">Generated Test Suite</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
          {testCases.length} Test Cases
        </span>
      </div>

      <div className="flex items-center gap-3">
        {copiedNotification && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            {copiedNotification}
          </span>
        )}

        {/* Export to Excel Button */}
        <button
          type="button"
          onClick={handleExportExcel}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
          title="Export test suite to Microsoft Excel"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
          Export to Excel
        </button>

        {/* Export to CSV Button */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
          title="Export test suite to CSV file"
        >
          <FileText className="w-4 h-4 text-blue-100" />
          Export to CSV
        </button>
      </div>
    </div>
  );
}
