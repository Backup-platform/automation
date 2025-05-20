import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * require('dotenv').config();
 */
require('dotenv').config();

/**
 * TODO: solution to require password and secret dinamically when you run the script for the tests.
 * When enabled it should be ran with the following command:
 * MY_USER=your_username MY_SECRET=your_password npx playwright test 

	const username = process.env.MY_USER;
	const password = process.env.MY_SECRET;

	if (!username || !password) {
	throw new Error("Missing required environment variables.");
	}
*/
//export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	expect: {
		timeout: 15 * 1000,
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
	workers: 3, //process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	//reporter: 'allure-playwright',
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
			name: 'desktop.1440',
			testMatch: '**/*desktop/*',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'playwright/.auth/user.json',
				viewport: { width: 1440, height: 1024 },
			},
			dependencies: ['setupDesk'],
		},
		// {
		// 	name: 'mobile.1024.chrome',
		// 	testMatch: '**/*mobile/*',
		// 	use: {
		// 		...devices['iPad Mini landscape'], //width: 1024, height: 768
		// 		browserName: 'chromium',
		// 		storageState: 'playwright/.auth/mobileUser.json', 
		// 	},
		// 	dependencies: ['setupMobile'],
		// },
		{
			name: 'mobile.375.chrome',
			testMatch: '**/*mobile/*',
			use: {
				...devices['iPhone 12 Pro'],
				browserName: 'chromium',
				storageState: 'playwright/.auth/mobileUser.json', //width: 375 height:812
			},
			dependencies: ['setupMobile'],
		},
		{
			name: 'API tests',
			testMatch: ['aleaTransactions.spec.ts', 'balance.spec.ts'],
			use: {
				baseURL: 'https://games.dev.inovadatabv.com/alea/',
			}
		}
		
		// {
		// 	name: 'screenshots',
		// 	testMatch: '**/*screenshots.spec.ts',
		// 	use: {
		// 		...devices['Desktop Chrome'],
		// 		viewport: { width: 1320, height: 720 },
		// 	},
		// }

	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
