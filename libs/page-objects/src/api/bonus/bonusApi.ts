import { APIRequestContext, test } from '@playwright/test';
import type { BonusRequirement, BonusStatusType, BonusTemplate, BonusType } from '../../bonuses';
import type { AleaApiClient } from '../alea/aleaApi';
import type { PaymentIqApiClient } from '../payment/paymentIqApi';

export interface BonusApiConfig {
  baseUrl: string;
  authUrl: string;
  backofficeUrl: string;
  username: string;
  password: string;
  backofficeUsername?: string;
  backofficePassword?: string;
}

export interface AuthTokens {
  accessToken?: string;
  backofficeToken?: string;
}

export interface BonusData {
  bonusId: string;
  profileId: string;
  bonusAmount: string;
  profileBonusId: string;
  currency: string;
  comment?: string;
}

export interface MoneyTransferInput {
  amount: number;
  currency: string;
  deposit: boolean;
  reason: string;
  comment: string;
}

export interface WalletInfo {
  balance: number;
  currency: string;
  id: number;
}

export interface BonusResponse {
  status: string;
  message: string;
  description: string;
}

export interface ProfileBonus {
  betsAmount: number;
  bonusId: number;
  bonusModel: string;
  cashierAvailabilityDate: string;
  claimed: boolean;
  createdAt: string;
  expireDate: string;
  fixedBonusAmount: number;
  freeSpinsCount: number;
  id: string;
  initialBonusAmount: number;
  maxBonus: number;
  maxDeposit: number;
  minBonus: number;
  minDeposit: number;
  neededBetsAmount: number;
  profileId: number;
  status: string;
  transactionId: string;
  validTo: string;
  wageringModel: string;
  wageFactor: number;
}

export interface UserBonus {
  bonusId: number;
  cmsBonus: Record<string, unknown> | null;
  canCancel: boolean;
  profileBonus: ProfileBonus;
}

export interface UserBonusesResponse {
  activeBonuses?: UserBonus[];
  pendingBonuses?: UserBonus[];
  issuedBonuses?: UserBonus[];
  freeSpinsWaitingBonuses?: UserBonus[];
}

export class BonusApiClient {
  private request: APIRequestContext;
  private config: BonusApiConfig;
  private tokens: AuthTokens = {};

  constructor(request: APIRequestContext, config: BonusApiConfig) {
    this.request = request;
    this.config = config;
  }

  /**
   * Get authentication token for front office operations
   */
  async getFrontOfficeToken(): Promise<string> {
    const requestPayload = {
      client_id: 'frontoffice-client',
      grant_type: 'password',
      username: this.config.username,
      password: '***' // masked for logging
    };
    
    console.log('[BonusApi][getFrontOfficeToken] REQUEST', {
      url: `${this.config.authUrl}/auth/realms/casino/protocol/openid-connect/token`,
      payload: requestPayload
    });

    const response = await this.request.post(`${this.config.authUrl}/auth/realms/casino/protocol/openid-connect/token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        client_id: 'frontoffice-client',
        grant_type: 'password',
        username: this.config.username,
        password: this.config.password
      }
    });

    console.log('[BonusApi][getFrontOfficeToken] RESPONSE', {
      status: response.status(),
      ok: response.ok(),
      statusText: response.statusText()
    });

    if (!response.ok()) {
      let errorBody;
      try {
        errorBody = await response.text();
      } catch {
        errorBody = 'Could not read response body';
      }
      console.error('[BonusApi][getFrontOfficeToken] ERROR BODY', errorBody);
      throw new Error(`Failed to get front office token: ${response.status()} - ${errorBody}`);
    }

    const data = await response.json();
    console.log('[BonusApi][getFrontOfficeToken] SUCCESS', { 
      hasAccessToken: !!data.access_token,
      tokenLength: data.access_token?.length 
    });
    this.tokens.accessToken = data.access_token;
    return data.access_token;
  }

  /**
   * Get authentication token for back office operations
   */
  async getBackOfficeToken(): Promise<string> {
    // Use environment variables for back office credentials
    const backofficeUsername = this.config.backofficeUsername || process.env.BACKOFFICE_USER;
    const backofficePassword = this.config.backofficePassword || process.env.BACKOFFICE_PASS;

    if (!backofficeUsername || !backofficePassword) {
      throw new Error('Back office credentials not provided. Set BACKOFFICE_USER and BACKOFFICE_PASS environment variables or pass backofficeUsername/backofficePassword in config.');
    }

    const response = await this.request.post(`${this.config.authUrl}/auth/realms/backoffice/protocol/openid-connect/token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        client_id: 'backoffice-client',
        grant_type: 'password',
        username: backofficeUsername,
        password: backofficePassword
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to get back office token: ${response.status()}`);
    }

    const data = await response.json();
    this.tokens.backofficeToken = data.access_token;
    return data.access_token;
  }

  /**
   * Fetch all user bonuses with different statuses
   * Corresponds to validateAllTabContent() method in bonuses.po.ts
   */
  async fetchAllUserBonuses(locale = 'en'): Promise<UserBonusesResponse> {
    if (!this.tokens.accessToken) {
      await this.getFrontOfficeToken();
    }

    console.log('[BonusApi][fetchAllUserBonuses] START locale=', locale);

    const query = `
      query fetchUserBonuses($locale: String) {
        activeBonuses: userBonuses(locale: $locale, status: ACTIVE) {
          bonusId
          cmsBonus
          canCancel
          profileBonus {
            betsAmount
            bonusId
            bonusModel
            cashierAvailabilityDate
            claimed
            createdAt
            expireDate
            fixedBonusAmount
            freeSpinsCount
            id
            initialBonusAmount
            maxBonus
            maxDeposit
            minBonus
            minDeposit
            neededBetsAmount
            profileId
            status
            transactionId
            validTo
            wageringModel
            wageFactor
          }
        }
        issuedBonuses: userBonuses(locale: $locale, status: ISSUED) {
          bonusId
          cmsBonus
          canCancel
          profileBonus {
            betsAmount
            bonusId
            bonusModel
            cashierAvailabilityDate
            claimed
            createdAt
            expireDate
            fixedBonusAmount
            freeSpinsCount
            id
            initialBonusAmount
            maxBonus
            maxDeposit
            minBonus
            minDeposit
            neededBetsAmount
            profileId
            status
            transactionId
            validTo
            wageringModel
            wageFactor
          }
        }
        freeSpinsWaitingBonuses: userBonuses(locale: $locale, status: FREE_SPINS_WAITING) {
          bonusId
          cmsBonus
          profileBonus {
            betsAmount
            bonusId
            bonusModel
            cashierAvailabilityDate
            claimed
            createdAt
            expireDate
            fixedBonusAmount
            freeSpinsCount
            id
            initialBonusAmount
            maxBonus
            maxDeposit
            minBonus
            minDeposit
            neededBetsAmount
            profileId
            status
            transactionId
            validTo
            wageringModel
            wageFactor
          }
        }
        pendingBonuses: userBonuses(locale: $locale, status: PENDING) {
          bonusId
          canCancel
          cmsBonus
          profileBonus {
            betsAmount
            bonusId
            bonusModel
            cashierAvailabilityDate
            claimed
            createdAt
            expireDate
            fixedBonusAmount
            freeSpinsCount
            id
            initialBonusAmount
            maxBonus
            maxDeposit
            minBonus
            minDeposit
            neededBetsAmount
            profileId
            status
            transactionId
            validTo
            wageringModel
            wageFactor
          }
        }
      }
    `;

    const response = await this.request.post(`${this.config.baseUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'fetchUserBonuses',
        variables: { locale },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to fetch user bonuses: ${response.status()}`);
    }

    const result = await response.json();
    console.log('[BonusApi][fetchAllUserBonuses] RECEIVED statuses:', {
      active: result.data?.activeBonuses?.length,
      issued: result.data?.issuedBonuses?.length,
      pending: result.data?.pendingBonuses?.length,
      freeSpinsWaiting: result.data?.freeSpinsWaitingBonuses?.length
    });
    return result.data;
  }

  /**
   * Fetch only active bonuses
   * Corresponds to validateActiveTabContent() method in bonuses.po.ts
   */
  async fetchActiveBonuses(locale = 'en'): Promise<UserBonus[]> {
    if (!this.tokens.accessToken) {
      await this.getFrontOfficeToken();
    }

    const query = `
      query fetchActiveBonuses($locale: String) {
        activeBonuses: userBonuses(locale: $locale, status: ACTIVE) {
          bonusId
          cmsBonus
          canCancel
          profileBonus {
            betsAmount
            bonusId
            bonusModel
            cashierAvailabilityDate
            claimed
            createdAt
            expireDate
            fixedBonusAmount
            freeSpinsCount
            id
            initialBonusAmount
            maxBonus
            maxDeposit
            minBonus
            minDeposit
            neededBetsAmount
            profileId
            status
            transactionId
            validTo
            wageringModel
            wageFactor
          }
        }
      }
    `;

    const response = await this.request.post(`${this.config.baseUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'fetchActiveBonuses',
        variables: { locale },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to fetch active bonuses: ${response.status()}`);
    }

    const result = await response.json();
    return result.data.activeBonuses || [];
  }

  /**
   * Fetch only pending bonuses
   * Corresponds to validatePendingTabContent() method in bonuses.po.ts
   */
  async fetchPendingBonuses(locale = 'en'): Promise<UserBonus[]> {
    if (!this.tokens.accessToken) {
      await this.getFrontOfficeToken();
    }

    const query = `
      query fetchPendingBonuses($locale: String) {
        pendingBonuses: userBonuses(locale: $locale, status: PENDING) {
          bonusId
          canCancel
          cmsBonus
          profileBonus {
            betsAmount
            bonusId
            bonusModel
            cashierAvailabilityDate
            claimed
            createdAt
            expireDate
            fixedBonusAmount
            freeSpinsCount
            id
            initialBonusAmount
            maxBonus
            maxDeposit
            minBonus
            minDeposit
            neededBetsAmount
            profileId
            status
            transactionId
            validTo
            wageringModel
            wageFactor
          }
        }
      }
    `;

    const response = await this.request.post(`${this.config.baseUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'fetchPendingBonuses',
        variables: { locale },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to fetch pending bonuses: ${response.status()}`);
    }

    const result = await response.json();
    return result.data.pendingBonuses || [];
  }

  /**
   * Fetch only available (issued) bonuses
   * Corresponds to validateAvailableTabContent() method in bonuses.po.ts
   */
  async fetchAvailableBonuses(locale = 'en'): Promise<UserBonus[]> {
    if (!this.tokens.accessToken) {
      await this.getFrontOfficeToken();
    }

    const query = `
      query fetchAvailableBonuses($locale: String) {
        issuedBonuses: userBonuses(locale: $locale, status: ISSUED) {
          bonusId
          cmsBonus
          canCancel
          profileBonus {
            betsAmount
            bonusId
            bonusModel
            cashierAvailabilityDate
            claimed
            createdAt
            expireDate
            fixedBonusAmount
            freeSpinsCount
            id
            initialBonusAmount
            maxBonus
            maxDeposit
            minBonus
            minDeposit
            neededBetsAmount
            profileId
            status
            transactionId
            validTo
            wageringModel
            wageFactor
          }
        }
      }
    `;

    const response = await this.request.post(`${this.config.baseUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'fetchAvailableBonuses',
        variables: { locale },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to fetch available bonuses: ${response.status()}`);
    }

    const result = await response.json();
    return result.data.issuedBonuses || [];
  }

  /**
   * Grant a bonus to a user via back office
   */
  async grantBonus(bonusData: {
    bonusId: number;
    profileId: number;
    bonusAmount: number;
    reason?: string;
    comment?: string;
    maxDeposit?: number;
    minDeposit?: number;
  }): Promise<BonusResponse> {
    if (!this.tokens.backofficeToken) {
      await this.getBackOfficeToken();
    }

    const query = `
      mutation GrantBonus($bonusId: BigInteger!, $profileId: BigInteger!, $bonusAmount: BigDecimal!, $reason: String!, $comment: String!, $maxDeposit: BigDecimal, $minDeposit: BigDecimal) {
        grantBonus(
          bonusId: $bonusId
          profileId: $profileId
          bonusAmount: $bonusAmount
          reason: $reason
          comment: $comment
          maxDeposit: $maxDeposit
          minDeposit: $minDeposit
        ) {
          description
          message
          status
        }
      }
    `;

    const variables = {
      bonusId: bonusData.bonusId,
      profileId: bonusData.profileId,
      bonusAmount: bonusData.bonusAmount,
      reason: bonusData.reason || 'Gift - Technical issue',
      comment: bonusData.comment || 'test',
      maxDeposit: bonusData.maxDeposit || null,
      minDeposit: bonusData.minDeposit || null
    };

    const response = await this.request.post(`${this.config.backofficeUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.backofficeToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'GrantBonus',
        variables,
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to grant bonus: ${response.status()}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors in grant bonus: ${JSON.stringify(result.errors)}`);
    }
    
    if (!result.data || !result.data.grantBonus) {
      throw new Error(`Unexpected grant bonus response structure: ${JSON.stringify(result)}`);
    }
    
    return result.data.grantBonus;
  }

  /**
   * Claim a profile bonus via front office
   * Corresponds to clicking claim/activate buttons in bonusCard.po.ts
   */
  async claimProfileBonus(profileBonusId: string | number, currency: string, transactionId?: string): Promise<BonusResponse> {
    if (!this.tokens.accessToken) {
      await this.getFrontOfficeToken();
    }

    const query = `
      mutation ClaimProfileBonus($profileBonusId: BigInteger!, $currency: String!, $transactionId: String) {
        claimProfileBonus(
          profileBonusId: $profileBonusId
          currency: $currency
          transactionId: $transactionId
        ) {
          description
          message
          status
        }
      }
    `;

    const response = await this.request.post(`${this.config.baseUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'ClaimProfileBonus',
        variables: {
          profileBonusId: typeof profileBonusId === 'string' ? parseInt(profileBonusId) : profileBonusId,
          currency,
          transactionId: transactionId || null
        },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to claim profile bonus: ${response.status()}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors in claim profile bonus: ${JSON.stringify(result.errors)}`);
    }
    
    if (!result.data || !result.data.claimProfileBonus) {
      throw new Error(`Unexpected claim profile bonus response structure: ${JSON.stringify(result)}`);
    }
    
    return result.data.claimProfileBonus;
  }

  /**
   * Cancel a profile bonus via back office
   */
  async cancelProfileBonus(profileBonusId: number, comment?: string): Promise<BonusResponse> {
    if (!this.tokens.backofficeToken) {
      await this.getBackOfficeToken();
    }

    const query = `
      mutation cancelProfileBonus($profileBonusId: BigInteger!, $comment: String) {
        cancelProfileBonus(profileBonusId: $profileBonusId, comment: $comment) {
          status
          message
          description
        }
      }
    `;

    const response = await this.request.post(`${this.config.backofficeUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.backofficeToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'cancelProfileBonus',
        variables: {
          profileBonusId,
          comment: comment || 'test'
        },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to cancel profile bonus: ${response.status()}`);
    }

    const result = await response.json();
    return result.data.cancelProfileBonus;
  }

  /**
   * Cancel a bonus via front office
   * Corresponds to clickCancelBonusButton() method in bonusCard.po.ts
   */
  async cancelBonus(bonusId: string): Promise<{ success: boolean; message: string }> {
    if (!this.tokens.accessToken) {
      await this.getFrontOfficeToken();
    }

    const query = `
      mutation cancelBonus($bonusId: String!) {
        cancelBonus(bonusId: $bonusId) {
          success
          message
        }
      }
    `;

    const response = await this.request.post(`${this.config.baseUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'cancelBonus',
        variables: { bonusId },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to cancel bonus: ${response.status()}`);
    }

    const result = await response.json();
    
    // Handle different response structures
    if (result.data && result.data.cancelBonus) {
      return result.data.cancelBonus;
    } else if (result.errors) {
      return { success: false, message: `GraphQL errors: ${JSON.stringify(result.errors)}` };
    } else {
      return { success: false, message: `Unexpected response: ${JSON.stringify(result)}` };
    }
  }

  /**
   * Claim a bonus via front office
   * Corresponds to clickPrimaryButton() method in bonusCard.po.ts for available cards
   */
  async claimBonus(bonusId: string): Promise<{ success: boolean; message: string; bonus?: { id: string; status: string } }> {
    if (!this.tokens.accessToken) {
      await this.getFrontOfficeToken();
    }

    const query = `
      mutation claimBonus($bonusId: String!) {
        claimBonus(bonusId: $bonusId) {
          success
          message
          bonus {
            id
            status
          }
        }
      }
    `;

    const response = await this.request.post(`${this.config.baseUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'claimBonus',
        variables: { bonusId },
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to claim bonus: ${response.status()}`);
    }

    const result = await response.json();
    return result.data.claimBonus;
  }

  /**
   * Validate bonus card structure for testing
   * Ensures API returns data structure expected by page objects
   */
  async validateBonusCardStructure(locale = 'en'): Promise<boolean> {
    const bonuses = await this.fetchAllUserBonuses(locale);
    
    const allBonuses: UserBonus[] = [];
    if (bonuses.activeBonuses) allBonuses.push(...bonuses.activeBonuses);
    if (bonuses.pendingBonuses) allBonuses.push(...bonuses.pendingBonuses);
    if (bonuses.issuedBonuses) allBonuses.push(...bonuses.issuedBonuses);

    if (allBonuses.length === 0) {
      return true; // No bonuses to validate is considered valid
    }

    const firstBonus = allBonuses[0];
    
    // Validate structure matches what bonusCard.po.ts expects
    const hasRequiredFields = !!(
      firstBonus.bonusId &&
      firstBonus.profileBonus &&
      firstBonus.profileBonus.status &&
      firstBonus.profileBonus.bonusModel
    );

    return hasRequiredFields;
  }

  /**
   * Get current tokens (useful for debugging)
   */
  getTokens(): AuthTokens {
    return { ...this.tokens };
  }

  /**
   * Clear stored tokens (useful for testing different auth states)
   */
  clearTokens(): void {
    this.tokens = {};
  }

  /**
   * Cancel all user bonuses across all states
   * @param comment - Optional comment for cancellation
   */
  async cancelAllUserBonuses(comment = 'Automated cleanup'): Promise<void> {
    try {
      const allBonuses = await this.fetchAllUserBonuses();
      const bonusesToCancel: { id: string; type: string; bonusId: number }[] = [];
      
      const allBonusArrays = [
        { bonuses: allBonuses.activeBonuses, type: 'active' },
        { bonuses: allBonuses.pendingBonuses, type: 'pending' },
        { bonuses: allBonuses.issuedBonuses, type: 'issued' },
        { bonuses: allBonuses.freeSpinsWaitingBonuses, type: 'freeSpinsWaiting' }
      ];
      
      allBonusArrays.forEach(({ bonuses, type }) => {
        if (bonuses) {
          bonuses.forEach(bonus => {
            if (bonus.profileBonus?.id) {
              bonusesToCancel.push({
                id: bonus.profileBonus.id,
                type,
                bonusId: bonus.bonusId
              });
            }
          });
        }
      });
      
      if (bonusesToCancel.length === 0) {
        return;
      }
      
      console.log('[BonusApi][cancelAllUserBonuses] Cancelling bonuses concurrently', { count: bonusesToCancel.length });
      
      const cancellationPromises = bonusesToCancel.map(bonus =>
        this.cancelProfileBonus(parseInt(bonus.id), `${comment} - forceful cancellation of ${bonus.type} bonus ${bonus.bonusId}`)
          .then(() => ({ success: true, bonus }))
          .catch(error => ({ success: false, bonus, error }))
      );
      
      const results = await Promise.allSettled(cancellationPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            console.log('[BonusApi][cancelAllUserBonuses] SUCCESS', {
              type: result.value.bonus.type,
              bonusId: result.value.bonus.bonusId,
              profileBonusId: result.value.bonus.id
            });
          } else {
            console.warn('[BonusApi][cancelAllUserBonuses] FAILURE', {
              type: result.value.bonus.type,
              bonusId: result.value.bonus.bonusId,
              profileBonusId: result.value.bonus.id,
              error: (result.value as { success: false; bonus: { id: string; type: string; bonusId: number }; error: Error }).error.message
            });
          }
        }
      });
    } catch (error) {
      console.warn('[BonusApi][cancelAllUserBonuses] Cleanup error', { error: (error as Error).message });
    }
  }

  /**
   * Setup a queue of bonuses by granting and claiming them in sequence.
   * Automatically handles both deposit and no-deposit bonuses based on template configuration.
   * 
   * @param testData - Base test data (profileId, currency, etc.)
   * @param bonusSetup - Array of bonus configurations with template and desired initial state
   * @param options - Optional configuration for deposit bonuses and wait times
   *   - aleaApi: Required for deposit bonuses
   *   - paymentIqApi: Required for deposit bonuses
   *   - waitTime: Wait time between operations (default: 500ms)
   * 
   * @example
   * // No-deposit bonus
   * await bonusApi.setupBonusQueue(testData, [
   *   { template: BONUS_TEMPLATES.NO_DEPOSIT_CASH, amount: 50, comment: 'Test bonus', initialStatus: 'wagering' }
   * ], { waitTime: 1000 });
   * 
   * @example
   * // Deposit bonus
   * await bonusApi.setupBonusQueue(testData, [
   *   { 
   *     template: BONUS_TEMPLATES.DEPOSIT_CASH,
   *     amount: 20, 
   *     comment: 'Deposit bonus',
   *     initialStatus: 'wagering'
   *   }
   * ], { aleaApi, paymentIqApi, waitTime: 1000 });
   */
  async   setupBonusQueue(
    testData: { profileId: number; currency: string }, 
    bonusSetup: Array<{ 
      template: BonusTemplate;
      amount: number; 
      comment: string; 
      initialStatus?: BonusStatusType;
    }>,
    options?: {
      aleaApi?: AleaApiClient;
      paymentIqApi?: PaymentIqApiClient;
      waitTime?: number;
    }
  ): Promise<void> {
  console.log('[BonusApi][setupBonusQueue] START', { profileId: testData.profileId, currency: testData.currency, count: bonusSetup.length });
  
  // Reset internal ordering tracker for a fresh queue setup
  this._internalClaimOrdering = { claimedPendingIds: [] };
  
  const actualWaitTime = options?.waitTime || 500;
  const aleaApi = options?.aleaApi;
  const paymentIqApi = options?.paymentIqApi;
      
  // NEW APPROACH: Grant and claim bonuses ONE BY ONE in the desired order
  // This ensures deterministic settlement order without race conditions
  console.log('[BonusApi][setupBonusQueue] ONE-BY-ONE approach: grant, claim, settle, repeat');
  
  // Order: Process active bonuses first (will be activated), then pending bonuses in their original order (queue order)
  // The first claimed bonus becomes ACTIVE, subsequent claimed bonuses go to PENDING queue in claim order
  const orderedBonuses: typeof bonusSetup = [];
  
  // 1. Active bonuses first (these are already in wagering state)
  orderedBonuses.push(...bonusSetup.filter(b => b.initialStatus === 'wagering'));
  
  // 2. Pending and available bonuses in ORIGINAL ORDER (preserves intended queue sequence)
  // Available bonuses have no initialStatus (undefined) or explicitly 'available'
  orderedBonuses.push(...bonusSetup.filter(b => b.initialStatus !== 'wagering'));
  
  console.log('[BonusApi][setupBonusQueue] Processing order:', orderedBonuses.map((b, i) => ({
    index: i,
    bonusId: b.template.id,
    amount: b.amount,
    initialStatus: b.initialStatus,
    requirement: b.template.bonusRequirement
  })));
  
  for (let i = 0; i < orderedBonuses.length; i++) {
    const bonus = orderedBonuses[i];
    // Only claim if explicitly set to 'wagering' or 'pending'. If undefined, leave as 'available' (issued).
    const shouldClaim = bonus.initialStatus === 'wagering' || bonus.initialStatus === 'pending';
    
    console.log('[BonusApi][setupBonusQueue] [Step 1/3] Grant bonus', { 
      index: i, 
      bonusId: bonus.template.id, 
      amount: bonus.amount, 
      initialStatus: bonus.initialStatus,
      willClaim: shouldClaim
    });
    
    // Step 1: Grant the bonus
    await this.grantBonus({
      bonusId: bonus.template.id,
      profileId: testData.profileId,
      bonusAmount: bonus.amount,
      comment: bonus.comment
    });
    
    await new Promise(resolve => setTimeout(resolve, actualWaitTime));
    
    if (!shouldClaim) {
      console.log('[BonusApi][setupBonusQueue] Bonus should stay AVAILABLE, skipping claim');
      continue;
    }
    
    // Step 2: Fetch and find the granted bonus
    console.log('[BonusApi][setupBonusQueue] [Step 2/3] Fetch granted bonus for claiming');
    const allBonuses = await this.fetchAllUserBonuses();
    const grantedBonus = allBonuses.issuedBonuses?.find((b: UserBonus) => {
      const bonusIdMatches = b.profileBonus.bonusId === bonus.template.id;
      const fixedMatches = b.profileBonus.fixedBonusAmount === bonus.amount;
      const initialMatches = b.profileBonus.initialBonusAmount === bonus.amount;
      return bonusIdMatches && (fixedMatches || initialMatches);
    });
    
    if (!grantedBonus) {
      console.warn('[BonusApi][setupBonusQueue] Could not find granted bonus in ISSUED list', { 
        bonusId: bonus.template.id, 
        amount: bonus.amount,
        issuedCount: allBonuses.issuedBonuses?.length 
      });
      continue;
    }
    
    console.log('[BonusApi][setupBonusQueue] [Step 3/3] Claim bonus', { 
      profileBonusId: grantedBonus.profileBonus.id,
      bonusId: bonus.template.id,
      isDeposit: bonus.template.bonusRequirement === 'deposit'
    });
    
    // Step 3: Claim the bonus
    const isDepositBonus = bonus.template.bonusRequirement === 'deposit';
    const canUsePaymentIQ = isDepositBonus && !!aleaApi && !!paymentIqApi;
    
    try {
      if (canUsePaymentIQ && paymentIqApi && aleaApi) {
        await paymentIqApi.claimDepositBonus(aleaApi, {
          userId: testData.profileId.toString(),
          profileBonusId: grantedBonus.profileBonus.id.toString(),
          txAmount: bonus.amount.toString() + '.00',
          txAmountCy: testData.currency || 'EUR'
        });
      } else {
        await this.performStandardClaimingOperation(grantedBonus, bonus, testData);
      }
    } catch (claimingError) {
      if (canUsePaymentIQ) {
        console.warn('[BonusApi][setupBonusQueue] PaymentIQ claiming failed, fallback to standard', { 
          bonusId: bonus.template.id, 
          error: (claimingError as Error).message 
        });
        await this.performStandardClaimingOperation(grantedBonus, bonus, testData);
      } else {
        throw claimingError;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, actualWaitTime));
    
    // Step 4: Wait for settlement
    console.log('[BonusApi][setupBonusQueue] Waiting for settlement...');
    try {
      await this.waitForClaimSettlement({
        setupBonus: bonus,
        claimedProfileBonusId: grantedBonus.profileBonus.id,
        initialStatus: bonus.initialStatus || 'pending',
        previouslyClaimedPendingIds: this.internalClaimOrdering.claimedPendingIds,
        timeoutMs: Math.max(20000, actualWaitTime * 24) // 20s timeout for settlement (increased for deposit bonuses)
      });
    } catch (e) {
      console.warn('[BonusApi][setupBonusQueue] Settlement polling timeout', { 
        index: i, 
        bonusId: bonus.template.id, 
        error: (e as Error).message 
      });
    }
    
    // Track the claimed bonus
    if ((bonus.initialStatus || 'pending') !== 'wagering') {
      this.internalClaimOrdering.claimedPendingIds.push(grantedBonus.profileBonus.id);
      console.log('[BonusApi][setupBonusQueue] Tracked as pending bonus', { 
        profileBonusId: grantedBonus.profileBonus.id, 
        totalPendings: this.internalClaimOrdering.claimedPendingIds.length 
      });
    } else {
      this.internalClaimOrdering.activeId = grantedBonus.profileBonus.id;
      console.log('[BonusApi][setupBonusQueue] Tracked as active bonus', { 
        profileBonusId: grantedBonus.profileBonus.id 
      });
    }
    
    console.log('[BonusApi][setupBonusQueue] Bonus fully processed', { 
      index: i, 
      bonusId: bonus.template.id, 
      remaining: orderedBonuses.length - i - 1 
    });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2s for deposit bonus settlement
  console.log('[BonusApi][setupBonusQueue] COMPLETE');
  }

  /**
   * Internal structure tracking ordering while claiming bonuses.
   * We attach it lazily the first time setupBonusQueue runs in a test process.
   */
  private _internalClaimOrdering?: { activeId?: string; claimedPendingIds: string[] };

  private get internalClaimOrdering(): { activeId?: string; claimedPendingIds: string[] } {
    if (!this._internalClaimOrdering) {
      this._internalClaimOrdering = { claimedPendingIds: [] } as { activeId?: string; claimedPendingIds: string[] };
    }
    return this._internalClaimOrdering;
  }

  /**
   * Generic polling utility for bonus state changes.
   * Polls fetchAllUserBonuses() and checks if a condition is met.
   * 
   * @param conditionFn - Function that receives UserBonusesResponse and returns true when condition is met
   * @param options - Polling configuration (timeout, interval, error message)
   */
  async pollForBonusStateChange(
    conditionFn: (bonuses: UserBonusesResponse) => boolean,
    options: { timeout?: number; interval?: number; errorMessage?: string; stepName?: string } = {}
  ): Promise<void> {
    const { timeout = 20000, interval = 2000, errorMessage = 'Timeout waiting for bonus state change', stepName } = options;
    
    const pollAction = async () => {
      const start = Date.now();

      while (Date.now() - start < timeout) {
        const bonuses = await this.fetchAllUserBonuses();
        
        if (conditionFn(bonuses)) {
          return; // Condition met
        }

        await new Promise(r => setTimeout(r, interval));
      }
      
      throw new Error(errorMessage);
    };

    if (stepName) {
      await test.step(stepName, pollAction);
    } else {
      await pollAction();
    }
  }

  /**
   * Poll until the claimed bonus reaches its expected collection (active/pending) and status.
   * Additionally verify ordering of pending bonuses matches claim order (index monotonicity).
   */
  private async waitForClaimSettlement(params: {
    setupBonus: { template: BonusTemplate; amount: number; initialStatus?: BonusStatusType };
    claimedProfileBonusId: string;
    initialStatus: BonusStatusType;
    previouslyClaimedPendingIds: string[];
    timeoutMs: number;
    pollIntervalMs?: number;
  }): Promise<void> {
    const { setupBonus, claimedProfileBonusId, initialStatus, previouslyClaimedPendingIds, timeoutMs, pollIntervalMs = 500 } = params;
    const targetIsActive = initialStatus === 'wagering';

    await this.pollForBonusStateChange(
      (bonuses) => {
        const activeList = bonuses.activeBonuses || [];
        const pendingList = bonuses.pendingBonuses || [];

        if (targetIsActive) {
          const foundActive = activeList.find(b => b.profileBonus.id === claimedProfileBonusId);
          return !!(foundActive && foundActive.profileBonus.status === 'ACTIVE');
        } else {
          const foundPending = pendingList.find(b => b.profileBonus.id === claimedProfileBonusId);
          if (foundPending && foundPending.profileBonus.status === 'PENDING') {
            // Validate ordering: all previously claimed pending IDs appear before this one
            const idOrder = pendingList.map(b => b.profileBonus.id);
            const nextPos = idOrder.indexOf(claimedProfileBonusId);
            const indicesValid = previouslyClaimedPendingIds.every((id, idx) => {
              const pos = idOrder.indexOf(id);
              if (pos === -1 || nextPos === -1) return false;
              if (pos >= nextPos) return false; // must appear before the newly claimed one
              if (idx > 0) {
                const prevPos = idOrder.indexOf(previouslyClaimedPendingIds[idx - 1]);
                if (prevPos === -1 || pos <= prevPos) return false; // maintain relative order
              }
              return true;
            });
            return indicesValid;
          }
          return false;
        }
      },
      {
        timeout: timeoutMs,
        interval: pollIntervalMs,
        errorMessage: `Timeout waiting for claim settlement (bonusId=${setupBonus.template.id}, profileBonusId=${claimedProfileBonusId}, target=${targetIsActive ? 'ACTIVE' : 'PENDING'})`
      }
    );
  }

  /**
   * Setup a two-bonus scenario (one active, one pending)
   * @param testData - Base test data
   * @param activeBonusConfig - Configuration for the active bonus
   * @param pendingBonusConfig - Configuration for the pending bonus  
   * @param waitTime - Wait time between operations
   */
  async setupTwoBonusScenario(
    testData: { profileId: number; currency: string },
    activeBonusConfig: { bonusId: number; amount: number; comment: string },
    pendingBonusConfig: { bonusId: number; amount: number; comment: string },
    waitTime = 1000
  ): Promise<void> {
    await this.grantBonus({
      bonusId: activeBonusConfig.bonusId,
      profileId: testData.profileId,
      bonusAmount: activeBonusConfig.amount,
      comment: activeBonusConfig.comment
    });
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    await this.grantBonus({
      bonusId: pendingBonusConfig.bonusId,
      profileId: testData.profileId,
      bonusAmount: pendingBonusConfig.amount,
      comment: pendingBonusConfig.comment
    });
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    const allBonuses = await this.fetchAllUserBonuses();
    const firstBonus = allBonuses.issuedBonuses?.find((bonus: UserBonus) => 
      bonus.profileBonus.bonusId === activeBonusConfig.bonusId
    );
    
    if (firstBonus) {
      await this.claimProfileBonus(firstBonus.profileBonus.id, testData.currency);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Private helper method to perform standard bonus claiming with timeout
   * @param matchingBonus - The matching bonus from the API
   * @param setupBonus - The setup bonus configuration
   * @param testData - Test data containing currency info
   */
  private async performStandardClaimingOperation(
    matchingBonus: UserBonus, 
    setupBonus: { template: BonusTemplate; amount: number; comment: string }, 
    testData: { currency: string }
  ): Promise<void> {
    console.log('[BonusApi][performStandardClaimingOperation] Claim standard', { bonusId: setupBonus.template.id, amount: setupBonus.amount });
    // Add timeout to claiming process
    const claimPromise = this.claimProfileBonus(matchingBonus.profileBonus.id, testData.currency);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Claiming timeout after 2.5 seconds for bonus ${setupBonus.template.id}`)), 2500)
    );
    
    await Promise.race([claimPromise, timeoutPromise]);
    console.log('[BonusApi][performStandardClaimingOperation] Claim success', { bonusId: setupBonus.template.id });
  }

  /**
   * Transfer money from user's wallet (add or remove balance)
   * Uses backoffice GraphQL API
   */
  async transferMoney(walletId: number, amount: number, currency = 'CAD', deposit = false, reason = 'OTHER', comment = 'Testing'): Promise<WalletInfo> {
    if (!this.tokens.backofficeToken) {
      await this.getBackOfficeToken();
    }

    const query = `
      mutation TransferMoney($password: [Int!]!, $transfer: MoneyTransferInput!, $walletId: BigInteger!) {
        updateBalance(transfer: $transfer, walletId: $walletId, password: $password) {
          balance
          currency
          id
        }
      }
    `;

    // Password array - "Testpass123!" converted to ASCII codes
    const password = [84, 101, 115, 116, 112, 97, 115, 115, 49, 50, 51, 33];

    const variables = {
      transfer: {
        amount,
        currency,
        deposit,
        reason,
        comment
      },
      walletId,
      password
    };

    console.log('[BonusApi][transferMoney] REQUEST', {
      url: `${this.config.backofficeUrl}/graphql`,
      walletId,
      amount,
      currency,
      deposit,
      reason,
      comment,
      hasBackofficeToken: !!this.tokens.backofficeToken
    });

    const response = await this.request.post(`${this.config.backofficeUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.backofficeToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'TransferMoney',
        variables,
        query
      }
    });

    console.log('[BonusApi][transferMoney] RESPONSE', {
      status: response.status(),
      ok: response.ok(),
      statusText: response.statusText()
    });

    if (!response.ok()) {
      let errorBody;
      try {
        errorBody = await response.text();
      } catch {
        errorBody = 'Could not read response body';
      }
      console.error('[BonusApi][transferMoney] ERROR BODY', errorBody);
      throw new Error(`Failed to transfer money: ${response.status()} - ${errorBody}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      // Check if it's an authorization error and log at lower level
      const isAuthError = result.errors.some((err: {extensions?: {code?: string; exception?: string}}) => 
        err.extensions?.code === 'forbidden' || 
        err.extensions?.exception?.includes('ForbiddenException')
      );
      
      if (isAuthError) {
        console.warn('[BonusApi][transferMoney] Authorization error - insufficient permissions');
      } else {
        console.log('[BonusApi][transferMoney] RESULT', JSON.stringify(result, null, 2));
        console.error('[BonusApi][transferMoney] GraphQL ERRORS', result.errors);
      }
      
      throw new Error(`GraphQL errors in transfer money: ${JSON.stringify(result.errors)}`);
    }
    
    console.log('[BonusApi][transferMoney] RESULT', JSON.stringify(result, null, 2));
    
    if (!result.data || !result.data.updateBalance) {
      throw new Error(`Unexpected transfer money response structure: ${JSON.stringify(result)}`);
    }
    
    return result.data.updateBalance;
  }

  /**
   * Get user wallet information
   * Uses backoffice GraphQL API
   */
  async getWallets(profileId: number): Promise<WalletInfo[]> {
    console.log('[BonusApi][getWallets] START profileId=', profileId);
    if (!this.tokens.backofficeToken) {
      await this.getBackOfficeToken();
    }

    const query = `
      query getWallets($profileId: BigInteger!) {
        wallets(profileId: $profileId) {
          balance
          currency
          id
        }
      }
    `;

    const variables = {
      profileId
    };

    const response = await this.request.post(`${this.config.backofficeUrl}/graphql`, {
      headers: {
        'Authorization': `Bearer ${this.tokens.backofficeToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'getWallets',
        variables,
        query
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to get wallets: ${response.status()}`);
    }

  const result = await response.json();
  console.log('[BonusApi][getWallets] RESULT count=', result.data?.wallets?.length);
    
    if (result.errors) {
      throw new Error(`GraphQL errors in get wallets: ${JSON.stringify(result.errors)}`);
    }
    
    if (!result.data || !result.data.wallets) {
      throw new Error(`Unexpected get wallets response structure: ${JSON.stringify(result)}`);
    }
    
    return result.data.wallets;
  }

  /**
   * Remove money from user's wallet - convenience method
   */
  async removeMoney(walletId: number, amount: number, currency = 'CAD', comment = 'Testing - Remove money'): Promise<WalletInfo> {
    return this.transferMoney(walletId, amount, currency, false, 'COMPENSATION', comment);
  }

  /**
   * Add money to user's wallet - convenience method
   */
  async addMoney(walletId: number, amount: number, currency = 'CAD', comment = 'Testing - Add money'): Promise<WalletInfo> {
    return this.transferMoney(walletId, amount, currency, true, 'PLAYER_DEPOSIT', comment);
  }

  /**
   * Simplified helper to ensure a wallet reaches a target balance (single wallet scenario).
   * - Fetches wallets for profile
   * - Picks the first wallet (current assumption)
   * - Computes delta and performs add/remove if above tolerance
   * - Returns the final wallet info
   * NOTE: This does NOT distinguish real vs bonus portions; it just normalizes total balance.
   */
  async ensureWalletBalance(
    profileId: number,
    targetBalance: number,
    opts: { tolerance?: number; currency?: string; commentPrefix?: string } = {}
  ): Promise<WalletInfo | undefined> {
    const { tolerance = 0.01, currency = 'CAD', commentPrefix = 'Normalize wallet' } = opts;
    try {
      const wallets = await this.getWallets(profileId);
      if (!wallets.length) {
        console.warn('[BonusApi][ensureWalletBalance] No wallets found for profile', profileId);
        return undefined;
      }
      const wallet = wallets[0];
      const delta = +(targetBalance - wallet.balance).toFixed(2);
      if (Math.abs(delta) <= tolerance) {
        console.log('[BonusApi][ensureWalletBalance] Within tolerance', { balance: wallet.balance, targetBalance, tolerance });
        return wallet;
      }
      if (delta > 0) {
        console.log('[BonusApi][ensureWalletBalance] Adding funds', { delta });
        return await this.addMoney(wallet.id, delta, currency, `${commentPrefix} +${delta}`);
      } else {
        console.log('[BonusApi][ensureWalletBalance] Removing funds', { delta });
        return await this.removeMoney(wallet.id, Math.abs(delta), currency, `${commentPrefix} ${delta}`);
      }
    } catch (e) {
      const errorMsg = (e as Error).message;
      // Only log at warning level if it's not an authorization issue
      if (errorMsg.includes('Authorization') || errorMsg.includes('forbidden')) {
        console.log('[BonusApi][ensureWalletBalance] Skipping wallet normalization - insufficient permissions');
      } else {
        console.warn('[BonusApi][ensureWalletBalance] Failed to normalize wallet', { profileId, error: errorMsg });
      }
      return undefined;
    }
  }
}
