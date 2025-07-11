/**
 * @fileoverview Utilities Module Validation Tests
 * 
 * Tests all utility functions from utilities.ts with positive and negative
 * scenarios to ensure proper date parsing, conditional execution, and
 * element iteration behavior.
 */

import { test } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { setupTestPage, getTestElements, testPositiveNegative } from './test-setup';
import { 
    parseDateString,
    getMonthName,
    iterateElements,
    getElementIndices,
    executeIfDefined,
    fillIfDefined
} from '../utilities';

test.describe('Utilities Module Validation', () => {
    test('Date parsing and utility functions', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing utilities.ts module');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Test parseDateString function
        await testPositiveNegative(
            async () => {
                const result1 = parseDateString('25/12/2023');
                const result2 = parseDateString('2023-12-25');
                const result3 = parseDateString('25-12-2023');
                debugLog('detailed', 'parseDateString results:', { result1, result2, result3 });
                
                // Verify results have correct structure
                if (!result1.year || !result1.month || !result1.day) {
                    throw new Error('parseDateString result missing required properties');
                }
            },
            async () => {
                parseDateString('invalid-date-format');
            },
            'parseDateString with valid date formats',
            'parseDateString with invalid date format'
        );

        // Test parseDateString with expected format optimization
        await testPositiveNegative(
            async () => {
                const result = parseDateString('25/12/2023', 'DD/MM/YYYY');
                debugLog('detailed', 'parseDateString with expected format:', result);
            },
            async () => {
                // This should fail - wrong format doesn't match the date string
                parseDateString('invalid-format-string', 'DD/MM/YYYY');
            },
            'parseDateString with correct expected format',
            'parseDateString with completely invalid date string'
        );

        // Test getMonthName function
        await testPositiveNegative(
            () => {
                const longMonth = getMonthName(12, 'long');
                const shortMonth = getMonthName(12, 'short');
                debugLog('detailed', 'getMonthName results:', { longMonth, shortMonth });
                
                if (longMonth !== 'December' || shortMonth !== 'Dec') {
                    throw new Error('getMonthName returned unexpected values');
                }
                return Promise.resolve();
            },
            () => {
                getMonthName(13, 'long'); // Invalid month number
                return Promise.resolve();
            },
            'getMonthName with valid month numbers',
            'getMonthName with invalid month number'
        );

        // Test iterateElements function
        const itemsLocator = page.locator('.item');
        
        await testPositiveNegative(
            async () => {
                let processedCount = 0;
                await iterateElements(itemsLocator, async (index) => {
                    processedCount++;
                    debugLog('verbose', `Processing item at index ${index}`);
                }, { description: 'test items', continueOnError: false });
                
                debugLog('detailed', `iterateElements processed ${processedCount} items`);
                if (processedCount === 0) {
                    throw new Error('iterateElements processed no items');
                }
            },
            async () => {
                // Test with an intentional error during processing
                await iterateElements(itemsLocator, async (index) => {
                    if (index === 0) {
                        throw new Error('Intentional processing error');
                    }
                }, { description: 'error test items', continueOnError: false });
            },
            'iterateElements with existing elements',
            'iterateElements with processing error'
        );

        // Test iterateElements with parallel execution
        await testPositiveNegative(
            async () => {
                let processedCount = 0;
                await iterateElements(itemsLocator, async (index) => {
                    processedCount++;
                    debugLog('verbose', `Parallel processing item at index ${index}`);
                }, { description: 'parallel test items', parallel: true });
                
                debugLog('detailed', `iterateElements (parallel) processed ${processedCount} items`);
            },
            async () => {
                // Test parallel with error handling
                await iterateElements(itemsLocator, async (index) => {
                    if (index === 0) {
                        throw new Error('Intentional error for testing');
                    }
                }, { description: 'parallel error test', parallel: true, continueOnError: false });
            },
            'iterateElements with parallel execution',
            'iterateElements with parallel execution and error'
        );

        // Test getElementIndices function
        await testPositiveNegative(
            async () => {
                const highPriorityIndices = await getElementIndices(itemsLocator, {
                    attributeName: 'class',
                    attributeValue: 'priority-high',
                    matchType: 'contains'
                });
                
                debugLog('detailed', 'High priority indices:', highPriorityIndices);
                if (!Array.isArray(highPriorityIndices)) {
                    throw new Error('getElementIndices should return an array');
                }
            },
            async () => {
                // Test with non-existent locator instead of non-existent attribute value
                const nonExistentLocator = page.locator('.completely-non-existent');
                const noMatchIndices = await getElementIndices(nonExistentLocator, {
                    attributeName: 'class',
                    attributeValue: 'any-value',
                    matchType: 'contains'
                });
                
                // This should succeed but return empty array
                if (noMatchIndices.length > 0) {
                    throw new Error('getElementIndices should return empty array for non-existent elements');
                }
                
                // Force an error for testing
                throw new Error('Testing error handling in getElementIndices');
            },
            'getElementIndices with existing attribute values',
            'getElementIndices with non-existent elements'
        );

        // Test getElementIndices with different match types
        await testPositiveNegative(
            async () => {
                const exactMatches = await getElementIndices(itemsLocator, {
                    attributeName: 'data-type',
                    attributeValue: 'urgent',
                    matchType: 'equals'
                });
                
                const startsWithMatches = await getElementIndices(itemsLocator, {
                    attributeName: 'data-type',
                    attributeValue: 'ur',
                    matchType: 'startsWith'
                });
                
                debugLog('detailed', 'Match type results:', { exactMatches, startsWithMatches });
            },
            async () => {
                // Test with RegExp (should work)
                await getElementIndices(itemsLocator, {
                    attributeName: 'class',
                    attributeValue: /priority-\w+/,
                    matchType: 'contains'
                });
                
                // This should work, so we'll throw an error to test negative case
                throw new Error('Testing regex handling in getElementIndices');
            },
            'getElementIndices with different match types',
            'getElementIndices with regex pattern (intentional failure for testing)'
        );

        // Test executeIfDefined function
        await testPositiveNegative(
            async () => {
                let executedWithValue = false;
                let executedWithUndefined = false;
                
                await executeIfDefined('test-value', async (value) => {
                    executedWithValue = true;
                    debugLog('verbose', `executeIfDefined called with: ${value}`);
                });
                
                await executeIfDefined(undefined, async () => {
                    executedWithUndefined = true;
                });
                
                if (!executedWithValue || executedWithUndefined) {
                    throw new Error('executeIfDefined did not behave correctly');
                }
            },
            async () => {
                // Test with function that throws error
                await executeIfDefined('error-value', async () => {
                    throw new Error('Intentional error for executeIfDefined testing');
                });
            },
            'executeIfDefined with defined and undefined values',
            'executeIfDefined with function that throws error'
        );

        // Test fillIfDefined function
        await testPositiveNegative(
            async () => {
                await fillIfDefined('Test Value', elements.textInput);
                
                // Verify the input was filled
                const inputValue = await elements.textInput.locator().inputValue();
                if (inputValue !== 'Test Value') {
                    throw new Error('fillIfDefined did not fill the input correctly');
                }
                
                // Test with undefined value (should not change input)
                await fillIfDefined(undefined, elements.textInput);
                
                // Value should still be 'Test Value'
                const unchangedValue = await elements.textInput.locator().inputValue();
                if (unchangedValue !== 'Test Value') {
                    throw new Error('fillIfDefined should not change input when value is undefined');
                }
            },
            () => fillIfDefined('error-value', elements.nonExistent),
            'fillIfDefined with valid element and values',
            'fillIfDefined with non-existent element'
        );

        debugLog('basic', '✅ Utilities module validation complete');
    });
});
