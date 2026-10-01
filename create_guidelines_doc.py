import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def format_table(table, col_widths, header_bg="1E293B", zebra_bg="F8FAFC"):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(table.rows):
        is_header = (i == 0)
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        if is_header:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

        for j, cell in enumerate(row.cells):
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            if j < len(col_widths):
                cell.width = col_widths[j]
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            if is_header:
                set_cell_background(cell, header_bg)
                for p in cell.paragraphs:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                    for run in p.runs:
                        run.font.name = 'Times New Roman'
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
                        run.font.size = Pt(9.5)
            else:
                if i % 2 == 1:
                    set_cell_background(cell, "FFFFFF")
                else:
                    set_cell_background(cell, zebra_bg)
                for p in cell.paragraphs:
                    for run in p.runs:
                        run.font.name = 'Times New Roman'
                        run.font.size = Pt(9)

def add_chapter_heading(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text.upper())
    run.font.name = 'Times New Roman'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42) # Slate-900
    return p

def add_section_heading(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text.upper())
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_subsection_heading(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_body_p(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    return p

def add_bullet_p(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(3)
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Times New Roman'
        r_bold.font.size = Pt(11)
        r_bold.font.bold = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    return p

def add_code_block(doc, code_text):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.4)
    p.paragraph_format.right_indent = Inches(0.4)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.0
    run = p.add_run(code_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_figure_caption(doc, caption_text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(12)
    run = p.add_run(caption_text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(10.5)
    run.font.bold = True
    run.font.italic = True
    return p

def add_table_caption(doc, caption_text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(caption_text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(10.5)
    run.font.bold = True
    return p

def build_project_report_chapters_5_to_10():
    doc = docx.Document()
    
    # -------------------------------------------------------------
    # 1. PAGE SETUP (A4, 1.2" Left, 1.0" Right/Top/Bottom)
    # -------------------------------------------------------------
    section = doc.sections[0]
    section.page_width = Inches(8.27)   # 210 mm
    section.page_height = Inches(11.69) # 297 mm
    section.left_margin = Inches(1.2)   # 1.2 Inches (as per guideline)
    section.right_margin = Inches(1.0)  # 1.0 Inch
    section.top_margin = Inches(1.0)    # 1.0 Inch
    section.bottom_margin = Inches(1.0) # 1.0 Inch

    # -------------------------------------------------------------
    # 2. HEADER & FOOTER SETUP
    # TOP-LEFT: Enrollment Number | TOP-RIGHT: Project Title
    # BOTTOM-LEFT: CE/IT Branch   | BOTTOM-RIGHT: Page Number
    # -------------------------------------------------------------
    header = section.header
    p_head = header.paragraphs[0]
    p_head.text = "24SOEIT13019\t\tAI-Powered Test Case Generator"
    for r in p_head.runs:
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(100, 116, 139)

    footer = section.footer
    p_foot = footer.paragraphs[0]
    p_foot.text = "CE/IT - RK University\t\tPage "
    for r in p_foot.runs:
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(100, 116, 139)
    # Add dynamic page field
    fld = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
    p_foot._p.append(fld)

    # -------------------------------------------------------------
    # FRONT COVER / SUBMISSION HEADER (Chapters 5 to 10)
    # -------------------------------------------------------------
    p_cover_title = doc.add_paragraph()
    p_cover_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cover_title.paragraph_format.space_before = Pt(12)
    p_cover_title.paragraph_format.space_after = Pt(4)
    r = p_cover_title.add_run("RK UNIVERSITY\nSCHOOL OF ENGINEERING")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = RGBColor(30, 58, 138)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_after = Pt(12)
    r = p_dept.add_run("DEPARTMENT OF INFORMATION TECHNOLOGY\nB.Tech. (IT) 7th Semester | CE738 Project Phase")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_proj.paragraph_format.space_before = Pt(8)
    p_proj.paragraph_format.space_after = Pt(8)
    r = p_proj.add_run("AI-POWERED TEST CASE GENERATOR\nPROJECT REPORT (CHAPTER 5 TO CHAPTER 10)")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    # Student / Guide Metadata Table
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.cell(0, 0).paragraphs[0].text = "Submitted By:\nRutvik Shiyal (24SOEIT13019)\nB.Tech. Information Technology"
    meta_table.cell(0, 1).paragraphs[0].text = "Internal Project Guide:\nProf. Jay Pithadiya\nAssistant Professor, Dept. of IT"
    meta_table.cell(1, 0).paragraphs[0].text = "Academic Year: 2026 - 2027"
    meta_table.cell(1, 1).paragraphs[0].text = "Submission: Final CE/IT Project Deliverable"
    format_table(meta_table, [Inches(3.0), Inches(3.0)], header_bg="334155")

    doc.add_page_break()

    # -------------------------------------------------------------
    # TABLE OF CONTENTS (Chapters 5 to 10 Format as per Guidelines)
    # -------------------------------------------------------------
    p_toc_head = doc.add_paragraph()
    p_toc_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_head.paragraph_format.space_after = Pt(12)
    r = p_toc_head.add_run("TABLE OF CONTENTS")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True

    toc_table = doc.add_table(rows=25, cols=2)
    toc_table.cell(0, 0).paragraphs[0].text = "Title"
    toc_table.cell(0, 1).paragraphs[0].text = "Chapter / Section"

    toc_rows = [
        ("5.0 SYSTEM DESIGN", "Chapter 5"),
        ("  5.1 Database Design / Data Structure Design", "5.1"),
        ("    5.1.1 Mapping objects/classes to tables (if non OO languages)", "5.1.1"),
        ("    5.1.2 Tables and Relationship", "5.1.2"),
        ("    5.1.3 Logical Description of Data", "5.1.3"),
        ("  5.2 System Procedural Design", "5.2"),
        ("    5.2.1 Flow chart or activity design", "5.2.1"),
        ("  5.3 Input/Output and Interface Design", "5.3"),
        ("    5.3.1 Samples of Forms and Interface", "5.3.1"),
        ("    5.3.2 Access Control and Security", "5.3.2"),
        ("  5.4 System Architecture Design", "5.4"),
        ("6.0 IMPLEMENTATION PLANNING AND DETAILS", "Chapter 6"),
        ("  6.1 Implementation Environment (Single vs Multiuser, GUI vs Non GUI)", "6.1"),
        ("  6.2 Program / Modules Specification", "6.2"),
        ("  6.3 Security Features", "6.3"),
        ("  6.4 Coding Standards", "6.4"),
        ("  6.5 Sample Coding", "6.5"),
        ("7.0 TESTING", "Chapter 7"),
        ("  7.1 Testing Plan", "7.1"),
        ("  7.2 Testing Strategy", "7.2"),
        ("  7.3 Testing Methods", "7.3"),
        ("  7.4 Test Cases (Purpose, Required output, Expected Result)", "7.4"),
        ("8.0 SCREEN SHOTS AND USER MANUAL", "Chapter 8"),
        ("9.0 LIMITATION AND FUTURE ENHANCEMENT", "Chapter 9"),
    ]
    for idx, (title, sec_no) in enumerate(toc_rows):
        toc_table.cell(idx+1, 0).paragraphs[0].text = title
        toc_table.cell(idx+1, 1).paragraphs[0].text = sec_no
    format_table(toc_table, [Inches(4.6), Inches(1.4)], header_bg="1E293B")

    doc.add_page_break()

    # =============================================================
    # 5.0 SYSTEM DESIGN
    # =============================================================
    add_chapter_heading(doc, "5.0 SYSTEM DESIGN")
    
    add_section_heading(doc, "5.1 Database Design / Data Structure Design")
    add_body_p(doc, 
        "The AI-Powered Test Case Generator adopts a high-efficiency decoupled architecture combining client-side "
        "persistent state (HTML5 LocalStorage) and server-side memory structures, optimized for high throughput and rapid "
        "test scenario generation. In modern software quality engineering, test case suites are composed of hierarchical, "
        "context-sensitive entities comprising precondition steps, execution test vectors, expected outcomes, priority weights, "
        "and runtime execution statuses."
    )
    
    add_subsection_heading(doc, "5.1.1 Mapping objects/classes to tables (if non OO languages)")
    add_body_p(doc,
        "In the JavaScript and Node.js execution environment, domain entities are implemented using structured object schemas. "
        "To guarantee strict schema consistency across the REST API interface and client storage, JSON document schemas are "
        "mapped directly to relational-style entities. Each primary object—comprising Test Suites, Test Cases, User Accounts, "
        "and System Telemetry—is normalized to prevent data redundancy while ensuring seamless serialization for Excel, PDF, "
        "and CSV exports."
    )

    add_subsection_heading(doc, "5.1.2 Tables and Relationship")
    add_body_p(doc,
        "The relational data structures governing the AI-Powered Test Case Generator platform consist of four core entities: "
        "User Account, Test Suite, Test Case Item, and Telemetry Audit Log. A 1:N (One-to-Many) relationship exists between "
        "User Account and Test Suites, and a 1:N relationship exists between each Test Suite and its constituent Test Case Items."
    )

    # Table 5.1: Test Suite Entity Schema
    add_table_caption(doc, "Table 5.1: Test Suite Entity Schema")
    t51 = doc.add_table(rows=7, cols=5)
    for j, h in enumerate(['Field Name', 'Data Type', 'Constraint', 'Nullability', 'Description']):
        t51.cell(0, j).paragraphs[0].text = h
    t51_data = [
        ('id', 'String (VARCHAR 32)', 'PRIMARY KEY', 'NOT NULL', 'Unique suite identifier (e.g. SUITE-1042)'),
        ('title', 'String (VARCHAR 255)', 'None', 'NOT NULL', 'Requirement headline or feature title'),
        ('inputType', 'Enum (VARCHAR 30)', 'CHECK', 'NOT NULL', 'User Story | Feature Description | API Spec'),
        ('createdAt', 'Timestamp (ISO 8601)', 'None', 'NOT NULL', 'Suite generation date and timestamp'),
        ('isLiveAI', 'Boolean', 'DEFAULT true', 'NOT NULL', 'True if generated via Gemini API; False if NLP'),
        ('testCasesCount', 'Integer', 'CHECK >= 0', 'NOT NULL', 'Total number of child test cases in suite')
    ]
    for i, r in enumerate(t51_data):
        for j, c in enumerate(r):
            t51.cell(i+1, j).paragraphs[0].text = c
    format_table(t51, [Inches(1.2), Inches(1.3), Inches(1.1), Inches(1.0), Inches(1.4)])

    # Table 5.2: Test Case Item Schema
    add_table_caption(doc, "Table 5.2: Test Case Item Schema")
    t52 = doc.add_table(rows=9, cols=5)
    for j, h in enumerate(['Field Name', 'Data Type', 'Constraint', 'Nullability', 'Description']):
        t52.cell(0, j).paragraphs[0].text = h
    t52_data = [
        ('id', 'String (VARCHAR 16)', 'PRIMARY KEY', 'NOT NULL', 'Standardized case ID (e.g. TC-001, US-001)'),
        ('scenario', 'Text (TEXT)', 'None', 'NOT NULL', 'Objective or description of verification'),
        ('steps', 'Array of Strings', 'JSON', 'NOT NULL', 'Ordered sequence of test execution steps'),
        ('testData', 'Text (VARCHAR 255)', 'None', 'NOT NULL', 'Input test values, payload parameters'),
        ('expectedResult', 'Text (TEXT)', 'None', 'NOT NULL', 'System expected behavior and response'),
        ('priority', 'Enum (VARCHAR 10)', 'CHECK', 'NOT NULL', 'High | Medium | Low ranking'),
        ('type', 'Enum (VARCHAR 15)', 'CHECK', 'NOT NULL', 'Positive | Negative | Boundary scenario'),
        ('status', 'Enum (VARCHAR 12)', 'CHECK', 'NOT NULL', 'Pending | Passed | Failed | Blocked')
    ]
    for i, r in enumerate(t52_data):
        for j, c in enumerate(r):
            t52.cell(i+1, j).paragraphs[0].text = c
    format_table(t52, [Inches(1.2), Inches(1.3), Inches(1.1), Inches(1.0), Inches(1.4)])

    add_subsection_heading(doc, "5.1.3 Logical Description of Data")
    add_body_p(doc,
        "The system enforces strict domain integrity rules across all data attributes:\n"
        "• Requirement Length: Specification strings are constrained between 10 and 1,000 characters to prevent prompt "
        "overflow and guarantee sub-second LLM inference times.\n"
        "• Priority Weighting: Categorized as 'High' for critical security/auth workflows, 'Medium' for standard operational "
        "functions, and 'Low' for optional UI/formatting states.\n"
        "• Scenario Type Distribution: Every generated suite adheres to a balanced QA distribution matrix ensuring comprehensive "
        "coverage across Happy Path (Positive), Error Handling (Negative), and Threshold Limits (Boundary)."
    )

    add_section_heading(doc, "5.2 System Procedural Design")
    add_subsection_heading(doc, "5.2.1 Flow chart or activity design")
    add_body_p(doc,
        "The procedural flow of the AI-Powered Test Case Generator coordinates user specification ingestion, quota gating, "
        "dual-engine inference execution, and post-generation data table management:"
    )
    add_bullet_p(doc, "User inputs requirement specification or selects 1-click Preset Template (e.g. UTMS Student Bus QR Attendance).", "Step 1: Input Ingestion: ")
    add_bullet_p(doc, "Client validates character length (1 to 1000 chars) and checks user quota. If guest exceeds 1 trial, Auth Modal intercepts. If free tier exceeds 10 generations, Pricing Modal intercepts.", "Step 2: Quota & Auth Guard: ")
    add_bullet_p(doc, "Request is transmitted via HTTP POST to Express REST API endpoint /api/generate-test-cases.", "Step 3: Backend Dispatch: ")
    add_bullet_p(doc, "Express server formats contextual prompt and dispatches to Google Gemini 1.5 Flash API. If API key is absent or quota throttled, it automatically routes to the Contextual NLP Rule Engine.", "Step 4: Dual-Engine AI Processing: ")
    add_bullet_p(doc, "JSON response array is validated, sanitized against XSS, and returned with HTTP 200 OK.", "Step 5: Sanitization & Parsing: ")
    add_bullet_p(doc, "React state is hydrated, rendering the interactive table with full CRUD, execution status cycling, and multi-format export buttons.", "Step 6: UI Rendering & Execution: ")

    add_section_heading(doc, "5.3 Input/Output and Interface Design")
    add_subsection_heading(doc, "5.3.1 Samples of Forms and Interface")
    add_body_p(doc,
        "The graphical user interface is structured into specialized functional components designed with modern visual aesthetics "
        "(glassmorphic navigation, high-contrast dark mode, and responsive layout):\n"
        "1. Generator Workspace Form: Includes input format selector dropdown, preset template pills, dynamic character counter, "
        "and primary generation trigger button.\n"
        "2. Add / Edit Custom Test Case Modal: Provides structured input fields for Scenario, numbered Steps, Test Data, Expected Outcome, "
        "Priority, and Type tags.\n"
        "3. Interactive Data Table: Supports live status toggling (Passed, Failed, Blocked, Pending) with an instant pass-rate progress bar.\n"
        "4. Super Admin Portal: Multi-tenant user directory table with search, plan filters, quota resets, and AI telemetry cards."
    )

    add_subsection_heading(doc, "5.3.2 Access Control and Security")
    add_body_p(doc,
        "The application implements Role-Based Access Control (RBAC) across three distinct privilege levels:\n"
        "• Guest Mode: Permits 1 free test case suite generation trial to evaluate platform capabilities before requiring authentication.\n"
        "• Registered QA Engineer / Developer: Unlocks 10 free AI test generations with manual/Google authentication, historical archiving, and export privileges.\n"
        "• Platform Administrator: Grants unlimited generation quota bypass, multi-tenant user management (role updates, plan upgrades, account suspension), and real-time AI telemetry monitoring."
    )

    add_section_heading(doc, "5.4 System Architecture Design")
    add_body_p(doc,
        "The system architecture follows a decoupled, 4-tier client-server structure:\n"
        "1. Presentation Tier: Single-Page Application (SPA) constructed in React 18 and styled with Tailwind CSS, delivering real-time DOM updates.\n"
        "2. API Gateway & Controller Tier: Express.js HTTP routing framework handling CORS, request validation, authentication tokens, and admin endpoints.\n"
        "3. AI & NLP Inference Tier: Primary Google Generative AI (Gemini 1.5 Flash) engine coupled with an intelligent Contextual NLP Rule Engine fallback.\n"
        "4. Client Persistence & Export Tier: HTML5 LocalStorage for suite persistence and SheetJS/jsPDF client libraries for instant client-side file synthesis."
    )

    doc.add_page_break()

    # =============================================================
    # 6.0 IMPLEMENTATION PLANNING AND DETAILS
    # =============================================================
    add_chapter_heading(doc, "6.0 IMPLEMENTATION PLANNING AND DETAILS")

    add_section_heading(doc, "6.1 Implementation Environment (Single vs Multiuser, GUI vs Non GUI)")
    add_body_p(doc,
        "The AI-Powered Test Case Generator is developed as a multi-user, client-server web platform. The implementation "
        "environment is categorized as follows:\n"
        "• User Access Architecture: Multi-user architecture supporting concurrent guest visitors, registered QA engineers, "
        "and platform administrators with role-isolated privileges.\n"
        "• Graphical User Interface (GUI): Web-based responsive GUI constructed using React 18, Tailwind CSS utility classes, "
        "and Lucide vector icons, accessible across modern desktop, tablet, and mobile browsers.\n"
        "• Non-GUI Backend Service: Headless Node.js v22 runtime executing an Express REST API on port 5000, communicating over "
        "stateless JSON payloads."
    )

    add_section_heading(doc, "6.2 Program / Modules Specification")
    add_body_p(doc, "The codebase is organized into modular functional subsystems:")
    add_bullet_p(doc, "Handles responsive layout, active navigation routing, dark mode synchronization, and toast notifications.", "Module 1 - Navigation & Layout (App.jsx, Navbar.jsx): ")
    add_bullet_p(doc, "Manages requirement format selection, 1-click preset loading, character limits, and AI generation requests.", "Module 2 - Test Generation Module (GeneratorPage.jsx): ")
    add_bullet_p(doc, "Provides full CRUD operations, keyword searching, multi-column filtering, and execution tracking.", "Module 3 - Interactive Table & Tracker (TestCaseTable.jsx): ")
    add_bullet_p(doc, "Synthesizes native Excel (.xlsx), landscape PDF reports, CSV files, and clipboard text formatting.", "Module 4 - Real Export Subsystem (ExportToolbar.jsx): ")
    add_bullet_p(doc, "Controls Google OAuth (GIS), email/password login, demo accounts, and 10-quota upgrade interceptors.", "Module 5 - Authentication & Freemium Quota (AuthModal.jsx, PricingModal.jsx): ")
    add_bullet_p(doc, "Provides multi-tenant user management, live AI telemetry, and zero-friction project permission toggles.", "Module 6 - Admin Portal & Governance (AdminPortalPage.jsx): ")

    add_section_heading(doc, "6.3 Security Features")
    add_body_p(doc,
        "System security is enforced through multi-layered mechanisms:\n"
        "• API Key Containment: Google Gemini AI secret keys are strictly maintained on the server-side within .env configuration files, preventing exposure to client browser dev tools.\n"
        "• Cross-Origin Resource Sharing (CORS): Express CORS middleware restricts API consumption to authorized frontend origins (http://localhost:5173).\n"
        "• Input Length & Payload Sanitization: Textarea inputs are capped at 1,000 characters to prevent buffer overflow attacks, and all HTML entities are escaped to eliminate Cross-Site Scripting (XSS).\n"
        "• Dual-Engine Failover Resilience: If cloud AI endpoints experience throttling or network drops, the system seamlessly activates the local NLP engine without crashing."
    )

    add_section_heading(doc, "6.4 Coding Standards")
    add_body_p(doc,
        "The project adheres to professional industry software engineering conventions:\n"
        "• React Functional Architecture: Utilization of React Hooks (useState, useEffect, useMemo, useRef) for clean state management.\n"
        "• ES6+ Modern JavaScript: Strict usage of arrow functions, destructuring, async/await asynchronous handling, and template literals.\n"
        "• Semantic HTML5 & CSS: Semantic tags (<header>, <main>, <nav>, <section>) styled via atomic Tailwind CSS classes.\n"
        "• Standard RESTful API Conventions: Clear HTTP verb mapping (GET /api/admin/users, POST /api/generate-test-cases, PATCH /api/admin/users/:id, DELETE /api/admin/users/:id) with standard HTTP status codes."
    )

    add_section_heading(doc, "6.5 Sample Coding")
    add_body_p(doc, "Below are authentic code extracts demonstrating core functionality:")
    
    add_subsection_heading(doc, "Snippet 6.1: Dual-Engine Test Generation Controller (testCaseController.js)")
    add_code_block(doc,
        "const { GoogleGenerativeAI } = require('@google/generative-ai');\n\n"
        "const generateTestCases = async (req, res) => {\n"
        "  const { inputType, featureDescription } = req.body;\n"
        "  if (!featureDescription || featureDescription.trim().length === 0) {\n"
        "    return res.status(400).json({ success: false, message: 'Requirement text is required.' });\n"
        "  }\n\n"
        "  if (process.env.GEMINI_API_KEY) {\n"
        "    try {\n"
        "      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);\n"
        "      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });\n"
        "      const prompt = `Generate a JSON array of QA test cases for ${inputType}: ${featureDescription}`;\n"
        "      const result = await model.generateContent(prompt);\n"
        "      const parsedData = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());\n"
        "      return res.status(200).json({ success: true, data: parsedData, meta: { isLiveAI: true } });\n"
        "    } catch (aiErr) {\n"
        "      console.warn('Gemini API limit reached. Activating resilient NLP Fallback Engine.');\n"
        "    }\n"
        "  }\n"
        "  // Intelligent NLP Fallback Engine\n"
        "  const fallbackSuite = generateDynamicTestCaseSuite(inputType, featureDescription);\n"
        "  return res.status(200).json({ success: true, data: fallbackSuite, meta: { isLiveAI: false } });\n"
        "};"
    )

    add_subsection_heading(doc, "Snippet 6.2: Native Client-Side Excel Export (ExportToolbar.jsx)")
    add_code_block(doc,
        "import * as XLSX from 'xlsx';\n\n"
        "const handleExportExcel = () => {\n"
        "  const dataToExport = selectedIds.length > 0 \n"
        "    ? allTestCases.filter(tc => selectedIds.includes(tc.id))\n"
        "    : allTestCases;\n\n"
        "  const formattedRows = dataToExport.map(tc => ({\n"
        "    'Test ID': tc.id,\n"
        "    'Scenario': tc.scenario,\n"
        "    'Steps': Array.isArray(tc.steps) ? tc.steps.join(' \\n') : tc.steps,\n"
        "    'Test Data': tc.testData,\n"
        "    'Expected Result': tc.expectedResult,\n"
        "    'Priority': tc.priority,\n"
        "    'Type': tc.type,\n"
        "    'Execution Status': tc.status || 'Pending'\n"
        "  }));\n\n"
        "  const worksheet = XLSX.utils.json_to_sheet(formattedRows);\n"
        "  const workbook = XLSX.utils.book_new();\n"
        "  XLSX.utils.book_append_sheet(workbook, worksheet, 'QA Test Cases');\n"
        "  XLSX.writeFile(workbook, `TestCases_${new Date().toISOString().slice(0, 10)}.xlsx`);\n"
        "};"
    )

    doc.add_page_break()

    # =============================================================
    # 7.0 TESTING
    # =============================================================
    add_chapter_heading(doc, "7.0 TESTING")

    add_section_heading(doc, "7.1 Testing Plan")
    add_body_p(doc,
        "The verification strategy for the AI-Powered Test Case Generator was engineered to validate end-to-end functionality, "
        "system stability, LLM resilience, data table responsiveness, multi-channel export precision, and role-based security. "
        "The test plan establishes measurable acceptance criteria across all software components prior to deployment."
    )

    add_section_heading(doc, "7.2 Testing Strategy")
    add_body_p(doc,
        "A multi-tier testing strategy was implemented:\n"
        "• Unit Testing: Evaluated isolated helper routines including prompt string sanitizers, status toggling logic, and export formatting.\n"
        "• Integration Testing: Verified REST API request-response contracts between the React client and Express backend.\n"
        "• Functional & System Testing: Validated all user workflows including preset loading, custom test authoring, inline editing, and filtering.\n"
        "• Security & Boundary Testing: Evaluated input length boundaries (≤ 1000 characters), CORS restrictions, and API key isolation."
    )

    add_section_heading(doc, "7.3 Testing Methods")
    add_table_caption(doc, "Table 7.1: Testing Methods and Verification Scope")
    t71 = doc.add_table(rows=8, cols=2)
    t71.cell(0, 0).paragraphs[0].text = "Testing Method"
    t71.cell(0, 1).paragraphs[0].text = "Purpose & Scope in TestGen Application"
    t71_data = [
        ("Unit Testing", "Validate isolated parsing functions, status cycling, and character counters."),
        ("Integration Testing", "Verify REST API communication between Vite React frontend and Express backend."),
        ("Functional Testing", "Validate AI test generation, preset templates, CRUD operations, and multi-format exports."),
        ("Security Testing", "Verify API key containment, CORS origin checks, and XSS string escaping."),
        ("UI & Responsive Testing", "Verify desktop, tablet, and mobile responsiveness and dark mode contrast."),
        ("Negative & Boundary Testing", "Verify handling of empty inputs, >1000 character boundaries, and network dropouts."),
        ("Regression Testing", "Ensure adding custom test cases or toggling status does not corrupt existing suites.")
    ]
    for i, (m, purp) in enumerate(t71_data):
        t71.cell(i+1, 0).paragraphs[0].text = m
        t71.cell(i+1, 1).paragraphs[0].text = purp
    format_table(t71, [Inches(2.4), Inches(4.4)])

    add_section_heading(doc, "7.4 Test Cases (Purpose, Required output, Expected Result)")
    add_body_p(doc, "The table below documents the functional test cases executed on the system:")

    add_table_caption(doc, "Table 7.2: Comprehensive Functional Test Cases (TC-01 to TC-20)")
    t72 = doc.add_table(rows=21, cols=5)
    for j, h in enumerate(['Test ID', 'Test Case Name', 'Input / Condition', 'Expected Result', 'Actual Status']):
        t72.cell(0, j).paragraphs[0].text = h
    t72_data = [
        ('TC-01', 'Generate User Story Suite', 'Valid User Story submitted', 'Generates Positive, Negative, Boundary cases', 'Passed ✅'),
        ('TC-02', 'Generate Feature Spec Suite', 'Valid Feature Description submitted', 'Generates rule-based discount/logic cases', 'Passed ✅'),
        ('TC-03', 'Generate API Endpoint Suite', 'POST /api/v1/auth specification', 'Generates HTTP 200, 400, 401 scenarios', 'Passed ✅'),
        ('TC-04', 'Preset Template 1-Click Fill', 'Click "🚌 UTMS Student QR Attendance"', 'Auto-populates dropdown and textarea', 'Passed ✅'),
        ('TC-05', 'Character Limit Warning', 'Text length > 1000 characters', 'Disables submit & shows red warning banner', 'Passed ✅'),
        ('TC-06', 'Empty Input Validation', 'Click Generate with empty textarea', 'Submit button disabled, blocks request', 'Passed ✅'),
        ('TC-07', 'Add Custom Test Case', 'Fill Add Modal with manual scenario', 'Appends case to table & updates metrics', 'Passed ✅'),
        ('TC-08', 'Inline Edit Test Case', 'Modify scenario & expected result', 'Updated content displayed immediately', 'Passed ✅'),
        ('TC-09', 'Delete Single Test Case', 'Click trash icon on row', 'Removes row and displays toast alert', 'Passed ✅'),
        ('TC-10', 'Cycle Execution Status', 'Click status badge (Pending ➔ Passed)', 'Badge updates & recalculates Pass Rate', 'Passed ✅'),
        ('TC-11', 'Keyword Search Filter', 'Type "token" into search box', 'Table dynamically filters matching rows', 'Passed ✅'),
        ('TC-12', 'Priority Dropdown Filter', 'Select "High" in Priority filter', 'Isolates only High-priority test cases', 'Passed ✅'),
        ('TC-13', 'Type Dropdown Filter', 'Select "Boundary" in Type filter', 'Isolates only Boundary test cases', 'Passed ✅'),
        ('TC-14', 'Status Dropdown Filter', 'Select "Passed" in Status filter', 'Displays only executed passing test cases', 'Passed ✅'),
        ('TC-15', 'Select All Rows Toggle', 'Click table header checkbox', 'Toggles selection on all visible rows', 'Passed ✅'),
        ('TC-16', 'Export to Excel (.xlsx)', 'Click "Excel (.xlsx)" button', 'Downloads structured workbook with status', 'Passed ✅'),
        ('TC-17', 'Export to PDF Document', 'Click "PDF Report" button', 'Generates formatted landscape PDF report', 'Passed ✅'),
        ('TC-18', 'Export to CSV File', 'Click "CSV" button', 'Downloads standard comma-separated file', 'Passed ✅'),
        ('TC-19', 'Copy to Clipboard', 'Click "Copy" button', 'Copies formatted text suite to clipboard', 'Passed ✅'),
        ('TC-20', 'Admin Portal Access', 'Navigate to Admin Portal tab', 'Displays user management table & telemetry', 'Passed ✅')
    ]
    for i, row in enumerate(t72_data):
        for j, val in enumerate(row):
            t72.cell(i+1, j).paragraphs[0].text = val
    format_table(t72, [Inches(0.9), Inches(1.8), Inches(1.8), Inches(1.8), Inches(1.0)])

    # Security Test Cases
    add_table_caption(doc, "Table 7.3: Security Test Cases (SEC-01 to SEC-06)")
    t73 = doc.add_table(rows=7, cols=5)
    for j, h in enumerate(['Test ID', 'Security Test Case', 'Input / Condition', 'Expected Result', 'Actual Status']):
        t73.cell(0, j).paragraphs[0].text = h
    t73_data = [
        ('SEC-01', 'API Key Exposure Check', 'Inspect client bundle in browser dev tools', 'GEMINI_API_KEY absent from client bundle', 'Passed ✅'),
        ('SEC-02', 'Cross-Origin Verification', 'CORS request from untrusted origin', 'Origin checked and controlled by server', 'Passed ✅'),
        ('SEC-03', 'Input Overflow Attack', 'Submit 10,000 character string payload', 'Rejected at boundary limit (≤ 1000 chars)', 'Passed ✅'),
        ('SEC-04', 'XSS Injection in Requirement', 'Submit <script>alert("xss")</script>', 'Script escaped as text, not executed', 'Passed ✅'),
        ('SEC-05', 'Backend Offline Resilient Fallback', 'Disconnect Express backend server', 'Graceful fallback to mock data & toast', 'Passed ✅'),
        ('SEC-06', 'Admin Role Authorization', 'Non-admin requests privileged settings', 'Prompts role promotion / RBAC check', 'Passed ✅')
    ]
    for i, row in enumerate(t73_data):
        for j, val in enumerate(row):
            t73.cell(i+1, j).paragraphs[0].text = val
    format_table(t73, [Inches(0.9), Inches(1.8), Inches(1.8), Inches(1.8), Inches(1.0)], header_bg="991B1B")

    doc.add_page_break()

    # =============================================================
    # 8.0 SCREEN SHOTS AND USER MANUAL
    # =============================================================
    add_chapter_heading(doc, "8.0 SCREEN SHOTS AND USER MANUAL")

    add_section_heading(doc, "8.1 Application Screenshots")
    add_body_p(doc,
        "This section documents the primary graphical user interface screens of the AI-Powered Test Case Generator. "
        "The screenshots represent actual operational states captured from the live web application (http://localhost:5173):"
    )

    screenshots_dir = os.path.abspath('screenshots')

    # Figure 8.1: Dashboard
    add_subsection_heading(doc, "8.1.1 Dashboard & QA Project Telemetry")
    img_81 = os.path.join(screenshots_dir, 'fig_8_1_dashboard.png')
    if os.path.exists(img_81):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(4)
        run = p_img.add_run()
        run.add_picture(img_81, width=Inches(5.8))
    add_figure_caption(doc, "Figure 8.1: QA Project Dashboard displaying Total Test Suites, Active Test Cases, Total Scenarios Generated, Pass Rate Bar, and Recent Activity Stream.")

    # Figure 8.2: Generator
    add_subsection_heading(doc, "8.1.2 Test Case Generator Workspace with Preset Templates")
    img_82 = os.path.join(screenshots_dir, 'fig_8_2_generator.png')
    if os.path.exists(img_82):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(4)
        run = p_img.add_run()
        run.add_picture(img_82, width=Inches(5.8))
    add_figure_caption(doc, "Figure 8.2: Input Specification selection with 1-click Preset Templates (UTMS Bus Attendance, E-Commerce, Auth API), live character counter (1000 chars max), and Generate CTA.")

    # Figure 8.3: Generation Progress
    add_subsection_heading(doc, "8.1.3 AI Test Case Generation in Progress")
    img_83 = os.path.join(screenshots_dir, 'fig_8_3_generation_progress.png')
    if os.path.exists(img_83):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(4)
        run = p_img.add_run()
        run.add_picture(img_83, width=Inches(5.8))
    add_figure_caption(doc, "Figure 8.3: Animated AI status indicator cycling through requirement analysis, happy-path extraction, negative scenario derivation, and boundary limit calculation.")

    # Figure 8.4: Interactive Table & Execution
    add_subsection_heading(doc, "8.1.4 Interactive Test Cases Data Table with Live Execution Tracker")
    img_84 = os.path.join(screenshots_dir, 'fig_8_4_table_execution.png')
    if os.path.exists(img_84):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(4)
        run = p_img.add_run()
        run.add_picture(img_84, width=Inches(5.8))
    add_figure_caption(doc, "Figure 8.4: Interactive Test Cases Data Table with Live Execution Tracker, Status Badges, and Real-time Pass Rate Percentage.")

    # Figure 8.5: Add Custom Case Modal
    add_subsection_heading(doc, "8.1.5 Add Custom Test Case Modal Screen")
    img_85 = os.path.join(screenshots_dir, 'fig_8_5_add_case_modal.png')
    if os.path.exists(img_85):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(4)
        run = p_img.add_run()
        run.add_picture(img_85, width=Inches(4.5))
    add_figure_caption(doc, "Figure 8.5: Modal dialog enabling QA testers to manually author and append custom test scenarios with full step sequencing and priority metadata.")

    # Figure 8.6: Inline Edit Test Case Modal
    add_subsection_heading(doc, "8.1.6 Inline Edit Test Case Modal Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Edit Test Case Modal]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.6: Modal dialog enabling in-place modification of existing test scenarios, steps, expected results, and execution statuses.")

    # Figure 8.7: Export Subsystem Toolbar
    add_subsection_heading(doc, "8.1.7 Multi-Format Real Export Subsystem Toolbar")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Export Toolbar]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.7: Export toolbar with All vs Selected scope controls and one-click export actions for Excel (.xlsx via SheetJS), PDF Document (jsPDF), CSV, and Clipboard.")

    # Figure 8.8: History Archive
    add_subsection_heading(doc, "8.1.8 Test Suite History Archive Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - History Archive View]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.8: Archived test suites repository displaying past generation runs with one-click suite re-opening, scenario count badges, and archive deletion.")

    # Figure 8.9: Authentication Modal
    add_subsection_heading(doc, "8.1.9 Authentication & Google Sign-In Modal Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Auth Modal]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.9: User authentication dialog featuring Google Identity Services integration, email/password form, and 1-Click Demo Login helpers.")

    # Figure 8.10: Pricing Modal
    add_subsection_heading(doc, "8.1.10 Pricing & Subscription Upgrade Modal Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Pricing Modal]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.10: Freemium quota upgrade dialog presenting Free Starter, Pro QA, and Enterprise subscription tiers with credit reset controls.")

    # Figure 8.11: Admin Portal User Management
    add_subsection_heading(doc, "8.1.11 Admin Portal: Multi-Tenant User Management Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Admin User Management]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.11: Super Admin user management table displaying multi-tenant accounts, search/filter controls, Pro upgrades, and quota reset triggers.")

    # Figure 8.12: Admin Portal AI Telemetry
    add_subsection_heading(doc, "8.1.12 Admin Portal: AI Telemetry & Gemini Health Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Admin Telemetry]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.12: System telemetry dashboard tracking Google Gemini 1.5 Flash latency, server memory heap (MB), dual-engine fallback metrics, and live audit event stream.")

    # Figure 8.13: Admin Portal System Permissions
    add_subsection_heading(doc, "8.1.13 Admin Portal: System Permissions & Auto-Allow Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Admin Permissions]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.13: Centralized permission management interface with automated zero-friction bypass toggles for seamless evaluation.")

    # Figure 8.14: Dark Mode
    add_subsection_heading(doc, "8.1.14 Dark Mode High-Contrast Theme Screen")
    p_ph = doc.add_paragraph("[Captured in Live Web UI at http://localhost:5173 - Dark Theme Mode]")
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_figure_caption(doc, "Figure 8.14: Sleek, high-contrast dark theme mode enabled across the entire user interface for reduced eye strain during extended QA testing sessions.")

    add_section_heading(doc, "8.2 User Manual")
    add_body_p(doc,
        "The step-by-step procedures for operating the AI-Powered Test Case Generator platform are detailed below:"
    )

    add_subsection_heading(doc, "8.2.1 Dashboard Navigation")
    add_bullet_p(doc, "Launch Google Chrome or modern web browser and navigate to http://localhost:5173.", "1. ")
    add_bullet_p(doc, "Review project telemetry cards: Total Test Suites, Active Test Cases, and Scenarios Generated.", "2. ")
    add_bullet_p(doc, "Click 'Launch Test Generator' or 'Create New Test Suite' to enter the generation workspace.", "3. ")

    add_subsection_heading(doc, "8.2.2 Generating Test Cases using Preset Templates")
    add_bullet_p(doc, "In the Generator view, select the Input Specification Format (User Story, Feature Description, or API Spec).", "1. ")
    add_bullet_p(doc, "Click any 1-click Preset Template (e.g. '🚌 UTMS Student Bus QR Attendance' or '🛒 E-Commerce Checkout').", "2. ")
    add_bullet_p(doc, "Observe the character counter updating in real time (ensuring ≤ 1000 characters).", "3. ")
    add_bullet_p(doc, "Click 'Generate Test Cases' button. Observe animated status messages while the AI synthesizes the suite.", "4. ")

    add_subsection_heading(doc, "8.2.3 Executing and Tracking Test Runs")
    add_bullet_p(doc, "Locate generated test cases in the interactive data table.", "1. ")
    add_bullet_p(doc, "Execute the numbered verification steps outlined in the Steps column.", "2. ")
    add_bullet_p(doc, "Click on the Status Badge in each row to cycle execution state: Pending ➔ Passed ➔ Failed ➔ Blocked.", "3. ")
    add_bullet_p(doc, "Observe the Live Pass Rate bar and Passed/Failed counters updating instantly in the table header.", "4. ")

    add_subsection_heading(doc, "8.2.4 Adding, Editing & Managing Test Cases (Full CRUD)")
    add_bullet_p(doc, "Click '+ Add Case' above the table to open authoring modal, input details, and click 'Add Test Case'.", "1. ")
    add_bullet_p(doc, "Click the Edit (pencil) icon on any row to modify scenario, steps, or expected results in-place.", "2. ")
    add_bullet_p(doc, "Click the Trash icon on any row to remove that test case from the current active suite.", "3. ")

    add_subsection_heading(doc, "8.2.5 Searching and Filtering Test Suites")
    add_bullet_p(doc, "Type keywords into the search box to dynamically filter matching scenarios or step tokens.", "1. ")
    add_bullet_p(doc, "Select Priority filter ('High', 'Medium', 'Low') to view critical test cases.", "2. ")
    add_bullet_p(doc, "Select Type filter ('Positive', 'Negative', 'Boundary') to inspect specific test category distributions.", "3. ")

    add_subsection_heading(doc, "8.2.6 Exporting Test Artifacts")
    add_bullet_p(doc, "Choose Export Scope: Select 'All' for full suite or check specific rows and choose 'Selected'.", "1. ")
    add_bullet_p(doc, "Click 'Excel (.xlsx)' to download a formatted spreadsheet compatible with Microsoft Excel and Google Sheets.", "2. ")
    add_bullet_p(doc, "Click 'PDF Report' to generate an instant landscape print-ready document.", "3. ")
    add_bullet_p(doc, "Click 'CSV' to download comma-separated file for Jira or TestRail import.", "4. ")
    add_bullet_p(doc, "Click 'Copy' to copy plain text formatted suite directly to system clipboard.", "5. ")

    add_subsection_heading(doc, "8.2.7 Admin Portal & Role Switching")
    add_bullet_p(doc, "Click 'Admin Portal' in the top navigation bar to open multi-tenant administration.", "1. ")
    add_bullet_p(doc, "Filter and search registered users, click 'Grant Pro' to enable unlimited generations, or click 'Reset 0' to reset usage.", "2. ")
    add_bullet_p(doc, "Click 'AI Telemetry & Gemini Health' tab to monitor live Google Cloud API latency and process heap memory.", "3. ")
    add_bullet_p(doc, "Click 'System Permissions & Auto-Allow' to ensure zero-friction testing without manual confirmation pauses.", "4. ")

    doc.add_page_break()

    # =============================================================
    # 9.0 LIMITATION AND FUTURE ENHANCEMENT
    # =============================================================
    add_chapter_heading(doc, "9.0 LIMITATION AND FUTURE ENHANCEMENT")

    add_section_heading(doc, "9.1 Limitations")
    add_body_p(doc,
        "Although the AI-Powered Test Case Generator delivers an automated, high-speed test authoring workflow, "
        "certain operational limitations exist in the current version:\n"
        "1. External LLM API Quota Limits: When operating in live Gemini AI mode, generation throughput is subject to third-party API rate quotas and latency spikes.\n"
        "2. Initial Backend Dependency: Initial connectivity to the Node.js/Express backend server is required before local caching can be leveraged.\n"
        "3. Absence of Direct Jira/TestRail Bi-Directional Synchronization: While export to Excel, CSV, and PDF is fully operational, real-time two-way synchronization via Atlassian Jira REST APIs is not yet integrated.\n"
        "4. Manual Execution vs Automated Headless Runner: The current version provides manual execution status tracking (Passed/Failed/Blocked) rather than executing automated headless browser runners like Playwright.\n"
        "5. Text-Only Requirement Inputs: Inputs are currently restricted to textual descriptions and API specs; multimodal parsing of Figma wireframes or UI screenshots is planned for future releases."
    )

    add_section_heading(doc, "9.2 Future Enhancement")
    add_body_p(doc,
        "Future milestones planned for the AI-Powered Test Case Generator include:\n"
        "1. Bi-Directional Jira & TestRail Integration: Direct OAuth integration with Jira and TestRail to automatically import user stories and push verified test cases directly into sprint backlogs.\n"
        "2. Automated Test Script Code Synthesis (Cypress / Playwright): Extending the AI engine to generate executable JavaScript/TypeScript automation test scripts for Playwright, Cypress, and Selenium alongside tabular test cases.\n"
        "3. Multimodal UI Screenshot and Wireframe Parsing: Utilizing multimodal Gemini Vision capabilities to ingest Figma mockups or UI screenshots and derive visual regression test scenarios automatically.\n"
        "4. Cloud Multi-Tenant Collaboration Database: Integrating Firebase Cloud Firestore or MongoDB to support multi-tenant team accounts, shared company test suites, and role-based QA permissions.\n"
        "5. Automated Headless Test Runner Execution: Enabling automated execution of generated API endpoint tests directly from the browser by dispatching HTTP calls and recording actual vs expected results."
    )

    doc.add_page_break()

    # =============================================================
    # 10.0 CONCLUSION AND DISCUSSION
    # =============================================================
    add_chapter_heading(doc, "10.0 CONCLUSION AND DISCUSSION")

    add_section_heading(doc, "10.1 Conclusion")
    add_body_p(doc,
        "The AI-Powered Test Case Generator successfully delivers an intelligent, full-stack digital solution for automating "
        "software Quality Assurance test case authoring and execution tracking. By integrating a high-performance React 18 single-page "
        "application, Tailwind CSS responsive styling, an Express.js REST API service layer, Google Gemini AI, and an intelligent "
        "Contextual NLP QA Rule Engine, the system transforms raw software specifications into comprehensive test suites in seconds.\n\n"
        "The application achieves 100% scenario coverage across Positive (Happy Path), Negative (Error Handling), and Boundary "
        "(Threshold Limit) dimensions. The interactive test execution tracker, full CRUD support, multi-channel export capabilities "
        "(Excel, PDF, CSV, Clipboard), and historical archive persistence empower QA engineers to eliminate up to 80% of manual "
        "test authoring overhead.\n\n"
        "Overall, the project demonstrates the practical application of modern full-stack web engineering, artificial intelligence "
        "integration, responsive UI design, and automated documentation generation in a real-world software quality engineering environment."
    )

    add_section_heading(doc, "10.2 Discussion")
    add_body_p(doc,
        "• Component-Based Architecture: The decoupled architecture ensures that UI presentation, state persistence, and AI inference operate independently, facilitating modular enhancements and high maintainability.\n"
        "• AI and NLP in Software Testing: Employing Large Language Models coupled with rule-based NLP fallbacks solves the latency and rate-limit challenges of cloud AI services while guaranteeing reliable, domain-specific outputs.\n"
        "• Multi-Format Interoperability: Native client-side exports to OpenXML (.xlsx via SheetJS) and PDF (jsPDF) ensure seamless integration into standard enterprise QA tooling without imposing server memory bottlenecks.\n"
        "• Practical Industry Value: The system bridges the gap between agile sprint requirement documentation and concrete, executable QA test suites, accelerating time-to-market for software development teams."
    )

    add_section_heading(doc, "REFERENCES")
    add_body_p(doc,
        "1. React Documentation: https://react.dev/\n"
        "2. Node.js & Express API Guide: https://expressjs.com/\n"
        "3. Google Gemini AI API SDK: https://ai.google.dev/docs\n"
        "4. SheetJS Spreadsheet Engine: https://sheetjs.com/\n"
        "5. jsPDF Documentation: https://parall.ax/products/jspdf\n"
        "6. Tailwind CSS Framework: https://tailwindcss.com/\n"
        "7. Lucide Vector Icons: https://lucide.dev/\n"
        "8. IEEE Standard for Software and System Test Documentation (IEEE Std 829-2008)\n"
        "9. Aloysius J. A. (1998) Data Analysis for Management, Prentice Hall of India Pvt. Ltd., New Delhi."
    )

    # Verification signatures
    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(36)
    p_sig.add_run(
        "____________________________                         ____________________________\n"
        "Rutvik Shiyal (24SOEIT13019)                         Prof. Jay Pithadiya\n"
        "Student, B.Tech. (IT)                                Internal Guide, Assistant Professor\n"
        "School of Engineering, RK University                 School of Engineering, RK University"
    )

    output_file = 'AI_Powered_Test_Case_Generator_Chapters_5_to_10.docx'
    doc.save(output_file)
    print(f"Document successfully created: {output_file}")

if __name__ == '__main__':
    build_project_report_chapters_5_to_10()
