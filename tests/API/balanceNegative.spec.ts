import { test, expect, APIRequestContext } from '@playwright/test';
import { BASE_GET_PARAMS, BASE_PLAYER_ID, SECRET } from './constants';
import { computeGetSignature, computeHash } from './utils/crypto';

test.describe.configure({ mode: 'serial' });

class TransactionService {
  constructor(private request: APIRequestContext) {}

  // Helper to build headers with a digest hash
  private buildHeaders(digest: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Digest': `SHA-512=${digest}`
    };
  }

   async getBalance(params: any, signature?: string) {
    // Use the provided signature if available (for negative tests); otherwise compute one.
    const sig = signature ? signature : computeGetSignature(params, SECRET);
    const response = await this.request.get(`brandId/1/players/${params.playerId}/balance`, {
      params,
      headers: this.buildHeaders(sig)
    });
    const body = await response.json();
    return { response, body };
  }

  async executeTransaction(payload: any) {
    const hash = computeHash(payload);
    // Remove secret from payload before sending
    const { secret, ...requestPayload } = payload;
    return this.request.post('transactions', {
      data: requestPayload,
      headers: this.buildHeaders(hash)
    });
  }
}

const NEGATIVE_TEST_CASES = [
  {
    name: 'Invalid player identifier',
    params: { playerId: 'wr0ngPl4y3r' },
    // useService flag not needed anymore since we use the service method for all cases
    expectedStatus: 500,
    expectedResponse: {
      status: 'ERROR',
      code: 'INVALID_REQUEST',
      message: 'Digest could not be validated'
    }
  },
  {
    name: 'Invalid currency (USD)',
    params: { ...BASE_GET_PARAMS, currency: 'USD', playerId: BASE_PLAYER_ID },
    expectedStatus: 500,
    expectedResponse: {
      status: 'ERROR',
      code: 'INVALID_REQUEST',
      message: 'Invalid player currency.'
    }
  },
  {
    name: 'Invalid signature',
    params: { ...BASE_GET_PARAMS, playerId: BASE_PLAYER_ID },
    signature: 'invalidsignature',
    expectedStatus: 500,
    expectedResponse: {
      status: 'ERROR',
      code: 'INVALID_REQUEST',
      message: 'Digest hash does not match the body'
    }
  }
];

test.describe('Balance Tests', () => {
  let transactionService: TransactionService;

  test.beforeEach(async ({ request }) => {
    transactionService = new TransactionService(request);
  });

  // Positive test case using the service's getBalance method.
  test('Valid balance retrieval returns 200 and numeric balance', async () => {
    const params = { ...BASE_GET_PARAMS, playerId: BASE_PLAYER_ID };
    const { response, body } = await transactionService.getBalance(params);
    expect(response.status(), 'Status code should be 200 for valid request').toBe(200);
    expect(typeof body.realBalance, 'Response should contain numeric realBalance').toBe('number');
  });

  // Data-driven negative test cases.
  NEGATIVE_TEST_CASES.forEach((testCase) => {
    test(`${testCase.name} should return ${testCase.expectedStatus} with proper error`, async () => {
      const { response, body } = await transactionService.getBalance(testCase.params, testCase.signature);
      expect(response.status(), `Status code should be ${testCase.expectedStatus} for ${testCase.name}`)
        .toBe(testCase.expectedStatus);
      expect(body, `Response should match expected error for ${testCase.name}`)
        .toEqual(testCase.expectedResponse);
    });
  });
});
