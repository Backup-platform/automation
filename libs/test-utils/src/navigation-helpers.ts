/// <reference lib="dom" />
import { Page, test, expect } from '@playwright/test';
import { clickElement } from './interactions';
import { CompositeLocator } from './core-types';

/**
 * Navigation and URL validation functions
 */

/**
 * Waits for a URL condition to be met and asserts the URL.
 *
 * @param page - Playwright Page object.
 * @param urlCondition - The expected URL (string or RegExp) or a custom condition function.
 * @param description - Description for the step.
 * @param waitUntilDomContentLoaded - If true, waits for DOM content to be loaded before asserting. Default is false.
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
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
 *
 * @param page - Playwright Page object.
 * @param locator - Playwright Locator of the element to click.
 * @param description - Description of the element for logging and error messages.
 * @param expectedPath - Expected URL path after navigation.
 * @returns Promise<void>
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
