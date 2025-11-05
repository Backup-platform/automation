/**
 * @fileoverview Assertions module validation tests
 * 
 * Tests all assertion functions from assertions.ts with positive and negative scenarios.
 * Tests both individual assertion functions and multi-state assertion functions.
 */

import { test } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { setupTestPage, getTestElements, testPositiveNegative } from './test-setup';
import { 
    assertVisible, assertNotVisible, assertEnabled, assertNotEnabled, 
    assertEditable, assertNotEditable, assertElementState, assertElementStates,
    assertVisibleAndEnabled, assertVisibleAndEditable, assertInteractive,
    assertElementContainsText
} from '../assertions';

test.describe('Assertions Module Validation', () => {
    test('Single element assertion functions', async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        debugLog('basic', '🚀 Testing assertions.ts module');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Visibility assertions
        await testPositiveNegative(
            () => assertVisible(elements.visibleBtn),
            () => assertVisible(elements.hiddenBtn),
            'assertVisible for visible element',
            'assertVisible for hidden element'
        );

        await testPositiveNegative(
            () => assertNotVisible(elements.hiddenBtn),
            () => assertNotVisible(elements.visibleBtn),
            'assertNotVisible for hidden element',
            'assertNotVisible for visible element'
        );

        // Enabled/disabled assertions
        await testPositiveNegative(
            () => assertEnabled(elements.enabledBtn),
            () => assertEnabled(elements.disabledBtn),
            'assertEnabled for enabled element',
            'assertEnabled for disabled element'
        );

        await testPositiveNegative(
            () => assertNotEnabled(elements.disabledBtn),
            () => assertNotEnabled(elements.enabledBtn),
            'assertNotEnabled for disabled element',
            'assertNotEnabled for enabled element'
        );

        // Editable assertions
        await testPositiveNegative(
            () => assertEditable(elements.editableInput),
            () => assertEditable(elements.readonlyInput),
            'assertEditable for editable element',
            'assertEditable for readonly element'
        );

        await testPositiveNegative(
            () => assertNotEditable(elements.readonlyInput),
            () => assertNotEditable(elements.editableInput),
            'assertNotEditable for readonly element',
            'assertNotEditable for editable element'
        );

        // Unified assertion engine
        await testPositiveNegative(
            () => assertElementState(elements.visibleBtn, 'visible', 'positive'),
            () => assertElementState(elements.hiddenBtn, 'visible', 'positive'),
            'assertElementState for visible element',
            'assertElementState for hidden element'
        );

        // Multi-state assertions
        await testPositiveNegative(
            () => assertElementStates(elements.visibleBtn, [{ type: 'visible' }, { type: 'enabled' }]),
            () => assertElementStates(elements.hiddenBtn, [{ type: 'visible' }, { type: 'enabled' }]),
            'assertElementStates for visible and enabled element',
            'assertElementStates for hidden element'
        );

        // Combined assertion functions
        await testPositiveNegative(
            () => assertVisibleAndEnabled(elements.visibleBtn),
            () => assertVisibleAndEnabled(elements.hiddenBtn),
            'assertVisibleAndEnabled for visible and enabled element',
            'assertVisibleAndEnabled for hidden element'
        );

        await testPositiveNegative(
            () => assertVisibleAndEditable(elements.editableInput),
            () => assertVisibleAndEditable(elements.readonlyInput),
            'assertVisibleAndEditable for editable element',
            'assertVisibleAndEditable for readonly element'
        );

        await testPositiveNegative(
            () => assertInteractive(elements.editableInput),
            () => assertInteractive(elements.readonlyInput),
            'assertInteractive for editable element',
            'assertInteractive for readonly element'
        );

        // Text content assertions
        await testPositiveNegative(
            () => assertElementContainsText(elements.textParagraph, 'specific test content'),
            () => assertElementContainsText(elements.emptyText, 'non-existent text'),
            'assertElementContainsText for existing text',
            'assertElementContainsText for missing text'
        );

        debugLog('basic', '✅ Assertions module validation complete');
    });
});
