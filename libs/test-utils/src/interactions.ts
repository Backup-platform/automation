/// <reference lib="dom" />
import { test } from '@playwright/test';
import { CompositeLocator } from './core-types';
import { assertVisible, assertEditable } from './assertions';

/**
 * Element interaction functions - clicking, filling, selecting, etc.
 */

export async function clickElement(element: CompositeLocator): Promise<void> {
    await test.step(`I click on ${element.name}`, async () => {
        await element.locator().click();
    });
}

export async function fillInputField(element: CompositeLocator, value: string): Promise<void> {
    await test.step(`I fill ${element.name} with ${value}`, async () => {
        await element.locator().waitFor({ state: 'visible' });
        await assertVisible(element);
        await assertEditable(element);
        await element.locator().fill(value);
    });
}

export async function selectDropdownOption(
    collapsedDropdown: CompositeLocator, 
    expandedDropdown: CompositeLocator, 
    optionToSelect: CompositeLocator
): Promise<void> {
    await test.step(`I select ${optionToSelect.name} from ${collapsedDropdown.name}`, async () => {
        await clickElement(collapsedDropdown);
        await assertVisible(expandedDropdown);
        await clickElement(optionToSelect);
    });
}

export async function clickIfVisibleOrFallback(element: CompositeLocator, fallbackAction: () => Promise<void>): Promise<void> {
    await test.step(`I click on ${element.name}`, async () => {
        if (!(await element.locator().isVisible())) {
            await fallbackAction();
        }
        await clickElement(element);
    });
}
