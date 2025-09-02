import { APIRequestContext } from '@playwright/test';
import { BonusApiClient, BonusApiConfig } from './bonusApi';
import { AleaApiClient, AleaApiConfig } from '../alea/aleaApi';

export interface TestEnvironmentConfig {
  environment: 'stage' | 'dev';
  username: string;
  password: string;
  backofficeUsername?: string;
  backofficePassword?: string;
}

export class BonusApiFactory {
  private static readonly ENVIRONMENT_CONFIGS = {
    stage: {
      baseUrl: 'https://stage-gw.grandzbet7.com',
      authUrl: 'https://keycloak-stage.grandzbet.com',
      backofficeUrl: 'https://stage-backoffice-gw.grandzbet.com'
    },
    dev: {
      baseUrl: 'https://dev-gw.grandzbet7.com',
      authUrl: 'https://keycloak-dev.grandzbet.com',
      backofficeUrl: 'https://dev-backoffice-gw.grandzbet.com'
    }
  };

  /**
   * Create a BonusApiClient for the specified environment
   */
  static create(request: APIRequestContext, config: TestEnvironmentConfig): BonusApiClient {
    const envConfig = this.ENVIRONMENT_CONFIGS[config.environment];
    if (!envConfig) {
      throw new Error(`Unsupported environment: ${config.environment}`);
    }

    const apiConfig: BonusApiConfig = {
      ...envConfig,
      username: config.username,
      password: config.password,
      backofficeUsername: config.backofficeUsername,
      backofficePassword: config.backofficePassword
    };

    return new BonusApiClient(request, apiConfig);
  }

  /**
   * Create a stage environment client with credentials from environment variables
   */
  static createStageClient(request: APIRequestContext, username?: string, password?: string, backofficeUsername?: string, backofficePassword?: string): BonusApiClient {
    // Use provided credentials or fall back to environment variables
    const user = username || process.env.USER;
    const pass = password || process.env.PASS;
    const backofficeUser = backofficeUsername || process.env.BACKOFFICE_USER;
    const backofficePass = backofficePassword || process.env.BACKOFFICE_PASS;

    if (!user || !pass) {
      throw new Error('Front office credentials not provided. Set USER and PASS environment variables or pass username/password parameters.');
    }

    return this.create(request, {
      environment: 'stage',
      username: user,
      password: pass,
      backofficeUsername: backofficeUser,
      backofficePassword: backofficePass
    });
  }

  /**
   * Create an Alea API client with credentials from environment variables
   * Used for game transaction operations (BET, WIN, Balance)
   */
  static createAleaClient(request: APIRequestContext, baseUrl?: string, secret?: string, playerId?: string): AleaApiClient {
    // Use provided config or fall back to environment variables
    const aleaBaseUrl = baseUrl || process.env.ALEA_API_URL;
    const aleaSecret = secret || process.env.ALEA_SECRET;
    const aleaPlayerId = playerId || process.env.ALEA_PLAYER_ID;

    if (!aleaBaseUrl || !aleaSecret) {
      throw new Error('Alea API configuration not provided. Set ALEA_API_URL and ALEA_SECRET environment variables or pass baseUrl/secret parameters.');
    }

    const aleaConfig: AleaApiConfig = {
      baseUrl: aleaBaseUrl,
      secret: aleaSecret,
      playerId: aleaPlayerId
    };

    return new AleaApiClient(request, aleaConfig);
  }

  /**
   * Create an AleaApiClient with a fresh game session
   * This method handles Bearer token authentication and session creation
   * @param request - Playwright API request context
   * @param environment - Environment to use (stage/dev)
   * @param username - Username for Keycloak authentication
   * @param password - Password for Keycloak authentication
   * @param aleaBaseUrl - Optional Alea API base URL override
   * @param aleaSecret - Optional Alea API secret override
   * @param aleaPlayerId - Optional Alea player ID override
   * @returns AleaApiClient with active session
   */
  static async createAleaClientWithSession(
    request: APIRequestContext, 
    environment: 'stage' | 'dev',
    username: string,
    password: string,
    aleaBaseUrl?: string,
    aleaSecret?: string,
    aleaPlayerId?: string
  ): Promise<AleaApiClient> {
    // Create BonusApiClient to get Bearer token
    const bonusConfig: TestEnvironmentConfig = {
      environment,
      username,
      password
    };
    
    const bonusApi = this.create(request, bonusConfig);
    
    // Get Bearer token from Keycloak
    const bearerToken = await bonusApi.getFrontOfficeToken();
    console.log('🔑 Obtained Bearer token for session creation');
    
    // Create AleaApiClient
    const aleaClient = this.createAleaClient(request, aleaBaseUrl, aleaSecret, aleaPlayerId);
    
    // Create game session with Bearer token
    const sessionId = await aleaClient.createGameSession(bearerToken);
    console.log('✅ AleaApiClient created with active session:', sessionId);
    
    return aleaClient;
  }

  /**
   * Get default test data for bonus operations
   */
  static getDefaultTestData() {
    return {
      bonusId: 1770764,
      profileId: 254171,
      bonusAmount: 10,
      profileBonusId: '1774254',
      currency: 'CAD',
      comment: 'test'
    };
  }
}
