# Playwright Configuration – Structure & Best Practices

You’ve likely seen the `playwright.config.ts` file — but what exactly goes into it, and why? In this document, we'll 
explore how Playwright configuration works, what's available to customize, and how to set up clean, scalable configs 
for real-world test automation.

---

## Config Without Customization

A minimal Playwright config might look like this:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
  },
});
```

This will:
* Run tests using Chromium in headless mode,
* Set a default base URL for your `page.goto()` calls,
* Apply the same config to every test file.

While this works for simple projects, as your test suite grows, you may need more customization.

---

## The perspective

Default configs are fine for small test sets, but they fall short when you want to:

* Customize behavior for different test types (e.g. API vs UI),
* Use multiple browsers/devices/environments,
* Share state across test sessions (like login tokens),
* Collect detailed artifacts (screenshots, traces),
* Make your suite parallel and reusable.

That’s where deeper configuration comes in.
Playwright lets you extend the config in many ways — here's how.

---

### 1. Global Test Settings

Configure the test runner itself with these:

```typescript
export default defineConfig({
  timeout: 30 * 1000, // Per-test timeout
  retries: 2,         // Retry failed tests
  reporter: 'html',   // Use HTML reporter
});
```

You can also specify `testDir`, `testIgnore`, `outputDir`, and `expect` settings globally.

---

### 2. Context Settings via `use`

These are passed to every browser context (unless overridden by a project):

```typescript
export default defineConfig({
    timeout: 30 * 1000,
    retries: 2,
    reporter: 'html',
    use: {
        baseURL: 'https://app.example.com',
        headless: false,
        viewport: { width: 1280, height: 720 },
        trace: 'on-first-retry',
        video: 'retain-on-failure',
    }
});
```

This is your go-to section for tuning how tests behave on launch.

---

### 3. Test Matching and File Filtering

Create inclusion / exclusion filters and cluster them in projects:

```typescript
export default defineConfig({
    timeout: 30 * 1000,
    retries: 2,
    reporter: 'html',
    use: {
        baseURL: 'https://app.example.com',
        headless: false,
        viewport: { width: 1280, height: 720 },
        trace: 'on-first-retry',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'some-tests',
            testMatch: /.*\.e2e\.spec\.ts/,
            testIgnore: '**/legacy-tests/**',
        }
    ]
});

```

Useful for organizing large codebases or CI pipelines.

---

### 4. Environment Variables and Setup

Use Playwright's `globalSetup` and `globalTeardown` to prepare your environment:

```typescript
export default defineConfig({
  globalSetup: require.resolve('./setup/globalSetup.ts'),
  globalTeardown: require.resolve('./setup/globalTeardown.ts'),
});
```

You can also use `.env` files and Node's `process.env` to inject secrets or environment-specific flags.

---

### 5. Storage State (Authentication Reuse)

Store and reuse login state:

```typescript
use: {
  storageState: 'playwright/.auth/user.json'
}
```

To generate it:

```ts
// auth.desktop.setup.ts
await page.context().storageState({ path: authFile });
```

This is key for skipping login steps in every test.

---

### 6. Artifacts: Screenshots, Traces, Videos

You can configure Playwright to capture artifacts automatically:

```typescript
use: {
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  video: 'retain-on-failure',
}
```

These are saved in the `outputDir` for easy debugging and reporting.

---

### 7. Example: Complete Config

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,
  retries: 2,
  testDir: './tests',
  outputDir: 'test-results',
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://staging.example.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    storageState: 'auth/state.json'
  },

  globalSetup: require.resolve('./setup/globalSetup.ts'),
});
```

---

## Conclusion

The Playwright config file is a powerful tool to:

* Set sensible defaults for test execution and context,
* Enable logging, tracing, and retries,
* Simplify login by reusing stored auth state,
* Customize per project, per environment, or per test type.

---

## For more indepth overview you can visit 
* https://playwright.dev/docs/test-configuration
* https://playwright.dev/docs/test-projects 
