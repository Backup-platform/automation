# Playwright Projects – Motivation & Advanced Features

You may have seen a projects section in a playwright.config.ts file and wondered — why define multiple projects? 
What are we achieving here? In this document, we'll explore the motivation behind using projects in Playwright and how 
to leverage their full potential. How the codebase looks without projects

## Config without projects

A basic Playwright configuration without projects might look like this:

```typescript 
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
  },
});
```
This setup is fine if you're running a simple test suite in a single browser/environment. But what if you want to:

* Run tests across multiple browsers?
* Test on different devices?
* Separate frontend and API test directories?
* Include pre-setup steps or global state?

You’d end up duplicating configs or writing complex logic in the tests themselves — not ideal.

## The problem

Here are some challenges of not using projects:
* No clear separation between different test types or targets.
* Hard to run specific subsets of tests with unique settings.
* Difficult to scale to multi-browser/device testing.
* Setup steps are not reusable across environments.
* You can't parallelize in a clean, structured way.

## The solution: projects

Playwright projects solve this by allowing you to define isolated configurations for different testing scenarios.

### 1. Run tests across multiple browsers or devices

```Typescript
projects: [
  { name: 'Chromium', use: { browserName: 'chromium' } },
  { name: 'Firefox', use: { browserName: 'firefox' } },
  { name: 'WebKit', use: { browserName: 'webkit' } },
]
```
This will run your tests in parallel across all three browsers with just one command.

### 2. Target specific test directories

You can isolate tests by folder:
```Typescript
projects: [
  {
    name: 'UI Tests',
    testDir: './tests/ui',
  },
  {
    name: 'API Tests',
    testDir: './tests/api',
  }
]
```
Useful when you have large test suites split by type.

### 3. Filter tests with testMatch

Want to run only Desktop tests or mobile ones?

```Typescript
projects: [
  {
    name: 'Desktop Tests',
    testMatch: /.*\.desktop\.spec\.ts/,
  }
]
```

This project includes only the test files, matching the defined file-name pattern.

### 4. Use per-project configuration overrides

You can override any use option per project:
```Typescript
{
  name: 'Mobile Safari',
  use: {
    ...devices['iPhone 12'],
    baseURL: 'https://mobile.example.com'
  }
}
```
These settings let you simulate specific devices while testing.

### 5 Setup dependencies 

Sometimes one project needs to run before others — for example, to create an authenticated state:

```Typescript
{ 
	name: 'setupDesk', 
	testMatch: '**/*.desktop.setup.ts', 
},
{ 
	name: 'setupMobile', 
	testMatch: '**/*.mobile.setup.ts', 
},
{
	name: 'desktop',
	use: {
		...devices['Desktop Chrome'],
		storageState: 'playwright/.auth/user.json',
	},
	dependencies: ['setupDesk'],
},
{
	name: 'mobile',
	use: {
		...devices['iPad Mini landscape'], 
		storageState: 'playwright/.auth/mobileUser.json', 
	},
	dependencies: ['setupMobile'],
}
```

In this example, the setup project authenticates and stores the credentials in a specific file. Afterwards, 
the other test projects use that file to create a initialize a state, which they subsequently use for the tests they include.

### 6 Example: Putting It All Together

```Typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,
  retries: 1,

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'Chrome Desktop',
      dependencies: ['setup'],
      testDir: './tests/ui',
      use: {
        browserName: 'chromium',
        baseURL: 'https://staging.example.com',
        storageState: 'auth.json'
      }
    },
    {
      name: 'iPhone Tests',
      use: {
        ...devices['iPhone 13'],
        baseURL: 'https://m.example.com',
      }
    },
    {
      name: 'Smoke Tests',
      testMatch: /.*\.smoke\.spec\.ts/,
    }
  ]
});

```

This config:
* Runs a login/setup once,
* Runs UI tests with stored state,
* Runs mobile tests with iPhone settings,
* Filters smoke tests when needed.

## Conclusion

Playwright projects are a powerful way to modularize and scale your test strategy:
* Projects help you organize, parallelize, and reuse test functionality.
* They cleanly separate environments, browsers, and test types.
* You can filter, override, and reuse settings without polluting your test files.

Use projects to make your test setup scalable, maintainable, and dev-friendly — especially as your codebase grows.

## For more indepth overview you can visit 
* https://playwright.dev/docs/test-configuration
* https://playwright.dev/docs/test-projects 