/**
 * @fileoverview Attributes module validation tests
 * 
 * Tests all attribute validation functions from attributes.ts with positive and negative scenarios.
 * Tests both single element and group attribute validation functions.
 */

import { test } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { setupTestPage, getTestElements, testPositiveNegative } from './test-setup';
import { 
    validateAttributes, validateAttributesContaining,
    validateOnlyOneElementActiveGroup, validateToggleBetweenTwoElements
} from '../attributes';

test.describe('Attributes Module Validation', () => {
    test('Single element attribute validation functions', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing attributes.ts module');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Exact attribute validation
        await testPositiveNegative(
            () => validateAttributes(elements.attrElement, { 'class': 'container active primary' }),
            () => validateAttributes(elements.attrElement, { 'class': 'non-existent-class' }),
            'validateAttributes with correct class',
            'validateAttributes with incorrect class'
        );

        await testPositiveNegative(
            () => validateAttributes(elements.attrElement, { 'data-testid': 'main-container' }),
            () => validateAttributes(elements.attrElement, { 'data-testid': 'wrong-container' }),
            'validateAttributes with correct data-testid',
            'validateAttributes with incorrect data-testid'
        );

        // Substring attribute validation
        await testPositiveNegative(
            () => validateAttributesContaining(elements.attrElement, { 'class': 'active' }),
            () => validateAttributesContaining(elements.attrElement, { 'class': 'inactive' }),
            'validateAttributesContaining with existing substring',
            'validateAttributesContaining with non-existing substring'
        );

        await testPositiveNegative(
            () => validateAttributesContaining(elements.attrElement, { 'data-value': 'test' }),
            () => validateAttributesContaining(elements.attrElement, { 'data-value': 'wrong' }),
            'validateAttributesContaining with correct data-value substring',
            'validateAttributesContaining with incorrect data-value substring'
        );

        debugLog('basic', '✅ Attributes module validation complete');
    });

    test('Group attribute validation functions', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing group attribute validation functions');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Group active element validation
        await testPositiveNegative(
            () => validateOnlyOneElementActiveGroup(elements.tabs, 0, { 'class': 'active' }),
            () => validateOnlyOneElementActiveGroup(elements.tabs, 2, { 'class': 'active' }),
            'validateOnlyOneElementActiveGroup with correct active index',
            'validateOnlyOneElementActiveGroup with incorrect active index'
        );

        // Toggle behavior validation
        await testPositiveNegative(
            async () => {
                // Reset to initial state for positive test
                await page.reload();
                await setupTestPage(page);
                const freshElements = getTestElements(page);
                await validateToggleBetweenTwoElements(freshElements.tabs[0], freshElements.tabs[1], { 'class': 'active' }, 'A');
            },
            async () => {
                // Reset to initial state for negative test
                await page.reload(); 
                await setupTestPage(page);
                const freshElements = getTestElements(page);
                await validateToggleBetweenTwoElements(freshElements.tabs[0], freshElements.tabs[1], { 'class': 'active' }, 'B');
            },
            'validateToggleBetweenTwoElements with correct initial state',
            'validateToggleBetweenTwoElements with incorrect expected state'
        );

        debugLog('basic', '✅ Group attribute validation complete');
    });
});
