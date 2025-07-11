/**
 * @fileoverview Text extraction         // Create element maps for group text         // All groups text extraction
        await testPositiveNegative(
            async () => {
                const allTexts = await getAllGroupTexts(elementsMapRecord);
                if (!allTexts.textElements || Object.keys(allTexts.textElements).length === 0) {
                    throw new Error('All groups text extraction failed');
                }
            },
            async () => {
                await getAllGroupTexts(hiddenElementsMap);
            },
            'getAllGroupTexts for visible elements',
            'getAllGroupTexts for hidden elements'
        );ting using elements with actual text content
        const elementsMapArray = {
            buttons: [elements.visibleBtn, elements.enabledBtn], // These have "Button" text
            paragraphs: [elements.textParagraph] // This has actual text content
        };

        const elementsMapRecord = {
            textElements: {
                paragraph: elements.textParagraph,
                button: elements.visibleBtn
            }
        };ation tests
 * 
 * Tests all text extraction functions from text-extraction.ts with positive and negative scenarios.
 * Tests single element and group text extraction functions.
 */

import { test } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { setupTestPage, getTestElements, testPositiveNegative } from './test-setup';
import { 
    getText, getGroupTexts, getAllGroupTexts, getElementText
} from '../text-extraction';
import { compositeLocator } from '../core-types';

test.describe('Text Extraction Module Validation', () => {
    test('Text extraction functions', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing text-extraction.ts module');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        // Single element text extraction
        await testPositiveNegative(
            async () => {
                const text = await getText(elements.textParagraph);
                if (!text.includes('specific test content')) {
                    throw new Error('Text extraction failed');
                }
            },
            async () => {
                await getText(elements.nonExistent);
            },
            'getText for element with text content',
            'getText for non-existent element'
        );

        // Create element maps for group testing
        const elementsMapArray = {
            buttons: [elements.visibleBtn, elements.enabledBtn],
            paragraphs: [elements.textParagraph]
        };

        const elementsMapRecord = {
            buttons: {
                visible: elements.visibleBtn,
                enabled: elements.enabledBtn
            }
        };

        const hiddenElementsMap = {
            hiddenButtons: [
                compositeLocator(() => page.locator('#hidden-map-btn1'), 'Hidden Button 1'),
                compositeLocator(() => page.locator('#hidden-map-btn2'), 'Hidden Button 2')
            ]
        };

        // Group text extraction with arrays - use elements that have text content
        await testPositiveNegative(
            async () => {
                const texts = await getGroupTexts(elementsMapArray, 'paragraphs');
                if (!texts || typeof texts !== 'object' || Object.keys(texts).length === 0) {
                    throw new Error('Group text extraction failed');
                }
            },
            async () => {
                const texts = await getGroupTexts(hiddenElementsMap, 'hiddenButtons');
                // Hidden elements return empty strings, so check for that
                const hasNonEmptyText = Object.values(texts).some(text => text.trim().length > 0);
                if (hasNonEmptyText) {
                    throw new Error('Hidden elements should return empty text content');
                }
            },
            'getGroupTexts for visible elements',
            'getGroupTexts for hidden elements'
        );

        // All groups text extraction
        await testPositiveNegative(
            async () => {
                const allTexts = await getAllGroupTexts(elementsMapRecord);
                if (!allTexts.buttons || Object.keys(allTexts.buttons).length === 0) {
                    throw new Error('All groups text extraction failed');
                }
            },
            async () => {
                const allTexts = await getAllGroupTexts({ hiddenButtons: { hidden1: compositeLocator(() => page.locator('#hidden-map-btn1'), 'Hidden Button 1') } });
                // Hidden elements should return empty strings
                const hasNonEmptyText = Object.values(allTexts.hiddenButtons).some(text => text.trim().length > 0);
                if (hasNonEmptyText) {
                    throw new Error('Hidden elements should return empty text content');
                }
            },
            'getAllGroupTexts for visible elements',
            'getAllGroupTexts for hidden elements'
        );

        // Specific element text extraction from maps
        await testPositiveNegative(
            async () => {
                const buttonText = await getElementText(elementsMapArray, 'buttons', 0);
                if (!buttonText || buttonText.trim().length === 0) {
                    throw new Error('Element text extraction failed');
                }
            },
            async () => {
                await getElementText(hiddenElementsMap, 'hiddenButtons', 0);
            },
            'getElementText for visible element in map',
            'getElementText for hidden element in map'
        );

        debugLog('basic', '✅ Text extraction module validation complete');
    });
});
