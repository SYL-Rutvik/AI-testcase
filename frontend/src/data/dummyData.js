/**
 * Dummy Test Case Data
 * 
 * Used for initial frontend rendering and fallback in case backend is unavailable.
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
    type: "Positive"
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
    type: "Negative"
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
    type: "Boundary"
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
    type: "Positive"
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
