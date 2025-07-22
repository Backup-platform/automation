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
    validateAttributesExist, validateAttributesExact, validateAttributesPartial,
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

        debugLog('basic', '✅ Legacy attributes validation complete');
    });

    test('New explicit attribute validation methods - validateAttributesExist', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing validateAttributesExist method');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Test validateAttributesExist - pure existence checking
        await testPositiveNegative(
            () => validateAttributesExist(elements.attrElement, ['class', 'data-testid', 'data-value']),
            () => validateAttributesExist(elements.attrElement, ['non-existent-attr', 'missing-attribute']),
            'validateAttributesExist with all existing attributes',
            'validateAttributesExist with all non-existing attributes'
        );

        // Test validateAttributesExist - partial existence (should fail)
        await testPositiveNegative(
            () => validateAttributesExist(elements.attrElement, ['class', 'data-testid']), // Both exist
            () => validateAttributesExist(elements.attrElement, ['class', 'non-existent-attr']), // One exists, one doesn't
            'validateAttributesExist with all attributes existing',
            'validateAttributesExist with partial existence (should fail as expected)'
        );

        // Test validateAttributesExist with attributes that have values
        await testPositiveNegative(
            () => validateAttributesExist(elements.attrElement, ['class', 'data-value']), // Both have values
            () => validateAttributesExist(elements.attrElement, ['class', 'completely-missing']),
            'validateAttributesExist with attributes that have values',
            'validateAttributesExist mixing existing and missing attributes'
        );

        // Test validateAttributesExist with attributes that have empty/no values
        await testPositiveNegative(
            () => validateAttributesExist(elements.attrElement, ['class']), // Exists regardless of content
            () => validateAttributesExist(elements.attrElement, ['empty-attribute-that-does-not-exist']),
            'validateAttributesExist with attributes (regardless of empty values)',
            'validateAttributesExist with truly missing attributes'
        );

        debugLog('basic', '✅ validateAttributesExist validation complete');
    });

    test('New explicit attribute validation methods - validateAttributesExact', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing validateAttributesExact method');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Test validateAttributesExact - exact value matching
        await testPositiveNegative(
            () => validateAttributesExact(elements.attrElement, { 
                'class': 'container active primary',
                'data-testid': 'main-container',
                'data-value': 'test-value'
            }),
            () => validateAttributesExact(elements.attrElement, { 
                'class': 'container active',  // Missing 'primary'
                'data-testid': 'wrong-container'
            }),
            'validateAttributesExact with all correct exact values',
            'validateAttributesExact with incorrect exact values'
        );

        // Test validateAttributesExact - partial attribute existence (should fail at existence check)
        await testPositiveNegative(
            () => validateAttributesExact(elements.attrElement, { 'class': 'container active primary' }),
            () => validateAttributesExact(elements.attrElement, { 
                'class': 'container active primary',  // Exists
                'non-existent-attr': 'some-value'     // Does not exist
            }),
            'validateAttributesExact with existing attributes',
            'validateAttributesExact with partial existence (should fail at existence check)'
        );

        // Test validateAttributesExact - attributes exist but wrong exact values
        await testPositiveNegative(
            () => validateAttributesExact(elements.attrElement, { 
                'data-testid': 'main-container',  // Correct exact value
                'class': 'container active primary'  // Correct exact value
            }),
            () => validateAttributesExact(elements.attrElement, { 
                'data-testid': 'main-container',  // Correct
                'class': 'container active'      // Wrong (missing 'primary')
            }),
            'validateAttributesExact with all correct exact values',
            'validateAttributesExact with existing attributes but wrong exact values'
        );

        // Test validateAttributesExact - empty values vs expected values
        await testPositiveNegative(
            () => validateAttributesExact(elements.attrElement, { 'data-value': 'test-value' }),
            () => validateAttributesExact(elements.attrElement, { 'data-value': '' }), // Expecting empty but has value
            'validateAttributesExact with non-empty value',
            'validateAttributesExact expecting empty but attribute has value'
        );

        // Test validateAttributesExact with RegExp
        await testPositiveNegative(
            () => validateAttributesExact(elements.attrElement, { 
                'data-value': /^test-value$/,
                'class': /container.*active.*primary/
            }),
            () => validateAttributesExact(elements.attrElement, { 
                'data-value': /^wrong-pattern-\d+$/,
                'class': /inactive.*disabled/
            }),
            'validateAttributesExact with correct RegExp patterns',
            'validateAttributesExact with incorrect RegExp patterns'
        );

        // Test error scenarios - comprehensive validation failure modes
        await testPositiveNegative(
            () => validateAttributesExact(elements.attrElement, { 'class': 'container active primary' }),
            () => validateAttributesExact(elements.attrElement, { 'non-existent-attribute': 'value' }),
            'validateAttributesExact with existing attributes and correct values',
            'validateAttributesExact should fail when attribute does not exist'
        );

        debugLog('basic', '✅ validateAttributesExact validation complete');
    });

    test('New explicit attribute validation methods - validateAttributesPartial', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing validateAttributesPartial method');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Test validateAttributesPartial - substring matching
        await testPositiveNegative(
            () => validateAttributesPartial(elements.attrElement, { 
                'class': 'active',           // Should find in 'container active primary'
                'data-testid': 'container',  // Should find in 'main-container'
                'data-value': 'test'         // Should find in 'test-data-123'
            }),
            () => validateAttributesPartial(elements.attrElement, { 
                'class': 'inactive',         // Should NOT find
                'data-testid': 'wrong',      // Should NOT find
                'data-value': 'missing'      // Should NOT find
            }),
            'validateAttributesPartial with all existing substrings',
            'validateAttributesPartial with all non-existing substrings'
        );

        // Test validateAttributesPartial - partial attribute existence (should fail at existence check)
        await testPositiveNegative(
            () => validateAttributesPartial(elements.attrElement, { 'class': 'active' }), // Exists
            () => validateAttributesPartial(elements.attrElement, { 
                'class': 'active',           // Exists
                'missing-attr': 'any-value'  // Does not exist
            }),
            'validateAttributesPartial with existing attributes',
            'validateAttributesPartial with partial existence (should fail at existence check)'
        );

        // Test validateAttributesPartial - attributes exist but wrong substrings
        await testPositiveNegative(
            () => validateAttributesPartial(elements.attrElement, { 
                'class': 'primary',          // Should find this substring
                'data-testid': 'main'        // Should find this substring
            }),
            () => validateAttributesPartial(elements.attrElement, { 
                'class': 'secondary',        // Should NOT find (wrong substring)
                'data-testid': 'side'        // Should NOT find (wrong substring)
            }),
            'validateAttributesPartial with existing attributes and correct substrings',
            'validateAttributesPartial with existing attributes but wrong substrings'
        );

        // Test validateAttributesPartial - empty value scenarios
        await testPositiveNegative(
            () => validateAttributesPartial(elements.attrElement, { 'data-value': 'test' }), // Has content
            () => validateAttributesPartial(elements.attrElement, { 'data-value': 'xyz' }), // Wrong content
            'validateAttributesPartial with non-empty value containing substring',
            'validateAttributesPartial with non-empty value not containing substring'
        );

        // Test validateAttributesPartial - edge case substrings
        await testPositiveNegative(
            () => validateAttributesPartial(elements.attrElement, { 
                'class': 'primary',          // Last class in list
                'data-testid': 'main',       // Beginning of attribute
                'data-value': 'value'        // End of attribute
            }),
            () => validateAttributesPartial(elements.attrElement, { 
                'class': 'secondary',        // Similar but wrong
                'data-testid': 'side',       // Similar but wrong
                'data-value': '456'          // Similar but wrong
            }),
            'validateAttributesPartial with edge case substrings (beginning, middle, end)',
            'validateAttributesPartial with similar but wrong substrings'
        );

        debugLog('basic', '✅ validateAttributesPartial validation complete');
    });

    test('Cross-method validation scenarios', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing cross-method validation scenarios');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Test mixed scenarios for all methods
        await testPositiveNegative(
            () => validateAttributesPartial(elements.attrElement, { 'class': 'container' }), // Partial works
            () => validateAttributesExact(elements.attrElement, { 'class': 'container' }), // Exact fails (missing 'active primary')
            'validateAttributesPartial passes with partial match',
            'validateAttributesExact fails with partial match (needs exact)'
        );

        // Test layered validation approach
        await testPositiveNegative(
            async () => {
                // Demonstrate proper layered validation
                await validateAttributesExist(elements.attrElement, ['class', 'data-testid']);
                await validateAttributesPartial(elements.attrElement, { 'class': 'active' });
                await validateAttributesExact(elements.attrElement, { 'data-testid': 'main-container' });
            },
            async () => {
                // This should fail at the partial check
                await validateAttributesExist(elements.attrElement, ['class', 'data-testid']);
                await validateAttributesPartial(elements.attrElement, { 'class': 'inactive' }); // This should fail
            },
            'Layered validation: exist → partial → exact (all pass)',
            'Layered validation: fails at partial check'
        );

        debugLog('basic', '✅ Cross-method validation scenarios complete');
    });

    test('Legacy attribute validation methods', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing legacy attribute validation methods');
        
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

        debugLog('basic', '✅ Legacy attributes validation complete');
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
