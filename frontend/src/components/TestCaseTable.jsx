import React, { useState } from 'react';
import { 
  Search, Filter, Trash2, ChevronDown, ChevronUp, Tag, CheckCircle, 
  AlertCircle, RefreshCw, PlusCircle, Edit3, CheckCircle2, XCircle, Clock, Ban, X
} from 'lucide-react';

/**
 * TestCaseTable Component
 * Advanced data table featuring:
 * - Search keyword filtering across all columns
 * - Priority & Type dropdown filters
 * - Test execution status tracking (Passed, Failed, Blocked, Pending) with live pass-rate bar
 * - Full CRUD: Add custom test cases, Edit inline modal, Delete row
 * - Row selection checkboxes & bulk selection
 * - Expandable steps for complex procedures
 */
export default function TestCaseTable({
  testCases = [],
  onDeleteRow,
  onAddTestCase,
  onUpdateTestCase,
  onUpdateStatus,
  selectedIds = [],
  onToggleSelectRow,
  onSelectAllRows,
  onRegenerate
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedRowIds, setExpandedRowIds] = useState({});

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    scenario: '',
    steps: '',
    testData: '',
    expectedResult: '',
    priority: 'High',
    type: 'Positive',
    status: 'Pending'
  });

  // Toggle expandable steps per row
  const toggleExpandSteps = (id) => {
    setExpandedRowIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open Modal for adding a new test case
  const handleOpenAddModal = () => {
    setEditingCase(null);
    const newId = `TC-${Date.now().toString().slice(-4)}`;
    setFormData({
      id: newId,
      scenario: '',
      steps: '1. Navigate to target screen\n2. Enter valid test parameters\n3. Click execute\n4. Verify expected outcome',
      testData: 'Sample inputs',
      expectedResult: 'System verifies action and updates state successfully.',
      priority: 'High',
      type: 'Positive',
      status: 'Pending'
    });
    setIsModalOpen(true);
  };

  // Open Modal for editing an existing test case
  const handleOpenEditModal = (tc) => {
    setEditingCase(tc);
    const stepsStr = Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.steps || '';
    setFormData({
      id: tc.id,
      scenario: tc.scenario,
      steps: stepsStr,
      testData: tc.testData || '',
      expectedResult: tc.expectedResult || '',
      priority: tc.priority || 'High',
      type: tc.type || 'Positive',
      status: tc.status || 'Pending'
    });
    setIsModalOpen(true);
  };

  // Handle Save in Modal
  const handleSaveModal = (e) => {
    e.preventDefault();
    const formattedSteps = formData.steps
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedCase = {
      ...formData,
      steps: formattedSteps
    };

    if (editingCase) {
      if (onUpdateTestCase) onUpdateTestCase(updatedCase);
    } else {
      if (onAddTestCase) onAddTestCase(updatedCase);
    }
    setIsModalOpen(false);
  };

  // Cycle Execution Status on click
  const handleCycleStatus = (tc) => {
    const currentStatus = tc.status || 'Pending';
    const nextStatusMap = {
      'Pending': 'Passed',
      'Passed': 'Failed',
      'Failed': 'Blocked',
      'Blocked': 'Pending'
    };
    const nextStatus = nextStatusMap[currentStatus] || 'Passed';
    if (onUpdateStatus) {
      onUpdateStatus(tc.id, nextStatus);
    }
  };

  // Metrics computation
  const totalCount = testCases.length;
  const passedCount = testCases.filter(tc => tc.status === 'Passed').length;
  const failedCount = testCases.filter(tc => tc.status === 'Failed').length;
  const blockedCount = testCases.filter(tc => tc.status === 'Blocked').length;
  const pendingCount = testCases.filter(tc => !tc.status || tc.status === 'Pending').length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  // Filter test cases
  const filteredTestCases = testCases.filter(tc => {
    if (priorityFilter !== 'All' && tc.priority?.toLowerCase() !== priorityFilter.toLowerCase()) {
      return false;
    }
    if (typeFilter !== 'All' && tc.type?.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== 'All') {
      const currentStatus = tc.status || 'Pending';
      if (currentStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const stepsStr = Array.isArray(tc.steps) ? tc.steps.join(' ') : tc.steps || '';
      const match =
        tc.id?.toLowerCase().includes(term) ||
        tc.scenario?.toLowerCase().includes(term) ||
        stepsStr.toLowerCase().includes(term) ||
        tc.testData?.toLowerCase().includes(term) ||
        tc.expectedResult?.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  const isAllSelected =
    filteredTestCases.length > 0 &&
    filteredTestCases.every(tc => selectedIds.includes(tc.id));

  // Priority Badge Helper
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Low
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {priority || 'N/A'}
          </span>
        );
    }
  };

  // Test Case Type Badge Helper
  const getTypeTag = (type) => {
    switch (type?.toLowerCase()) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <CheckCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Positive
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <AlertCircle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Negative
          </span>
        );
      case 'boundary':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Tag className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            Boundary
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {type || 'Standard'}
          </span>
        );
    }
  };

  // Status Badge Helper
  const getStatusBadge = (tc) => {
    const status = tc.status || 'Pending';
    switch (status) {
      case 'Passed':
        return (
          <button
            type="button"
            onClick={() => handleCycleStatus(tc)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:scale-105 transition-all shadow-xs"
            title="Click to cycle status"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Passed
          </button>
        );
      case 'Failed':
        return (
          <button
            type="button"
            onClick={() => handleCycleStatus(tc)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 hover:scale-105 transition-all shadow-xs"
            title="Click to cycle status"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Failed
          </button>
        );
      case 'Blocked':
        return (
          <button
            type="button"
            onClick={() => handleCycleStatus(tc)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:scale-105 transition-all shadow-xs"
            title="Click to cycle status"
          >
            <Ban className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Blocked
          </button>
        );
      default:
        return (
          <button
            type="button"
            onClick={() => handleCycleStatus(tc)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:scale-105 transition-all shadow-xs"
            title="Click to cycle status"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Pending
          </button>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
      
      {/* Live Test Execution Tracker Header Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-slate-50 dark:from-slate-800 dark:via-slate-800 dark:to-indigo-950/30 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Execution Progress:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800 dark:text-white">{passRate}% Pass Rate</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">({passedCount}/{totalCount} Passed)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> {passedCount} Passed
            </span>
            <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400">
              <XCircle className="w-3.5 h-3.5" /> {failedCount} Failed
            </span>
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
              <Ban className="w-3.5 h-3.5" /> {blockedCount} Blocked
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {pendingCount} Pending
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3 flex">
          <div style={{ width: `${totalCount ? (passedCount / totalCount) * 100 : 0}%` }} className="bg-emerald-500 transition-all duration-300"></div>
          <div style={{ width: `${totalCount ? (failedCount / totalCount) * 100 : 0}%` }} className="bg-rose-500 transition-all duration-300"></div>
          <div style={{ width: `${totalCount ? (blockedCount / totalCount) * 100 : 0}%` }} className="bg-amber-500 transition-all duration-300"></div>
        </div>
      </div>

      {/* Table Filter & Search Header Controls */}
      <div className="p-4 bg-slate-50/80 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test cases by scenario, steps, data, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Priority, Type, Status Dropdowns + Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Boundary">Boundary</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Blocked">Blocked</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Add Test Case Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Case
          </button>

          {/* Regenerate Button */}
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
              title="Re-run API test case generation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              {/* Select All Checkbox */}
              <th scope="col" className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAllRows(e.target.checked, filteredTestCases.map(tc => tc.id))}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap w-24">ID</th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px]">Scenario</th>
              <th scope="col" className="py-3.5 px-4 min-w-[240px]">Steps</th>
              <th scope="col" className="py-3.5 px-4 min-w-[170px]">Test Data</th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px]">Expected Result</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap text-center">Priority</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap text-center">Type</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal">
            {filteredTestCases.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  No matching test cases found for your search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredTestCases.map((tc) => {
                const isSelected = selectedIds.includes(tc.id);
                const isExpanded = !!expandedRowIds[tc.id];
                const stepsArray = Array.isArray(tc.steps) ? tc.steps : [tc.steps];

                return (
                  <tr
                    key={tc.id}
                    className={`transition-colors duration-150 group ${
                      isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/40' : 'hover:bg-slate-50/80 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td className="py-4 px-4 text-center align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(tc.id)}
                        className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* ID */}
                    <td className="py-4 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap align-top">
                      {tc.id}
                    </td>

                    {/* Scenario */}
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white align-top">
                      {tc.scenario}
                    </td>

                    {/* Steps (Expandable/Collapsible) */}
                    <td className="py-4 px-4 align-top">
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                        {(isExpanded ? stepsArray : stepsArray.slice(0, 2)).map((step, sIdx) => (
                          <li key={sIdx} className="leading-snug">
                            {step}
                          </li>
                        ))}
                      </ul>
                      
                      {stepsArray.length > 2 && (
                        <button
                          type="button"
                          onClick={() => toggleExpandSteps(tc.id)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
                        >
                          {isExpanded ? (
                            <>Show Less <ChevronUp className="w-3 h-3" /></>
                          ) : (
                            <>+{stepsArray.length - 2} More Steps <ChevronDown className="w-3 h-3" /></>
                          )}
                        </button>
                      )}
                    </td>

                    {/* Test Data */}
                    <td className="py-4 px-4 align-top font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-750/70 rounded p-2 border border-slate-100 dark:border-slate-700">
                      {tc.testData}
                    </td>

                    {/* Expected Result */}
                    <td className="py-4 px-4 align-top text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                      {tc.expectedResult}
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      {getPriorityBadge(tc.priority)}
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      {getTypeTag(tc.type)}
                    </td>

                    {/* Status Tracker */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      {getStatusBadge(tc)}
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(tc)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit test case"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRow(tc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete test case"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-slate-50 dark:bg-slate-750 border-t border-slate-200/80 dark:border-slate-700 px-6 py-3 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>
          Showing <strong>{filteredTestCases.length}</strong> of <strong>{testCases.length}</strong> test cases
          {selectedIds.length > 0 && <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold">({selectedIds.length} selected)</span>}
        </span>
        <span className="font-mono text-slate-400 text-[11px]">Click status badge to toggle (Passed ➔ Failed ➔ Blocked ➔ Pending)</span>
      </div>

      {/* Add / Edit Test Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                {editingCase ? `Edit Test Case (${formData.id})` : 'Add New Custom Test Case'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scenario Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  placeholder="e.g. Verify student QR scanner on bus"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Execution Steps (one per line) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Test Data
                  </label>
                  <input
                    type="text"
                    value={formData.testData}
                    onChange={(e) => setFormData({ ...formData, testData: e.target.value })}
                    placeholder="e.g. User ID: 24SOEIT13019"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Result *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.expectedResult}
                    onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                    placeholder="e.g. Attendance is marked Present"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                    <option value="Boundary">Boundary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors"
                >
                  {editingCase ? 'Save Changes' : 'Add Test Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
