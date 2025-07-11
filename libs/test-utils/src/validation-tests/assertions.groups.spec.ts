/**
 * @fileoverview Group assertions module validation tests
 * 
 * Tests all group assertion functions from assertions.groups.ts with positive and negative scenarios.
 * Tests multi-element visibility and text content assertions.
 */

import { test } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { setupTestPage, getTestElements, testPositiveNegative } from './test-setup';
import { 
    validateAllElementsVisibility, validateGroupsContainText
} from '../assertions.groups';
import { compositeLocator } from '../core-types';

test.describe('Group Assertions Module Validation', () => {
    test('Multi-element assertion functions', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing assertions.groups.ts module');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Create element groups for testing
        const visibleElements = [elements.visibleBtn, elements.enabledBtn, elements.editableInput];
        const hiddenElements = [
            elements.hiddenBtn,
            compositeLocator(() => page.locator('#hidden-map-btn1'), 'Hidden Button 1'),
            compositeLocator(() => page.locator('#hidden-map-btn2'), 'Hidden Button 2')
        ];

        // Multi-element visibility validation
        await testPositiveNegative(
            () => validateAllElementsVisibility(visibleElements),
            () => validateAllElementsVisibility(hiddenElements),
            'validateAllElementsVisibility for visible elements',
            'validateAllElementsVisibility for hidden elements'
        );

        // Group text content validation with arrays (using elements that actually have "Button" text)
        const elementsWithText = {
            buttons: [elements.visibleBtn, elements.enabledBtn] // Both contain "Button" text
        };

        await testPositiveNegative(
            () => validateGroupsContainText(elementsWithText, 'Button'),
            () => validateGroupsContainText(elementsWithText, 'NonExistentText'),
            'validateGroupsContainText with existing text in arrays',
            'validateGroupsContainText with non-existing text in arrays'
        );

        // Group text content validation with records (using elements that actually have text)
        const elementsWithTextRecord = {
            textElements: {
                paragraph: elements.textParagraph // Contains "content", "specific", "test"
            }
        };

        await testPositiveNegative(
            () => validateGroupsContainText(elementsWithTextRecord, 'specific'),
            () => validateGroupsContainText(elementsWithTextRecord, 'NonExistentText'),
            'validateGroupsContainText with existing text in records',
            'validateGroupsContainText with non-existing text in records'
        );

        // Specific group validation
        await testPositiveNegative(
            () => validateGroupsContainText(elementsWithText, 'Button', 'buttons'),
            () => validateGroupsContainText(elementsWithText, 'NonExistent', 'buttons'),
            'validateGroupsContainText for specific group with matching text',
            'validateGroupsContainText for specific group with non-matching text'
        );

        debugLog('basic', '✅ Group assertions module validation complete');
    });
});
