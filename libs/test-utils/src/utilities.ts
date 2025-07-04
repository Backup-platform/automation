/// <reference lib="dom" />
import { Locator, test } from '@playwright/test';
import { fillInputField } from './interactions';
import { CompositeLocator } from './core-types';

/**
 * Utility functions that don't fit other categories
 */

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
                    day: parseInt(third).toString()                };
            } else { // DD/MM/YYYY, DD-MM-YYYY - day first
                return {
                    year: third,
                    month: getMonthName(parseInt(second)),
                    day: parseInt(first).toString()                };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    inputLocator: () => CompositeLocator, 
    fieldDescription: string, 
    stepDescription: string
): Promise<void> {
    if (fieldValue !== undefined) {
        await test.step(`I fill ${fieldDescription} with ${fieldValue}`, async () => {
            await fillInputField(inputLocator(), fieldValue);
        });
    } else {
        await test.step(`I do NOT ${stepDescription}`, async () => {
            // intentionally left blank
        });
    }
}

/**
 * Gets indices of elements that have a specific attribute value.
 *
 * @param locator - Playwright Locator of the elements to check.
 * @param attributeName - The attribute name to check.
 * @param attributeValue - The attribute value to match.
 * @returns Promise<number[]> - Array of indices where elements have the specified attribute value.
 */
export async function getIndicesByAttribute(
    locator: Locator,
    attributeName: string,
    attributeValue: string
): Promise<number[]> {
    const count = await locator.count();
    const indices: number[] = [];
    
    for (let i = 0; i < count; i++) {
        const element = locator.nth(i);
        const actualValue = await element.getAttribute(attributeName);
        if (actualValue && actualValue.includes(attributeValue)) {
            indices.push(i);
        }
    }
    
    return indices;
}
