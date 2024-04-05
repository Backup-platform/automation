import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * require('dotenv').config();
 */
require('dotenv').config();

//export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	expect: {
		timeout: 10 * 1000,
	},
	timeout: 40 * 1000,
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: 4, //process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	//reporter: 'html',
	reporter: 'allure-playwright',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',

		httpCredentials: {
			username: 'spacefortuna',
			password: 'MWLysVEpcY8Qez5t'
		},
	},

	/* Configure projects for major browsers */
	projects: [

		{ 
			name: 'setupDesk', 
			testMatch: '**/*.desktop.setup.ts', 
		},
		{ 
			name: 'setupMobile', 
			testMatch: '**/*.mobile.setup.ts', 
		},
		{
			name: 'promotions.desktop.1440',
			testMatch: '**/*promotions/desktop.*',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'playwright/.auth/user.json',
				viewport: { width: 1440, height: 1024 },
			},
			dependencies: ['setupDesk'],
		},
		{
			name: 'promotions.mobile.1024.chrome',
			testMatch: '**/*promotions/desktop.*',
			use: {
				...devices['iPad Mini landscape'], //width: 1024, height: 768
				browserName: 'chromium',
				storageState: 'playwright/.auth/user.json', 
			},
			dependencies: ['setupMobile'],
		},
		{
			name: 'promotions.mobile.375.chrome',
			testMatch: '**/*promotions/mobile.*',
			use: {
				...devices['iPhone 11 Pro'],
				browserName: 'chromium',
				storageState: 'playwright/.auth/mobileUser.json', //width: 375 height:812
			},
			dependencies: ['setupMobile'],
		},
		{
			name: 'promotions.mobile.1024.safari',
			testMatch: '**/*promotions/desktop.*',
			use: {
				...devices['iPad Mini landscape'], //width: 1024, height: 768
				storageState: 'playwright/.auth/user.json', 
			},
			dependencies: ['setupMobile'],
		},
		{
			name: 'promotions.mobile.375.safari',
			testMatch: '**/*promotions/mobile.*',
			use: {
				...devices['iPhone 11 Pro'],
				storageState: 'playwright/.auth/mobileUser.json', //width: 375 height:812
			},
			dependencies: ['setupMobile'],
		},
		
		{
			name: 'chromium',
			testMatch: '**/*desktop/*',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'playwright/.auth/user.json',
				viewport: { width: 1320, height: 720 },
			},
			dependencies: ['setupDesk'],
		},
		{
			name: 'firefox',
			testMatch: '**/*desktop/*',
			use: {
				...devices['Desktop Firefox'],
				storageState: 'playwright/.auth/user.json',
				viewport: { width: 1320, height: 720 },
			},
			dependencies: ['setupDesk'],
		},
		{
			name: 'screenshots',
			testMatch: '**/*screenshots.spec.ts',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1320, height: 720 },
			},
		},
		{
		  name: 'mobiGameTest',
		  testMatch: '**/*gameIframe.spec.ts',
		  use: {
		    ...devices['Pixel 7'],
		    storageState: 'playwright/.auth/mobileUser.json',
		  },
		  dependencies: ['setupMobile'],
		  //testIgnore: '**/*login.mobile.spec.ts',
		},
		{
			name: 'Pixel7',
			testMatch: '**/*mobile.spec.ts',
			use: {
				...devices['Pixel 7'],
				storageState: 'playwright/.auth/mobileUser.json',
			},
			dependencies: ['setupMobile'],
		},
		{
			name: 'iPhone14Pro',
			testMatch: '**/*mobile.spec.ts',
			use: {
				...devices['iPhone 14 Pro'],
				storageState: 'playwright/.auth/mobileUser.json',
			},
			dependencies: ['setupMobile'],
			testIgnore: '**/*login.mobile.spec.ts',
		},
		{
			name: 'api',
			testMatch: '**/*api.spec.ts',
			use: {
				...devices['Desktop Chrome'],
			},

		},
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
