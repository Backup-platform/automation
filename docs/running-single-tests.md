# Running Single Tests in Playwright

This guide explains different ways to run individual tests in your Playwright automation framework.

## Basic Approaches

### Option 1: Using Test Title with `--grep`

```bash
# Run a specific test by exact name in headless mode
npx playwright test --grep "Validate Login"

# Run the same test in headed mode
npx playwright test --headed --grep "Validate Login"

# Debug a specific test
npx playwright test --debug --grep "Validate Login"

```

### Option 2: Using File Path with Line Number

```bash
# Run a specific test by file path and line number in headless mode
npx playwright test tests/UI/smoke/desktop/login.spec.ts:30

# Run in headed mode
npx playwright test --headed tests/UI/smoke/desktop/login.spec.ts:30

# Debug mode
npx playwright test --debug tests/UI/smoke/desktop/login.spec.ts:30
```

### Option 3: Using `test.only()` (Temporary Code Change)

Temporarily modify your test file to mark only the test you want to run:

```typescript
// Change this
test("Validate Login", async ({ loginPage, headerMenuDesktop, page }) => {
  // Test code
});

// To this 
test.only("Validate Login", async ({ loginPage, headerMenuDesktop, page }) => {
  // Test code
});
```

Then run:

```bash
# Run just the test marked with .only in headless mode
npx playwright test --project=desktop.1440

# Run in headed mode
npx playwright test --headed --project=desktop.1440

# Debug mode
npx playwright test --debug --project=desktop.1440
```

### Option 4: Using Playwright UI Mode (Easiest for Debugging)

```bash
# Open the test explorer UI where you can select and run individual tests
npx playwright test --ui
```

## Handling Duplicate Test Names

When multiple tests have the same name across different spec files, you can use these approaches:

### 1. Combine File Path with Test Name

```bash
# Run a specific test by file path AND test name
npx playwright test "tests/UI/smoke/desktop/login.spec.ts" --grep "Validate Login"

# In headed mode
npx playwright test --headed "tests/UI/smoke/desktop/login.spec.ts" --grep "Validate Login"
```

### 2. Use More Specific Grep Pattern

If your tests are in describe blocks with unique names:

```bash
# Use a more specific pattern that includes the describe block name
npx playwright test --grep "Login Page Smoke Tests.*Validate Login"
```

### 3. Use Project Filter with Grep

If the duplicate tests are in different projects:

```bash
# Run the test only in the desktop project
npx playwright test --project=desktop.1440 --grep "Validate Login"
```

### 4. Using Line Numbers (Most Precise)

```bash
# Run a specific test using the line number where it's defined
npx playwright test tests/UI/smoke/desktop/login.spec.ts:21
```

## Tips for Efficient Testing

- Use the UI mode for easy test selection and debugging
- Combine approaches when needed (e.g., project + grep)
- Remember to remove `test.only()` before committing code
- Consider using a consistent naming convention for tests to avoid duplicates
