import { Locator, Page } from '@playwright/test';
import test, { expect } from './base.po';

export class Navigation {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}
    //TODO: make a method that interacts with the callendar 

	public async isMobileOrDesktop(projectName: string): Promise<boolean> {
		return false;
		//TODO:
	};

	/**
	 * Asserts that an element is visible, 
	 * with an option for soft or strict assertions.
	 * 
	 * @param element - The element to be checked for visibility.
	 * @param softAssert - If true, performs a soft assertion (logs failures without stopping the test).
	 *                     If false, performs a strict assertion (fails the test immediately if the check fails).
	 * @param elementName - Element for the custom message to be displayed if the assertion fails.
	 * 
	 * Usage:
	 * - Use `softAssert = true` for logging-only checks, allowing the test to continue on failure.
	 * - Use `softAssert = false` to stop the test if the element is not visible.
	 * 
	 * Example:
	 * `await this.assertVisible(this.loginButton(), false, 'Login button should be visible');`
	 */
	@stepParam((element: Locator, softAssert: boolean, elementName: string) => `I expect ${elementName} is visible`)
	public async assertVisible(element: Locator, softAssert: boolean = false, elementName?: string): Promise<void> {
		if (softAssert) {
			await expect.soft(element).toBeVisible();
		} else {
			await expect(element).toBeVisible();
		}
	}

	@stepParam((element: Locator, softAssert: boolean, elementName: string) => `I expect ${elementName} is NOT visible`)
	public async assertNotVisible(element: Locator, softAssert: boolean = false, elementName?: string): Promise<void> {
		if (softAssert) {
			await expect.soft(element).not.toBeVisible();
		} else {
			await expect(element).not.toBeVisible();
		}
	}


	/**
	 * Asserts that the given element is enabled, 
	 * with an option for soft or strict assertions.
	 *
	 * @param {Locator} element - The element to check.
	 * @param {boolean} [softAssert=false] - If true, performs a soft assertion.
	 * @param {string} [elementName] - The name of the element for logging purposes.
	 */
	@stepParam((element: Locator, softAssert: boolean, elementName: string) => `I expect ${elementName} is enabled`)
	public async assertEnabled(element: Locator, softAssert: boolean = false, elementName?: string): Promise<void> {
		if (softAssert) {
			await expect.soft(element, `Expect ${elementName} to be enabled`).toBeEnabled();
		} else {
			await expect(element, `Expect ${elementName} to be enabled`).toBeEnabled();
		}
	}

	@stepParam((element: Locator, softAssert: boolean, elementName: string) => `I expect ${elementName} is NOT enabled`)
	public async assertNotEnabled(element: Locator, softAssert: boolean = false, elementName?: string): Promise<void> {
		if (softAssert) {
			await expect.soft(element, `Expect ${elementName} to not be enabled`).not.toBeEnabled();
		} else {
			await expect(element, `Expect ${elementName} to not be enabled`).not.toBeEnabled();
		}
	}

	private async assertCondition(
		element: Locator,
		assertionType: 'visible' | 'enabled' | 'editable',
		shouldMatch: boolean,
		softAssert: boolean = false,
		elementName: string = 'Element'
	): Promise<void> {
		const action = shouldMatch ? '' : 'NOT ';
		const message = `Expect ${elementName} to ${action}be ${assertionType}`;

		// Map assertion types to Playwright's `expect` API
		const assertionMap = {
			visible: {
				positive: () => expect(element, message).toBeVisible(),
				negative: () => expect(element, message).not.toBeVisible(),
			},
			enabled: {
				positive: () => expect(element, message).toBeEnabled(),
				negative: () => expect(element, message).not.toBeEnabled(),
			},
			editable: {
				positive: () => expect(element, message).toBeEditable(),
				negative: () => expect(element, message).not.toBeEditable(),
			},
		};

		const assertion = assertionMap[assertionType][shouldMatch ? 'positive' : 'negative'];

		// Perform soft or strict assertion
		if (softAssert) {
			await expect.soft(element, message)[shouldMatch ? 'toBe' : 'not.toBe'](assertionType);
		} else {
			await assertion();
		}
	}
	/**
	 * Asserts that the given element is editable, 
	 * with an option for soft or strict assertions.
	 *
	 * @param {Locator} element - The element to check.
	 * @param {boolean} [softAssert=false] - If true, performs a soft assertion.
	 * @param {string} [elementName] - The name of the element for logging purposes.
	 */
	public async assertEditable(element: Locator, softAssert: boolean = false, elementName?: string): Promise<void> {
		if (softAssert) {
			await expect.soft(element, `Expect ${elementName} to be editable`).toBeEditable();
		} else {
			await expect(element, `Expect ${elementName} to be editable`).toBeEditable();
		}
	}

	public async assertNotEditable(element: Locator, softAssert: boolean = false, elementName?: string): Promise<void> {
		if (softAssert) {
			await expect.soft(element, `Expect ${elementName} to be NOT editable`).not.toBeEditable();
		} else {
			await expect(element, `Expect ${elementName} to be NOT editable`).not.toBeEditable();
		}
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
	@stepParam((element: Locator, attributeType: string, softAssert: boolean, message: string) => `I expect ${message} has attribute ${attributeType}`)
	public async assertAttribute(
		element: Locator,
		attributeType: string,
		softAssert: boolean = false,
	): Promise<void> {
		const message = `Expected element has attribute ${attributeType}`;
		const expectation = softAssert ? expect.soft(element, message) : expect(element, message);
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
	@stepParam((element: Locator, softAssert: boolean, description: string) => `I click on ${description}`)
	public async clickElement(element: Locator, softAssert: boolean, description: string): Promise<void> {
		await this.assertVisible(element, softAssert, description);
		await this.assertEnabled(element, softAssert, description);
		await element.click();
	}

	/**
	 * Checks if an element contains the specified text after verifying its visibility.
	 * Performs a soft or strict assertion for visibility based on the `softAssert` parameter.
	 * @param element - The element to be checked.
	 * @param text - The text that the element should contain.
	 * @param softAssert - If true, performs a soft assertion (does not stop test on failure); 
	 *                     if false, performs a strict assertion (fails test on visibility or text check failure).
	 * @param description - A description message used in the assertion to clarify which element is expected to contain the text.
	 */
	public async assertElementContainsText(element: Locator, text: string, softAssert: boolean, description: string): Promise<void> {
		await this.assertVisible(element, softAssert, description);
		if (softAssert) {
			await expect.soft(element, `Expect ${description} to contain text: ${text}`).toContainText(text);
		} else {
			await expect(element, `Expect ${description} to contain text: ${text}`).toContainText(text);
		}
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
	@stepParam((element: Locator, softAssert: boolean, description: string, value: string) => `I fill ${description} with ${value}`)
	public async fillInputField(element: Locator, value: string, softAssert: boolean, description: string): Promise<void> {
		await this.assertVisible(element, softAssert, description);
		await this.assertEditable(element, softAssert, description);
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
		const message = `Expected to be on URL: ${expectedUrl}`;
		const expectation = softAssert ? expect.soft(this.page, message) : expect(this.page, message);
		await expectation.toHaveURL(expectedUrl);
	}

	/**
	 * Asserts that the current URL contains all specified substrings.
	 * 
	 * @param expectedSubstrings - An array of substrings expected to be present in the current URL.
	 * @param softAssert - If true, logs failures without stopping the test; otherwise, fails immediately.
	 * 
	 * Example:
	 * ```typescript
	 * await navigation.assertUrlContains(['location=testingnet.com', 'console=Test'], false);
	 * ```
	 */
	//TODO: add a method that checks if the URL contains a SINGLE specific substring and refactor this method to use it
	public async assertUrlContains(
		expectedSubstrings: string[],
		softAssert: boolean = false
	): Promise<void> {
		const currentUrl = this.page.url();

		for (const substring of expectedSubstrings) {
			const message = `Expected URL to contain: ${substring}. Current URL: ${currentUrl}`;
			if (softAssert) {
				await expect.soft(currentUrl, message).toContain(substring);
			} else {
				await expect(currentUrl, message).toContain(substring);
			}
		}
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


	/**
	 * Clicks an element if it's visible. If not, executes the fallback action to make it visible, then clicks the element.
	 * 
	 * @param targetElement - The element to click (the one we want to ensure is visible and clicked).
	 * @param fallbackAction - A function to execute if the target element is not visible (e.g., opening a menu).
	 * @param softAssert - Optional. Whether to use soft assertions (default is `false`).
	 * @param targetName - A name or description of the target element (for logging/debugging purposes).
	 */
	public async clickIfVisibleOrFallback(
		targetElement: Locator,
		fallbackAction: () => Promise<void>,
		softAssert: boolean = false,
		targetName?: string
	): Promise<void> {
		await test.step(`I click on ${targetName}`, async () => {
			// If the element is visible, click it and return
			if (await targetElement.isVisible()) {
				return await this.clickElement(targetElement, softAssert, `${targetName}`);
			}

			// Otherwise, fallback using the provided action
			await fallbackAction();
			await targetElement.waitFor({ state: 'visible' });
			await this.clickElement(targetElement, softAssert, `${targetName} after fallback`);
		});
	}

}

export function step(stepName?: string) {
	return function decorator(target: Function, context: ClassMethodDecoratorContext) {
		return async function repalacmentMethod(...args: any[]) {
			const name = stepName || `${this.constructor.name}.${(context.name as string)}`;
			return test.step(name, async () => {
				return await target.call(this, ...args);
			});
		};
	}
}

export function stepParam(stepName?: string | ((...args: any[]) => string)) {
	return function decorator(target: Function, context: ClassMethodDecoratorContext) {
		return async function replacementMethod(this: any, ...args: any[]) {
			const name = typeof stepName === 'function'
				? stepName(...args) // Use the args to compute the step name
				: stepName || `${this.constructor.name}.${context.name as string}`;
			
			return test.step(name, async () => {
				return await target.apply(this, args); // Ensure the original method runs in the correct context
			});
		};
	};
}


async function watchAndRemoveFog(page: any) {
    await page.addInitScript(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    // Check if the added node is the overlay
                    if (node.matches?.('overlay-fog')) {
                        console.log('Removing overlay-fog:', node);
                        node.remove();
                        continue;
                    }

                    // Or if it contains the overlay
                    const fog = node.querySelector?.('overlay-fog');
                    if (fog) {
                        console.log('Removing overlay-fog (child):', fog);
                        fog.remove();
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
