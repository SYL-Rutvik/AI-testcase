import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileCode, Copy, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * ExportToolbar Component
 * Real export handlers for:
 * - PDF document (.pdf via jsPDF + autotable)
 * - Excel spreadsheet (.xlsx via SheetJS)
 * - Comma-Separated Values (.csv)
 * - Formatted plain text to Clipboard
 */
export default function ExportToolbar({
  allTestCases = [],
  selectedIds = [],
  onSelectAll,
  totalFilteredCount = 0
}) {
  const [exportScope, setExportScope] = useState('all'); // 'all' | 'selected'
  const [notification, setNotification] = useState('');

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
   * 1. Export to CSV
   */
  const handleExportCSV = () => {
    const dataToExport = getExportData();
    if (!dataToExport || dataToExport.length === 0) return;

    const headers = ['Test Case ID', 'Scenario', 'Steps', 'Test Data', 'Expected Result', 'Priority', 'Type', 'Status'];
    const rows = dataToExport.map(tc => [
      `"${tc.id || ''}"`,
      `"${(tc.scenario || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(tc.steps) ? tc.steps.join('; ') : tc.steps || '').replace(/"/g, '""')}"`,
      `"${(tc.testData || '').replace(/"/g, '""')}"`,
      `"${(tc.expectedResult || '').replace(/"/g, '""')}"`,
      `"${tc.priority || ''}"`,
      `"${tc.type || ''}"`,
      `"${tc.status || 'Pending'}"`
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

    showNotification(`Exported ${dataToExport.length} test cases to CSV!`);
  };

  /**
   * 2. Export to Excel (.xlsx)
   */
  const handleExportExcel = () => {
    const dataToExport = getExportData();
    if (!dataToExport || dataToExport.length === 0) return;

    const formattedRows = dataToExport.map(tc => ({
      'Test Case ID': tc.id || '',
      'Scenario': tc.scenario || '',
      'Steps': Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.steps || '',
      'Test Data': tc.testData || '',
      'Expected Result': tc.expectedResult || '',
      'Priority': tc.priority || '',
      'Type': tc.type || '',
      'Execution Status': tc.status || 'Pending'
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    worksheet['!cols'] = [
      { wch: 14 },
      { wch: 38 },
      { wch: 45 },
      { wch: 30 },
      { wch: 40 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'QA Test Cases');
    XLSX.writeFile(workbook, `test_cases_${exportScope}_${new Date().toISOString().slice(0, 10)}.xlsx`);

    showNotification(`Exported ${dataToExport.length} test cases to Excel (.xlsx)!`);
  };

  /**
   * 3. Export to PDF (jsPDF + autotable)
   */
  const handleExportPDF = () => {
    const dataToExport = getExportData();
    if (!dataToExport || dataToExport.length === 0) return;

    const doc = new jsPDF({ orientation: 'landscape' });

    // Document Header
    doc.setFontSize(15);
    doc.setTextColor(30, 58, 138); // Indigo/Blue
    doc.text('AI-Powered Test Case Generator — QA Test Execution Report', 14, 15);
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()} | Total Cases: ${dataToExport.length} | Project: B.Tech (IT) RK University`, 14, 21);

    // Table Data mapping
    const tableHeaders = [['ID', 'Scenario', 'Steps', 'Test Data', 'Expected Result', 'Priority', 'Type', 'Status']];
    const tableBody = dataToExport.map(tc => [
      tc.id || '',
      tc.scenario || '',
      Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.steps || '',
      tc.testData || '',
      tc.expectedResult || '',
      tc.priority || '',
      tc.type || '',
      tc.status || 'Pending'
    ]);

    doc.autoTable({
      startY: 26,
      head: tableHeaders,
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      styles: { fontSize: 7.5, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 42 },
        2: { cellWidth: 55 },
        3: { cellWidth: 32 },
        4: { cellWidth: 55 },
        5: { cellWidth: 16 },
        6: { cellWidth: 18 },
        7: { cellWidth: 18 }
      }
    });

    doc.save(`test_cases_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    showNotification(`Exported ${dataToExport.length} test cases to PDF!`);
  };

  /**
   * 4. Copy to Clipboard
   */
  const handleCopyToClipboard = async () => {
    const dataToExport = getExportData();
    if (!dataToExport || dataToExport.length === 0) return;

    const formattedText = dataToExport.map(tc => (
`----------------------------------------------------
[ID]: ${tc.id}
[Scenario]: ${tc.scenario}
[Priority]: ${tc.priority} | [Type]: ${tc.type} | [Status]: ${tc.status || 'Pending'}
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
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors">
      {/* Scope Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
          <span className="px-2 py-1 text-slate-500 dark:text-slate-400">Export Scope:</span>
          
          <button
            type="button"
            onClick={() => setExportScope('all')}
            className={`px-3 py-1 rounded-md transition-all text-xs font-medium ${
              exportScope === 'all'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({allTestCases.length})
          </button>

          <button
            type="button"
            onClick={() => setExportScope('selected')}
            className={`px-3 py-1 rounded-md transition-all text-xs font-medium ${
              exportScope === 'selected'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Selected ({selectedIds.length})
          </button>
        </div>

        {notification && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold animate-fade-in ${
            notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          }`}>
            <Check className="w-3.5 h-3.5" />
            {notification.text}
          </div>
        )}
      </div>

      {/* Export Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Copy to Clipboard */}
        <button
          type="button"
          onClick={handleCopyToClipboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-all active:scale-95"
          title="Copy plain text"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>

        {/* Export to CSV */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
          title="Export CSV"
        >
          <FileText className="w-3.5 h-3.5" />
          CSV
        </button>

        {/* Export to Excel */}
        <button
          type="button"
          onClick={handleExportExcel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
          title="Export Excel (.xlsx)"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Excel (.xlsx)
        </button>

        {/* Export to PDF */}
        <button
          type="button"
          onClick={handleExportPDF}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all active:scale-95"
          title="Export PDF Document"
        >
          <FileCode className="w-3.5 h-3.5" />
          PDF Report
        </button>
      </div>
    </div>
  );
}
