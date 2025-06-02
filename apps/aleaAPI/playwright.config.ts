import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000', // Change as needed
    trace: 'on-first-retry',
    // Add API-specific Playwright config here
  },
  projects: [
    {
      name: 'API tests',
      testMatch: ['aleaTransactions.spec.ts', 'balance.spec.ts'],
      use: {
        baseURL: 'https://games.dev.inovadatabv.com/alea/',
      },
    },
  ],
});
