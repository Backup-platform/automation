/// <reference lib="dom" />
import { Locator, FrameLocator } from '@playwright/test';

/**
 * Core type definitions for navigation utilities
 */

export type CompositeLocator = {
    locator: () => Locator;
    name: string;
};

export type CompositeFrameLocator = {
    locator: () => FrameLocator;
    name: string;
};

export type ElementValidationType = 'visibility' | 'containsText' | 'attribute' | 'enabled' | 'editable';

export type ElementMapValidationOptions = {
    validationType: ElementValidationType;
    softAssert?: boolean;
    textToValidate?: string;
    attributeType?: string;
    attributeValue?: string | RegExp;
};

/**
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
export const compositeLocator = (locator: () => Locator, name: string): CompositeLocator => ({
    locator,
    name
});

export const compositeFrameLocator = (locator: () => FrameLocator, name: string): CompositeFrameLocator => ({
    locator,
    name
});
