import { Locator, Page } from '@playwright/test';
import test, { expect } from './base.po';

export class Navigation {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	public async isMobileOrDesktop(projectName: string): Promise<boolean> {
		return false;
		//TODO:
	};

	/**
	 * Asserts that an element is visible, with an option for soft or strict assertions.
	 * 
	 * @param element - The element to be checked for visibility.
	 * @param softAssert - If true, performs a soft assertion (logs failures without stopping the test).
	 *                     If false, performs a strict assertion (fails the test immediately if the check fails).
	 * @param message - Optional custom message displayed if the assertion fails.
	 * 
	 * Usage:
	 * - Use `softAssert = true` for logging-only checks, allowing the test to continue on failure.
	 * - Use `softAssert = false` to stop the test if the element is not visible.
	 * 
	 * Example:
	 * `await this.assertVisible(this.loginButton(), false, 'Login button should be visible');`
	 */
	public async assertVisible(element: Locator, softAssert: boolean = false, message?: string): Promise<void> {
		softAssert ? await expect.soft(element, `Expect ${message} to be visible`).toBeVisible() :
			await expect(element, `Expect ${message} to be visible`).toBeVisible();
	}

	/**
	 * Asserts that an element has a specific attribute with the expected value.
	 * 
	 * @param element - The `Locator` for the target element.
	 * @param attributeType - The attribute name to check (e.g., `aria-label`, `data-test-id`).
	 * @param attributeText - The expected value of the attribute. Default is .* - which will just check that the attribute exists (non-empty).
	 * @param softAssert - If true, performs a soft assertion, allowing test execution to continue even if the assertion fails. Default is `false`.
	 * @param message - Optional custom message to display if the assertion fails.
	 * 
	 * @throws Will throw an error if the attribute does not match the expected value (or if element or attribute is not found), unless `softAssert` is true.
	 */
	public async assertAttributes(
		element: Locator,
		attributeType: string,
		//attributeText: string = "", //TODO: figure out the regex that will accept anything
		softAssert: boolean = false,
	): Promise<void> {
		const message = `Expected element to have attribute ${attributeType}`;
		const expectation = softAssert ? expect.soft(await element, message) : expect(await element, message);
		await expectation.toHaveAttribute(attributeType);
	}

	/**
	 * Clicks on an element after verifying its visibility.
	 * Performs a soft or strict assertion for visibility based on the `softAssert` parameter.
	 * @param element - The element to be clicked.
	 * @param softAssert - If true, performs a soft assertion (does not stop test on failure); 
	 *                     if false, performs a strict assertion (fails test on visibility failure).
	 * @param description - A description message used in the assertion to clarify which element is expected to be visible.
	 */
	public async clickElement(element: Locator, softAssert: boolean, description: string): Promise<void> {
		await this.assertVisible(element, softAssert, description);
		await element.click();
	}

	/**
	 * Fills an input field after verifying its visibility and editability.
	 * Performs a soft or strict assertion for visibility and editability based on the `softAssert` parameter.
	 * @param element - The input field to be filled.
	 * @param value - The value to fill into the input field.
	 * @param softAssert - If true, performs a soft assertion (does not stop test on failure); 
	 *                     if false, performs a strict assertion (fails test on visibility/editability failure).
	 * @param description - A description message used in the assertion to clarify which element is expected to be visible and editable.
	 */
	public async fillInputField(element: Locator, value: string, softAssert: boolean, description: string): Promise<void> {
		await this.assertVisible(element, softAssert, `${description} should be visible`);
		await expect(element, `${description} should be editable`).toBeEditable();
		await element.fill(value);
	}

	/**
 * Validates that the current page URL matches the expected URL.
 * 
 * @param expectedUrl - The URL that you expect the current page to match.
 * @param softAssert - If true, performs a soft assertion (logs failures without stopping the test). Default is `false`.
 * 
 * Usage:
 * - Use `softAssert = true` to log failures and continue the test.
 * - Use `softAssert = false` to stop the test if the URL does not match.
 * 
 * Example:
 * `await this.assertUrl('https://example.com/dashboard', false);`
 */
	public async assertUrl(
		expectedUrl: string,
		softAssert: boolean = false,
	): Promise<void> {
		const actualUrl = this.page.url();
		const message = `Expected to be on URL: ${expectedUrl}`
		const expectation = softAssert ? expect.soft(await actualUrl, message) : expect(await actualUrl, message);
		await expectation.toBe(expectedUrl)
	}

	/**
	 * Retrieves the indices of elements within a given locator that match a specific attribute-value pair.
	 *
	 * @param locator   The Playwright Locator representing the elements to be checked.
	 * @param attribute The name of the attribute to evaluate (e.g., "class", "href", "id").
	 * @param value     The expected value of the attribute to match.
	 * @return          A promise that resolves to an array of indices of elements matching the attribute-value pair.
	 *
	 * @example
	 * // Example usage to find elements with the class "active"
	 * const indices = await getIndicesByAttribute(page.locator(".example-class"), "class", "active");
	 * console.log(indices); // Output: [0, 3]
	 */
	public async getIndicesByAttribute(locator: Locator, attribute: string, value: string): Promise<number[]> {
		return await locator.evaluateAll((elements, { attribute, value }) =>
			elements.map((el, index) => {
				const classList = el.getAttribute(attribute)?.split(' ') || [];
				return classList.some(className => className.includes(value)) ? index : -1;
			}).filter(index => index !== -1),
			{ attribute, value }
		);
	}

	/**
	 * Iterates over elements located by a specified Playwright locator and performs an action on each element.
	 * 
	 * @param locator - The Playwright `Locator` object representing the elements to iterate over.
	 * @param action - An asynchronous callback function that performs an operation for each element. 
	 *                 The callback receives the current element index as its argument.
	 * @param elementsToCheck - Optional. The maximum number of elements to iterate over. 
	 *                          If not provided, the method will iterate over all elements found by the locator.
	 * 
	 * @returns A Promise that resolves when all specified actions have been completed.
	 * 
	 * @example
	 * // Example usage: Iterating over all elements in a list and validating each one
	 * await iterateElements(
	 *     page.locator('.list-item'),
	 *     async (index) => {
	 *         const element = page.locator('.list-item').nth(index);
	 *         await expect(element).toBeVisible();
	 *     }
	 * );
	 * 
	 * @throws Will throw an error if the `locator` is invalid or the `action` callback fails for any iteration.
	 */
	public async iterateElements(
		locator: Locator,
		action: (index: number) => Promise<void>,
		elementsToCheck?: number
	): Promise<void> {
		const count = elementsToCheck ?? await locator.count();
		for (let i = 0; i < count; i++) {
			await action(i);
		}
	}

}