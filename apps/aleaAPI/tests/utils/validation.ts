import { expect } from '@playwright/test';
import { ExpectedValues, StepData } from '../types';

// Type definitions for validation
type ValidationValue = string | number | boolean | null | Record<string, unknown>;

// Helper: recursively assert that actual equals expected.
function assertDeepEqual(
  actual: ValidationValue,
  expected: ValidationValue,
  path: string,
  scenarioName: string,
  stepIndex: number
) {
  if (expected && typeof expected === 'object' && !Array.isArray(expected) && expected !== null) {
    const expectedObj = expected as Record<string, unknown>;
    const actualObj = actual as Record<string, unknown>;
    
    for (const key in expectedObj) {
      assertDeepEqual(
        actualObj?.[key] as ValidationValue,
        expectedObj[key] as ValidationValue,
        `${path}.${key}`,
        scenarioName,
        stepIndex
      );
    }
  } else {
    const assertionMessage = `[${scenarioName} | Step #${
      stepIndex + 1
    }] Expected "${path}" to be ${expected}, but got ${actual}`;
    expect(actual, assertionMessage).toEqual(expected);
  }
}

export function validateExpectedValues(
  step: StepData,
  scenarioName: string,
  index: number
): void {
  const requiredKeys: (keyof ExpectedValues)[] = [
    'statusCode',
    'id',
    'realAmount',
    'bet',
    'win',
    'isAlreadyProcessed',
  ];

  if (!step.expectedValues) {
    throw new Error(
      `Missing "expectedValues" in step #${
        index + 1
      } of scenario "${scenarioName}".`
    );
  }

  if (step.expectedValues.statusCode === 200 && step.type !== 'ROLLBACK') {
    for (const key of requiredKeys) {
      if (step.expectedValues[key] === undefined) {
        throw new Error(
          `Missing "${key}" in "expectedValues" for step #${
            index + 1
          } of scenario "${scenarioName}".`
        );
      }
    }
  }
}

export function validateResponse(
  response: Record<string, unknown>,
  expected: ExpectedValues,
  scenarioName: string,
  stepIndex: number
) {
  for (const key in expected) {
    if (key === 'statusCode') continue;
    assertDeepEqual(
      response[key] as ValidationValue,
      expected[key as keyof ExpectedValues] as ValidationValue,
      key,
      scenarioName,
      stepIndex
    );
  }
}

export function validateBalance(
  actualBalance: number,
  expectedBalance: number,
  scenarioName: string,
  stepIndex: number
): void {
  const message = `[${scenarioName} | Step #${
    stepIndex + 1
  }] Expected realBalance to be ${expectedBalance}, but got ${actualBalance}`;
  expect(actualBalance, message).toEqual(expectedBalance);
}
