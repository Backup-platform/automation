/**
 * @fileoverview Navigation Helpers Module Validation Tests
 * 
 * Tests all navigation helper functions from navigation-helpers.ts with positive
 * and negative scenarios to ensure proper URL validation and navigation behavior.
 */

import { test } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { setupTestPage, getTestElements, testPositiveNegative } from './test-setup';
import { 
    assertUrl, 
    assertUrlContains, 
    performNavigationClick 
} from '../navigation-helpers';

test.describe('Navigation Helpers Module Validation', () => {
    test('URL assertion and navigation functions', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing navigation-helpers.ts module');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Test assertUrl function
        await testPositiveNegative(
            () => assertUrl(page, /about:blank/, true, false),
            () => assertUrl(page, /wrong-url-pattern/, true, false),
            'assertUrl with correct URL pattern',
            'assertUrl with incorrect URL pattern'
        );

        await testPositiveNegative(
            () => assertUrl(page, 'about:blank', true, false),
            () => assertUrl(page, 'https://wrong-url.com', true, false),
            'assertUrl with exact URL string match',
            'assertUrl with wrong exact URL string'
        );

        // Test assertUrlContains function
        await testPositiveNegative(
            () => assertUrlContains(page, ['about', 'blank'], true, false),
            () => assertUrlContains(page, ['non-existent', 'url-part'], true, false),
            'assertUrlContains with existing substrings',
            'assertUrlContains with non-existent substrings'
        );

        await testPositiveNegative(
            () => assertUrlContains(page, ['about'], true, false),
            () => assertUrlContains(page, ['https://example.com'], true, false),
            'assertUrlContains with single existing substring',
            'assertUrlContains with non-existent single substring'
        );

        // Test performNavigationClick function
        // First, let's set up the page to have a hash for navigation testing
        await page.evaluate(() => {
            window.location.hash = '';
        });

        await testPositiveNegative(
            async () => {
                // Reset hash before test
                await page.evaluate(() => { window.location.hash = ''; });
                await performNavigationClick(page, elements.tabs[0], 'about:blank#test');
                // Click should trigger the tab's onclick which changes hash
                await page.waitForFunction(() => window.location.hash === '#test', { timeout: 2000 });
            },
            () => performNavigationClick(page, elements.nonExistent, '#test'),
            'performNavigationClick with valid element and navigation',
            'performNavigationClick with non-existent element'
        );

        // Test URL assertion with soft assertions (positive case only - soft assertions don't throw in negative cases)
        await testPositiveNegative(
            () => assertUrl(page, /about:blank/, true, true), // soft assertion should pass
            () => assertUrl(page, /definitely-wrong-url/, true, false), // use regular assertion for negative test
            'assertUrl with soft assertion on correct URL',
            'assertUrl with regular assertion on wrong URL'
        );

        // Test URL contains with complex scenarios
        await testPositiveNegative(
            () => assertUrlContains(page, ['about'], false, false), // no wait for DOM
            () => assertUrlContains(page, ['missing-part-1', 'missing-part-2'], false, false),
            'assertUrlContains without waiting for DOM load',
            'assertUrlContains with multiple missing parts'
        );

        debugLog('basic', '✅ Navigation Helpers module validation complete');
    });
});
