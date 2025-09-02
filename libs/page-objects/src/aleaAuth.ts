import { createHash } from 'crypto';

export interface AleaSessionDetails {
  country: string;
  currency: string;
  casinoPlayerId: string;
  isTest: boolean;
}

export interface AleaAuthConfig {
  secret: string;
  playerId?: string;
}

/**
 * Alea Authentication Service
 * Implements the missing GET /sessions/{casinoSessionId} endpoint
 * that Alea API expects operators to provide
 */
export class AleaAuthService {
  private config: AleaAuthConfig;

  constructor(config: AleaAuthConfig) {
    this.config = {
      secret: config.secret || process.env.ALEA_SECRET || '',
      playerId: config.playerId || process.env.ALEA_PLAYER_ID || '254171'
    };

    if (!this.config.secret) {
      throw new Error('Alea API secret not provided. Set ALEA_SECRET environment variable or pass secret in config.');
    }
  }

  /**
   * Validate session and return session details
   * This implements the missing authentication endpoint that Alea expects:
   * GET /sessions/{casinoSessionId}
   * 
   * @param casinoSessionId - The session ID to validate
   * @returns Session details including casinoPlayerId
   */
  async validateSession(casinoSessionId: string): Promise<AleaSessionDetails> {
    console.log('🔑 Validating session:', casinoSessionId);

    // Compute signature: SHA512(casinoSessionId + secretApiKey)
    const signature = this.computeSessionSignature(casinoSessionId);
    console.log('🔐 Session signature:', signature);

    // Mock the authentication endpoint response
    // In a real implementation, this would validate against your session store
    const sessionDetails: AleaSessionDetails = {
      country: 'CA', // Canada
      currency: 'CAD',
      casinoPlayerId: this.config.playerId || '254171', // From our .env
      isTest: true // We're in test mode
    };

    console.log('✅ Session validation successful:', sessionDetails);
    return sessionDetails;
  }

  /**
   * Compute signature for session validation
   * Formula: SHA512(casinoSessionId + secretApiKey)
   * 
   * @param casinoSessionId - The session ID
   * @returns SHA-512 signature
   */
  computeSessionSignature(casinoSessionId: string): string {
    const data = casinoSessionId + this.config.secret;
    return createHash('sha512').update(data).digest('hex');
  }

  /**
   * Test the authentication flow
   * @param casinoSessionId - Session ID to test
   * @returns Test results
   */
  async testAuthFlow(casinoSessionId: string): Promise<{
    sessionValid: boolean;
    sessionDetails?: AleaSessionDetails;
    signature: string;
    error?: string;
  }> {
    try {
      const signature = this.computeSessionSignature(casinoSessionId);
      const sessionDetails = await this.validateSession(casinoSessionId);
      
      return {
        sessionValid: true,
        sessionDetails,
        signature
      };
    } catch (error) {
      return {
        sessionValid: false,
        signature: this.computeSessionSignature(casinoSessionId),
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
