/// <reference lib="dom" />
//import { Locator, Page } from '@playwright/test';
import { test, Locator, Page } from '@playwright/test';

const expect = test.expect;

/**
 * Core assertion engine for visibility, enabled, or editable states.
 *
 * @param element - Playwright Locator of the element to assert.
 * @param assertionType - Type of assertion: 'visible', 'enabled', or 'editable'.
 * @param shouldMatch - If true, asserts the element matches the state; if false, asserts the opposite.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test (soft assertion). Default is false.
 * @returns Promise<void>
 */
function stepMessage(description: string, action: string, state?: string) {
    return `Expect ${description} to${action ? ' ' + action : ''}${state ? ' be ' + state : ''}`.replace(/  +/g, ' ');
}

export async function assertCondition(
  element: Locator,
  assertionType: 'visible' | 'enabled' | 'editable',
  shouldMatch: boolean,
  description = 'Element',
  softAssert = false
): Promise<void> {
  const action = shouldMatch ? '' : 'NOT';
  const message = stepMessage(description, action, assertionType);

  // Choose the correct expect API
  const assertionExpect = softAssert ? expect.soft : expect;

  // Map our three assertion types onto Playwright's expect API
  const assertionMap = {
    visible: {
      positive: async () => await assertionExpect(element, message).toBeVisible(),
      negative: async () => await assertionExpect(element, message).not.toBeVisible(),
    },
    enabled: {
      positive: async () => await assertionExpect(element, message).toBeEnabled(),
      negative: async () => await assertionExpect(element, message).not.toBeEnabled(),
    },
    editable: {
      positive: async () => await assertionExpect(element, message).toBeEditable(),
      negative: async () => await assertionExpect(element, message).not.toBeEditable(),
    },
  };

  await test.step(message, async () => {
    const fn = assertionMap[assertionType][shouldMatch ? 'positive' : 'negative'];
    await fn();
  });
}

/**
 * Asserts that an element is visible.
 *
 * @param element - Playwright Locator of the element to check.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
 */
export async function assertVisible(element: Locator, description = 'Element', softAssert = false): Promise<void> {
    await assertCondition(element, 'visible', true, description, softAssert);
}

/**
 * Asserts that an element is not visible.
 *
 * @param element - Playwright Locator of the element to check.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
 */
export async function assertNotVisible(element: Locator, description = 'Element', softAssert = false): Promise<void> {
    await assertCondition(element, 'visible', false, description, softAssert);
}

/**
 * Asserts that an element has a specific attribute, optionally with a value. Checks visibility first.
 *
 * @param element - Playwright Locator for the target element.
 * @param attributeType - The attribute name to check (e.g., 'aria-label', 'data-test-id').
 * @param softAssert - If true, performs a soft assertion. Default is false.
 * @param elementName - Optional name of the element for logging. Default is 'Element'.
 * @param attributeValue - Optional expected value of the attribute.
 * @returns Promise<void>
 * @throws Will throw if the element is not visible or doesn't have the attribute, unless softAssert is true.
 */
export async function assertAttribute(
    element: Locator,
    attributeType: string,
    description = 'Element',
    softAssert = false,
    attributeValue?: string | RegExp
): Promise<void> {
    await test.step(attributeValue
        ? stepMessage(description, '', `${attributeType}=${attributeValue}`)
        : stepMessage(description, '', attributeType),
        async () => {
            await assertVisible(element, description, softAssert);
            const expectation = softAssert ? expect.soft(element) : expect(element);
            if (attributeValue) {
                await expectation.toHaveAttribute(attributeType, attributeValue);
            } else {
                await expectation.toHaveAttribute(attributeType);
            }
        });
}

/**
 * Validates multiple attributes of an element.
 *
 * @param locator - Playwright Locator of the element.
 * @param description - Description for logging and error messages.
 * @param attributes - Object mapping attribute names to their expected values (or null for presence only).
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
 */
export async function validateAttributes(
    locator: Locator,
    description: string,
    attributes: Record<string, string | null>,
    softAssert = false
): Promise<void> {
    await test.step(`I validate ${description} has the correct attributes`, async () => {
        for (const [attributeType, attributeValue] of Object.entries(attributes)) {
            await assertAttribute(locator, attributeType, description, softAssert, attributeValue || undefined);
        }
    });
}

/**
 * Asserts that an element is enabled.
 *
 * @param element - Playwright Locator of the element to check.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
 */
export async function assertEnabled(element: Locator, description = 'Element', softAssert = false): Promise<void> {
    await assertCondition(element, 'enabled', true, description, softAssert);
}

/**
 * Asserts that an element is not enabled.
 *
 * @param element - Playwright Locator of the element to check.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
 */
export async function assertNotEnabled(element: Locator, description = 'Element', softAssert = false): Promise<void> {
    await assertCondition(element, 'enabled', false, description, softAssert);
}

/**
 * Asserts that an element is editable.
 *
 * @param element - Playwright Locator of the element to check.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
 */
export async function assertEditable(element: Locator, description = 'Element', softAssert = false): Promise<void> {
    await assertCondition(element, 'editable', true, description, softAssert);
}

/**
 * Asserts that an element is not editable.
 *
 * @param element - Playwright Locator of the element to check.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test. Default is false.
 * @returns Promise<void>
 */
export async function assertNotEditable(element: Locator, description = 'Element', softAssert = false): Promise<void> {
    await assertCondition(element, 'editable', false, description, softAssert);
}

/**
 * Clicks on an element after verifying its visibility and enabled state.
 *
 * @param element - Playwright Locator of the element to click.
 * @param description - Description of the element for logging and error messages.
 * @returns Promise<void>
 */
export async function clickElement(element: Locator, description: string): Promise<void> {
    await test.step(`I click on ${description}`, async () => {
        await assertVisible(element, description);
        await assertEnabled(element, description);
        await element.click();
    });
}

/**
 * Checks if an element contains the specified text.
 *
 * @param element - Playwright Locator of the element to check.
 * @param text - Text to check for within the element.
 * @param softAssert - If true, logs failures without stopping the test.
 * @param description - Description of the element for logging and error messages.
 * @returns Promise<void>
 */
export async function assertElementContainsText(element: Locator, text: string, description: string, softAssert = false): Promise<void> {
    await test.step(`I expect ${description} to contain text: ${text}`, async () => {
        await assertVisible(element, description, softAssert);
        const expectation = softAssert ? expect.soft(element) : expect(element);
        await expectation.toContainText(text);
    });
}

/**
 * Fills an input field after verifying its visibility and editability.
 *
 * @param element - Playwright Locator of the input field.
 * @param value - Value to fill into the input field.
 * @param description - Description of the input field for logging and error messages.
 * @returns Promise<void>
 */
export async function fillInputField(element: Locator, value: string, description: string): Promise<void> {
    await test.step(`I fill ${description} with ${value}`, async () => {
        await element.waitFor({ state: 'visible' });
        await assertVisible(element, description);
        await assertEditable(element, description);
        await element.fill(value);
    });
}

/**
 * Clicks an element if visible, otherwise executes a fallback action.
 *
 * @param element - Playwright Locator of the target element.
 * @param fallbackAction - Fallback action to execute if the element is not visible.
 * @param description - Optional name of the target element for logging and error messages.
 * @returns Promise<void>
 */
export async function clickIfVisibleOrFallback(
    element: Locator,
    fallbackAction: () => Promise<void>,
    description: string
): Promise<void> {
    await test.step(`I click on ${description}`, async () => {
        if (!(await element.isVisible())) {
            await fallbackAction();
        }
        await clickElement(element, `${description} after fallback`);
    });
}

/**
 * Gets indices of elements with a specific attribute value.
 *
 * @param locator - Playwright Locator of the elements to check.
 * @param attribute - Attribute name to check.
 * @param value - Value to match within the attribute.
 * @returns Promise<number[]> Array of indices matching the criteria.
 */
export async function getIndicesByAttribute(
    locator: Locator,
    attribute: string,
    value: string
): Promise<number[]> {
    return await test.step(
        `Get indices of elements with attribute [${attribute}] containing value "${value}"`,
        async () => {
            return locator.evaluateAll(
                (elements, { attribute, value }) =>
                    elements
                        .map((el, index) => {
                            const attrValue = el.getAttribute(attribute);
                            const classList = attrValue?.split(' ') || [];
                            return classList.some(className => className.includes(value)) ? index : -1;
                        })
                        .filter(index => index !== -1),
                { attribute, value }
            );
        }
    );
}

/**
 * Iterates over elements and performs an action on each.
 *
 * @param locator - Playwright Locator of the elements to iterate over.
 * @param action - Async callback function to execute for each element index.
 * @param description - Optional description for logging. Default is 'A number of elements'.
 * @param elementsToCheck - Optional number of elements to iterate over. If not provided, iterates all.
 * @returns Promise<void>
 */
export async function iterateElements(
    locator: Locator,
    action: (index: number) => Promise<void>,
    description = 'A number of elements',
    elementsToCheck?: number
): Promise<void> {
    await test.step(`I iterate over ${description}`, async () => {
        const count = elementsToCheck ?? await locator.count();
        for (let i = 0; i < count; i++) {
            await action(i);
        }
    });
}

/**
 * Watches and removes overlay fog elements from the page (internal helper).
 *
 * @param page - Playwright Page object.
 * @returns Promise<void>
 */
// async function watchAndRemoveFog(page: { addInitScript: (fn: () => void) => Promise<void> }): Promise<void> {
//     await page.addInitScript(() => {
//         const observer = new MutationObserver((mutations) => {
//             for (const mutation of mutations) {
//                 for (const node of Array.from(mutation.addedNodes)) {
//                     if (node instanceof HTMLElement) {
//                         if (node.matches?.('overlay-fog')) {
//                             node.remove();
//                             continue;
//                         }
//                         const fog = node.querySelector?.('overlay-fog');
//                         if (fog) fog.remove();
//                     }
//                 }
//             }
//         });
//         observer.observe(document.body, { childList: true, subtree: true });
//     });
// }

/**
 * Decorator to wrap methods in a test step.
 *
 * @param stepName - Optional custom step name for the test step.
 * @returns Method decorator function.
 */
export function step(stepName?: string) {
	return function decorator(target: Function, context: ClassMethodDecoratorContext) {
		return async function replacementMethod(...args: any[]) {
			const name = stepName || `${this.constructor.name}.${(context.name as string)}`;
			return test.step(name, async () => {
				return await target.call(this, ...args);
			});
		};
	}
}

/**
 * Decorator to wrap methods in a test step with parameterized names.
 *
 * @param stepName - Function or string for custom step name, or undefined for default.
 * @returns Method decorator function.
 */
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
    locator: Locator,
    description: string,
    expectedPath: string
): Promise<void> {
    await test.step(`Perform navigation click on ${description} and assert url is ${expectedPath}`, async () => {
        await clickElement(locator, description);
        await assertUrl(page, `${expectedPath}`, true);
    });
}
