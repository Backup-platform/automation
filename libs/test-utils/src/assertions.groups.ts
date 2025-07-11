/// <reference lib="dom" />
import { test, expect } from '@playwright/test';
import { CompositeLocator } from './core-types';
import { assertVisible } from './assertions';

/**
 * @fileoverview Group assertion utilities for test automation
 * 
 * This module provides utilities for asserting on groups of elements,
 * particularly useful for testing UI components like collections, lists,
 * and other grouped interactive elements. Focused specifically on 
 * multi-element assertions rather than attribute validation.
 * 
 * Responsibilities:
 * - Multi-element visibility assertions
 * - Group-based text content assertions
 * - Collection validation
 * 
 */

/**
 * Assert that all elements in a collection are visible
 * 
 * @param elements - Array of elements or record of elements to validate
 * @param soft - Whether to use soft assertions
 * 
 * @example
 * ```typescript
 * await validateAllElementsVisibility([button1, button2, button3]);
 * await validateAllElementsVisibility(elementsMap.buttons);
 * ```
 */
export async function validateAllElementsVisibility(
  elements: CompositeLocator[] | Record<string, CompositeLocator | { label: CompositeLocator; value: CompositeLocator }>,
  soft = false
): Promise<void> {
  await test.step('Validate all elements are visible', async () => {
    const locators: CompositeLocator[] = Array.isArray(elements)
      ? elements
      : Object.values(elements).flatMap(el => 'locator' in el ? [el] : [el.label, el.value]);

    // Import assertVisible locally to avoid circular dependency
    await Promise.all(locators.map(el => assertVisible(el, soft)));
  });
}

/**
 * Validate text content across element groups with optional scope control
 * 
 * @param elementsMap - The map containing element groups
 * @param text - The text that should be contained in elements
 * @param groupKey - Optional: validate specific group only, omit to validate all groups
 * @param soft - Whether to use soft assertions
 * 
 * @example
 * ```typescript
 * // Validate all groups contain "Button"
 * await validateGroupsContainText(elementsMap, 'Button');
 * 
 * // Validate only buttons group contains "Submit"  
 * await validateGroupsContainText(elementsMap, 'Submit', 'buttons');
 * ```
 */
export async function validateGroupsContainText<T extends Record<string, Record<string, CompositeLocator> | CompositeLocator[]>>(
    elementsMap: T,
    text: string | RegExp,
    groupKey?: keyof T,
    soft = false
): Promise<void> {
    if (groupKey !== undefined) {
        // Validate single group
        const elementGroup = elementsMap[groupKey];
        
        await test.step(`Validate ${String(groupKey)} elements contain text: ${text}`, async () => {
            const locators: CompositeLocator[] = Array.isArray(elementGroup) 
                ? elementGroup 
                : Object.values(elementGroup);

            const assertion = soft ? expect.soft : expect;
            await Promise.all(
                locators.map(el => 
                    assertion(el.locator()).toContainText(text, { timeout: 1000 })
                )
            );
        });
    } else {
        // Validate all groups
        await test.step(`Validate all elements in map contain text: ${text}`, async () => {
            const assertion = soft ? expect.soft : expect;
            const allLocators: CompositeLocator[] = [];
            
            // Flatten all groups into a single array
            for (const group of Object.values(elementsMap)) {
                if (Array.isArray(group)) {
                    allLocators.push(...group);
                } else {
                    allLocators.push(...Object.values(group));
                }
            }
            
            await Promise.all(
                allLocators.map(el =>
                    assertion(el.locator()).toContainText(text, { timeout: 1000 })
                )
            );
        });
    }
}
