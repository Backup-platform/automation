import { APIRequestContext } from '@playwright/test';
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
    
    // Apply environment variable fallbacks
    this.config = {
      baseUrl: config.baseUrl || process.env.ALEA_API_URL || '',
      secret: config.secret || process.env.ALEA_SECRET || '',
      playerId: config.playerId || process.env.ALEA_PLAYER_ID || '254171',
      brandId: config.brandId || process.env.ALEA_BRAND_ID || '3', // Default to Grandzbet
      brandName: config.brandName || (process.env.ALEA_BRAND_NAME as 'grandzbet' | 'spacefortuna') || 'grandzbet',
      secretGrandzbet: config.secretGrandzbet || process.env.ALEA_SECRET_GRANDZBET || 'aTm9o3W8K2HVzXuGOTx6fNPVe8B7No13',
      secretSpaceFortuna: config.secretSpaceFortuna || process.env.ALEA_SECRET_SPACEFORTUNA || 'bK4pJGnoTmlktPup41ozgvc8JXUzPWht'
    };

    // Validate required configuration
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
    console.log('🎮 Creating game session via GraphQL with Bearer token...');

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
    
    try {
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
      
      if (!response.ok()) {
        const errorText = await response.text();
        console.error('❌ GraphQL response error:', errorText);
        throw new Error(`GraphQL request failed: ${response.status()}`);
      }
      
      const result = await response.json();
      
      // Log the full API response for debugging
      console.log('📋 Full GraphQL API response that gets our sessionID:', JSON.stringify(result, null, 2));
      
      if (result.errors) {
        console.error('❌ GraphQL errors:', result.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      
      // Extract session ID from the gameUrl
      const gameUrl = result.data?.startGameSession?.gameUrl;
      if (!gameUrl) {
        throw new Error('No gameUrl returned from GraphQL endpoint');
      }
      
      // Parse session ID from URL (typically in a parameter like casinoSessionId)
      const urlObj = new URL(gameUrl);
      const sessionId = urlObj.searchParams.get('casinoSessionId');
      
      if (!sessionId) {
        console.log('🔍 Game URL received:', gameUrl);
        throw new Error('No casinoSessionId found in gameUrl');
      }
      
      console.log('✅ Game session created with session ID:', sessionId);
      this.casinoSessionId = sessionId;
      
      return sessionId;
      
    } catch (error) {
      console.error('❌ Failed to create game session:', error);
      throw error;
    }
  }

  /**
   * Create game session and authenticate it with Alea API
   * Combines session creation with authentication as per Postman collection flow
   * @param bearerToken - Bearer token from Keycloak authentication
   * @returns Session ID from the game session
   */
  async createAndAuthenticateSession(bearerToken: string): Promise<string> {
    console.log('🎮 Creating and authenticating game session...');
    
    // Step 1: Create the game session
    const sessionId = await this.createGameSession(bearerToken);
    
    // Step 2: Authenticate the session
    console.log('🔐 Authenticating the created session...');
    const authResult = await this.authenticateSession(sessionId);
    
    if (!authResult.success && authResult.status !== 403 && authResult.status !== 404) {
      console.warn(`⚠️ Session authentication failed with status ${authResult.status}: ${authResult.error}`);
      // Don't throw error since authentication endpoint might not be implemented
    }
    
    // Step 3: Test session validity with balance check
    console.log('🔍 Testing session validity with balance check...');
    try {
      const balanceCheck = await this.getBalance();
      console.log('✅ Session validation successful - Balance check passed');
      console.log(`💰 Balance: ${balanceCheck.realBalance} real, ${balanceCheck.bonusBalance} bonus`);
    } catch (error) {
      console.error('❌ Session validation failed - Balance check failed:', error);
      throw new Error(`Session validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return sessionId;
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
      game: { id: 16375 }, // Updated to match Postman collection
      software: { id: 6 }, // Match Postman collection transaction structure
      integrator: { id: 8 }, // Match Postman collection transaction structure
      player: { 
        id: "444", // Match Postman collection transaction structure
        casinoPlayerId: this.config.playerId // From .env: 254171
      }
    };
  }

  /**
   * Set the casino session ID (can be used if session is obtained externally)
   * @param sessionId - The casino session ID to use
   */
  setCasinoSessionId(sessionId: string): void {
    console.log('🔑 Setting casino session ID:', sessionId);
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
    const sessionId = casinoSessionId || this.casinoSessionId;
    
    if (!sessionId) {
      throw new Error('No casino session ID available for authentication');
    }

    console.log('🔐 Authenticating session:', sessionId);

    // Compute signature: SHA512(casinoSessionId + secretApiKey)
    const signature = computeSessionSignature(sessionId, this.getSecretForBrand());
    console.log('🔑 Authentication signature:', signature);

    try {
      const response = await this.request.get(`${this.config.baseUrl}/brandId/${this.config.brandId}/sessions/${sessionId}`, {
        headers: this.buildHeaders(signature)
      });

      console.log('🔐 Authentication response status:', response.status());

      if (response.ok()) {
        const sessionDetails = await response.json();
        console.log('✅ Session authentication successful:', sessionDetails);
        return { success: true, status: response.status() };
      } else if (response.status() === 403 || response.status() === 404) {
        // Expected when authentication endpoint is not implemented by operator
        console.log('⚠️ Authentication endpoint not implemented by operator (expected)');
        return { success: false, status: response.status(), error: 'Authentication endpoint not implemented' };
      } else {
        const errorText = await response.text();
        console.error('❌ Session authentication failed:', errorText);
        return { success: false, status: response.status(), error: errorText };
      }
    } catch (error) {
      console.error('❌ Session authentication error:', error);
      return { 
        success: false, 
        status: 0, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Get player balance
   * Corresponds to getBalance() method in TransactionService
   * @param playerId - Player ID (optional, uses default if not provided)
   * @returns Player balance information
   */
  async getBalance(playerId?: string): Promise<AleaBalanceResponse> {
    const finalPlayerId = playerId || this.config.playerId || '254171';
    
    // Query parameters - Match Postman collection structure
    const params = {
      currency: 'CAD',
      casinoSessionId: this.casinoSessionId || '26117e8f-8610-4b95-b90e-09861a87e303',
      gameId: 16375, // Updated to match Postman collection
      softwareId: '42', // Match Postman collection balance parameters
      integratorId: '42' // Match Postman collection balance parameters
    };

    const signature = computeGetSignature(params, this.getSecretForBrand());
    
    // Updated URL path to include parameterized brandId
    const response = await this.request.get(`${this.config.baseUrl}/brandId/${this.config.brandId}/players/${finalPlayerId}/balance`, {
      params: params as Record<string, string | number | boolean>,
      headers: this.buildHeaders(signature)
    });

    if (!response.ok()) {
      const errorText = await response.text();
      console.error(`❌ Balance request failed: ${response.status()}`, errorText);
      throw new Error(`Failed to get balance: ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Place a bet transaction
   * Used for zero out scenarios - reduces player balance
   * @param betData - Bet transaction data
   * @returns Transaction response
   */
  async placeBet(betData: BetData): Promise<AleaTransactionResponse> {
    // Generate IDs like original aleaAPI: ${timestamp}-${random}
    const timestamp = Date.now();
    const transactionId = betData.transactionId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const roundId = betData.roundId || `${timestamp}-${Math.floor(Math.random() * 1000)}`;
    
    // Construct payload in exact order of Postman collection
    const payload: TransactionPayload = {
      id: transactionId,                                           // 1st
      integratorTransactionId: betData.integratorTransactionId || transactionId, // 2nd
      type: 'BET',                                                // 3rd
      requestedAt: new Date().toISOString(),                      // 4th
      game: { id: 16375 },                                        // 5th - Updated to match Postman collection
      software: { id: 6 },                                        // 6th - Match Postman collection
      integrator: { id: 8 },                                      // 7th - Match Postman collection
      player: {                                                   // 8th
        id: "444", // Match Postman collection transaction structure
        casinoPlayerId: this.config.playerId // From .env: 254171
      },
      currency: 'CAD',                                            // 9th
      casinoSessionId: this.casinoSessionId || '26117e8f-8610-4b95-b90e-09861a87e303', // 10th
      round: {                                                    // 11th
        id: roundId,
        integratorRoundId: betData.integratorRoundId || roundId,
        status: betData.roundStatus || 'IN_PROGRESS'
      },
      amount: betData.amount                                      // 12th - Last like working example
    };

    console.log('💰 BET Payload structure:', JSON.stringify(payload, null, 2));

    // Calculate hash: SHA512(JSON String of HTTP Body + secretApiKey)
    const hash = computeHash(payload, this.getSecretForBrand());

    console.log('💰 BET Request payload:', JSON.stringify(payload, null, 2));
    console.log('💰 BET Hash:', hash);

    const response = await this.request.post(`${this.config.baseUrl}/brandId/${this.config.brandId}/transactions`, {
      data: payload,
      headers: this.buildHeaders(hash)
    });

    console.log('💰 BET Response status:', response.status());
    if (!response.ok()) {
      const errorText = await response.text();
      console.log('💰 BET Error response:', errorText);
      throw new Error(`Failed to place bet: ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Process a win transaction
   * Used for wagering success scenarios - increases player balance
   * @param winData - Win transaction data
   * @returns Transaction response
   */
  async processWin(winData: WinData): Promise<AleaTransactionResponse> {
    // Generate IDs like original aleaAPI: ${timestamp}-${random}
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

    // Calculate hash: SHA512(JSON String of HTTP Body + secretApiKey)
    const hash = computeHash(payload, this.getSecretForBrand());

    const response = await this.request.post(`${this.config.baseUrl}/brandId/${this.config.brandId}/transactions`, {
      data: payload,
      headers: this.buildHeaders(hash)
    });

    if (!response.ok()) {
      throw new Error(`Failed to process win: ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Execute a combined bet and win transaction
   * Used when you want to bet and win in a single transaction
   * @param betData - Bet amount data
   * @param winData - Win amount data
   * @returns Transaction response
   */
  async placeBetAndWin(betData: BetData, winData: WinData): Promise<AleaTransactionResponse> {
    // Generate IDs like original aleaAPI: ${timestamp}-${random}
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

    // Calculate hash: SHA512(JSON String of HTTP Body + secretApiKey)
    const hash = computeHash(payload, this.getSecretForBrand());

    const response = await this.request.post(`${this.config.baseUrl}/brandId/${this.config.brandId}/transactions`, {
      data: payload,
      headers: this.buildHeaders(hash)
    });

    if (!response.ok()) {
      throw new Error(`Failed to place bet and win: ${response.status()}`);
    }

    return await response.json();
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
    
    // Extract balance information if available
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
      console.log(`After ${action} ${cycleNumber}: ${realBalance} real, ${bonusBalance} bonus`);
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
    roundStatus: 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS'
  ): Promise<unknown> {
    // Place bet
    const betResponse = await this.placeBet({ amount: betAmount, roundStatus });
    const { roundId, integratorRoundId } = this.extractRoundAndBalanceInfo(betResponse);
    
    if (cycleNumber) {
      this.logBalanceFromResponse(betResponse, 'bet', cycleNumber);
    }
    
    // Process win if win amount is provided
    if (winAmount !== undefined && roundStatus === 'IN_PROGRESS') {
      const winResponse = await this.processWin({ amount: winAmount, roundId, integratorRoundId });
      
      if (cycleNumber) {
        this.logBalanceFromResponse(winResponse, 'win', cycleNumber);
      }
      
      return winResponse;
    }
    
    return betResponse;
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