import crypto from 'crypto';

/**
 * Alea API cryptographic utilities
 * Extracted from aleaAPI tests for shared use across applications
 */

export interface TransactionPayload {
  id?: string;
  type: 'BET' | 'WIN' | 'BET_WIN' | 'ROLLBACK';
  amount?: number;
  bet?: { amount: number };
  win?: { amount: number };
  round?: RoundData;
  secret?: string;
  integratorTransactionId?: string;
  requestedAt?: string;
  originalRequestType?: string;
  originalAmount?: number;
  onlyRound?: boolean;
  [key: string]: unknown;
}

export interface RoundData {
  status: 'IN_PROGRESS' | 'COMPLETED';
  id?: string;
  integratorRoundId?: string;
}

export interface BalanceParams {
  playerId: string;
  currency?: string;
  casinoSessionId?: string;
  gameId?: string | number;
  softwareId?: string;
  integratorId?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Compute SHA-512 hash for transaction payload
 * Used for transaction API authentication
 * @param body - Transaction payload object
 * @param secret - API secret key (optional, will use body.secret if not provided)
 * @returns SHA-512 hash string
 */
export function computeHash(body: TransactionPayload, secret?: string): string {
  // Use provided secret or fall back to secret in body
  const finalSecret = secret || body.secret;
  if (!finalSecret) {
    throw new Error('Secret is required either as parameter or in body.secret');
  }
  
  // Remove secret from body before hashing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { secret: _secret, ...bodyWithoutSecret } = body;
  
  return crypto.createHash('sha512')
    .update(`${JSON.stringify(bodyWithoutSecret)}${finalSecret}`, 'utf-8')
    .digest('hex');
}

/**
 * Compute GET signature for balance API requests
 * Used for balance API authentication
 * Formula: SHA512(casinoSessionId + currency + gameId + integratorId + softwareId + secretApiKey)
 * @param params - Query parameters object
 * @param secret - API secret key
 * @returns SHA-512 signature string
 */
export function computeGetSignature(
  params: Record<string, string | number | boolean | undefined>, 
  secret: string
): string {
  // Order matches Alea API specification for balance requests
  const orderedKeys = ['casinoSessionId', 'currency', 'gameId', 'integratorId', 'softwareId'];
  const rawStr = orderedKeys.map(key => params[key] ?? '').join('') + secret;
  
  return crypto.createHash('sha512')
    .update(rawStr, 'utf-8')
    .digest('hex');
}

/**
 * Compute session authentication signature
 * Used for session validation endpoint
 * Formula: SHA512(casinoSessionId + secretApiKey)
 * @param casinoSessionId - The session ID to authenticate
 * @param secret - API secret key
 * @returns SHA-512 signature string
 */
export function computeSessionSignature(casinoSessionId: string, secret: string): string {
  const data = casinoSessionId + secret;
  return crypto.createHash('sha512')
    .update(data, 'utf-8')
    .digest('hex');
}
