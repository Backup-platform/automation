/// <reference lib="dom" />
import { test, expect } from '@playwright/test';
import { CompositeLocator } from './core-types';

/**
 * @fileoverview Unified assertion system for single element validations
 * 
 * This module provides a flexible, composable assertion engine for individual elements.
 * It eliminates redundancy by using a unified approach to single element state validation.
 * 
 * Multi-element group assertions have been moved to element-groups.ts where they
 * belong logically with other group-based operations.
 */

type AssertionType = 'visible' | 'enabled' | 'editable';
type AssertionMode = 'positive' | 'negative';

function stepMessage(description: string, action: string, state?: string) {
    return `Expect ${description} to${action ? ' ' + action : ''}${state ? ' be ' + state : ''}`.replace(/  +/g, ' ');
}

/**
 * Unified assertion engine that handles all element state validations.
 * This replaces all individual assertXXX functions with a single, flexible system.
 * 
 * @param element - The composite locator element to assert against
 * @param assertionType - Type of assertion to perform
 * @param mode - Whether to assert positive or negative condition
 * @param description - Optional custom description for the assertion
 * @param softAssert - Whether to use soft assertions (don't fail test immediately)
 */
export async function assertElementState(
    element: CompositeLocator,
    assertionType: AssertionType,
    mode: AssertionMode = 'positive',
    description?: string,
    softAssert = false
): Promise<void> {
    const locator = element.locator();
    const elementName = description || element.name;
    
    const action = mode === 'negative' ? 'NOT' : '';
    const message = stepMessage(elementName, action, assertionType);
    const assertionExpected = softAssert ? expect.soft : expect;

    const assertionMap = {
        visible: {
            positive: async () => await assertionExpected(locator, message).toBeVisible(),
            negative: async () => await assertionExpected(locator, message).not.toBeVisible(),
        },
        enabled: {
            positive: async () => await assertionExpected(locator, message).toBeEnabled(),
            negative: async () => await assertionExpected(locator, message).not.toBeEnabled(),
        },
        editable: {
            positive: async () => await assertionExpected(locator, message).toBeEditable(),
            negative: async () => await assertionExpected(locator, message).not.toBeEditable(),
        },
    };

    await test.step(message, async () => {
        await assertionMap[assertionType][mode]();
    });
}

/**
 * Multi-assertion function that validates multiple states at once.
 * This eliminates the need for separate "AndAlso" style functions.
 * 
 * @param element - The composite locator element to assert against
 * @param assertions - Array of assertion configurations to validate
 * @param softAssert - Whether to use soft assertions for all validations
 */
export async function assertElementStates(
    element: CompositeLocator,
    assertions: Array<{
        type: AssertionType;
        mode?: AssertionMode;
        description?: string;
    }>,
    softAssert = false
): Promise<void> {
    const elementName = element.name;
    
    await test.step(`Validate multiple states for ${elementName}`, async () => {
        for (const assertion of assertions) {
            await assertElementState(
                element,
                assertion.type,
                assertion.mode || 'positive',
                assertion.description,
                softAssert
            );
        }
    });
}

/**
 * Convenience functions built on the unified assertion engine.
 * These provide simple, commonly-used assertion patterns while leveraging
 * the power and consistency of the underlying unified system.
 */

export async function assertVisible(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementState(element, 'visible', 'positive', undefined, softAssert);
}

export async function assertNotVisible(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementState(element, 'visible', 'negative', undefined, softAssert);
}

export async function assertEditable(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementState(element, 'editable', 'positive', undefined, softAssert);
}

export async function assertNotEditable(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementState(element, 'editable', 'negative', undefined, softAssert);
}

export async function assertEnabled(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementState(element, 'enabled', 'positive', undefined, softAssert);
}

export async function assertNotEnabled(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementState(element, 'enabled', 'negative', undefined, softAssert);
}

/**
 * Common multi-state assertion patterns built on the unified engine.
 * These combine multiple assertions into single, semantic operations.
 */
export async function assertVisibleAndEnabled(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementStates(element, [
        { type: 'visible' },
        { type: 'enabled' }
    ], softAssert);
}

export async function assertVisibleAndEditable(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementStates(element, [
        { type: 'visible' },
        { type: 'editable' }
    ], softAssert);
}

export async function assertInteractive(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertElementStates(element, [
        { type: 'visible' },
        { type: 'enabled' },
        { type: 'editable' }
    ], softAssert);
}

export async function assertVisibleNotActionable(element: CompositeLocator, softAssert = false): Promise<void> {
    // First, assert the element is visible using the unified assertion engine
    await assertElementState(element, 'visible', 'positive', undefined, softAssert);

    // Then explicitly verify the element is not actionable (covered by overlay)
    await test.step(`Validate ${element.name} is visible but not actionable`, async () => {
        const locator = element.locator();
        const assertionExpected = softAssert ? expect.soft : expect;

        const isActionable = await locator
            .click({ trial: true, timeout: 1000 })
            .then(() => true)
            .catch(() => false);

        await assertionExpected(isActionable, `${element.name} should NOT be actionable (covered by overlay)`).toBe(false);
    });
}

/**
 * Single element text content assertions
 */

/**
 * Assert that an individual element contains specific text
 * 
 * @param element - The element to check (CompositeLocator)
 * @param text - The text that should be contained in the element
 * @param soft - Whether to use soft assertions (don't fail test immediately)
 * 
 * @example
 * ```typescript
 * await assertElementContainsText(button, 'Submit', false);
 * ```
 */
export async function assertElementContainsText(
    element: CompositeLocator, 
    text: string, 
    soft = false
): Promise<void> {
    await test.step(`Validate ${element.name} contains text: ${text}`, async () => {
        await assertVisible(element, soft);
        const assertion = soft ? expect.soft : expect;
        await assertion(element.locator()).toContainText(text, { timeout: 1000 });
    });
}
