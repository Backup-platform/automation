import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

/**
 * @fileoverview Playwright configuration factories for different testing scenarios
 * 
 * This module provides pre-configured Playwright test configurations optimized
 * for different types of testing scenarios including API testing, UI testing,
 * and cross-browser testing. Each factory function returns a customized
 * configuration with appropriate settings for the specific use case.
 */
export const createAPIConfig = (): PlaywrightTestConfig => {
	return defineConfig({
		testDir: './tests',
		timeout: 30 * 1000,
		expect: {
			timeout: 10 * 1000,
		},
		fullyParallel: true,
		forbidOnly: !!process.env.CI,
		retries: process.env.CI ? 2 : 0,
		workers: process.env.CI ? 4 : 6,
		reporter: 'html',

		use: {
			trace: 'on-first-retry',
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
 * Creates a Playwright configuration optimized for UI testing.
 * Features browser support, authentication storage, screenshots, and visual testing capabilities.
 * 
 * @param appPath - Optional path to the application directory for storage resolution
 * @returns Playwright configuration object for UI testing
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
				name: 'setupDeskDev',
				testMatch: '**/*.desktop.dev.setup.ts',
			},
			{
				name: 'setupGuestDev',
				testMatch: '**/*.auth.guest.dev.setup.ts',
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
			},
			{
				name: 'desktop.dev',
				testMatch: '**/*desktop/*',
				use: {
					...devices['Desktop Chrome'],
					storageState: resolveStoragePath('playwright/.auth/user.json'),
					viewport: { width: 1440, height: 1024 },
				},
				dependencies: ['setupDeskDev', 'setupGuestDev'],
			},
		]
	});
};

/**
 * Utility function to extend any base configuration with app-specific overrides.
 * Provides deep merging of configuration options while preserving type safety.
 * 
 * @param baseConfig - Base Playwright configuration to extend
 * @param overrides - Partial configuration object with override values
 * @returns Extended Playwright configuration object
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
