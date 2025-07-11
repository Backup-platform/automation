/// <reference lib="dom" />
import { test, expect } from '@playwright/test';
import { CompositeLocator } from './core-types';
import { clickElement } from './interactions';

/**
 * @fileoverview Comprehensive attribute validation utilities for test automation
 * 
 * This module provides utilities for validating element attributes across
 * both single elements and groups of elements. This includes exact attribute
 * validation, substring matching, and complex group validation patterns.
 * 
 */

/**
 * Creates a regex pattern for matching CSS classes in a class attribute.
 * Handles proper word boundaries to avoid partial class name matches.
 * 
 * @param classes - Array of class names to match
 * @returns RegExp that matches elements containing all specified classes
 * 
 * @example
 * ```typescript
 * const regex = createClassRegex(['active', 'selected']);
 * // Matches: "btn active selected", "active tab selected", etc.
 * // Doesn't match: "inactive" or "deselected"
 * ```
 */
const createClassRegex = (classes: string[]) =>
  new RegExp(classes.map(c => `(?:^|\\s)${c.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(?:\\s|$)`).join('.*'));

/**
 * Internal helper function that validates only one element in a group has the specified active attributes.
 * This is the core logic used by the public group validation functions.
 *
 * @param elements - Array of elements to validate
 * @param activeIndex - Index of the element that should be active
 * @param activeAttr - Attribute name to check (e.g., 'class', 'aria-pressed')
 * @param activeVal - Value that indicates active state
 * @param soft - Whether to use soft assertions
 */
async function validateOnlyOneElementActive(
  elements: CompositeLocator[],
  activeIndex: number,
  activeAttr: string,
  activeVal: string,
  soft = false
): Promise<void> {
  if (activeIndex < 0 || activeIndex >= elements.length) {
    throw new Error(`Active index ${activeIndex} out of bounds for ${elements.length} elements`);
  }
  await test.step(`Validate only ${elements[activeIndex].name} is active`, async () => {
    const activeRegex = createClassRegex([activeVal]);
    const assertion = soft ? expect.soft : expect;
    await Promise.all(
      elements.map((el, i) =>
        i === activeIndex
          ? assertion(el.locator()).toHaveAttribute(activeAttr, activeRegex, { timeout: 1000 })
          : assertion(el.locator()).not.toHaveAttribute(activeAttr, activeRegex, { timeout: 1000 })
      )
    );
  });
}

/**
 * Core attribute validation - single element attribute checks
 */

export async function validateAttributes(
  locator: CompositeLocator,
  attributes: Record<string, string | RegExp | null>,
  soft = false
): Promise<void> {
  await test.step(`Validate attributes for ${locator.name}`, async () => {
    await Promise.all(
      Object.entries(attributes).map(([attr, val]) => {
        if (val === null) throw new Error(`Null attribute value for ${attr}`);
        const assertion = soft ? expect.soft : expect;
        return assertion(locator.locator()).toHaveAttribute(attr, val, { timeout: 1000 });
      })
    );
  });
}

export async function validateAttributesContaining(
  locator: CompositeLocator,
  attributes: Record<string, string>,
  soft = false
): Promise<void> {
  await test.step(`Validate attributes containing values for ${locator.name}`, async () => {
    await Promise.all(
      Object.entries(attributes).map(([attr, val]) => {
        const assertion = soft ? expect.soft : expect;
        // Use RegExp for substring match
        return assertion(locator.locator()).toHaveAttribute(attr, new RegExp(val), { timeout: 1000 });
      })
    );
  });
}

/**
 * Group element attribute validation functions
 */

/**
 * Validates that only one element in a group has the specified active attributes,
 * while all others do not have them. Useful for testing exclusive selection patterns
 * like tab groups, radio buttons, or navigation menus.
 *
 * @param elements - Array of CompositeLocator objects to validate
 * @param activeElementIndex - Index of the element that should be active (0-based)
 * @param attributes - Record with attribute type as key and value as the active state indicator
 * @param softAssert - Whether to use soft assertions (don't fail test immediately)
 * @param groupDescription - Description for the group of elements (for logging)
 */
export async function validateOnlyOneElementActiveGroup(
  elements: CompositeLocator[],
  activeElementIndex: number,
  attributes: Record<string, string>,
  softAssert = false,
  groupDescription = 'elements'
): Promise<void> {
  // Extract the first (and expected only) attribute from the object
  const [activeAttributeType, activeAttributeValue] = Object.entries(attributes)[0];
  await test.step(`Validate only ${elements[activeElementIndex].name} is active among ${groupDescription}`, async () => {
    await validateOnlyOneElementActive(
      elements,
      activeElementIndex,
      activeAttributeType,
      activeAttributeValue,
      softAssert
    );
  });
}

/**
 * Validates toggle behavior between two elements where clicking one makes it active
 * and the other inactive. Perfect for testing binary choices, on/off switches,
 * and other two-state UI components.
 *
 * @param elementA - First element in the toggle pair
 * @param elementB - Second element in the toggle pair
 * @param attributes - Record with attribute type as key and value as the active state indicator
 * @param initialActiveElement - Which element should be active initially ('A' or 'B')
 * @param softAssert - Whether to use soft assertions
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
  await test.step(`Validate toggle behavior between ${elementA.name} and ${elementB.name}`, async () => {
    const elements = [elementA, elementB];
    const initialActiveIndex = initialActiveElement === 'A' ? 0 : 1;
    await validateOnlyOneElementActiveGroup(
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
    await validateOnlyOneElementActiveGroup(
      elements,
      newActiveIndex,
      attributes,
      softAssert,
      toggleDescription
    );
  });
}




