/// <reference lib="dom" />
import { test, expect } from '@playwright/test';
import { CompositeLocator, ElementMapValidationOptions } from './core-types';
import { assertVisible, assertEnabled, assertEditable } from './assertions';
import { clickElement } from './interactions';


/**
 * Comprehensive attribute and validation functions
 */

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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

function stepMessage(description: string, action: string, state?: string) {
    return `Expect ${description} to${action ? ' ' + action : ''}${state ? ' be ' + state : ''}`.replace(/  +/g, ' ');
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

// =============================================================================
// CORE ATTRIBUTE VALIDATION
// =============================================================================

/**
 * Internal helper function for attribute assertions
 */
export async function assertAttributeInternal(
    element: CompositeLocator,
    attributeType: string,
    description: string,
    softAssert: boolean,
    shouldExist: boolean,
    attributeValue?: string | RegExp
): Promise<void> {
    const actualElement = element.locator();
    
    const stepName = shouldExist
        ? (attributeValue 
            ? stepMessage(description, '', `${attributeType}=${attributeValue}`)
            : stepMessage(description, '', attributeType))
        : stepMessage(description, '', `NOT ${attributeType}`);
    
    await test.step(stepName, async () => {
        await assertVisible(element, softAssert);
        
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

export async function assertAttribute(element: CompositeLocator, attributeType: string, softAssert?: boolean, attributeValue?: string | RegExp): Promise<void> {
    const actualSoftAssert = typeof softAssert === 'boolean' ? softAssert : false;
    const actualAttributeValue = attributeValue;
    
    await assertAttributeInternal(element, attributeType, element.name, actualSoftAssert, true, actualAttributeValue);
}

export async function assertAttributeNotPresent(element: CompositeLocator, attributeType: string, softAssert = false): Promise<void> {
    await assertAttributeInternal(element, attributeType, element.name, softAssert, false);
}

export async function assertAttributeNotContains(element: CompositeLocator, attributeType: string, attributeValue: string | RegExp, softAssert = false): Promise<void> {
    await test.step(stepMessage(element.name, '', `${attributeType} NOT containing ${attributeValue}`), async () => {
        await assertVisible(element, softAssert);
        
        // Get current attribute value for logging
        const currentValue = await element.locator().getAttribute(attributeType);
        // Use longer limit for class attributes since they can have many classes
        const truncateLength = attributeType === 'class' ? 120 : 60;
        const shortValue = currentValue ? smartTruncate(currentValue, truncateLength) : 'empty/null';
        console.log(`       ❌ Assert NOT contains "${attributeValue}" | Current: "${shortValue}"`);
        
        const expectation = softAssert ? expect.soft(element.locator()) : expect(element.locator());
        await expectation.not.toHaveAttribute(attributeType, attributeValue, { timeout: 1000 });
    });
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

// =============================================================================
// BULK ATTRIBUTE VALIDATION
// =============================================================================

export async function validateAttributesNotPresent(element: CompositeLocator, attributes: string[], softAssert = false): Promise<void> {
    await test.step(`I validate ${element.name} does NOT have these attributes`, async () => {
        for (const attributeType of attributes) {
            await assertAttributeInternal(element, attributeType, element.name, softAssert, false);
        }
    });
}

export async function validateAttributesNotContaining(element: CompositeLocator, attributes: Record<string, string | RegExp>, softAssert = false): Promise<void> {
    await test.step(`I validate ${element.name} does NOT contain these attribute values`, async () => {
        for (const [attributeType, attributeValue] of Object.entries(attributes)) {
            await assertAttributeNotContains(element, attributeType, attributeValue, softAssert);
        }
    });
}

export async function validateAttributes(element: CompositeLocator, attributes: Record<string, string | null>, softAssert = false): Promise<void> {
    await test.step(`I validate ${element.name} has the correct attributes`, async () => {
        for (const [attributeType, attributeValue] of Object.entries(attributes)) {
            await assertAttributeInternal(element, attributeType, element.name, softAssert, true, attributeValue || undefined);
        }
    });
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



// =============================================================================
// ELEMENT GROUP VALIDATION
// =============================================================================

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

// =============================================================================
// ELEMENT MAP VALIDATION
// =============================================================================

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
 * Asserts that an element contains specific text
 */
export async function assertElementContainsText(
    element: CompositeLocator,
    expectedText: string | RegExp,
    softAssert = false
): Promise<void> {
    await test.step(stepMessage(element.name, '', `containing text "${expectedText}"`), async () => {
        await assertVisible(element, softAssert);
        
        const expectation = softAssert ? expect.soft(element.locator()) : expect(element.locator());
        await expectation.toContainText(expectedText, { timeout: 1000 });
        
        const actualText = await element.locator().textContent();
        console.log(`       ✅ Assert contains text "${expectedText}" | Current: "${actualText ? smartTruncate(actualText, 60) : 'empty'}"`);
    });
}

// =============================================================================
// ATTRIBUTE VALIDATION FUNCTIONS
// =============================================================================
