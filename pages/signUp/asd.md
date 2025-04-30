## Option 1: Using Test Title with --grep 
 
### Run a specific test by exact name in headless mode
* npm run test:smoke -- --grep "Validate Login"

### Run the same test in headed mode
* npm run test:smoke:headed -- --grep "Validate Login"

### Debug a specific test
* npm run test:smoke:ui -- --grep "Validate Login"
* npm run test:single:debug -- --grep "Validate Login"


## Option 2: Using File Path with Line Number

### Run a specific test by file path and line number in headless mode
* npm run test:single -- tests/UI/smoke/desktop/login.spec.ts:30

### Run in headed mode
* npm run test:single:headed -- tests/UI/smoke/desktop/login.spec.ts:30

### Debug mode
* npm run test:single:ui -- tests/UI/smoke/desktop/login.spec.ts:30
* npm run test:single:debug -- tests/UI/smoke/desktop/login.spec.ts:30

## Option 3: Using test.only() (Temporary Code Change)
Temporarily modify your test file to mark only the test you want to run:

````Typescript
// Change this
test("Validate Login", async ({ loginPage, headerMenuDesktop, page }) => {
  // Test code
});

// To this 
test.only("Validate Login", async ({ loginPage, headerMenuDesktop, page }) => {
  // Test code
});
````
Then run:
````
# Run just the test marked with .only in headless mode
npm run test -- --project=desktop.1440

# Run in headed mode
npm run test -- --project=desktop.1440 --headed

# Debug mode
npm run test -- --project=desktop.1440 --debug