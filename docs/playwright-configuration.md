# Playwright Configuration

Each Nx project has its own `playwright.config.ts` for different testing needs:

```
apps/
  grandzbet-e2e/      # UI E2E tests with multiple viewports
  spaceFortuna-e2e/   # UI E2E tests 
  aleaAPI/            # API testing (no browser)
libs/
  test-utils/         # Helper validation tests
```

This allows project-specific optimization while sharing common patterns.

## UI Tests Configuration

E2E projects test multiple browsers and viewports:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,
  retries: 2,
  testDir: './tests',
  outputDir: 'test-results',
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://staging.grandzbet.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/desktop/**/*.spec.ts',
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
      testMatch: '**/mobile/**/*.spec.ts',
    },
  ],
});
```

## API Tests Configuration

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 15 * 1000,
  retries: 3,
  testDir: './tests',

  use: {
    baseURL: 'https://api.alea.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.spec.ts',
    },
  ],
});
```

## Environment & Override Patterns

Override settings with environment variables:

```typescript
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://staging.example.com',
    headless: process.env.HEADED !== 'true',
    trace: process.env.TRACE === 'on' ? 'on' : 'on-first-retry',
  },
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,
});
```

Authentication setup for shared login state:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'auth.setup',
      testMatch: '**/auth.*.setup.ts',
    },
    {
      name: 'authenticated-tests',
      use: { storageState: 'playwright/.auth/user.json' },
      dependencies: ['auth.setup'],
    },
  ],
});
```

## Running Tests

Use Nx commands with environment overrides:

```bash
# Run specific projects
nx run grandzbet-e2e:test
nx run aleaAPI:test

# Override environment
BASE_URL=https://production.com nx run grandzbet-e2e:test
HEADED=true nx run spaceFortuna-e2e:test
```

Each project's config is optimized for its test type while sharing common patterns through the Nx monorepo structure.
