/// <reference lib="dom" />
//import { Locator, Page } from '@playwright/test';
import { test, Locator, Page } from '@playwright/test';
import { assert } from 'console';

const expect = test.expect;

/**
 * Core assertion engine for visibility, enabled, or editable states.
 *
 * @param element - Playwright Locator of the element to assert.
 * @param assertionType - Type of assertion: 'visible', 'enabled' , or 'editable'.
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
// Type for composite locator objects - move to top and export
export type CompositeLocator = {
    locator: () => Locator;
    name: string;
};

/** //FIXME: docs need an update 
 * Creates a composite locator object with a locator function and display name.
 *
 * @param locator - A function that returns a Playwright Locator object.
 * @param name - A descriptive name for the element, used for logging and debugging.
 * @returns An object containing the locator function and the display name.
 *

 * @example
 * const firstNameField = compositeLocator(() => page.locator("input[name='firstName']"), 'First Name Field');
 * await assertVisible(firstNameField.locator(), firstNameField.name);
 */
export const compositeLocator = (locator: () => Locator, name: string) => ({
    locator,
    name
});

// Overloaded function signatures for assertVisible
export async function assertVisible(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function assertVisible(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

// Implementation
export async function assertVisible(
    element: Locator | CompositeLocator, 
    descriptionOrSoftAssert: string | boolean = 'Element', 
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await assertCondition(element.locator(), 'visible', true, element.name, actualSoftAssert);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await assertCondition(element, 'visible', true, description, softAssert);
    }
}

// Overloaded function signatures for assertNotVisible
export async function assertNotVisible(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function assertNotVisible(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

export async function assertNotVisible(
    element: Locator | CompositeLocator, 
    descriptionOrSoftAssert: string | boolean = 'Element', 
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await assertCondition(element.locator(), 'visible', false, element.name, actualSoftAssert);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await assertCondition(element, 'visible', false, description, softAssert);
    }
}

// Overloaded function signatures for assertEditable
export async function assertEditable(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function assertEditable(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

export async function assertEditable(
    element: Locator | CompositeLocator, 
    descriptionOrSoftAssert: string | boolean = 'Element', 
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await assertCondition(element.locator(), 'editable', true, element.name, actualSoftAssert);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await assertCondition(element, 'editable', true, description, softAssert);
    }
}

// Overloaded function signatures for assertNotEditable
export async function assertNotEditable(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function assertNotEditable(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

export async function assertNotEditable(
    element: Locator | CompositeLocator, 
    descriptionOrSoftAssert: string | boolean = 'Element', 
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await assertCondition(element.locator(), 'editable', false, element.name, actualSoftAssert);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await assertCondition(element, 'editable', false, description, softAssert);
    }
}

// Overloaded function signatures for assertEnabled
export async function assertEnabled(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function assertEnabled(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

export async function assertEnabled(
    element: Locator | CompositeLocator, 
    descriptionOrSoftAssert: string | boolean = 'Element', 
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await assertCondition(element.locator(), 'enabled', true, element.name, actualSoftAssert);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await assertCondition(element, 'enabled', true, description, softAssert);
    }
}

// Overloaded function signatures for assertNotEnabled
export async function assertNotEnabled(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function assertNotEnabled(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

export async function assertNotEnabled(
    element: Locator | CompositeLocator, 
    descriptionOrSoftAssert: string | boolean = 'Element', 
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await assertCondition(element.locator(), 'enabled', false, element.name, actualSoftAssert);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await assertCondition(element, 'enabled', false, description, softAssert);
    }
}

// Fix the overloaded function signatures for clickElement
export async function clickElement(element: CompositeLocator): Promise<void>;
export async function clickElement(element: Locator, description?: string): Promise<void>;

export async function clickElement(
    element: Locator | CompositeLocator, 
    description?: string
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        await test.step(`I click on ${element.name}`, async () => {
            await assertVisible(element.locator(), element.name);
            await assertEnabled(element.locator(), element.name);
            await element.locator().click();
        });
    } else {
        const elementDescription = description || 'Element';
        await test.step(`I click on ${elementDescription}`, async () => {
            await assertVisible(element, elementDescription);
            await assertEnabled(element, elementDescription);
            await element.click();
        });
    }
}

// Fix the overloaded function signatures for fillInputField
export async function fillInputField(element: CompositeLocator, value: string): Promise<void>;
export async function fillInputField(element: Locator, value: string, description?: string): Promise<void>;

export async function fillInputField(
    element: Locator | CompositeLocator, 
    value: string, 
    description?: string
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        await test.step(`I fill ${element.name} with ${value}`, async () => {
            await element.locator().waitFor({ state: 'visible' });
            await assertVisible(element.locator(), element.name);
            await assertEditable(element.locator(), element.name);
            await element.locator().fill(value);
        });
    } else {
        const elementDescription = description || 'Input field';
        await test.step(`I fill ${elementDescription} with ${value}`, async () => {
            await element.waitFor({ state: 'visible' });
            await assertVisible(element, elementDescription);
            await assertEditable(element, elementDescription);
            await element.fill(value);
        });
    }
}

// Overloaded function signatures for selectDropdownOption
export async function selectDropdownOption(
    collapsedDropdown: CompositeLocator, 
    expandedDropdown: CompositeLocator, 
    optionToSelect: CompositeLocator
): Promise<void>;
export async function selectDropdownOption(
    collapsedDropdown: Locator, 
    expandedDropdown: Locator, 
    optionToSelect: Locator, 
    dropdownDescription?: string, 
    optionToSelectDescription?: string
): Promise<void>;

export async function selectDropdownOption(
    collapsedDropdown: Locator | CompositeLocator, 
    expandedDropdown: Locator | CompositeLocator, 
    optionToSelect: Locator | CompositeLocator, 
    dropdownDescription = 'Dropdown', 
    optionToSelectDescription = 'Dropdown option'
): Promise<void> {
    if (typeof collapsedDropdown === 'object' && 'locator' in collapsedDropdown && 'name' in collapsedDropdown &&
        typeof expandedDropdown === 'object' && 'locator' in expandedDropdown && 'name' in expandedDropdown &&
        typeof optionToSelect === 'object' && 'locator' in optionToSelect && 'name' in optionToSelect) {
        
        await test.step(`I select ${optionToSelect.name} from ${collapsedDropdown.name}`, async () => {
            await clickElement(collapsedDropdown);
            await assertVisible(expandedDropdown);
            await clickElement(optionToSelect);
        });
    } else {
        await test.step(`I select ${optionToSelectDescription} from ${dropdownDescription}`, async () => {
            await clickElement(collapsedDropdown as Locator, `${dropdownDescription} dropdown`);
            await assertVisible(expandedDropdown as Locator, 'Expanded dropdown');
            await clickElement(optionToSelect as Locator, `${optionToSelectDescription} option to be selected`);
        });
    }
}

/**
 * Clicks an element if visible, otherwise executes a fallback action.
 *
 * @param element - Playwright Locator of the target element.
 * @param fallbackAction - Fallback action to execute if the element is not visible.
 * @param description - Optional name of the target element for logging and error messages.
 * @returns Promise<void>
 */
// export async function clickIfVisibleOrFallback(
//     element: Locator,
//     fallbackAction: () => Promise<void>,
//     description: string
// ): Promise<void> {
//     await test.step(`I click on ${description}`, async () => {
//         if (!(await element.isVisible())) {
//             await fallbackAction();
//         }
//         await clickElement(element, `${description} after fallback`);
//     });
// }

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

/**
 * Parses a date string into year, month name, and day components.
 *
 * @param dateString - Date string in DD/MM/YYYY, YYYY-MM-DD, or DD-MM-YYYY format.
 * @returns Object with year, month (name), and day (without leading zeros).
 */
export function parseDateString(dateString: string): { year: string; month: string; day: string } {
    const formats = [
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    ];

    for (let i = 0; i < formats.length; i++) {
        const format = formats[i];
        const match = dateString.match(format);
        if (match) {
            const [, first, second, third] = match;
            
            if (i === 1) { // YYYY-MM-DD
                return {
                    year: first,
                    month: getMonthName(parseInt(second)),
                    day: parseInt(third).toString() // Remove leading zeros
                };
            } else { // DD/MM/YYYY, DD-MM-YYYY - day first
                return {
                    year: third,
                    month: getMonthName(parseInt(second)),
                    day: parseInt(first).toString() // Remove leading zeros
                };
            }
        }
    }
    
    throw new Error(`Unsupported date format: ${dateString}. Supported formats: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY`);
}

/**
 * Converts a month number to month name.
 *
 * @param monthNumber - Month number (1-12).
 * @returns Full month name in English.
 */
export function getMonthName(monthNumber: number): string {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error(`Invalid month number: ${monthNumber}. Must be between 1 and 12.`);
    }
    
    return months[monthNumber - 1];
}

/**
 * Calls a method if the value is defined, otherwise logs an empty step.
 *
 * @param value - Value to pass to the method (undefined skips the method call).
 * @param method - Method to call if value is defined.
 * @param stepDescription - Description for the step when value is undefined.
 * @param context - The 'this' context for the method call.
 */
export async function callMethodIfDefined<T>(
    value: T | undefined, 
    method: (value: T) => Promise<void>, 
    stepDescription: string,
    context: any
): Promise<void> {
    if (value !== undefined) {
        await method.call(context, value);
    } else {
        await test.step(`I do NOT ${stepDescription}`, async () => {
            // intentionally left blank
        });
    }
}

/**
 * Fills an input field directly if the value is defined, otherwise logs a step.
 *
 * @param fieldValue - Value to fill (undefined skips filling).
 * @param inputLocator - Function that returns the input locator.
 * @param fieldDescription - Description of the input field.
 * @param stepDescription - Description for the step when value is undefined.
 */
export async function fillInputIfDefined(
    fieldValue: string | undefined, 
    inputLocator: () => Locator, 
    fieldDescription: string, 
    stepDescription: string
): Promise<void> {
    if (fieldValue !== undefined) {
        await fillInputField(inputLocator(), fieldValue, fieldDescription);
    } else {
        await test.step(`I do NOT ${stepDescription}`, async () => {
            // intentionally left blank
        });
    }
}



/**
 * Checks if an element contains the specified text.
 */
// Overloaded function signatures for assertElementContainsText
export async function assertElementContainsText(element: CompositeLocator, text: string, softAssert?: boolean): Promise<void>;
export async function assertElementContainsText(element: Locator, text: string, description: string, softAssert?: boolean): Promise<void>;

export async function assertElementContainsText(
    element: Locator | CompositeLocator, 
    text: string, 
    descriptionOrSoftAssert: string | boolean = 'Element', 
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await test.step(`I expect ${element.name} to contain text: ${text}`, async () => {
            await assertVisible(element.locator(), element.name, actualSoftAssert);
            const expectation = actualSoftAssert ? expect.soft(element.locator()) : expect(element.locator());
            await expectation.toContainText(text);
        });
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await test.step(`I expect ${description} to contain text: ${text}`, async () => {
            await assertVisible(element, description, softAssert);
            const expectation = softAssert ? expect.soft(element) : expect(element);
            await expectation.toContainText(text);
        });
    }
}

// Overloaded function signatures for assertAttribute
export async function assertAttribute(element: CompositeLocator, attributeType: string, softAssert?: boolean, attributeValue?: string | RegExp): Promise<void>;
export async function assertAttribute(element: Locator, attributeType: string, description?: string, softAssert?: boolean, attributeValue?: string | RegExp): Promise<void>;

export async function assertAttribute(
    element: Locator | CompositeLocator,
    attributeType: string,
    descriptionOrSoftAssert: string | boolean = 'Element',
    softAssertOrAttributeValue: boolean | string | RegExp = false,
    attributeValue?: string | RegExp
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        const actualAttributeValue = typeof softAssertOrAttributeValue === 'boolean' ? attributeValue : softAssertOrAttributeValue;
        
        await test.step(actualAttributeValue
            ? stepMessage(element.name, '', `${attributeType}=${actualAttributeValue}`)
            : stepMessage(element.name, '', attributeType),
            async () => {
                await assertVisible(element.locator(), element.name, actualSoftAssert);
                const expectation = actualSoftAssert ? expect.soft(element.locator()) : expect(element.locator());
                if (actualAttributeValue) {
                    await expectation.toHaveAttribute(attributeType, actualAttributeValue, { timeout: 1000 });
                } else {
                    await expectation.toHaveAttribute(attributeType, { timeout: 1000 });
                }
            });
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        const actualSoftAssert = typeof softAssertOrAttributeValue === 'boolean' ? softAssertOrAttributeValue : false;
        
        await test.step(attributeValue
            ? stepMessage(description, '', `${attributeType}=${attributeValue}`)
            : stepMessage(description, '', attributeType),
            async () => {
                await assertVisible(element, description, actualSoftAssert);
                const expectation = actualSoftAssert ? expect.soft(element) : expect(element);
                if (attributeValue) {
                    await expectation.toHaveAttribute(attributeType, attributeValue, { timeout: 1000 });
                } else {
                    await expectation.toHaveAttribute(attributeType, { timeout: 1000 });
                }
            });
    }
}

// Overloaded function signatures for validateAttributes
export async function validateAttributes(element: CompositeLocator, attributes: Record<string, string | null>, softAssert?: boolean): Promise<void>;
export async function validateAttributes(element: Locator, description: string, attributes: Record<string, string | null>, softAssert?: boolean): Promise<void>;

export async function validateAttributes(
    element: Locator | CompositeLocator,
    descriptionOrAttributes: string | Record<string, string | null>,
    attributesOrSoftAssert?: Record<string, string | null> | boolean,
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const attributes = descriptionOrAttributes as Record<string, string | null>;
        const actualSoftAssert = typeof attributesOrSoftAssert === 'boolean' ? attributesOrSoftAssert : false;
        
        await test.step(`I validate ${element.name} has the correct attributes`, async () => {
            for (const [attributeType, attributeValue] of Object.entries(attributes)) {
                await assertAttribute(element.locator(), attributeType, element.name, actualSoftAssert, attributeValue || undefined);
            }
        });
    } else {
        const description = descriptionOrAttributes as string;
        const attributes = attributesOrSoftAssert as Record<string, string | null>;
        
        await test.step(`I validate ${description} has the correct attributes`, async () => {
            for (const [attributeType, attributeValue] of Object.entries(attributes)) {
                await assertAttribute(element, attributeType, description, softAssert, attributeValue || undefined);
            }
        });
    }
}

// Overloaded function signatures for clickIfVisibleOrFallback
export async function clickIfVisibleOrFallback(element: CompositeLocator, fallbackAction: () => Promise<void>): Promise<void>;
export async function clickIfVisibleOrFallback(element: Locator, fallbackAction: () => Promise<void>, description?: string): Promise<void>;

export async function clickIfVisibleOrFallback(
    element: Locator | CompositeLocator,
    fallbackAction: () => Promise<void>,
    description?: string
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        await test.step(`I click on ${element.name}`, async () => {
            if (!(await element.locator().isVisible())) {
                await fallbackAction();
            }
            await clickElement(element);
        });
    } else {
        const elementDescription = description || 'Element';
        await test.step(`I click on ${elementDescription}`, async () => {
            if (!(await element.isVisible())) {
                await fallbackAction();
            }
            await clickElement(element, elementDescription);
        });
    }
}