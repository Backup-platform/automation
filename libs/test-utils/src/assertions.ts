/// <reference lib="dom" />
import { Locator, test, expect } from '@playwright/test';
import { CompositeLocator } from './core-types';

/**
 * Core assertion functions for element state validation
 */

function stepMessage(description: string, action: string, state?: string) {
    return `Expect ${description} to${action ? ' ' + action : ''}${state ? ' be ' + state : ''}`.replace(/  +/g, ' ');
}

/**
 * Core assertion engine for visibility, enabled, or editable states.
 *
 * @param element - Playwright Locator of the element to assert.
 * @param assertionType - Type of assertion: 'visible', 'enabled' , or 'editable'.
 * @param shouldMatch - If true, asserts the element matches the state; if false, asserts the opposite.
 * @param description - Name or description of the element for logging. Default is 'Element'.
 * @param softAssert - If true, logs failures without stopping the test (soft assertion). Default is false.
 * @returns Promise<void>
 */
export async function assertCondition(
  element: Locator,
  assertionType: 'visible' | 'enabled' | 'editable',
  shouldMatch: boolean,
  description = 'Element',
  softAssert = false
): Promise<void> {
  const action = shouldMatch ? '' : 'NOT';
  const message = stepMessage(description, action, assertionType);

  // Choose the correct expect API
  const assertionExpected = softAssert ? expect.soft : expect;

  // Map our three assertion types onto Playwright's expect API
  const assertionMap = {
    visible: {
      positive: async () => await assertionExpected(element, message).toBeVisible(),
      negative: async () => await assertionExpected(element, message).not.toBeVisible(),
    },
    enabled: {
      positive: async () => await assertionExpected(element, message).toBeEnabled(),
      negative: async () => await assertionExpected(element, message).not.toBeEnabled(),
    },
    editable: {
      positive: async () => await assertionExpected(element, message).toBeEditable(),
      negative: async () => await assertionExpected(element, message).not.toBeEditable(),
    },
  };

  await test.step(message, async () => {
    const assertion = assertionMap[assertionType];
    if (shouldMatch) {
      await assertion.positive();
    } else {
      await assertion.negative();
    }
  });
}

export async function assertVisibleNotActionable(element: CompositeLocator): Promise<void> {
    await test.step(`I validate and element ${element.name} is visible but not actionable`, async () => {
        await assertCondition(element.locator(), 'visible', true, element.name, false);
        // Additional actionability checks can be added here
    });
}

export async function assertVisible(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertCondition(element.locator(), 'visible', true, element.name, softAssert);
}

export async function assertNotVisible(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertCondition(element.locator(), 'visible', false, element.name, softAssert);
}

export async function assertEditable(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertCondition(element.locator(), 'editable', true, element.name, softAssert);
}

export async function assertNotEditable(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertCondition(element.locator(), 'editable', false, element.name, softAssert);
}

export async function assertEnabled(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertCondition(element.locator(), 'enabled', true, element.name, softAssert);
}

export async function assertNotEnabled(element: CompositeLocator, softAssert = false): Promise<void> {
    await assertCondition(element.locator(), 'enabled', false, element.name, softAssert);
}
