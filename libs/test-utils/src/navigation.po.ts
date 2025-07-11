/// <reference lib="dom" />
//import { Locator, Page } from '@playwright/test';
import { test, Locator, Page, FrameLocator } from '@playwright/test';
import { CompositeLocator } from './core-types';

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

export async function legacyAssertVisible(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function legacyAssertVisible(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

export async function legacyAssertVisible(
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

export async function legacyAssertEnabled(element: CompositeLocator, softAssert?: boolean): Promise<void>;
export async function legacyAssertEnabled(element: Locator, description?: string, softAssert?: boolean): Promise<void>;

export async function legacyAssertEnabled(
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

export async function legacyAssertVisibleNotActionable(element: CompositeLocator): Promise<void> {
    // Implement the assertion logic here
    await test.step(`I validate and element ${element.name} is visible but not actionable`, async () => {
        await legacyAssertVisible(element);
        const isActionable = await element.locator().click({ trial: true, timeout: 2000 })
            .then(() => true)
            .catch(() => false);
        await expect(isActionable, `Element ${element.name} is actionable`).toBe(false);
    });
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
// Remove the duplicate CompositeLocator type definition
// export type CompositeLocator = {
//     locator: () => Locator;
//     name: string;
// };

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

export const compositeFrameLocator = (locator: () => FrameLocator, name: string) => ({
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
    return legacyAssertVisible(element, descriptionOrSoftAssert, softAssert);
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
    return legacyAssertEnabled(element, descriptionOrSoftAssert, softAssert);
}

// Overloaded function signatures for clickElement
export async function clickElement(element: CompositeLocator): Promise<void>;
export async function clickElement(element: Locator, description?: string): Promise<void>;

export async function clickElement(
    element: Locator | CompositeLocator, 
    description?: string
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        await test.step(`I click on ${element.name}`, async () => {
            await legacyAssertVisible(element);
            await legacyAssertEnabled(element);
            await element.locator().click();
        });
    } else {
        const elementDescription = description || 'Element';
        await test.step(`I click on ${elementDescription}`, async () => {
            await legacyAssertVisible(element, elementDescription);
            await legacyAssertEnabled(element, elementDescription);
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
        await page.waitForLoadState('domcontentloaded', { timeout: 1000 });
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

/**
 * Internal helper function for attribute assertions
 */
async function assertAttributeInternal(
    element: Locator | CompositeLocator,
    attributeType: string,
    description: string,
    softAssert: boolean,
    shouldExist: boolean,
    attributeValue?: string | RegExp
): Promise<void> {
    const actualElement = (typeof element === 'object' && 'locator' in element && 'name' in element) 
        ? element.locator() 
        : element;
    
    const stepName = shouldExist
        ? (attributeValue 
            ? stepMessage(description, '', `${attributeType}=${attributeValue}`)
            : stepMessage(description, '', attributeType))
        : stepMessage(description, '', `NOT ${attributeType}`);
    
    await test.step(stepName, async () => {
        await assertVisible(actualElement, description, softAssert);
        
        // Get current attribute value for logging
        const currentValue = await actualElement.getAttribute(attributeType);
        // Use longer limit for class attributes since they can have many classes
        const truncateLength = attributeType === 'class' ? 120 : 60;
        const shortValue = currentValue ? smartTruncate(currentValue, truncateLength) : 'empty/null';
        
        if (shouldExist) {
            if (attributeValue) {
                console.log(`       ✅ Assert HAS ${attributeType}="${attributeValue}" | Current: "${shortValue}"`);
            } else {
                console.log(`       ✅ Assert HAS ${attributeType} | Current: "${shortValue}"`);
            }
        } else {
            console.log(`       ❌ Assert NOT have ${attributeType} | Current: "${shortValue}"`);
        }
        
        const expectation = softAssert ? expect.soft(actualElement) : expect(actualElement);
        
        if (shouldExist) {
            if (attributeValue) {
                await expectation.toHaveAttribute(attributeType, attributeValue, { timeout: 1000 });
            } else {
                await expectation.toHaveAttribute(attributeType, { timeout: 1000 });
            }
        } else {
            await expectation.not.toHaveAttribute(attributeType, { timeout: 1000 });
        }
    });
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
        
        await assertAttributeInternal(element, attributeType, element.name, actualSoftAssert, true, actualAttributeValue);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        const actualSoftAssert = typeof softAssertOrAttributeValue === 'boolean' ? softAssertOrAttributeValue : false;
        
        await assertAttributeInternal(element, attributeType, description, actualSoftAssert, true, attributeValue);
    }
}

// Overloaded function signatures for assertAttributeNotPresent
export async function assertAttributeNotPresent(element: CompositeLocator, attributeType: string, softAssert?: boolean): Promise<void>;
export async function assertAttributeNotPresent(element: Locator, attributeType: string, description?: string, softAssert?: boolean): Promise<void>;

export async function assertAttributeNotPresent(
    element: Locator | CompositeLocator,
    attributeType: string,
    descriptionOrSoftAssert: string | boolean = 'Element',
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        await assertAttributeInternal(element, attributeType, element.name, actualSoftAssert, false);
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        await assertAttributeInternal(element, attributeType, description, softAssert, false);
    }
}

// Overloaded function signatures for assertAttributeNotContains
export async function assertAttributeNotContains(element: CompositeLocator, attributeType: string, attributeValue: string | RegExp, softAssert?: boolean): Promise<void>;
export async function assertAttributeNotContains(element: Locator, attributeType: string, attributeValue: string | RegExp, description?: string, softAssert?: boolean): Promise<void>;

export async function assertAttributeNotContains(
    element: Locator | CompositeLocator,
    attributeType: string,
    attributeValue: string | RegExp,
    descriptionOrSoftAssert: string | boolean = 'Element',
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const actualSoftAssert = typeof descriptionOrSoftAssert === 'boolean' ? descriptionOrSoftAssert : false;
        
        await test.step(stepMessage(element.name, '', `${attributeType} NOT containing ${attributeValue}`), async () => {
            await assertVisible(element.locator(), element.name, actualSoftAssert);
            
            // Get current attribute value for logging
            const currentValue = await element.locator().getAttribute(attributeType);
            // Use longer limit for class attributes since they can have many classes
            const truncateLength = attributeType === 'class' ? 120 : 60;
            const shortValue = currentValue ? smartTruncate(currentValue, truncateLength) : 'empty/null';
            console.log(`       ❌ Assert NOT contains "${attributeValue}" | Current: "${shortValue}"`);
            
            const expectation = actualSoftAssert ? expect.soft(element.locator()) : expect(element.locator());
            await expectation.not.toHaveAttribute(attributeType, attributeValue, { timeout: 1000 });
        });
    } else {
        const description = typeof descriptionOrSoftAssert === 'string' ? descriptionOrSoftAssert : 'Element';
        
        await test.step(stepMessage(description, '', `${attributeType} NOT containing ${attributeValue}`), async () => {
            await assertVisible(element, description, softAssert);
            
            // Get current attribute value for logging
            const currentValue = await element.getAttribute(attributeType);
            // Use longer limit for class attributes since they can have many classes
            const truncateLength = attributeType === 'class' ? 120 : 60;
            const shortValue = currentValue ? smartTruncate(currentValue, truncateLength) : 'empty/null';
            console.log(`       ❌ Assert NOT contains "${attributeValue}" | Current: "${shortValue}"`);
            
            const expectation = softAssert ? expect.soft(element) : expect(element);
            await expectation.not.toHaveAttribute(attributeType, attributeValue, { timeout: 1000 });
        });
    }
}

// Overloaded function signatures for validateAttributesNotPresent
export async function validateAttributesNotPresent(element: CompositeLocator, attributes: string[], softAssert?: boolean): Promise<void>;
export async function validateAttributesNotPresent(element: Locator, description: string, attributes: string[], softAssert?: boolean): Promise<void>;

export async function validateAttributesNotPresent(
    element: Locator | CompositeLocator,
    descriptionOrAttributes: string | string[],
    attributesOrSoftAssert?: string[] | boolean,
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const attributes = descriptionOrAttributes as string[];
        const actualSoftAssert = typeof attributesOrSoftAssert === 'boolean' ? attributesOrSoftAssert : false;
        
        await test.step(`I validate ${element.name} does NOT have these attributes`, async () => {
            for (const attributeType of attributes) {
                await assertAttributeInternal(element, attributeType, element.name, actualSoftAssert, false);
            }
        });
    } else {
        const description = descriptionOrAttributes as string;
        const attributes = attributesOrSoftAssert as string[];
        
        await test.step(`I validate ${description} does NOT have these attributes`, async () => {
            for (const attributeType of attributes) {
                await assertAttributeInternal(element, attributeType, description, softAssert, false);
            }
        });
    }
}

// Overloaded function signatures for validateAttributesNotContaining
export async function validateAttributesNotContaining(element: CompositeLocator, attributes: Record<string, string | RegExp>, softAssert?: boolean): Promise<void>;
export async function validateAttributesNotContaining(element: Locator, description: string, attributes: Record<string, string | RegExp>, softAssert?: boolean): Promise<void>;

export async function validateAttributesNotContaining(
    element: Locator | CompositeLocator,
    descriptionOrAttributes: string | Record<string, string | RegExp>,
    attributesOrSoftAssert?: Record<string, string | RegExp> | boolean,
    softAssert = false
): Promise<void> {
    if (typeof element === 'object' && 'locator' in element && 'name' in element) {
        const attributes = descriptionOrAttributes as Record<string, string | RegExp>;
        const actualSoftAssert = typeof attributesOrSoftAssert === 'boolean' ? attributesOrSoftAssert : false;
        
        await test.step(`I validate ${element.name} does NOT contain these attribute values`, async () => {
            for (const [attributeType, attributeValue] of Object.entries(attributes)) {
                await assertAttributeNotContains(element, attributeType, attributeValue, actualSoftAssert);
            }
        });
    } else {
        const description = descriptionOrAttributes as string;
        const attributes = attributesOrSoftAssert as Record<string, string | RegExp>;
        
        await test.step(`I validate ${description} does NOT contain these attribute values`, async () => {
            for (const [attributeType, attributeValue] of Object.entries(attributes)) {
                await assertAttributeNotContains(element, attributeType, attributeValue, description, softAssert);
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

/**
 * Generic validation types for element map validation
 */
export type ElementValidationType = 'visibility' | 'containsText' | 'attribute' | 'enabled' | 'editable';

export type ElementMapValidationOptions = {
    validationType: ElementValidationType;
    softAssert?: boolean;
    textToValidate?: string;
    attributeType?: string;
    attributeValue?: string | RegExp;
};

/**
 * Generic method to validate element maps with any number of CompositeLocators
 * 
 * @param elementsMap - Map of elements with any number of CompositeLocators
 * @param elementKey - Key of the element to validate
 * @param options - Validation options including type and parameters
 */
export async function validateElementMapByKey<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    elementKey: keyof T,
    options: ElementMapValidationOptions
): Promise<void> {
    const elementGroup = elementsMap[elementKey];
    const { validationType, softAssert = false, textToValidate, attributeType, attributeValue } = options;

    // Convert to array of CompositeLocators regardless of input format
    const compositeLocators: CompositeLocator[] = Array.isArray(elementGroup) 
        ? elementGroup 
        : Object.values(elementGroup);

    // Get all CompositeLocator names for better step description
    const locatorNames = compositeLocators.map(locator => locator.name).join(', ');
    
    await test.step(`I validate ${String(elementKey)} elements: ${locatorNames} (${validationType})`, async () => {
        // Iterate through all CompositeLocators in the element group
        for (const compositeLocator of compositeLocators) {
            switch (validationType) {
                case 'visibility':
                    await assertVisible(compositeLocator, softAssert);
                    break;
                    
                case 'containsText':
                    if (!textToValidate) {
                        throw new Error('textToValidate is required for containsText validation');
                    }
                    await assertElementContainsText(compositeLocator, textToValidate, softAssert);
                    break;
                    
                case 'attribute':
                    if (!attributeType) {
                        throw new Error('attributeType is required for attribute validation');
                    }
                    await assertAttribute(compositeLocator, attributeType, softAssert, attributeValue);
                    break;
                    
                case 'enabled':
                    await assertEnabled(compositeLocator, softAssert);
                    break;
                    
                case 'editable':
                    await assertEditable(compositeLocator, softAssert);
                    break;
                    
                default:
                    throw new Error(`Unsupported validation type: ${validationType}`);
            }
        }
    });
}

/**
 * Validate all elements in a map with the same validation type
 * 
 * @param elementsMap - Map of elements with any number of CompositeLocators
 * @param options - Validation options including type and parameters
 */
export async function validateAllElementsInMap<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    options: ElementMapValidationOptions
): Promise<void> {
    await test.step(`I validate all elements in map (${options.validationType})`, async () => {
        for (const elementKey of Object.keys(elementsMap) as Array<keyof T>) {
            await validateElementMapByKey(elementsMap, elementKey, options);
        }
    });
}

/**
 * Convenience method for visibility validation of element maps
 */
export async function validateElementMapVisibility<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    elementKey: keyof T,
    softAssert = false
): Promise<void> {
    await validateElementMapByKey(elementsMap, elementKey, {
        validationType: 'visibility',
        softAssert
    });
}

/**
 * Convenience method for text content validation of element maps
 */
export async function validateElementMapContainsText<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    elementKey: keyof T,
    textToValidate: string,
    softAssert = false
): Promise<void> {
    await validateElementMapByKey(elementsMap, elementKey, {
        validationType: 'containsText',
        textToValidate,
        softAssert
    });
}

/**
 * Convenience method for attribute validation of element maps
 */
export async function validateElementMapAttribute<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    elementKey: keyof T,
    attributeType: string,
    attributeValue?: string | RegExp,
    softAssert = false
): Promise<void> {
    await validateElementMapByKey(elementsMap, elementKey, {
        validationType: 'attribute',
        attributeType,
        attributeValue,
        softAssert
    });
}

/**
 * Convenience method for bulk visibility validation of all elements in a map
 */
export async function validateAllElementsVisibility<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    softAssert = false
): Promise<void> {
    await validateAllElementsInMap(elementsMap, {
        validationType: 'visibility',
        softAssert
    });
}

/**
 * Get text content from element map by key and locator name/index
 */
export async function getElementMapText<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    elementKey: keyof T,
    locatorKey: string | number
): Promise<string> {
    const elementGroup = elementsMap[elementKey];
    
    let compositeLocator: CompositeLocator;
    
    if (Array.isArray(elementGroup)) {
        if (typeof locatorKey !== 'number') {
            throw new Error(`For array element groups, locatorKey must be a number index. Got: ${locatorKey}`);
        }
        compositeLocator = elementGroup[locatorKey];
    } else {
        if (typeof locatorKey !== 'string') {
            throw new Error(`For object element groups, locatorKey must be a string key. Got: ${locatorKey}`);
        }
        compositeLocator = elementGroup[locatorKey];
    }
    
    if (!compositeLocator) {
        throw new Error(`Locator '${locatorKey}' not found in element '${String(elementKey)}'`);
    }
    
    return await test.step(`I get text from ${compositeLocator.name}`, async () => {
        await assertVisible(compositeLocator);
        return await compositeLocator.locator().textContent() ?? '';
    });
}

/**
 * Get all text content from all locators in an element group
 */
export async function getAllElementMapTexts<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    elementKey: keyof T
): Promise<Record<string | number, string>> {
    const elementGroup = elementsMap[elementKey];
    const result: Record<string | number, string> = {};
    
    if (Array.isArray(elementGroup)) {
        for (let i = 0; i < elementGroup.length; i++) {
            result[i] = await elementGroup[i].locator().textContent() ?? '';
        }
    } else {
        for (const [locatorKey, compositeLocator] of Object.entries(elementGroup)) {
            result[locatorKey] = await compositeLocator.locator().textContent() ?? '';
        }
    }
    
    return result;
}

/**
 * Get all values from entire element map as nested object
 */
export async function getAllElementMapValues<T extends Record<string, Record<string, CompositeLocator>>>(
    elementsMap: T
): Promise<Record<keyof T, Record<string, string>>> {
    const result = {} as Record<keyof T, Record<string, string>>;
    
    for (const key of Object.keys(elementsMap) as Array<keyof T>) {
        result[key] = await getAllElementMapTexts(elementsMap, key);
    }
    
    return result;
}

/**
 * Overloaded function signatures for validateAttributes
 */
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
                await assertAttributeInternal(element, attributeType, element.name, actualSoftAssert, true, attributeValue || undefined);
            }
        });
    } else {
        const description = descriptionOrAttributes as string;
        const attributes = attributesOrSoftAssert as Record<string, string | null>;
        
        await test.step(`I validate ${description} has the correct attributes`, async () => {
            for (const [attributeType, attributeValue] of Object.entries(attributes)) {
                await assertAttributeInternal(element, attributeType, description, softAssert, true, attributeValue || undefined);
            }
        });
    }
}

/**
 * Debug function to log full attribute values without truncation
 * Use this when you need to see complete class strings for debugging
 */
export async function debugElementAttributes(
    elements: CompositeLocator[],
    attributeType = 'class'
): Promise<void> {
    console.log(`\n🐛 DEBUG: Full ${attributeType} attributes:`);
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const fullValue = await element.locator().getAttribute(attributeType);
        console.log(`   [${i}] ${element.name}:`);
        console.log(`       Full ${attributeType}: "${fullValue || 'empty/null'}"`);
    }
    console.log(`🐛 DEBUG COMPLETE\n`);
}

/**
 * Helper function to create a RegExp that matches CSS classes containing all specified classes
 * This is useful for validating that an element has certain CSS classes without requiring exact match
 * Uses a simpler approach that should work better with Playwright's regex handling
 */
export function createClassContainsRegex(requiredClasses: string[]): RegExp {
    // For a single class, use a simple pattern
    if (requiredClasses.length === 1) {
        const escapedClass = requiredClasses[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?:^|\\s)${escapedClass}(?:\\s|$)`);
        console.log(`       🔧 CSS regex: [${requiredClasses.join(', ')}] → ${regex}`);
        return regex;
    }
    
    // For multiple classes, check each one exists as standalone
    const patterns = requiredClasses.map(cls => {
        const escapedClass = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return `(?:^|\\s)${escapedClass}(?:\\s|$)`;
    });
    const regex = new RegExp(patterns.join('.*'));
    
    console.log(`       🔧 CSS regex: [${requiredClasses.join(', ')}] → ${regex}`);
    
    return regex;
}

/**
 * Validates that an element's attribute contains all specified values
 * Useful for CSS classes where you want to check specific classes are present
 * without requiring exact string match
 */
export async function assertAttributeContains(element: CompositeLocator, attributeType: string, requiredValues: string[], softAssert?: boolean): Promise<void>;

export async function assertAttributeContains(
    element: CompositeLocator,
    attributeType: string,
    requiredValues: string[],
    softAssert = false
): Promise<void> {
    const regex = createClassContainsRegex(requiredValues);
    await assertAttributeInternal(element, attributeType, element.name, softAssert, true, regex);
}

/**
 * Validates that multiple elements have attributes containing specified values
 * Bulk version of assertAttributeContains
 */
export async function validateAttributesContaining(element: CompositeLocator, attributes: Record<string, string[]>, softAssert?: boolean): Promise<void>;

export async function validateAttributesContaining(
    element: CompositeLocator,
    attributes: Record<string, string[]>,
    softAssert = false
): Promise<void> {
    await test.step(`I validate ${element.name} contains these attribute values`, async () => {
        for (const [attributeType, requiredValues] of Object.entries(attributes)) {
            await assertAttributeContains(element, attributeType, requiredValues, softAssert);
        }
    });
}

/**
 * Helper function to validate that an element is not active
 * Handles empty attributes gracefully and uses manual regex checking for reliability
 */
async function validateElementNotActive(
    element: CompositeLocator,
    activeAttributeType: string,
    activeAttributeValue: string | RegExp,
    pattern: RegExp,
    softAssert: boolean
): Promise<void> {
    if (typeof activeAttributeValue === 'string') {
        const attributeExists = await element.locator().getAttribute(activeAttributeType);
        // Use longer limit for class attributes since they can have many classes
        const truncateLength = activeAttributeType === 'class' ? 120 : 60;
        const shortValue = attributeExists ? smartTruncate(attributeExists, truncateLength) : 'empty/null';
        
        console.log(`       Current ${activeAttributeType}: "${shortValue}"`);
        
        if (!attributeExists || attributeExists.trim() === '') {
            console.log(`       ✅ Empty attribute = NOT active`);
            await test.step(`Expect ${element.name} to be ${activeAttributeType} NOT containing ${activeAttributeValue} (empty attribute)`, async () => {
                // No assertion needed - empty attribute means element is not active
            });
        } else {
            // Manual regex check for better reliability than Playwright's regex handling
            const matches = pattern.test(attributeExists);
            console.log(`       🔍 Manual regex check: ${matches ? 'MATCHES' : 'NO MATCH'} (expected: NO MATCH)`);
            
            await test.step(`Expect ${element.name} to NOT have standalone ${activeAttributeValue} class`, async () => {
                const expectation = softAssert ? expect.soft : expect;
                await expectation(!matches, `Element ${element.name} should NOT have standalone ${activeAttributeValue} class, but found: "${attributeExists}"`).toBe(true);
            });
        }
    } else {
        // For RegExp activeAttributeValue, still use manual check
        const attributeExists = await element.locator().getAttribute(activeAttributeType);
        const matches = attributeExists ? pattern.test(attributeExists) : false;
        console.log(`       🔍 Manual regex check: ${matches ? 'MATCHES' : 'NO MATCH'} (expected: NO MATCH)`);
        
        await test.step(`Expect ${element.name} to NOT match pattern`, async () => {
            const expectation = softAssert ? expect.soft : expect;
            await expectation(!matches, `Element ${element.name} should NOT match pattern, but found: "${attributeExists}"`).toBe(true);
        });
    }
}

/**
 * Validates that only one element in a group has the specified active attributes,
 * while all others do not have them. Accepts an attributes object for convenience.
 * 
 * @param elements - Array of CompositeLocator objects to check
 * @param activeElementIndex - Index of the element that should be active (0-based)
 * @param attributes - Object with attribute type as key and value as the active state indicator
 * @param softAssert - If true, uses soft assertions
 * @param groupDescription - Description for the group of elements (for logging)
 * @param debug - If true, logs full attribute values for debugging
 */
export async function validateOnlyOneElementActive(
    elements: CompositeLocator[],
    activeElementIndex: number,
    attributes: Record<string, string>,
    softAssert = false,
    groupDescription = 'elements',
    debug = false
): Promise<void> {
    // Extract the first (and expected only) attribute from the object
    const [activeAttributeType, activeAttributeValue] = Object.entries(attributes)[0];

    if (activeElementIndex < 0 || activeElementIndex >= elements.length) {
        throw new Error(`Active element index ${activeElementIndex} is out of bounds for ${elements.length} elements`);
    }

    await test.step(`I validate only ${elements[activeElementIndex].name} is active among ${groupDescription}`, async () => {
        if (debug) {
            await debugElementAttributes(elements, activeAttributeType);
        }
        
        console.log(`\n🎯 GROUP VALIDATION: ${groupDescription.toUpperCase()}`);
        console.log(`   Expected ACTIVE: ${elements[activeElementIndex].name} (index ${activeElementIndex})`);
        console.log(`   Attribute check: ${activeAttributeType} = "${activeAttributeValue}"`);
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const isActiveElement = i === activeElementIndex;
            
            // Convert string patterns to regex for consistent handling
            const pattern = createClassContainsRegex([activeAttributeValue]);
            
            console.log(`\n   [${i}] ${element.name} → Expected: ${isActiveElement ? '🟢 ACTIVE' : '🔴 INACTIVE'}`);
            
            if (isActiveElement) {
                const currentValue = await element.locator().getAttribute(activeAttributeType);
                // Use longer limit for class attributes since they can have many classes
                const truncateLength = activeAttributeType === 'class' ? 120 : 60;
                const shortValue = currentValue ? smartTruncate(currentValue, truncateLength) : 'empty/null';
                console.log(`       Current ${activeAttributeType}: "${shortValue}"`);
                await assertAttribute(element, activeAttributeType, softAssert, pattern);
            } else {
                await validateElementNotActive(element, activeAttributeType, activeAttributeValue, pattern, softAssert);
            }
        }
        console.log(`🎯 GROUP VALIDATION COMPLETE\n`);
    });
}

/**
 * Validates toggle behavior between two elements where clicking one makes it active
 * and the other inactive. Common pattern for binary choices, on/off switches, etc.
 * 
 * @param elementA - First element in the toggle pair
 * @param elementB - Second element in the toggle pair
 * @param attributes - Object with attribute type as key and value as the active state indicator
 * @param initialActiveElement - Which element should be active initially ('A' or 'B')
 * @param softAssert - If true, uses soft assertions
 * @param toggleDescription - Description for the toggle pair (for logging)
 */
export async function validateToggleBetweenTwoElements(
    elementA: CompositeLocator,
    elementB: CompositeLocator,
    attributes: Record<string, string>,
    initialActiveElement: 'A' | 'B',
    softAssert = false,
    toggleDescription = 'toggle elements'
): Promise<void> {
    await test.step(`I validate toggle behavior between ${elementA.name} and ${elementB.name}`, async () => {
        // Validate initial state
        const elements = [elementA, elementB];
        const initialActiveIndex = initialActiveElement === 'A' ? 0 : 1;
        
        await validateOnlyOneElementActive(
            elements,
            initialActiveIndex,
            attributes,
            softAssert,
            toggleDescription
        );

        // Click the inactive element and validate the toggle
        const elementToClick = initialActiveElement === 'A' ? elementB : elementA;
        const newActiveIndex = initialActiveElement === 'A' ? 1 : 0;
        
        await clickElement(elementToClick);
        
        await validateOnlyOneElementActive(
            elements,
            newActiveIndex,
            attributes,
            softAssert,
            toggleDescription
        );
    });
}

/**
 * Helper function to truncate strings at word boundaries for better readability
 */
function smartTruncate(text: string, maxLength = 50): string {
    if (!text || text.length <= maxLength) {
        return text;
    }
    
    // Find the last space before the max length
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    // If we found a space and it's not too close to the beginning, use it
    if (lastSpace > maxLength * 0.6) {
        return text.substring(0, lastSpace) + '...';
    }
    
    // Otherwise, just truncate and add ellipsis
    return truncated + '...';
}