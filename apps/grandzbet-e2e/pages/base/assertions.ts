import test, { expect } from './base.po';


export async function assertEqualWithMessage<T>(actual: T, expected: T, message: string) {
  await test.step(message, async () => {
        await expect(actual, message).toBe(expected);
  });
}
