import { APIRequestContext, test, expect } from '@playwright/test';
import { computeHash, computeGetSignature, computeSessionSignature, TransactionPayload } from './aleaCrypto';

export interface AleaApiConfig {
  baseUrl: string;
  secret: string;
  playerId?: string;
  brandId?: string;
  secretGrandzbet?: string;
  secretSpaceFortuna?: string;
  brandName?: 'grandzbet' | 'spacefortuna';
}

export interface AleaBalanceResponse {
  playerId: string;
  currency: string;
  realBalance: number;
  bonusBalance: number;
  totalBalance: number;
  [key: string]: unknown;
}

export interface AleaTransactionResponse {
  status: string;
  id: string;
  realAmount: number;
  bet?: Record<string, unknown>;
  win?: Record<string, unknown>;
  isAlreadyProcessed: boolean;
  [key: string]: unknown;
}

export interface BetData {
  amount: number;
  roundId?: string;
  integratorRoundId?: string;
  transactionId?: string;
  integratorTransactionId?: string;
  roundStatus?: 'IN_PROGRESS' | 'COMPLETED';
}

export interface WinData {
  amount: number;
  roundId?: string;
  integratorRoundId?: string;
  transactionId?: string;
  integratorTransactionId?: string;
}

export class AleaApiClient {
  private request: APIRequestContext;
  private config: AleaApiConfig;
  private casinoSessionId?: string;

  constructor(request: APIRequestContext, config: AleaApiConfig) {
    this.request = request;
    
    this.config = {
      baseUrl: config.baseUrl || process.env.ALEA_API_URL || '',
      secret: config.secret || process.env.ALEA_SECRET || '',
      playerId: config.playerId || process.env.ALEA_PLAYER_ID || '254171',
      brandId: config.brandId || process.env.ALEA_BRAND_ID || '3',
      brandName: config.brandName || (process.env.ALEA_BRAND_NAME as 'grandzbet' | 'spacefortuna') || 'grandzbet',
      secretGrandzbet: config.secretGrandzbet || process.env.ALEA_SECRET_GRANDZBET || 'aTm9o3W8K2HVzXuGOTx6fNPVe8B7No13',
      secretSpaceFortuna: config.secretSpaceFortuna || process.env.ALEA_SECRET_SPACEFORTUNA || 'bK4pJGnoTmlktPup41ozgvc8JXUzPWht'
    };

    if (!this.config.baseUrl) {
      throw new Error('Alea API base URL not provided. Set ALEA_API_URL environment variable or pass baseUrl in config.');
    }
    
    if (!this.config.secret) {
      throw new Error('Alea API secret not provided. Set ALEA_SECRET environment variable or pass secret in config.');
    }
  }

  /**
   * Create a game session using GraphQL with Bearer token authentication
   * This gets a valid session ID that can be used for Alea API transactions
   * @param bearerToken - Bearer token from Keycloak authentication
   * @returns Session ID from the game session
   */
  async createGameSession(bearerToken: string): Promise<string> {
    return await test.step('Create Alea game session via GraphQL', async () => {
      const graphqlEndpoint = 'https://stage-gw.grandzbet7.com/graphql';

      const mutation = `
        mutation startGameSession($gameSessionData: GameSessionDataInput) {
          startGameSession(gameSessionData: $gameSessionData) {
            gameUrl
            strategy
          }
        }
      `;
      
      const variables = {
        gameSessionData: {
          gameIdentifier: "16375",
          gameProvider: "alea", 
          locale: "en",
          clientType: "desktop",
          returnPath: "/games",
          gameProducer: "Felix Gaming",
          gameTitle: "Book of Dragon Hold And Win",
          gameProducerId: "4",
          currency: "CAD",
          technicalCategory: null,
          technicalCategoryMobile: null,
          tableId: null,
          depositPath: "en/?openCashier=true"
        }
      };
      
      const response = await this.request.post(graphqlEndpoint, {
        data: {
          query: mutation,
          variables: variables
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
          'referer': 'https://stage.grandzbet7.com/'
        }
      });
      
      const responseBody = await response.text();
      
      // Log the raw response for debugging
      console.log(`=== GraphQL Response Debug Info ===`);
      console.log(`Status: ${response.status()}`);
      console.log(`Status Text: ${response.statusText()}`);
      console.log(`Headers: ${JSON.stringify(response.headers())}`);
      console.log(`Raw Response Body: ${responseBody}`);
      console.log(`Request URL: ${graphqlEndpoint}`);
      console.log(`Bearer Token Present: ${bearerToken ? 'Yes' : 'No'}`);
      console.log(`=== End Response Debug Info ===`);
      
      // Enhanced error handling with detailed diagnostics
      if (!response.ok()) {
        console.error(`GraphQL request failed with status ${response.status()}`);
        console.error(`Response body: ${responseBody}`);
        console.error(`Request URL: ${graphqlEndpoint}`);
        console.error(`Bearer token: ${bearerToken ? 'Present' : 'Missing'}`);
        throw new Error(`GraphQL request failed with status ${response.status()}: ${responseBody}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseBody);
        console.log(`=== Parsed GraphQL Result ===`);
        console.log(`Result: ${JSON.stringify(result, null, 2)}`);
        console.log(`=== End Parsed Result ===`);
      } catch (parseError) {
        console.error(`Failed to parse GraphQL response as JSON: ${responseBody}`);
        throw new Error(`Invalid JSON response from GraphQL endpoint: ${parseError}`);
      }
      
      if (result.errors) {
        console.error(`=== GraphQL Error Details ===`);
        console.error(`- Query: ${mutation}`);
        console.error(`- Variables: ${JSON.stringify(variables, null, 2)}`);
        console.error(`- Bearer token: ${bearerToken ? 'Present' : 'Missing'}`);
        console.error(`- Full Response: ${JSON.stringify(result, null, 2)}`);
        console.error(`- Individual Errors:`);
        result.errors.forEach((error: unknown, index: number) => {
          console.error(`  Error ${index + 1}:`, JSON.stringify(error, null, 4));
        });
        console.error(`=== End GraphQL Error Details ===`);
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      
      const gameUrl = result.data?.startGameSession?.gameUrl;
      if (!gameUrl) {
        throw new Error('No gameUrl returned from GraphQL endpoint');
      }
      
      const urlObj = new URL(gameUrl);
      const sessionId = urlObj.searchParams.get('casinoSessionId');
      
      if (!sessionId) {
        throw new Error(`No casinoSessionId found in gameUrl: ${gameUrl}`);
      }
      
      this.casinoSessionId = sessionId;
      
      return sessionId;
    });
  }

  /**
   * Create game session and authenticate it with Alea API
   * Combines session creation with authentication as per Postman collection flow
   * @param bearerToken - Bearer token from Keycloak authentication
   * @returns Session ID from the game session
   */
  async createAndAuthenticateSession(bearerToken: string): Promise<string> {
    return await test.step('Create and authenticate Alea game session', async () => {
      const sessionId = await this.createGameSession(bearerToken);
      
      await test.step('Authenticate session', async () => {
        const authResult = await this.authenticateSession(sessionId);
        
        if (!authResult.success && authResult.status !== 403 && authResult.status !== 404) {
          // Authentication failed for reasons other than endpoint not implemented
        }
      });
      
      await test.step('Validate session with balance check', async () => {
        await this.getBalance();
      });
      
      return sessionId;
    });
  }

  /**
   * Build headers with SHA-512 digest for API authentication
   * @param digest - SHA-512 digest string
   * @returns Headers object
   */
  private buildHeaders(digest: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Digest': `SHA-512=${digest}`
    };
  }

  /**
   * Get the appropriate secret based on brand configuration
   * @returns The secret key for the current brand
   */
  private getSecretForBrand(): string {
    if (this.config.brandName === 'spacefortuna') {
      return this.config.secretSpaceFortuna || this.config.secret;
    } else {
      return this.config.secretGrandzbet || this.config.secret;
    }
  }

  /**
   * Get default transaction payload base
   * @returns Base transaction payload
   */
  private getDefaultTransactionBase(): Partial<TransactionPayload> {
    return {
      currency: 'CAD',
      casinoSessionId: this.casinoSessionId || '26117e8f-8610-4b95-b90e-09861a87e303',
      requestedAt: new Date().toISOString(),
      game: { id: 16375 },
      software: { id: 6 },
      integrator: { id: 8 },
      player: { 
        id: "444",
        casinoPlayerId: this.config.playerId
      }
    };
  }

  /**
   * Set the casino session ID (can be used if session is obtained externally)
   * @param sessionId - The casino session ID to use
   */
  setCasinoSessionId(sessionId: string): void {
    this.casinoSessionId = sessionId;
  }

  /**
   * Get the current casino session ID
   * @returns Current session ID or undefined if not set
   */
  getCasinoSessionId(): string | undefined {
    return this.casinoSessionId;
  }

  /**
   * Authenticate session with Alea API
   * This calls the missing authentication endpoint that Alea expects
   * @param casinoSessionId - Session ID to authenticate (optional, uses current session if not provided)
   * @returns Authentication result
   */
  async authenticateSession(casinoSessionId?: string): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    return await test.step('Authenticate Alea session', async () => {
      const sessionId = casinoSessionId || this.casinoSessionId;
      
      if (!sessionId) {
        throw new Error('No casino session ID available for authentication');
      }

      const signature = computeSessionSignature(sessionId, this.getSecretForBrand());

      try {
        const response = await this.request.get(`${this.config.baseUrl}/brandId/${this.config.brandId}/sessions/${sessionId}`, {
          headers: this.buildHeaders(signature)
        });

        if (response.ok()) {
          const responseBody = await response.text();
          JSON.parse(responseBody); // Validate JSON but don't need to return it
          return { success: true, status: response.status() };
        } else if (response.status() === 403 || response.status() === 404) {
          return { success: false, status: response.status(), error: 'Authentication endpoint not implemented' };
        } else {
          const errorText = await response.text();
          return { success: false, status: response.status(), error: errorText };
        }
      } catch (error) {
        return { 
          success: false, 
          status: 0, 
          error: error instanceof Error ? error.message : String(error) 
        };
      }
    });
  }

  /**
   * Get player balance
   * Corresponds to getBalance() method in TransactionService
   * @param playerId - Player ID (optional, uses default if not provided)
   * @returns Player balance information
   */
  async getBalance(playerId?: string): Promise<AleaBalanceResponse> {
    return await test.step('Get player balance via Alea API', async () => {
      const finalPlayerId = playerId || this.config.playerId || '254171';
      
      const params = {
        currency: 'CAD',
        casinoSessionId: this.casinoSessionId || '26117e8f-8610-4b95-b90e-09861a87e303',
        gameId: 16375,
        softwareId: '42',
        integratorId: '42'
      };

      const signature = computeGetSignature(params, this.getSecretForBrand());
      
      const response = await this.request.get(`${this.config.baseUrl}/brandId/${this.config.brandId}/players/${finalPlayerId}/balance`, {
        params: params as Record<string, string | number | boolean>,
        headers: this.buildHeaders(signature)
      });

      const responseBody = await response.text();
      await expect(response.ok()).toBe(true);

      return JSON.parse(responseBody);
    });
  }

  /**
   * Place a bet transaction
   * Used for zero out scenarios - reduces player balance
   * @param betData - Bet transaction data
   * @returns Transaction response
   */
  async placeBet(betData: BetData): Promise<AleaTransactionResponse> {
    return await test.step(`Place bet of ${betData.amount} CAD via Alea API`, async () => {
      const timestamp = Date.now();
      const transactionId = betData.transactionId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
      const roundId = betData.roundId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
      
      const payload: TransactionPayload = {
        id: transactionId,
        integratorTransactionId: betData.integratorTransactionId || transactionId,
        type: 'BET',
        requestedAt: new Date().toISOString(),
        game: { id: 16375 },
        software: { id: 6 },
        integrator: { id: 8 },
        player: {
          id: "444",
          casinoPlayerId: this.config.playerId
        },
        currency: 'CAD',
        casinoSessionId: this.casinoSessionId || '26117e8f-8610-4b95-b90e-09861a87e303',
        round: {
          id: roundId,
          integratorRoundId: betData.integratorRoundId || roundId,
          status: betData.roundStatus || 'IN_PROGRESS'
        },
        amount: betData.amount
      };

      const hash = computeHash(payload, this.getSecretForBrand());

      const response = await this.request.post(`${this.config.baseUrl}/brandId/${this.config.brandId}/transactions`, {
        data: payload,
        headers: this.buildHeaders(hash)
      });

      const responseBody = await response.text();
      await expect(response.ok()).toBe(true);

      return JSON.parse(responseBody);
    });
  }

  /**
   * Process a win transaction
   * Used for wagering success scenarios - increases player balance
   * @param winData - Win transaction data
   * @returns Transaction response
   */
  async processWin(winData: WinData): Promise<AleaTransactionResponse> {
    return await test.step(`Process win of ${winData.amount} CAD via Alea API`, async () => {
      const timestamp = Date.now();
      const transactionId = winData.transactionId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
      const roundId = winData.roundId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
      
      const payload: TransactionPayload = {
        ...this.getDefaultTransactionBase(),
        id: transactionId,
        integratorTransactionId: winData.integratorTransactionId || transactionId,
        type: 'WIN',
        amount: winData.amount,
        win: { amount: winData.amount },
        round: {
          id: roundId,
          integratorRoundId: winData.integratorRoundId || roundId,
          status: 'COMPLETED'
        }
      };

      const hash = computeHash(payload, this.getSecretForBrand());

      const response = await this.request.post(`${this.config.baseUrl}/brandId/${this.config.brandId}/transactions`, {
        data: payload,
        headers: this.buildHeaders(hash)
      });

      const responseBody = await response.text();
      await expect(response.ok()).toBe(true);

      return JSON.parse(responseBody);
    });
  }

  /**
   * Execute a combined bet and win transaction
   * Used when you want to bet and win in a single transaction
   * @param betData - Bet amount data
   * @param winData - Win amount data
   * @returns Transaction response
   */
  async placeBetAndWin(betData: BetData, winData: WinData): Promise<AleaTransactionResponse> {
    return await test.step(`Place bet of ${betData.amount} CAD and win ${winData.amount} CAD via Alea API`, async () => {
      const timestamp = Date.now();
      const transactionId = betData.transactionId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
      const roundId = betData.roundId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
      
      const payload: TransactionPayload = {
        ...this.getDefaultTransactionBase(),
        id: transactionId,
        integratorTransactionId: betData.integratorTransactionId || transactionId,
        type: 'BET_WIN',
        amount: betData.amount,
        bet: { amount: betData.amount },
        win: { amount: winData.amount },
        round: {
          id: roundId,
          integratorRoundId: betData.integratorRoundId || roundId,
          status: 'COMPLETED'
        }
      };

      const hash = computeHash(payload, this.getSecretForBrand());

      const response = await this.request.post(`${this.config.baseUrl}/brandId/${this.config.brandId}/transactions`, {
        data: payload,
        headers: this.buildHeaders(hash)
      });

      const responseBody = await response.text();
      await expect(response.ok()).toBe(true);

      return JSON.parse(responseBody);
    });
  }

  /**
   * Helper function to extract round IDs and balance from Alea API response
   * @param response - The response from placeBet() or processWin()
   * @returns Object containing roundId, integratorRoundId, and balance info
   */
  extractRoundAndBalanceInfo(response: unknown): { 
    roundId: string; 
    integratorRoundId: string; 
    realBalance?: number; 
    bonusBalance?: number; 
  } {
    const responseData = response as Record<string, unknown>;
    const roundData = responseData.round as Record<string, unknown> | undefined;
    const roundId = (roundData?.id as string) || (responseData.roundId as string);
    const integratorRoundId = (roundData?.integratorRoundId as string) || (responseData.integratorRoundId as string);
    
    const balanceData = responseData.balance as Record<string, unknown> | undefined;
    const realBalance = balanceData?.realBalance as number | undefined;
    const bonusBalance = balanceData?.bonusBalance as number | undefined;
    
    return { roundId, integratorRoundId, realBalance, bonusBalance };
  }

  /**
   * Log balance information from API response
   * @param response - The API response containing balance data
   * @param action - The action performed (e.g., 'bet', 'win')
   * @param cycleNumber - The cycle number for logging context
   */
  logBalanceFromResponse(response: unknown, action: string, cycleNumber: number): void {
    const { realBalance, bonusBalance } = this.extractRoundAndBalanceInfo(response);
    if (realBalance !== undefined && bonusBalance !== undefined) {
      test.step(`Balance after ${action} ${cycleNumber}: ${realBalance} real, ${bonusBalance} bonus`, () => {
        // Log balance for test reporting
      });
    }
  }

  /**
   * Execute a complete betting cycle (bet + win)
   * @param betAmount - Amount to bet
   * @param winAmount - Amount to win (optional, if not provided, only bet is placed)
   * @param cycleNumber - The cycle number for logging
   * @param roundStatus - Status of the round ('IN_PROGRESS' or 'COMPLETED')
   * @returns The final response (win response if win occurred, bet response otherwise)
   */
  async executeBettingCycle(
    betAmount: number,
    winAmount?: number,
    cycleNumber?: number,
    roundStatus: 'IN_PROGRESS' | 'COMPLETED' = 'COMPLETED'
  ): Promise<unknown> {
    const cycleDescription = cycleNumber ? ` (cycle ${cycleNumber})` : '';
    const winDescription = winAmount ? ` and win ${winAmount} CAD` : '';
    
    return await test.step(`Execute betting cycle: bet ${betAmount} CAD${winDescription}${cycleDescription}`, async () => {
      const betResponse = await this.placeBet({ amount: betAmount, roundStatus });
      const { roundId, integratorRoundId } = this.extractRoundAndBalanceInfo(betResponse);
      
      if (cycleNumber) {
        this.logBalanceFromResponse(betResponse, 'bet', cycleNumber);
      }
      
      if (winAmount !== undefined && roundStatus === 'IN_PROGRESS') {
        const winResponse = await this.processWin({ amount: winAmount, roundId, integratorRoundId });
        
        if (cycleNumber) {
          this.logBalanceFromResponse(winResponse, 'win', cycleNumber);
        }
        
        return winResponse;
      }
      
      return betResponse;
    });
  }

  /**
   * Get current configuration (useful for debugging)
   * @returns Current API configuration (without secrets)
   */
  getConfig(): Omit<AleaApiConfig, 'secret' | 'secretGrandzbet' | 'secretSpaceFortuna'> {
    return {
      baseUrl: this.config.baseUrl,
      playerId: this.config.playerId,
      brandId: this.config.brandId,
      brandName: this.config.brandName
    };
  }
}