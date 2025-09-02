/// <reference lib="dom" />
import { Locator, test } from '@playwright/test';
import { fillElement } from './interactions';
import { CompositeLocator } from './core-types';

/**
 * @fileoverview Core utility functions for test automation
 * 
 * This module provides organized utility functions for common test automation
 * tasks including date parsing, conditional execution, element iteration,
 * and month name conversion. All utilities are designed to eliminate redundancy
 * and provide consistent, reliable functionality across test suites.
 * 
 * For debug utilities, see debug-config.ts
 * 
 * @example
 * ```typescript
 * // Date parsing
 * const parsed = parseDateString('25/12/2023');
 * console.log(parsed); // { year: '2023', month: 'December', day: '25' }
 * 
 * // Conditional execution
 * await executeIfDefined(userInput, fillElement, { stepDescription: 'Fill name field' });
 * ```
 */

type DateFormat = 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY';

interface ParsedDate {
    year: string;
    month: string;
    day: string;
}

/**
 * Unified date parsing function that handles multiple date formats.
 * Automatically detects format or uses specified expected format for optimization.
 * 
 * @param dateString - The date string to parse
 * @param expectedFormat - Optional expected format for performance optimization
 * @returns Parsed date object with year, month name, and day
 */
export function parseDateString(dateString: string, expectedFormat?: DateFormat): ParsedDate {
    const formats = [
        { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, format: 'DD/MM/YYYY' as const, dayIndex: 0, monthIndex: 1, yearIndex: 2 },
        { pattern: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, format: 'YYYY-MM-DD' as const, dayIndex: 2, monthIndex: 1, yearIndex: 0 },
        { pattern: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, format: 'DD-MM-YYYY' as const, dayIndex: 0, monthIndex: 1, yearIndex: 2 },
    ];

    // If expected format is specified, try that first
    if (expectedFormat) {
        const formatConfig = formats.find(f => f.format === expectedFormat);
        if (formatConfig) {
            const match = dateString.match(formatConfig.pattern);
            if (match) {
                return buildDateObject(match, formatConfig);
            }
        }
    }

    // Try all formats
    for (const formatConfig of formats) {
        const match = dateString.match(formatConfig.pattern);
        if (match) {
            return buildDateObject(match, formatConfig);
        }
    }
    
    const supportedFormats = formats.map(f => f.format).join(', ');
    throw new Error(`Unsupported date format: ${dateString}. Supported formats: ${supportedFormats}`);
}

function buildDateObject(match: RegExpMatchArray, config: {
    pattern: RegExp;
    format: DateFormat;
    dayIndex: number;
    monthIndex: number;
    yearIndex: number;
}): ParsedDate {
    const parts = match.slice(1); // Remove full match
    return {
        year: parts[config.yearIndex],
        month: getMonthName(parseInt(parts[config.monthIndex])),
        day: parseInt(parts[config.dayIndex]).toString()
    };
}

/**
 * Enhanced month name function with validation and format options.
 * 
 * @param monthNumber - Month number (1-12)
 * @param format - Output format ('long' or 'short')
 * @returns Month name in requested format
 */
export function getMonthName(monthNumber: number, format: 'long' | 'short' = 'long'): string {
    const months = {
        long: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        short: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    };
    
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error(`Invalid month number: ${monthNumber}. Must be between 1 and 12.`);
    }
    
    return months[format][monthNumber - 1];
}

/**
 * Element iteration and processing utilities.
 */

type IterationOptions = {
    description?: string;
    elementsToCheck?: number;
    continueOnError?: boolean;
    parallel?: boolean;
};

/**
 * Unified element iteration function with enhanced options.
 * Supports parallel execution, error handling, and flexible counting.
 * 
 * @param locator - Playwright locator for the elements to iterate
 * @param action - Async function to execute for each element (receives index)
 * @param options - Configuration options for iteration behavior
 */
export async function iterateElements(
    locator: Locator,
    action: (index: number) => Promise<void>,
    options: IterationOptions = {}
): Promise<void> {
    const {
        description = 'elements',
        elementsToCheck,
        continueOnError = false,
        parallel = false
    } = options;

    await test.step(`Iterate over ${description}`, async () => {
        const count = elementsToCheck ?? await locator.count();
        
        if (parallel) {
            const promises = Array.from({ length: count }, (_, i) => 
                continueOnError 
                    ? action(i).catch(error => console.warn(`Error at index ${i}:`, error))
                    : action(i)
            );
            await Promise.all(promises);
        } else {
            for (let i = 0; i < count; i++) {
                try {
                    await action(i);
                } catch (error) {
                    if (!continueOnError) throw error;
                    console.warn(`Error at index ${i}:`, error);
                }
            }
        }
    });
}

/**
 * Search criteria for element finding with discriminated union types
 */
type MatchType = 'contains' | 'equals' | 'startsWith' | 'endsWith';

type ElementSearchCriteria = 
    | { searchType: 'attribute'; attributeName: string; attributeValue: string | RegExp; matchType?: MatchType }
    | { searchType: 'text'; textContent: string | RegExp; matchType?: MatchType }
    | { searchType: 'callback'; getTextCallback: (index: number) => Promise<string>; searchText: string; matchType?: MatchType };

/**
 * Unified element finder that can search by attribute, text content, or custom callback.
 * Uses strategy pattern with discriminated union for type safety and clean API.
 * 
 * @param locator - CompositeLocator for elements to search (or total count for callback strategy)
 * @param criteria - Search criteria with strategy-specific parameters
 * @returns Array of indices for matching elements
 */
export async function findElementIndices(
    locator: CompositeLocator | number,
    criteria: ElementSearchCriteria
): Promise<number[]> {
    switch (criteria.searchType) {
        case 'attribute':
            return await findByAttribute(locator as CompositeLocator, criteria);
        case 'text':
            return await findByText(locator as CompositeLocator, criteria);
        case 'callback':
            return await findByCallback(locator as number, criteria);
        default:
            throw new Error('Invalid search type');
    }
}

/**
 * Find first element by any search strategy (convenience function).
 * 
 * @param locator - CompositeLocator for elements to search (or total count for callback strategy)
 * @param criteria - Search criteria with strategy-specific parameters
 * @returns Promise resolving to first matching index or null if none found
 */
export async function findFirstElement(
    locator: CompositeLocator | number,
    criteria: ElementSearchCriteria
): Promise<number | null> {
    const indices = await findElementIndices(locator, criteria);
    return indices.length > 0 ? indices[0] : null;
}

/**
 * Core generic element finding function that handles the common algorithm.
 * Eliminates code duplication across different search strategies.
 * 
 * @param count - Number of elements to iterate through
 * @param valueExtractor - Function that extracts the value to match from each element
 * @param expectedValue - The value to search for
 * @param matchType - How to match the values
 * @returns Array of indices for matching elements
 */
async function findElementsByValueExtractor(
    count: number,
    valueExtractor: (index: number) => Promise<string | null>,
    expectedValue: string | RegExp,
    matchType: MatchType
): Promise<number[]> {
    const expectedValueStr = expectedValue instanceof RegExp ? expectedValue.source : expectedValue;
    const stepName = `Find elements by ${matchType}: "${expectedValueStr}"`;
    
    return await test.step(stepName, async () => {
        const indices: number[] = [];
        
        for (let i = 0; i < count; i++) {
            const extractedValue = await valueExtractor(i);
            
            if (extractedValue && matchesValue(extractedValue, expectedValue, matchType)) {
                indices.push(i);
            }
        }
        
        return indices;
    });
}

// Strategy implementations - now thin wrappers around the core function
async function findByAttribute(
    compositeLocator: CompositeLocator,
    criteria: Extract<ElementSearchCriteria, { searchType: 'attribute' }>
): Promise<number[]> {
    const { attributeName, attributeValue, matchType = 'contains' } = criteria;
    const locator = compositeLocator.locator();
    const count = await locator.count();
    
    return await test.step(`Search ${compositeLocator.name} by attribute: ${attributeName}`, async () => {
        return await findElementsByValueExtractor(
            count,
            async (index: number) => {
                const element = locator.nth(index);
                return await element.getAttribute(attributeName);
            },
            attributeValue,
            matchType
        );
    });
}

async function findByText(
    compositeLocator: CompositeLocator,
    criteria: Extract<ElementSearchCriteria, { searchType: 'text' }>
): Promise<number[]> {
    const { textContent, matchType = 'contains' } = criteria;
    const locator = compositeLocator.locator();
    const count = await locator.count();
    
    return await test.step(`Search ${compositeLocator.name} by text content`, async () => {
        return await findElementsByValueExtractor(
            count,
            async (index: number) => {
                const element = locator.nth(index);
                return await element.textContent();
            },
            textContent,
            matchType
        );
    });
}

async function findByCallback(
    totalCount: number,
    criteria: Extract<ElementSearchCriteria, { searchType: 'callback' }>
): Promise<number[]> {
    const { getTextCallback, searchText, matchType = 'contains' } = criteria;
    
    return await test.step(`Search elements by callback function`, async () => {
        return await findElementsByValueExtractor(
            totalCount,
            getTextCallback,
            searchText,
            matchType
        );
    });
}

/**
 * @deprecated Use findElementIndices with searchType: 'attribute' instead
 * Kept for backward compatibility
 */
export async function getElementIndices(
    compositeLocator: CompositeLocator,
    criteria: {
        attributeName: string;
        attributeValue: string | RegExp;
        matchType?: MatchType;
    }
): Promise<number[]> {
    return await findElementIndices(compositeLocator, {
        searchType: 'attribute',
        ...criteria
    });
}

function matchesValue(actual: string, expected: string | RegExp, matchType: MatchType): boolean {
    if (expected instanceof RegExp) {
        return expected.test(actual);
    }
    
    switch (matchType) {
        case 'equals': return actual === expected;
        case 'contains': return actual.includes(expected);
        case 'startsWith': return actual.startsWith(expected);
        case 'endsWith': return actual.endsWith(expected);
        default: return actual.includes(expected);
    }
}

/**
 * Conditional execution patterns for dynamic test flows.
 */

type ConditionalOptions = {
    stepDescription?: string;
    logWhenSkipped?: boolean;
};

/**
 * Unified conditional execution function with optional context support.
 * Executes action only if value is defined, with proper context binding when needed.
 * 
 * @param value - Value to check for definition
 * @param action - Function or method to execute if value is defined
 * @param contextOrOptions - The context (this) to bind to the action, or options if no context needed
 * @param options - Configuration options for execution behavior (when context is provided)
 */
export async function executeIfDefined<T, C = object>(
    value: T | undefined,
    action: ((value: T) => Promise<void>) | ((this: C, value: T) => Promise<void>),
    contextOrOptions?: C | ConditionalOptions,
    options: ConditionalOptions = {}
): Promise<void> {
    // Determine if we're using context or just options
    const hasContext = contextOrOptions && typeof contextOrOptions === 'object' && ('page' in contextOrOptions || 'constructor' in contextOrOptions);
    const context = hasContext ? contextOrOptions as C : undefined;
    const finalOptions = hasContext ? options : (contextOrOptions as ConditionalOptions || {});
    
    const { stepDescription = 'conditional action', logWhenSkipped = true } = finalOptions;

    if (value !== undefined) {
        if (context) {
            await (action as (this: C, value: T) => Promise<void>).call(context, value);
        } else {
            await (action as (value: T) => Promise<void>)(value);
        }
    } else if (logWhenSkipped) {
        await test.step(`Skip ${stepDescription} (value undefined)`, async () => {
            // intentionally left blank
        });
    }
}

/**
 * Enhanced conditional form filling with better error handling.
 * Fills element only if value is defined, using the unified fill system.
 * 
 * @param value - Value to fill (skipped if undefined)
 * @param element - Composite locator element to fill
 * @param options - Configuration options including step description
 */
export async function fillIfDefined(
    fieldValue: string | undefined,
    element: CompositeLocator,
    options: ConditionalOptions & {
        fillOptions?: Parameters<typeof fillElement>[2];
    } = {}
): Promise<void> {
    const { stepDescription = `fill ${element.name}`, fillOptions } = options;

    await executeIfDefined(
        fieldValue,
        async (value) => {
            await fillElement(element, value, fillOptions);
        },
        { stepDescription, logWhenSkipped: options.logWhenSkipped }
    );
}

/**
 * Export compositeLocator from core-types for convenience
 */
export { compositeLocator } from './core-types';
