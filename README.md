# Testing-Website



# 🧪 S4E Security Tools — Playwright Test Suite

This project automates functional testing of the [S4E Free Security Tools page](https://s4e.io/free-security-tools) using [Playwright](https://playwright.dev).

---

## 📦 Setup Instructions

1. Make sure you have [Node.js](https://nodejs.org) installed.
2. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <project-directory>

	3.	Install dependencies:

npm install


	4.	Install Playwright browsers:

npx playwright install



⸻

▶️ Running the Tests

To run all tests:

npx playwright test

To run a specific test file:

npx playwright test tests/searchtests.spec.ts

To run only one test (with name filtering):

npx playwright test -g "Valid IP input prevents popup"


⸻

🧪 Test Cases Covered

✅ IP Input Area

Test Case	Description
✅ Valid input prevents popup	8.8.8.8, s4e.io, etc.
❌ Invalid input triggers popup	alert(), !@#$, etc.
❌ Empty input triggers popup	No entry, just button press

🔍 Coming soon…
	•	Search/filter tests
	•	API response validation

⸻

📁 Folder Structure

tests/
├── example.spec.ts          # Sample test
├── searchtests.spec.ts      # Search & scan input tests
├── apitests.spec.ts         # (optional) future API tests


⸻

📝 Notes
	•	Tests use strict mode — Playwright will warn if selectors are ambiguous.
	•	Modal detection is done by checking modal text content.
	•	Targeting uses section:has-text(...) or .first() for stability.
