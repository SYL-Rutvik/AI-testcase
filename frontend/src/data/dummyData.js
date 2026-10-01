/**
 * Dummy Test Case Data and Requirement Presets
 * 
 * Used for initial frontend rendering, preset templates, and fallback data.
 */
export const INITIAL_TEST_CASES = [
  {
    id: "TC001",
    scenario: "Verify successful user login with valid credentials",
    steps: [
      "1. Navigate to the login page",
      "2. Enter registered email address",
      "3. Enter valid password",
      "4. Click on 'Sign In' button"
    ],
    testData: "Email: user@example.com, Password: Password123!",
    expectedResult: "User is successfully authenticated and redirected to the main dashboard with a welcome banner.",
    priority: "High",
    type: "Positive",
    status: "Passed"
  },
  {
    id: "TC002",
    scenario: "Verify login attempt with an invalid password",
    steps: [
      "1. Navigate to the login page",
      "2. Enter valid email address",
      "3. Enter incorrect password",
      "4. Click on 'Sign In' button"
    ],
    testData: "Email: user@example.com, Password: WrongPassword!",
    expectedResult: "System displays error message 'Invalid email or password' and remains on login page.",
    priority: "High",
    type: "Negative",
    status: "Passed"
  },
  {
    id: "TC003",
    scenario: "Verify email input field maximum character limit validation",
    steps: [
      "1. Navigate to the login page",
      "2. Paste a 256-character string into the Email field",
      "3. Tab out of the field or attempt submission"
    ],
    testData: "Email string of 256 characters (a...a@domain.com)",
    expectedResult: "Field prevents input beyond 255 characters or shows validation error 'Email cannot exceed 255 characters'.",
    priority: "Medium",
    type: "Boundary",
    status: "Pending"
  },
  {
    id: "TC004",
    scenario: "Verify 'Forgot Password' link navigates to password recovery page",
    steps: [
      "1. Navigate to the login page",
      "2. Locate and click on the 'Forgot Password?' hyperlink"
    ],
    testData: "N/A",
    expectedResult: "User is redirected to /reset-password URL and recovery form is visible.",
    priority: "Low",
    type: "Positive",
    status: "Pending"
  }
];

export const MOCK_USER_STORY = `As a registered user,
I want to log in to my account using my email and password,
So that I can securely access my personalized dashboard and manage my account settings.

Acceptance Criteria:
1. User can enter valid credentials and log in.
2. Error message is displayed for incorrect credentials.
3. Email field validates character length limits.
4. "Forgot Password" link directs to the password reset workflow.`;

export const PRESET_REQUIREMENTS = [
  {
    id: "preset-utms-qr",
    title: "UTMS Student Bus QR Attendance",
    badge: "🚌 Transport / UTMS",
    inputType: "User Story",
    description: `As a registered student,
I want to scan the official QR code displayed on my university bus using my mobile camera viewfinder,
So that my transit attendance is authenticated and saved to the Firestore cloud database in real time.

Acceptance Criteria:
1. Valid QR scan captures student ID, bus ID, timestamp, and marks attendance as Present.
2. Invalid or expired QR code payload displays an error alert.
3. Prevent duplicate attendance scans on the same route on the same date.
4. Cross-tenant access: Students cannot mark attendance on buses from another university.`
  },
  {
    id: "preset-ecommerce",
    title: "E-Commerce Checkout & Discount",
    badge: "🛒 E-Commerce",
    inputType: "Feature Description",
    description: `Feature: Shopping Cart Promotional Discount Engine.
When a customer adds items exceeding $100.00 subtotal and enters coupon code 'SAVE10',
the application must apply an automatic 10% discount deduction before tax calculation.

Rules:
- Order subtotal must be greater than or equal to $100.00.
- Expired promo codes must show error 'Coupon expired'.
- Max discount cannot exceed $50.00 per transaction.
- Only one promo code can be applied per order.`
  },
  {
    id: "preset-api-auth",
    title: "POST /api/v1/auth/login",
    badge: "🔐 API Spec",
    inputType: "API Endpoint Spec",
    description: `POST /api/v1/auth/login
Request Headers: Content-Type: application/json
Request Body:
{
  "email": "user@university.edu",
  "password": "SecurePassword123"
}

Expected Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "uid": "usr_991", "role": "student", "universityId": "RKU" },
  "expiresIn": 86400
}

Error Conditions:
- 400 Bad Request if email format is invalid.
- 401 Unauthorized if password does not match.
- 429 Too Many Requests if rate limit (5 attempts/min) is exceeded.`
  },
  {
    id: "preset-route-management",
    title: "University Bus Route & Stop Assignment",
    badge: "🚏 Transit Admin",
    inputType: "Feature Description",
    description: `Feature: University Admin Bus Stop Allocation.
University Admins can define transit routes with sequenced pickup stops, landmarks, and departure timetables.

Requirements:
- Each route must have a unique Route ID, start terminal, and campus destination.
- Admin can reorder stops with drag-and-drop or sortOrder index.
- Total stops per bus route cannot exceed 25 stops.
- System must validate that arrival time at stop N is earlier than arrival time at stop N+1.`
  }
];
