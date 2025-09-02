import { test as base, APIRequestContext } from '@playwright/test';
import { BonusApiFactory } from '../bonus/bonusApiFactory';
import type { BonusApiClient } from '../bonus/bonusApi';
import type { AleaApiClient } from '../alea/aleaApi';

/**
 * Test data interface for bonus operations
 */
export interface TestData {
  bonusId: number;
  profileId: number;
  bonusAmount: number;
  profileBonusId: string;
  currency: string;
  comment: string;
}

/**
 * API client fixtures type definition
 */
export type ApiClients = {
  bonusApi: BonusApiClient;
  aleaApi: AleaApiClient;
  testData: TestData;
}

/**
 * Creates a BonusApiClient fixture for stage environment
 * Uses environment variables for credentials or defaults
 */
function createBonusApiFixture() {
  return async (
    { request }: { request: APIRequestContext },
    use: (fixture: BonusApiClient) => Promise<void>
  ): Promise<void> => {
    const bonusApi = BonusApiFactory.createStageClient(request);
    await use(bonusApi);
  };
}

/**
 * Creates an AleaApiClient fixture with active session
 * Uses environment variables for credentials with sensible defaults
 */
function createAleaApiFixture() {
  return async (
    { request }: { request: APIRequestContext },
    use: (fixture: AleaApiClient) => Promise<void>
  ): Promise<void> => {
    // Use environment variables or default test credentials
    const username = process.env.USER || 'mpetrov15@sbtsolution.com';
    const password = process.env.PASS || 'Mpetrov15@sbtsolution.com';
    
    const aleaApi = await BonusApiFactory.createAleaClientWithSession(
      request, 
      'stage', 
      username, 
      password
    );
    await use(aleaApi);
  };
}

/**
 * Creates a TestData fixture with default test data
 * Provides consistent test data across all tests
 */
function createTestDataFixture() {
  return async (
    { request: _request }: { request: APIRequestContext },
    use: (fixture: TestData) => Promise<void>
  ): Promise<void> => {
    const testData = BonusApiFactory.getDefaultTestData();
    await use(testData);
  };
}

/**
 * Extended test with API client fixtures
 * Use this as a base for tests that need API clients
 */
export const apiTest = base.extend<ApiClients>({
  bonusApi: createBonusApiFixture(),
  aleaApi: createAleaApiFixture(),
  testData: createTestDataFixture()
});

/**
 * Re-export common Playwright test utilities for convenience
 */
export const { expect, describe } = apiTest;
