/// <reference lib="dom" />
import { Locator, FrameLocator } from '@playwright/test';

/**
 * @fileoverview Core type definitions and factory functions for test automation
 * 
 * This module defines the fundamental types used throughout the test-utils library,
 * including composite locators that combine Playwright locators with descriptive names
 * for enhanced debugging and logging capabilities.
 * 
 */

/**
 * Composite locator combining a Playwright locator with a descriptive name.
 * Provides enhanced debugging and logging capabilities.
 */
export type CompositeLocator = {
    locator: () => Locator;
    name: string;
};

/**
 * Composite frame locator for iframe and frame interactions.
 * Similar to CompositeLocator but for frame-based elements.
 */
export type CompositeFrameLocator = {
    locator: () => FrameLocator;
    name: string;
};

/**
 * Supported validation types for element state checking.
 */
export type ElementValidationType = 'visibility' | 'containsText' | 'attribute' | 'enabled' | 'editable';

/**
 * Configuration options for element map validation operations.
 */
export type ElementMapValidationOptions = {
    validationType: ElementValidationType;
    softAssert?: boolean;
    textToValidate?: string;
    attributeType?: string;
    attributeValue?: string | RegExp;
};

/**
 * Creates a composite locator object with enhanced debugging capabilities.
 * Combines a Playwright locator function with a descriptive name for better
 * error messages and test step reporting.
 *
 * @param locator - Function that returns a Playwright Locator object
 * @param name - Descriptive name for logging and debugging
 * @returns Composite locator object with locator function and name
 *
 * @example
 * ```typescript
 * const loginButton = compositeLocator(
 *   () => page.locator('button#login'), 
 *   'Login Button'
 * );
 * await clickElement(loginButton);
 * ```
 */
export const compositeLocator = (locator: () => Locator, name: string): CompositeLocator => ({
    locator,
    name
});

/**
 * Creates a composite frame locator for iframe and frame interactions.
 * Similar to compositeLocator but specifically for frame-based elements.
 *
 * @param locator - Function that returns a Playwright FrameLocator object
 * @param name - Descriptive name for logging and debugging
 * @returns Composite frame locator object
 */
export const compositeFrameLocator = (locator: () => FrameLocator, name: string): CompositeFrameLocator => ({
    locator,
    name
});
