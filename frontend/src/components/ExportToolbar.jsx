import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Copy, Check, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';

/**
 * ExportToolbar Component
 * Handles real export functionality for CSV, Excel (.xlsx using SheetJS), and Clipboard copying.
 * Supports toggling export scope ("Export All Filtered" vs "Export Selected Rows").
 */
export default function ExportToolbar({
  allTestCases = [],
  selectedIds = [],
  onSelectAll,
  totalFilteredCount = 0
}) {
  const [exportScope, setExportScope] = useState('all'); // 'all' | 'selected'
  const [notification, setNotification] = useState('');

  // Determine which test cases to export based on scope selection
  const getExportData = () => {
    if (exportScope === 'selected') {
      if (selectedIds.length === 0) {
        showNotification('No rows selected! Select rows using checkboxes first.', 'error');
        return [];
      }
      return allTestCases.filter(tc => selectedIds.includes(tc.id));
    }
    return allTestCases;
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ text: msg, type });
    setTimeout(() => setNotification(''), 3500);
  };

  /**
   * 1. Export to CSV (Native Blob Download)
   */
  const handleExportCSV = () => {
    const dataToExport = getExportData();
    if (!dataToExport || dataToExport.length === 0) return;

    const headers = ['Test Case ID', 'Scenario', 'Steps', 'Test Data', 'Expected Result', 'Priority', 'Type'];
    const rows = dataToExport.map(tc => [
      `"${tc.id || ''}"`,
      `"${(tc.scenario || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(tc.steps) ? tc.steps.join('; ') : tc.steps || '').replace(/"/g, '""')}"`,
      `"${(tc.testData || '').replace(/"/g, '""')}"`,
      `"${(tc.expectedResult || '').replace(/"/g, '""')}"`,
      `"${tc.priority || ''}"`,
      `"${tc.type || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `test_cases_${exportScope}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(`Successfully exported ${dataToExport.length} test cases to CSV!`);
  };

  /**
   * 2. Export to Excel (.xlsx using SheetJS XLSX library)
   */
  const handleExportExcel = () => {
    const dataToExport = getExportData();
    if (!dataToExport || dataToExport.length === 0) return;

    // Format data into spreadsheet objects
    const formattedRows = dataToExport.map(tc => ({
      'Test Case ID': tc.id || '',
      'Scenario': tc.scenario || '',
      'Steps': Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.steps || '',
      'Test Data': tc.testData || '',
      'Expected Result': tc.expectedResult || '',
      'Priority': tc.priority || '',
      'Type': tc.type || ''
    }));

    // Create Worksheet & Workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    
    // Set column widths for clean presentation
    worksheet['!cols'] = [
      { wch: 14 }, // ID
      { wch: 40 }, // Scenario
      { wch: 45 }, // Steps
      { wch: 30 }, // Test Data
      { wch: 45 }, // Expected Result
      { wch: 12 }, // Priority
      { wch: 12 }  // Type
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Cases');

    // Trigger Excel file download
    XLSX.writeFile(workbook, `test_cases_${exportScope}_${new Date().toISOString().slice(0, 10)}.xlsx`);

    showNotification(`Successfully exported ${dataToExport.length} test cases to Excel (.xlsx)!`);
  };

  /**
   * 3. Copy to Clipboard as Plain Text
   */
  const handleCopyToClipboard = async () => {
    const dataToExport = getExportData();
    if (!dataToExport || dataToExport.length === 0) return;

    const formattedText = dataToExport.map(tc => (
`----------------------------------------------------
[ID]: ${tc.id}
[Scenario]: ${tc.scenario}
[Priority]: ${tc.priority} | [Type]: ${tc.type}
[Steps]:
${Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.steps}
[Test Data]: ${tc.testData}
[Expected Result]: ${tc.expectedResult}`
    )).join('\n\n');

    try {
      await navigator.clipboard.writeText(formattedText);
      showNotification(`Copied ${dataToExport.length} test cases to Clipboard!`);
    } catch (err) {
      showNotification('Failed to copy to clipboard.', 'error');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Scope Selector & Status Counter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="px-2 py-1 text-slate-500">Export Scope:</span>
          
          <button
            type="button"
            onClick={() => setExportScope('all')}
            className={`px-3 py-1 rounded-md transition-all text-xs font-medium ${
              exportScope === 'all'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Filtered ({allTestCases.length})
          </button>

          <button
            type="button"
            onClick={() => setExportScope('selected')}
            className={`px-3 py-1 rounded-md transition-all text-xs font-medium ${
              exportScope === 'selected'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selected Rows ({selectedIds.length})
          </button>
        </div>

        {notification && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold animate-fade-in ${
            notification.type === 'error'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <Check className="w-3.5 h-3.5" />
            {notification.text}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Copy to Clipboard */}
        <button
          type="button"
          onClick={handleCopyToClipboard}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all active:scale-95"
          title="Copy test case data to clipboard"
        >
          <Copy className="w-3.5 h-3.5 text-slate-500" />
          Copy Plain Text
        </button>

        {/* Export to CSV */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
          title="Download actual .csv file"
        >
          <FileText className="w-3.5 h-3.5 text-blue-100" />
          Export to CSV
        </button>

        {/* Export to Excel (.xlsx) */}
        <button
          type="button"
          onClick={handleExportExcel}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
          title="Download actual Microsoft Excel (.xlsx) spreadsheet using SheetJS"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-100" />
          Export to Excel (.xlsx)
        </button>
      </div>
    </div>
  );
}
