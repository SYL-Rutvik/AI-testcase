import React, { useState } from 'react';
import { Search, Filter, Trash2, ChevronDown, ChevronUp, Tag, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * TestCaseTable Component
 * Advanced data table featuring search keyword filtering, Priority & Type dropdown filters,
 * row selection checkboxes, expandable steps, and inline row deletion.
 */
export default function TestCaseTable({
  testCases = [],
  onDeleteRow,
  selectedIds = [],
  onToggleSelectRow,
  onSelectAllRows,
  onRegenerate
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [expandedRowIds, setExpandedRowIds] = useState({});

  // Toggle expandable steps per row
  const toggleExpandSteps = (id) => {
    setExpandedRowIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter test cases according to search term, priority, and type selection
  const filteredTestCases = testCases.filter(tc => {
    // Priority filter match
    if (priorityFilter !== 'All' && tc.priority?.toLowerCase() !== priorityFilter.toLowerCase()) {
      return false;
    }
    // Type filter match
    if (typeFilter !== 'All' && tc.type?.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    // Search term match across ID, Scenario, Steps, Test Data, Expected Result
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

  // Priority Badge Color Formatting Helper
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Low
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {priority || 'N/A'}
          </span>
        );
    }
  };

  // Test Case Type Badge Color Formatting Helper
  const getTypeTag = (type) => {
    switch (type?.toLowerCase()) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            Positive
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <AlertCircle className="w-3 h-3 text-purple-600" />
            Negative
          </span>
        );
      case 'boundary':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            <Tag className="w-3 h-3 text-teal-600" />
            Boundary
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
            {type || 'Standard'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
      {/* Table Filter & Search Header Controls */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test cases by scenario, steps, data, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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

        {/* Priority & Type Filter Dropdowns + Regenerate Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Boundary">Boundary</option>
            </select>
          </div>

          {/* Regenerate Button */}
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition-colors"
              title="Re-run API test case generation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              {/* Select All Checkbox */}
              <th scope="col" className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAllRows(e.target.checked, filteredTestCases.map(tc => tc.id))}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap w-24">ID</th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px]">Scenario</th>
              <th scope="col" className="py-3.5 px-4 min-w-[240px]">Steps</th>
              <th scope="col" className="py-3.5 px-4 min-w-[170px]">Test Data</th>
              <th scope="col" className="py-3.5 px-4 min-w-[220px]">Expected Result</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap text-center">Priority</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap text-center">Type</th>
              <th scope="col" className="py-3.5 px-4 whitespace-nowrap text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700 font-normal">
            {filteredTestCases.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
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
                      isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td className="py-4 px-4 text-center align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(tc.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* ID */}
                    <td className="py-4 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap align-top">
                      {tc.id}
                    </td>

                    {/* Scenario */}
                    <td className="py-4 px-4 font-semibold text-slate-900 align-top">
                      {tc.scenario}
                    </td>

                    {/* Steps (Expandable/Collapsible if more than 2 steps) */}
                    <td className="py-4 px-4 align-top">
                      <ul className="space-y-1 text-slate-600 text-xs">
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
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
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
                    <td className="py-4 px-4 align-top font-mono text-xs text-slate-600 bg-slate-50/70 rounded p-2 border border-slate-100">
                      {tc.testData}
                    </td>

                    {/* Expected Result */}
                    <td className="py-4 px-4 align-top text-slate-600 leading-relaxed text-xs">
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

                    {/* Action: Inline Delete */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onDeleteRow(tc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete test case"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>
          Showing <strong>{filteredTestCases.length}</strong> of <strong>{testCases.length}</strong> test cases
          {selectedIds.length > 0 && <span className="ml-2 text-indigo-600 font-semibold">({selectedIds.length} selected)</span>}
        </span>
        <span className="font-mono text-slate-400 text-[11px]">Phase 1 Core View</span>
      </div>
    </div>
  );
}
