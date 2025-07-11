/// <reference lib="dom" />
import { test } from '@playwright/test';
import { CompositeLocator } from './core-types';
import { assertVisible } from './assertions';

/**
 * @fileoverview Text extraction utilities for test automation
 * 
 * This module provides hierarchical text extraction capabilities for
 * retrieving text content from individual elements and element groups.
 * All functions in this module are focused purely on text extraction
 * without any validation or assertion logic.
 */

/**
 * Extract text from a single element with visibility validation
 * 
 * @param element - The element to extract text from
 * @returns Promise resolving to the element's text content
 * 
 * @example
 * ```typescript
 * const text = await getText(button);
 * // Returns: "Submit"
 * ```
 */
export async function getText(element: CompositeLocator): Promise<string> {
    return await test.step(`Get text from ${element.name}`, async () => {
        await assertVisible(element);
        return await element.locator().textContent() ?? '';
    });
}

/**
 * Extract text from all elements in a single group (no visibility check for performance)
 * 
 * @param elementsMap - The map containing element groups
 * @param elementKey - The key of the specific group to extract texts from
 * @returns Promise resolving to a record of locator keys to text content
 * 
 * @example
 * ```typescript
 * const buttonTexts = await getGroupTexts(elementsMap, 'buttons');
 * // Returns: { submit: "Submit", cancel: "Cancel", reset: "Reset" }
 * ```
 */
export async function getGroupTexts<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
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
 * Extract text from all elements in all groups (convenience function)
 * 
 * @param elementsMap - The complete map of element groups
 * @returns Promise resolving to nested record of all text content
 * 
 * @example
 * ```typescript
 * const allTexts = await getAllGroupTexts(elementsMap);
 * // Returns: { 
 * //   buttons: { submit: "Submit", cancel: "Cancel" },
 * //   links: { home: "Home", about: "About" }
 * // }
 * ```
 */
export async function getAllGroupTexts<T extends Record<string, Record<string, CompositeLocator>>>(
    elementsMap: T
): Promise<Record<keyof T, Record<string | number, string>>> {
    const result = {} as Record<keyof T, Record<string | number, string>>;
    
    for (const key of Object.keys(elementsMap) as Array<keyof T>) {
        result[key] = await getGroupTexts(elementsMap, key);
    }
    
    return result;
}

/**
 * Extract text from a specific element within a group (convenience + validation)
 * 
 * @param elementsMap - The map containing element groups  
 * @param elementKey - The key of the group
 * @param locatorKey - The key/index of the specific element
 * @returns Promise resolving to the element's text content
 * 
 * @example
 * ```typescript
 * const submitText = await getElementText(elementsMap, 'buttons', 'submit');
 * // Returns: "Submit"
 * ```
 */
export async function getElementText<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
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
    
    return await getText(compositeLocator);
}
