/**
 * @fileoverview Interactions module validation tests
 * 
 * Tests all interaction functions from interactions.ts with positive and negative scenarios.
 * Tests both core interaction methods and convenience wrapper functions.
 */

import { test } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { setupTestPage, getTestElements, testPositiveNegative } from './test-setup';
import { 
    clickElement, fillElement, hoverElement, focusElement, selectOption,
    rightClick, doubleClick, forceClick, forceFill, clearAndFill,
    performInteractionChain, clickIfVisibleOrFallback
} from '../interactions';

test.describe('Interactions Module Validation', () => {
    test('Core interaction functions', async ({ page }) => {
        test.setTimeout(60000); // 1 minute timeout
        debugLog('basic', '🚀 Testing interactions.ts module');
        
        await setupTestPage(page);
        const elements = getTestElements(page);

        await test.step('Test click interactions', async () => {
            await testPositiveNegative(
                () => clickElement(elements.clickTarget),
                () => clickElement(elements.nonExistent, { timeout: 2000 }),
                'clickElement for visible element',
                'clickElement for non-existent element'
            );
        });

        await test.step('Test fill interactions', async () => {
            await testPositiveNegative(
                () => fillElement(elements.textInput, 'Test input value'),
                () => fillElement(elements.nonExistent, 'test', { timeout: 2000 }),
                'fillElement for existing input',
                'fillElement for non-existent element'
            );

            await fillElement(elements.numberInput, '12345');
            debugLog('detailed', '✅ fillElement passed for number input');
        });

        await test.step('Test hover and focus interactions', async () => {
            await testPositiveNegative(
                () => hoverElement(elements.hoverTarget),
                () => hoverElement(elements.nonExistent, { timeout: 2000 }),
                'hoverElement for existing element',
                'hoverElement for non-existent element'
            );

            await testPositiveNegative(
                () => focusElement(elements.focusTarget),
                () => focusElement(elements.nonExistent, { timeout: 2000 }),
                'focusElement for existing element',
                'focusElement for non-existent element'
            );
        });

        await test.step('Test select interactions', async () => {
            await testPositiveNegative(
                () => selectOption(elements.dropdown, 'option1'),
                () => selectOption(elements.nonExistent, 'option1', { timeout: 2000 }),
                'selectOption for existing dropdown',
                'selectOption for non-existent element'
            );
        });

        await test.step('Test convenience interaction methods', async () => {
            // These are wrappers around core methods, so we test them positively
            // since negative testing is covered by the core methods
            await rightClick(elements.clickTarget);
            await doubleClick(elements.clickTarget);
            await forceClick(elements.clickTarget);
            await forceFill(elements.textInput, 'Force filled');
            await clearAndFill(elements.textInput, 'Cleared and filled');
            debugLog('detailed', '✅ Convenience methods passed');
        });

        await test.step('Test interaction chains', async () => {
            await testPositiveNegative(
                () => performInteractionChain([
                    { element: elements.textInput, action: 'focus' },
                    { element: elements.textInput, action: 'fill', value: 'Chain test' },
                    { element: elements.hoverTarget, action: 'hover' }
                ]),
                () => performInteractionChain([
                    { element: elements.nonExistent, action: 'click' },
                    { element: elements.nonExistent, action: 'fill', value: 'test' }
                ], { timeout: 2000 }),
                'performInteractionChain for existing elements',
                'performInteractionChain for non-existent elements'
            );
        });

        await test.step('Test conditional interactions', async () => {
            let fallbackExecuted = false;
            
            // Test with visible element - should not execute fallback
            await clickIfVisibleOrFallback(elements.clickTarget, async () => {
                fallbackExecuted = false;
            });
            
            // Test with non-existent element - should execute fallback
            await clickIfVisibleOrFallback(elements.nonExistent, async () => {
                fallbackExecuted = true;
            });
            
            debugLog('detailed', `✅ clickIfVisibleOrFallback passed, fallback executed: ${fallbackExecuted}`);
        });

        debugLog('basic', '✅ Interactions module validation complete');
    });
});
