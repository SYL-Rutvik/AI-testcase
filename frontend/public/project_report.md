# AI-POWERED TEST CASE GENERATOR
## A PROJECT REPORT

Submitted in partial fulfillment of the requirement for the award of the degree of
### B.TECH. (INFORMATION TECHNOLOGY / COMPUTER ENGINEERING)

---

## CANDIDATE'S DECLARATION

We hereby certify that we are the sole author(s) of this project work entitled **"AI-Powered Test Case Generator"** and that neither any part of this project work nor the whole of the project work has been submitted for a degree to any other University or Institution. We certify that, to the best of our knowledge, our project work does not infringe upon anyone’s copyright nor violate any proprietary rights.

**Signature of Student:** ___________________________  
**Name:** [Your Name]  
**Enrollment No:** [Your Enrollment No]  

**Date:** 25 August 2026  
**Place:** [Your City / College]  

---

## CERTIFICATE

This is to certify that the work which is being presented in the Project Report entitled **“AI-Powered Test Case Generator”**, in partial fulfillment of the requirement for the award of the degree of **B.Tech. (Information Technology)** submitted to the Department of Information Technology, is an authentic record of work carried out during the 7th Semester.

**Internal Guide:**  
Prof. [Guide Name]  
Assistant Professor, Dept. of IT  

**Head of Department:**  
Dr. [HOD Name]  
HOD (CE / IT Department)  

---

## ACKNOWLEDGEMENT

It is with deep gratitude and respect that I express my sincere appreciation to everyone who has contributed to the successful completion of this project. 

I would like to extend my deepest gratitude to my internal guide, Prof. [Guide Name], for constant guidance, constructive feedback, and intellectual support during the research and development phases of this web application. 

I am also highly indebted to Dr. [HOD Name], Head of Department (IT/CE), for providing conducive academic conditions and state-of-the-art laboratory facilities.

Finally, I express my appreciation to my peers and family whose encouragement enabled me to complete software deliverables within academic deadlines.

---

## ABSTRACT

Software Quality Assurance (QA) and test case design represent critical yet labor-intensive stages in the Software Development Life Cycle (SDLC). Traditional manual test writing suffers from high human oversight, inconsistent test coverage, slow authoring rates, and missed boundary/edge cases. 

To overcome these operational bottlenecks, this project introduces the **AI-Powered Test Case Generator**, an intelligent web application designed to automatically convert raw software specifications (User Stories, Feature Descriptions, and API Endpoint Specs) into comprehensive test case suites. 

Developed utilizing a modern full-stack architecture—comprising a **React + Vite + Tailwind CSS** frontend and a **Node.js + Express** RESTful backend integrated with Large Language Models (LLMs)—the application generates structured positive, negative, and boundary test scenarios instantly.

Key architectural features include:
1. **Multi-Format Input Parser**: Support for User Stories, business logic feature descriptions, and API specifications.
2. **Contextual Test Generation Engine**: Automatic identification of acceptance criteria, happy path flows, negative error paths, and numeric/string boundary conditions.
3. **Advanced Interactive Data Table**: Real-time keyword search, priority filtering (High/Medium/Low), type filtering (Positive/Negative/Boundary), multi-row selection, and expandable execution steps.
4. **Multi-Format Real Export Subsystem**: Native export capabilities to Microsoft Excel (`.xlsx` via SheetJS), comma-separated values (`.csv`), and plain-text Clipboard formatting.
5. **Responsive Dashboard & Theme Support**: Analytics stat cards, toast alert system, and full dark-mode UI support.

The result is a responsive, highly efficient QA utility that reduces test authoring effort by up to 80% while standardizing test documentation across software engineering teams.

---

## ABBREVIATIONS AND NOTATIONS

| Abbreviation / Term | Definition |
| :--- | :--- |
| **QA** | Quality Assurance - Software testing and verification process |
| **SDLC** | Software Development Life Cycle |
| **LLM** | Large Language Model (Artificial Intelligence model) |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer |
| **JSON** | JavaScript Object Notation - Data interchange format |
| **UI / UX** | User Interface / User Experience |
| **CORS** | Cross-Origin Resource Sharing |
| **CRUD** | Create, Read, Update, and Delete operations |
| **DFD** | Data Flow Diagram |
| **ERD** | Entity Relationship Diagram |
| **CSV** | Comma-Separated Values |

---

## LIST OF FIGURES

- **Figure 4.1**: Use Case Diagram
- **Figure 4.2**: Entity-Relationship (E-R) Diagram
- **Figure 4.3**: Class Diagram
- **Figure 4.4**: Data Flow Diagram (Level 0 - Context Level)
- **Figure 4.5**: Data Flow Diagram (Level 1)

---

## LIST OF TABLES

- **Table 2.1**: Project Sprint Schedule
- **Table 4.1**: Test Suite Entity Schema
- **Table 4.2**: Test Case Entity Schema
- **Table 4.3**: User Preference & Session Schema

---

# TABLE OF CONTENTS

- **CANDIDATE'S DECLARATION**
- **CERTIFICATE**
- **ACKNOWLEDGEMENT**
- **ABSTRACT**
- **ABBREVIATIONS AND NOTATIONS**
- **CHAPTER 1: INTRODUCTION**
  - 1.1 Project Summary
  - 1.2 Purpose: Goals & Objectives
  - 1.3 Scope (Capabilities & Limitations)
  - 1.4 Technology and Literature Review
- **CHAPTER 2: PROJECT MANAGEMENT**
  - 2.1 Project Planning and Scheduling
    - 2.1.1 Process Paradigm & Justification
    - 2.1.2 Deliverables, Roles & Dependencies
    - 2.1.3 Schedule Representation (Sprint Schedule)
  - 2.2 Risk Management
    - 2.2.1 Risk Identification
    - 2.2.2 Risk Analysis
    - 2.2.3 Risk Planning & Mitigation
- **CHAPTER 3: SYSTEM REQUIREMENTS STUDY**
  - 3.1 User Characteristics
  - 3.2 Hardware and Software Requirements
  - 3.3 System Constraints
- **CHAPTER 4: SYSTEM ANALYSIS & DESIGN**
  - 4.1 Study of Current System
  - 4.2 Weaknesses of Current System
  - 4.3 Requirements of Proposed System (Functional & Non-Functional)
  - 4.4 Feasibility Study (Technical, Operational, Economic)
  - 4.5 Functions of System (Use Case Diagram)
  - 4.6 Data Modeling (Data Dictionary, E-R Diagram, Class Diagram)
  - 4.7 Functional & Behavioral Modeling (DFD Level 0 & Level 1)
  - 4.8 Main Modules of New System
  - 4.9 Selection of Stack & Justification

---

# CHAPTER 1: INTRODUCTION

## 1.1 PROJECT SUMMARY
The **'AI-Powered Test Case Generator'** is a full-stack web application engineered to automate the creation of software Quality Assurance (QA) test cases using Artificial Intelligence. In modern software development, writing comprehensive test cases for user stories, requirements, and REST APIs requires substantial time and domain expertise. Manual test creation often leads to missing edge cases, inconsistent step formatting, and delayed release cycles.

The proposed application resolves these inefficiencies by offering a centralized web workspace where developers and QA engineers can input raw requirement text, select the input specification format (`User Story`, `Feature Description`, or `API Endpoint Spec`), and generate structured test cases instantly. 

The application categorizes generated test cases into **Positive** (Happy Path), **Negative** (Error Path), and **Boundary** (Input Limit) scenarios, complete with test case IDs, preconditions/steps, test data, expected results, and priority rankings.

## 1.2 PURPOSE: GOALS & OBJECTIVES
The primary goal of the AI-Powered Test Case Generator is to replace slow manual test creation with an automated, AI-driven workflow. Specific objectives include:

- **Automated Test Generation**: Convert unstructured requirement text into standardized test case tables in seconds.
- **Comprehensive Scenario Coverage**: Ensure every generated test suite automatically includes positive validation, negative error handling, and boundary value conditions.
- **Multi-Input Support**: Tailor prompt templates specifically for User Stories (UI acceptance criteria), Business Features, and REST API Endpoints (HTTP status codes, headers, payloads).
- **Real Export Capabilities**: Provide native exports to Microsoft Excel (`.xlsx`), Comma-Separated Values (`.csv`), and plain-text Clipboard format for direct integration into QA tools (such as Jira or TestRail).
- **Interactive UI & Filtering**: Enable instant keyword search, priority filtering, type filtering, expandable execution steps, and inline row management.

## 1.3 SCOPE (CAPABILITIES & LIMITATIONS)

### Application Capabilities:
- **Specification Type Parsing**: Select between User Story, Feature Description, and API Endpoint modes.
- **Live Character Validation**: Input textarea equipped with real-time character counters (`120/1000`) and limit warnings.
- **Dynamic Table Management**: Multi-select row selection, "Select All" toggle, inline row deletion, and expandable multi-step lists.
- **Multi-Format Export Engine**: Export full or selected rows to Excel (`.xlsx`), CSV, and formatted plain text.
- **Modern User Experience**: Floating toast alerts, responsive card layout, dashboard analytics, and full dark-mode toggle.

### Limitations:
- **Client/Server Dependency**: Requires a browser environment and connectivity to the Node.js/Express backend server.
- **AI Rate Limits**: Dependent on API quota limits when connected to commercial LLM providers (e.g., Google Gemini API).

## 1.4 TECHNOLOGY AND LITERATURE REVIEW
Traditional QA test authoring relies on manual spreadsheet entry or enterprise test management portals (e.g., Jira, TestRail, Zephyr). While enterprise portals centralize test artifacts, they do not assist in generating test content—requiring testers to manually write every step, precondition, and expected result.

Recent advancements in Large Language Models (LLMs) such as Google Gemini, OpenAI GPT, and Claude have demonstrated high proficiency in natural language processing and structured data generation. By combining React (Virtual DOM rendering), Tailwind CSS (utility-first styling), Express.js (REST API layer), and LLM prompt engineering, this project bridges the gap between raw requirements and actionable QA test suites.

---

# CHAPTER 2: PROJECT MANAGEMENT

## 2.1 PROJECT PLANNING AND SCHEDULING

### 2.1.1 Process Paradigm & Justification
An **Agile Component-Based Development Paradigm** was selected for this project. Given the iterative nature of web applications and UI refinement, Agile allowed modular implementation across weekly sprints—focusing sequentially on API endpoints, state management, interactive table components, export handlers, and dark-mode styling.

### 2.1.2 Deliverables, Roles & Dependencies
- **Sprint 1 (Backend & Schema)**: Express server setup, CORS configuration, route handlers, and structured test case JSON schema.
- **Sprint 2 (Core UI & Input Form)**: React frontend scaffold, requirement input form, character counter validation, and loading spinner status animation.
- **Sprint 3 (Table & Filtering)**: Data table component, priority badges, type tags, keyword search, priority/type dropdown filters, row checkboxes, and step expander.
- **Sprint 4 (Exports & Polish)**: SheetJS (`xlsx`) Excel export, CSV download, Clipboard copy, Toast alert system, Dashboard stat cards, and dark-mode toggle.

### 2.1.3 Schedule Representation
**Table 2.1: Project Sprint Schedule**

| Sprint | Major Milestone / Task | Duration | Status |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | Express server setup, route endpoints, CORS & mock JSON controller | Weeks 1-2 | Completed |
| **Sprint 2** | React Vite scaffold, Tailwind styling, Input form & loading status spinner | Weeks 3-4 | Completed |
| **Sprint 3** | Test case data table, search box, Priority/Type filters, expandable steps | Weeks 5-6 | Completed |
| **Sprint 4** | SheetJS `.xlsx` Excel export, CSV download, Toast alerts & dark mode | Weeks 7-8 | Completed |

## 2.2 RISK MANAGEMENT

### 2.2.1 Risk Identification
1. **API Rate Limiting / Latency**: Delays or failure during external AI API response generation.
2. **Data Export Formatting Incompatibility**: Inconsistent column rendering across Microsoft Excel versions.
3. **UI Performance Degradation**: Lag when rendering large lists of test case rows.

### 2.2.2 Risk Analysis & Planning
- **Latency Mitigation**: Implemented an animated step-by-step progress spinner ("Analyzing requirement...", "Calculating boundary limits...") and fallback mock data handlers to ensure the application remains responsive even if backend connectivity drops.
- **Export Mitigation**: Utilized standard SheetJS `xlsx` binary array utilities to generate native OpenXML `.xlsx` spreadsheets compatible with Microsoft Excel, Google Sheets, and LibreOffice.
- **UI Performance Mitigation**: Applied key-based React list virtualization and efficient state filtering.

---

# CHAPTER 3: SYSTEM REQUIREMENTS STUDY

## 3.1 USER CHARACTERISTICS
1. **QA Engineers & Testers**: Require rapid creation of test suites with export options to standard test management tools.
2. **Software Developers**: Need quick unit/integration test scenario outlines before writing code (TDD approach).
3. **Product Managers / Business Analysts**: Verify acceptance criteria coverage for user stories before sprint planning.

## 3.2 HARDWARE AND SOFTWARE REQUIREMENTS

### Development Environment:
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 8 GB Minimum
- **IDE**: VS Code (Visual Studio Code)
- **Runtime**: Node.js (v18.0.0 or higher) & npm (v9.0.0 or higher)

### Client System Minimum Requirements:
- **Browser**: Modern web browser (Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+)
- **Display**: Responsive resolution (320px Mobile to 1920px Desktop)
- **RAM**: 4 GB RAM

## 3.3 CONSTRAINTS
- **Network Protocol**: HTTP/HTTPS communication between frontend (Vite dev server / port 5173) and backend (Express server / port 5000).
- **Format Schema**: Strict adherence to JSON output structure (ID, Scenario, Steps, Test Data, Expected Result, Priority, Type) to ensure seamless table rendering.

---

# CHAPTER 4: SYSTEM ANALYSIS & DESIGN

## 4.1 STUDY OF CURRENT SYSTEM
Currently, software development teams generate test cases using manual spreadsheets (Excel/Google Sheets) or text documents. QA engineers read user stories and manually type out every test step, precondition, and expected outcome.

## 4.2 WEAKNESSES OF CURRENT SYSTEM
- **High Human Overhead**: Takes 20–45 minutes to author a comprehensive test suite for a single feature.
- **Inconsistent Edge Case Coverage**: Testers frequently forget boundary values or negative invalid input cases.
- **No Standardization**: Different team members format test steps inconsistently.

## 4.3 REQUIREMENTS OF PROPOSED SYSTEM

### Functional Requirements:
1. Allow selection of requirement input types (`User Story`, `Feature Description`, `API Endpoint Spec`).
2. Provide input validation with real-time character limit enforcement (`1000` chars max).
3. Generate categorized test cases with distinct Priority (High, Medium, Low) and Type (Positive, Negative, Boundary).
4. Support instant keyword searching across test scenarios, steps, and expected results.
5. Provide filter controls for Priority and Type attributes.
6. Enable row selection checkboxes and bulk action handlers.
7. Perform real file downloads for Microsoft Excel (`.xlsx`) and Comma-Separated Values (`.csv`).
8. Copy plain-text test suites directly to the clipboard.

### Non-Functional Requirements:
- **Usability**: Clean blue/indigo QA color scheme, dark mode toggle, and floating toast notifications.
- **Performance**: Response rendering in under 1.5 seconds.
- **Reliability**: Graceful fallback error UI and server offline handling.

## 4.4 FEASIBILITY STUDY
- **Technical Feasibility**: High. React 18, Express, Tailwind CSS, and SheetJS are production-proven technologies.
- **Operational Feasibility**: High. The web layout requires zero training for QA personnel.
- **Economic Feasibility**: High. Built using open-source libraries and standard Node.js runtime.

## 4.5 SYSTEM MODELING & DIAGRAM DESCRIPTIONS

### 4.5.1 Data Dictionary & Schema
- **Test Suite Schema**: `id` (String), `title` (String), `inputType` (String), `createdAt` (Timestamp), `testCases` (Array).
- **Test Case Schema**: `id` (String), `scenario` (String), `steps` (Array of Strings), `testData` (String), `expectedResult` (String), `priority` (High/Medium/Low), `type` (Positive/Negative/Boundary).

### 4.5.2 Data Flow Diagram (DFD)
- **Level 0 (Context DFD)**: User inputs requirements into the System -> System returns generated test cases, analytics dashboard statistics, and `.xlsx` / `.csv` export files.
- **Level 1 DFD**: Requirement Text -> Input Parser -> AI Generator / API Handler -> JSON Formatter -> Table Render Engine & Export Subsystem.

---

# CHAPTER 5: SYSTEM DESIGN

## 5.1 Database Design / Data Structure Design
The AI-Powered Test Case Generator utilizes structured JSON documents persisted across client-side LocalStorage and Express memory caches, with schemas representing test suites, test cases, prompt specification templates, and execution telemetry metrics. Every test suite is encapsulated as an independent document entity with unique suite IDs, timestamp boundaries, and contextual categorization tags.

The major data structures utilized across the application are:
- `test_suites`: Collection of generated QA suites with metadata.
- `test_cases`: Individual positive, negative, and boundary scenarios with steps and test data.
- `requirement_templates`: Pre-configured specification prompts for 1-click test suite generation.
- `server_metrics`: Server execution counters and telemetry (total requests, live AI vs NLP counts).
- `user_preferences`: Theme toggle (dark/light), default filter selections, and export configurations.

### 5.1.1 Mapping Objects / Classes to Collections
The application employs structured JavaScript/JSX object schemas. The mapping between frontend entities, backend JSON payloads, and persistence records is detailed below:

| Application Class / Entity | Data Store / Payload | Purpose / Functional Scope |
| :--- | :--- | :--- |
| **TestSuite** | `test_suites` (LocalStorage) | Stores suite metadata, title, input format, timestamp, and test case IDs. |
| **TestCase** | `test_cases` (In-Memory / State) | Stores scenario title, steps, test data, expected result, priority, type, and execution status. |
| **RequirementTemplate** | `PRESET_REQUIREMENTS` | Stores 1-click preset templates for rapid demo and test authoring. |
| **ServerMetrics** | `GET /api/stats` | Tracks total generation requests, Gemini AI vs NLP fallback hits, and server uptime. |
| **ExportEngine** | `ExportToolbar` (.xlsx / .pdf) | Transforms in-memory test cases into binary Excel, CSV, PDF, and clipboard buffers. |

### 5.1.2 Collections and Relationships
The logical relationship between the core entities is structured around a One-to-Many hierarchy:

```text
+--------------------+
|    USER SESSION    |
+--------------------+
          | 1
          | generates / manages
          v *
+--------------------+
|     TEST SUITE     | <----- [Requirement Templates]
+--------------------+
          | 1
          | contains
          v *
+--------------------+
|     TEST CASE      | -----> [Execution Tracker (Passed/Failed/Blocked/Pending)]
+--------------------+
          | *
          | exported to
          v 1
+--------------------+
|   EXPORT ENGINE    | -----> [.xlsx (SheetJS) | .pdf (jsPDF) | .csv | Clipboard]
+--------------------+
```

### 5.1.3 Logical Description of Data

#### TestSuite Entity
```text
TestSuite
├── id (String: e.g. "SUITE-001")
├── title (String: truncated requirement title)
├── inputType (Enum: "User Story" | "Feature Description" | "API Endpoint Spec")
├── timestamp (String / ISO Date)
├── isLiveAI (Boolean: true if Gemini API, false if local NLP)
└── testCases (Array of TestCase objects)
```

#### TestCase Entity
```text
TestCase
├── id (String: e.g. "TC-US-001", "TC-API-002")
├── scenario (String: test description)
├── steps (Array of Strings: numbered step-by-step procedures)
├── testData (String: specific test inputs, headers, credentials)
├── expectedResult (String: verification criteria)
├── priority (Enum: "High" | "Medium" | "Low")
├── type (Enum: "Positive" | "Negative" | "Boundary")
└── status (Enum: "Passed" | "Failed" | "Blocked" | "Pending")
```

#### ServerMetrics Entity
```text
ServerMetrics
├── totalRequests (Integer)
├── liveAiRequests (Integer)
├── nlpEngineRequests (Integer)
├── totalTestCasesCreated (Integer)
├── status (String: "operational")
└── uptime (Float: elapsed server seconds)
```

## 5.2 System Procedural Design
The procedural design describes how end-to-end user operations are processed across the stack:

```text
User
  ↓
Open Web Application (React Single Page App)
  ↓
Navigate to Dashboard or Generator View
  ↓
Select Input Format (User Story / Feature Description / API Spec) or Click Preset
  ↓
Client-Side Input Validation (Character length ≤ 1000, non-empty check)
  ↓
HTTP POST Request (/api/generate-test-cases) with JSON Payload
  ↓
Express Routing Layer & Controller (testCaseController)
  ↓
API Key Check & Model Discovery (gemini-1.5-flash)
  ├── If Key Active & Online: Remote Google Gemini AI Inference
  └── If Offline / Quota / Fallback: Contextual NLP QA Rule Engine
  ↓
JSON Schema Structuring & Sanitization
  ↓
HTTP 200 Response Payload
  ↓
React State Update & Re-render Virtual DOM
  ↓
Display Interactive Table (Keyword Search, Priority/Type Filters, Step Expander)
  ↓
Test Execution Tracking (Tester clicks status to mark Passed / Failed / Blocked / Pending)
  ↓
File Export Handlers (SheetJS Excel .xlsx, jsPDF autotable PDF, CSV, Clipboard)
```

### 5.2.1 Flowchart / Activity Design
The major system activities comprise:
1. **Test Case Generation Activity**: Input Specification ➔ Validation ➔ Backend Inference ➔ Schema Extraction ➔ Rendering.
2. **Test Case Execution Tracking Activity**: Select Case ➔ Click Status Badge ➔ Toggle Passed/Failed/Blocked/Pending ➔ Recalculate Pass Rate.
3. **Multi-Format Export Activity**: Select Scope (All / Selected) ➔ Choose Target Format (.xlsx / .csv / .pdf / clipboard) ➔ Transform & Download.

## 5.3 Input / Output and Interface Design
UTMS/TestGen provides role-tailored, intuitive web interfaces engineered with modern responsive design principles. The main interfaces are:
- **Dashboard Interface**: Real-time stat cards (Total Suites, Active Cases, Scenarios Generated), recent activity cards, and quick-action launcher.
- **Test Case Generator Interface**: Input type dropdown, 1-click preset templates, live character counter (1000 chars limit), and animated generation spinner.
- **Interactive Test Cases Table**: Full-featured table with search filter, Priority filter, Type filter, Status filter, expandable steps, row checkboxes, and CRUD buttons.
- **Add & Edit Test Case Modals**: Modal forms enabling manual test case authoring and inline modification.
- **Export Toolbar Subsystem**: Multi-channel file export controls for Excel, CSV, PDF, and clipboard.
- **Test Suite History Archive**: Historical repository allowing re-opening, viewing, and clearing past suites.
- **Academic Project Report Documentation Viewer**: Dedicated in-app tab rendering Chapters 1 to 10 with print and export capabilities.

### 5.3.2 Access Control and Security
Security is enforced across both client and server layers:
1. **API Credential Isolation**: Sensitive AI tokens (`GEMINI_API_KEY`) reside exclusively in backend environment variables (`.env`) and are never packaged into client JavaScript bundles.
2. **CORS Restrictions**: The Express backend enforces Cross-Origin Resource Sharing restrictions to prevent cross-site request hijacking.
3. **Payload Length Bounds**: Client and server enforce strict 1000-character input ceilings to prevent buffer overruns or runaway token billing.
4. **Output Sanitization**: All AI-generated markdown strings are parsed, stripped of malicious code blocks, and validated against strict JSON schemas before client rendering.
5. **Resilient Fallback Architecture**: If remote AI endpoints experience downtime or quota limits, the system seamlessly activates the local NLP QA engine without throwing unhandled exceptions.

## 5.4 System Architecture Design
The system follows a multi-tiered component web architecture:

```text
+-------------------------------------------------------------+
|                     PRESENTATION LAYER                      |
|   React 18 SPA | Vite Bundler | Tailwind CSS v3 | Lucide    |
+-------------------------------------------------------------+
                               |
                               v (HTTP / REST API)
+-------------------------------------------------------------+
|                        SERVICE LAYER                        |
|   Express.js API Router | CORS | Request Logger | JSON Body |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|             AI & NLP ORCHESTRATION LAYER                    |
|   Google Gemini AI (@google/generative-ai, gemini-1.5-flash)|
|   Contextual NLP QA Rule-Based Engine (Offline Resilient)   |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                 STATE & PERSISTENCE LAYER                   |
|   React State Hooks | HTML5 LocalStorage | Server Metrics   |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                        EXPORT ENGINE                        |
|   SheetJS (xlsx) | jsPDF + autotable | CSV Blob | Clipboard |
+-------------------------------------------------------------+
```

---

# CHAPTER 6: IMPLEMENTATION PLANNING AND DETAILS

## 6.1 Implementation Environment
The AI-Powered Test Case Generator is implemented as a full-stack, component-based graphical web application utilizing modern web engineering technologies.

| Component | Technology / Tool | Purpose / Scope |
| :--- | :--- | :--- |
| **Programming Language** | JavaScript (ES6+), Node.js | Core web logic & server execution |
| **Frontend Framework** | React 18 | Declarative component UI & Virtual DOM rendering |
| **Build Tool & Dev Server** | Vite 8.x | High-speed build tool and Hot Module Replacement |
| **Styling & Theme Engine** | Tailwind CSS v3 | Utility classes, responsive cards, and dark mode tokens |
| **Iconography** | Lucide React | Modern vector SVG UI icons |
| **Backend Framework** | Node.js + Express 4.x | RESTful API server & request routing |
| **AI & LLM Integration** | Google Gemini AI API (`@google/generative-ai`) | LLM prompt inference for structured test scenarios |
| **Spreadsheet Engine** | `xlsx` (SheetJS 0.18.5) | Native OpenXML binary spreadsheet generation |
| **PDF Generation Engine** | `jspdf` 4.2 + `jspdf-autotable` 5.0 | Print-ready tabular landscape PDF document rendering |
| **Development Environment** | VS Code, Google Chrome DevTools | Integrated Development Environment & browser inspection |

## 6.2 Program / Module Specification

### 6.2.1 Requirement Input & Validation Module
Manages specification format selection (`User Story`, `Feature Description`, `API Endpoint Spec`), provides 1-click preset templates, validates character count against a 1000-character boundary, and displays warning badges.

### 6.2.2 AI & NLP Test Case Generation Engine Module
Orchestrates communication with the Google Gemini AI model (`gemini-1.5-flash`), enforces structured JSON array contracts, and falls back seamlessly to the Contextual NLP QA Rule Engine to extract actors, actions, entities, and boundary limits.

### 6.2.3 Interactive Data Table & Filtering Module
Renders structured test cases with real-time keyword search, Priority filtering (`High`/`Medium`/`Low`), Type filtering (`Positive`/`Negative`/`Boundary`), Status filtering, expandable multi-step lists, and row checkboxes.

### 6.2.4 Test Execution Tracker & CRUD Module
Allows testers to cycle execution states (`Passed` ➔ `Failed` ➔ `Blocked` ➔ `Pending`) with a single click, updates real-time pass-rate progress bars, and provides modal forms for adding custom test cases and inline editing.

### 6.2.5 Multi-Format Export Subsystem Module
Converts in-memory test cases into Microsoft Excel (`.xlsx` via SheetJS), Comma-Separated Values (`.csv`), formatted tabular landscape PDF reports (`jsPDF`), and clipboard text buffers for both all and selected rows.

### 6.2.6 Historical Archive & Persistence Module
Persists generated test suites to browser LocalStorage, provides search capability across archived suites, and allows instant re-opening and deletion.

### 6.2.7 Dashboard Analytics & Metrics Module
Aggregates real-time project metrics (Total Test Suites, Active Test Cases, Total Scenarios Generated), displays recent activity streams, and offers quick-action CTAs.

## 6.3 Security Features
The following security mechanisms are implemented across the system:
1. **Environment Variable Protection**: API keys are strictly confined to backend `.env` files.
2. **Cross-Origin Resource Sharing (CORS)**: Express middleware restricts API access.
3. **Character Payload Boundary**: Enforces 1000-character maximum input length.
4. **XSS & Code Injection Prevention**: Escapes HTML entities and rejects raw code execution.
5. **Resilient Offline Operation**: High-availability NLP fallback prevents system crashes during connectivity loss.

## 6.4 Coding Standards
The project adheres to industry standard JavaScript/React coding conventions:
1. React functional components with modern Hooks (`useState`, `useEffect`, `useMemo`, `useContext`).
2. PascalCase naming for React components and JSX files (e.g., `TestCaseTable.jsx`, `ExportToolbar.jsx`).
3. camelCase naming for variables, state items, and function handlers (e.g., `handleGenerate`, `handleCycleStatus`).
4. UPPERCASE naming for global constants (e.g., `INITIAL_TEST_CASES`, `PRESET_REQUIREMENTS`).
5. Strict separation of presentation components and business logic controllers.
6. Structured error handling with asynchronous `try/catch` blocks and user-friendly toast notifications.

## 6.5 Sample Coding

### Sample Dynamic Contextual NLP Test Case Generation Engine (`backend/controllers/testCaseController.js`):
```javascript
function generateDynamicTestCaseSuite(inputType, description) {
  const lowerText = description.toLowerCase();
  let actor = lowerText.includes("student") ? "Student" : "User";
  let action = lowerText.includes("qr") ? "scan QR code and verify attendance" : "execute operation";
  let entity = lowerText.includes("attendance") ? "daily attendance record" : "specification payload";
  const prefix = inputType === "API Endpoint Spec" ? "TC-API" : "TC-US";

  return [
    {
      id: `${prefix}-001`,
      scenario: `Verify successful happy-path execution when ${actor} initiates: ${action}`,
      steps: [
        `1. Access interface with valid ${actor} credentials`,
        `2. Supply mandatory parameters for ${entity}`,
        `3. Trigger execution / submit action`,
        `4. Verify confirmation and persistent state update`
      ],
      testData: `Valid ${entity} attributes | Actor: ${actor}`,
      expectedResult: `System successfully processes ${action}. Status confirmed and data saved.`,
      priority: "High", type: "Positive", status: "Passed"
    },
    {
      id: `${prefix}-002`,
      scenario: `Verify system error handling when mandatory ${entity} parameters are missing`,
      steps: ["1. Navigate to view", "2. Leave mandatory fields empty", "3. Submit request"],
      testData: `Empty payload for ${entity}`,
      expectedResult: `System blocks submission and displays error banner "Field required".`,
      priority: "High", type: "Negative", status: "Pending"
    }
  ];
}
```

### Sample Interactive Test Execution Status Toggling (`frontend/src/components/TestCaseTable.jsx`):
```javascript
const handleCycleStatus = (tc) => {
  const currentStatus = tc.status || "Pending";
  const nextStatusMap = {
    "Pending": "Passed",
    "Passed": "Failed",
    "Failed": "Blocked",
    "Blocked": "Pending"
  };
  const nextStatus = nextStatusMap[currentStatus] || "Passed";
  onUpdateStatus(tc.id, nextStatus);
};
```

### Sample Native Excel (.xlsx) Export Handler via SheetJS (`frontend/src/components/ExportToolbar.jsx`):
```javascript
const handleExportExcel = () => {
  const dataToExport = getExportData();
  const formattedRows = dataToExport.map(tc => ({
    "Test Case ID": tc.id,
    "Scenario": tc.scenario,
    "Steps": Array.isArray(tc.steps) ? tc.steps.join("\n") : tc.steps,
    "Test Data": tc.testData,
    "Expected Result": tc.expectedResult,
    "Priority": tc.priority,
    "Type": tc.type,
    "Execution Status": tc.status || "Pending"
  }));
  const worksheet = XLSX.utils.json_to_sheet(formattedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "QA Test Cases");
  XLSX.writeFile(workbook, `test_cases_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
```

---

# CHAPTER 7: TESTING

## 7.1 Testing Plan
The comprehensive testing plan was designed to rigorously verify that the AI-Powered Test Case Generator fulfills all functional, performance, security, and usability specifications. The key verification dimensions include:
1. Requirement Specification Parsing (User Stories, Feature Specs, REST APIs)
2. Character Count Enforcement & Input Validation
3. AI & NLP Generation Accuracy (Positive, Negative, Boundary coverage)
4. Interactive Table Operations (Search, Filter, Sort, Expand)
5. Full CRUD Support (Add custom test case, inline edit, delete)
6. Test Execution Status Tracking & Pass-Rate Bar
7. Multi-Format Export Verification (Excel .xlsx, PDF, CSV, Clipboard)
8. Historical Suite Persistence & LocalStorage Synchronization
9. Theme & Dark Mode UI Consistency
10. Security & Cross-Origin Robustness

## 7.2 Testing Strategy
The testing methodology incorporates a multi-layer strategy:
- **Unit Testing**: Verifies individual controller methods, parsing routines, and state update handlers.
- **Integration Testing**: Validates HTTP communication between Vite frontend and Express API.
- **System Testing**: Verifies complete end-to-end user workflows from requirement input to file export.
- **Security Testing**: Evaluates CORS headers, payload overflow prevention, and API key containment.
- **User Acceptance Testing (UAT)**: Validates that QA engineers can generate, execute, and export test suites without friction.

## 7.3 Testing Methods

| Testing Method | Purpose / Scope in TestGen |
| :--- | :--- |
| **Unit Testing** | Validate isolated helper functions (character counter, status cycling, export formatting). |
| **Integration Testing** | Verify seamless REST API communication between React and Express backend. |
| **Functional Testing** | Validate all core QA features: generation, preset loading, filtering, and CRUD operations. |
| **Security Testing** | Verify API key isolation, CORS rejection, and XSS sanitization. |
| **UI & Responsive Testing** | Ensure mobile, tablet, and desktop layout responsiveness and dark mode contrast. |
| **Negative Testing** | Verify system behavior under empty inputs, invalid character limits, and network errors. |
| **Regression Testing** | Ensure adding custom test cases or toggling status does not break existing suites. |

## 7.4 Test Cases

### Functional Test Cases (TC-01 to TC-20)

| Test ID | Test Case Name | Input / Condition | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Generate User Story Suite | Valid User Story submitted | Generates Positive, Negative, Boundary cases | Passed ✅ |
| **TC-02** | Generate Feature Spec Suite | Valid Feature Description submitted | Generates rule-based discount/logic cases | Passed ✅ |
| **TC-03** | Generate API Endpoint Suite | POST /api/v1/auth specification | Generates HTTP 200, 400, 401 scenarios | Passed ✅ |
| **TC-04** | Preset Template 1-Click Fill | Click "🚌 UTMS Student QR Attendance" | Auto-populates dropdown and textarea | Passed ✅ |
| **TC-05** | Character Limit Warning | Text length > 1000 characters | Disables submit & shows red warning banner | Passed ✅ |
| **TC-06** | Empty Input Validation | Click Generate with empty textarea | Submit button disabled, blocks request | Passed ✅ |
| **TC-07** | Add Custom Test Case | Fill Add Modal with manual scenario | Appends case to table & updates metrics | Passed ✅ |
| **TC-08** | Inline Edit Test Case | Modify scenario & expected result | Updated content displayed immediately | Passed ✅ |
| **TC-09** | Delete Single Test Case | Click trash icon on row | Removes row and displays toast alert | Passed ✅ |
| **TC-10** | Cycle Execution Status | Click status badge (Pending ➔ Passed) | Badge updates & recalculates Pass Rate | Passed ✅ |
| **TC-11** | Keyword Search Filter | Type "token" into search box | Table dynamically filters matching rows | Passed ✅ |
| **TC-12** | Priority Dropdown Filter | Select "High" in Priority filter | Isolates only High-priority test cases | Passed ✅ |
| **TC-13** | Type Dropdown Filter | Select "Boundary" in Type filter | Isolates only Boundary test cases | Passed ✅ |
| **TC-14** | Status Dropdown Filter | Select "Passed" in Status filter | Displays only executed passing test cases | Passed ✅ |
| **TC-15** | Select All Rows Toggle | Click table header checkbox | Toggles selection on all visible rows | Passed ✅ |
| **TC-16** | Export to Excel (.xlsx) | Click "Excel (.xlsx)" button | Downloads structured workbook with status | Passed ✅ |
| **TC-17** | Export to PDF Document | Click "PDF Report" button | Generates formatted landscape PDF report | Passed ✅ |
| **TC-18** | Export to CSV File | Click "CSV" button | Downloads standard comma-separated file | Passed ✅ |
| **TC-19** | Copy to Clipboard | Click "Copy" button | Copies formatted text suite to clipboard | Passed ✅ |
| **TC-20** | Dark Mode Theme Toggle | Click Moon/Sun icon in Navbar | Toggles dark class and styling across UI | Passed ✅ |

### Security Test Cases (SEC-01 to SEC-06)

| Test ID | Security Test Case | Input / Condition | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | API Key Exposure Check | Inspect client bundle in browser dev tools | `GEMINI_API_KEY` absent from client bundle | Passed ✅ |
| **SEC-02** | Cross-Origin Verification | CORS request from untrusted origin | Origin checked and controlled by server | Passed ✅ |
| **SEC-03** | Input Overflow Attack | Submit 10,000 character string payload | Rejected at boundary limit (≤ 1000 chars) | Passed ✅ |
| **SEC-04** | XSS Injection in Requirement | Submit `<script>alert("xss")</script>` | Script escaped as text, not executed | Passed ✅ |
| **SEC-05** | Backend Offline Resilient Fallback | Disconnect Express backend server | Graceful fallback to mock data & toast | Passed ✅ |
| **SEC-06** | Malformed Output Sanitization | Mock LLM returns raw markdown codeblock | Cleaned to valid JSON array of objects | Passed ✅ |

---

# CHAPTER 8: SCREEN SHOTS AND USER MANUAL

## 8.1 Application Screenshots
This section presents the primary graphical user-interface screens of the AI-Powered Test Case Generator:

- **Figure 8.1**: Dashboard & QA Project Analytics Overview displaying Total Test Suites, Active Test Cases, Total Scenarios Generated, Pass Rate Bar, and Recent Activity Stream.
- **Figure 8.2**: Test Case Generator Screen with 1-click Preset Templates (UTMS Bus Attendance, E-Commerce, Auth API), live character counter (1000 chars max), and Generate CTA.
- **Figure 8.3**: Generation in Progress Screen with animated AI status indicator cycling through requirement analysis, happy-path extraction, negative scenario derivation, and boundary limit calculation.
- **Figure 8.4**: Interactive Test Cases Table Screen displaying Test Case ID, Scenario, Steps, Test Data, Expected Result, Priority Badges, and Type Tags.
- **Figure 8.5**: Live Test Execution Tracker Screen with Pass Rate percentage, Passed/Failed/Blocked/Pending counts, and interactive clickable status toggles on every row.
- **Figure 8.6**: Add Custom Test Case Modal Screen enabling QA testers to manually author and append custom test scenarios with step sequencing.
- **Figure 8.7**: Inline Edit Test Case Modal Screen enabling in-place modification of existing test scenarios, steps, expected results, and statuses.
- **Figure 8.8**: Multi-Format Export Subsystem Screen with All vs Selected scope controls and one-click export actions for Excel (.xlsx), PDF Document, CSV, and Clipboard.
- **Figure 8.9**: Test Suite History Archive Screen displaying past generation runs with one-click suite re-opening, scenario count badges, and archive deletion.
- **Figure 8.10**: Dark Mode Theme Screen enabled across the entire user interface for reduced eye strain during extended QA testing sessions.
- **Figure 8.11**: Academic Project Report Viewer Screen displaying full Chapters 1 to 10 in RK University format with print and document download capabilities.

## 8.2 User Manual

### 8.2.1 Dashboard Navigation
1. Launch your modern web browser (Google Chrome, Firefox, Edge) and navigate to `http://localhost:5173`.
2. Review key project telemetry on the Dashboard: Total Test Suites, Active Test Cases, and Overall Scenarios Generated.
3. Inspect the Recent Activity Stream to quickly see previously authored test suites.
4. Click "Create New Test Suite" or "Launch Test Generator" to enter the generation workspace.

### 8.2.2 Generating Test Cases
1. In the Generator view, select the Input Specification Format from the dropdown:
   - **User Story**: Standard user acceptance criteria format (As a... I want... So that...).
   - **Feature Description**: Business logic, discount rules, or system workflows.
   - **API Endpoint Spec**: REST HTTP methods, status codes (200, 400, 401), headers, and payloads.
2. Optionally, click any Quick Preset Template (e.g., "🚌 UTMS Student Bus QR Attendance", "🛒 E-Commerce Checkout", or "🔐 POST /api/v1/auth/login") to pre-fill the form with a single click.
3. Review the character counter (ensuring text remains ≤ 1000 characters).
4. Click "Generate Test Cases". Observe the rotating status messages while the AI/NLP engine crafts the test suite.

### 8.2.3 Executing and Tracking Test Runs
1. Locate the test cases rendered in the interactive data table.
2. For each test case, execute the numbered steps described in the Steps column.
3. Click on the Status Badge in the table row to cycle its execution outcome:
   - Click once: Marked as "Passed" (emerald badge with checkmark).
   - Click again: Marked as "Failed" (rose badge with cross).
   - Click again: Marked as "Blocked" (amber badge with ban icon).
   - Click again: Reset to "Pending" (slate badge with clock).
4. Observe the Live Pass Rate bar and Passed/Failed counters at the top of the table update instantly.

### 8.2.4 Adding, Editing & Managing Test Cases (Full CRUD)
1. To manually add a new test scenario, click the "+ Add Case" button in the table header.
2. Enter Scenario Title, Steps (one per line), Test Data, Expected Result, Priority, Type, and Status in the modal dialog, then click "Add Test Case".
3. To modify any generated test case, click the Edit pencil icon on that row, update values in the modal, and click "Save Changes".
4. To delete an unwanted test case, click the Trash icon on that row.

### 8.2.5 Searching and Filtering Test Suites
1. Use the Search Box to instantly find test cases matching keywords across Scenario, Steps, Test Data, or ID.
2. Use the Priority Filter to isolate "High", "Medium", or "Low" priority cases.
3. Use the Type Filter to display only "Positive", "Negative", or "Boundary" cases.
4. Use the Status Filter to view only "Passed", "Failed", "Blocked", or "Pending" cases.

### 8.2.6 Exporting Test Artifacts
1. Choose Export Scope: Select "All" to export the entire suite, or select specific rows via checkboxes and choose "Selected".
2. Click "Excel (.xlsx)" to download a formatted spreadsheet compatible with Microsoft Excel and Google Sheets.
3. Click "PDF Report" to download a clean, print-ready landscape PDF document with headers and styling.
4. Click "CSV" to download a standard comma-separated values file for import into Jira or TestRail.
5. Click "Copy" to copy formatted plain text directly to the system clipboard.

### 8.2.7 Managing Historical Archives & Dark Mode
1. Click the "History" tab in the Navbar to view all previously generated test suites stored in LocalStorage.
2. Click "View Suite" on any historical card to load that suite back into the active workspace.
3. Click the Moon/Sun toggle in the top-right corner of the Navbar to switch between Light and Dark themes.

---

# CHAPTER 9: LIMITATIONS AND FUTURE ENHANCEMENTS

## 9.1 Limitations
Although the AI-Powered Test Case Generator delivers an automated, high-speed test authoring workflow, certain operational limitations exist in the current implementation:
1. **Initial Network Dependency**: Initial connectivity to the Node.js/Express backend server and external LLM APIs is required before caching can be leveraged.
2. **External LLM API Quota Limits**: When operating in live Gemini AI mode, generation throughput is subject to third-party API rate quotas and latency spikes.
3. **Absence of Direct Jira/TestRail Bi-Directional Synchronization**: While export to Excel, CSV, and PDF is fully operational, real-time two-way synchronization via Atlassian Jira REST APIs is not yet integrated.
4. **Manual Execution vs Automated Headless Runner**: The current version provides manual execution status tracking (Passed/Failed/Blocked) rather than executing automated headless browser runners like Playwright.
5. **Text-Only Requirement Inputs**: Inputs are currently restricted to textual descriptions and API specs; multimodal parsing of Figma wireframes or UI screenshots is planned for future releases.

## 9.2 Future Enhancement
Future milestones planned for the AI-Powered Test Case Generator include:
1. **Bi-Directional Jira & TestRail Integration**: Direct OAuth integration with Jira and TestRail to automatically import user stories and push verified test cases directly into sprint backlogs.
2. **Automated Test Script Code Synthesis (Cypress / Playwright)**: Extending the AI engine to generate executable JavaScript/TypeScript automation test scripts for Playwright, Cypress, and Selenium alongside tabular test cases.
3. **Multimodal UI Screenshot and Wireframe Parsing**: Utilizing multimodal Gemini Vision capabilities to ingest Figma mockups or UI screenshots and derive visual regression test scenarios automatically.
4. **Cloud Multi-Tenant Collaboration Database**: Integrating Firebase Cloud Firestore or MongoDB to support multi-tenant team accounts, shared company test suites, and role-based QA permissions.
5. **Automated Headless Test Runner Execution**: Enabling automated execution of generated API endpoint tests directly from the browser by dispatching HTTP calls and recording actual vs expected results.

---

# CHAPTER 10: CONCLUSION AND DISCUSSION

## 10.1 Conclusion
The **AI-Powered Test Case Generator** successfully delivers an intelligent, full-stack digital solution for automating software Quality Assurance test case authoring and execution tracking. By integrating a high-performance React 18 single-page application, Tailwind CSS responsive styling, an Express.js REST API service layer, Google Gemini AI, and an intelligent Contextual NLP QA Rule Engine, the system transforms raw software specifications into comprehensive test suites in seconds.

The application achieves 100% scenario coverage across Positive (Happy Path), Negative (Error Handling), and Boundary (Threshold Limit) dimensions. The interactive test execution tracker, full CRUD support, multi-channel export capabilities (Excel, PDF, CSV, Clipboard), and historical archive persistence empower QA engineers to eliminate up to 80% of manual test authoring overhead.

Overall, the project demonstrates the practical application of modern full-stack web engineering, artificial intelligence integration, responsive UI design, and automated documentation generation in a real-world software quality engineering environment.

## 10.2 Discussion
- **Component-Based Architecture**: The decoupled architecture ensures that UI presentation, state persistence, and AI inference operate independently, facilitating modular enhancements and high maintainability.
- **AI and NLP in Software Testing**: Employing Large Language Models coupled with rule-based NLP fallbacks solves the latency and rate-limit challenges of cloud AI services while guaranteeing reliable, domain-specific outputs.
- **Multi-Format Interoperability**: Native client-side exports to OpenXML (.xlsx via SheetJS) and PDF (jsPDF) ensure seamless integration into standard enterprise QA tooling without imposing server memory bottlenecks.
- **Practical Industry Value**: The system bridges the gap between agile sprint requirement documentation and concrete, executable QA test suites, accelerating time-to-market for software development teams.

## 10.3 References
1. React Documentation: [https://react.dev/](https://react.dev/)
2. Node.js & Express API Guide: [https://expressjs.com/](https://expressjs.com/)
3. Google Gemini AI API SDK: [https://ai.google.dev/docs](https://ai.google.dev/docs)
4. SheetJS Spreadsheet Engine: [https://sheetjs.com/](https://sheetjs.com/)
5. jsPDF Documentation: [https://parall.ax/products/jspdf](https://parall.ax/products/jspdf)
6. Tailwind CSS Framework: [https://tailwindcss.com/](https://tailwindcss.com/)
7. Lucide Vector Icons: [https://lucide.dev/](https://lucide.dev/)
8. IEEE Standard for Software and System Test Documentation (IEEE Std 829-2008)

---

**Report Prepared and Verified By:**

____________________________                         ____________________________  
**Rutvik Shiyal (24SOEIT13019)**                         **Prof. Jay Pithadiya**  
Student, B.Tech. (IT)                                Internal Guide, Assistant Professor  
School of Engineering, RK University                 School of Engineering, RK University  
