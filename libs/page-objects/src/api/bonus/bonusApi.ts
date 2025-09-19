import { APIRequestContext } from '@playwright/test';
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

    if (!response.ok()) {
      throw new Error(`Failed to get front office token: ${response.status()}`);
    }

    const data = await response.json();
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
      
      for (const bonus of bonusesToCancel) {
        try {
          await this.cancelProfileBonus(parseInt(bonus.id), `${comment} - forceful cancellation of ${bonus.type} bonus ${bonus.bonusId}`);
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch {
          // Continue with other bonuses even if one fails
        }
      }
    } catch {
      // Don't throw the error as teardown failures shouldn't break the test suite
    }
  }

  /**
   * Setup a queue of bonuses by granting and claiming them in sequence
   * @param testData - Base test data (profileId, currency, etc.)
   * @param bonusSetup - Array of bonus configurations to setup
   * @param waitTime - Wait time between operations (default: 1000ms)
   */
  async setupBonusQueue(
    testData: { profileId: number; currency: string }, 
    bonusSetup: Array<{ bonusId: number; amount: number; comment: string }>,
    waitTime?: number
  ): Promise<void>;

  /**
   * Setup a queue of bonuses with specific initial statuses
   * @param testData - Base test data (profileId, currency, etc.)
   * @param bonusSetup - Array of bonus configurations with initial status
   * @param waitTime - Wait time between operations (default: 1000ms)
   */
  async setupBonusQueue(
    testData: { profileId: number; currency: string }, 
    bonusSetup: Array<{ bonusId: number; amount: number; comment: string; initialStatus?: 'wagering' | 'pending' | 'available' }>,
    waitTime?: number
  ): Promise<void>;

  /**
   * Setup a queue of bonuses with enhanced deposit bonus claiming support
   * @param testData - Base test data (profileId, currency, etc.)
   * @param bonusSetup - Array of bonus configurations with bonus type and requirement metadata
   * @param aleaApi - AleaApi client for session management and deposit bonus claiming
   * @param paymentIqApi - PaymentIQ API client for deposit bonus claiming
   * @param waitTime - Wait time between operations (default: 1000ms)
   */
  async setupBonusQueue(
    testData: { profileId: number; currency: string }, 
    bonusSetup: Array<{ 
      bonusId: number; 
      amount: number; 
      comment: string; 
      initialStatus?: 'wagering' | 'pending' | 'available';
      bonusRequirement?: 'deposit' | 'no_deposit';
      bonusType?: 'cash' | 'free_spins';
    }>,
    aleaApi?: AleaApiClient,
    paymentIqApi?: PaymentIqApiClient,
    waitTime?: number
  ): Promise<void>;

  async setupBonusQueue(
    testData: { profileId: number; currency: string }, 
    bonusSetup: Array<{ 
      bonusId: number; 
      amount: number; 
      comment: string; 
      initialStatus?: 'wagering' | 'pending' | 'available';
      bonusRequirement?: 'deposit' | 'no_deposit';
      bonusType?: 'cash' | 'free_spins';
    }>,
    aleaApiOrWaitTime?: AleaApiClient | number,
    paymentIqApi?: PaymentIqApiClient,
    waitTime?: number
  ): Promise<void> {
    // Handle parameter overloading - if third parameter is a number, it's the old signature
    let aleaApi: AleaApiClient | undefined;
    let actualWaitTime = 500;
    
    if (typeof aleaApiOrWaitTime === 'number') {
      // Old signature: setupBonusQueue(testData, bonusSetup, waitTime)
      actualWaitTime = aleaApiOrWaitTime;
    } else {
      // New signature: setupBonusQueue(testData, bonusSetup, aleaApi, paymentIqApi, waitTime)
      aleaApi = aleaApiOrWaitTime;
      actualWaitTime = waitTime || 500;
    }
      
      // Grant all bonuses first
      for (let i = 0; i < bonusSetup.length; i++) {
        const bonus = bonusSetup[i];
        
        await this.grantBonus({
          bonusId: bonus.bonusId,
          profileId: testData.profileId,
          bonusAmount: bonus.amount,
          comment: bonus.comment
        });
        
        await new Promise(resolve => setTimeout(resolve, actualWaitTime));
      }
      
      // Separate bonuses to be claimed vs those that should stay available
      const bonusesToClaim = bonusSetup.filter(bonus => 
        !bonus.initialStatus || bonus.initialStatus === 'wagering' || bonus.initialStatus === 'pending'
      );
      
      // If no initialStatus specified, claim all bonuses (backward compatibility)
      // If initialStatus specified, only claim non-available bonuses
      if (bonusesToClaim.length > 0) {
        
        // Fetch granted bonuses and claim them in SETUP ORDER (not API return order)
        const allBonuses = await this.fetchAllUserBonuses();
        const grantedBonuses = allBonuses.issuedBonuses?.filter((bonus: UserBonus) => 
          bonusesToClaim.some(setup => setup.bonusId === bonus.profileBonus.bonusId)
        ) || [];
        
        // CRITICAL FIX: Claim bonuses in SETUP ORDER, not in API return order
        // This ensures the first bonus in our setup becomes active, second becomes pending, etc.
        for (let i = 0; i < bonusesToClaim.length; i++) {
          const setupBonus = bonusesToClaim[i];
          
          // Find the EXACT matching bonus from granted bonuses (both bonusId AND amount must match)
          const matchingBonus = grantedBonuses.find((b: UserBonus) => {
            const bonusIdMatches = b.profileBonus.bonusId === setupBonus.bonusId;
            const fixedMatches = b.profileBonus.fixedBonusAmount === setupBonus.amount;
            const initialMatches = b.profileBonus.initialBonusAmount === setupBonus.amount;
            const amountMatches = fixedMatches || initialMatches;
            
            return bonusIdMatches && amountMatches;
          });
          
          if (matchingBonus) {
            
            // Check if this is a deposit bonus and we have the required APIs for PaymentIQ claiming
            const isDepositBonus = setupBonus.bonusRequirement === 'deposit';
            const canUsePaymentIQ = isDepositBonus && !!aleaApi && !!paymentIqApi;
            
            try {
              if (canUsePaymentIQ) {
                // Use PaymentIQ API for deposit bonus claiming (type-safe)
                if (paymentIqApi && aleaApi) {
                  await paymentIqApi.claimDepositBonus(aleaApi, {
                    userId: testData.profileId.toString(),
                    profileBonusId: matchingBonus.profileBonus.id.toString(),
                    txAmount: setupBonus.amount.toString() + '.00',
                    txAmountCy: testData.currency || 'EUR'
                  });
                }
              } else {
                // Use standard claiming method
                await this.performStandardClaimingOperation(matchingBonus, setupBonus, testData);
              }
            } catch (claimingError) {
              if (canUsePaymentIQ) {
                // Fall back to standard claiming if PaymentIQ fails
                await this.performStandardClaimingOperation(matchingBonus, setupBonus, testData);
              } else {
                throw claimingError;
              }
            }
            
            // Remove claimed bonus from the list to avoid duplicate claiming
            const index = grantedBonuses.indexOf(matchingBonus);
            grantedBonuses.splice(index, 1);
            
            await new Promise(resolve => setTimeout(resolve, actualWaitTime));
          }
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    setupBonus: { bonusId: number; amount: number; comment: string }, 
    testData: { currency: string }
  ): Promise<void> {
    // Add timeout to claiming process
    const claimPromise = this.claimProfileBonus(matchingBonus.profileBonus.id, testData.currency);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Claiming timeout after 2.5 seconds for bonus ${setupBonus.bonusId}`)), 2500)
    );
    
    await Promise.race([claimPromise, timeoutPromise]);
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

    if (!response.ok()) {
      throw new Error(`Failed to transfer money: ${response.status()}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors in transfer money: ${JSON.stringify(result.errors)}`);
    }
    
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
    return this.transferMoney(walletId, amount, currency, false, 'OTHER', comment);
  }

  /**
   * Add money to user's wallet - convenience method
   */
  async addMoney(walletId: number, amount: number, currency = 'CAD', comment = 'Testing - Add money'): Promise<WalletInfo> {
    return this.transferMoney(walletId, amount, currency, true, 'PLAYER_DEPOSIT', comment);
  }
}
