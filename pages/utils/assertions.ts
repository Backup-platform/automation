import { Locator, Page } from '@playwright/test';
import test, { expect } from './base.po';


export async function assertEqualWithMessage(actual: any, expected: any, message: string) {
  await test.step(message, async () => {
        await expect(actual, message).toEqual(expected);
  });
}
