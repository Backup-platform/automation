export * from './page-objects';

// =============================================================================
// Bonus System Configuration
// =============================================================================

/**
 * Bonus system types, templates, and test scenarios
 * Centralized bonus configuration for consistent testing
 */
export * from './bonuses';

// =============================================================================
// API Fixtures
// =============================================================================

/**
 * API client fixtures for Playwright tests
 * Use these to get pre-configured API clients in your tests
 */
export {
    apiTest,
    expect,
    describe,
    type ApiClients,
    type TestData
} from './api/fixtures/apiFixtures';

// =============================================================================
// Bonus API Utilities
// =============================================================================

/**
 * Bonus API functionality for integration with page objects
 */
export {
    BonusApiClient,
    type BonusApiConfig,
    type AuthTokens,
    type BonusData,
    type BonusResponse,
    type ProfileBonus,
    type UserBonus,
    type UserBonusesResponse,
    type MoneyTransferInput,
    type WalletInfo
} from './api/bonus/bonusApi';

export { 
    BonusApiFactory,
    type TestEnvironmentConfig 
} from './api/bonus/bonusApiFactory';

// =============================================================================
// PaymentIQ API Utilities
// =============================================================================

/**
 * PaymentIQ API functionality for deposit bonus claiming
 */
export {
    PaymentIqApiClient,
    type PaymentIqApiConfig,
    type AuthorizeRequestDTO,
    type TransferRequestDTO,
    type AuthorizeAttributes,
    type TransferAttributes,
    type PaymentResponse
} from './api/payment/paymentIqApi';

// =============================================================================
// Alea API Utilities
// =============================================================================

/**
 * Alea API functionality for game transactions (BET, WIN, Balance)
 * Used for bonus testing scenarios (zero out, wagering success)
 */
export {
    AleaApiClient,
    type AleaApiConfig,
    type AleaBalanceResponse,
    type AleaTransactionResponse,
    type BetData,
    type WinData
} from './api/alea/aleaApi';

/**
 * Alea API cryptographic utilities
 */
export {
    computeHash,
    computeGetSignature,
    type TransactionPayload,
    type RoundData,
    type BalanceParams
} from './aleaCrypto';

/**
 * Alea Authentication Service
 */
export {
    AleaAuthService,
    type AleaSessionDetails,
    type AleaAuthConfig
} from './aleaAuth';
