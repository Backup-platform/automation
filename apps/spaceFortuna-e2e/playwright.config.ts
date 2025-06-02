import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * require('dotenv').config();
 */

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
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	workers: 3,
	reporter: 'html',

	use: {
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',

		httpCredentials: {
			username: 'spacefortuna',
			password: 'MWLysVEpcY8Qez5t'
		},
	},

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
				storageState: path.resolve(__dirname,'playwright/.auth/user.json'),
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
				storageState: path.resolve(__dirname, 'playwright/.auth/mobileUser.json'),
			},
			dependencies: ['setupMobile'],
		}		
		// {
		// 	name: 'screenshots',
		// 	testMatch: '**/*screenshots.spec.ts',
		// 	use: {
		// 		...devices['Desktop Chrome'],
		// 		viewport: { width: 1320, height: 720 },
		// 	},
		// }

	]
});
