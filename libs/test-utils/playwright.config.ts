import { defineConfig, devices } from '@playwright/test';

/**
 * Test-Utils Helper Validation Configuration
 * Optimized for testing utility functions with minimal setup
 */
export default defineConfig({
	testDir: './src/validation-tests',
	testMatch: '*.spec.ts',
	expect: {
		timeout: 3 * 1000, // 3 seconds for assertions
	},
	timeout: 180 * 1000, // 3 minutes for the entire test
	use: {
		baseURL: 'http://localhost:3000',
		screenshot: 'off',
		actionTimeout: 10 * 1000,
		// Use chromium for helper validation
		...devices['Desktop Chrome'],
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	workers: 4, // More workers for parallel execution
	retries: 0,
	reporter: [
		['list'], // Console output for real-time feedback
		['html', { outputFolder: '../../playwright-report' }], // HTML report in shared folder
		['junit', { outputFile: '../../test-results/helper-validation-results.xml' }] // JUnit for CI/CD
	],
});
