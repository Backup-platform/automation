import { APIRequestContext } from '@playwright/test';
import type { AleaApiClient } from '../alea/aleaApi';

export interface PaymentIqApiConfig {
  baseUrl: string;
  brandId: string;
  merchantId: string;
}

export interface AuthorizeAttributes {
  sessionId: string;
}

export interface TransferAttributes {
  bonusId: string;
  externalBonusId: string;
}

export interface AuthorizeRequestDTO {
  userId: string;
  txAmount: string;
  txAmountCy: string;
  txId: string;
  txTypeId: string;
  txName: string;
  provider: string;
  maskedAccount: string;
  attributes: AuthorizeAttributes;
  accountHolder: string;
  originTxId: string | null;
}

export interface TransferRequestDTO {
  userId: string;
  txAmount: string;
  txAmountCy: string;
  txId: string;
  txTypeId: string;
  txName: string;
  provider: string;
  txPspAmount: string;
  txPspAmountCy: string;
  fee: string;
  feeCy: string;
  txRefId: string;
  feeMode: string;
  attributes: TransferAttributes;
  originTxId: string | null;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  txId?: string;
  status?: string;
  // Add other response fields as needed
}

export class PaymentIqApiClient {
  private request: APIRequestContext;
  private config: PaymentIqApiConfig;

  constructor(request: APIRequestContext, config: PaymentIqApiConfig) {
    this.request = request;
    this.config = config;
  }

  /**
   * Send authorize request to PaymentIQ
   * This request will stay pending until the corresponding transfer request completes
   */
  async authorize(authorizeData: AuthorizeRequestDTO): Promise<PaymentResponse> {
    const url = `${this.config.baseUrl}/${this.config.brandId}/paymentiq/authorize`;
    
    // console.log('🔧 DEBUG: PaymentIQ Authorize URL:', url);
    console.log('🔧 DEBUG: PaymentIQ Authorize Request Body:', JSON.stringify(authorizeData, null, 2));

    const headers = {
      'Content-Type': 'application/json',
      // Add any required authentication headers here
    };
    console.log('🔧 DEBUG: PaymentIQ Authorize Request Headers:', JSON.stringify(headers, null, 2));

    const response = await this.request.post(url, {
      headers,
      data: authorizeData
    });

    if (!response.ok()) {
      const errorText = await response.text();
      console.log('❌ DEBUG: PaymentIQ Authorize Error Response Body:', errorText);
      throw new Error(`Failed to authorize payment: ${response.status()} - ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ DEBUG: PaymentIQ Authorize Response Status:', response.status());
    console.log('✅ DEBUG: PaymentIQ Authorize Response Body:', JSON.stringify(result, null, 2));
    
    return result;
  }

  /**
   * Send transfer request to PaymentIQ
   * This completes the pending authorize request
   */
  async transfer(transferData: TransferRequestDTO): Promise<PaymentResponse> {
    const url = `${this.config.baseUrl}/${this.config.brandId}/paymentiq/transfer`;
    
    // console.log('🔧 DEBUG: PaymentIQ Transfer URL:', url);
    console.log('🔧 DEBUG: PaymentIQ Transfer Request Body:', JSON.stringify(transferData, null, 2));

    const headers = {
      'Content-Type': 'application/json',
      // Add any required authentication headers here
    };
    console.log('🔧 DEBUG: PaymentIQ Transfer Request Headers:', JSON.stringify(headers, null, 2));

    const response = await this.request.post(url, {
      headers,
      data: transferData
    });

    if (!response.ok()) {
      const errorText = await response.text();
      console.log('❌ DEBUG: PaymentIQ Transfer Error Response Body:', errorText);
      throw new Error(`Failed to transfer payment: ${response.status()} - ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ DEBUG: PaymentIQ Transfer Response Status:', response.status());
    console.log('✅ DEBUG: PaymentIQ Transfer Response Body:', JSON.stringify(result, null, 2));
    
    return result;
  }

  /**
   * Execute a complete deposit flow (authorize + transfer)
   * This handles the two-step process for claiming deposit bonuses
   */
  async executeDepositFlow(
    authorizeData: AuthorizeRequestDTO,
    transferData: TransferRequestDTO,
    waitTime = 1000
  ): Promise<{ authorizeResponse: PaymentResponse; transferResponse: PaymentResponse }> {
    console.log('🔧 DEBUG: Starting deposit flow for txId:', authorizeData.txId);
    
    // Step 1: Send authorize request (stays pending)
    const authorizeResponse = await this.authorize(authorizeData);
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Step 2: Send transfer request (completes the flow)
    const transferResponse = await this.transfer(transferData);
    
    console.log('✅ DEBUG: Deposit flow completed for txId:', authorizeData.txId);
    
    return {
      authorizeResponse,
      transferResponse
    };
  }

  /**
   * Helper method to create authorize request data with defaults
   */
  createAuthorizeRequest(overrides: Partial<AuthorizeRequestDTO>): AuthorizeRequestDTO {
    const defaults: AuthorizeRequestDTO = {
      userId: '',
      txAmount: '50.00',
      txAmountCy: 'EUR',
      txId: '',
      txTypeId: '108',
      txName: 'CreditcardDeposit',
      provider: 'SafeCharge',
      maskedAccount: '444449******6892',
      attributes: {
        sessionId: ''
      },
      accountHolder: 'Test User',
      originTxId: null
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Helper method to create transfer request data with defaults
   */
  createTransferRequest(overrides: Partial<TransferRequestDTO>): TransferRequestDTO {
    const defaults: TransferRequestDTO = {
      userId: '',
      txAmount: '50.00',
      txAmountCy: 'EUR',
      txId: '',
      txTypeId: '108',
      txName: 'CreditcardDeposit',
      provider: 'SafeCharge',
      txPspAmount: '50.00',
      txPspAmountCy: 'EUR',
      fee: '0.00',
      feeCy: 'EUR',
      txRefId: '',
      feeMode: 'A',
      attributes: {
        bonusId: '',
        externalBonusId: '-1'
      },
      originTxId: null
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Generate a unique transaction ID
   */
  generateTxId(): string {
    const txId = Date.now().toString() + Math.floor(Math.random() * 1000);
    console.log('🔧 DEBUG: Generated txId:', txId);
    return txId;
  }

  /**
   * Generate a transaction reference ID based on txId
   */
  generateTxRefId(txId: string): string {
    return `100471006A${txId}`;
  }

  /**
   * Helper method to create a complete deposit bonus claiming flow
   * @param aleaApi - AleaApiClient to get the casino session ID from
   * @param params - Parameters for the deposit bonus claiming
   */
  async claimDepositBonus(
    aleaApi: AleaApiClient,
    params: {
      userId: string;
      profileBonusId: string;
      txAmount?: string;
      txAmountCy?: string;
      accountHolder?: string;
      waitTime?: number;
    }
  ): Promise<{ authorizeResponse: PaymentResponse; transferResponse: PaymentResponse }> {
    // Get the casino session ID from the authenticated AleaApiClient
    const sessionId = aleaApi.getCasinoSessionId();
    if (!sessionId) {
      throw new Error('No casino session ID available. Make sure AleaApiClient has an active session.');
    }

    const txId = this.generateTxId();
    const txRefId = this.generateTxRefId(txId);

    const authorizeRequest = this.createAuthorizeRequest({
      userId: params.userId,
      txAmount: params.txAmount || '50.00',
      txAmountCy: params.txAmountCy || 'EUR',
      txId,
      attributes: {
        sessionId: sessionId // Use the actual Keycloak/casino session ID
      },
      accountHolder: params.accountHolder || 'Test User'
    });

    const transferRequest = this.createTransferRequest({
      userId: params.userId,
      txAmount: params.txAmount || '50.00',
      txAmountCy: params.txAmountCy || 'EUR',
      txId,
      txPspAmount: params.txAmount || '50.00',
      txPspAmountCy: params.txAmountCy || 'EUR',
      txRefId,
      attributes: {
        bonusId: params.profileBonusId,
        externalBonusId: '-1'
      }
    });

    return this.executeDepositFlow(authorizeRequest, transferRequest, params.waitTime);
  }
}
