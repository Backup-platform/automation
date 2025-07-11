/// <reference lib="dom" />
import { Page, test, expect } from '@playwright/test';
import { clickElement } from './interactions';
import { CompositeLocator } from './core-types';

/**
 * @fileoverview Navigation and URL validation utilities for test automation
 * 
 * This module provides comprehensive navigation helpers for testing single-page
 * applications and multi-page workflows. Includes URL validation, navigation
 * clicks with assertions, and URL substring matching for complex routing scenarios.
 * 
 * @author M Petrov
 * 
 * @example
 * ```typescript
 * // Assert exact URL match
 * await assertUrl(page, 'https://example.com/dashboard');
 * 
 * // Assert URL contains specific substrings
 * await assertUrlContains(page, ['user', 'profile'], true);
 * 
 * // Perform navigation click with URL validation
 * await performNavigationClick(
 *   page, 
 *   profileLink, 
 *   'Profile Link', 
 *   '/user/profile'
 * );
 * ```
 */

/**
 * Waits for a URL condition to be met and asserts the URL.
 * Internal helper function for URL validation with flexible conditions.
 *
 * @param page - Playwright Page object
 * @param urlCondition - Expected URL (string, RegExp, or custom condition function)
 * @param description - Description for the test step
 * @param waitUntilDomContentLoaded - Whether to wait for DOM content loaded
 * @param softAssert - Whether to use soft assertions
 */
async function waitForAndAssertUrl(
	page: Page,
	urlCondition: string | RegExp | ((url: URL) => boolean),
	description: string,
	waitUntilDomContentLoaded: boolean,
	softAssert: boolean
): Promise<void> {
  await test.step(description, async () => {
    if (waitUntilDomContentLoaded) {
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    }

    const msg = `Expected URL to match ${urlCondition}, but got ${page.url()}`;
    const assertion = softAssert ? expect.soft(page, msg) : expect(page, msg);
    await assertion.toHaveURL(urlCondition);
  });
}

/**
 * Asserts that the current page URL exactly matches the expected URL.
 * Supports string matching and regular expression patterns.
 *
 * @param page - Playwright Page object
 * @param expectedUrl - Expected URL (string or RegExp)
 * @param waitUntilDomContentLoaded - Whether to wait for DOM content loaded
 * @param softAssert - Whether to use soft assertions
 */
export async function assertUrl(
	page: Page,
	expectedUrl: string | RegExp,
	waitUntilDomContentLoaded = true,
	softAssert = false
): Promise<void> {
	await waitForAndAssertUrl(
		page,
		expectedUrl,
		`Assert page URL is ${expectedUrl}`,
		waitUntilDomContentLoaded,
		softAssert
	);
}

/**
 * Asserts that the current page URL contains all specified substrings.
 * Useful for validating complex URLs with query parameters or dynamic segments.
 *
 * @param page - Playwright Page object
 * @param expectedSubstrings - Array of substrings that must be present in URL
 * @param waitUntilDomContentLoaded - Whether to wait for DOM content loaded
 * @param softAssert - Whether to use soft assertions
 */
export async function assertUrlContains(
	page: Page,
	expectedSubstrings: string[],
	waitUntilDomContentLoaded = true,
	softAssert = false
): Promise<void> {
	await waitForAndAssertUrl(
		page,
		url => expectedSubstrings.every(substring => url.toString().includes(substring)),
		`Assert URL contains: ${expectedSubstrings.join(', ')}`,
		waitUntilDomContentLoaded,
		softAssert
	);
}

/**
 * Performs a navigation click and asserts the URL.
 * Combines element clicking with URL validation for navigation testing.
 *
 * @param page - Playwright Page object
 * @param locator - Composite locator of the element to click
 * @param expectedPath - Expected URL path after navigation
 */
export async function performNavigationClick(
    page: Page,
    locator: CompositeLocator,
    expectedPath: string
): Promise<void> {
    await test.step(`Perform navigation click on ${locator.name} and assert url is ${expectedPath}`, async () => {
        await clickElement(locator);
        await page.waitForLoadState('domcontentloaded', { timeout: 1000 });
        await assertUrl(page, `${expectedPath}`, true);
    });
}
