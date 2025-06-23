import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

/**
 * Base configuration factory for API testing apps
 * Optimized for API endpoints, no browser UI concerns
 */
export const createAPIConfig = (): PlaywrightTestConfig => {
	return defineConfig({
		testDir: './tests',
		timeout: 30 * 1000, // API tests usually faster
		expect: {
			timeout: 10 * 1000, // Shorter expect timeout for APIs
		},
		fullyParallel: true,
		forbidOnly: !!process.env.CI,
		retries: process.env.CI ? 2 : 0,
		workers: process.env.CI ? 4 : 6, // API tests can run more in parallel
		reporter: 'html',

		use: {
			trace: 'on-first-retry',
			// API-specific settings
			extraHTTPHeaders: {
				'Accept': 'application/json',
			},
		},

		projects: [
			{
				name: 'api-tests',
				testMatch: '**/*.spec.ts',
			},
		],
	});
};

/**
 * Base configuration factory for UI testing apps  
 * Optimized for browser testing with authentication, screenshots, etc.
 */
export const createUIConfig = (appPath?: string): PlaywrightTestConfig => {
	const resolveStoragePath = (storagePath: string) => {
		return appPath ? path.resolve(appPath, storagePath) : path.resolve(process.cwd(), storagePath);
	};

	return defineConfig({
		expect: {
			timeout: 15 * 1000,
		},
		timeout: 40 * 1000,
		testDir: './tests',
		fullyParallel: true,
		forbidOnly: !!process.env.CI,
		retries: process.env.CI ? 2 : 0,
		workers: 3, // UI tests need more resources per worker
		reporter: 'html',

		use: {
			trace: 'on-first-retry',
			screenshot: 'only-on-failure',
			video: 'retain-on-failure',
			
			// Common HTTP credentials for UI apps
			httpCredentials: {
				username: 'spacefortuna',
				password: 'MWLysVEpcY8Qez5t'
			},
		},
		// Standard UI testing projects
		projects: [
			{
				name: 'setupGuest',
				testMatch: '**/*.guest.setup.ts',
			},
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
					storageState: resolveStoragePath('playwright/.auth/user.json'),
					viewport: { width: 1440, height: 1024 },
				},
				dependencies: ['setupDesk', 'setupGuest'],
			},
			{
				name: 'mobile.375.chrome',
				testMatch: '**/*mobile/*',
				use: {
					...devices['iPhone 12 Pro'],
					browserName: 'chromium',
					storageState: resolveStoragePath('playwright/.auth/mobileUser.json'),
				},
				dependencies: ['setupMobile', 'setupGuest'],
			}
		]
	});
};

/**
 * Utility function to extend any base config with app-specific overrides
 */
export const extendConfig = (
	baseConfig: PlaywrightTestConfig, 
	overrides: Partial<PlaywrightTestConfig>
): PlaywrightTestConfig => {
	return defineConfig({
		...baseConfig,
		...overrides,
		use: {
			...baseConfig.use,
			...overrides.use,
		},
		projects: overrides.projects || baseConfig.projects,
	});
};
