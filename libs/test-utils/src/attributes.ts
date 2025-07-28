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
          ? assertion(el.locator()).toHaveAttribute(activeAttr, activeRegex)
          : assertion(el.locator()).not.toHaveAttribute(activeAttr, activeRegex)
      )
    );
  });
}

/**
 * Core attribute validation - single element attribute checks
 */

/**
 * Compares element attribute values against expected values.
 * Returns a boolean result indicating whether all attributes match exactly.
 * 
 * @param locator - The element to compare
 * @param attributes - Record of attribute names and their expected string values
 * @returns Promise<boolean> - true if all attributes match exactly, false otherwise
 * 
 */
export async function compareAttributeValues(
  locator: CompositeLocator,
  attributes: Record<string, string>
): Promise<boolean> {
  return await test.step(`Compare ${locator.name} attribute values`, async () => {
    const element = locator.locator();
    
    for (const [attr, expectedValue] of Object.entries(attributes)) {
      const actualValue = await element.getAttribute(attr);
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    
    return true;
  });
}

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
        return assertion(locator.locator()).toHaveAttribute(attr, val);
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
        return assertion(locator.locator()).toHaveAttribute(attr, new RegExp(val));
      })
    );
  });
}

/**
 * New explicit attribute validation methods following the assertions.ts pattern
 */

/**
 * Core attribute validation function that handles the common validation logic.
 * This is the base function used by all specific validation methods.
 * 
 * @param locator - The element to check
 * @param validationPairs - Array of [attributeName, expectedValue] pairs ready for validation
 * @param soft - Whether to use soft assertions
 * @param stepName - Custom step name for the test output
 * 
 */
async function validateAttributesCore(
  locator: CompositeLocator,
  validationPairs: Array<[string, string | RegExp]>,
  soft = false,
  stepName: string
): Promise<void> {
await test.step(stepName, async () => {
    const assertion = soft ? expect.soft : expect;    
    await Promise.all(validationPairs.map(([attr, expectedValue]) => assertion(locator.locator(), 
	  	`Validate attribute "${attr}" with value "${expectedValue}" for ${locator.name}`).
		toHaveAttribute(attr, expectedValue)));
  	});
}

/**
 * Validates that specified attributes exist on an element (regardless of their values).
 * This is the foundational check used internally by other validation methods.
 * 
 * @param locator - The element to check
 * @param attributeNames - Array of attribute names that should exist
 * @param soft - Whether to use soft assertions
 * 
 * @example
 * ```typescript
 * // Check if button has required accessibility attributes
 * await validateAttributesExist(button, ['aria-pressed', 'data-state', 'role']);
 * 
 * // This passes for any of these scenarios:
 * // <button aria-pressed="true" data-state="active" role="button">
 * // <button aria-pressed="false" data-state="" role="switch">
 * // <button aria-pressed="" data-state="inactive" role="">
 * 
 * // Use in forms to ensure required attributes are present
 * await validateAttributesExist(inputField, ['name', 'id', 'aria-describedby']);
 * ```
 */
export async function validateAttributesExist(
  locator: CompositeLocator,
  attributeNames: string[],
  soft = false
): Promise<void> {
await test.step(`Validate attributes exist for ${locator.name}`, async () => {
    const assertion = soft ? expect.soft : expect;
    
    for (const attr of attributeNames) {
		await test.step(`Check attribute "${attr}"`, async () => {
      		await assertion(locator.locator(), 
        	`Expected attribute "${attr}" to exist on ${locator.name}`).
        	toHaveAttribute(attr);
    	});
  	}
});
}

/**
 * Validates that attributes have exact matching values.
 * 
 * @param locator - The element to check
 * @param attributes - Record of attribute names and their expected exact values
 * @param soft - Whether to use soft assertions
 * 
 * @example
 * ```typescript
 * // Validate button is in exact active state
 * await validateAttributesExact(button, { 
 *   'aria-pressed': 'true', 
 *   'data-state': 'active',
 *   'class': 'btn btn-primary active'
 * });
 * 
 * // Validate form field has exact validation state
 * await validateAttributesExact(inputField, {
 *   'aria-invalid': 'false',
 *   'data-validation': 'passed'
 * });
 * 
 * // Use with RegExp for complex exact matching
 * await validateAttributesExact(element, {
 *   'data-timestamp': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
 * });
 * ```
 */
export async function validateAttributesExact(
  locator: CompositeLocator,
  attributes: Record<string, string | RegExp>,
  soft = false
): Promise<void> {
  // Convert attributes to validation pairs - values are used as-is for exact matching
  const validationPairs: Array<[string, string | RegExp]> = Object.entries(attributes);
  
  await validateAttributesCore(
    locator,
    validationPairs,
    soft,
    `Validate exact attribute values for ${locator.name}`
  );
}

/**
 * Validates that attributes contain specified substrings (partial matching).
 * 
 * @param locator - The element to check
 * @param attributes - Record of attribute names and substrings they should contain
 * @param soft - Whether to use soft assertions
 * 
 * @example
 * ```typescript
 * // Check if button has required CSS classes (partial match)
 * await validateAttributesPartial(button, { 
 *   'class': 'active',           // matches "btn btn-primary active disabled"
 *   'data-state': 'select',      // matches "multi-selected" or "pre-selected"
 *   'aria-label': 'Save'         // matches "Save Document" or "Auto-Save"
 * });
 * 
 * // Useful for dynamic attributes with changing values
 * await validateAttributesPartial(element, {
 *   'id': 'user-',              // matches "user-123", "user-456-profile"
 *   'data-testid': 'modal'       // matches "modal-dialog", "confirmation-modal"
 * });
 * 
 * // Check error states contain expected keywords
 * await validateAttributesPartial(errorField, {
 *   'aria-describedby': 'error',  // matches "field-error-123"
 *   'class': 'invalid'            // matches "form-control invalid required"
 * });
 * ```
 */
export async function validateAttributesPartial(
  locator: CompositeLocator,
  attributes: Record<string, string>,
  soft = false
): Promise<void> {
  const validationPairs: Array<[string, RegExp]> = Object.entries(attributes).map(([attr, val]) => {
    const pattern = typeof val === 'string' ? new RegExp(val) : val;
    return [attr, pattern];
  });
  
  await validateAttributesCore(
    locator,
    validationPairs,
    soft,
    `Validate partial attribute values for ${locator.name}`
  );
}


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




