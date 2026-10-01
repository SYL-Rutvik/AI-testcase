import React, { useState } from 'react';
import { 
  BookOpen, Download, Printer, CheckCircle2, ChevronRight, Award, 
  User, Calendar, FileText, Layers, Shield, Cpu, Code2, Database, ExternalLink 
} from 'lucide-react';

/**
 * ProjectReportPage Component
 * Full academic project report viewer formatted according to RK University B.Tech guidelines.
 * Displays Chapters 1 through 10 with interactive chapter navigation, print view, and markdown export.
 */
export default function ProjectReportPage() {
  const [activeSection, setActiveSection] = useState('cover');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    // Read the project_report.md or trigger download of text content
    const link = document.createElement('a');
    link.href = '/project_report.md';
    link.download = 'AI_Powered_Test_Case_Generator_Project_Report.md';
    link.click();
  };

  return (
    <div className="space-y-8 animate-fade-in print:space-y-4 print:p-0">
      
      {/* Top Banner & Actions */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Academic Project Report Documentation
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            RK University • School of Engineering • B.Tech. (Information Technology) • CE738
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-600 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>

          <a
            href="/AI_Powered_Test_Case_Generator_Project-Report.docx"
            download="AI_Powered_Test_Case_Generator_Project-Report.docx"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download Report (.docx)
          </a>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 print:hidden">
          <div className="sticky top-24 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-2">
              Report Table of Contents
            </p>
            
            {[
              { id: 'cover', title: 'Title & Declaration' },
              { id: 'abstract', title: 'Abstract & Abbreviations' },
              { id: 'ch1', title: 'Chapter 1: Introduction' },
              { id: 'ch2', title: 'Chapter 2: Project Management' },
              { id: 'ch3', title: 'Chapter 3: Requirements Study' },
              { id: 'ch4', title: 'Chapter 4: Analysis & Design' },
              { id: 'ch5', title: 'Chapter 5: System Design' },
              { id: 'ch6', title: 'Chapter 6: Implementation Planning' },
              { id: 'ch7', title: 'Chapter 7: Testing & Test Cases' },
              { id: 'ch8', title: 'Chapter 8: Screenshots & Manual' },
              { id: 'ch9', title: 'Chapter 9: Limitations & Future' },
              { id: 'ch10', title: 'Chapter 10: Conclusion & References' },
            ].map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <span>{item.title}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </a>
            ))}
          </div>
        </aside>

        {/* Report Content Body */}
        <article className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-12 text-slate-800 dark:text-slate-100 print:shadow-none print:border-none print:p-0">
          
          {/* Cover & Declaration Section */}
          <section id="cover" className="border-b border-slate-200 dark:border-slate-700 pb-10 text-center space-y-6">
            <div className="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 mb-2">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 tracking-wider uppercase text-sm">
                RK UNIVERSITY • SCHOOL OF ENGINEERING
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              AI-POWERED TEST CASE GENERATOR
            </h1>

            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-lg mx-auto uppercase tracking-wide">
              A Project Report Submitted In Partial Fulfillment of the Requirement for the Award of the Degree of
            </p>

            <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              B.TECH. (INFORMATION TECHNOLOGY)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 max-w-lg mx-auto text-left text-xs bg-slate-50 dark:bg-slate-750 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 uppercase font-semibold">Submitted By:</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">Rutvik Shiyal</p>
                <p className="font-mono text-slate-500">24SOEIT13019</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold">Under the Guidance Of:</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">Prof. Jay Pithadiya</p>
                <p className="text-slate-500">Assistant Professor, RK University</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 pt-2 font-mono">
              Academic Year: 2026 • Subject Code: Project (CE738)
            </p>
          </section>

          {/* Abstract Section */}
          <section id="abstract" className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              ABSTRACT
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Software Quality Assurance (QA) and test case design represent critical yet labor-intensive stages in the Software Development Life Cycle (SDLC). Traditional manual test writing suffers from high human oversight, inconsistent test coverage, slow authoring rates, and missed boundary/edge cases.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              To overcome these operational bottlenecks, this project presents the <strong>AI-Powered Test Case Generator</strong>, an intelligent web SaaS application engineered to automatically convert raw software specifications (User Stories, Feature Descriptions, and API Endpoint Specs) into comprehensive QA test suites.
            </p>
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2">
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase">Key Architectural Pillars:</p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li><strong>Multi-Format Requirement Engine</strong>: Contextual prompt parsing for User Stories, Feature Specs, and REST API definitions.</li>
                <li><strong>Dynamic QA NLP & LLM Orchestrator</strong>: Dual-engine architecture combining Google Gemini AI with resilient local contextual rule-based scenario generation.</li>
                <li><strong>Interactive Test Execution Tracker</strong>: Real-time status toggling (Passed, Failed, Blocked, Pending) with live pass-rate analytics.</li>
                <li><strong>Multi-Format Export Subsystem</strong>: Native generation of Microsoft Excel (.xlsx), CSV, PDF reports, and clipboard copies.</li>
                <li><strong>Full CRUD Test Management</strong>: Adding custom scenarios, inline editing, and deletion.</li>
              </ul>
            </div>
          </section>

          {/* Chapter 5: System Design */}
          <section id="ch5" className="space-y-6 border-b border-slate-200 dark:border-slate-700 pb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              CHAPTER 5: SYSTEM DESIGN
            </h2>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">5.1 Database Design & Data Structures</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The AI-Powered Test Case Generator utilizes structured JSON documents persisted across client-side LocalStorage and Express memory caches. Every generated suite encapsulates test cases, input parameters, execution metadata, and timestamps.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-750 p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-2">
                <p className="font-bold text-indigo-600 dark:text-indigo-400">// Primary Data Entities</p>
                <p><strong>TestSuite</strong>: id, title, inputType, timestamp, isLiveAI, testCases[]</p>
                <p><strong>TestCase</strong>: id, scenario, steps[], testData, expectedResult, priority, type, status</p>
                <p><strong>ServerMetrics</strong>: totalRequests, liveAiRequests, nlpEngineRequests, totalTestCasesCreated</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">5.2 System Procedural Design & Flowchart</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The procedural sequence executes as follows: User specifies requirement format ➔ Character validation (≤ 1000 chars) ➔ Asynchronous HTTP POST to Express API ➔ Gemini AI / NLP Fallback Processing ➔ Normalized JSON schema output ➔ React state update ➔ Interactive table rendering ➔ Test Execution / Export.
              </p>
              
              <div className="p-4 bg-slate-900 text-indigo-300 rounded-xl font-mono text-xs overflow-x-auto">
                <pre>{`User Interface (React + Vite)
      │
      ▼ (HTTP POST /api/generate-test-cases)
Express.js Routing Layer (testCaseRoutes)
      │
      ▼
Controller Layer (testCaseController)
      ├── If GEMINI_API_KEY valid ──► Google Gemini API (gemini-1.5-flash)
      └── Else / On Network Fallback ──► Contextual NLP QA Engine
      │
      ▼
Normalized JSON Output Array
      │
      ▼
React Virtual DOM ➔ Interactive Table with Execution Tracker (Pass/Fail)
      │
      ▼
Export Subsystem ➔ Excel (.xlsx) / CSV / PDF Document / Clipboard`}</pre>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">5.3 Access Control & Security</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Security mechanisms include CORS origin validation, server environment isolation for API credentials (GEMINI_API_KEY never exposed to browser bundle), input payload length constraints, and XSS sanitization during table rendering.
              </p>
            </div>
          </section>

          {/* Chapter 6: Implementation Planning */}
          <section id="ch6" className="space-y-6 border-b border-slate-200 dark:border-slate-700 pb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              CHAPTER 6: IMPLEMENTATION PLANNING & DETAILS
            </h2>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">6.1 Implementation Environment</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200 dark:border-slate-600">Component</th>
                      <th className="p-2.5 border-b border-slate-200 dark:border-slate-600">Technology Selected</th>
                      <th className="p-2.5 border-b border-slate-200 dark:border-slate-600">Purpose / Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="p-2.5 font-semibold">Frontend Framework</td>
                      <td className="p-2.5 font-mono text-indigo-600 dark:text-indigo-400">React 18 + Vite</td>
                      <td className="p-2.5">Component lifecycle & high-performance Virtual DOM rendering</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Styling Engine</td>
                      <td className="p-2.5 font-mono text-indigo-600 dark:text-indigo-400">Tailwind CSS v3</td>
                      <td className="p-2.5">Utility-first responsive layout & dark mode theme tokens</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Backend Framework</td>
                      <td className="p-2.5 font-mono text-indigo-600 dark:text-indigo-400">Node.js + Express</td>
                      <td className="p-2.5">RESTful API endpoint routing & asynchronous handling</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">AI SDK</td>
                      <td className="p-2.5 font-mono text-indigo-600 dark:text-indigo-400">@google/generative-ai</td>
                      <td className="p-2.5">Google Gemini LLM inference for test scenario derivation</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Spreadsheet & PDF Engines</td>
                      <td className="p-2.5 font-mono text-indigo-600 dark:text-indigo-400">xlsx (SheetJS) & jsPDF</td>
                      <td className="p-2.5">Native binary Excel workbook and formatted PDF generation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">6.2 Module Specifications</h3>
              <ul className="text-xs sm:text-sm space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li><strong>Input & Validation Module</strong>: Validates requirement length against 1000-character ceiling and provides 1-click preset templates.</li>
                <li><strong>AI Generation Engine</strong>: Manages prompt contracts for Positive, Negative, and Boundary categorization.</li>
                <li><strong>Test Execution Tracker Module</strong>: Enables QA testers to toggle execution status (Passed, Failed, Blocked, Pending) with real-time pass-rate calculation.</li>
                <li><strong>Full CRUD Manager</strong>: Enables adding manual test cases and inline editing.</li>
                <li><strong>Export Engine</strong>: Multi-channel file export (.xlsx, .csv, .pdf, clipboard).</li>
              </ul>
            </div>
          </section>

          {/* Chapter 7: Testing */}
          <section id="ch7" className="space-y-6 border-b border-slate-200 dark:border-slate-700 pb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              CHAPTER 7: TESTING & VERIFICATION
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The project underwent comprehensive unit, integration, and system verification across all modules. Below is the executed test cases matrix:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-600">Test ID</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-600">Test Case Description</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-600">Input / Condition</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-600">Expected Result</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-600 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-01</td>
                    <td className="p-2.5 font-semibold">Generate User Story Suite</td>
                    <td className="p-2.5">Valid User Story text submitted</td>
                    <td className="p-2.5">Generates Positive, Negative, Boundary scenarios</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-02</td>
                    <td className="p-2.5 font-semibold">Generate API Endpoint Suite</td>
                    <td className="p-2.5">POST /api/v1/auth specification</td>
                    <td className="p-2.5">Generates HTTP 200, 400, 401 scenarios</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-03</td>
                    <td className="p-2.5 font-semibold">Character Limit Enforcement</td>
                    <td className="p-2.5">Text length &gt; 1000 characters</td>
                    <td className="p-2.5">Disables submit & shows warning</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-04</td>
                    <td className="p-2.5 font-semibold">Add Custom Test Case</td>
                    <td className="p-2.5">Fill modal with manual scenario</td>
                    <td className="p-2.5">Appends case to table & updates metrics</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-05</td>
                    <td className="p-2.5 font-semibold">Inline Test Case Editing</td>
                    <td className="p-2.5">Modify scenario & expected result</td>
                    <td className="p-2.5">Updated data reflected immediately</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-06</td>
                    <td className="p-2.5 font-semibold">Test Execution Status Toggle</td>
                    <td className="p-2.5">Click status badge (Pending ➔ Passed)</td>
                    <td className="p-2.5">Pass rate progress bar updates in real time</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-07</td>
                    <td className="p-2.5 font-semibold">Keyword Search Filtering</td>
                    <td className="p-2.5">Enter "token" or "boundary"</td>
                    <td className="p-2.5">Table isolates matching rows</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-08</td>
                    <td className="p-2.5 font-semibold">Excel (.xlsx) Export</td>
                    <td className="p-2.5">Click "Excel (.xlsx)" button</td>
                    <td className="p-2.5">Downloads formatted workbook with status</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-09</td>
                    <td className="p-2.5 font-semibold">PDF Document Export</td>
                    <td className="p-2.5">Click "PDF Report" button</td>
                    <td className="p-2.5">Downloads formatted tabular landscape PDF</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-indigo-600">TC-10</td>
                    <td className="p-2.5 font-semibold">Dark Mode Theme Toggle</td>
                    <td className="p-2.5">Click Moon/Sun icon in Navbar</td>
                    <td className="p-2.5">Toggles 'dark' CSS class across entire DOM</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">Passed ✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Chapter 8: User Manual */}
          <section id="ch8" className="space-y-6 border-b border-slate-200 dark:border-slate-700 pb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              CHAPTER 8: SCREEN SHOTS AND USER MANUAL
            </h2>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">8.1 Step-by-Step User Operation Manual</h3>
              <ol className="text-xs sm:text-sm space-y-3 text-slate-600 dark:text-slate-300 list-decimal list-inside">
                <li><strong>Access Web Application</strong>: Navigate to <code>http://localhost:5173</code> in Google Chrome or modern web browser.</li>
                <li><strong>Explore Dashboard Overview</strong>: Inspect real-time project statistics including Total Test Suites, Total Test Cases, and recent activity.</li>
                <li><strong>Generate New Test Suite</strong>:
                  <ul className="pl-6 pt-1 space-y-1 list-disc list-inside">
                    <li>Click <em>"Launch Test Generator"</em> or select the <em>"Generate"</em> tab.</li>
                    <li>Select an input specification format (<em>User Story</em>, <em>Feature Description</em>, or <em>API Endpoint Spec</em>) or click any <em>Quick Preset Template</em>.</li>
                    <li>Type or paste your requirement text (monitor the real-time character counter).</li>
                    <li>Click <strong>"Generate Test Cases"</strong>.</li>
                  </ul>
                </li>
                <li><strong>Track & Manage Test Cases</strong>:
                  <ul className="pl-6 pt-1 space-y-1 list-disc list-inside">
                    <li>Click the <em>Status badge</em> on any row to toggle its execution state (Passed, Failed, Blocked, Pending).</li>
                    <li>Click <em>"+ Add Case"</em> to append a manual test scenario.</li>
                    <li>Click the <em>Edit</em> icon to modify scenario descriptions, steps, or test data.</li>
                    <li>Click <em>"+ More Steps"</em> to view multi-step execution procedures.</li>
                  </ul>
                </li>
                <li><strong>Filter & Search</strong>: Use the search box and dropdown filters to isolate High-Priority or Boundary test cases.</li>
                <li><strong>Export Test Artifacts</strong>: Choose between <em>Excel (.xlsx)</em>, <em>CSV</em>, <em>PDF Report</em>, or <em>Copy to Clipboard</em>.</li>
                <li><strong>Review History Archive</strong>: Open the <em>"History"</em> tab to review, restore, or export previously created test suites.</li>
              </ol>
            </div>
          </section>

          {/* Chapter 9: Limitations & Future Enhancements */}
          <section id="ch9" className="space-y-6 border-b border-slate-200 dark:border-slate-700 pb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              CHAPTER 9: LIMITATIONS AND FUTURE ENHANCEMENTS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">Current Limitations</h4>
                <ul className="text-xs space-y-1.5 text-amber-800 dark:text-amber-400 list-disc list-inside">
                  <li>Initial internet connectivity required for remote LLM inference.</li>
                  <li>External LLM rate limits when using third-party APIs.</li>
                  <li>No direct bidirectional synchronization with Atlassian Jira or TestRail.</li>
                  <li>Textual requirement inputs only (no direct Figma image OCR parsing yet).</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-2">
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Future Enhancements</h4>
                <ul className="text-xs space-y-1.5 text-indigo-800 dark:text-indigo-300 list-disc list-inside">
                  <li>Direct Jira, GitHub Issues, and TestRail REST API webhook integration.</li>
                  <li>Automated Cypress, Playwright, and Selenium test script code synthesis.</li>
                  <li>Multimodal UI screenshot/wireframe parsing for visual regression testing.</li>
                  <li>Multi-tenant cloud database synchronization (Firebase Firestore).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Chapter 10: Conclusion & References */}
          <section id="ch10" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              CHAPTER 10: CONCLUSION & REFERENCES
            </h2>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">10.1 Conclusion</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The <strong>AI-Powered Test Case Generator</strong> provides a practical, full-stack digital solution for automating software Quality Assurance workflows. By combining modern React components, responsive Tailwind CSS styling, an Express.js backend service layer, Google Gemini AI, and an intelligent resilient NLP generation engine, the system eliminates manual spreadsheet authoring delays while ensuring complete positive, negative, and boundary coverage.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">10.2 References</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 font-mono">
                <p>1. React Documentation: <a href="https://react.dev" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">https://react.dev</a></p>
                <p>2. Express.js API Reference: <a href="https://expressjs.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">https://expressjs.com</a></p>
                <p>3. Google Gemini AI SDK: <a href="https://ai.google.dev/docs" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">https://ai.google.dev/docs</a></p>
                <p>4. SheetJS Spreadsheet Engine: <a href="https://sheetjs.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">https://sheetjs.com</a></p>
                <p>5. jsPDF Documentation: <a href="https://parall.ax/products/jspdf" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">https://parall.ax/products/jspdf</a></p>
                <p>6. Tailwind CSS Documentation: <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">https://tailwindcss.com</a></p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Report Prepared and Verified By:</p>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">Rutvik Shiyal (24SOEIT13019)</p>
                <p>School of Engineering, RK University, Rajkot</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Internal Guide:</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1">Prof. Jay Pithadiya</p>
                <p>Assistant Professor, CE/IT Dept.</p>
              </div>
            </div>
          </section>

        </article>
      </div>

    </div>
  );
}
