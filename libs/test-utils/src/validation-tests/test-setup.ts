/**
 * @fileoverview Shared test setup utilities for validation tests
 * 
 * This module provides common test page setup and utility functions
 * used across all validation test files.
 */

import { Page } from '@playwright/test';
import { debugLog } from './debug-minimal';
import { compositeLocator } from '../core-types';

/**
 * Creates a comprehensive test page with all elements needed for validation tests
 */
export async function setupTestPage(page: Page): Promise<void> {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Helper Method Validation Page</title>
            <style>
                .hidden { display: none; }
                .invisible { visibility: hidden; }
                .disabled { pointer-events: none; opacity: 0.5; }
                .active { background-color: yellow; border: 2px solid blue; }
                .tab { padding: 10px; margin: 5px; border: 1px solid gray; cursor: pointer; }
                .item { padding: 5px; margin: 2px; border: 1px solid black; }
                .priority-high { color: red; font-weight: bold; }
                .priority-medium { color: orange; }
                .priority-low { color: green; }
                button:disabled { opacity: 0.6; cursor: not-allowed; }
                input:disabled { background-color: #f0f0f0; }
            </style>
        </head>
        <body>
            <!-- Basic visibility test elements -->
            <button id="visible-btn" class="btn primary">Visible Button</button>
            <button id="hidden-btn" class="btn secondary hidden">Hidden Button</button>
            <button id="invisible-btn" class="btn invisible">Invisible Button</button>
            
            <!-- Enabled/disabled test elements -->
            <button id="enabled-btn" class="btn enabled">Enabled Button</button>
            <button id="disabled-btn" class="btn" disabled>Disabled Button</button>
            
            <!-- Editable test elements -->
            <input id="editable-input" type="text" placeholder="Editable input" />
            <input id="readonly-input" type="text" readonly placeholder="Readonly input" />
            <input id="disabled-input" type="text" disabled placeholder="Disabled input" />
            <textarea id="editable-textarea" placeholder="Editable textarea"></textarea>
            <textarea id="readonly-textarea" readonly placeholder="Readonly textarea"></textarea>
            
            <!-- Form elements for interaction testing -->
            <input id="text-input" type="text" value="" placeholder="Text input" />
            <input id="number-input" type="number" value="" placeholder="Number input" />
            <select id="dropdown">
                <option value="">Select option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>
            
            <!-- Elements with specific attributes for validation -->
            <div id="attr-element" 
                 class="container active primary" 
                 data-testid="main-container" 
                 role="main" 
                 aria-expanded="true"
                 data-value="test-value">
                Element with attributes
            </div>
            
            <div id="no-attr-element">Element without specific attributes</div>
            
            <!-- Text content elements -->
            <p id="text-paragraph">This paragraph contains specific test content for validation.</p>
            <div id="empty-text"></div>
            <span id="dynamic-span">Dynamic content</span>
            
            <!-- Element groups for toggle testing -->
            <div class="tab-group">
                <button class="tab active" id="tab1" data-tab="tab1" onclick="window.location.hash='#test'">Tab 1</button>
                <button class="tab" id="tab2" data-tab="tab2" onclick="window.location.hash='#tab2'">Tab 2</button>
                <button class="tab" id="tab3" data-tab="tab3" onclick="window.location.hash='#tab3'">Tab 3</button>
            </div>
            
            <!-- Multiple similar elements for iteration -->
            <div class="item-list">
                <div class="item priority-high" data-index="0" data-type="urgent">Urgent Item 1</div>
                <div class="item priority-medium" data-index="1" data-type="normal">Normal Item 2</div>
                <div class="item priority-low" data-index="2" data-type="low">Low Item 3</div>
                <div class="item priority-high" data-index="3" data-type="urgent">Urgent Item 4</div>
                <div class="item priority-medium" data-index="4" data-type="normal">Normal Item 5</div>
            </div>
            
            <!-- Navigation elements -->
            <a href="/test-page" id="nav-link">Test Navigation Link</a>
            <button id="nav-button" onclick="window.location.hash='#test'">Navigation Button</button>
            
            <!-- Click target elements -->
            <button id="click-target" onclick="this.textContent='Clicked!'">Click Me</button>
            <button id="hover-target" onmouseover="this.style.backgroundColor='lightblue'">Hover Me</button>
            <button id="focus-target" onfocus="this.style.outline='2px solid red'">Focus Me</button>
            
            <!-- Hidden elements for negative element map testing -->
            <button id="hidden-map-btn1" class="btn hidden">Hidden Map Button 1</button>
            <button id="hidden-map-btn2" class="btn hidden">Hidden Map Button 2</button>
            <div id="empty-content-div"></div>
            <div id="no-button-text">This div contains no button text</div>
            
            <script>
                // Add tab functionality
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.addEventListener('click', function() {
                        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
                
                // Add dynamic content updates
                let counter = 0;
                setInterval(() => {
                    const span = document.getElementById('dynamic-span');
                    if (span) span.textContent = \`Dynamic content \${++counter}\`;
                }, 5000);
            </script>
        </body>
        </html>
    `);
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('#visible-btn', { state: 'attached' });
    debugLog('basic', '✅ Test page setup complete');
}

/**
 * Common test elements used across validation tests
 */
export function getTestElements(page: Page) {
    return {
        // Basic elements
        visibleBtn: compositeLocator(() => page.locator('#visible-btn'), 'Visible Button'),
        hiddenBtn: compositeLocator(() => page.locator('#hidden-btn'), 'Hidden Button'),
        enabledBtn: compositeLocator(() => page.locator('#enabled-btn'), 'Enabled Button'),
        disabledBtn: compositeLocator(() => page.locator('#disabled-btn'), 'Disabled Button'),
        
        // Form elements
        editableInput: compositeLocator(() => page.locator('#editable-input'), 'Editable Input'),
        readonlyInput: compositeLocator(() => page.locator('#readonly-input'), 'Readonly Input'),
        textInput: compositeLocator(() => page.locator('#text-input'), 'Text Input'),
        numberInput: compositeLocator(() => page.locator('#number-input'), 'Number Input'),
        dropdown: compositeLocator(() => page.locator('#dropdown'), 'Dropdown'),
        
        // Interactive elements
        clickTarget: compositeLocator(() => page.locator('#click-target'), 'Click Target'),
        hoverTarget: compositeLocator(() => page.locator('#hover-target'), 'Hover Target'),
        focusTarget: compositeLocator(() => page.locator('#focus-target'), 'Focus Target'),
        
        // Attribute elements
        attrElement: compositeLocator(() => page.locator('#attr-element'), 'Attribute Element'),
        noAttrElement: compositeLocator(() => page.locator('#no-attr-element'), 'No Attribute Element'),
        textParagraph: compositeLocator(() => page.locator('#text-paragraph'), 'Text Paragraph'),
        emptyText: compositeLocator(() => page.locator('#empty-text'), 'Empty Text'),
        
        // Group elements
        tabs: [
            compositeLocator(() => page.locator('#tab1'), 'Tab 1'),
            compositeLocator(() => page.locator('#tab2'), 'Tab 2'),
            compositeLocator(() => page.locator('#tab3'), 'Tab 3')
        ],
        
        // Navigation elements
        navButton: compositeLocator(() => page.locator('#nav-button'), 'Navigation Button'),
        
        // Non-existent element for negative tests
        nonExistent: compositeLocator(() => page.locator('#non-existent-element'), 'Non-existent Element')
    };
}

/**
 * Helper function to test positive and negative scenarios with automatic test step wrapping
 */
export async function testPositiveNegative<T>(
    positiveTest: () => Promise<T>,
    negativeTest: () => Promise<T>,
    positiveDescription: string,
    negativeDescription: string
): Promise<void> {
    const { test } = await import('@playwright/test');
    
    await test.step(`Test ${positiveDescription} (positive) and ${negativeDescription} (negative)`, async () => {
        // Test positive scenario
        debugLog('basic', `🧪 Testing POSITIVE: ${positiveDescription}`);
        try {
            await positiveTest();
            debugLog('basic', `✅ POSITIVE PASSED: ${positiveDescription}`);
        } catch (error) {
            debugLog('basic', `❌ POSITIVE FAILED: ${positiveDescription} - ${(error as Error).message}`);
            throw error; // Re-throw to fail the test
        }
        
        // Test negative scenario
        debugLog('basic', `🧪 Testing NEGATIVE: ${negativeDescription}`);
        try {
            await negativeTest();
            debugLog('basic', `❌ NEGATIVE PASSED (SHOULD HAVE FAILED): ${negativeDescription}`);
        } catch {
            debugLog('basic', `✅ NEGATIVE FAILED CORRECTLY: ${negativeDescription}`);
        }
    });
}
