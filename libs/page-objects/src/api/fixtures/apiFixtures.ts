import { test as base, APIRequestContext } from '@playwright/test';
import { BonusApiFactory } from '../bonus/bonusApiFactory';
import type { BonusApiClient } from '../bonus/bonusApi';
import type { AleaApiClient } from '../alea/aleaApi';
import { PaymentIqApiClient } from '../payment/paymentIqApi';

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
  paymentIqApi: PaymentIqApiClient;
  testData: TestData;
}

/**
 * Extended test with API client fixtures
 * Use this as a base for tests that need API clients
 */
export const apiTest = base.extend<ApiClients>({
  bonusApi: async ({ request }, use) => {
    const bonusApi = BonusApiFactory.createStageClient(request);
    await use(bonusApi);
  },

  aleaApi: async ({ request }, use) => {
    const username = process.env.USER || 'mpetrov15@sbtsolution.com';
    const password = process.env.PASS || 'Mpetrov15@sbtsolution.com';
    
    const aleaApi = await BonusApiFactory.createAleaClientWithSession(
      request, 
      'stage', 
      username, 
      password
    );
    await use(aleaApi);
  },

  paymentIqApi: async ({ request }, use) => {
    const config = {
      baseUrl: 'https://stage-payments.spacefortuna.com',
      brandId: process.env.PAYMENTIQ_MERCHANT_ID || '100471006', // Use merchant ID as brand ID
      merchantId: process.env.PAYMENTIQ_MERCHANT_ID || '100471006'
    };
    
    const paymentIqApi = new PaymentIqApiClient(request, config);
    await use(paymentIqApi);
  },

  testData: async ({ request }, use) => {
    const testData = BonusApiFactory.getDefaultTestData();
    await use(testData);
  },
});

/**
 * Re-export common Playwright test utilities for convenience
 */
export const { expect, describe } = apiTest;
