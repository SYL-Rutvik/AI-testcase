# AI-Powered Test Case Generator

A full-stack web application scaffold built with **React** (frontend) and **Node.js / Express** (backend) designed to generate comprehensive software test cases from user stories, feature descriptions, or API specifications.

---

## 📁 Project Architecture

```text
AI-testcase/
├── backend/                        # Node.js + Express API Server
│   ├── package.json                # Server dependencies & scripts
│   ├── server.js                   # Express server entry point & CORS configuration
│   ├── controllers/
│   │   └── testCaseController.js   # API endpoint controller (returns structured test cases)
│   └── routes/
│       └── testCaseRoutes.js       # Express route handlers
│
├── frontend/                       # React + Vite + Tailwind CSS Application
│   ├── package.json                # Client dependencies & scripts
│   ├── vite.config.js              # Vite bundler configuration
│   ├── tailwind.config.js          # Tailwind CSS theme & utility config
│   ├── index.html                  # HTML root template with Inter typography
│   └── src/
│       ├── main.jsx                # React app mounting point
│       ├── index.css               # Tailwind directives & custom scrollbars
│       ├── App.jsx                 # Main layout & API state manager
│       ├── data/
│       │   └── dummyData.js        # Initial fallback test case data
│       └── components/
│           ├── Header.jsx          # Blue/indigo gradient banner
│           ├── InputForm.jsx       # Dropdown, textarea, and submit button
│           ├── LoadingSpinner.jsx  # Animated AI step simulation spinner
│           ├── ExportButtons.jsx   # Export to Excel and CSV buttons
│           └── TestCaseTable.jsx   # Data table with color-coded badges
│
└── README.md                       # Project documentation & viva setup guide
```

---

## 🚀 Step-by-Step Installation & Run Guide

### 1. Backend Setup (Node.js & Express)

Open a terminal window and navigate to the `backend` folder:

```bash
cd backend
npm install
```

Start the Express backend server:

```bash
# Production mode:
npm start

# OR Development mode with auto-reload (requires nodemon):
npm run dev
```

> The server will start on **`http://localhost:5000`** with the test case endpoint available at **`POST http://localhost:5000/api/generate-test-cases`**.

---

### 2. Frontend Setup (React + Vite + Tailwind CSS)

Open a **second** terminal window and navigate to the `frontend` folder:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

> The React application will open automatically in your browser at **`http://localhost:5173`**.

---

## 🛠️ Tech Stack & Key Features

| Component | Technology Used | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Fast single-page application rendering |
| **Styling** | Tailwind CSS v3 | Indigo/blue QA color scheme, card layout, responsive table |
| **Icons** | Lucide React | Modern vector UI icons (`Sparkles`, `FileSpreadsheet`, `Tag`, etc.) |
| **Backend Framework** | Node.js + Express | Lightweight RESTful API server |
| **Middleware** | CORS + Express.json | Cross-Origin Request handling and JSON request body parsing |

---

## 🎨 UI Highlights & Test Case Structure

### Table Columns & Badges
Each test case item consists of:
1. **Test Case ID**: Unique identifier (e.g. `TC001`, `TC002`).
2. **Scenario**: Clear title of what is being tested.
3. **Steps**: Multi-step numbered procedure.
4. **Test Data**: Specific inputs/parameters required.
5. **Expected Result**: System behavior verification criteria.
6. **Priority Badges**:
   - 🔴 **High**: Critical path items (red badge)
   - 🟡 **Medium**: Secondary validation (amber badge)
   - 🟢 **Low**: Minor UI checks (emerald badge)
7. **Type Tags**:
   - 🟦 **Positive**: Happy path flows (blue tag)
   - 🟪 **Negative**: Error handling & invalid inputs (purple tag)
   - 🟩 **Boundary**: Min/max limit checks (teal tag)

---

## 🎓 College Viva / Defense Explanation Points

When presenting this project for your college evaluation, highlight the following design decisions:

1. **Separation of Concerns (MVC / Modular Architecture)**:
   - Route logic is isolated in `routes/testCaseRoutes.js`.
   - Business controller logic is isolated in `controllers/testCaseController.js`.
   - Frontend UI is broken into modular React components (`Header`, `InputForm`, `TestCaseTable`).

2. **Resilient Data Fetching**:
   - Clicking "Generate Test Cases" makes an asynchronous `fetch` call to `http://localhost:5000/api/generate-test-cases`.
   - If the Express server is offline, the React app gracefully catches the exception and falls back to local mock data, ensuring your presentation demo never crashes.

3. **Next Stage (AI Integration via Google Gemini API)**:
   - To connect real Gemini AI later, only `testCaseController.js` in the backend needs to be updated with `@google/genai` or `@google/generative-ai` SDK, while keeping the exact same JSON output contract!
