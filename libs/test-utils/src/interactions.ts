/// <reference lib="dom" />
import { test } from '@playwright/test';
import { CompositeLocator } from './core-types';
import { assertElementStates } from './assertions';
import { validateAttributesExact, validateAttributesExist, compareAttributeValues } from './attributes';

/**
 * 
 * This module provides a unified, configurable interaction engine that eliminates
 * redundancy by consolidating multiple similar interaction functions into flexible,
 * composable patterns. It supports validation, chaining, and conditional interactions.
 * 
 */

type InteractionOptions = {
    skipValidation?: boolean;
    preValidations?: Array<{
        type: 'visible' | 'enabled' | 'editable';
        mode?: 'positive' | 'negative';
    }>;
    force?: boolean;
    timeout?: number;
    softAssert?: boolean;
};

type ClickOptions = InteractionOptions & {
    button?: 'left' | 'right' | 'middle';
    clickCount?: number;
    modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[];
};

type FillOptions = InteractionOptions & {
    clear?: boolean;
    selectAll?: boolean;
};

/**
 * Unified click function that handles validation and interaction patterns.
 * This replaces multiple similar click functions with a single, configurable one.
 * 
 * @param element - The composite locator element to click
 * @param options - Configuration options for the click interaction
 */
export async function clickElement(
    element: CompositeLocator, 
    options: ClickOptions = {}
): Promise<void> {
    const { 
        skipValidation = false,
        preValidations = [{ type: 'visible' }],
        force = false,
        button = 'left',
        clickCount = 1,
        modifiers = [],
        softAssert = false
    } = options;

    await test.step(`Click on ${element.name}`, async () => {
        // Pre-click validations
        if (!skipValidation && preValidations.length > 0) {
            await assertElementStates(element, preValidations, softAssert);
        }

        // Perform the click
        await element.locator().click({
            button,
            clickCount,
            modifiers,
            force
        });
    });
}

/**
 * Unified fill function that handles validation and fill patterns.
 * This replaces multiple similar fill functions with a single, configurable one.
 * 
 * @param element - The composite locator element to fill
 * @param value - The text value to fill into the element
 * @param options - Configuration options for the fill interaction
 */
export async function fillElement(
    element: CompositeLocator, 
    value: string,
    options: FillOptions = {}
): Promise<void> {
    const {
        skipValidation = false,
        preValidations = [{ type: 'visible' }, { type: 'editable' }],
        clear = false,
        selectAll = false,
        force = false,
        softAssert = false
    } = options;

    await test.step(`Fill ${element.name} with '${value}'`, async () => {
        // Pre-fill validations
        if (!skipValidation && preValidations.length > 0) {
            await assertElementStates(element, preValidations, softAssert);
        }

        // Clear or select all if requested
        if (clear) {
            await element.locator().clear();
        } else if (selectAll) {
            await element.locator().selectText();
        }

        // Perform the fill
        await element.locator().fill(value, { force });
    });
}

/**
 * Unified interaction function for complex patterns.
 * This enables chaining multiple interactions with shared validation.
 * 
 * @param interactions - Array of interaction configurations to execute in sequence
 * @param globalOptions - Global options applied to all interactions in the chain
 */
export async function performInteractionChain(
    interactions: Array<{
        element: CompositeLocator;
        action: 'click' | 'fill' | 'hover' | 'focus';
        value?: string;
        options?: InteractionOptions;
    }>,
    globalOptions: InteractionOptions = {}
): Promise<void> {
    await test.step('Perform interaction chain', async () => {
        for (const interaction of interactions) {
            const mergedOptions = { ...globalOptions, ...interaction.options };
            
            switch (interaction.action) {
                case 'click':
                    await clickElement(interaction.element, mergedOptions);
                    break;
                case 'fill':
                    if (interaction.value !== undefined) {
                        await fillElement(interaction.element, interaction.value, mergedOptions);
                    }
                    break;
                case 'hover':
                    await hoverElement(interaction.element, mergedOptions);
                    break;
                case 'focus':
                    await focusElement(interaction.element, mergedOptions);
                    break;
            }
        }
    });
}

/**
 * Additional interaction patterns for extended functionality.
 */

export async function hoverElement(
    element: CompositeLocator,
    options: InteractionOptions = {}
): Promise<void> {
    const { skipValidation = false, preValidations = [{ type: 'visible' }], softAssert = false } = options;

    await test.step(`Hover over ${element.name}`, async () => {
        if (!skipValidation && preValidations.length > 0) {
            await assertElementStates(element, preValidations, softAssert);
        }
        await element.locator().hover();
    });
}

export async function focusElement(
    element: CompositeLocator,
    options: InteractionOptions = {}
): Promise<void> {
    const { skipValidation = false, preValidations = [{ type: 'visible' }], softAssert = false } = options;

    await test.step(`Focus on ${element.name}`, async () => {
        if (!skipValidation && preValidations.length > 0) {
            await assertElementStates(element, preValidations, softAssert);
        }
        await element.locator().focus();
    });
}

export async function selectOption(
    element: CompositeLocator,
    option: string | string[],
    options: InteractionOptions = {}
): Promise<void> {
    const { skipValidation = false, preValidations = [{ type: 'visible' }, { type: 'enabled' }], softAssert = false } = options;

    await test.step(`Select option '${option}' from ${element.name}`, async () => {
        if (!skipValidation && preValidations.length > 0) {
            await assertElementStates(element, preValidations, softAssert);
        }
        await element.locator().selectOption(option);
    });
}

/**
 * Convenience functions built on the unified interaction engine.
 * These provide common interaction patterns with pre-configured options.
 */

export async function doubleClick(element: CompositeLocator, options: Omit<ClickOptions, 'clickCount'> = {}): Promise<void> {
    await clickElement(element, { ...options, clickCount: 2 });
}

export async function rightClick(element: CompositeLocator, options: Omit<ClickOptions, 'button'> = {}): Promise<void> {
    await clickElement(element, { ...options, button: 'right' });
}

export async function forceClick(element: CompositeLocator, options: ClickOptions = {}): Promise<void> {
    await clickElement(element, { ...options, force: true, skipValidation: true });
}

export async function forceFill(element: CompositeLocator, value: string, options: FillOptions = {}): Promise<void> {
    await fillElement(element, value, { ...options, force: true, skipValidation: true });
}

export async function clearAndFill(element: CompositeLocator, value: string, options: FillOptions = {}): Promise<void> {
    await fillElement(element, value, { ...options, clear: true });
}

/**
 * Click an element with retries until a result element becomes visible.
 * Use with discretion: this function is intended for elements 
 * that become visible after a click and are not 100% stable.
 *
 * @param clickElement - CompositeLocator for the element to click
 * @param resultElement - CompositeLocator for the element to validate after click
 */
export async function retryUntilCondition(
	clickElement: CompositeLocator,
	resultElement: CompositeLocator
): Promise<void> {
	await test.step(`Retry until condition: click ${clickElement.name} and wait for ${resultElement.name} to be visible`, async () => {
		const page = clickElement.locator().page();
		const maxRetries = 3;
		const retryDelay = 500;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				await test.step(`Attempt ${attempt}/${maxRetries}: click ${clickElement.name}`, async () => {
                    //TODO: check if using out of the box click vs our custom methods
					await clickElement.locator().click({ force: true });
					await resultElement.locator().waitFor({ state: 'visible', timeout: 4000 });
				});
				// Success - return early
				return;
			} catch (error) {
				if (attempt === maxRetries) {
					throw new Error(`Failed to click ${clickElement.name} and wait for ${resultElement.name} to be visible after ${maxRetries} attempts. Last error: ${(error as Error)?.message}`);
				}
				
				await test.step(`Wait ${retryDelay}ms before retry`, async () => {
					await page.waitForTimeout(retryDelay);
				});
			}
		}
	});
}

/**
 * Conditional interactions for dynamic test scenarios.
 */

/**
 * Clicks an element if visible, otherwise executes a fallback action.
 * Useful for handling dynamic UI elements that may or may not be present.
 * 
 * @param element - The composite locator element to click if visible
 * @param fallbackAction - Function to execute if element is not visible
 */
export async function clickIfVisibleOrFallback(
    element: CompositeLocator, 
    fallbackAction: () => Promise<void>
): Promise<void> {
    await test.step(`Click ${element.name} if visible`, async () => {
        const isVisible = await element.locator().isVisible();
        if (isVisible) {
            await clickElement(element, { skipValidation: true });
        } else {
            await fallbackAction();
        }
    });
}

/**
 * Generic state management function for button-based checkbox/radio/toggle implementations.
 * 
 * Handles custom components where Playwright's native .check()/.uncheck() methods don't work
 * (which only work on actual input[type="checkbox"] and input[type="radio"] elements).
 * 
 * **Logic Flow:**
 * 1. Validates that all required attributes exist on the element (fails if missing)
 * 2. Checks if element is already in the desired state (no action if true)
 * 3. If not in desired state, clicks to toggle and validates the result
 * 
 * **Error Scenarios:**
 * - Missing attributes: Fails immediately (configuration/implementation error)
 * - Inconsistent state after click: Fails test (UI bug - element doesn't toggle properly)
 * 
 * @param element - CompositeLocator for the checkbox/radio button element
 * @param targetAttributes - Record of attributes that define the desired state
 * @param stateName - The state name for logging ('checked' or 'unchecked')
 * 
 */
async function ensureButtonCheckboxState(
    element: CompositeLocator,
    targetAttributes: Record<string, string>,
    stateName: 'checked' | 'unchecked'
): Promise<void> {
    await test.step(`Ensure ${element.name} is ${stateName}`, async () => {

        await validateAttributesExist(element, Object.keys(targetAttributes), false);
        
        const isInDesiredState = await compareAttributeValues(element, targetAttributes);
        
        if (isInDesiredState) {
            await test.step(`${element.name} is already ${stateName}`, async () => {
                return;
            });
        } else {
            await test.step(`${element.name} is not ${stateName} - clicking to change state`, async () => {
                await clickElement(element, { skipValidation: true });
            });

            await test.step('Validate state changed successfully', async () => {
                await validateAttributesExact(element, targetAttributes, false);
            });
        }
    });
}

/**
 * Ensures a button-based checkbox/toggle is in the checked state.
 * 
 * For custom components where Playwright's .check() doesn't work (only works on input[type="checkbox"]).
 * Validates current state and only clicks if not already checked (idempotent operation).
 * 
 * @param element - CompositeLocator for the checkbox-like button
 * @param checkedAttributes - Record of attributes that indicate checked state
 * 
 * @example
 * ```typescript
 * // Standard data attributes
 * await ensureButtonCheckboxIsChecked(myCheckbox, {
 *   'data-state': 'checked',
 *   'aria-checked': 'true'
 * });
 * 
 * // Custom framework attributes
 * await ensureButtonCheckboxIsChecked(toggleSwitch, {
 *   'data-checked': 'true',
 *   'class': 'toggle--active'
 * });
 * ```
 */
export async function ensureButtonCheckboxIsChecked(
    element: CompositeLocator,
    checkedAttributes: Record<string, string>
): Promise<void> {
    await ensureButtonCheckboxState(element, checkedAttributes, 'checked');
}

/**
 * Ensures a button-based checkbox/toggle is in the unchecked state.
 * 
 * For custom components where Playwright's .uncheck() doesn't work (only works on input[type="checkbox"]).
 * Validates current state and only clicks if not already unchecked (idempotent operation).
 * 
 * @param element - CompositeLocator for the checkbox-like button
 * @param uncheckedAttributes - Record of attributes that indicate unchecked state
 * 
 * @example
 * ```typescript
 * // Standard data attributes
 * await ensureButtonCheckboxIsUnchecked(myCheckbox, {
 *   'data-state': 'unchecked',
 *   'aria-checked': 'false'
 * });
 * 
 * // Custom framework attributes
 * await ensureButtonCheckboxIsUnchecked(toggleSwitch, {
 *   'data-checked': 'false',
 *   'class': 'toggle--inactive'
 * });
 * ```
 */
export async function ensureButtonCheckboxIsUnchecked(
    element: CompositeLocator,
    uncheckedAttributes: Record<string, string>
): Promise<void> {
    await ensureButtonCheckboxState(element, uncheckedAttributes, 'unchecked');
}
